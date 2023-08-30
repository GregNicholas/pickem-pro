import { doc, collection, getDoc, getDocs } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../firebase/config";


export const useFetchData = (collectionName: string, document?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState(null);

  // if document is specified, then fetch it, else fetch all docs from the collection
  const fetchData = async () => {
    if(document) {
      const docRef = doc(db, collectionName, document);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData(docSnap.data());
        setIsLoading(false);
      } else {
        setError(true);
        setIsLoading(false);
      }
    } else {
      const collectionSnap = await getDocs(collection(db, collectionName));

      const docs = {};
      collectionSnap.forEach(doc => {
        docs[doc.id] = doc.data();
        setData(docs);
      });
      setIsLoading(false);
    }
  }  

  return { 
    fetchData: fetchData,
    data,
    error,
    isLoading,
  }
}