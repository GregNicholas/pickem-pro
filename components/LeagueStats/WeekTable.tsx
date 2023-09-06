import styles from "./LeagueStats.module.css";
import { Member, UsersPicks, MatchupsData, Matchup, League } from "../../types";
import Image from "next/image";

interface WeekTableProps {
  leagueData: League;
  matchups: MatchupsData;
  week: string;
}


export default function WeekTable({ leagueData, matchups, week }: WeekTableProps) { 
  const membersPicks = leagueData.members;
  const memberIds = leagueData.memberIds;
  const weekMatchups = matchups[week]
  const games = Object.keys(weekMatchups).filter((key) => key.startsWith("game")).sort();
  // console.log({membersPicks});
  // console.log({weekMatchups});
  // console.log({memberIds});

  function getWeekScores(membersPicks: {[memberId: string]: Member}, weekMatchups: Matchup) {
    const scores = [];
    Object.keys(membersPicks).forEach((memberId) => {
      let weekScore = 0;
      // one member's picks for this week
      const picks = membersPicks[memberId].picks[week];
      games.forEach(game => {
        if (weekMatchups[game].winner === picks[game]){
          weekScore++;
        }
      });
      scores.push([memberId, weekScore]);
    });

    return scores;
  }

  const weekScores = getWeekScores(membersPicks, weekMatchups).sort((a, b) => b[1] - a[1]);
  console.log(weekScores);

  return (
    <>
    <h3>{week}</h3>
    
    <div className={styles.tableContainer}>
      <table className={styles.weekTable}>
        <thead>
          <tr>
            <th></th>
            <th>score</th>
            {games.map((gameId) => (
              <th key={gameId}>
                {weekMatchups[gameId].home} @ {weekMatchups[gameId].away}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weekScores.map((memberScore) => {
            const memberName = membersPicks[memberScore[0]].name
            return (
              <tr key={memberScore[0]}>
                <th>{memberName}</th>
                <td>{memberScore[1]}</td>
                {games.map((gameId) => {
                  const pick = membersPicks[memberScore[0]].picks[week][gameId];
                  const winner = weekMatchups[gameId].winner;
                  let pickStatus = "";
                  if (winner && winner === pick) {
                    pickStatus = "correctPick";
                  } else if (winner && winner !== pick) {
                    pickStatus = "incorrectPick";
                  }
                  return (
                  <td className={styles[pickStatus]} key={gameId}>
                    {pick ? <Image src={`/images/${pick}.png`} height={33} width={33} alt={pick} />
                    : ""}
                  </td>
                )})}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
    </>
  )
}

import React from "react";

// Working through logic and data: 

  // const memberIds = Object.keys(membersPicks).map((memberId) => membersPicks[memberId].name);
  // const games = Object.keys(weekMatchups).filter((key) => key.startsWith("game"));

    // <table>
    //   <thead>
    //     <tr>
    //       <th></th>
    //       {games.map((gameId) => (
    //         <th key={gameId}>
    //           {weekMatchups[gameId].home} @ {weekMatchups[gameId].away}
    //         </th>
    //       ))}
    //     </tr>
    //   </thead>
    //   <tbody>
    //     {memberNames.map((memberName) => (
    //       <tr key={memberName}>
    //         <td>{memberName}</td>
    //         {games.map((gameId) => (
    //           <td key={gameId}>
    //             {membersPicks[memberName.toLowerCase()].picks.week01[gameId]}
    //           </td>
    //         ))}
    //       </tr>
    //     ))}
    //   </tbody>
    // </table>


