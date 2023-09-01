import { Dispatch } from "react";
import Image from "next/image";
import styles from "../MyPicks/MyPicks.module.css";

// const CURRENT_TIME_IN_SECONDS = Math.floor(new Date().getTime() / 1000);
const WEEKDAYS = {0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday"};

interface MatchupProps {
  matchups: any;
  usersPicks: any;
  setUsersPicks: Dispatch<any>;
  pickWeek: string;
  gameNum: string;
  handlePicked: (isBlocked: string | null, gameNum: string, team: string) => void;
  CURRENT_TIME_IN_SECONDS: number;
}

export default function Matchup({ matchups, usersPicks, setUsersPicks, pickWeek, gameNum, handlePicked, CURRENT_TIME_IN_SECONDS}: MatchupProps) {
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

    const date = new Date(matchups[pickWeek][gameNum].time.seconds * 1000);
    const weekday = WEEKDAYS[date.getDay()];
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();
    const year = date.getFullYear().toString();
    const dateDisplay =  weekday + " " + month + "/" + day + "/" + year

    // if (isBlockedStyle === "blocked" && !thisWeekPicked.hasOwnProperty(gameNum)) {
    //   console.log(thisWeekPicked.hasOwnProperty(gameNum), gameNum)
    //   setThisWeekPicked(prev => ({
    //     ...prev,
    //     [gameNum]: ""
    //   }));
    // }

    // this is the display for each game
    return (
      <div>
        <p className={styles.gameDate}>{dateDisplay}</p>
      <div className={`${styles.gamecontainer}`}>
        <div 
          className={`${styles.teamcontainer} ${styles[isBlockedStyle]} ${styles[awayPickStyle]}`}
          onClick={() => handlePicked(isBlockedStyle, gameNum, awayTeam)}
        >
          <Image src={`/images/${awayTeam}.png`} height={33} width={33} alt={awayTeam} />
          <span>{awayTeam}</span>
        </div>@
        <div 
          className={`${styles.teamcontainer} ${styles[isBlockedStyle]} ${styles[homePickStyle]}`}
          onClick={() => handlePicked(isBlockedStyle, gameNum, homeTeam)}
        >
          <Image src={`/images/${homeTeam}.png`} height={33} width={33} alt={homeTeam} />
          <span>{homeTeam}</span>
        </div>
      </div>
      </div>
    )
}