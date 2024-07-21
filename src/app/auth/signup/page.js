// src/app/auth/signup/page.js
"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

async function createUser(email, password, name) {
    const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong!");
    }

    return data;
}

function SignupPage() {
    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    const nameInputRef = useRef();
    const router = useRouter();

    async function submitHandler(event) {
        event.preventDefault();

        const enteredEmail = emailInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;
        const enteredName = nameInputRef.current.value;

        try {
            await createUser(enteredEmail, enteredPassword, enteredName);
            router.push("/");
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <section>
            <h1>Sign Up</h1>
            <form onSubmit={submitHandler}>
                <div>
                    <label htmlFor="name">Your Name</label>
                    <input type="text" id="name" required ref={nameInputRef} />
                </div>
                <div>
                    <label htmlFor="email">Your Email</label>
                    <input type="email" id="email" required ref={emailInputRef} />
                </div>
                <div>
                    <label htmlFor="password">Your Password</label>
                    <input type="password" id="password" required ref={passwordInputRef} />
                </div>
                <div>
                    <button>Create Account</button>
                </div>
            </form>
        </section>
    );
}

export default SignupPage;
