import Layout from "../../components/Layout/Layout";

type LeagueProps = {
  name: string;
}

export default function League({name}: LeagueProps) {
  return (
    <Layout>
      <h1>{name} league page</h1>
    </Layout>
  )
}