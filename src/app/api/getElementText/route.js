import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function POST(req) {
    try {
        // Parse the request body
        const { svgId, elementId } = await req.json();
        
        // Get a connection pool
        const pool = getPool();
        
        // Execute the query
        const [texts] = await pool.query(
            'SELECT * FROM svg_element_texts WHERE svg_id = ? AND element_id = ?',
            [svgId, elementId]
        );

        // Extract relevant data and ensure it is serializable
        const result = texts[0] ? {
            id: texts[0].id,
            text: texts[0].text,
            additional_text: texts[0].additional_text
        } : {};

        // Return the result as JSON
        return NextResponse.json(result);
    } catch (error) {
        // Log and return an error response
        console.error('Error fetching element text:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
