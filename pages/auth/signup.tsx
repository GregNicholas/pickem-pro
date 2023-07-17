import { useState, FormEvent } from "react";
import signUp from "../../firebase/auth/signup";
import { useRouter } from 'next/navigation';
import Layout from "../../components/Layout";

function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleForm = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const { result, error } = await signUp(email, password, username);

        if (error) {
            return setError(error);
        }

        // else successful
        console.log("RES:", result);
        return router.push("/dashboard");
    }
const str = "stringer";
    console.log("error: ", str?.message?.replace("Firebase: ", ""));
    return (
      <Layout>
      <div className="wrapper">
        <div className="form-wrapper">
            <h1 className="mt-60 mb-30">Sign up</h1>
            <form onSubmit={handleForm} className="form">
                <label htmlFor="username">
                    <p>username</p>
                    <input onChange={(e) => setUsername(e.target.value)} required type="username" name="username" id="username" placeholder="User Name" />
                </label>
                <label htmlFor="email">
                    <p>Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} required type="email" name="email" id="email" placeholder="example@mail.com" />
                </label>
                <label htmlFor="password">
                    <p>Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} required type="password" name="password" id="password" placeholder="password" />
                </label>
                <button type="submit">Sign up</button>
                {error && <p className="errorMessage">{error?.message?.replace("Firebase: ", "")}</p>}
            </form>
        </div>
      </div>
      </Layout>
    );
}

export default SignUp;