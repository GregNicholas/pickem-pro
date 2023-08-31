import { useState } from "react";
import {League} from "../../types";
import leagueStyles from "../../pages/leagues/LeaguePage.module.css";
import styles from "./LeagueStats.module.css";

interface LeagueStatsProps {
  weeks: string[];
  matchups: any;
  leagueData: League;
}

// {
//   usera: {
//     cumulative: number;
//     weeks: {
//       week01: number;
//       week02: number;
//     }
//   },
//   userb: {
//     cumulative: number;
//     weeks: {
//       week01: number;
//       week02: number;
//     }
//   }
// }

//or user an array and during processing of each member, create the object:
// [
//   {
//     name: usera,
//     cumulative: number;
//     weeks: {
//       week01: number;
//       week02: number;
//     }
//   },
//   {
//     name: userb,
//     cumulative: number;
//     weeks: {
//       week01: number;
//       week02: number;
//     }
//   }
// ]

// or fill out these arrays as we loop through users...
// week01 = [[uname, w1total], [uname, w1total]]
// week02 = [...]
// cum = [[uname, total], [uname, total],...]
//or objects: week01 = {uname: w1total, uname2: w1total, ...}

// GET CUMULATIVE SCORES: create function to loop through members, for each member, loop through weeks array and for each week, loop through matchups[week] and for winner of each game, compare against member[week][game] and increment thier total. push name/score values to an array. sort array by scores and use it to map data to simple table.

// USER CAN SELECT WEEK FROM DROPDOWN and see games across top with users on y axis and their picks for each game. scores to the right. We would loop through members, Grab their picks for that week and map the picks to each row of the table

export default function LeagueStats({weeks, matchups, leagueData}: LeagueStatsProps) {
  console.log("Matchups", {matchups}) // matchups object with weeks key, weeks have games keys
  console.log({weeks}) // array of week names "week01", etc..
  console.log("MEMBAS: ", leagueData.members) // members names and picks

  const membersData = leagueData.members;
  // array of member names
  const memberNames = Object.entries(membersData).map(([key, member]) => {
    return member.name
  });

  const memberScores = Object.entries(membersData).map(([id, member]) => {
    // const memberName = member.name;
    // console.log("FOREACH MEMBER: ", member)
    Object.entries(member.picks["week01"]).forEach(([game, picked]) => {
      if (game !== "tiebreaker") {
        console.log(game, picked)
        if(picked === matchups["week01"][game].winner) {
          console.log("add a point to week one for this player")
        }
      }
    })
    return ({ [member.name]: member.picks})
  })
  console.log("SCORES: ", memberScores)

  // const week01 =  Object.entries(membersData).forEach(([key, member]) => {
  //   console.log("ONE MEMBER", member)
  //   console.log(member.name, "Week 1 picks", member.picks["week01"])
  //   Object.entries(member.picks["week01"]).forEach(([game, picked]) => {
  //     console.log(game, "picked", picked)
  //     if(game !== "tiebreaker") {
  //       console.log(matchups["week01"][game].winner)
  //     }
  //   })
  // })

  return (
    <>
    <h2 className={leagueStyles.subHeader}>League Stats</h2>
    {/* {membersList} */}
    </>
  )
}