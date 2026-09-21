import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import useKost from "../../hooks/useKost";
import KostCard from "../../components/KostCard";
import FilterSidebar from "../../components/FilterSidebar";

export default function SearchKost() {
  const [selectedFacility, setSelectedFacility] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const [isLogin, setIsLogin] = useState(
    localStorage.getItem("isLogin") === "true"
  );

  useEffect(() => {
    const status = localStorage.getItem("isLogin");
    setIsLogin(status === "true");
  }, []);

  // custom hook: fetch data kost dari "API" (kost-data.json)
  const { kostList, loading, error } = useKost();

  const filteredKost = kostList.filter((kost) => {
    const facilityMatch =
      selectedFacility.length === 0 ||
      selectedFacility.every((facility) => kost.facilities.includes(facility));

    const roomMatch =
      selectedRoomType === "" || kost.roomType === selectedRoomType;

    const searchMatch =
      kost.name.toLowerCase().includes(search.toLowerCase()) ||
      kost.loc.toLowerCase().includes(search.toLowerCase()) ||
      kost.facilities.some((facility) =>
        facility.toLowerCase().includes(search.toLowerCase())
      );

    const price = Number(kost.price.replace(/\./g, ""));
    const inputPrice = Number(maxPrice.replace(/\./g, ""));
    const priceMatch = maxPrice === "" || price <= inputPrice;

    return facilityMatch && roomMatch && searchMatch && priceMatch;
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
        {/* FILTER — komponen terpisah, semua state/setter dikirim lewat props */}
        <FilterSidebar
          selectedFacility={selectedFacility}
          setSelectedFacility={setSelectedFacility}
          selectedRoomType={selectedRoomType}
          setSelectedRoomType={setSelectedRoomType}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
        />

        {/* LIST KOST */}
        <main className="flex-1">
          {loading && <p className="text-gray-500">Memuat data kost...</p>}
          {error && <p className="text-red-500">Gagal memuat data: {error}</p>}

          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredKost.map((kost) => (
                <KostCard key={kost.id} kost={kost} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}