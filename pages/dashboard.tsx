import { FormEvent, useState } from "react";
import { useAuthProtection } from "../hooks/useAuthProtection";
import { useAuthContext } from "../context/AuthContext";
import logOut from "../firebase/auth/signout";
import Layout from "../components/Layout";
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { db } from "../firebase/config";

import data from "../teamdata.json";
import { create } from "domain";

function Dashboard() {
    const isLoading = useAuthProtection();
    const { user } = useAuthContext();
    const [findLeagueName, setFindLeagueName] = useState('');
    const [createLeagueName, setCreateLeagueName] = useState('');

    const handleFindLeague = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("SEARCH: ", findLeagueName, "We need to check if this league exists and allow user to join");
        const docRef = doc(db, "leagues", findLeagueName);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        }
        setFindLeagueName('');
    }

    // console.log({ data })

    const handleCreateLeague = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("SEARCH: ", createLeagueName, "We need to check if this league exists, if not, create a new league");
        // Add a new document in collection "cities"
        const docRef = doc(db, "leagues", createLeagueName);
        console.log("before setting docsnap")
        const docSnap = await getDoc(docRef);
        console.log("before if statement")
        if (docSnap.exists()) {
            console.log("league already exists");
        } else {
            const newLeague = await setDoc(doc(db, "leagues", createLeagueName), {
                name: createLeagueName,
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
            console.log("NEW LEAGUE++++++++++++++++", newLeague)
        }
        setCreateLeagueName('');
    }

    // temp data for leagues
    const myLeagues = data;
    // console.log("DATA TYPE: ", myLeagues.Vikings)
    // Object.keys(myLeagues).forEach(key => console.log(key, ": ", myLeagues[key]))

    if (isLoading) {
        return <div>checking user authentication</div>
    }

    return (
        <Layout>
            <h2>{user?.displayName}'s Leagues</h2>
            {Object.keys(myLeagues).length > 0 
            ? <ul>
                {Object.keys(myLeagues).map((league) => {
                    return <li key={league} className="leagueListItem">{league}</li>
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