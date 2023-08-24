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
          <h2 className={styles.subHeader}>Make Picks</h2>
          <label htmlFor="week-select">Choose a week:</label>
          <select name="weeks" id="week-select">
            <option value="week1">Week 1</option>
            <option value="week2">Week 2</option>
            <option value="week3">Week 3</option>
            <option value="week4">Week 4</option>
            <option value="week5">Week 5</option>
            <option value="week6">Week 6</option>
            <option value="week7">Week 7</option>
            <option value="week8">Week 8</option>
            <option value="week9">Week 9</option>
            <option value="week10">Week 10</option>
            <option value="week11">Week 11</option>
            <option value="week12">Week 12</option>
            <option value="week13">Week 13</option>
            <option value="week14">Week 14</option>
            <option value="week15">Week 15</option>
            <option value="week16">Week 16</option>
            <option value="week17">Week 17</option>
            <option value="week18">Week 18</option>
          </select>
        </>
      }
    </Layout>
  )
}
