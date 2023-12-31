import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthContext } from "../context/AuthContext";

export function useAuthProtection() {
  const { user } = useAuthContext();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  if(!user) {
    router.push("/");
  } else {
    if(isLoading) setIsLoading(false);
  }

//   useEffect(() => {
//     if (!user) {
//       router.push("/");
//     } else {
//       setIsLoading(false);
//     }
//   }, [user]);

  return isLoading;
}
