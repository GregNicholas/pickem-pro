import { useState } from "react";
import { Member, UsersPicks, MatchupsData } from "../../types";
import WeekTable from "./WeekTable";

interface WeeklyStatsProps {
  membersPicks: { [x: string]: Member };
  matchups: MatchupsData;
  weeks: string[];
}

export default function WeeklyStats({ membersPicks, matchups, weeks }: WeeklyStatsProps) {
  const [selectedWeek, setSelectedWeek] = useState("week01");

  // console.log(JSON.stringify(membersPicks));
  // console.log({matchups});
  // console.log({weeks});
  return (
    <>
      <p>weekly stats placeholder</p>
      <WeekTable membersPicks={membersPicks} matchups={matchups["week01"]} />
    </>
  )
}
