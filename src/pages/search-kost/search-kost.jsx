import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import useKost from "../../hooks/useKost";
import KostCard from "../../components/KostCard";

/* ============================================================
   DATA FILTER
   ============================================================ */
const ROOM_TYPE_OPTIONS = ["Standar", "Deluxe", "Eksklusif", "All"];

// key = id unik, label = teks di sidebar,
// keywords = kata yang dicari di nama fasilitas dari API
const FACILITY_OPTIONS = [
  { key: "ac", label: "AC", keywords: ["ac"] },
  { key: "wifi", label: "WiFi", keywords: ["wifi", "wi-fi"] },
  { key: "km-dalam", label: "Kamar Mandi Dalam", keywords: ["kamar mandi dalam"] },
  { key: "parkir", label: "Parkir", keywords: ["parkir"] },
  { key: "laundry", label: "Laundry", keywords: ["laundry"] },
  { key: "dapur", label: "Dapur Bersama", keywords: ["dapur"] },
  { key: "keamanan", label: "Satpam / CCTV", keywords: ["satpam", "cctv"] },
];

/* ============================================================
   SIDEBAR FILTER (di file yang sama)
   ============================================================ */
function FilterPanel({
  selectedRoomType,
  setSelectedRoomType,
  selectedFacilities,
  setSelectedFacilities,
  maxPrice,
  setMaxPrice,
}) {
  return (
    <aside className="w-64 self-start bg-white rounded-2xl shadow-md border border-gray-100 p-5">
      <h2 className="text-gray-400 font-bold uppercase text-sm mb-5">Filter</h2>

      {/* TIPE KAMAR */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Tipe Kamar</h3>
        <div className="space-y-2 text-gray-600">
          {ROOM_TYPE_OPTIONS.map((item) => {
            const value = item === "All" ? "" : item;
            return (
              <label key={item} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="tipe"
                  value={item}
                  checked={selectedRoomType === value}
                  onChange={(e) =>
                    setSelectedRoomType(e.target.value === "All" ? "" : e.target.value)
                  }
                  className="text-green-600 focus:ring-green-500"
                />{" "}
                {item}
              </label>
            );
          })}
        </div>
      </div>

      {/* FASILITAS */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Fasilitas</h3>
        <div className="space-y-2 text-gray-600">
          {FACILITY_OPTIONS.map((opt) => (
            <label key={opt.key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFacilities.includes(opt.key)}
                onChange={() =>
                  setSelectedFacilities(
                    selectedFacilities.includes(opt.key)
                      ? selectedFacilities.filter((k) => k !== opt.key)
                      : [...selectedFacilities, opt.key]
                  )
                }
                className="text-green-600 focus:ring-green-500"
              />{" "}
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* HARGA MAKS */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Harga Maks (Rp)</h3>
        <input
          type="text"
          placeholder="cth: 2000000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ""))}
          className="w-full p-3 border rounded-lg"
        />
      </div>

      {/* RESET */}
      <button
        onClick={() => {
          setSelectedRoomType("");
          setSelectedFacilities([]);
          setMaxPrice("");
        }}
        className="w-full bg-gray-100 hover:bg-gray-200 py-3 rounded-full transition text-sm font-medium"
      >
        Reset Filter
      </button>
    </aside>
  );
}

/* ============================================================
   HALAMAN CARI KOST
   ============================================================ */
export default function SearchKost() {
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [showMenu, setShowMenu] = useState(false);

  const { kostList, loading, error } = useKost();

  const filteredKost = kostList.filter((kost) => {
    const facilities = Array.isArray(kost.facilities) ? kost.facilities : [];

    // tipe kamar
    const roomMatch =
      selectedRoomType === "" ||
      (kost.roomType || "").toLowerCase() === selectedRoomType.toLowerCase();

    // pencarian teks (nama, lokasi, fasilitas)
    const searchText = search.trim().toLowerCase();

    const searchMatch =
      searchText === "" ||
      (kost.name || "").toLowerCase().includes(searchText) ||
      (kost.loc || "").toLowerCase().includes(searchText) ||
      facilities.some((facility) =>
        String(facility).toLowerCase().includes(searchText)
      );

    // harga maksimal
    const price = Number(kost.price);
    const inputPrice = Number(maxPrice);

    const priceMatch =
      maxPrice === "" ||
      (Number.isFinite(price) &&
        Number.isFinite(inputPrice) &&
        price <= inputPrice);

    // fasilitas: semua yang dicentang harus dimiliki kost
    const facilityMatch = selectedFacilities.every((key) => {
      const option = FACILITY_OPTIONS.find((o) => o.key === key);
      if (!option) return true;

      return facilities.some((f) => {
        const text = String(f).toLowerCase();
        return option.keywords.some((k) =>
          k.length <= 3
            ? new RegExp(`\\b${k}\\b`).test(text) // kata pendek (ac): cocokkan kata utuh
            : text.includes(k)
        );
      });
    });

    return roomMatch && searchMatch && priceMatch && facilityMatch;
  });

  return (
    <div className="bg-slate-100 min-h-screen text-slate-800 font-sans">
      {/* NAVBAR
      <nav className="bg-white px-12 py-4 flex justify-between items-center shadow-md">
        <div className="text-3xl font-bold text-green-600">Hunika</div>

        <ul className="flex gap-8">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-green-600 text-xl font-semibold border-green-600 pb-1"
                  : "text-gray-700 hover:text-green-600"
              }
            >
              Cari Kost
            </NavLink>
          </li>

          <li>
            <a href="#" className="text-gray-700 text-xl hover:text-green-600">
              Dashboard Pemilik
            </a>
          </li>
        </ul>

        {isLogin ? (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                alt="Profile"
                className="w-6 h-6"
              />
              Profil
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                  Profil Saya
                </Link>

                <button
                  onClick={() => {
                    localStorage.removeItem("isLogin");
                    localStorage.removeItem("email");
                    window.location.reload();
                  }}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Login
          </Link>
        )}
      </nav> */}

      {/* HERO */}
      <section className="text-center py-16 px-5">
        <h1 className="text-4xl font-bold mb-3 text-slate-900">
          Cari Kost yang Nyaman dan Terjangkau
        </h1>
        <p className="text-gray-500 mb-6">Temukan kost impianmu dengan mudah.</p>
        <div className="flex justify-center gap-3">
          <input
            type="text"
            placeholder="Cari lokasi, nama kost, atau fasilitas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-[500px] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          />
          <button className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 transition">
            Cari
          </button>
        </div>
      </section>

      {/* MAIN */}
      <div className="flex gap-6 px-10 pb-10">
        {/* FILTER */}
        <FilterPanel
          selectedRoomType={selectedRoomType}
          setSelectedRoomType={setSelectedRoomType}
          selectedFacilities={selectedFacilities}
          setSelectedFacilities={setSelectedFacilities}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
        />

        {/* LIST KOST */}
        <main className="flex-1">
          {loading && <p className="text-gray-500">Memuat data kost...</p>}
          {error && <p className="text-red-500">Gagal memuat data: {error}</p>}

          {!loading && !error && filteredKost.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredKost.map((kost) => (
                <KostCard key={kost.id} kost={kost} />
              ))}
            </div>
          )}

          {!loading && !error && filteredKost.length === 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-8 text-center text-gray-500">
              <p className="font-semibold text-gray-700 mb-1">
                Kost tidak ditemukan
              </p>
              <p>
                Tidak ada kost yang sesuai dengan filter. Coba naikkan harga
                maksimal, ubah tipe kamar, atau kurangi fasilitas yang dipilih.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}