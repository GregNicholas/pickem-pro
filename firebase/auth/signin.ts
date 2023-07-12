import firebase_app from "../config";
import { signInWithEmailAndPassword, getAuth, User } from "firebase/auth";

const auth = getAuth(firebase_app);

export default async function signIn(email: string, password: string): Promise<{
  result: User | null;
  error: any;
}> {
    let result = null,
        error = null;
    try {
        result = await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
        error = e;
    }

    return { result, error };
}