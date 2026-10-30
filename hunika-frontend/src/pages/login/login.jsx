import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';

export default function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await API.post('/login', {
        email: email,
        password: password,
      });

      const token = response.data.token;
      const user = response.data.user;
      const isAdmin = user && (user.is_admin === true || user.is_admin === 1);

      localStorage.setItem('token', token);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('role', isAdmin ? 'admin' : 'pencari');

      if (typeof setIsLoggedIn === 'function') {
        setIsLoggedIn(true);
      }

      alert('Login Berhasil!');

      if (isAdmin) {
        navigate('/dashboard-pemilik');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login Error', err);
      const errorMessage = err.response?.data?.message || 'Email atau password salah';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100 my-auto">

        {/* Tombol Kembali */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-emerald-600 transition mb-4"
        >
          <span>←</span> Kembali
        </Link>

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-emerald-600 tracking-tight">HUNIKA</h1>
          <p className="text-gray-400 text-sm mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">E-mail</label>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:border-emerald-500 text-sm bg-white"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:border-emerald-500 text-sm bg-white"
              required
            />
          </div>

          {/* Tombol login dengan pengaman w-full mutlak agar tidak berubah saat di-refresh */}
          <div className="pt-2 w-full">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition duration-200 shadow-sm cursor-pointer text-center block"
            >
              {loading ? "Memproses..." : "Login"}
            </button>
          </div>
        </form>

        <div className="text-center mt-6 text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-600 font-semibold hover:underline">
            Register
          </Link>
        </div>

      </div>
    </div>
  );
}