import { useState, useEffect, ChangeEvent } from "react";
import { useAuthContext } from "../../context/AuthContext";
import styles from "../MyPicks/MyPicks.module.css";
import Matchup from "./Matchup";
import { updateDoc, arrayUnion, doc } from "firebase/firestore";
import { db } from "../../firebase/config";

const CURRENT_TIME_IN_SECONDS = Math.floor(new Date().getTime() / 1000);

interface MatchupsFormProps {
  matchups: any;
  pickWeek: string;
  fetchedPicks: any;
  leagueName: string;
}

export default function MatchupsForm({matchups, pickWeek, fetchedPicks, leagueName}: MatchupsFormProps) {
  // we only want to initialize usersPicks this way the first time rendered. Currently not using the useEffect as props will only change after submission
  const [usersPicks, setUsersPicks] = useState(fetchedPicks);
  const { user } = useAuthContext();
  const sortedGames = matchups ? Object.keys(matchups[pickWeek]).sort() : null;
  const tiebreakerGame = matchups ? matchups[pickWeek][sortedGames[sortedGames.length - 1]] : null;

  // useEffect(() => {
  //   setUsersPicks(fetchedPicks);
  // }, [fetchedPicks, pickWeek]);

  useEffect(() => {
    const updatedUsersPicks = JSON.parse(JSON.stringify(usersPicks));
    // Iterate through sortedGames and set user's pick to empty string if deadline has passed
    sortedGames.forEach((gameNum) => {
      const deadlinePassed = CURRENT_TIME_IN_SECONDS > matchups[pickWeek][gameNum].time.seconds;

      if (deadlinePassed && !usersPicks[pickWeek].hasOwnProperty(gameNum)) {
        console.log("Deadline passed, should set game empty string");
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
    console.log(e.target.value)
    setUsersPicks((prev) => ({
      ...prev,
      [pickWeek]: {
        ...prev[pickWeek],
        tiebreaker: Number(e.target.value)
    }}));
  }
console.log("THIS WEEKS PICKS: ", usersPicks[pickWeek])
  const submitPicks = async () => {
    // const picksToUpdate = JSON.parse(JSON.stringify(usersPicks));
    // picksToUpdate[pickWeek].tiebreaker = tiebreaker;
    // console.log(picksToUpdate);
    //check if thisWeekPicked has a value for each game
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

    const numGamesPicked = Object.keys(usersPicks[pickWeek]).filter(item => item.includes("game")).length;
    const numGamesInWeek = Object.keys(matchups[pickWeek]).length;

    if (numGamesPicked === numGamesInWeek) {
      console.log("SUBMITTED: ", usersPicks[pickWeek]);
      const leagueRef = doc(db, "leagues", leagueName);
      const updateField = `members.${user.uid}.picks.${pickWeek}`
      await updateDoc(leagueRef, {
        [updateField]: usersPicks[pickWeek],
      });
    } else {
      console.log("pick each game and tiebreaker");
    }
  }

  return (
    <div className={styles.pickscontainer}>
        {(pickWeek && matchups[pickWeek] && Object.keys(matchups[pickWeek]).length > 0) && sortedGames.map((gameNum) => {
          return <Matchup key={gameNum} matchups={matchups} usersPicks={usersPicks} setUsersPicks={setUsersPicks} pickWeek={pickWeek} gameNum={gameNum} handlePicked={handlePicked}/>
        })}
        <label htmlFor="tiebreaker">
          <p>Tiebreaker - Predict total points for {tiebreakerGame.away} @ {tiebreakerGame.home}: </p>
          <input type="number" onChange={handleUpdateTiebreaker} required name="tiebreaker" id="tiebreaker" value={usersPicks[pickWeek].tiebreaker || 0} />
        </label>
      <button onClick={submitPicks}>Submit</button>
      </div>
  )
}