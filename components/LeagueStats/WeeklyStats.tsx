import { useState } from "react";
import { Member, UsersPicks, Matchups, League } from "../../types";
import WeekTable from "./WeekTable";
import styles from "./LeagueStats.module.css";

interface WeeklyStatsProps {
  leagueData: League;
  matchups: any;
  weeks: string[];
}

// The weeks array is mapped so that the user can select the desired week and see the table of results for that week. Default is to show the current week.

let startWeek = "week01";

export default function WeeklyStats({
  leagueData,
  matchups,
  weeks,
}: WeeklyStatsProps) {
  const CURRENT_TIME_IN_SECONDS = Math.floor(new Date().getTime() / 1000);
  let curWeek = startWeek;
  for (let i = 0; i < weeks.length - 1; i++) {
    if (CURRENT_TIME_IN_SECONDS > matchups[weeks[i]].startWeek?.seconds) {
      curWeek = weeks[i];
    } else {
      break;
    }
  }
  const [selectedWeek, setSelectedWeek] = useState(curWeek);

  return (
    <>
      <section className={styles.weekStatSelectContainer}>
        {weeks.map((week) => (
          <button
            key={week + "select"}
            onClick={() => setSelectedWeek(week)}
            className={`${styles.weekSelectBtn} ${
              week === selectedWeek && styles.selected
            }`}
            id={week}
          >
            {week}
          </button>
        ))}
      </section>
      <WeekTable
        leagueData={leagueData}
        matchups={matchups}
        week={selectedWeek}
      />
    </>
  );
}
