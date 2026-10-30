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

// Ambil 1 kost langsung dari API berdasarkan ID (tidak bergantung pada pagination)
export function useKostDetail(id) {
  const [kost, setKost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    if (!id) {
      setKost(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setKost(null);

    fetch(`http://127.0.0.1:8000/api/kost/${id}`)
      .then((res) => {
        // 404 = kost memang tidak ada, bukan error sistem
        if (res.status === 404) return null;
        if (!res.ok) {
          throw new Error("Gagal mengambil data kost");
        }
        return res.json();
      })
      .then((result) => {
        if (!isMounted) return;

        const d = result?.data;
        if (!d) {
          setKost(null);
          return;
        }

        const extra = DATA.find((item) => item.name === d.name);

        setKost({
          ...d,
          loc: d.address,
          roomType: extra?.roomTypes?.[0]?.name || "",
          facilities: parseFacilities(d.facilities),
          price: String(Math.round(Number(d.price))),
        });
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
  }, [id]);

  return { kost, loading, error };
}