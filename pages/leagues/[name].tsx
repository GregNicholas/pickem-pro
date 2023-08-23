import { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useRouter } from "next/router";
import { useLeagueContext } from "../../context/LeagueContext";
import { useAuthContext } from "../../context/AuthContext";
import { DocumentData, doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function League() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [leagueData, setLeagueData] = useState<DocumentData | null>(null);
  const router = useRouter();
  const { selectedLeague, updateSelectedLeague } = useLeagueContext();
  const { user } = useAuthContext();

  if (!user) {
    router.push('/');
  } 

  const getLeagueInfo = async (leagueName: string) => {
    const docRef = doc(db, "leagues", leagueName);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      updateSelectedLeague(docSnap.data());
      setLeagueData(docSnap.data());
      setIsLoading(false);
    } else {
      setError("League info not found, please check url and refresh or go back to dashboard.");
      setIsLoading(false);
    }
  }

  if (!leagueData){
    getLeagueInfo(router.query?.name as string)
  }

  console.log("LEAGUE CONTEXT IN PAGE: ", selectedLeague);

  return (
    <Layout>
      {
        isLoading ? <div>fetching data</div>
        : error ? <div>{error}</div>
        :
        <>
          <h1>{leagueData?.name} page</h1>
        </>
      }
    </Layout>
  )
}
