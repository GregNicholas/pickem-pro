import { DocumentData, doc, getDoc } from "firebase/firestore";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { db } from "../firebase/config";
import Modal from "./Modal/Modal";
import { League } from "../types";
// import { useLeagueContext } from "../context/LeagueContext";

type FindLeagueProps = {
  myLeagues: string[]
}

export default function FindLeague({myLeagues}: FindLeagueProps) {
  const [findLeagueName, setFindLeagueName] = useState('');
  const [displayMessage, setDisplayMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [currentLeague, setCurrentLeague] = useState<any | null>(null);
  let message = '';

  // const { selectedLeague, updateSelectedLeague } = useLeagueContext();

  const handleFindLeague = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const docRef = doc(db, "leagues", findLeagueName);
    const docSnap = await getDoc(docRef);
    
    const showMessage = (message: string) => {
      setDisplayMessage(message);
      setTimeout(() => {
        setDisplayMessage('');
      }, 5000);
    }

    if (docSnap.exists()) {
      // we will display the league name and option to join
      if (myLeagues.includes(findLeagueName)) {
        console.log(docSnap.data());
        setCurrentLeague(docSnap.data());
        showMessage(`You are already in ${findLeagueName}`);
      } else {
        setCurrentLeague(docSnap.data());
        setModalMessage(`Found ${docSnap.data().name}!`);
        setIsModalOpen(true);
      }
    } else {
      // docSnap.data() will be undefined in this case
      showMessage("League does not exist");
    }
    // setFindLeagueName('');
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
        {displayMessage && <p className="errorMessage">{displayMessage}</p>}
    </form>
    {isModalOpen && <Modal setIsOpen={setIsModalOpen} message={modalMessage} leagueData={currentLeague}/>}
    </>
  )
}