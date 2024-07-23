'use server';

import { getPool } from '@/lib/db';
import cheerio from 'cheerio';
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
export async function updatePageAndSvg({ pageId, svgId, content, additional }) {
    const pool = getPool();
    try {
        await pool.query(
            'UPDATE pages SET svg_id = ?, content = ?, additional = ? WHERE id = ?', 
            [svgId, content, additional, pageId]
        );
    } catch (error) {
        console.error('Error updating page and SVG:', error);
        throw error;
    }
}

export async function createPage({ title, content, additional = '', svgId = null }) {
    const pool = getPool();
    console.log('Attempting to insert page:', { title, content, additional, svgId });
    try {
        const [result] = await pool.query(
            'INSERT INTO pages (title, content, additional, svg_id) VALUES (?, ?, ?, ?)',
            [title, content, additional, svgId || null]
        );
        console.log('Insert result:', result);
        return result.insertId;
    } catch (error) {
        console.error('Ошибка создания страницы:', error);
        throw error;
    }
}

export async function getPageById(id) {
    const pool = getPool();
    const connection = await pool.getConnection();
    try {
        const [rows] = await connection.query('SELECT * FROM pages WHERE id = ?', [id]);
        if (rows.length === 0) {
            throw new Error('Page not found');
        }
        return rows[0];
    } catch (error) {
        console.error('Error fetching page by ID:', error);
        throw error;
    } finally {
        connection.release();
    }
}

export async function getAllPages() {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM pages');
    return rows;
}

export async function updatePageStatus({ pageId, active }) {
    const pool = getPool();
    try {
        await pool.query(
            'UPDATE pages SET active = ? WHERE id = ?', 
            [active ? 1 : 0, pageId] 
        );
    } catch (error) {
        console.error('Error updating page status:', error);
        throw error;
    }
}

export async function getAllPagesTable() {
    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM pages');
    return rows;
}
