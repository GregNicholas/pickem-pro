import firebase_app from "../config";
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";

const auth = getAuth(firebase_app);


export default async function signUp(email: string, password: string, userName: string): Promise<{
  result: any;
  error: any;
}> {
    let result = null,
        error = null;
    try {
        result = await createUserWithEmailAndPassword(auth, email, password);
        updateProfile(auth.currentUser, {
            displayName: userName
          }).then((res) => {
            console.log("Update Profile display Name: ", res);
          }).catch((error) => {
            error = error;
          });
    } catch (e) {
        error = e;
    }

    return { result, error };
}