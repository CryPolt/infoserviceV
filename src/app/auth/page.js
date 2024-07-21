import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]';

export default async function HomePage() {
    const session = await getServerSession(authOptions);

    return (
        <div>
            <h1>Home Page</h1>
            {!session && (
                <div>
                    <a href="/auth/signup">Sign Up</a>
                    <br />
                    <a href="/auth/signin">Sign In</a>
                </div>
            )}
            {session && (
                <div>
                    <p>Welcome, {session.user.email}</p>
                    <a href="/api/auth/signout">Sign Out</a>
                </div>
            )}
        </div>
    );
}
