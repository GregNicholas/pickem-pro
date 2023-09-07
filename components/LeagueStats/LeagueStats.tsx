import { useState } from "react";
import {League, Matchups, Member, UsersPicks, Week} from "../../types";
import leagueStyles from "../../pages/leagues/LeaguePage.module.css";
import styles from "./LeagueStats.module.css";
import WeeklyStats from "./WeeklyStats";


interface LeagueStatsProps {
  weeks: string[];
  matchups: Matchups;
  leagueData: League;
}

export default function LeagueStats({weeks, matchups, leagueData}: LeagueStatsProps) {
  const [selectedStats, setSelectedStats] = useState("weeklystats");
  const membersData = leagueData.members;

  // the calculateStats function loops through the members data and each week's picks, comparing them to the actual results to calculate points earned. The function returns an array with each element being an object with the user's id, total points, and weekly points. This array is sorted by total points, then used to display results in order.
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

  membersStatsArray.sort((a, b) => b.totalPoints - a.totalPoints);
  const totalPointsArray = membersStatsArray.map((member) => {
    return [membersData[member.userId].name, member.totalPoints];
  })

  return (
    <section className={styles.leagueStatsContainer}>
      <header>
        <h2 className={leagueStyles.subHeader}>League Stats</h2>
        <nav>
          <button onClick={() => setSelectedStats("weeklystats")} className={`${styles.leagueStatsBtn} ${selectedStats === "weeklystats" ? styles.leagueStatsBtnSelected : ""}`}>
            Weekly Stats
          </button>
          <button onClick={() => setSelectedStats("totalpoints")} className={`${styles.leagueStatsBtn} ${selectedStats === "totalpoints" ? styles.leagueStatsBtnSelected : ""}`}>
            Total Points
          </button>
          {/* <button onClick={() => setSelectedStats("trophycase")} className={`${styles.leagueStatsBtn} ${selectedStats === "trophycase" && styles.leagueStatsBtnSelected}`}>
            Trophy Case
          </button> */}
        </nav>
      </header>
      {selectedStats === "weeklystats" && <WeeklyStats leagueData={leagueData} matchups={matchups} weeks={weeks} />}      
      {selectedStats === "totalpoints" && <p>Total points</p>}
      {selectedStats === "trophycase" && <p>trophy case</p>}
    </section>
  )
}