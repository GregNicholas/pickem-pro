import { doc, getDoc, setDoc } from "firebase/firestore";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { db } from "../firebase/config";
import { useAuthContext } from "../context/AuthContext";

type CreateLeagueProps = {
  setUpdatingLeague: Dispatch<SetStateAction<number>>;
}

export default function CreateLeague({setUpdatingLeague}: CreateLeagueProps) {
  const [createLeagueName, setCreateLeagueName] = useState('');
  const [displayMessage, setDisplayMessage] = useState('');
  const { user } = useAuthContext();

  const showMessage = (message: string) => {
    setDisplayMessage(message);
    setTimeout(() => {
      setDisplayMessage('');
    }, 5000);
  }

  const handleCreateLeague = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("SEARCH: ", createLeagueName, "We need to check if this league exists, if not, create a new league");
    // Add a new document in collection "cities"
    const docRef = doc(db, "leagues", createLeagueName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        // change to display message to user
        showMessage("league already exists");
    } else {
        await setDoc(doc(db, "leagues", createLeagueName), {
            name: createLeagueName,
            owner: user.uid,
            memberIds: [user.uid],
            members: {
              [user.uid]: { 
                  name: user.displayName, 
                  id: user.uid, 
                  picks: {
                      week01: {tiebreaker: 0},
                      week02: {tiebreaker: 0},
                      week03: {tiebreaker: 0},
                      week04: {tiebreaker: 0},
                      week05: {tiebreaker: 0},
                      week06: {tiebreaker: 0},
                      week07: {tiebreaker: 0},
                      week08: {tiebreaker: 0},
                      week09: {tiebreaker: 0},
                      week10: {tiebreaker: 0},
                      week11: {tiebreaker: 0},
                      week12: {tiebreaker: 0},
                      week13: {tiebreaker: 0},
                      week14: {tiebreaker: 0},
                      week15: {tiebreaker: 0},
                      week16: {tiebreaker: 0},
                      week17: {tiebreaker: 0},
                      week18: {tiebreaker: 0},
                  }
                }
              },
        });
        showMessage(`Created League: ${createLeagueName}`);
    }
    setCreateLeagueName('');
    setUpdatingLeague(prev => prev + 1);
}

  return (
    <>
    <h3>Create a league</h3>
    <p>Enter a name for your league here</p>
    <form onSubmit={handleCreateLeague} className="form">
        <label htmlFor="createLeagueName">
            <p>League Name</p>
            <input onChange={(e) => setCreateLeagueName(e.target.value)} required name="createLeagueName" id="createLeagueName" placeholder="enter league name" value={createLeagueName} />
        </label>
        <button type="submit">Create</button>
        {displayMessage && <p className="errorMessage">{displayMessage}</p>}
    </form>
    </>
  )
}
