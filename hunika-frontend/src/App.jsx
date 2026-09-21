import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { KostProvider } from "./context/KostContext";
import Navbar from "./components/Navbar";
import Login from './pages/login/login';
import Profile from './pages/profile/profile'
import SearchKost from './pages/search-kost/search-kost';
import DetailKost from './pages/detail-kost/detail-kost';
import DashboardPemilik from './pages/Pemilik/DashboardPemilik';
import TambahKos from './pages/Pemilik/TambahKos';
import ReviewKos from './pages/Review/ReviewKos';
import BookingPage from "./pages/Booking_and_Transactions/BookingPage";
import TransaksiPage from "./pages/Booking_and_Transactions/TransaksiPage";

const App = () =>{
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("isLogin"));
  const [role, setRole] = useState(localStorage.getItem("role") || "");

const handleLogout = () => {
   localStorage.removeItem("isLogin");
    localStorage.removeItem("role");
    setIsLoggedIn(false); // Navbar langsung berubah karena state ini
    setRole("");
    navigate("/");
  };;

  return (
    <KostProvider>
    <div className='in-h-screen bg-slate-50 text-slate-800'>
      <Navbar 
      isLoggedIn={isLoggedIn} 
      role={role}
      onLogout={handleLogout}
      />

      {/* Konten halaman yang berubah secara dinamis sesuai URL */}
      <div className="p-6">
        <Routes>
          {/* Halaman Utama: Pencarian Kos */}
          <Route path="/" element={<SearchKost isLoggedIn={isLoggedIn} />} />

          {/* Halaman Detail Kos (Menggunakan parameter ID unik kos) */}
          <Route path="/kost/:id" element={<DetailKost />} />

          {/* Halaman Otentikasi & Akun */}
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/profile" element={<Profile />} />

          {/* Halaman Review Kos Milikmu */}
          <Route path="/review" element={<ReviewKos />} />

          {/* Halaman Panel Manajemen Pemilik Kos */}
          <Route path="/dashboard-pemilik" element={<DashboardPemilik />} />
          <Route path="/tambah-kost" element={<TambahKos />} />

         {/* Halaman Booking & Transaksi */}
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/transaksi/:id" element={<TransaksiPage />} />
        </Routes>
      </div>
    </div>
    </KostProvider>
    
  );
} 

export default App;
