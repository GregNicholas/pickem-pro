import { DocumentData } from "firebase/firestore"
import styles from "../pages/leagues/LeaguePage.module.css"

export default function LeagueMembers({leagueData}: {leagueData: DocumentData}) {
  return (
  <>
    <h2 className={styles.subHeader}>Members</h2>
    <ul id="members">
      {leagueData?.members.map((member) => {
        return <li key={member.id}>{member.name}</li>
      })}
    </ul>
  </>
  )
}