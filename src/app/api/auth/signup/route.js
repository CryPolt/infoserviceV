// // src/app/api/auth/signup/route.js
// import { NextRequest, NextResponse } from 'next/server';
// import { hashPassword } from '@/lib/auth';
// import { connectToDatabase } from '@/lib/db';
//
// export async function POST(request) {
//     const req = request; // Тип NextRequest
//
//     const { email, password, name } = await req.json();
//
//     if (
//         !email ||
//         !email.includes('@') ||
//         !password ||
//         password.trim().length < 7
//     ) {
//         return NextResponse.json({
//             message: 'Invalid input - password should also be at least 7 characters long.',
//         }, { status: 422 });
//     }
//
//     const client = await connectToDatabase();
//
//     const [existingUser] = await client.query('SELECT * FROM users WHERE email = ?', [email]);
//
//     if (existingUser.length > 0) {
//         await client.end();
//         return NextResponse.json({ message: 'User exists already!' }, { status: 422 });
//     }
//
//     const hashedPassword = await hashPassword(password);
//
//     await client.query('INSERT INTO users (email, password, name) VALUES (?, ?, ?)', [email, hashedPassword, name]);
//
//     await client.end();
//
//     return NextResponse.json({ message: 'Created user!' }, { status: 201 });
// }
