import { Dispatch, SetStateAction } from "react";
import styles from "./LeagueHeader.module.css";

interface LeagueHeaderProps {
  displaySection: string;
  setDisplaySection: Dispatch<SetStateAction<string>>;
}

export default function LeagueHeader({displaySection, setDisplaySection}: LeagueHeaderProps) {
return (
  <div className={styles.leagueHeader}>
    <button 
      className={`optionButton ${displaySection==="mypicks" ? styles.selectedOption : ""}`}
      onClick={() => setDisplaySection("mypicks")}
    >
      My Picks
    </button>
    <button 
      className={`optionButton ${displaySection==="members" ? styles.selectedOption : ""}`}
      onClick={() => setDisplaySection("members")}
    >
      Members
    </button>
    <button 
      className={`optionButton ${displaySection==="leaguestats" ? styles.selectedOption : ""}`}
      onClick={() => setDisplaySection("leaguestats")}
    >
      League Stats
    </button>
  </div>
)
}