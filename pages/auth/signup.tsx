import { useState, useRef, FormEvent } from "react";
import signUp from "../../firebase/auth/signup";
import { useRouter } from 'next/navigation';
import Layout from "../../components/Layout/Layout";
import Link from "next/link";
import styles from "./Auth.module.css";

function SignUp() {
    const usernameRef = useRef<HTMLInputElement>();
    const emailRef = useRef<HTMLInputElement>();
    const passwordRef = useRef<HTMLInputElement>();
    const passwordConfirmationRef = useRef<HTMLInputElement>();
    
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleForm = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const password = passwordRef.current?.value;
        const passwordConfirm = passwordConfirmationRef.current?.value;
        const email = emailRef.current?.value;
        const username = usernameRef.current?.value;
        
        if (passwordConfirm && password) {
            if(passwordConfirm !== password) {
                return setError("Passwords do not match");
            }
        } else {
            return setError("Enter password")
        }
        
        const { result, error } = await signUp(email, password, username);

        if (error) {
            console.log(typeof error, error)
            return setError(error?.message?.replace("Firebase: ", ""));
        }

        // else successful
        return router.push("/dashboard");
    }

    return (
      <Layout>
      <div className={styles.wrapper}>
        <div className={styles.formWrapper}>
            <h1 className={styles.formHeading}>Sign up</h1>
            <form onSubmit={handleForm} className={styles.form}>
                <label htmlFor="username">
                    <p>User Name</p>
                    <input required type="text" name="username" id="username" placeholder="User Name" ref={usernameRef} />
                </label>
                <label htmlFor="email">
                    <p>Email</p>
                    <input required type="email" name="email" id="email" placeholder="example@mail.com" ref={emailRef} />
                </label>
                <label htmlFor="password">
                    <p>Password</p>
                    <input required type="password" name="password" id="password" placeholder="password" ref={passwordRef} />
                </label>
                <label htmlFor="confirmPassword">
                    <p>Confirm Password</p>
                    <input required type="password" name="password" id="passwordConfirm" placeholder="confirm password" ref={passwordConfirmationRef} />
                </label>
                <button className={styles.submitBtn} type="submit">Sign up</button>
                {error && <p className="errorMessage">{error}</p>}
            </form>
            <p>Already have an account? <Link className={styles.link} href="/auth/signin">Sign in! &#8594;</Link></p>
        </div>
      </div>
      </Layout>
    );
}

export default SignUp;