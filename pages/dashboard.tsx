import { FormEvent, useEffect, useState } from "react";
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
import changeUserName from "../firebase/auth/changeUserName";

function Dashboard() {
    const isLoading = useAuthProtection();
    const { user } = useAuthContext();
    const [myLeagues, setMyLeagues] = useState([]);
    const [updatingLeague, setUpdatingLeague] = useState(0);
    const [searchBy, setSearchBy] = useState("find");
    const [newUserName, setNewUserName] = useState(user?.displayName || "");

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

    if (isLoading) {
        return <div>checking user authentication</div>
    }

    const handleUpdateUserName = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await changeUserName(newUserName);
        setUpdatingLeague(prev => prev + 1);
    }

    return (
        <Layout>
          <div className={styles.dashboardContainer}>
            <h2>{user?.displayName}'s Leagues</h2>
            {myLeagues.length > 0 
            ? <ul className={styles.leagueList}>
                {myLeagues.map((league) => {
                    return <li key={league.name} className={styles.leagueListItem}><Link href={`/leagues/${league.name}`}>{league.name} &#187;</Link></li>
                })}
            </ul> 
            : <p>No leagues yet</p>
            }
            
            <div className={styles.selectContainer} >
                <button onClick={() => setSearchBy("find")} className={`minorOptionBtn ${searchBy === "find" && "selectedMinorOptionBtn"}`}>Find a league</button>
                <button onClick={() => setSearchBy("create")} className={`minorOptionBtn ${searchBy === "create" && "selectedMinorOptionBtn"}`}>Create league</button>
            </div>
            {searchBy === "find" && <FindLeague myLeagues={myLeagues.map(league => league.name)}/>}
            {searchBy === "create" && <CreateLeague setUpdatingLeague={setUpdatingLeague}/>}

            <button className={styles.signOutBtn} onClick={() => logOut()}>Sign Out</button>
          </div>
        </Layout>
    );
}

export default Dashboard;


// change username
// <form onSubmit={handleUpdateUserName} className="form">
//     <label htmlFor="findLeagueName">
//         <p>ChangeUserName</p>
//         <input onChange={(e) => setNewUserName(e.target.value)} required name="newUserName" id="newUserName" placeholder="enter new name" value={newUserName} />
//     </label>
//     <button type="submit">Change Name</button>
//     {/* {displayMessage && <p className="errorMessage">{displayMessage}</p>} */}
// </form>