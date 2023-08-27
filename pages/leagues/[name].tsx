import { useEffect, useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useRouter } from "next/router";
import { useLeagueContext } from "../../context/LeagueContext";
import { useAuthContext } from "../../context/AuthContext";
import { useFetchData } from "../../hooks/useFetchData";
import { DocumentData, arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import styles from "./LeaguePage.module.css";
import LeagueHeader from "../../components/LeagueHeader/LeagueHeader";

// const week2 = {
//   game1: {
//     home: "PHI",
//     away: "MIN",
//     winner: ""
//   },
//   game2: {
//     home: "CIN",
//     away: "BAL",
//     winner: ""
//   },
//   game3: {
//     home: "DET",
//     away: "SEA",
//     winner: ""
//   },
//   game4: {
//     home: "HOU",
//     away: "IND",
//     winner: ""
//   },
//   game5: {
//     home: "TB",
//     away: "CHI",
//     winner: ""
//   },
//   game6: {
//     home: "JAX",
//     away: "KC",
//     winner: ""
//   },
//   game7: {
//     home: "ATL",
//     away: "GB",
//     winner: ""
//   },
//   game8: {
//     home: "BUF",
//     away: "LV",
//     winner: ""
//   },
//   game9: {
//     home: "TEN",
//     away: "LAC",
//     winner: ""
//   },
//   game10: {
//     home: "LAR",
//     away: "SF",
//     winner: ""
//   },
//   game11: {
//     home: "ARI",
//     away: "NYG",
//     winner: ""
//   },
//   game12: {
//     home: "DAL",
//     away: "NYJ",
//     winner: ""
//   },
//   game13: {
//     home: "DEN",
//     away: "WAS",
//     winner: ""
//   },
//   game14: {
//     home: "NE",
//     away: "MIA",
//     winner: ""
//   },
//   game15: {
//     home: "CAR",
//     away: "NO",
//     winner: ""
//   },
//   game16: {
//     home: "PIT",
//     away: "CLE",
//     winner: ""
//   }
// }

export default function League() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [leagueData, setLeagueData] = useState<DocumentData | null>(null);
  const [pickWeek, setPickWeek] = useState("");
  const [displaySection, setDisplaySection] = useState("mypicks");
  const { fetchData: getMatchups, data: matchups, error: matchupsError, isLoading: matchupsLoading} = useFetchData("matchups");
  const router = useRouter();
  const { updateSelectedLeague } = useLeagueContext();
  const { user } = useAuthContext();

  useEffect(() => {
    getMatchups();
  }, []);
  
  const weeks = matchups ? Object.keys(matchups) : [];
  
// example for how to use weekly matchups data
// weeks.forEach((week) => {
//   console.log(week, ": ", matchups[week]);
// });

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

  // const addMatchups = async () => {
  //   await setDoc(doc(db, "matchups", "week2"), week2);
  // }

  return (
    <Layout>
      {
        isLoading ? <div>fetching data</div>
        : error ? <div>{error}</div>
        :
        <>
          <h1 className={styles.pageTitle}>{leagueData?.name} page</h1>
          <section className={styles.leagueDisplay}>
            <LeagueHeader displaySection={displaySection} setDisplaySection={setDisplaySection}/>
            {!isMember && <button className={styles.joinButton} onClick={joinLeague}>Join {leagueData?.name}!</button>}

            {displaySection === "members" && <>
              <h2 className={styles.subHeader}>Members</h2>
              <ul id="members">
                {leagueData?.members.map((member) => {
                  return <li key={member.id}>{member.name}</li>
                })}
              </ul>
            </>}

            {displaySection === "mypicks" && <>
              <h2 className={styles.subHeader}>My Picks</h2>
              <label htmlFor="week-select">Choose a week:</label>
              <select name="weeks" id="week-select" value={pickWeek} onChange={(e) => setPickWeek(e.target.value)}>
                <option value="">select week</option>
                {weeks.map((week) => (
                  <option key={week} value={week}>{week}</option>
                ))}
              </select>
            </>}

            {displaySection === "leagueStats" && <>
              <h2 className={styles.subHeader}>League Stats</h2>
            </>}

            {/* <button onClick={addMatchups}>add matchups</button> */}
          </section>
        </>
      }
    </Layout>
  )
}



