import { useEffect, useState } from "react";
import { useAuthProtection } from "../hooks/useAuthProtection";
import { useAuthContext } from "../context/AuthContext";
import logOut from "../firebase/auth/signout";
import Layout from "../components/Layout/Layout";
import { query, where, collection, getDocs } from "firebase/firestore"; 
import { db } from "../firebase/config";
import styles from "./Dashboard.module.css";
import FindLeague from "../components/FindLeague";
import CreateLeague from "../components/CreateLeague";
import Link from "next/link";

function Dashboard() {
    const isLoading = useAuthProtection();
    const { user } = useAuthContext();
    const [myLeagues, setMyLeagues] = useState([]);
    const [updatingLeague, setUpdatingLeague] = useState(0);

    // const { selectedLeague, updateSelectedLeague } = useLeagueContext();

    useEffect(() => {
    // query for leagues that have current user in member id list and update state
      const getMyLeagues = async () => {
        const leaguesRef = collection(db, "leagues");
        // find my owned leagues
        const q = query(leaguesRef, where("memberIds", "array-contains", user?.uid));
        const myLeaguesData = await getDocs(q);
        const myFoundLeagues = [];
        myLeaguesData.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            myFoundLeagues.push(doc.data());
        });
        setMyLeagues(myFoundLeagues);
      }  

      if (user) {
        getMyLeagues();
      }
    }, [updatingLeague]);

    const showLeague = (leagueName: string) => {
        console.log(leagueName);
    }

    if (isLoading) {
        return <div>checking user authentication</div>
    }

    return (
        <Layout>
            <h2>{user?.displayName}'s Leagues</h2>
            {myLeagues.length > 0 
            ? <ul>
                {myLeagues.map((league) => {
                    return <li onClick={() => showLeague(league.name)} key={league.name} className={styles.leagueListItem}><Link href={`/leagues/${league.name}`}>{league.name}</Link></li>
                })}
            </ul> 
            : <p>No leagues yet</p>
            }

            <FindLeague myLeagues={myLeagues.map(league => league.name)}/>
            <CreateLeague setUpdatingLeague={setUpdatingLeague}/>

            <button onClick={() => logOut()}>Sign Out</button>
        </Layout>
    );
}

export default Dashboard;