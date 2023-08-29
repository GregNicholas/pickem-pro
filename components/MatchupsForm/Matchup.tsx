import { Dispatch } from "react";
import styles from "../MyPicks/MyPicks.module.css";

const CURRENT_TIME_IN_SECONDS = Math.floor(new Date().getTime() / 1000);

interface MatchupProps {
  matchups: any;
  usersPicks: any;
  setUsersPicks: Dispatch<any>;
  pickWeek: string;
  gameNum: string;
  handlePicked: (isBlocked: string | null, gameNum: string, team: string) => void;
}

export default function Matchup({ matchups, usersPicks, setUsersPicks, pickWeek, gameNum, handlePicked}: MatchupProps) {
    let homePickStyle = "";
    let awayPickStyle = "";
    // check if deadline has passed
    const isBlockedStyle = (CURRENT_TIME_IN_SECONDS > matchups[pickWeek][gameNum].time.seconds) ? "blocked" : null;
    const homeTeam = matchups[pickWeek][gameNum].home;
    const awayTeam = matchups[pickWeek][gameNum].away;

    if (homeTeam === usersPicks[pickWeek][gameNum]) {
      homePickStyle = "picked";
    } else if (awayTeam === usersPicks[pickWeek][gameNum]){
      awayPickStyle = "picked";
    }

    // if (isBlockedStyle === "blocked" && !thisWeekPicked.hasOwnProperty(gameNum)) {
    //   console.log(thisWeekPicked.hasOwnProperty(gameNum), gameNum)
    //   setThisWeekPicked(prev => ({
    //     ...prev,
    //     [gameNum]: ""
    //   }));
    // }

    // this is the display for each game
    return (
      <div className={`${styles.gamecontainer}`}>
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
    )
}