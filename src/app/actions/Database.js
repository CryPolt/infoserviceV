// app/actions/Database.js

import { getPool } from '@/lib/db';

export async function fetchDatabaseSchema() {
    const pool = getPool();
    const connection = await pool.getConnection();

    try {
        const [tables] = await connection.query('SHOW TABLES');
        if (tables.length === 0) {
            return { error: 'No tables found' };
        }

        const schema = await Promise.all(tables.map(async (table) => {
            const tableName = table[`Tables_in_${process.env.DB_NAME}`];
            const [columns] = await connection.query(`SHOW COLUMNS FROM ${tableName}`);
            return { tableName, columns };
        }));

        return { schema };
    } catch (error) {
        console.error('Error fetching database schema:', error);
        return { error: 'Internal server error' };
    } finally {
        connection.release();
    }
}
