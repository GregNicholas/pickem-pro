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
import {League} from "../../types";
import LeagueStats from "../../components/LeagueStats/LeagueStats";

const week = {
  game01: {
    home: "GB",
    away: "DET",
    winner: "",
    time: 0
  },
  game02: {
    home: "JAX",
    away: "ATL",
    winner: "",
    time: 0
  },
  game03: {
    home: "IND",
    away: "LAR",
    winner: "",
    time: 0
  },
  game04: {
    home: "CLE",
    away: "BAL",
    winner: "",
    time: 0
  },
  game05: {
    home: "CAR",
    away: "MIN",
    winner: "",
    time: 0
  },
  game06: {
    home: "TEN",
    away: "CIN",
    winner: "",
    time: 0
  },
  game07: {
    home: "NO",
    away: "TB",
    winner: "",
    time: 0
  },
  game08: {
    home: "BUF",
    away: "MIA",
    winner: "",
    time: 0
  },
  game09: {
    home: "CHI",
    away: "DEN",
    winner: "",
    time: 0
  },
  game10: {
    home: "PHI",
    away: "WAS",
    winner: "",
    time: 0
  },
  game11: {
    home: "HOU",
    away: "PIT",
    winner: "",
    time: 0
  },
  game12: {
    home: "LAC",
    away: "LV",
    winner: "",
    time: 0
  },
  game13: {
    home: "SF",
    away: "ARI",
    winner: "",
    time: 0
  },
  game14: {
    home: "DAL",
    away: "NE",
    winner: "",
    time: 0
  },
  game15: {
    home: "NYJ",
    away: "KC",
    winner: "",
    time: 0
  },
  game16: {
    home: "NYG",
    away: "SEA",
    winner: "",
    time: 0
  }
}

export default function League() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [leagueData, setLeagueData] = useState<League | null>(null);
  const [displaySection, setDisplaySection] = useState("mypicks");
  const { fetchData: getMatchups, data: matchups, error: matchupsError, isLoading: matchupsLoading} = useFetchData("matchups");
  const router = useRouter();
  const { updateSelectedLeague } = useLeagueContext();
  const { user } = useAuthContext();

  useEffect(() => {
    getMatchups();
  }, []);
  
  let weeks = matchups ? Object.keys(matchups) : [];
  const fetchedPicks = leagueData?.members[user.uid]?.picks;

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
      const fetchedData = docSnap.data() as League;
      updateSelectedLeague(docSnap.data());
      setLeagueData(fetchedData);
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
        week01: {tiebreaker: 0},
        week02: {tiebreaker: 0},
        week03: {tiebreaker: 0},
        week04: {tiebreaker: 0},
        week05: {tiebreaker: 0},
        week06: {tiebreaker: 0},
        week07: {tiebreaker: 0},
        week08: {tiebreaker: 0},
        week09: {tiebreaker: 0},
        week10: {tiebreaker: 0},
        week11: {tiebreaker: 0},
        week12: {tiebreaker: 0},
        week13: {tiebreaker: 0},
        week14: {tiebreaker: 0},
        week15: {tiebreaker: 0},
        week16: {tiebreaker: 0},
        week17: {tiebreaker: 0},
        week18: {tiebreaker: 0},
      }
    } 
    const leagueRef = doc(db, "leagues", leagueData.name);
    const updateField = `members.${user.uid}`;
    await updateDoc(leagueRef, {
      [updateField]: userLeagueData,
      "memberIds": arrayUnion(user.uid),
    });
    getLeagueInfo(router.query?.name as string);
  }

  const addMatchups = async () => {
    await setDoc(doc(db, "matchups", "week04"), week);
  }

  return (
    <Layout>
      {
        isLoading || matchupsLoading ? <div>fetching data</div>
        : error ? <div className="errorMessage">{error}</div>
        :
        <>
          <section className={styles.leagueDisplay}>
            <h1 className={styles.pageTitle}>{leagueData?.name} league</h1>
            {!isMember ? <>
              <button className={styles.joinButton} onClick={joinLeague}>Join {leagueData?.name}!</button>
              <LeagueMembers leagueData={leagueData} />
            </>
            : <>
            <LeagueHeader displaySection={displaySection} setDisplaySection={setDisplaySection}/>
            {displaySection === "mypicks" && <MyPicks weeks={weeks} matchups={matchups} fetchedPicks={fetchedPicks} leagueName={leagueData.name} getLeagueInfo={getLeagueInfo}/>}

            {displaySection === "leaguestats" && <>
              <LeagueStats weeks={weeks} matchups={matchups} leagueData={leagueData}/>
            </>}

            <button onClick={addMatchups}>add matchups</button>
            </>
            }

            {displaySection === "members" && <LeagueMembers leagueData={leagueData} />}
          </section>
        </>
      }
    </Layout>
  )
}



