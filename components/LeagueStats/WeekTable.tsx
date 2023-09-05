
import { useState } from "react";
import { Member, UsersPicks, MatchupsData, Matchup } from "../../types";

interface WeekTableProps {
  membersPicks: { [x: string]: Member };
  matchups: { [game: string]: Matchup; };
}

export default function WeekTable({ membersPicks, matchups }: WeekTableProps) { 
  console.log({membersPicks});
  console.log({matchups})
  return (
    <p>weekly stats TABLE</p>
  )
}
