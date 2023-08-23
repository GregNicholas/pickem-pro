import { useState, createContext, useContext } from "react";
import { League } from "../types";

interface LeagueContextType {
  // selectedLeague: string | null;
  selectedLeague: League | null;
  updateSelectedLeague: (leagueData: League) => void;
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
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);

  const updateSelectedLeague = (leagueData: League) => {
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