import { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useRouter } from "next/router";
import { useLeagueContext } from "../../context/LeagueContext";
import { useAuthContext } from "../../context/AuthContext";
import { DocumentData, arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import styles from "./LeaguePage.module.css";

export default function League() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [leagueData, setLeagueData] = useState<DocumentData | null>(null);
  const router = useRouter();
  const { updateSelectedLeague } = useLeagueContext();
  const { user } = useAuthContext();

  if (!user) {
    router.push('/');
  } 
  
  let isMember = false;
  if(leagueData?.memberIds.includes(user.uid)) {
    isMember = true;
  }

  const getLeagueInfo = async (leagueName: string) => {
    const docRef = doc(db, "leagues", leagueName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      updateSelectedLeague(docSnap.data());
      setLeagueData(docSnap.data());
      setIsLoading(false);
    } else {
      setError("League info not found, please check url and refresh or go back to dashboard.");
      setIsLoading(false);
    }
  }

  if (!leagueData){
    getLeagueInfo(router.query?.name as string)
  }

  const joinLeague = async () => {
    const userLeagueData = {
      name: user.displayName, 
      id: user.uid, 
      picks: {
          week1: {},
          week2: {},
          week3: {},
          week4: {},
          week5: {},
          week6: {},
          week7: {},
          week8: {},
          week9: {},
          week10: {},
          week11: {},
          week12: {},
          week13: {},
          week14: {},
          week15: {},
          week16: {},
          week17: {},
          week18: {},
      }
    } 
    const leagueRef = doc(db, "leagues", leagueData.name);
    await updateDoc(leagueRef, {
      members: arrayUnion(userLeagueData),
      memberIds: arrayUnion(user.uid),
    });
    getLeagueInfo(router.query?.name as string);
  }

  return (
    <Layout>
      {
        isLoading ? <div>fetching data</div>
        : error ? <div>{error}</div>
        :
        <>
          <h1 className={styles.pageTitle}>{leagueData?.name} page</h1>
          {!isMember && <button className={styles.joinButton} onClick={joinLeague}>Join {leagueData?.name}!</button>}
          <h2 className={styles.subHeader}>Members</h2>
          <ul id="members">
            {leagueData?.members.map((member) => {
              return <li key={member.id}>{member.name}</li>
            })}
          </ul>
        </>
      }
    </Layout>
  )
}
