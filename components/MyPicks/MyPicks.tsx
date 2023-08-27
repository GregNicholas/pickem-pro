import { useState, Dispatch, SetStateAction } from "react";
import styles from "../../pages/leagues/LeaguePage.module.css";

interface MyPicksProps {
  weeks: string[];
  pickWeek: string;
  setPickWeek: Dispatch<SetStateAction<string>>;
  matchups: any;
  myPicks: any;
}

export default function MyPicks({weeks, pickWeek, setPickWeek, matchups, myPicks}: MyPicksProps) {
  console.log("MY PICKS: ", matchups)
  console.log(myPicks, pickWeek)
  return (
    <>
      <h2 className={styles.subHeader}>My Picks</h2>
      <label htmlFor="week-select">Choose a week:</label>
      <select name="weeks" id="week-select" value={pickWeek} onChange={(e) => setPickWeek(e.target.value)}>
        <option value="">select week</option>
        {weeks.map((week) => (
          <option key={week} value={week}>{week}</option>
        ))}
      </select>

{/* display user's picks for the selected week */}
      {(pickWeek && myPicks[pickWeek] && Object.keys(myPicks[pickWeek]).length > 0) && myPicks[pickWeek] && Object.keys(myPicks[pickWeek]).map((gameNo) => {
        return <p key={gameNo}>myPicks[pickWeek][gameNo]</p>
      })}

{/* show matchups to pick for selected week */}
      {(pickWeek && matchups[pickWeek] && Object.keys(matchups[pickWeek]).length > 0) && Object.keys(matchups[pickWeek]).sort().map((matchup) => {
        console.log(matchup)
        return <p key={matchup}>{matchups[pickWeek][matchup].home}</p>
      })}
    </>
  )
}