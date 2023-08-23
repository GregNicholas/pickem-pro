import { useState, createContext, useContext } from "react";
import { League } from "../types";

interface LeagueContextType {
  selectedLeague: string | null;
  updateSelectedLeague: (leagueName: string) => void;
}

const LeagueContext = createContext<LeagueContextType | null>(null);

export const useLeagueContext = () => {
  const context = useContext(LeagueContext);
  if (!context) {
    throw new Error('useLeagueContext must be used within a LeagueProvider');
  }
  return context;
};

export const LeagueProvider = ({ children }) => {
  const [selectedLeague, setSelectedLeague] = useState<string | null>(null);

  const updateSelectedLeague = (leagueName: string) => {
    setSelectedLeague(leagueName);
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