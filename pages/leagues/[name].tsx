import { useEffect, useState } from "react"
import { useRouter } from "next/router";
import { useLeagueContext } from "../../context/LeagueContext";
import { useAuthContext } from "../../context/AuthContext";
import { useFetchData } from "../../hooks/useFetchData";
import { DocumentData, arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import styles from "./LeaguePage.module.css";
import Layout from "../../components/Layout/Layout";
import LeagueHeader from "../../components/LeagueHeader/LeagueHeader";
import LeagueMembers from "../../components/LeagueMembers";
import MyPicks from "../../components/MyPicks/MyPicks";

// const week01 = {
//   game01: {
//     home: "KC",
//     away: "DET",
//     winner: ""
//   },
//   game02: {
//     home: "CLE",
//     away: "CIN",
//     winner: ""
//   },
//   game03: {
//     home: "BAL",
//     away: "HOU",
//     winner: ""
//   },
//   game04: {
//     home: "MIN",
//     away: "TB",
//     winner: ""
//   },
//   game05: {
//     home: "ATL",
//     away: "CAR",
//     winner: ""
//   },
//   game06: {
//     home: "WAS",
//     away: "ARI",
//     winner: ""
//   },
//   game07: {
//     home: "IND",
//     away: "JAX",
//     winner: ""
//   },
//   game08: {
//     home: "PIT",
//     away: "SF",
//     winner: ""
//   },
//   game09: {
//     home: "NO",
//     away: "TEN",
//     winner: ""
//   },
//   game10: {
//     home: "DEN",
//     away: "LV",
//     winner: ""
//   },
//   game11: {
//     home: "NE",
//     away: "PHI",
//     winner: ""
//   },
//   game12: {
//     home: "SEA",
//     away: "LAR",
//     winner: ""
//   },
//   game13: {
//     home: "LAC",
//     away: "MIA",
//     winner: ""
//   },
//   game14: {
//     home: "CHI",
//     away: "GB",
//     winner: ""
//   },
//   game15: {
//     home: "NYG",
//     away: "DAL",
//     winner: ""
//   },
//   game16: {
//     home: "BUF",
//     away: "NYJ",
//     winner: ""
//   }
// }

export default function League() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [leagueData, setLeagueData] = useState<DocumentData | null>(null);
  const [displaySection, setDisplaySection] = useState("mypicks");
  const { fetchData: getMatchups, data: matchups, error: matchupsError, isLoading: matchupsLoading} = useFetchData("matchups");
  const router = useRouter();
  const { updateSelectedLeague } = useLeagueContext();
  const { user } = useAuthContext();

  useEffect(() => {
    getMatchups();
  }, []);
  
  const weeks = matchups ? Object.keys(matchups) : [];
  const myPicks = leagueData?.members.find((member) => member.id === user.uid)?.picks;

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
          week01: {},
          week02: {},
          week03: {},
          week04: {},
          week05: {},
          week06: {},
          week07: {},
          week08: {},
          week09: {},
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
  //   await setDoc(doc(db, "matchups", "week01"), week01);
  // }

  return (
    <Layout>
      {
        isLoading ? <div>fetching data</div>
        : error ? <div>{error}</div>
        :
        <>
          <section className={styles.leagueDisplay}>
            <h1 className={styles.pageTitle}>{leagueData?.name}</h1>
            <LeagueHeader displaySection={displaySection} setDisplaySection={setDisplaySection}/>
            {!isMember ? <>
              <button className={styles.joinButton} onClick={joinLeague}>Join {leagueData?.name}!</button>
              <LeagueMembers leagueData={leagueData} />
            </>
            : <>
            

            {displaySection === "mypicks" && <MyPicks weeks={weeks} matchups={matchups} myPicks={myPicks} />}

            {displaySection === "leagueStats" && <>
              <h2 className={styles.subHeader}>League Stats</h2>
            </>}

            {/* <button onClick={addMatchups}>add matchups</button> */}
            </>
            }

            {displaySection === "members" && <LeagueMembers leagueData={leagueData} />}
          </section>
        </>
      }
    </Layout>
  )
}



