import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { KostContext } from '../../context/KostContext';
import { fmt } from '../../data/dataKost';
import Navbar from '../../components/Navbar';
import Breadcrumb from '../../components/Breadcrumb';

const BANKS = [
  { id:'bca',  name:'BCA',      norek:'1234567890', an:'PT Hunika Digital' },
  { id:'bni',  name:'BNI',      norek:'9876543210', an:'PT Hunika Digital' },
  { id:'bri',  name:'BRI',      norek:'1122334455', an:'PT Hunika Digital' },
  { id:'mand', name:'Mandiri',  norek:'5566778899', an:'PT Hunika Digital' },
];

export default function TransaksiPage() {
  const { id } = useParams();
  const { kosts } = useContext(KostContext);
  console.log("Data kosts dari context:", kosts);
  const kost = kosts.find((k) => Number(k.id) === Number(id));
  
  const [booking, setBooking] = useState(null);
  const [method, setMethod]   = useState('transfer');
  const [bank, setBank]       = useState('bca');
  const [copied, setCopied]   = useState(false);
  const [file, setFile]       = useState(null);
  const [success, setSuccess] = useState(false);
  const [invoiceNo] = useState(() => 'HNK-' + Date.now().toString().slice(-8));

  useEffect(() => {
    const data = localStorage.getItem('bookingData');
    if (data) setBooking(JSON.parse(data));
  }, []);

  if (!kost) return <div className="p-10 text-center">Memuat data...</div>;

  const selectedBank = BANKS.find(b => b.id === bank);

  const handleConfirm = () => {
    if (method === 'transfer' && !file) {
      alert('Mohon upload bukti transfer terlebih dahulu.');
      return;
    }
    setSuccess(true);
    localStorage.removeItem('bookingData');
  };

  const copyNorek = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    alert("Nomor rekening berhasil disalin!");
  }).catch(err => {
    console.error("Gagal menyalin: ", err);
  });
};

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6">
        <div className="bg-white rounded-3xl shadow-lg p-10 max-w-md w-full text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Pembayaran Dikonfirmasi!</h2>
                  <p className="text-gray-500 text-sm mb-2">No. Invoice: <span className="font-bold text-gray-800">{invoiceNo}</span></p>
                  <p className="text-gray-500 text-sm mb-6">Tim Hunika akan menghubungi kamu dalam 1×24 jam untuk konfirmasi lebih lanjut.</p>
                  <div className="bg-green-50 rounded-2xl p-4 mb-6 text-left space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-gray-500">Kost</span><span className="font-semibold">{kost.name}</span></div>
                    {booking && <>
                      <div className="flex justify-between"><span className="text-gray-500">Kamar</span><span className="font-semibold">{booking.roomName}</span></div>
                      <div className="flex justify-between"><span className="text-gray-500">Total</span><span className="font-bold text-green-600">{fmt(booking.total)}</span></div>
                    </>}
                  </div>
                  <Link to="/" className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition text-sm">
                    Kembali ke Beranda
                  </Link>
                </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-slate-50 text-gray-800">
        <Navbar backTo={`/booking/${id}`} backLabel="Kembali ke Booking" />
  
        <div className="max-w-6xl mx-auto px-6 pt-5 pb-2">
          <Breadcrumb items={[
            { to:'/', label:'Beranda' },
            { to:`/detail/${id}`, label:'Detail Kost' },
            { to:`/booking/${id}`, label:'Booking' },
            { label:'Pembayaran' }
          ]} />
        </div>
  
        {/* STEP INDICATOR */}
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center gap-0 max-w-lg mx-auto">
            {['Data Diri','Konfirmasi','Pembayaran'].map((s,i) => (
              <div key={i} className="flex items-center">
                {i > 0 && <div className={`w-16 h-0.5 mx-2 ${i <= 2 ? 'bg-green-500' : 'bg-gray-200'}`}/>}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm ${i < 2 ? 'bg-green-100 text-green-700 border-green-500' : 'bg-green-500 text-white border-green-500'}`}>
                    {i < 2 ? '✓' : i+1}
                  </div>
                  <span className={`text-xs mt-1 font-medium ${i === 2 ? 'text-green-700 font-semibold' : 'text-green-600'}`}>{s}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
  
        <div className="max-w-6xl mx-auto px-6 pb-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
  
            {/* PILIH METODE */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-base font-bold text-gray-800 mb-4">Metode Pembayaran</h2>
              <div className="grid grid-cols-2 gap-3">
                {[['transfer','Transfer Bank'],['ewallet','E-Wallet'],['virtual','Virtual Account'],['cash','Bayar Cash']].map(([val,label]) => (
                  <div key={val} onClick={() => setMethod(val)}
                    className={`border-2 rounded-xl p-4 cursor-pointer text-center transition ${method === val ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'}`}>
                    <p className="font-semibold text-sm text-gray-700">{label}</p>
                  </div>
                ))}
              </div>
            </div>
  
            {/* DETAIL TRANSFER */}
            {method === 'transfer' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h2 className="text-base font-bold text-gray-800 mb-4">Pilih Bank Tujuan</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                  {BANKS.map(b => (
                    <button key={b.id} onClick={() => setBank(b.id)}
                      className={`border-2 rounded-xl py-3 font-bold text-sm transition ${bank === b.id ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-600 hover:border-green-300'}`}>
                      {b.name}
                    </button>
                  ))}
                </div>
                <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-4">
                  <p className="text-xs text-gray-500 mb-1">No. Rekening Bank {selectedBank.name}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-gray-900 text-xl tracking-widest">{selectedBank.norek}</span>
                    <button onClick={copyNorek} className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition ${copied ? 'bg-green-200 text-green-800' : 'bg-green-600 text-white hover:bg-green-700'}`}>
                      {copied ? '✓ Tersalin' : 'Salin'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">a.n. <span className="font-semibold text-gray-700">{selectedBank.an}</span></p>
                </div>
  
                <h3 className="font-bold text-gray-700 mb-3 text-sm">Upload Bukti Transfer</h3>
                <div
                  onClick={() => document.getElementById('upload-input').click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400 hover:bg-green-50'}`}>
                  <input id="upload-input" type="file" accept="image/*,.pdf" className="hidden" onChange={e => setFile(e.target.files[0])}/>
                  {file ? (
                    <div>
                      <p className="text-green-600 font-bold text-sm">✓ {file.name}</p>
                      <p className="text-xs text-gray-400 mt-1">Klik untuk ganti file</p>
                    </div>
                  ) : (
                    <div>
                      <svg className="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                      </svg>
                      <p className="text-sm text-gray-500">Klik untuk upload bukti transfer</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, atau PDF (maks. 5 MB)</p>
                    </div>
                  )}
                </div>
              </div>
            )}
  
            {method === 'ewallet' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h2 className="text-base font-bold text-gray-800 mb-4">E-Wallet</h2>
                <div className="grid grid-cols-3 gap-3">
                  {['GoPay','OVO','Dana','ShopeePay','LinkAja','QRIS'].map(w => (
                    <div key={w} className="border border-gray-200 rounded-xl p-3 text-center text-sm font-semibold text-gray-600 hover:border-green-400 hover:bg-green-50 cursor-pointer transition">{w}</div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-4 text-center">Fitur pembayaran e-wallet akan segera tersedia</p>
              </div>
            )}
  
            <button onClick={handleConfirm} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition text-base">
              Konfirmasi Pembayaran
            </button>
          </div>
  
          {/* INVOICE SIDEBAR */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-gray-800">Invoice</h2>
                <span className="text-xs text-gray-400 font-mono">{invoiceNo}</span>
              </div>
              <img src={kost.photo} alt={kost.name} className="w-full h-28 object-cover rounded-xl mb-4"/>
              <h3 className="font-bold text-gray-900 mb-1">{kost.name}</h3>
              <p className="text-xs text-gray-500 mb-4">{kost.area}</p>
              {booking && (
                <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
                  <div className="flex justify-between"><span className="text-gray-500">Penyewa</span><span className="font-semibold text-xs">{booking.nama}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Tipe Kamar</span><span className="font-semibold">{booking.roomName}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Durasi</span><span className="font-semibold">{booking.duration} bulan</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Check-in</span><span className="font-semibold text-xs">{booking.checkin}</span></div>
                  <div className="border-t border-gray-100 pt-2 flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-extrabold text-green-600">{fmt(booking.total)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
}