// import { useState, useEffect } from "react";
// import { useAuthContext } from "../context/AuthContext";
// import { useRouter } from "next/navigation";
import { useAuthProtection } from "../hooks/useAuthProtection";
import logOut from "../firebase/auth/signout";

function Dashboard() {
    // const { user } = useAuthContext();
    // const router = useRouter();
    
    const isLoading = useAuthProtection();
    // const [isLoading, setIsLoading] = useState(true); 

    // console.log({ user })
    // useEffect(() => {
    //     if (user == null) {
    //         router.push("/");
    //     } else {
    //         setIsLoading(false);
    //     }
    // }, [user])

    // if (isLoading) {
    //     return <div>Loading...</div>
    // }

    // if (isLoading) {
    //     return <div>Checking authentication...</div>
    // }

    return (
        <>
            <h1>You can see this if you're logged in</h1>
            <button onClick={() => logOut()}>Sign Out</button>
        </>);
}

export default Dashboard;