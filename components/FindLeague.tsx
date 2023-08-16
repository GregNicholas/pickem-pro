import { doc, getDoc } from "firebase/firestore";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { db } from "../firebase/config";

type FindLeagueProps = {
  findLeagueName: string;
  setFindLeagueName: Dispatch<SetStateAction<string>>;
}


export default function FindLeague() {
  const [findLeagueName, setFindLeagueName] = useState('');

  const handleFindLeague = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("SEARCH: ", findLeagueName, "We need to check if this league exists and allow user to join");
    const docRef = doc(db, "leagues", findLeagueName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
    // we will display the league name and option to join
    console.log("Document data:", docSnap.data());
    } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
    }
    setFindLeagueName('');
}

  return (
    <>
    <h3>Find a league</h3>
    <form onSubmit={handleFindLeague} className="form">
        <label htmlFor="findLeagueName">
            <p>League Name</p>
            <input onChange={(e) => setFindLeagueName(e.target.value)} required name="findLeagueName" id="findLeagueName" placeholder="enter league name" value={findLeagueName} />
        </label>
        <button type="submit">Search</button>
        {/* {error && <p className="errorMessage">{error?.message?.replace("Firebase: ", "")}</p>} */}
    </form>
    </>
  )
}