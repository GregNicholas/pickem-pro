import { useState, useEffect } from "react";
import styles from "../MyPicks/MyPicks.module.css";
import Matchup from "./Matchup";

const CURRENT_TIME_IN_SECONDS = Math.floor(new Date().getTime() / 1000);

interface MatchupsFormProps {
  matchups: any;
  pickWeek: string;
  fetchedPicks: any;
}

export default function MatchupsForm({matchups, pickWeek, fetchedPicks}: MatchupsFormProps) {
  // we only want to initialize thisWeekPicked this way the first time rendered. Currently not using the useEffect as this will only change after submission
  const [usersPicks, setUsersPicks] = useState(fetchedPicks);
  const [tiebreaker, setTiebreaker] = useState<number | null>(0);
  const sortedGames = matchups ? Object.keys(matchups[pickWeek]).sort() : null;
  const tiebreakerGame = matchups ? matchups[pickWeek][sortedGames[sortedGames.length - 1]] : null;

  // useEffect(() => {
  //   setUsersPicks(fetchedPicks);
  // }, [fetchedPicks, pickWeek]);
console.log(usersPicks)
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

  const handleUpdateTiebreaker = (e: Event) => { 
    console.log(e.target.value)
    // setUsersPicks((prev) => ({
    //   ...prev,
    //   [pickWeek]: {
    //     ...prev[pickWeek],
    //     tiebreaker: e.target.value
    // }}));

  }

  const submitPicks = () => {
    // const picksToUpdate = JSON.parse(JSON.stringify(usersPicks));
    // picksToUpdate[pickWeek].tiebreaker = tiebreaker;
    // console.log(picksToUpdate);
    //check if thisWeekPicked has a value for each game
    if (Object.keys(usersPicks[pickWeek]).length - 1 === Object.keys(matchups[pickWeek]).length) {
      console.log(usersPicks[pickWeek]);
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
          <input type="number" onChange={handleUpdateTiebreaker} required name="tiebreaker" id="tiebreaker" value={tiebreaker || 0} />
        </label>
      <button onClick={submitPicks}>Submit</button>
      </div>
  )
}