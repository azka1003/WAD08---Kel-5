import React, { useState } from 'react';
import{useContext} from "react";
import { KostContext } from "../../context/KostContext";
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import CardWrapper from '../../components/CardWrapper';
import Button from '../../components/Button';
import TambahKos from './TambahKos';

function DashboardPemilik() {
  const { kosts, updateKost } = useContext(KostContext);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedKos, setSelectedKos] = useState({
    nama: '',
    harga: '',
    lokasi: ''
  });

  const openEditModal = (kos) => {
    setSelectedKos({ nama: kos.name, harga: kos.price, lokasi: kos.loc });
    setIsModalOpen(true);
  };

  const closeModalEdit = () => setIsModalOpen(false);

 const handleEdit = (e) => {
  e.preventDefault(); // Mencegah halaman refresh
  
 
  const updatedData = kosts.map(k => k.id === selectedKos.id ? selectedKos : k);
  
  updateKost(updatedData); 
  setIsModalOpen(false);
  alert("Data berhasil diubah!");
};

  const handleDelete = (id) => {
  if (window.confirm("Yakin ingin menghapus kost ini?")) {
    const updatedData = kosts.filter((item) => item.id !== id);
    updateKost(updatedData); 
  }
};

 
  return (
    <>
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Owner Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Kelola Kos</p>
          </div>
          <Button onClick={()=> navigate('/tambah-kost')} variant="emerald">
            <span className="font-bold">+</span> Tambah Kos
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <CardWrapper>
            <div className="p-1">
              <span className="text-3xl font-bold text-emerald-700 block">3</span>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mt-1 block">Total Kos</span>
            </div>
          </CardWrapper>
          <CardWrapper>
            <div className="p-1">
              <span className="text-3xl font-bold text-blue-700 block">2</span>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mt-1 block">Tersedia</span>
            </div>
          </CardWrapper>
          <CardWrapper>
            <div className="p-1">
              <span className="text-3xl font-bold text-pink-700 block">0</span>
              <span className="text-xs font-semibold text-pink-600 uppercase tracking-wider mt-1 block">Penuh</span>
            </div>
          </CardWrapper>
          <CardWrapper>
            <div className="p-1">
              <span className="text-3xl font-bold text-amber-700 block">10</span>
              <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider mt-1 block">Total Review</span>
            </div>
          </CardWrapper>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="grid grid-cols-12 px-6 py-4 bg-gray-50/70 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <div className="col-span-6">Kos</div>
            <div className="col-span-2">Harga</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-center">Aksi</div>
          </div>

          {kosts.map((kos) => (
           <div key={kos.id} className="grid grid-cols-12 px-6 py-5 border-b border-gray-100 items-center hover:bg-gray-50/50 transition">
              <div className="col-span-6">
                <h3 className="font-semibold text-gray-900 text-sm">{kos.name}</h3>
                <p className="text-xs text-gray-400 mt-1">{kos.loc}</p>
              </div>
              <div className="col-span-2">Rp. {kos.price.toLocaleString('id-ID')}</div>
              <div className="col-span-2">
                <span className={`px-2.5 py-1 text-xs font-medium border rounded-full ${kos.statusType === 'available' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-900 border-amber-100'}`}>
                  {kos.status}
                </span>
              </div>
              <div className="col-span-2 flex justify-center gap-2">
                <Button variant="blue" onClick={() => { setSelectedKos(kos); setIsModalOpen(true); }}>Edit</Button>
                <Button variant="pink" onClick={() => handleDelete(kos.id)}>Hapus</Button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Data Kos</h3>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Nama Kos</label>
                <input 
                type="text"
                value={selectedKos?.name || ''} 
                onChange={(e) => setSelectedKos({...selectedKos, name: e.target.value})} 
                className="w-full border p-2 mb-3 rounded" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Harga per Bulan</label>
                <input 
                type="number"
                value={selectedKos?.price || ''} 
                onChange={(e) => setSelectedKos({...selectedKos, price: e.target.value})} 
                className="w-full border p-2 mb-3 rounded" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Lokasi</label>
                <input type="text" value={selectedKos?.loc || ''} onChange={(e) => setSelectedKos({...selectedKos, loc: e.target.value})} className="w-full border p-2 mb-3 rounded" required />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeModalEdit} className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default DashboardPemilik;