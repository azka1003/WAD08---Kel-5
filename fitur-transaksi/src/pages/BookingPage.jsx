import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getKostById, fmt } from '../data/dataKost'
import Navbar from '../components/Navbar'
import Breadcrumb from '../components/Breadcrumb'

export default function BookingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const kost = getKostById(id)
  const [selectedRoom, setSelectedRoom] = useState(kost.roomTypes[0])
  const [checkin, setCheckin] = useState('')
  const [duration, setDuration] = useState(1)
  const [form, setForm] = useState({ nama:'', email:'', phone:'', gender:'', birthdate:'', job:'', instansi:'', alamat:'', emergencyName:'', emergencyPhone:'' })

  const discounts = { 1:0, 3:0, 6:0.05, 12:0.10 }
  const discount  = discounts[duration] || 0
  const subtotal  = selectedRoom.price * duration
  const saving    = subtotal * discount
  const total     = subtotal - saving

  const checkoutDate = () => {
    if (!checkin) return '–'
    const d = new Date(checkin)
    d.setMonth(d.getMonth() + Number(duration))
    return d.toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })
  }

  const handleSubmit = () => {
    if (!checkin || !form.nama || !form.email || !form.phone) {
      alert('Mohon lengkapi data wajib terlebih dahulu.')
      return
    }
    const booking = { kostId: kost.id, roomName: selectedRoom.name, roomPrice: selectedRoom.price, checkin, duration, total, ...form }
    localStorage.setItem('bookingData', JSON.stringify(booking))
    navigate(`/transaksi/${kost.id}`)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800">
      <Navbar backTo={`/detail/${kost.id}`} backLabel="Kembali ke Detail" />

      <div className="max-w-6xl mx-auto px-6 pt-5 pb-2">
        <Breadcrumb items={[
          { to:'/', label:'Beranda' },
          { to:`/detail/${kost.id}`, label:'Detail Kost' },
          { label:'Booking' }
        ]} />
      </div>

      {/* STEP INDICATOR */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="flex items-center justify-center gap-0 max-w-lg mx-auto">
          {['Data Diri','Konfirmasi','Pembayaran'].map((s,i) => (
            <div key={i} className="flex items-center">
              {i > 0 && <div className="w-16 h-0.5 bg-gray-200 mx-2"/>}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm ${i === 0 ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-400 border-gray-200'}`}>{i+1}</div>
                <span className={`text-xs mt-1 font-medium ${i === 0 ? 'text-green-700 font-semibold' : 'text-gray-400'}`}>{s}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">

          {/* RINGKASAN KOST */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-bold text-gray-800 mb-4">Kost yang Dipilih</h2>
            <div className="flex gap-4">
              <img src={kost.photo} alt={kost.name} className="w-28 h-24 object-cover rounded-xl flex-shrink-0"/>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg">{kost.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{kost.area}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-yellow-400 text-sm">{kost.stars}</span>
                  <span className="text-sm font-semibold text-gray-700">{kost.rating}</span>
                  <span className="text-xs text-gray-400">({kost.reviews} ulasan)</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Tipe: <span className="font-semibold text-gray-700">{kost.type}</span></p>
              </div>
            </div>
          </div>

          {/* PILIH KAMAR */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-bold text-gray-800 mb-4">Pilih Tipe Kamar</h2>
            <div className="space-y-3">
              {kost.roomTypes.map((r,i) => (
                <div key={i}
                  onClick={() => setSelectedRoom(r)}
                  className={`border-2 rounded-xl p-4 cursor-pointer transition ${selectedRoom.name === r.name ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-gray-800">{r.name} <span className="text-xs text-gray-500 font-normal">({r.size} · {r.bed})</span></h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {r.extras.map((e,j) => <span key={j} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{e}</span>)}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">{fmt(r.price)}/bln</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === 'Tersedia' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{r.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* JADWAL */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-bold text-gray-800 mb-4">Jadwal Sewa</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Tanggal Masuk <span className="text-red-500">*</span></label>
                <input type="date" value={checkin} onChange={e => setCheckin(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500"/>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Durasi Sewa <span className="text-red-500">*</span></label>
                <select value={duration} onChange={e => setDuration(Number(e.target.value))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-green-500">
                  <option value={1}>1 Bulan</option>
                  <option value={3}>3 Bulan</option>
                  <option value={6}>6 Bulan (hemat 5%)</option>
                  <option value={12}>12 Bulan (hemat 10%)</option>
                </select>
              </div>
            </div>
            <div className="mt-4 bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex justify-between">
              <span className="text-sm text-gray-600 font-medium">Perkiraan Tanggal Keluar</span>
              <span className="text-sm font-bold text-green-700">{checkoutDate()}</span>
            </div>
          </div>

          {/* DATA PENYEWA */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-bold text-gray-800 mb-4">Data Penyewa</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Masukkan nama lengkap sesuai KTP" value={form.nama} onChange={e => setForm({...form, nama:e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500"/>
              </div>
              {[['email','Email','email','contoh@email.com'],['phone','Nomor HP / WhatsApp','tel','08xx-xxxx-xxxx'],['instansi','Instansi / Kampus / Perusahaan','text','Nama tempat bekerja atau kuliah']].map(([key,label,type,ph]) => (
                <div key={key}>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">{label} {key !== 'instansi' && <span className="text-red-500">*</span>}</label>
                  <input type={type} placeholder={ph} value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500"/>
                </div>
              ))}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Jenis Kelamin <span className="text-red-500">*</span></label>
                <select value={form.gender} onChange={e => setForm({...form,gender:e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-green-500">
                  <option value="">Pilih jenis kelamin</option>
                  <option>Laki-laki</option><option>Perempuan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Tanggal Lahir <span className="text-red-500">*</span></label>
                <input type="date" value={form.birthdate} onChange={e => setForm({...form,birthdate:e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500"/>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Pekerjaan <span className="text-red-500">*</span></label>
                <select value={form.job} onChange={e => setForm({...form,job:e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-green-500">
                  <option value="">Pilih pekerjaan</option>
                  <option>Mahasiswa</option><option>Karyawan Swasta</option><option>PNS / ASN</option><option>Wiraswasta</option><option>Profesional Freelance</option><option>Lainnya</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Alamat Asal <span className="text-red-500">*</span></label>
                <textarea rows={3} placeholder="Jl. Nama Jalan No. XX, Kecamatan, Kota, Provinsi" value={form.alamat} onChange={e => setForm({...form,alamat:e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 resize-none"/>
              </div>
            </div>
          </div>

          <button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition text-base">
            Lanjut ke Pembayaran →
          </button>
        </div>

        {/* RINGKASAN PEMBAYARAN */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-20">
            <h2 className="text-base font-bold text-gray-800 mb-4">Ringkasan Pembayaran</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Tipe Kamar</span><span className="font-semibold">{selectedRoom.name}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Harga / Bulan</span><span className="font-semibold">{fmt(selectedRoom.price)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Durasi</span><span className="font-semibold">{duration} bulan</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-semibold">{fmt(subtotal)}</span></div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Diskon {(discount*100).toFixed(0)}%</span>
                  <span className="font-semibold">-{fmt(saving)}</span>
                </div>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-extrabold text-green-600 text-lg">{fmt(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
