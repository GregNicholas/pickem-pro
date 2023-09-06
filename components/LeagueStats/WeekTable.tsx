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

  function getWeekScores(membersPicks: {[memberId: string]: Member}, weekMatchups) {
    const scores = [];
    Object.keys(membersPicks).forEach((memberId) => {
      let weekScore = 0;
      // one member's picks for this week
      const picks = membersPicks[memberId].picks[week];
      const tiebreaker = membersPicks[memberId].picks[week].tiebreaker;
      games.forEach(game => {
        if (weekMatchups[game].winner === picks[game]){
          weekScore++;
        }
      });
      scores.push([memberId, weekScore, tiebreaker]);
    });

    return scores;
  }

  const weekScores = getWeekScores(membersPicks, weekMatchups).sort((a, b) => b[1] - a[1]);
  const highScore = weekScores[0][1];
  const leaders = weekScores.filter(score => score[1] === highScore);
  let weekWinner = "";

  if (leaders.length === 1) {
    console.log(leaders[0], "is the winner")
  } else {
    const tiebreakerLeaders = leaders.map(leader => {
      const leaderTiebreaker = leader[2];
      return [...leader, Math.abs(leaderTiebreaker - weekMatchups.tiebreaker)];
    })
  
    tiebreakerLeaders.sort((a, b) => a[3] - b[3]);
    console.log("sortedLeaders: ", tiebreakerLeaders);
  // now check tiebreakerLeaders for duplicates and return winner / winners
    const filteredLeaders = tiebreakerLeaders.filter(leader => leader[3] === tiebreakerLeaders[0][3]);
    if (filteredLeaders.length === 1) {
      console.log(filteredLeaders[0], "IS the winner by tiebreaker");
    } else {
      console.log("we have a tie");
      filteredLeaders.forEach(leader => {
        console.log(leader);
      })
    }
  }
// modify the above and display the winner
// also modify table to show picks if the matchups data has a winner
  
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