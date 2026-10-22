import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CardWrapper from '../../components/CardWrapper';
import Button from '../../components/Button';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Mengambil data riwayat pemesanan dari localStorage (atau data dummy jika kosong)
    const savedBookings = JSON.parse(localStorage.getItem('hunika_bookings')) || [
      {
        id: 'BOOK-001',
        namaKost: 'Kost Melati Depok',
        lokasi: 'Jl. Margonda Raya, Depok',
        harga: 1500000,
        durasi: '3 Bulan',
        tanggal: '2026-10-18',
        status: 'Dikonfirmasi',
        statusType: 'success' // success, pending, cancelled
      },
      {
        id: 'BOOK-002',
        namaKost: 'Kost Eksklusif Cakrawala',
        lokasi: 'Kukusan, Beji, Depok',
        harga: 2200000,
        durasi: '6 Bulan',
        tanggal: '2026-10-10',
        status: 'Menunggu Pembayaran',
        statusType: 'pending'
      }
    ];
    setBookings(savedBookings);
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      {/* Header Halaman */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Riwayat Pemesanan</h1>
          <p className="text-sm text-gray-500 mt-1">Daftar kos dan status sewa yang pernah kamu ajukan</p>
        </div>
        <Button variant="emerald" onClick={() => navigate('/')}>
          + Cari Kos Lain
        </Button>
      </div>

      {/* Daftar Riwayat Pemesanan */}
      <div className="space-y-4">
        {bookings.length === 0 ? (
          <CardWrapper>
            <div className="text-center py-8 text-gray-400">
              <p>Belum ada riwayat pemesanan kos.</p>
            </div>
          </CardWrapper>
        ) : (
          bookings.map((item) => (
            <CardWrapper key={item.id}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                
                {/* Informasi Kos */}
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.id}</span>
                    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${
                      item.statusType === 'success' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{item.namaKost}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{item.lokasi}</p>
                  
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-600">
                    <span>Durasi: <strong className="text-gray-900">{item.durasi}</strong></span>
                    <span>Tanggal: <strong className="text-gray-900">{item.tanggal}</strong></span>
                  </div>
                </div>

                {/* Harga & Tombol Aksi */}
                <div className="flex flex-col md:items-end justify-between w-full md:w-auto gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                  <div className="text-left md:text-right">
                    <span className="text-xs text-gray-400 block">Total Pembayaran</span>
                    <span className="text-base font-bold text-emerald-700">Rp {item.harga.toLocaleString('id-ID')}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="blue" onClick={() => alert(`Melihat detail pesanan: ${item.id}`)}>
                      Detail
                    </Button>
                  </div>
                </div>

              </div>
            </CardWrapper>
          ))
        )}
      </div>
    </main>
  );
}