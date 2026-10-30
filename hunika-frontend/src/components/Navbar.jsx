import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Navbar({ isLoggedIn, role, onLogout }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Pastikan hanya mendeteksi login jika token benar-benar ada di localStorage atau props
  const token = localStorage.getItem('token');
  const activeLogin = isLoggedIn || (token && token !== 'undefined' && token !== 'null');
  const userRole = role || localStorage.getItem('role');

  const handleLogoutClick = () => {
    setShowDropdown(false);
    
    // Hapus seluruh data sesi di browser secara total
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('isLoggedIn');
    
    // Jika props onLogout tersedia dari parent, jalankan
    if (typeof onLogout === 'function') {
      onLogout();
    }

    // Paksa reload penuh ke halaman login agar navbar & state aplikasi bersih total
    window.location.replace('/login');
  };

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-8 py-4 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <Link to="/" className="flex items-center gap-2 font-bold text-xl text-emerald-600 tracking-tight">
        <span className="bg-emerald-600 text-white px-2.5 py-1 rounded-xl text-sm font-black shadow-sm">H</span>
        Hunika
      </Link>

      {/* Menu Navigasi Tengah */}
      <div className="flex items-center gap-6 text-sm font-semibold text-slate-600">
        {activeLogin && (userRole === 'admin' || userRole === 'pemilik') ? (
          <NavLink 
            to="/dashboard-pemilik" 
            className={({ isActive }) => 
              `transition-colors duration-200 ${isActive ? 'text-emerald-600 font-bold border-b-2 border-emerald-600 pb-0.5' : 'hover:text-emerald-600'}`
            }
          >
            Dashboard Pemilik
          </NavLink>
        ) : (
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `transition-colors duration-200 ${isActive ? 'text-emerald-600 font-bold border-b-2 border-emerald-600 pb-0.5' : 'hover:text-emerald-600'}`
            }
          >
            Cari Kos
          </NavLink>
        )}
      </div>

      {/* Bagian Kanan Navbar */}
      <div className="flex items-center gap-3">
        {activeLogin ? (
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100/80 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-200/80 transition cursor-pointer"
            >
              <span>👤</span> Profil
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50">
                <Link 
                  to="/profile" 
                  onClick={() => setShowDropdown(false)} 
                  className="block px-4 py-2 text-sm text-slate-600 hover:text-emerald-600 hover:bg-slate-50 transition"
                >
                  My Profile
                </Link>
                <button 
                  onClick={handleLogoutClick} 
                  className="block w-full text-left px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link 
            to="/login" 
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition shadow-sm"
          >
            Masuk
          </Link>
        )}
      </div>
    </nav>
  );
}