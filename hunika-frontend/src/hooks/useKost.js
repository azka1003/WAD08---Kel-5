import { useState, useEffect } from "react";
import { DATA } from "../data/dataKost"

// facilities dari API berupa string JSON, ubah jadi array
function parseFacilities(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

export default function useKost(initialLimit = 4) {
  const [kostList, setKostList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
    const [meta, setMeta] = useState({ current_page: 1, total_pages: 1 });

  useEffect(() => {
    let isMounted = true;

    setLoading(true);

    fetch(`http://127.0.0.1:8000/api/kost?page=${page}&limit=${initialLimit}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Gagal mengambil data kost");
        }

        return res.json();
      })
      .then((result) => {
        if (isMounted) {
          const data = result.data.map((kost) => {
           // tipe kamar tidak ada di database, ambil dari data statis lewat nama
          const extra = DATA.find((d) => d.name === kost.name);

          return {
            ...kost,
            loc: kost.address,
            roomType: extra?.roomTypes?.[0]?.name || "",
            facilities: parseFacilities(kost.facilities),
            // buang desimal ".00" supaya filter harga tidak salah
            price: String(Math.round(Number(kost.price))),
          };
        });

          setKostList(
            [...data].sort((a, b) => String(a.id).localeCompare(String(b.id))));
          setMeta(result.meta);
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
  }, [page, initialLimit]);

  return { kostList, loading, error, page, setPage, meta };
}

export function useKostDetail(id) {
  const { kostList, loading, error } = useKost();

  const kost = kostList.find(
    (k) => String(k.id) === String(id)
  );

  return { kost, loading, error };
}