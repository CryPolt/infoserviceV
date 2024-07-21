'use server';

import { getPool } from '@/lib/db';
import cheerio from 'cheerio';

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
        const elementPromises = [];
        $('*').each((index, element) => {
            const elementId = $(element).attr('id') || `element-${index}`;
            const attributes = element.attribs;
            const text = $(element).text().trim();

            Object.entries(attributes).forEach(([key, value]) => {
                elementPromises.push(
                    connection.query('INSERT INTO svg_element_properties (svg_id, element_id, property_key, property_value) VALUES (?, ?, ?, ?)', [
                        newId,
                        elementId,
                        key,
                        value
                    ])
                );
            });

            if (text) {
                elementPromises.push(
                    connection.query('INSERT INTO svg_element_texts (svg_id, element_id, text) VALUES (?, ?, ?)', [
                        newId,
                        elementId,
                        text
                    ])
                );
            }
        });

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

export async function deleteSvg(id) {
    try {
        const pool = getPool();
        await pool.query('DELETE FROM svgs WHERE id = ?', [id]);
    } catch (error) {
        console.error('Error deleting SVG:', error);
        throw error;
    }
}

export async function getElementProperties(svgId) {
    const pool = getPool();
    try {
        const [rows] = await pool.query('SELECT * FROM svg_element_properties WHERE svg_id = ?', [svgId]);
        return rows;
    } catch (error) {
        console.error('Error fetching element properties:', error);
        throw error;
    }
}

export async function getElementTexts(id) {
    try {
        const pool = getPool();
        const [texts] = await pool.query('SELECT * FROM svg_element_texts WHERE svg_id = ?', [id]);
        return texts;
    } catch (error) {
        console.error('Error fetching element texts:', error);
        throw error;
    }
}

const getBaseUrl = () => {
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
};

export const fetchElementText = async ({ svgId, elementId }) => {
    const url = `${getBaseUrl()}/api/getElementText`;
    console.log(`Fetching URL: ${url}`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ svgId, elementId }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching element text:', error);
        throw error;
    }
};

export const updateElementText = async ({ svgId, elementId, text, additionalText }) => {
    const url = `${getBaseUrl()}/api/updateElementText`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ svgId, elementId, text, additionalText }),
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
    }
    return response.json();
};
