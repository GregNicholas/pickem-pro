import { useState, useRef, FormEvent } from "react";
import signIn from "../../firebase/auth/signin";
import { useRouter } from 'next/navigation';
import Layout from "../../components/Layout";
import Link from "next/link";

function SignIn() {
    const emailRef = useRef<HTMLInputElement>();
    const passwordRef = useRef<HTMLInputElement>();
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleForm = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const { result, error } = await signIn(emailRef.current.value, passwordRef.current.value);

        if (error) {
            return setError(error);
        }

        // else successful
        console.log({result})
        return router.push("/dashboard")
    }
    return (
    <Layout>
        <div className="wrapper">
            <div className="form-wrapper">
                <h1 className="mt-60 mb-30">Sign in</h1>
                <form onSubmit={handleForm} className="form">
                    <label htmlFor="email">
                        <p>Email</p>
                        <input required type="email" name="email" id="email" placeholder="example@mail.com" ref={emailRef} />
                    </label>
                    <label htmlFor="password">
                        <p>Password</p>
                        <input required type="password" name="password" id="password" placeholder="password" ref={passwordRef} />
                    </label>
                    <button type="submit">Sign in</button>
                    {error && <p className="errorMessage">{error?.message?.replace("Firebase: ", "")}</p>}
                </form>
                <p>Need an account? <Link href="/auth/signup">Sign up! -{">"}</Link></p>
            </div>
        </div>
    </Layout>
    );
}

export default SignIn;