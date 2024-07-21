// import NextAuth from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import { connectToDatabase } from '@/lib/db';
// import { verifyPassword } from '@/lib/auth';
//
// export const authOptions = {
//     providers: [
//         CredentialsProvider({
//             async authorize(credentials) {
//                 const connection = await connectToDatabase();
//                 const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [credentials.email]);
//
//                 if (users.length === 0) {
//                     await connection.end();
//                     throw new Error('No user found!');
//                 }
//
//                 const user = users[0];
//                 const isValid = await verifyPassword(credentials.password, user.password);
//
//                 if (!isValid) {
//                     await connection.end();
//                     throw new Error('Invalid credentials!');
//                 }
//
//                 await connection.end();
//                 return { email: user.email };
//             },
//         }),
//     ],
//     pages: {
//         signIn: '/auth/signin',
//     },
//     session: {
//         strategy: 'jwt',
//     },
// };
//
// export default NextAuth(authOptions);
