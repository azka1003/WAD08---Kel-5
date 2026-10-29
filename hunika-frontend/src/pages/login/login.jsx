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
      const res = await API.post('/login', { email: email.trim(), password });
      console.log("Respons login:", res.data);

      const body = res.data;
      const token =
        body.token || body.access_token || body.data?.token || body.data?.access_token;
      const user = body.user || body.data?.user || body.data || {};

      if (!token) {
        alert("Login diterima server, tapi token tidak ditemukan. Cek Console (F12) bagian 'Respons login'.");
        return;
      }

      const roleRaw = String(user.role || "").toLowerCase();
      const role = ["owner", "pemilik", "admin"].includes(roleRaw) ? "pemilik" : "pencari";

      localStorage.setItem("token", token);
      localStorage.setItem("isLogin", "true");
      localStorage.setItem("role", role);
      localStorage.setItem("email", user.email || email);
      setIsLoggedIn(true);

      navigate(role === "pemilik" ? "/dashboard-pemilik" : "/");
    } catch (err) {
      const status = err.response?.status;
      const pesan = err.response?.data?.message || err.response?.data?.error;

      console.log("Login gagal. Status:", status, "Respons:", err.response?.data);

      if (!err.response) {
        alert("Tidak bisa terhubung ke backend. Pastikan 'php artisan serve' sedang jalan di port 8000.");
      } else if (status === 404) {
        alert("Route /api/login tidak ditemukan (404). Cek routes/api.php di backend.");
      } else {
        alert(`Login gagal [${status}]: ${pesan || "Email atau password salah"}`);
      }
    } finally {
      setLoading(false);
    }
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
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-medium p-3 rounded-xl transition duration-200 mt-2 shadow-sm"
          >
            {loading ? "Memproses..." : "Login"}
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