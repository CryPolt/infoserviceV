'use server';

import { getPool } from '@/lib/db';
import cheerio from 'cheerio';

export async function fetchElementText({ svgId, elementId }) {
    const pool = getPool();
    try {
        const [texts] = await pool.query(
            'SELECT * FROM svg_element_texts WHERE svg_id = ? AND element_id = ?',
            [svgId, elementId]
        );

        if (texts.length === 0) {
            return { error: 'Text not found or element_id does not match' };
        }

        return texts[0];
    } catch (error) {
        console.error('Error fetching element text:', error);
        return { error: 'Internal Server Error' };
    }
}

export async function updateElementText({ svgId, elementId, text, additionalText }) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        await connection.query(
            'UPDATE svg_element_texts SET text = ?, additional_text = ? WHERE svg_id = ? AND element_id = ?',
            [text, additionalText, svgId, elementId]
        );

        const [result] = await connection.query(
            'SELECT ROW_COUNT() AS affectedRows'
        );

        if (result[0].affectedRows === 0) {
            return { success: false, message: 'No record found to update' };
        }

        return { success: true, message: 'Element text updated successfully' };
    } catch (error) {
        console.error('Error updating element text:', error);
        return { success: false, error: 'Internal Server Error' };
    } finally {
        connection.release();
    }
}

export async function getSvgById(id) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM svgs WHERE id = ?', [id]);
        if (rows.length === 0) {
            throw new Error('SVG not found');
        }

        const [elements] = await connection.query('SELECT * FROM svg_element_properties WHERE svg_id = ?', [id]);
        const [texts] = await connection.query('SELECT * FROM svg_element_texts WHERE svg_id = ?', [id]);

        return { ...rows[0], elements, texts };
    } catch (error) {
        console.error('Error fetching SVG:', error);
        throw error;
    } finally {
        connection.release();
    }
}

export async function getAllSvgs() {
    try {
        const pool = getPool();
        const [rows] = await pool.query('SELECT * FROM svgs');
        return rows;
    } catch (error) {
        console.error('Error fetching all SVGs:', error);
        throw error;
    }
}

export async function saveSvg({ content, pageId = null }) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [result] = await connection.query('INSERT INTO svgs (content, page_id) VALUES (?, ?)', [content, pageId]);
        const newId = result.insertId;

        const $ = cheerio.load(content, { xmlMode: true });
        const uniqueElements = new Set();
        const elementPromises = [];
        const uniqueTexts = new Map();

        $('*').each((index, element) => {
            const elementId = $(element).attr('id');
            const attributes = element.attribs;
            const text = $(element).text().trim();

            if (elementId) {
                if (!uniqueElements.has(elementId)) {
                    uniqueElements.add(elementId);

                    Object.entries(attributes).forEach(([key, value]) => {
                        if (key === 'id' && value === elementId) {
                            elementPromises.push(
                                connection.query(
                                    'INSERT IGNORE INTO svg_element_properties (svg_id, element_id, property_key, property_value) VALUES (?, ?, ?, ?)', [
                                        newId,
                                        elementId,
                                        key,
                                        value
                                    ]
                                )
                            );
                        }
                    });

                    if (text) {
                        if (!uniqueTexts.has(elementId)) {
                            uniqueTexts.set(elementId, text);
                        }
                    }
                }
            }
        });

        for (const [elementId, text] of uniqueTexts.entries()) {
            const [elementCheck] = await connection.query(
                'SELECT 1 FROM svg_element_properties WHERE svg_id = ? AND element_id = ?',
                [newId, elementId]
            );

            if (elementCheck.length > 0) {
                elementPromises.push(
                    connection.query(
                        'INSERT INTO svg_element_texts (svg_id, element_id, text, additional_text) VALUES (?, ?, ?, ?)', [
                            newId,
                            elementId,
                            text,
                            text
                        ]
                    )
                );
            } else {
                console.log(`Element with id ${elementId} not found in svg_element_properties`);
            }
        }

        await Promise.all(elementPromises);

        await connection.commit();
        return newId;
    } catch (error) {
        console.error('Failed to save SVG:', error);
        await connection.rollback();
        throw new Error('Failed to save SVG');
    } finally {
        connection.release();
    }
}

export async function synchronizeElementTexts(svgId) {
    const pool = getPool();
    const connection = await pool.getConnection();

    try {
        console.log(`Начало операции по синхронизации SVG ID: ${svgId}`);

        // Найти все element_id из svg_element_properties
        const [elementProperties] = await connection.query(
            'SELECT element_id FROM svg_element_properties WHERE svg_id = ?',
            [svgId]
        );

        console.log(`Найдены ${elementProperties.length} element_id в svg_element_properties`);

        // Найти все element_id из svg_element_texts
        const [elementTexts] = await connection.query(
            'SELECT element_id FROM svg_element_texts WHERE svg_id = ?',
            [svgId]
        );

        console.log(`Найдены ${elementTexts.length} element_id в svg_element_texts`);

        const existingElementIds = new Set(elementTexts.map(row => row.element_id));
        const newElements = [];

        for (const row of elementProperties) {
            if (!existingElementIds.has(row.element_id)) {
                newElements.push(row.element_id);
            }
        }

        console.log(`Найдено ${newElements.length} новых element_id Которые необходимо добавить в svg_element_texts`);

        if (newElements.length > 0) {
            const insertPromises = newElements.map(elementId =>
                connection.query(
                    'INSERT INTO svg_element_texts (svg_id, element_id, text, additional_text) VALUES (?, ?, ?, ?)',
                    [svgId, elementId, '', '']
                )
            );
            await Promise.all(insertPromises);
            console.log(`Добавлены ${newElements.length} новые записи в svg_element_texts`);
        } else {
            console.log('No new records to insert');
        }

        return { success: true, message: 'Element texts synchronized successfully' };
    } catch (error) {
        console.error('Error synchronizing element texts:', error);
        return { success: false, error: 'Internal Server Error' };
    } finally {
        connection.release();
    }
}

export async function updateElementAdditionalText(id, newText) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        await connection.query(
            'UPDATE svg_element_texts SET additional_text = ? WHERE id = ?',
            [newText, id]
        );

        const [result] = await connection.query('SELECT ROW_COUNT() AS affectedRows');
        if (result[0].affectedRows === 0) {
            return { success: false, message: 'No record found to update' };
        }
        return { success: true, message: 'Additional text updated successfully' };
    } catch (error) {
        console.error('Error updating additional text:', error);
        return { success: false, error: 'Internal Server Error' };
    } finally {
        connection.release();
    }
}


export async function fetchSVGElements({ svgId, page = 1, pageSize = 10 }) {
    const pool = getPool();
    try {
        const offset = (page - 1) * pageSize;
        const [rows] = await pool.query(
            'SELECT * FROM svg_element_texts WHERE svg_id = ? LIMIT ? OFFSET ?',
            [svgId, pageSize, offset]
        );
        return rows;
    } catch (error) {
        console.error('Error fetching SVG elements:', error);
        throw new Error('Internal Server Error');
    }
}

export async function getSVGElementsCount(svgId) {
    const pool = getPool();
    try {
        const [rows] = await pool.query(
            'SELECT COUNT(*) AS count FROM svg_element_texts WHERE svg_id = ?',
            [svgId]
        );
        return rows[0].count;
    } catch (error) {
        console.error('Error fetching SVG elements count:', error);
        throw new Error('Internal Server Error');
    }
}

