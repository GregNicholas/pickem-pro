import { FormEvent, useState } from "react";
import { useAuthProtection } from "../hooks/useAuthProtection";
import { useAuthContext } from "../context/AuthContext";
import logOut from "../firebase/auth/signout";
import Layout from "../components/Layout";

function Dashboard() {
    const isLoading = useAuthProtection();
    const { user } = useAuthContext();
    const [findLeagueName, setFindLeagueName] = useState('');
    const [createLeagueName, setCreateLeagueName] = useState('');

    const handleFindLeague = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("SEARCH: ", findLeagueName, "We need to check if this league exists and allow user to join");
        setFindLeagueName('');
    }

    const handleCreateLeague = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("SEARCH: ", createLeagueName, "We need to check if this league exists, if not, create a new league");
        setCreateLeagueName('');
    }

    // temp data for leagues
    const myLeagues = ["NFL Group", "Vikings"]

    if (isLoading) {
        return <div>checking user authentication</div>
    }

    return (
        <Layout>
            <h2>{user?.displayName}'s Leagues</h2>
            {myLeagues.length > 0 
            ? <ul>
                {myLeagues.map((league) => {
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