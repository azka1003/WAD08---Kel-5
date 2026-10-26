import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from "react-router-dom";
import API from '../../services/api';

export default function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState('');
  const location = useLocation();
  const redirectPath = location.state?.from || "/";   
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
            // Tembak endpoint login buatan backend tim kalian
            const response = await API.post('/login', {
                email: email,
                password: password,
            });


            // Jika sukses, backend biasanya mengirim access_token
            const token = response.data.token;
            
            // Simpan token ke localStorage browser
            localStorage.setItem('token', token);

            localStorage.setItem("isLogin", "true");

            if (setIsLoggedIn) {
              setIsLoggedIn(true);
          }

          alert('Login Berhasil!');
          
          // Pindah ke halaman utama (home) atau dashboard
          navigate('/');
        } catch (err) {
            console.error(err);
            setError('Email atau password salah!');
        }
    

  

    // Logika Role Sesuai Database & Simulasi
  //   if (email === "user@gmail.com" && password === "123") {
  //     localStorage.setItem("isLogin", "true");
  //     localStorage.setItem("role", "pencari");
  //     setIsLoggedIn(true);
  //     navigate(redirectPath);
  //   } else if (email === "owner@gmail.com" && password === "123") {
  //     localStorage.setItem("isLogin", "true");
  //     localStorage.setItem("role", "pemilik");
  //     setIsLoggedIn(true);
  //     navigate("/dashboard-pemilik");
  //   } else {
  //     alert("Email atau Password salah!");
  //   }
  };

  return (
    <div className="bg-slate-100 min-h-screen flex justify-center items-center p-6">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">

        {/* Tombol Kembali */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-emerald-600 transition mb-4"
        >
          <span aria-hidden="true">←</span> Kembali
        </Link>

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-emerald-600">HUNIKA</h1>
          <p className="text-gray-400 text-sm mt-1">Masuk ke akun Anda</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Email</label>
            <input 
              type="email" 
              placeholder="Masukkan Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Password</label>
            <input 
              type="password" 
              placeholder="Masukkan Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium p-3 rounded-xl transition duration-200 mt-2 shadow-sm"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-500">
          Belum punya akun?{' '}
          <Link to="/register" className="text-emerald-600 font-semibold hover:underline">
            Daftar di sini
          </Link>
        </div>

      </div>
    </div>
  );
}