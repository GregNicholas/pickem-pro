import { useState, createContext, useContext } from "react";
import { League } from "../types";
import { DocumentData } from "firebase/firestore";

interface LeagueContextType {
  selectedLeague: League | DocumentData | null;
  updateSelectedLeague: (leagueData: League | DocumentData) => void;
}

const LeagueContext = createContext<LeagueContextType | undefined>(undefined);

export const useLeagueContext = () => {
  const context = useContext(LeagueContext);
  if (!context) {
    throw new Error('useLeagueContext must be used within a LeagueProvider');
  }
  return context;
};

export const LeagueProvider = ({ children }) => {
  const [selectedLeague, setSelectedLeague] = useState<League | DocumentData | null>(null);

  const updateSelectedLeague = (leagueData: League | DocumentData) => {
    setSelectedLeague(leagueData);
  }

  const value: LeagueContextType = {
    selectedLeague,
    updateSelectedLeague,
  }

  return (
    <LeagueContext.Provider value={value}>
      {children}
    </LeagueContext.Provider>
  );
};