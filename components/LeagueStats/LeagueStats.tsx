import { useState } from "react";
import {League} from "../../types";
import leagueStyles from "../../pages/leagues/LeaguePage.module.css";
import styles from "./LeagueStats.module.css";
import { Member, UsersPicks, MatchupsData } from "../../types";

interface LeagueStatsProps {
  weeks: string[];
  matchups: any;
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
  const [selectedStats, setSelectedStats] = useState("totalpoints");
  const membersData = leagueData.members;
  // // array of member names
  // const memberNames = Object.entries(membersData).map(([key, member]) => {
  //   return member.name
  // });

  // const memberScores = Object.entries(membersData).map(([id, member]) => {
  //   // const memberName = member.name;
  //   // console.log("FOREACH MEMBER: ", member)
  //   Object.entries(member.picks["week01"]).forEach(([game, picked]) => {
  //     if (game !== "tiebreaker") {
  //       console.log(game, picked)
  //       if(picked === matchups["week01"][game].winner) {
  //         console.log("add a point to week one for this player")
  //       }
  //     }
  //   })
  //   return ({ [member.name]: member.picks})
  // })
  // console.log("SCORES: ", memberScores)

  const calculateTotalPoints = (members: { [x: string]: Member | { picks: any; }; }, matchups: { [x: string]: { [x: string]: any; }; }, weeks: string[]) => {
    const totalPoints = [];
  
    for (const userId in members) {
      let points = 0;
      const userPicks = members[userId].picks;
  
      for (const week of weeks) {
        const weekPicks = userPicks[week];
  
        if (weekPicks) {
          for (const game in weekPicks) {
            if (game !== 'tiebreaker') {
              const userPick = weekPicks[game];
              const matchup = matchups[week][game];
  
              if (userPick === matchup.winner) {
                points++;
              }
            }
          }
        }
      }
  
      totalPoints.push({ userId, points });
    }
  
    return totalPoints;
  };
  
  const totalPointsArray = calculateTotalPoints(leagueData.members, matchups, weeks); // Array of objects [{ userId, points }]
  totalPointsArray.sort((a, b) => b.points - a.points);
totalPointsArray.forEach((member) => {
  console.log(membersData[member.userId].name, member.points);
})
  

  return (
    <section className={styles.leagueStats}>
      <header>
        <h2 className={leagueStyles.subHeader}>League Stats</h2>
        <nav>
          <button onClick={() => setSelectedStats("totalpoints")} className={styles.leagueStatsBtn}>
            Total Points
          </button>
          <button onClick={() => setSelectedStats("weeklystats")} className={styles.leagueStatsBtn}>
            Weekly Stats
          </button>
          <button onClick={() => setSelectedStats("trophycase")} className={styles.leagueStatsBtn}>
            Trophy Case
          </button>
        </nav>
      </header>
      {selectedStats === "totalpoints" && <p>Total points</p>}
      {selectedStats === "weeklystats" && <p>Weekly stats</p>}
      {selectedStats === "trophycase" && <p>trophy case</p>}
    </section>
  )
}