import { useState, Dispatch, SetStateAction } from "react";
import leagueStyles from "../../pages/leagues/LeaguePage.module.css";
import styles from "./MyPicks.module.css";

interface MyPicksProps {
  weeks: string[];
  matchups: any;
  myPicks: any;
}

export default function MyPicks({weeks, matchups, myPicks}: MyPicksProps) {
  const CURRENT_TIME_IN_SECONDS = Math.floor(new Date().getTime() / 1000);
  // console.log("MY PICKS: ", myPicks)
  // console.log(matchups, pickWeek)
  const [pickWeek, setPickWeek] = useState("week01");
  const [thisWeekPicked, setThisWeekPicked] = useState(myPicks[pickWeek]);

  console.log("THIS week picks: ", thisWeekPicked);
  return (
    <>
      <h2 className={leagueStyles.subHeader}>My Picks</h2>
      <section className={styles.selectsection}>
        <label htmlFor="week-select">Choose a week:</label>
        <select name="weeks" id="week-select" value={pickWeek} onChange={(e) => setPickWeek(e.target.value)}>
          <option value="">select week</option>
          {weeks.map((week) => (
            <option key={week} value={week}>{week}</option>
          ))}
        </select>
      </section>
{/* display user's picks for the selected week */}
      {(pickWeek && myPicks[pickWeek] && Object.keys(myPicks[pickWeek]).length > 0) && myPicks[pickWeek] && Object.keys(myPicks[pickWeek]).map((gameNo) => {
        return <p key={gameNo}>myPicks[pickWeek][gameNo]</p>
      })}

{/* show matchups to pick for selected week */}
      {matchups && <div className={styles.pickscontainer}>
        {(pickWeek && matchups[pickWeek] && Object.keys(matchups[pickWeek]).length > 0) && Object.keys(matchups[pickWeek]).sort().map((matchup) => {
          // check if deadline has passed
          // (matchups[pickWeek][matchup].time.seconds > CURRENT_TIME_IN_SECONDS);
          let pickstyle = '';
          let isBlockedStyle = "blocked";
          const homeTeam = matchups[pickWeek][matchup].home;
          const awayTeam = matchups[pickWeek][matchup].away;

          // if ()

          // this is the display for each game
          return <div className={styles.gamecontainer} key={homeTeam}>
              <div className={styles.teamcontainer}>{awayTeam}</div>@
              <div className={styles.teamcontainer}>{homeTeam}</div>
            </div>
        })}
      </div>
      }
    </>
  )
}