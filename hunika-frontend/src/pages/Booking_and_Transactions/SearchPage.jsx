import { useState, useMemo, useContext } from 'react';
import { KostContext } from '../context/KostContext';
import Navbar from '../components/Navbar';
import KostCard from '../components/KostCard';

export default function SearchPage() {
  // Mengambil data dari Context
  const { kosts } = useContext(KostContext);

  const [maxPrice, setMaxPrice] = useState('');
  const [fasFilter, setFasFilter] = useState([]);
  const [tipeFilter, setTipeFilter] = useState('');
  const [query, setQuery] = useState('');

  const toggleFas = (val) =>
    setFasFilter(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);

  const resetFilter = () => {
    setQuery(''); setMaxPrice(''); setFasFilter([]); setTipeFilter('');
  };

  // Menggunakan data dari kosts (Context) sebagai sumber utama
  const filtered = useMemo(() => {
    if (!kosts) return []; // Safety check jika data belum termuat
    
    return kosts.filter(k => {
      if (query && !k.name.toLowerCase().includes(query.toLowerCase()) &&
          !k.area.toLowerCase().includes(query.toLowerCase())) return false;
      if (maxPrice && k.price > Number(maxPrice)) return false;
      if (fasFilter.length) {
        const allFas = [...k.fasKamar, ...k.fasUmum].join(' ');
        if (!fasFilter.every(f => allFas.toLowerCase().includes(f.toLowerCase()))) return false;
      }
      if (tipeFilter) {
        const hasType = k.roomTypes.some(r => r.name === tipeFilter);
        if (!hasType) return false;
      }
      return true;
    });
  }, [kosts, query, maxPrice, fasFilter, tipeFilter]);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <section className="text-center py-16 px-5">
        <h1 className="text-4xl font-bold mb-3">Cari Kost yang Nyaman dan Terjangkau</h1>
        <p className="text-gray-500 mb-6">Temukan kost impianmu dengan mudah.</p>
        <div className="flex justify-center gap-3">
          <input
            type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Cari lokasi, nama kost, atau fasilitas..."
            className="w-full max-w-lg p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
          />
          <button className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700">Cari</button>
        </div>
      </section>

      <div className="flex gap-6 px-10 pb-10">
        {/* FILTER SIDEBAR */}
        <aside className="w-64 self-start bg-white rounded-2xl shadow-md border border-gray-100 p-5 sticky top-20">
          <h2 className="text-gray-400 font-bold uppercase text-sm mb-5">Filter</h2>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Fasilitas</h3>
            <div className="space-y-2 text-gray-600">
              {['AC','WiFi','Parkir','KM Dalam'].map(f => (
                <label key={f} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={fasFilter.includes(f)} onChange={() => toggleFas(f)} className="accent-green-600"/>
                  {f}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Tipe Kamar</h3>
            <div className="space-y-2 text-gray-600">
              {['Standar','Deluxe','VIP',''].map((t, i) => (
                <label key={i} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="tipe" checked={tipeFilter === t} onChange={() => setTipeFilter(t)} className="accent-green-600"/>
                  {t || 'Semua'}
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Harga Maks (Rp)</h3>
            <input
              type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
              placeholder="cth: 2000000"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500"
            />
          </div>

          <button onClick={resetFilter} className="w-full bg-gray-100 hover:bg-gray-200 py-3 rounded-full transition">
            ↺ Reset Filter
          </button>
        </aside>

        {/* KOST GRID */}
        <main className="flex-1">
          <p className="text-sm text-gray-500 mb-4">{filtered.length} kost ditemukan</p>
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-4">🏠</p>
              <p className="font-semibold">Tidak ada kost yang sesuai filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(k => <KostCard key={k.id} kost={k} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
