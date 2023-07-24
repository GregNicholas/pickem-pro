import { FormEvent, useState } from "react";
import { useAuthProtection } from "../hooks/useAuthProtection";
import { useAuthContext } from "../context/AuthContext";
import logOut from "../firebase/auth/signout";
import Layout from "../components/Layout";

function Dashboard() {
    const isLoading = useAuthProtection();
    const { user } = useAuthContext();
    const [leagueName, setLeagueName] = useState('');

    const handleFindLeague = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        console.log("SEARCH: ", leagueName, "We need to check if this league exists and allow user to join")
    }

    // temp data for leagues
    const myLeagues = ["NFL Group", "Vikings"]

    if (isLoading) {
        return <div>checking user authentication</div>
    }

    console.log(user.displayName)
    return (
        <Layout>
            <h2>{user.displayName}'s Leagues</h2>
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
                    <label htmlFor="leagueName">
                        <p>League Name</p>
                        <input onChange={(e) => setLeagueName(e.target.value)} required name="leagueName" id="leagueName" placeholder="enter league name" />
                    </label>
                    <button type="submit">Search</button>
                    {/* {error && <p className="errorMessage">{error?.message?.replace("Firebase: ", "")}</p>} */}
                </form>

            <button onClick={() => logOut()}>Sign Out</button>
        </Layout>
    );
}

export default Dashboard;