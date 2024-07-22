'use server';
import { getPool } from '@/lib/db';

export async function getHomePageData() {
    const pool = getPool();

    try {
        const [rows] = await pool.query('SELECT * FROM home_page WHERE id = 1');

        if (rows.length === 0) {
            return {
                title: '',
                description: '',
                buttons: [],
                isActive: true
            };
        }

        const { title, description, buttons, isActive } = rows[0];
        let parsedButtons = [];

        if (typeof buttons === 'string') {
            try {
                parsedButtons = JSON.parse(buttons);
            } catch (error) {
                console.error('Error parsing buttons JSON:', error);
            }
        } else {
            parsedButtons = buttons;
        }

        return {
            title,
            description,
            buttons: parsedButtons,
            isActive
        };
    } catch (error) {
        console.error(error);
        return { error: 'Failed to fetch data' };
    }
}

export async function updateHomePageData(data) {
    const pool = getPool();

    try {
        const { title, description, buttons, isActive } = data;
        const buttonsJson = JSON.stringify(buttons);

        await pool.query(
            `UPDATE home_page 
            SET title = ?, description = ?, buttons = ?, isActive = ? 
            WHERE id = 1`,
            [title, description, buttonsJson, isActive]
        );

        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: 'Failed to update data' };
    }
}

export async function deleteButton(buttonId) {
    const pool = getPool();

    try {
        await pool.query(
            `UPDATE home_page
             SET buttons = JSON_REMOVE(buttons, JSON_UNQUOTE(JSON_SEARCH(buttons, 'one', ?)))
             WHERE JSON_CONTAINS(buttons, JSON_OBJECT('id', ?), '$')`,
            [buttonId, buttonId]
        );

        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: 'Failed to delete button' };
    }
}

export async function toggleButtonVisibility(buttonId, isVisible) {
    const pool = getPool();

    try {
        await pool.query(
            `UPDATE home_page
             SET buttons = JSON_SET(buttons, 
                 CONCAT('$[', JSON_UNQUOTE(JSON_SEARCH(buttons, 'one', ?)), '].isVisible'), ?)
             WHERE JSON_CONTAINS(buttons, JSON_OBJECT('id', ?), '$')`,
            [buttonId, isVisible, buttonId]
        );

        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: 'Failed to update button visibility' };
    }
}
