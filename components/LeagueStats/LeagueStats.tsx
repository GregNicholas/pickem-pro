import { useState } from "react";
import {League} from "../../types";
import leagueStyles from "../../pages/leagues/LeaguePage.module.css";

interface LeagueStatsProps {
  weeks: string[];
  matchups: any;
  leagueData: League;
}

export default function LeagueStats({weeks, matchups, leagueData}: LeagueStatsProps) {
  console.log("Matchups", {matchups})
  console.log({weeks})
  console.log({leagueData})

  const membersList =  Object.entries(leagueData.members).map(([key, data]) => {
    console.log(data)
  })

  return (
    <>
    <h2 className={leagueStyles.subHeader}>League Stats</h2>
    {/* {membersList} */}
    </>
  )
}