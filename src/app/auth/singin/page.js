// "use client"; // Указывает, что это клиентский компонент
//
// import { signIn } from "next-auth/react";
// import { useRef } from "react";
// import { useRouter } from "next/navigation";
//
// function SigninPage() {
//     const emailInputRef = useRef();
//     const passwordInputRef = useRef();
//     const router = useRouter();
//
//     async function submitHandler(event) {
//         event.preventDefault();
//
//         const enteredEmail = emailInputRef.current.value;
//         const enteredPassword = passwordInputRef.current.value;
//
//         const result = await signIn("credentials", {
//             redirect: false,
//             email: enteredEmail,
//             password: enteredPassword,
//         });
//
//         if (!result.error) {
//             router.push("/");
//         } else {
//             alert(result.error);
//         }
//     }
//
//     return (
//         <section>
//             <h1>Sign In</h1>
//             <form onSubmit={submitHandler}>
//                 <div>
//                     <label htmlFor="email">Your Email</label>
//                     <input type="email" id="email" required ref={emailInputRef} />
//                 </div>
//                 <div>
//                     <label htmlFor="password">Your Password</label>
//                     <input type="password" id="password" required ref={passwordInputRef} />
//                 </div>
//                 <div>
//                     <button>Sign In</button>
//                 </div>
//             </form>
//         </section>
//     );
// }
//
// export default SigninPage;
