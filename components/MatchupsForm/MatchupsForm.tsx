import { useState, useEffect, ChangeEvent } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useLeagueContext } from "../../context/LeagueContext";
import pickstyles from "../MyPicks/MyPicks.module.css";
import styles from "./MatchupsForm.module.css";
import Matchup from "./Matchup";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase/config";

interface MatchupsFormProps {
  matchups: any;
  pickWeek: string;
  fetchedPicks: any;
  leagueName: string;
  getLeagueInfo: (leagueName: string) => Promise<void>;
}

export default function MatchupsForm({
  matchups,
  pickWeek,
  fetchedPicks,
  leagueName,
  getLeagueInfo,
}: MatchupsFormProps) {
  const [usersPicks, setUsersPicks] = useState(fetchedPicks);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { user } = useAuthContext();
  let sortedGames = matchups ? Object.keys(matchups[pickWeek]).sort() : null;
  sortedGames = sortedGames.filter((game) => {
    return game.includes("game");
  });
  const MNFGame = matchups ? sortedGames.filter(game => matchups[pickWeek][game].MNF)[0] : null;
  sortedGames.sort((a, b) => {
    if (!matchups[pickWeek][b].MNF) {
      if (a > b) {
        return 1;
      }
      return 0;
    }
    return -1;
  });
  // const leagueContextData = useLeagueContext();
  // console.log("League context data: ", leagueContextData.selectedLeague)
let tiebreakerGame = null;
if (matchups) {
  if (MNFGame) {
    tiebreakerGame = matchups[pickWeek][MNFGame];
  } else {
    tiebreakerGame = matchups[pickWeek][sortedGames[sortedGames.length - 1]];
  }
}
  
  const CURRENT_TIME_IN_SECONDS = Math.floor(new Date().getTime() / 1000);
  const isTiebreakerLocked =
    CURRENT_TIME_IN_SECONDS > tiebreakerGame.time.seconds ? true : false;

  useEffect(() => {
    const updatedUsersPicks = JSON.parse(JSON.stringify(usersPicks));
    // Iterate through sortedGames and set user's pick to empty string if deadline has passed
    sortedGames.forEach((gameNum) => {
      // if deadline for game has passed and user hasn't made pick, set it to empty string
      const deadlinePassed =
        CURRENT_TIME_IN_SECONDS > matchups[pickWeek][gameNum].time.seconds;
      if (deadlinePassed && !usersPicks[pickWeek].hasOwnProperty(gameNum)) {
        updatedUsersPicks[pickWeek][gameNum] = "";
      }
    });

    // Update the state after processing
    setUsersPicks(updatedUsersPicks);
  }, [pickWeek]);

  const handlePicked = (
    isBlocked: string | null,
    gameNum: string,
    team: string,
  ) => {
    if (!isBlocked && usersPicks[pickWeek][gameNum] !== team) {
      setUsersPicks((prev) => ({
        ...prev,
        [pickWeek]: {
          ...prev[pickWeek],
          [gameNum]: team,
        },
      }));
    }
  };

  const handleUpdateTiebreaker = (e: ChangeEvent<HTMLInputElement>) => {
    setUsersPicks((prev) => ({
      ...prev,
      [pickWeek]: {
        ...prev[pickWeek],
        tiebreaker: Number(e.target.value),
      },
    }));
  };

  const submitPicks = async () => {
    if (isTiebreakerLocked) {
      return showMessage("Picks are locked for this week.", "error");
    }

    if (!usersPicks[pickWeek].tiebreaker) {
      usersPicks[pickWeek].tiebreaker = 0;
      setUsersPicks((prev) => {
        return {
          ...prev,
          [pickWeek]: {
            ...prev[pickWeek],
            tiebreaker: 0,
          },
        };
      });
    }

    function showMessage(message: string, type: string) {
      if (type === "error") {
        setErrorMessage(message);
        setSuccessMessage("");
        setTimeout(() => {
          setErrorMessage("");
        }, 5000);
      } else if (type === "success") {
        setSuccessMessage(message);
        setErrorMessage("");
        setTimeout(() => {
          setSuccessMessage("");
        }, 5000);
      }
      
    }

    const numGamesPicked = Object.keys(usersPicks[pickWeek]).filter((item) =>
      item.includes("game"),
    ).length;
    const numGamesInWeek = sortedGames.length;

    if (numGamesPicked === numGamesInWeek) {
      const leagueRef = doc(db, "leagues", leagueName);
      const updateField = `members.${user.uid}.picks.${pickWeek}`;
      await updateDoc(leagueRef, {
        [updateField]: usersPicks[pickWeek],
      });
      await getLeagueInfo(leagueName);
      showMessage("SUBMITTED PICKS!", "success");
    } else {
      showMessage("pick each game and tiebreaker", "error");
    }
  };

  return (
    <div className={pickstyles.pickscontainer}>
      {pickWeek &&
        matchups[pickWeek] &&
        Object.keys(matchups[pickWeek]).length > 0 &&
        sortedGames.map((gameNum) => {
          return (
            <Matchup
              key={gameNum}
              matchups={matchups}
              usersPicks={usersPicks}
              pickWeek={pickWeek}
              gameNum={gameNum}
              handlePicked={handlePicked}
              CURRENT_TIME_IN_SECONDS={CURRENT_TIME_IN_SECONDS}
            />
          );
        })}
      <label className={styles.center} htmlFor="tiebreaker">
        <p className={`${styles.formLabel} ${styles.bold}`}>
          <span className={styles.bold}>Tiebreaker</span> - Predict total points
          for {tiebreakerGame.away} @ {tiebreakerGame.home}:{" "}
        </p>
        <input
          className={styles.tieInput}
          type="number"
          onChange={handleUpdateTiebreaker}
          required
          name="tiebreaker"
          id="tiebreaker"
          value={usersPicks[pickWeek].tiebreaker.toString() || 0}
          disabled={isTiebreakerLocked}
        />
      </label>
      {errorMessage && <p className="errorMessage">{errorMessage}</p>}
      {successMessage && <p className="successMessage">{successMessage}</p>}
      <button className={styles.submitBtn} onClick={submitPicks}>
        Submit
      </button>
    </div>
  );
}
