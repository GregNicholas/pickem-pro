import { useMemo, useState } from "react";
import {League} from "../../types";
import leagueStyles from "../../pages/leagues/LeaguePage.module.css";
import styles from "./LeagueStats.module.css";
import { Member, UsersPicks, MatchupsData } from "../../types";
import WeeklyStats from "./WeeklyStats";

interface LeagueStatsProps {
  weeks: string[];
  matchups: MatchupsData;
  leagueData: League;
}

// {
//   usera: {
//     cumulative: number;
//     weeks: {
//       week01: number;
//       week02: number;
//     }
//   },
//   userb: {
//     cumulative: number;
//     weeks: {
//       week01: number;
//       week02: number;
//     }
//   }
// }

//or user an array and during processing of each member, create the object:
// [
//   {
//     name: usera,
//     cumulative: number;
//     weeks: {
//       week01: number;
//       week02: number;
//     }
//   },
//   {
//     name: userb,
//     cumulative: number;
//     weeks: {
//       week01: number;
//       week02: number;
//     }
//   }
// ]

// or fill out these arrays as we loop through users...
// week01 = [[uname, w1total], [uname, w1total]]
// week02 = [...]
// cum = [[uname, total], [uname, total],...]
//or objects: week01 = {uname: w1total, uname2: w1total, ...}

// GET CUMULATIVE SCORES: create function to loop through members, for each member, loop through weeks array and for each week, loop through matchups[week] and for winner of each game, compare against member[week][game] and increment thier total. push name/score values to an array. sort array by scores and use it to map data to simple table.

// USER CAN SELECT WEEK FROM DROPDOWN and see games across top with users on y axis and their picks for each game. scores to the right. We would loop through members, Grab their picks for that week and map the picks to each row of the table

export default function LeagueStats({weeks, matchups, leagueData}: LeagueStatsProps) {
  const [selectedStats, setSelectedStats] = useState("weeklystats");
  const membersData = leagueData.members;

  const calculateStats = (members: { [x: string]: Member | { picks: any; }; }, matchups: { [x: string]: { [x: string]: any; }; }, weeks: string[]) => {
    const membersStats = [];

    for (const userId in members) {
      let totalPoints = 0;
      let weekPoints = 0;
      const weeklyPoints = {};
      const userPicks = members[userId].picks;
  
      for (const week of weeks) {
        const weekPicks = userPicks[week];
        if (weekPicks) {
          for (const game in weekPicks) {
            if (game !== 'tiebreaker') {
              const userPick = weekPicks[game];
              const matchup = matchups[week][game];
  
              if (userPick === matchup.winner) {
                totalPoints++;
                weekPoints++;
              }
            }
          }
        }
        weeklyPoints[week] = weekPoints;
        weekPoints = 0;
      }
  
      membersStats.push({ userId, totalPoints, weeklyPoints });
    }
    return membersStats;
  };
  
// if this became expensive we could do useMemo possibly in the league page
  const membersStatsArray = calculateStats(leagueData.members, matchups, weeks);
  // console.log("members stats array: ", membersStatsArray);

  membersStatsArray.sort((a, b) => b.totalPoints - a.totalPoints);
  const totalPointsArray = membersStatsArray.map((member) => {
    return [membersData[member.userId].name, member.totalPoints];
  })
  // console.log("total points by user: ", totalPointsArray)

  return (
    <section className={styles.leagueStatsContainer}>
      <header>
        <h2 className={leagueStyles.subHeader}>League Stats</h2>
        <nav>
          <button onClick={() => setSelectedStats("weeklystats")} className={`${styles.leagueStatsBtn} ${selectedStats === "weeklystats" && styles.leagueStatsBtnSelected}`}>
            Weekly Stats
          </button>
          <button onClick={() => setSelectedStats("totalpoints")} className={`${styles.leagueStatsBtn} ${selectedStats === "totalpoints" && styles.leagueStatsBtnSelected}`}>
            Total Points
          </button>
          <button onClick={() => setSelectedStats("trophycase")} className={`${styles.leagueStatsBtn} ${selectedStats === "trophycase" && styles.leagueStatsBtnSelected}`}>
            Trophy Case
          </button>
        </nav>
      </header>
      {selectedStats === "weeklystats" && <WeeklyStats membersPicks={leagueData.members} matchups={matchups} weeks={weeks} />}      
      {selectedStats === "totalpoints" && <p>Total points</p>}
      {selectedStats === "trophycase" && <p>trophy case</p>}
    </section>
  )
}