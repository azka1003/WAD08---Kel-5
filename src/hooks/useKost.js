import { useState, useEffect } from "react";

export default function useKost() {
  const [kostList, setKostList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    setLoading(true);

    fetch("http://127.0.0.1:8000/api/kost")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Gagal mengambil data kost");
        }

        return res.json();
      })
      .then((result) => {
        if (isMounted) {
          const data = result.data.map((kost) => ({
            ...kost,

            // Menyesuaikan nama field database dengan frontend
            loc: kost.address,
            roomType: kost.type,

            // Data dari database
            img: kost.img,
            facilities: kost.facilities || [],

            // Harga dibuat string agar filter lama tetap bekerja
            price: String(kost.price),
          }));

          setKostList(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { kostList, loading, error };
}

export function useKostDetail(id) {
  const { kostList, loading, error } = useKost();

  const kost = kostList.find(
    (k) => String(k.id) === String(id)
  );

  return { kost, loading, error };
}