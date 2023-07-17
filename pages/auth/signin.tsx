import {FormEvent, useState} from "react";
import signIn from "../../firebase/auth/signin";
import { useRouter } from 'next/navigation';
import Layout from "../../components/Layout";

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleForm = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const { result, error } = await signIn(email, password);

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
                        <input onChange={(e) => setEmail(e.target.value)} required type="email" name="email" id="email" placeholder="example@mail.com" />
                    </label>
                    <label htmlFor="password">
                        <p>Password</p>
                        <input onChange={(e) => setPassword(e.target.value)} required type="password" name="password" id="password" placeholder="password" />
                    </label>
                    <button type="submit">Sign in</button>
                    {error && <p className="errorMessage">{error?.message?.replace("Firebase: ", "")}</p>}
                </form>
            </div>
        </div>
    </Layout>
    );
}

export default SignIn;