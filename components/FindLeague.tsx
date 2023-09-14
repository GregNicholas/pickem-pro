import { DocumentData, doc, getDoc } from "firebase/firestore";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { db } from "../firebase/config";
import Modal from "./Modal/Modal";
import { League } from "../types";
import dashboardStyles from "../pages/Dashboard.module.css";
// import { useLeagueContext } from "../context/LeagueContext";

type FindLeagueProps = {
  myLeagues: string[];
};

export default function FindLeague({ myLeagues }: FindLeagueProps) {
  const [findLeagueName, setFindLeagueName] = useState("");
  const [displayMessage, setDisplayMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [currentLeague, setCurrentLeague] = useState<any | null>(null);
  let message = "";

  // const { selectedLeague, updateSelectedLeague } = useLeagueContext();

  const handleFindLeague = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const docRef = doc(db, "leagues", findLeagueName);
    const docSnap = await getDoc(docRef);

    const showMessage = (message: string) => {
      setDisplayMessage(message);
      setTimeout(() => {
        setDisplayMessage("");
      }, 5000);
    };

    if (docSnap.exists()) {
      // we will display the league name and option to open league page
      setCurrentLeague(docSnap.data());
      setModalMessage(`Found ${docSnap.data().name}!`);
      setIsModalOpen(true);
      // }
    } else {
      // docSnap.data() will be undefined in this case
      showMessage("League does not exist");
    }
    // setFindLeagueName('');
  };

  return (
    <>
      <p>Find a league:</p>
      <form onSubmit={handleFindLeague} className={dashboardStyles.simpleForm}>
        <label htmlFor="findLeagueName">
          <input
            onChange={(e) => setFindLeagueName(e.target.value)}
            required
            name="findLeagueName"
            id="findLeagueName"
            placeholder="search league name"
            value={findLeagueName}
          />
        </label>
        <button type="submit">Search</button>
      </form>
      {displayMessage && <p className="errorMessage">{displayMessage}</p>}
      {isModalOpen && (
        <Modal
          setIsOpen={setIsModalOpen}
          message={modalMessage}
          leagueData={currentLeague}
        />
      )}
    </>
  );
}
