import Layout from "../../components/Layout/Layout";
import { useRouter } from "next/router";
import { useLeagueContext } from "../../context/LeagueContext";

export default function League() {
  const router = useRouter();
  const { selectedLeague } = useLeagueContext();
  console.log({ selectedLeague});
  if (!selectedLeague) {
    router.push('/dashboard');
  }

  return (
    <Layout>
      <h1>{selectedLeague?.name} page</h1>
    </Layout>
  )
}
