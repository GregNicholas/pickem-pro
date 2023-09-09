import styles from "./LeagueStats.module.css";

interface MembersStats {
  name: string;
  totalPoints: number;
  userId: string;
  weeklyPoints: { [week: string]: number}
}

interface MembersStatsProps {
  membersStatsArray: MembersStats[];
  weeks: string[]
}

export default function TotalPointsDisplay({membersStatsArray, weeks}: MembersStatsProps) {
  return (
    <>
    <h3 className={styles.weekHeading}>Full Season</h3>
    <div className={styles.tableContainer}>
    <table className={styles.weekTable}>
        <thead>
          <tr>
            <th></th>
            <th>Total Score</th>
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
                <td>{totalPoints}</td>
                {weeks.map((week) => {
                  return (
                  <td key={week+userId}>
                    {weeklyPoints[week]}
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


