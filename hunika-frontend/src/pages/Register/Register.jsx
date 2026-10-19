import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  
  // State untuk menampung input form sesuai kolom database
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'pencari' // Default role sebagai pencari kos
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    // Simulasi penyimpanan sementara ke localStorage (nanti diganti koneksi API Back-End)
    const existingUsers = JSON.parse(localStorage.getItem('hunika_users')) || [];
    
    // Membuat ID dummy menyerupai format database (misal: USR-003)
    const newId = `USR-${String(existingUsers.length + 2).padStart(3, '0')}`;
    
    const newUser = {
      id: newId,
      ...formData,
      created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    existingUsers.push(newUser);
    localStorage.setItem('hunika_users', JSON.stringify(existingUsers));

    alert('Registrasi berhasil! Silakan masuk menggunakan akun baru.');
    navigate('/login');
  };

  return (
    <div className="bg-slate-100 min-h-screen flex justify-center items-center p-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-emerald-600">HUNIKA</h1>
          <p className="text-gray-400 text-sm mt-1">Buat akun baru untuk mulai menjelajah</p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Nama Lengkap</label>
            <input 
              type="text" 
              name="name"
              placeholder="Masukkan nama lengkap"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
              required 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Email</label>
            <input 
              type="email" 
              name="email"
              placeholder="nama@email.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
              required 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Nomor Telepon / WhatsApp</label>
            <input 
              type="text" 
              name="phone"
              placeholder="08xxxxxxxxxx"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
              required 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Password</label>
            <input 
              type="password" 
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
              required 
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Daftar Sebagai</label>
            <select 
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:border-emerald-500 text-sm bg-white"
            >
              <option value="pencari">User</option>
              <option value="pemilik">Admin</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium p-3 rounded-xl transition duration-200 mt-2 shadow-sm"
          >
            Daftar Sekarang
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-gray-500">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-emerald-600 font-semibold hover:underline">
            Masuk di sini
          </Link>
        </div>

      </div>
    </div>
  );
}



