import { Member } from "../../types";
import styles from "./LeagueStats.module.css";

interface MembersStats {
  name: string;
  totalPoints: number;
  userId: string;
  weeklyPoints: { [week: string]: number}
}

interface MembersStatsProps {
  membersStatsArray: MembersStats[];
  weeks: string[];
  membersData: {
    [memberId: string]: Member;
  };
}

export default function TotalPointsDisplay({membersStatsArray, weeks, membersData}: MembersStatsProps) {
  return (
    <>
    <h3 className={styles.weekHeading}>Full Season</h3>
    <div className={styles.tableContainer}>
    <table className={styles.weekTable}>
        <thead>
          <tr>
            <th></th>
            <th className={styles.pointTotal}>Total Score</th>
            {weeks.map((week) => (
              <th key={week}>
                {week}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {membersStatsArray.map((memberStats) => {
            const {userId, name, totalPoints, weeklyPoints} = memberStats;
            return (
              <tr key={userId}>
                <th><span>{name}</span></th>
                <td className={styles.pointTotal}>{totalPoints}</td>
                {weeks.map((week) => {
                  const isWeekPicked = membersData[userId].picks[week].game12 ? true : false;
                  return (
                  <td key={week+userId} className={isWeekPicked ? "" : styles.notPicked}>
                    {isWeekPicked ? weeklyPoints[week] : "X"}
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


