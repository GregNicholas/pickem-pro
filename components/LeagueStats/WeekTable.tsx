import { Member, UsersPicks, Matchups, Matchup, League } from "../../types";
import Image from "next/image";
import styles from "./LeagueStats.module.css";

interface WeekTableProps {
  leagueData: League;
  matchups: Matchups;
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

  function getWeekScores(membersPicks: {[memberId: string]: Member}, weekMatchups) {
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
            <th>tie breaker {weekMatchups.tiebreaker}</th>
          </tr>
        </thead>
        <tbody>
          {weekScores.map((memberScore) => {
            const memberName = membersPicks[memberScore[0]].name;
            const myPicks = membersPicks[memberScore[0]].picks;
            return (
              <tr key={memberScore[0]}>
                <th>{memberName}</th>
                <td>{memberScore[1]}</td>
                {games.map((gameId) => {
                  const pick = myPicks[week][gameId];
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
                <td>{myPicks[week].tiebreaker}</td>
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


