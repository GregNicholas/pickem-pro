import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { useAuthContext } from "../../context/AuthContext";
import leagueStyles from "../../pages/leagues/LeaguePage.module.css";
import styles from "./MyPicks.module.css";
import MatchupsForm from "../MatchupsForm/MatchupsForm";

interface MyPicksProps {
  weeks: string[];
  matchups: any;
  fetchedPicks: any;
  leagueName: string;
}

export default function MyPicks({weeks, matchups, fetchedPicks, leagueName}: MyPicksProps) {
  const [pickWeek, setPickWeek] = useState("week01");
  const { user } = useAuthContext();

  return (
    <>
      <h2 className={leagueStyles.subHeader}>{user?.displayName}'s Picks</h2>
      <section className={styles.selectsection}>
        <label htmlFor="week-select">Choose a week:</label>
        <select name="weeks" id="week-select" value={pickWeek} onChange={(e) => setPickWeek(e.target.value)}>
          {weeks.map((week) => (
            <option key={week} value={week}>{week}</option>
          ))}
        </select>
      </section>
{/* show matchups to pick for selected week */}
      {matchups && <MatchupsForm matchups={matchups} pickWeek={pickWeek} fetchedPicks={fetchedPicks} leagueName={leagueName} />}
    </>
  )
}