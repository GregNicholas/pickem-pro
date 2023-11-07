import { useMemo, useState } from "react";
import { League, Matchups, Member, UsersPicks, Week } from "../../types";
import leagueStyles from "../../pages/leagues/LeaguePage.module.css";
import styles from "./LeagueStats.module.css";
import WeeklyStats from "./WeeklyStats";
import TotalPointsDisplay from "./TotalPointsDisplay";

interface LeagueStatsProps {
  weeks: string[];
  matchups: Matchups;
  leagueData: League;
}

export default function LeagueStats({
  weeks,
  matchups,
  leagueData,
}: LeagueStatsProps) {
  const [selectedStats, setSelectedStats] = useState("weeklystats");
  const membersData = leagueData.members;
  // the calculateStats function loops through the members data and each week's picks, comparing them to the actual results to calculate points earned. The function returns an array with each element being an object with the user's id, total points, and weekly points. This array is sorted by total points, then used to display results in order.
  const calculateStats = (
    members: { [x: string]: Member },
    matchups: { [x: string]: { [x: string]: any } },
    weeks: string[],
  ) => {
    const membersStats = [];

    console.log("calculating stats for members...")
    for (const userId in members) {
      let totalPoints = 0;
      let weekPoints = 0;
      const weeklyPoints = {};
      const userPicks = members[userId].picks;

      for (const week of weeks) {
        const weekPicks = userPicks[week];
        if (weekPicks) {
          for (const game in weekPicks) {
            if (game.includes("game")) {
              const userPick = weekPicks[game];
              const winner = matchups[week][game].winner;

              if (userPick && userPick === winner) {
                totalPoints++;
                weekPoints++;
              }
            }
          }
        }
        weeklyPoints[week] = weekPoints;
        weekPoints = 0;
      }

      const name = members[userId].name;
      membersStats.push({ userId, name, totalPoints, weeklyPoints });
    }

    membersStats.sort((a, b) => b.totalPoints - a.totalPoints);

    return membersStats;
  };

  const membersStatsArray = useMemo(() => calculateStats(leagueData.members, matchups, weeks), [leagueData.members, matchups, weeks]);

  return (
    <section className={styles.leagueStatsContainer}>
      <header>
        <h2 className={leagueStyles.subHeader}>League Stats</h2>
        <nav>
          <button
            onClick={() => setSelectedStats("weeklystats")}
            className={`${styles.leagueStatsBtn} optionButton ${
              selectedStats === "weeklystats"
                ? styles.leagueStatsBtnSelected
                : ""
            }`}
          >
            Weekly Picks
          </button>
          <button
            onClick={() => setSelectedStats("totalpoints")}
            className={`${styles.leagueStatsBtn} optionButton ${
              selectedStats === "totalpoints"
                ? styles.leagueStatsBtnSelected
                : ""
            }`}
          >
            Total Points
          </button>
        </nav>
      </header>
      {selectedStats === "weeklystats" && (
        <WeeklyStats
          leagueData={leagueData}
          matchups={matchups}
          weeks={weeks}
        />
      )}
      {selectedStats === "totalpoints" && (
        <TotalPointsDisplay
          membersStatsArray={membersStatsArray}
          weeks={weeks}
          membersData={membersData}
        />
      )}

    </section>
  );
}
