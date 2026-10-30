import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { KostProvider } from "./context/KostContext";
import Navbar from "./components/Navbar";

// Import Halaman-halaman
import Login from "./pages/login/login";
import Register from "./pages/Register/Register"; 
import Profile from "./pages/profile/profile";
import SearchKost from "./pages/search-kost/search-kost";
import DetailKost from "./pages/detail-kost/detail-kost";
import DashboardPemilik from "./pages/Pemilik/DashboardPemilik";
import TambahKos from "./pages/Pemilik/TambahKos";
import ReviewKos from "./pages/Review/ReviewKos";
import BookingPage from "./pages/Booking_and_Transactions/BookingPage";
import TransaksiPage from "./pages/Booking_and_Transactions/TransaksiPage";
import HistoryPage from "./pages/Booking_and_Transactions/HistoryPage";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
  localStorage.getItem("isLogin") === "true" && !!localStorage.getItem("token")
);
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  const handleLogout = () => {
    localStorage.removeItem("isLogin");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole("");
  };

  return (
    <KostProvider>
      <div className="min-h-screen bg-slate-50 text-slate-800">
        <Navbar 
          isLoggedIn={isLoggedIn} 
          role={role} 
          onLogout={handleLogout} 
        />

        <div className="p-6">
          <Routes>
            {/* Route Khusus Admin / Pemilik Kost */}
  <Route 
    path="/dashboard-pemilik" 
    element={
      localStorage.getItem('role') === 'admin' ? (
        <DashboardPemilik />
      ) : (
        <Navigate to="/" replace />
      )
    } 
  />
  <Route 
    path="/tambah-kost" 
    element={
      localStorage.getItem('role') === 'admin' ? (
        <TambahKos />
      ) : (
        <Navigate to="/" replace />
      )
    } 
  />
            <Route path="/" element={<SearchKost isLoggedIn={isLoggedIn} />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/kost/:id" element={<DetailKost />} />
            <Route path="/review" element={<ReviewKos />} />
            {/* <Route path="/dashboard-pemilik" element={<DashboardPemilik />} /> */}
            <Route path="/tambah-kost" element={<TambahKos />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route path="/transaksi" element={<TransaksiPage />} />
            <Route path="/transaksi/:id" element={<TransaksiPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </div>
      </div>
    </KostProvider>
  );
};

export default App;
