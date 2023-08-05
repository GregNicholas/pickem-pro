// THIS FILE IS AN EXAMPLE

import { useState, useEffect, createContext, useContext } from "react";
// import { onAuthStateChanged, getAuth, User } from "firebase/auth";
import firebase_app from "../firebase/config";

// const auth = getAuth(firebase_app);

const LeagueContext =
  createContext<{ user: User | null }>({ user: null });

export const useLeagueContext = () => useContext(LeagueContext);

export const LeagueContextProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user
  };

  return (
    <LeagueContext.Provider value={value}>
      {!loading && children}
    </LeagueContext.Provider>
  );
};

export default LeagueContext;
