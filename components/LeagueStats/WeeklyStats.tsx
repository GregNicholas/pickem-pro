import { useState } from "react";
import { Member, UsersPicks, Matchups, League } from "../../types";
import WeekTable from "./WeekTable";
import styles from "./LeagueStats.module.css"

interface WeeklyStatsProps {
  leagueData: League;
  matchups: Matchups;
  weeks: string[];
}

// The weeks array is mapped so that the user can select the desired week and see the table of results for that week. Default is to show the current week.

let thisWeek = "week01"

export default function WeeklyStats({ leagueData, matchups, weeks }: WeeklyStatsProps) {
  const [selectedWeek, setSelectedWeek] = useState(thisWeek);

  return (
    <>
      <section className={styles.weekStatSelectContainer}>
        {weeks.map(week => (
          <button key={week+"select"} onClick={() => setSelectedWeek(week)} className={`${styles.weekSelectBtn} ${week === selectedWeek && styles.selected}`} id={week}>{week}</button>
        ))}
      </section>
      <WeekTable leagueData={leagueData} matchups={matchups} week={selectedWeek} />
    </>
  )
}
