import { Dispatch, SetStateAction } from "react";
import styles from "./LeagueHeader.module.css";

interface LeagueNavProps {
  displaySection: string;
  setDisplaySection: Dispatch<SetStateAction<string>>;
}

export default function LeagueNav({
  displaySection,
  setDisplaySection,
}: LeagueNavProps) {
  return (
    <div className={styles.leagueNavContainer}>
      <button
        className={`optionButton ${
          displaySection === "mypicks" ? styles.selectedOption : ""
        }`}
        onClick={() => setDisplaySection("mypicks")}
      >
        My Picks
      </button>
      <button
        className={`optionButton ${
          displaySection === "members" ? styles.selectedOption : ""
        }`}
        onClick={() => setDisplaySection("members")}
      >
        Members
      </button>
      <button
        className={`optionButton ${
          displaySection === "leaguestats" ? styles.selectedOption : ""
        }`}
        onClick={() => setDisplaySection("leaguestats")}
      >
        League Stats
      </button>
    </div>
  );
}
