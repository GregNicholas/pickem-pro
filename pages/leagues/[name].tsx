import { useState } from "react";
import Layout from "../../components/Layout/Layout";
import { useRouter } from "next/router";
import { useLeagueContext } from "../../context/LeagueContext";
import { useAuthContext } from "../../context/AuthContext";

export default function League() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { selectedLeague } = useLeagueContext();
  const { user } = useAuthContext();

  console.log({ selectedLeague});
  if (!user) {
    router.push('/');
  } else if (!selectedLeague) {
    router.push('/dashboard');
  } else {
    setIsLoading(false);
  }

  return (
    <Layout>
      {
        isLoading ? <div>checking user authentication</div>
        :
        <h1>{selectedLeague?.name} page</h1>
      }
    </Layout>
  )
}
