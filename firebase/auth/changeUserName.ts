import firebase_app from "../config";
import { getAuth, updateProfile } from "firebase/auth";

const auth = getAuth(firebase_app);

export default async function changeUserName(userName: string) {
    let result = null,
        error = null;
    try {
        result = await updateProfile(auth.currentUser, {
            displayName: userName
          }).then((res) => {
          }).catch((error) => {
            error = error;
          });
    } catch (e) {
        error = e;
    }

    return { result, error };
}