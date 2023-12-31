import firebase_app from "../config";
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";

const auth = getAuth(firebase_app);


export default async function signUp(email: string, password: string, userName: string) {
    let result = null,
        error = null;
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        result = await updateProfile(auth.currentUser, {
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