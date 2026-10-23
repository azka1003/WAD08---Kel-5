
import { createContext, useState, useEffect } from "react";
import { DATA } from "../data/dataKost";

export const KostContext = createContext();

export const KostProvider = ({ children }) => {
  const [kosts, setKosts] = useState([]);

  useEffect(() => {
    let isMounted = true;

    fetch("http://127.0.0.1:8000/api/kost")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Gagal mengambil data kost");
        }
        return res.json();
      })
      .then((result) => {
        if (!isMounted) return;

        const dataAPI = result.data.map((kost) => {
          const dataStatis = DATA.find(
            (item) => item.name === kost.name
          );

          let facilities = kost.facilities;

          if (typeof facilities === "string") {
            try {
              facilities = JSON.parse(facilities);
            } catch {
              facilities = [];
            }
          }

          return {
            ...dataStatis,
            ...kost,
            id: kost.id,
            loc: kost.address,
            facilities: Array.isArray(facilities) ? facilities : [],
            roomTypes: dataStatis?.roomTypes ?? [],
          };
        });

        setKosts(dataAPI);
      })
      .catch((error) => {
        console.error("Gagal memuat data kost:", error);
      });

    return () => {
      isMounted = false;
    };
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
