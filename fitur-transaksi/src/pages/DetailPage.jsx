import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Breadcrumb from '../components/Breadcrumb'

const API_URL = 'http://127.0.0.1:8000/api/kost'

function fmt(price) {
  return `Rp ${Number(price).toLocaleString('id-ID')}`
}

export default function DetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [kost, setKost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('fasilitas')

  useEffect(() => {
    fetch(`${API_URL}/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Kost tidak ditemukan')
        }
        return res.json()
      })
      .then((result) => {
        setKost(result.data)
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-gray-500">Memuat detail kost...</p>
      </div>
    )
  }

  if (error || !kost) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            {error || 'Kost tidak ditemukan'}
          </p>

          <button
            onClick={() => navigate('/')}
            className="bg-green-600 text-white px-5 py-2 rounded-xl"
          >
            Kembali
          </button>
        </div>
      </div>
    )
  }

const facilities = Array.isArray(kost.facilities)
  ? kost.facilities
  : []
  return (
    <div className="min-h-screen bg-slate-50 text-gray-800">
      <Navbar backTo="/" backLabel="Kembali ke Daftar Kost" />

      <div className="max-w-7xl mx-auto px-6 pb-16">

        {/* BREADCRUMB */}
        <div className="pt-5 pb-2">
          <Breadcrumb
            items={[
              { to: '/', label: 'Beranda' },
              { label: 'Detail Kost' },
              { label: kost.name },
            ]}
          />
        </div>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6 mt-4">
          <div>

            <div className="flex items-center gap-2 mb-2">
              <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                Tersedia
              </span>

              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                {kost.type}
              </span>

              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 text-purple-600">
                {kost.tier}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
              {kost.name}
            </h1>

            <p className="text-gray-500 text-sm flex items-center gap-1">
              📍 {kost.address}
            </p>

            <div className="flex items-center gap-2 mt-2">
              <span className="text-yellow-400">
                ★
              </span>

              <span className="font-bold text-gray-800 text-sm">
                {kost.rating}
              </span>

              <span className="text-gray-400 text-sm">
                ({kost.reviews} ulasan)
              </span>
            </div>

          </div>

          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:text-red-500 transition bg-white self-start">
            ♡
            Simpan
          </button>
        </div>

        {/* MAIN */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* FOTO */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <img
                src={kost.img}
                alt={kost.name}
                className="w-full h-96 object-cover"
              />

              <div className="p-4 flex items-center justify-between">
                <p className="text-sm text-gray-500 font-medium">
                  {kost.name} — Foto Utama
                </p>

                <div className="flex items-center gap-1 text-sm text-gray-500">
                  📷
                  {kost.rooms} kamar tersedia
                </div>
              </div>
            </div>

            {/* DESKRIPSI */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-3">
                Tentang Kost
              </h2>

              <p className="text-gray-600 text-sm leading-relaxed">
                {kost.description}
              </p>

              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">

                <div className="text-center">
                  <p className="text-xl font-bold text-green-600">
                    {kost.rooms}
                  </p>
                  <p className="text-xs text-gray-400">
                    Total Kamar
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-xl font-bold text-green-600">
                    {kost.years}+
                  </p>
                  <p className="text-xs text-gray-400">
                    Tahun Berdiri
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-xl font-bold text-green-600">
                    {kost.rating}
                  </p>
                  <p className="text-xs text-gray-400">
                    Rating
                  </p>
                </div>

              </div>
            </div>

            {/* TABS */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">

              <div className="flex border-b border-gray-100">
                {['fasilitas', 'kamar', 'ulasan'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-sm font-semibold capitalize transition ${
                      activeTab === tab
                        ? 'border-b-2 border-green-500 text-green-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab === 'fasilitas'
                      ? 'Fasilitas'
                      : tab === 'kamar'
                      ? 'Tipe Kamar'
                      : 'Ulasan'}
                  </button>
                ))}
              </div>

              <div className="p-6">

                {/* FASILITAS */}
                {activeTab === 'fasilitas' && (
                  <div>
                    <h3 className="font-bold text-gray-700 mb-3 text-sm uppercase tracking-wide">
                      Fasilitas Kost
                    </h3>

                    <ul className="space-y-2">
                      {facilities.map((facility, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <span className="text-green-500">
                            ✓
                          </span>
                          {facility}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* TIPE KAMAR */}
                {activeTab === 'kamar' && (
                  <div className="border border-gray-200 rounded-xl p-4">

                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-gray-800">
                          {kost.type}
                        </h4>

                        <p className="text-xs text-gray-500 mt-1">
                          Tipe kamar {kost.type}
                        </p>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {facilities.map((facility, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full"
                            >
                              {facility}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-green-600 text-lg">
                          {fmt(kost.price)}
                        </p>

                        <p className="text-xs text-gray-400">
                          /bulan
                        </p>

                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block bg-green-100 text-green-700">
                          Tersedia
                        </span>
                      </div>
                    </div>

                  </div>
                )}

                {/* ULASAN */}
                {activeTab === 'ulasan' && (
                  <div className="text-center py-6">
                    <p className="text-gray-500 text-sm">
                      Belum ada data ulasan detail.
                    </p>

                    <p className="text-gray-400 text-xs mt-1">
                      Total {kost.reviews} ulasan
                    </p>
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* SIDEBAR */}
          <div className="space-y-4">

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-20">

              <div className="flex items-end gap-1 mb-1">
                <span className="text-2xl font-extrabold text-green-600">
                  {fmt(kost.price)}
                </span>

                <span className="text-gray-400 text-sm mb-0.5">
                  /bulan
                </span>
              </div>

              <p className="text-xs text-gray-400 mb-4">
                Mulai dari harga kamar {kost.type}
              </p>

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

                <div className="flex justify-between text-gray-600">
                  <span>Total Kamar</span>
                  <span className="font-semibold">
                    {kost.rooms} kamar
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Tipe Kost</span>
                  <span className="font-semibold">
                    {kost.type}
                  </span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Rating</span>
                  <span className="font-semibold text-yellow-500">
                    ★ {kost.rating}
                  </span>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}