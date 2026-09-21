import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar({ isLoggedIn, role, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navLinkClass = "text-sm font-medium hover:text-green-600 transition-colors duration-200";

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white border-b border-gray-100">
      <Link to="/" className="flex items-center gap-2 font-bold text-xl text-emerald-600">
        <span className="bg-emerald-600 text-white px-2 py-1 rounded-lg text-sm">H</span>
        Hunika
      </Link>

      <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
       {isLoggedIn && role === 'pemilik' && (
  <>
    <NavLink to="/" className={({isActive}) => `${navLinkClass} ${isActive ? 'text-green-600' : 'text-slate-600'}`}>
      Cari Kos
    </NavLink>
    <NavLink to="/dashboard-pemilik" className={({isActive}) => `${navLinkClass} ${isActive ? 'text-green-600' : 'text-slate-600'}`}>
      Dashboard Pemilik
    </NavLink>
  </>
)}

{isLoggedIn && role === 'pencari' && (
  <NavLink to="/" className={({isActive}) => `${navLinkClass} ${isActive ? 'text-green-600' : 'text-slate-600'}`}>
    Cari Kos
  </NavLink>
)}

        {/* Menu untuk Pemilik (Muncul jika sudah login)
        {isLoggedIn && (
          <NavLink 
            to="/dashboard-pemilik" 
            className={({ isActive }) => isActive ? "text-emerald-600 border-b-2 border-emerald-600 pb-1" : "hover:text-emerald-600"}
          >
            Dashboard Pemilik
          </NavLink>
        )} */}
      </div>

      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <div className="relative">
            {/* Tombol Profil */}
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-200 transition-all"
            >
              👤 Profil
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-slate-100 rounded-lg shadow-lg py-2 z-10">
                <Link to="/profile" className="block px-4 py-2 text-sm text-slate-600 hover:text-emerald-600">My Profile</Link>
                <button 
                  onClick={onLogout} 
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm rounded-xl">Masuk</Link>
            {/* <Link to="/register" className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-sm rounded-xl">Daftar</Link> */}
          </>
        )}
      </div>
    </nav>
  );
}