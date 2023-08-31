import styles from "../pages/leagues/LeaguePage.module.css"
import {League} from "../types";

export default function LeagueMembers({leagueData}: {leagueData: League}) {
  const memberNames = Object.entries(leagueData.members).map(([key, data]) => {
    return <li key={data.id}>{data.name}</li>
  });
  return (
  <>
    <h2 className={styles.subHeader}>Members</h2>
    <ul className={styles.membersList} id="members">
      {memberNames}
    </ul>
  </>
  )
}