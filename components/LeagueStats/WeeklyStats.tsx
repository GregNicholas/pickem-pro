import { useState } from "react";
import { Member, UsersPicks, Matchups, League } from "../../types";
import WeekTable from "./WeekTable";
import styles from "./LeagueStats.module.css"

interface WeeklyStatsProps {
  leagueData: League;
  matchups: Matchups;
  weeks: string[];
}

let thisWeek = "week01"
if(true) {
  thisWeek = "week02"
}
console.log(thisWeek);
export default function WeeklyStats({ leagueData, matchups, weeks }: WeeklyStatsProps) {
  const [selectedWeek, setSelectedWeek] = useState(thisWeek);

  return (
    <>
      <section className={styles.weekStatSelectContainer}>
        {weeks.map(week => (
          <button key={week+"select"} onClick={() => setSelectedWeek(week)} className={`${styles.weekSelectBtn} ${week === selectedWeek && styles.selected}`}>{week}</button>
        ))}
      </section>
      <WeekTable leagueData={leagueData} matchups={matchups} week={selectedWeek} />
    </>
  )
}
