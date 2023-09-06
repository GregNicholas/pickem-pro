import { useState } from "react";
import { Member, UsersPicks, MatchupsData, League } from "../../types";
import WeekTable from "./WeekTable";

interface WeeklyStatsProps {
  leagueData: League;
  matchups: MatchupsData;
  weeks: string[];
}

export default function WeeklyStats({ leagueData, matchups, weeks }: WeeklyStatsProps) {
  const [selectedWeek, setSelectedWeek] = useState("week01");

  // console.log(JSON.stringify(leagueData.membersPicks));
  // console.log({matchups});
  // console.log({weeks});

  return (
    <>
      <WeekTable leagueData={leagueData} matchups={matchups} week={"week18"} />
    </>
  )
}
