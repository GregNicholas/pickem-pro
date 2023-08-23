import "../styles/globals.css";
import { AuthContextProvider } from '../context/AuthContext';
import { LeagueProvider } from "../context/LeagueContext";

export default function App({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <LeagueProvider>
        <Component {...pageProps} />
      </LeagueProvider>
    </AuthContextProvider>
  )
}
