import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

export async function POST(req) {
    try {
        const { svgId, elementId, text, additionalText } = await req.json();
        
        const pool = getPool();
        
        await pool.query(
            'UPDATE svg_element_texts SET text = ?, additional_text = ? WHERE svg_id = ? AND element_id = ?',
            [text, additionalText, svgId, elementId]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating element text:', error);
        return NextResponse.json({ error: 'Failed to update element text' }, { status: 500 });
    }
}
