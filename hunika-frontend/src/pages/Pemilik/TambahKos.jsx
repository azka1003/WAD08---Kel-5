import React, { useState, useRef } from 'react';
import {useContext} from "react";
import { KostContext } from "../../context/KostContext";
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar'; 
import CardWrapper from '../../components/CardWrapper'; 
import Button from '../../components/Button'; 

function TambahKos({onViewChange}) {
  const { kosts, updateKost } = useContext(KostContext);

  const handleTambah = (dataBaru) => {
    const kostBaru = { ...dataBaru, id: Date.now() }; // Tambahkan ID unik
    updateKost([...kosts, kostBaru]); // Simpan ke Context & LocalStorage
    alert("Kost berhasil ditambah!");
};

  const [formData, setFormData] = useState({
    namaKos: '',
    wilayah: 'Jakarta Selatan',
    harga: '',
    deskripsi: '',
  });

 
  const [fasilitas, setFasilitas] = useState({
    wifi: false,
    ac: false,
    kamarMandiDalam: false,
    kasurLemari: false,
  });

  
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 
  const handleCheckboxChange = (name) => {
    setFasilitas((prev) => ({ ...prev, [name]: !prev[name] }));
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

 
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };


 const handleSubmit = (e) => {
  e.preventDefault();
  const kosBaru = {
    id: Date.now(), // Bikin ID unik otomatis pakai waktu saat ini
    name: formData.namaKos, // Ambil dari input Nama Kos
    loc: formData.wilayah,  // Ambil dari input Wilayah
    price: Number(formData.harga), // Pastikan harga jadi angka
    status: 'Tersedia',
    statusType: 'available',
    // Bisa kasih gambar default kalau belum ada fitur upload sungguhan
    img: "/images-hunika/1.jpg" 
  };
  updateKost([...kosts, kosBaru]);
  alert("Informasi kos berhasil disimpan!");
  navigate('/dashboard-pemilik');
 };

  
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans antialiased selection:bg-emerald-500/10">
      
     
      {/* <Navbar isLoggedIn={true} role="pemilik" /> */}

      
      <main className="max-w-3xl mx-auto px-6 py-10">
        
        <form onSubmit={handleSubmit}>
          
          <div className="flex justify-between items-center mb-8">
            <div>
              
              <button 
                type="button"
                onClick={() => onViewChange('DashboardPemilik')}
                className="text-xs text-gray-400 font-semibold hover:text-emerald-600 flex items-center gap-1.5 mb-1 group transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 transform group-hover:-translate-x-0.5 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Kembali ke Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Tambah Kos Baru</h1>
            </div>
            
            
            <Button variant="emerald" type="submit">
              Simpan Info Kos
            </Button>
          </div>

          
          <CardWrapper>
            <div className="flex flex-col gap-6 p-2">
              
              {/* 1. INFORMASI UMUM */}
              <div>
                <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-emerald-50 flex items-center justify-center text-[10px]">1</span>
                  Informasi Umum
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-gray-400 block mb-1.5">Input Nama Kos</label>
                    <input 
                      type="text" 
                      name="namaKos"
                      value={formData.namaKos}
                      onChange={handleInputChange}
                      placeholder="Contoh: Kos Hunika Executive Putri" 
                      className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200/80 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-1.5">Wilayah</label>
                    <div className="relative">
                      <select 
                        name="wilayah"
                        value={formData.wilayah}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200/80 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white text-gray-700 transition-all appearance-none cursor-pointer"
                      >
                        <option value="Jakarta Selatan">Jakarta Selatan</option>
                        <option value="Jakarta Barat">Jakarta Barat</option>
                        <option value="Jakarta Timur">Jakarta Timur</option>
                        <option value="Jakarta Pusat">Jakarta Pusat</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-400 block mb-1.5">Harga Sewa Bulanan (Rp)</label>
                    <input 
                      type="number" 
                      name="harga"
                      value={formData.harga}
                      onChange={handleInputChange}
                      placeholder="Contoh: 1500000" 
                      className="w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200/80 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* 2. FASILITAS KOS */}
              <div>
                <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-emerald-50 flex items-center justify-center text-[10px]">2</span>
                  Fasilitas Kos
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  {/* Checkbox: WiFi */}
                  <label className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${fasilitas.wifi ? 'bg-white border-emerald-500 shadow-sm' : 'bg-transparent border-transparent hover:bg-gray-100/50'}`}>
                    <span className="text-xs text-gray-600 font-medium">Free Wi-Fi</span>
                    <input 
                      type="checkbox" 
                      checked={fasilitas.wifi}
                      onChange={() => handleCheckboxChange('wifi')}
                      className="w-4 h-4 accent-emerald-500 rounded border-gray-300"
                    />
                  </label>

                  {/* Checkbox: AC */}
                  <label className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${fasilitas.ac ? 'bg-white border-emerald-500 shadow-sm' : 'bg-transparent border-transparent hover:bg-gray-100/50'}`}>
                    <span className="text-xs text-gray-600 font-medium">AC</span>
                    <input 
                      type="checkbox" 
                      checked={fasilitas.ac}
                      onChange={() => handleCheckboxChange('ac')}
                      className="w-4 h-4 accent-emerald-500 rounded border-gray-300"
                    />
                  </label>

                  {/* Checkbox: Kamar Mandi Dalam */}
                  <label className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${fasilitas.kamarMandiDalam ? 'bg-white border-emerald-500 shadow-sm' : 'bg-transparent border-transparent hover:bg-gray-100/50'}`}>
                    <span className="text-xs text-gray-600 font-medium">KM Dalam</span>
                    <input 
                      type="checkbox" 
                      checked={fasilitas.kamarMandiDalam}
                      onChange={() => handleCheckboxChange('kamarMandiDalam')}
                      className="w-4 h-4 accent-emerald-500 rounded border-gray-300"
                    />
                  </label>

                  {/* Checkbox: Kasur & Lemari */}
                  <label className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer select-none ${fasilitas.kasurLemari ? 'bg-white border-emerald-500 shadow-sm' : 'bg-transparent border-transparent hover:bg-gray-100/50'}`}>
                    <span className="text-xs text-gray-600 font-medium">Furnished</span>
                    <input 
                      type="checkbox" 
                      checked={fasilitas.kasurLemari}
                      onChange={() => handleCheckboxChange('kasurLemari')}
                      className="w-4 h-4 accent-emerald-500 rounded border-gray-300"
                    />
                  </label>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* 3. UPLOAD GAMBAR */}
              <div>
                <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-emerald-50 flex items-center justify-center text-[10px]">3</span>
                  Upload Gambar
                </h2>

                <div 
                  onClick={triggerFileInput}
                  className="relative border-2 border-dashed border-gray-200 rounded-2xl p-6 bg-gray-50/50 flex flex-col items-center justify-center text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/5 transition-all group overflow-hidden min-h-[160px]"
                >
                  {imagePreview ? (
                    <div className="absolute inset-0 w-full h-full p-2 bg-white flex items-center justify-center">
                      <img 
                        src={imagePreview} 
                        alt="Preview Kos" 
                        className="w-full h-full object-cover rounded-xl shadow-inner"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold rounded-xl gap-1">
                        <svg xmlns="http://www.w3.org/2000/xl" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        Ganti Gambar
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-lg font-bold group-hover:bg-emerald-500 group-hover:text-white transition-all mb-2"> + </div>
                      <p className="text-xs font-semibold text-gray-600">Unggah Gambar Kos</p>
                      <p className="text-[10px] text-gray-400 mt-1">PNG, JPG, atau JPEG</p>
                    </>
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

              <hr className="border-gray-100" />

              {/* 4. DESKRIPSI LENGKAP */}
              <div>
                <h2 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-emerald-50 flex items-center justify-center text-[10px]">4</span>
                  Deskripsi Lengkap
                </h2>

                <div>
                  <label className="text-xs font-medium text-gray-400 block mb-1.5">Berikan Informasi Lengkap Kos Disini</label>
                  <textarea 
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleInputChange}
                    rows="6" 
                    placeholder="Tulis deskripsi lengkap mengenai peraturan kos, akses kunci 24 jam, jarak ke kampus, dsb..." 
                    className="w-full px-4 py-4 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-emerald-500 focus:bg-white text-gray-700 leading-relaxed transition-all shadow-inner resize-y"
                    required
                  ></textarea>
                </div>
              </div>

            </div>
          </CardWrapper>
        </form>

      </main>
    </div>
  );
}

export default TambahKos;