import { createContext, useState, useEffect } from "react";

import { DATA } from "../data/dataKost"; 

export const KostContext = createContext();

export const KostProvider = ({ children }) => {
  const [kosts, setKosts] = useState([]);

  useEffect(() => {
    setKosts(DATA);
  }, []);

  const updateKost = (newData) => {
    setKosts(newData);
  };

  return (
    <KostContext.Provider value={{ kosts, updateKost }}>
      {children}
    </KostContext.Provider>
  );
};