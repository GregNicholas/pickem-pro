import { useState, useRef, useEffect } from "react";
import { Member, UsersPicks, Matchups, League } from "../../types";
import WeekTable from "./WeekTable";
import styles from "./LeagueStats.module.css";

interface WeeklyStatsProps {
  leagueData: League;
  matchups: any;
  weeks: string[];
}

let startWeek = "week01";

export default function WeeklyStats({
  leagueData,
  matchups,
  weeks,
}: WeeklyStatsProps) {
  const CURRENT_TIME_IN_SECONDS = Math.floor(new Date().getTime() / 1000);
  let curWeek = startWeek;
  for (let i = 0; i < weeks.length; i++) {
    if (CURRENT_TIME_IN_SECONDS > matchups[weeks[i]].startWeek?.seconds) {
      curWeek = weeks[i];
    } else {
      break;
    }
  }
  const [selectedWeek, setSelectedWeek] = useState(curWeek);
  
  return (
    <>
      <WeekSelectors weeks={weeks} selectedWeek={selectedWeek} setSelectedWeek={setSelectedWeek} />
      <WeekTable
        leagueData={leagueData}
        matchups={matchups}
        week={selectedWeek}
      />
    </>
  );
}


function WeekSelectors({weeks, selectedWeek, setSelectedWeek}) {
  const scrollToRef = useRef<null | HTMLButtonElement>();
  // The weeks array is mapped so that the user can select the desired week 
  // and see the table of results for that week. Default is to show the current week.
  // Build horizontal scroll to select week.
  // Give current week the scrollRef so it can be in view by default in useRef
  const weekSelectors = weeks.map((week) => {
    return (
      <button
        key={week + "select"}
        ref={week === selectedWeek ? scrollToRef : null}
        onClick={() => setSelectedWeek(week)}
        className={`${styles.weekSelectBtn} ${
          week === selectedWeek && styles.selected
        }`}
        id={week}
      >
        {week}
      </button>
    )
  });

  useEffect(() => {
    if (scrollToRef.current) {
      scrollToRef.current.scrollIntoView({ behavior: "smooth", block: 'nearest', inline: 'center' });
    }
  }, []);

  return (
    <section className={styles.weekStatSelectContainer}>
      {weekSelectors}
    </section>
  )
}
