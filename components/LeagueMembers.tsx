import { DocumentData } from "firebase/firestore"
import styles from "../pages/leagues/LeaguePage.module.css"
import {League} from "../types";

// interface Member {
//   id: string;
//   name: string;
//   picks: {
//     [week: string]: any; // You can replace 'any' with the specific type if known
//   };
// }

// interface LeagueData {
//   memberIds: string[];
//   members: {
//     [memberId: string]: Member;
//   };
//   name: string;
//   owner: string;
// }

export default function LeagueMembers({leagueData}: {leagueData: League}) {
  const memberNames = Object.entries(leagueData.members).map(([key, data]) => {
    console.log(key, data)
    return <li key={data.id}>{data.name}</li>
  });
  return (
  <>
    <h2 className={styles.subHeader}>Members</h2>
    <ul id="members">
      {memberNames}
      {/* {leagueData?.members.map((member) => {
        return <li key={member.id}>{member.name}</li>
      })} */}
    </ul>
  </>
  )
}