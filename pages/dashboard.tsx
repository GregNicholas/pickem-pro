import { FormEvent, useEffect, useState } from "react";
import { useAuthProtection } from "../hooks/useAuthProtection";
import { useAuthContext } from "../context/AuthContext";
import logOut from "../firebase/auth/signout";
import Layout from "../components/Layout";
import { doc, setDoc, getDoc, query, where, collection, getDocs } from "firebase/firestore"; 
import { db } from "../firebase/config";

// import data from "../teamdata.json";
// import { create } from "domain";

function Dashboard() {
    const isLoading = useAuthProtection();
    const { user } = useAuthContext();
    const [findLeagueName, setFindLeagueName] = useState('');
    const [createLeagueName, setCreateLeagueName] = useState('');
    const [myLeagues, setMyLeagues] = useState([]);
    const [updatingLeague, setUpdatingLeague] = useState(0);

    useEffect(() => {
    // query for leagues that have current user in member id list and update state
      const getMyLeagues = async () => {
        const leaguesRef = collection(db, "leagues");
        // find my owned leagues
        // const q = query(leaguesRef, where("owner", "==", "mL5gupm506Uu7EQCG1Do8LAXVql1"));
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

    const handleFindLeague = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("SEARCH: ", findLeagueName, "We need to check if this league exists and allow user to join");
        const docRef = doc(db, "leagues", findLeagueName);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
        // we will display the league name and option to join
        console.log("Document data:", docSnap.data());
        } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        }
        setFindLeagueName('');
    }

    const handleCreateLeague = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("SEARCH: ", createLeagueName, "We need to check if this league exists, if not, create a new league");
        // Add a new document in collection "cities"
        const docRef = doc(db, "leagues", createLeagueName);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            // change to display message to user
            console.log("league already exists");
        } else {
            await setDoc(doc(db, "leagues", createLeagueName), {
                name: createLeagueName,
                owner: user.uid,
                memberIds: [user.uid],
                members: [{ 
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
                         }],
            });
        }
        setCreateLeagueName('');
        setUpdatingLeague(prev => prev + 1);
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
                    return <li key={league.name} className="leagueListItem">{league.name}</li>
                })}
            </ul> 
            : <p>No leagues yet</p>
            }

            <h3>Find a league</h3>
            <form onSubmit={handleFindLeague} className="form">
                <label htmlFor="findLeagueName">
                    <p>League Name</p>
                    <input onChange={(e) => setFindLeagueName(e.target.value)} required name="findLeagueName" id="findLeagueName" placeholder="enter league name" value={findLeagueName} />
                </label>
                <button type="submit">Search</button>
                {/* {error && <p className="errorMessage">{error?.message?.replace("Firebase: ", "")}</p>} */}
            </form>

            <h3>Create a league</h3>
            <p>Enter a name for your league here</p>
            <form onSubmit={handleCreateLeague} className="form">
                <label htmlFor="createLeagueName">
                    <p>League Name</p>
                    <input onChange={(e) => setCreateLeagueName(e.target.value)} required name="createLeagueName" id="createLeagueName" placeholder="enter league name" value={createLeagueName} />
                </label>
                <button type="submit">Search</button>
                {/* {error && <p className="errorMessage">{error?.message?.replace("Firebase: ", "")}</p>} */}
            </form>

            <button onClick={() => logOut()}>Sign Out</button>
        </Layout>
    );
}

export default Dashboard;