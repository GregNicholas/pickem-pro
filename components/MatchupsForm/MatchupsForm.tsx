import { useState, useEffect, ChangeEvent } from "react";
import { useAuthContext } from "../../context/AuthContext";
import pickstyles from "../MyPicks/MyPicks.module.css";
import styles from "./MatchupsForm.module.css";
import Matchup from "./Matchup";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";

interface MatchupsFormProps {
  matchups: any;
  pickWeek: string;
  fetchedPicks: any;
  leagueName: string;
  getLeagueInfo: (leagueName: string) => Promise<void>;
}

export default function MatchupsForm({matchups, pickWeek, fetchedPicks, leagueName, getLeagueInfo}: MatchupsFormProps) {
  // we only want to initialize usersPicks this way the first time rendered. Currently not using the useEffect as props will only change after submission
  const [usersPicks, setUsersPicks] = useState(fetchedPicks);
  const [displayMessage, setDisplayMessage] = useState('');
  const { user } = useAuthContext();
  let sortedGames = matchups ? Object.keys(matchups[pickWeek]).sort() : null;
  sortedGames = sortedGames.filter(game => game !== "tiebreaker")

  const tiebreakerGame = matchups ? matchups[pickWeek][sortedGames[sortedGames.length - 1]] : null;

  const CURRENT_TIME_IN_SECONDS = Math.floor(new Date().getTime() / 1000);
  const isTiebreakerLocked = (CURRENT_TIME_IN_SECONDS > tiebreakerGame.time.seconds) ? true : false;

  useEffect(() => {
    const updatedUsersPicks = JSON.parse(JSON.stringify(usersPicks));
    // Iterate through sortedGames and set user's pick to empty string if deadline has passed
    sortedGames.forEach((gameNum) => {
      // if deadline for game has passed and user hasn't made pick, set it to empty string
      const deadlinePassed = CURRENT_TIME_IN_SECONDS > matchups[pickWeek][gameNum].time.seconds;
      if (deadlinePassed && !usersPicks[pickWeek].hasOwnProperty(gameNum)) {
        updatedUsersPicks[pickWeek][gameNum] = "";
      }
    });

    // Update the state after processing
    setUsersPicks(updatedUsersPicks);
  }, [pickWeek]);

  const handlePicked = (isBlocked: string | null, gameNum: string, team: string) => {
    if (!isBlocked && usersPicks[pickWeek][gameNum] !== team) {
      setUsersPicks((prev) => ({
        ...prev,
        [pickWeek]: {
          ...prev[pickWeek],
          [gameNum]: team
        }
      }));
    }
  }

  const handleUpdateTiebreaker = (e: ChangeEvent<HTMLInputElement>) => { 
    setUsersPicks((prev) => ({
      ...prev,
      [pickWeek]: {
        ...prev[pickWeek],
        tiebreaker: Number(e.target.value)
    }}));
  }

  const submitPicks = async () => {
    if (isTiebreakerLocked) { 
      return showMessage("Picks are locked for this week.")
    }

    if (!usersPicks[pickWeek].tiebreaker) {
      usersPicks[pickWeek].tiebreaker = 0;
      setUsersPicks(prev => {
        return {
          ...prev,
          [pickWeek]: {
            ...prev[pickWeek],
            tiebreaker: 0
          }
        }
      })
    }

    function showMessage(message: string) {
      setDisplayMessage(message);
      setTimeout(() => {
        setDisplayMessage('');
      }, 3000);
    }

    const numGamesPicked = Object.keys(usersPicks[pickWeek]).filter(item => item.includes("game")).length;
    const numGamesInWeek = sortedGames.length;

    if (numGamesPicked === numGamesInWeek) {
      const leagueRef = doc(db, "leagues", leagueName);
      const updateField = `members.${user.uid}.picks.${pickWeek}`
      await updateDoc(leagueRef, {
        [updateField]: usersPicks[pickWeek],
      });
      await getLeagueInfo(leagueName);
      showMessage("SUBMITTED PICKS!")
    } else {
      showMessage("pick each game and tiebreaker");
    }
  }

  return (
    <div className={pickstyles.pickscontainer}>
        {(pickWeek && matchups[pickWeek] && Object.keys(matchups[pickWeek]).length > 0) && sortedGames.map((gameNum) => {
          return <Matchup key={gameNum} matchups={matchups} usersPicks={usersPicks} setUsersPicks={setUsersPicks} pickWeek={pickWeek} gameNum={gameNum} handlePicked={handlePicked} CURRENT_TIME_IN_SECONDS={CURRENT_TIME_IN_SECONDS} />
        })}
        <label className={styles.center} htmlFor="tiebreaker">
          <p className={`${styles.formLabel} ${styles.bold}`}><span className={styles.bold}>Tiebreaker</span> - Predict total points for {tiebreakerGame.away} @ {tiebreakerGame.home}: </p>
          <input 
            className={styles.tieInput} 
            type="number" 
            onChange={handleUpdateTiebreaker} 
            required 
            name="tiebreaker" 
            id="tiebreaker" 
            value={usersPicks[pickWeek].tiebreaker.toString() || 0} 
            disabled={isTiebreakerLocked} 
          />
        </label>
      {displayMessage && <p className="errorMessage">{displayMessage}</p>}
      <button className={styles.submitBtn} onClick={submitPicks}>Submit</button>
      </div>
  )
}