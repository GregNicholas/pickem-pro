import { Member, UsersPicks, Matchups, Matchup, League } from "../../types";
import Image from "next/image";
import styles from "./LeagueStats.module.css";

interface WeekTableProps {
  leagueData: League;
  matchups: Matchups;
  week: string;
}

// This component shows a table with games across top with member names on y axis with a row of their picks for each game. Total score for week is shown next to each member's.
// We loop through members, Grab their picks for that week and map the picks to each row of the table.
// Picks are shown on the condition that the game results are known
// Conditional styling is used to show correct picks and the winner for the week. In the event of a tie, the winner is calculated based on the tiebreaker

export default function WeekTable({
  leagueData,
  matchups,
  week,
}: WeekTableProps) {
  const membersPicks = leagueData.members;
  const memberIds = leagueData.memberIds;
  const weekMatchups = matchups[week];
  const games = Object.keys(weekMatchups)
    .filter((key) => key.startsWith("game"))
    .sort();

  function getMembersScores(
    membersPicks: { [memberId: string]: Member },
    weekMatchups,
  ) {
    const scores = [];
    Object.keys(membersPicks).forEach((memberId) => {
      let weekScore = 0;
      // one member's picks for this week
      const picks = membersPicks[memberId].picks[week];
      const tiebreaker = membersPicks[memberId].picks[week].tiebreaker;
      games.forEach((game) => {
        if (weekMatchups[game].winner && weekMatchups[game].winner === picks[game]) {
          weekScore++;
        }
      });
      scores.push([memberId, weekScore, tiebreaker]);
    });

    return scores;
  }

  function getWeekResults(): {
    membersWeekScores: any[];
    highScore: any;
    weekWinner: string;
    winnerMessage: string;
  } {

    // message to be displayed when results are in
    let weekWinner = "";
    let winnerMessage = "";

    // sort the array of members' scores save array of top score(s)
    const membersWeekScores = getMembersScores(membersPicks, weekMatchups).sort(
      (a, b) => b[1] - a[1],
    );
    const highScore = membersWeekScores[0][1];
    const leaders = membersWeekScores.filter((score) => score[1] === highScore);

    if (games.every((game) => weekMatchups[game].winner)) {
      if (leaders.length === 1) {
        weekWinner = membersPicks[leaders[0][0]].name;
        winnerMessage = ` wins ${week} with ${leaders[0][1]} correct picks!`;
      } else {
        const tiebreakerLeaders = leaders.map((leader) => {
          const leaderTiebreaker = leader[2];
          return [
            ...leader,
            Math.abs(leaderTiebreaker - weekMatchups.tiebreaker),
          ];
        });

        // sort by tiebreaker, check tiebreakerLeaders for duplicates, and set winner and message
        tiebreakerLeaders.sort((a, b) => a[3] - b[3]);
        const filteredLeaders = tiebreakerLeaders.filter(
          (leader) => leader[3] === tiebreakerLeaders[0][3],
        );
        if (filteredLeaders.length === 1) {
          weekWinner = membersPicks[filteredLeaders[0][0]].name;
          winnerMessage = ` wins ${week} with ${leaders[0][1]} correct picks! Tiebreaker predicted within ${filteredLeaders[0][3]} points!`;
        } else {
          winnerMessage = `have tied with ${leaders[0][1]} correct picks! They predicted the tiebreaker within ${filteredLeaders[0][3]} points!`;
          filteredLeaders.forEach((leader) => {
            weekWinner += membersPicks[leader[0]].name + ", ";
          });
        }
      }
    }
    return { membersWeekScores, highScore, weekWinner, winnerMessage };
  }

  const thisWeekResults = getWeekResults();
  const { membersWeekScores, highScore, weekWinner, winnerMessage } = thisWeekResults;

  return (
    <>
      <h3 className={styles.weekHeading}>{week}</h3>
      {weekWinner && (
        <p className={styles.winnerMessage}>
          <span className={styles.winnerName}>{weekWinner}</span>{" "}
          {winnerMessage}
        </p>
      )}
      <div className={styles.tableContainer}>
        <table className={styles.weekTable}>
          <thead>
            <tr>
              <th></th>
              <th>score</th>
              {games.map((gameId) => (
                <th key={gameId}>
                  {weekMatchups[gameId].away} @ {weekMatchups[gameId].home}
                </th>
              ))}
              <th>tie breaker {weekMatchups.tiebreaker}</th>
            </tr>
          </thead>
          <tbody>
            {membersWeekScores.map((memberScore) => {
              const memberName = membersPicks[memberScore[0]].name;
              const myPicks = membersPicks[memberScore[0]].picks;
              return (
                <tr key={memberScore[0]}>
                  <th
                    className={
                      memberScore[1] === highScore &&
                      weekWinner.includes(memberName)
                        ? styles.winnerCell
                        : ""
                    }
                  >
                    <span>{memberName}</span>
                  </th>
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
                      <td
                        className={styles[pickStatus] ? styles[pickStatus] : ""}
                        key={gameId}
                      >
                        {/* only show picks that are made if the results are in for that game */}
                        {pick && winner ? (
                          <Image
                            src={`/images/${pick}.png`}
                            height={33}
                            width={33}
                            alt={pick}
                          />
                        ) : (
                          ""
                        )}
                      </td>
                    );
                  })}
                  <td>
                    {weekMatchups.tiebreaker ? myPicks[week].tiebreaker : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

import React from "react";
