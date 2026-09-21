import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getKostById, fmt } from '../data/dataKost'
import Navbar from '../components/Navbar'
import Breadcrumb from '../components/Breadcrumb'

export default function DetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const kost = getKostById(id)
  const [activeTab, setActiveTab] = useState('fasilitas')

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800">
      <Navbar backTo="/" backLabel="Kembali ke Daftar Kost" />

      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="pt-5 pb-2">
          <Breadcrumb items={[
            { to: '/', label: 'Beranda' },
            { label: 'Detail Kost' },
            { label: kost.name },
          ]} />
        </div>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6 mt-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Tersedia</span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-600">{kost.type}</span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 text-purple-600">{kost.tier}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">{kost.name}</h1>
            <p className="text-gray-500 text-sm flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              </svg>
              {kost.address}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-yellow-400">{kost.stars}</span>
              <span className="font-bold text-gray-800 text-sm">{kost.rating}</span>
              <span className="text-gray-400 text-sm">({kost.reviews} ulasan)</span>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:text-red-500 transition bg-white self-start">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
            </svg>
            Simpan
          </button>
        </div>

        {/* MAIN 2-COL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* FOTO */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <img src={kost.photo} alt={kost.name} className="w-full h-96 object-cover"/>
              <div className="p-4 flex items-center justify-between">
                <p className="text-sm text-gray-500 font-medium">{kost.name} — Foto Utama</p>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {kost.rooms} kamar tersedia
                </div>
              </div>
            </div>

            {/* DESKRIPSI */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Tentang Kost</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">{kost.desc1}</p>
              <p className="text-gray-600 text-sm leading-relaxed">{kost.desc2}</p>
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
                <div className="text-center"><p className="text-xl font-bold text-green-600">{kost.rooms}</p><p className="text-xs text-gray-400">Total Kamar</p></div>
                <div className="text-center"><p className="text-xl font-bold text-green-600">{kost.years}+</p><p className="text-xs text-gray-400">Tahun Berdiri</p></div>
                <div className="text-center"><p className="text-xl font-bold text-green-600">{kost.rating}</p><p className="text-xs text-gray-400">Rating</p></div>
              </div>
            </div>

            {/* TABS */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="flex border-b border-gray-100">
                {['fasilitas','kamar','ulasan'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-sm font-semibold capitalize transition ${activeTab === tab ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500 hover:text-gray-700'}`}>
                    {tab === 'fasilitas' ? 'Fasilitas' : tab === 'kamar' ? 'Tipe Kamar' : 'Ulasan'}
                  </button>
                ))}
              </div>
              <div className="p-6">
                {activeTab === 'fasilitas' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">Fasilitas Kamar</h3>
                      <ul className="space-y-2">
                        {kost.fasKamar.map((f,i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                            <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                            </svg>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">Fasilitas Umum</h3>
                      <ul className="space-y-2">
                        {kost.fasUmum.map((f,i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                            <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                            </svg>
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                {activeTab === 'kamar' && (
                  <div className="space-y-4">
                    {kost.roomTypes.map((r,i) => (
                      <div key={i} className="border border-gray-200 rounded-xl p-4 hover:border-green-400 transition">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-gray-800">{r.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">{r.size} · Kasur {r.bed}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {r.extras.map((e,j) => (
                                <span key={j} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{e}</span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600 text-lg">{fmt(r.price)}</p>
                            <p className="text-xs text-gray-400">/bulan</p>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${r.status === 'Tersedia' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{r.status}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {activeTab === 'ulasan' && (
                  <div className="space-y-4">
                    {kost.reviewList.map((r,i) => (
                      <div key={i} className="border border-gray-100 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${r.color}`}>{r.init}</div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{r.name}</p>
                            <p className="text-xs text-gray-400">{r.date}</p>
                          </div>
                          <span className="ml-auto text-yellow-400 text-sm">{r.stars}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{r.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SIDEBAR BOOKING */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-20">
              <div className="flex items-end gap-1 mb-1">
                <span className="text-2xl font-extrabold text-green-600">{fmt(kost.price)}</span>
                <span className="text-gray-400 text-sm mb-0.5">/bulan</span>
              </div>
              <p className="text-xs text-gray-400 mb-4">Mulai dari harga kamar Standar</p>
              <button
                onClick={() => navigate(`/booking/${kost.id}`)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition mb-3 text-sm"
              >
                Booking Sekarang
              </button>
              <button className="w-full border border-green-600 text-green-600 hover:bg-green-50 font-semibold py-3 rounded-xl transition text-sm">
                Hubungi Pemilik
              </button>
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
                <div className="flex justify-between text-gray-600"><span>Total Kamar</span><span className="font-semibold">{kost.rooms} kamar</span></div>
                <div className="flex justify-between text-gray-600"><span>Tipe Kost</span><span className="font-semibold">{kost.type}</span></div>
                <div className="flex justify-between text-gray-600"><span>Rating</span><span className="font-semibold text-yellow-500">★ {kost.rating}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
