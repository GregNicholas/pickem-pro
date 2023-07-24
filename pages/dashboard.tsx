import { useAuthProtection } from "../hooks/useAuthProtection";
import { useAuthContext } from "../context/AuthContext";
import logOut from "../firebase/auth/signout";
import Layout from "../components/Layout";

function Dashboard() {
    const isLoading = useAuthProtection();
    const { user } = useAuthContext();

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
            
            <button onClick={() => logOut()}>Sign Out</button>
        </Layout>
    );
}

export default Dashboard;