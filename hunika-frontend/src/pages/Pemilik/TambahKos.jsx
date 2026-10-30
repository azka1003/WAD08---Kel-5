import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

export default function TambahKos() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    area: 'Jakarta Selatan',
    price: '',
    rooms: '2',
    years: '2024',
    facilities: '',
    description: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('address', formData.address);
      data.append('area', formData.area);
      data.append('price', formData.price);
      data.append('rooms', formData.rooms);
      data.append('years', formData.years);
      data.append('facilities', formData.facilities);
      data.append('description', formData.description);
      
      if (imageFile) {
        data.append('img', imageFile);
      }

      const token = localStorage.getItem('token');

      await API.post('/kost', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      alert('Kost berhasil ditambahkan dan masuk database!');
      navigate('/dashboard-pemilik');
    } catch (err) {
      console.error('Gagal menyimpan kost:', err);
      alert('Gagal menyimpan data, periksa kembali inputan Anda.');
    }
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <button 
          type="button"
          onClick={() => navigate('/dashboard-pemilik')} 
          className="text-sm text-gray-400 hover:text-emerald-600 font-semibold transition"
        >
          ← Kembali ke Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Tambah Kos Baru</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        {/* 1. Informasi Umum */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-wider">1. Informasi Umum</h2>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Kos</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="Contoh: Kos Melati Residence" 
              className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-emerald-500" 
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Alamat Lengkap</label>
            <input 
              type="text" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              placeholder="Contoh: Jl. Melati No. 12, Kebayoran Baru" 
              className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-emerald-500" 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Wilayah (Area)</label>
              <select 
                name="area" 
                value={formData.area} 
                onChange={handleChange} 
                className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-emerald-500 bg-white"
              >
                <option value="Kebayoran Baru, Jakarta Selatan">Kebayoran Baru, Jakarta Selatan</option>
                <option value="Kebayoran Lama, Jakarta Selatan">Kebayoran Lama, Jakarta Selatan</option>
                <option value="Cilandak, Jakarta Selatan">Cilandak, Jakarta Selatan</option>
                <option value="Kemang, Jakarta Selatan">Kemang, Jakarta Selatan</option>
                <option value="Pondok Indah, Jakarta Selatan">Pondok Indah, Jakarta Selatan</option>
                <option value="Pesanggrahan, Jakarta Selatan">Pesanggrahan, Jakarta Selatan</option>
                <option value="Cipete, Jakarta Selatan">Cipete, Jakarta Selatan</option>
                <option value="Tebet, Jakarta Selatan">Tebet, Jakarta Selatan</option>
                <option value="Setiabudi, Jakarta Selatan">Setiabudi, Jakarta Selatan</option>
                <option value="Mampang, Jakarta Selatan">Mampang, Jakarta Selatan</option>
                <option value="Fatmawati, Jakarta Selatan">Fatmawati, Jakarta Selatan</option>
                <option value="Senopati, Jakarta Selatan">Senopati, Jakarta Selatan</option>
                <option value="Gandaria, Jakarta Selatan">Gandaria, Jakarta Selatan</option>
                <option value="Pancoran, Jakarta Selatan">Pancoran, Jakarta Selatan</option>
                <option value="Jagakarsa, Jakarta Selatan">Jagakarsa, Jakarta Selatan</option>
                <option value="Pasar Minggu, Jakarta Selatan">Pasar Minggu, Jakarta Selatan</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Harga per Bulan (Rp)</label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                placeholder="Contoh: 1500000" 
                className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-emerald-500" 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Jumlah Kamar</label>
              <input 
                type="number" 
                name="rooms" 
                value={formData.rooms} 
                onChange={handleChange} 
                placeholder="Contoh: 5" 
                className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-emerald-500" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tahun Dibangun/Renovasi</label>
              <input 
                type="number" 
                name="years" 
                value={formData.years} 
                onChange={handleChange} 
                placeholder="Contoh: 2024" 
                className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-emerald-500" 
                required 
              />
            </div>
          </div>
        </div>

        {/* 2. Fasilitas Kos */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-wider">2. Fasilitas Kos</h2>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fasilitas (Pisahkan dengan koma)</label>
            <input 
              type="text" 
              name="facilities" 
              value={formData.facilities} 
              onChange={handleChange} 
              placeholder="Contoh: Free Wi-Fi, AC, KM Dalam, Kasur" 
              className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-emerald-500" 
              required 
            />
          </div>
        </div>

        {/* 3. Upload Gambar Kos */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-wider">3. Upload Gambar Kos</h2>
          <div 
            onClick={triggerFileInput}
            className="relative border-2 border-dashed border-gray-200 rounded-2xl p-6 bg-gray-50/50 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 transition h-48"
          >
            {imagePreview ? (
              <div className="absolute inset-0 w-full h-full p-2">
                <img 
                  src={imagePreview} 
                  alt="Preview Kost" 
                  className="w-full h-full object-cover rounded-xl shadow-inner" 
                />
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold mb-2 text-gray-600">+</div>
                <p className="text-xs font-semibold">Klik untuk Unggah Gambar Kos</p>
                <p className="text-[10px] text-gray-400 mt-1">PNG, JPG, atau JPEG</p>
              </div>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
        </div>

        {/* 4. Deskripsi Lengkap */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-wider">4. Deskripsi Lengkap</h2>
          <div>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows="4" 
              placeholder="Tulis peraturan atau keunggulan kos..." 
              className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-emerald-500" 
              required 
            />
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl transition shadow-sm text-sm"
        >
          Simpan Info Kos ke Database
        </button>
      </form>
    </main>
  );
}