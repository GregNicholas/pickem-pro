import { useEffect, useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import leagueStyles from "../../pages/leagues/LeaguePage.module.css";
import styles from "./MyPicks.module.css";
import MatchupsForm from "../MatchupsForm/MatchupsForm";

let startWeek = "week01";

interface MyPicksProps {
  weeks: string[];
  matchups: any;
  fetchedPicks: any;
  leagueName: string;
  getLeagueInfo: (leagueName: string) => Promise<void>;
}

export default function MyPicks({
  weeks,
  matchups,
  fetchedPicks,
  leagueName,
  getLeagueInfo,
}: MyPicksProps) {
  const CURRENT_TIME_IN_SECONDS = Math.floor(new Date().getTime() / 1000);
  let curWeek = startWeek;
  for (let i = 0; i < weeks.length - 1; i++) {
    if (CURRENT_TIME_IN_SECONDS > matchups[weeks[i]].endWeek?.seconds) {
      curWeek = weeks[i + 1];
    } else {
      break;
    }
  }
  const [pickWeek, setPickWeek] = useState(curWeek);
  const { user } = useAuthContext();

  return (
    <>
      <h2 className={leagueStyles.subHeader}>{user?.displayName}'s Picks</h2>
      <section className={styles.selectsection}>
        <label htmlFor="week-select">
          <select
            className={styles.selectWeek}
            name="weeks"
            id="week-select"
            value={pickWeek}
            onChange={(e) => setPickWeek(e.target.value)}
          >
            {weeks.map((week) => (
              <option key={week} value={week}>
                {week}
              </option>
            ))}
          </select>
        </label>
      </section>
      {/* show matchups to pick for selected week */}
      {matchups && (
        <MatchupsForm
          matchups={matchups}
          pickWeek={pickWeek}
          fetchedPicks={fetchedPicks}
          leagueName={leagueName}
          getLeagueInfo={getLeagueInfo}
        />
      )}
    </>
  );
}
