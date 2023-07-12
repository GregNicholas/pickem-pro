import { useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useRouter } from "next/navigation";
function Dashboard() {
    const { user } = useAuthContext()
    const router = useRouter()
    console.log({ user })
    useEffect(() => {
        if (user == null) router.push("/")
    }, [user])

    return (<h1>Only logged in users can view this Dashboard page</h1>);
}

export default Dashboard;