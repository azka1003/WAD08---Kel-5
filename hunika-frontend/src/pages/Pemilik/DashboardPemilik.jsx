import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

export default function DashboardPemilik() {
  const navigate = useNavigate();
  const [kosts, setKosts] = useState([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKost, setSelectedKost] = useState(null);

  useEffect(() => {
    const pageNum = Number.isInteger(currentPage) && currentPage > 0 ? currentPage : 1;
    fetchKosts(pageNum);
  }, [currentPage]);

  const fetchKosts = async (page = 1) => {
    try {
      const response = await API.get(`/kost?page=${page}`); 
      
      if (response.data) {
        const listData = response.data.data || response.data;
        setKosts(Array.isArray(listData) ? listData : []);

        // Cek metadata dari response API
        const meta = response.data.meta || response.data;
        const current = meta.current_page || page;
        const last = meta.total_pages || meta.last_page || meta.total_pages || 1;

        setCurrentPage(Number(current));
        setLastPage(Number(last));
      }
    } catch (err) {
      console.error('Gagal memuat data kost:', err);
      setKosts([]);
    }
  };

  const openEditModal = (kost) => {
    setSelectedKost(kost);
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await API.put(`/kost/${selectedKost.id}`, selectedKost, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsModalOpen(false);
      alert('Data kost berhasil diubah!');
      fetchKosts(currentPage);
    } catch (err) {
      console.error('Gagal memperbarui kost:', err);
      alert('Gagal mengupdate data.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus kost ini?')) {
      try {
        const token = localStorage.getItem('token');
        await API.delete(`/kost/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Kost berhasil dihapus!');
        fetchKosts(currentPage);
      } catch (err) {
        console.error('Gagal menghapus kost:', err);
        alert('Gagal menghapus data.');
      }
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Owner Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola Data Kost dengan Mudah</p>
        </div>
        <button 
          onClick={() => navigate('/tambah-kost')}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition shadow-sm"
        >
          + Tambah Kost
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
          <div className="col-span-5">Nama & Area Kost</div>
          <div className="col-span-3">Harga per Bulan</div>
          <div className="col-span-2">Kamar Tersedia</div>
          <div className="col-span-2 text-center">Aksi</div>
        </div>

        {(!kosts || kosts.length === 0) ? (
          <p className="text-center py-8 text-sm text-gray-400">Belum ada data kost.</p>
        ) : (
          kosts.map((kost) => (
            <div key={kost.id} className="grid grid-cols-12 px-6 py-4 border-b border-gray-50 items-center hover:bg-gray-50/50 transition">
              <div className="col-span-5">
                <h3 className="font-semibold text-gray-900 text-sm">{kost.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{kost.area} • {kost.address}</p>
              </div>
              <div className="col-span-3 text-sm font-medium text-gray-700">
                Rp {Number(kost.price).toLocaleString('id-ID')}
              </div>
              <div className="col-span-2 text-sm text-gray-600">
                {kost.rooms || 2} Kamar
              </div>
              <div className="col-span-2 flex justify-center gap-2">
                <button 
                  onClick={() => openEditModal(kost)}
                  className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium text-xs rounded-lg transition"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(kost.id)}
                  className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 font-medium text-xs rounded-lg transition"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Navigasi Pagination */}
<div className="flex justify-between items-center mt-6 px-2">
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage <= 1}
    className={`px-4 py-2 rounded-xl text-xs font-bold transition select-none ${
      currentPage <= 1 
        ? 'bg-gray-100 text-gray-300 cursor-not-allowed pointer-events-none' 
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer'
    }`}
  >
    Previously
  </button>

  <span className="text-xs font-bold text-gray-700">
    Page {currentPage} of {lastPage || 1}
  </span>

  <button
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, lastPage))}
    disabled={currentPage >= lastPage}
    className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition select-none ${
      currentPage >= lastPage 
        ? 'bg-emerald-300 cursor-not-allowed pointer-events-none' 
        : 'bg-emerald-600 hover:bg-emerald-700 cursor-pointer'
    }`}
  >
    Furthermore
  </button>
</div>

      {/* Modal Edit */}
      {isModalOpen && selectedKost && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-xl p-6 rounded-2xl shadow-xl my-8 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Data Kost</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nama Kost</label>
                <input 
                  type="text" 
                  value={selectedKost.name || ''}
                  onChange={(e) => setSelectedKost({...selectedKost, name: e.target.value})}
                  className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Alamat Lengkap</label>
                <input 
                  type="text" 
                  value={selectedKost.address || ''}
                  onChange={(e) => setSelectedKost({...selectedKost, address: e.target.value})}
                  className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Wilayah (Area)</label>
                  <select 
                    value={selectedKost.area || 'Jakarta Selatan'}
                    onChange={(e) => setSelectedKost({...selectedKost, area: e.target.value})}
                    className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-emerald-500 bg-white"
                  >
                    <option value="Jakarta Selatan">Jakarta Selatan</option>
                    <option value="Jakarta Barat">Jakarta Barat</option>
                    <option value="Jakarta Timur">Jakarta Timur</option>
                    <option value="Jakarta Pusat">Jakarta Pusat</option>
                    <option value="Fatmawati">Fatmawati</option>
                    <option value="Pondok Indah">Pondok Indah</option>
                    <option value="Pesanggrahan">Pesanggrahan</option>
                    <option value="Cipete">Cipete</option>
                    <option value="Tebet">Tebet</option>
                    <option value="Setiabudi">Setiabudi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Harga per Bulan</label>
                  <input 
                    type="number" 
                    value={selectedKost.price || ''}
                    onChange={(e) => setSelectedKost({...selectedKost, price: e.target.value})}
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
                    value={selectedKost.rooms || ''}
                    onChange={(e) => setSelectedKost({...selectedKost, rooms: e.target.value})}
                    className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tahun Dibangun</label>
                  <input 
                    type="number" 
                    value={selectedKost.years || ''}
                    onChange={(e) => setSelectedKost({...selectedKost, years: e.target.value})}
                    className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fasilitas (Pisahkan dengan koma)</label>
                <input 
                  type="text" 
                  value={selectedKost.facilities || ''}
                  onChange={(e) => setSelectedKost({...selectedKost, facilities: e.target.value})}
                  className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Deskripsi Lengkap</label>
                <textarea 
                  rows="3"
                  value={selectedKost.description || ''}
                  onChange={(e) => setSelectedKost({...selectedKost, description: e.target.value})}
                  className="w-full border border-gray-200 p-3 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
                  required 
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl shadow-sm"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}