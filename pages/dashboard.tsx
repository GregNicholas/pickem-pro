import { useAuthProtection } from "../hooks/useAuthProtection";
import logOut from "../firebase/auth/signout";
import Layout from "../components/Layout";

function Dashboard() {
    const isLoading = useAuthProtection();

    if (isLoading) {
        return <div>checking user authentication</div>
    }

    return (
        <Layout>
            <h1>You can see this if you're logged in</h1>
            <button onClick={() => logOut()}>Sign Out</button>
        </Layout>
    );
}

export default Dashboard;