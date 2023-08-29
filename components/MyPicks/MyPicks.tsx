import { useState, Dispatch, SetStateAction } from "react";
import { useAuthContext } from "../../context/AuthContext";
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
  console.log("MIDDLEPICK WEEK", pickWeek);
  const [thisWeekPicked, setThisWeekPicked] = useState(myPicks[pickWeek]);
  const { user } = useAuthContext();
  console.log("THIS week picks: ", thisWeekPicked);
  console.log("MY PICKS: ", myPicks[pickWeek]);

  const handlePicked = (isBlocked: string | null, gameNum: string, team: string) => {

    if (!isBlocked && thisWeekPicked[gameNum] !== team) {
      setThisWeekPicked((prev: { [x: string]: string; }) => ({
        ...prev,
        [gameNum]: team
      }));
    }
  }

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
{/* display user's picks for the selected week */}
      {/* {(pickWeek && myPicks[pickWeek] && Object.keys(myPicks[pickWeek]).length > 0) && myPicks[pickWeek] && Object.keys(myPicks[pickWeek]).map((gameNum) => {
        return <p key={gameNum}>myPicks[pickWeek][gameNum]</p>
      })} */}

{/* show matchups to pick for selected week */}
      {matchups && <div className={styles.pickscontainer}>
        {(pickWeek && matchups[pickWeek] && Object.keys(matchups[pickWeek]).length > 0) && Object.keys(matchups[pickWeek]).sort().map((gameNum) => {
          let homePickStyle = "";
          let awayPickStyle = "";
          // check if deadline has passed
          const isBlockedStyle = (CURRENT_TIME_IN_SECONDS > matchups[pickWeek][gameNum].time.seconds) ? "blocked" : null;
          const homeTeam = matchups[pickWeek][gameNum].home;
          const awayTeam = matchups[pickWeek][gameNum].away;

          if (homeTeam === thisWeekPicked[gameNum]) {
            homePickStyle = "picked";
          } else if (awayTeam === thisWeekPicked[gameNum]){
            awayPickStyle = "picked";
          }

          if (isBlockedStyle === "blocked" && !thisWeekPicked.hasOwnProperty(gameNum)) {
            console.log(thisWeekPicked.hasOwnProperty(gameNum), gameNum)
            setThisWeekPicked(prev => ({
              ...prev,
              [gameNum]: ""
            }));
          }

          // this is the display for each game
          return <div className={`${styles.gamecontainer}`} key={homeTeam}>
              <div 
                className={`${styles.teamcontainer} ${styles[isBlockedStyle]} ${styles[awayPickStyle]}`}
                onClick={() => handlePicked(isBlockedStyle, gameNum, awayTeam)}
              >
                {awayTeam}
              </div>@
              <div 
                className={`${styles.teamcontainer} ${styles[isBlockedStyle]} ${styles[homePickStyle]}`}
                onClick={() => handlePicked(isBlockedStyle, gameNum, homeTeam)}
              >
                {homeTeam}
              </div>
            </div>
        })}
      </div>
      }
    </>
  )
}