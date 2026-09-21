import { useParams } from "react-router-dom";
import { useState } from "react";
import { useKostDetail } from "../../hooks/useKost";
import { Link } from "react-router-dom";

export default function DetailKost() {
  const { id } = useParams();

  const [name, setName] = useState("");
  const [ratingInput, setRatingInput] = useState(0);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  const { kost, loading, error } = useKostDetail(id);

  if (loading) {
    return (
      <div className="p-10">
        <p className="text-gray-500">Memuat data kost...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10">
        <p className="text-red-500">Gagal memuat data: {error}</p>
      </div>
    );
  }

  if (!kost) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold">Kost tidak ditemukan</h1>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen p-8">
      <div className="max-w-7xl mx-auto flex gap-6">
        {/* KIRI */}
        <div className="flex-1">
          {/* FOTO */}
          <div className="bg-white rounded-xl overflow-hidden shadow">
            <img
              src={kost.img}
              alt={kost.name}
              className="w-full h-[400px] object-cover"
            />
          </div>

          {/* INFO KOST */}
          <div className="bg-white rounded-xl shadow mt-5 p-4">
            <div className="flex justify-between">
              <div>
                <h1 className="text-2xl font-bold">{kost.name}</h1>
                <p className="text-gray-500 mt-2">📍 {kost.loc}</p>
              </div>

              <button className="text-red-500 text-2xl">❤️</button>
            </div>

            <div className="mt-4">⭐ {kost.rating}</div>

            <p className="mt-4 text-gray-600">{kost.description}</p>
          </div>

          {/* FASILITAS */}
          <div className="bg-white rounded-xl shadow mt-6 p-4">
            <h2 className="text-xl font-bold mb-4">Fasilitas</h2>

            <div className="grid grid-cols-2 gap-3">
              {kost.facilities.map((item, index) => (
                <div key={index} className="bg-green-50 rounded-lg p-3">
                  ✅ {item}
                </div>
              ))}
            </div>
          </div>

          {/* TIPE KAMAR */}
          <div className="bg-white rounded-xl shadow mt-6 p-6 px-5">
            <h2 className="text-xl font-bold mb-4">Tipe Kamar</h2>

            <div className="space-y-3">
              <div className="bg-green-100/50 rounded-lg flex justify-between items-center pb-3">
                <div>
                  <h3 className="font-semibold text-lg px-4 py-3">
                    {kost.roomType}
                  </h3>
                  <p className="text-sm text-gray-500 px-4">Kapasitas 1 Orang</p>
                </div>

                <div className="text-right">
                  <div className="font-bold text-green-600 px-4 py-3">
                    Rp {kost.price}
                  </div>

                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded px-7">
                    Tersedia
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ULASAN */}
          <div className="bg-white rounded-xl shadow mt-5 p-4">
            <h2 className="text-xl font-bold">Ulasan & Rating</h2>

            <div className="bg-gray-50 p-4 rounded-lg mb-5">
              <h3 className="font-semibold mb-2">Tambah Ulasan</h3>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-2 rounded-lg text-sm mb-2"
                placeholder="Masukkan nama kamu..."
              />

              {/* Bintang */}
              <div className="flex gap-1 text-2xl mb-2 cursor-pointer">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRatingInput(star)}
                    className={star <= ratingInput ? "text-yellow-500" : "text-gray-300"}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Comment */}
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border p-2 rounded-lg text-sm"
                placeholder="Tulis komentar..."
              />

              <button
                onClick={() => {
                  if (!name || !ratingInput || !comment) return;

                  setReviews((prev) => [
                    ...prev,
                    { name: name, rating: ratingInput, comment },
                  ]);

                  setName("");
                  setRatingInput(0);
                  setComment("");
                }}
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Kirim Ulasan
              </button>
            </div>

            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-gray-400 text-sm">Belum ada ulasan</p>
              ) : (
                reviews.map((r, i) => (
                  <div key={i} className="bg-green-50 p-3 rounded-lg mb-5">
                    <h4 className="font-semibold">{r.name}</h4>
                    <p className="text-yellow-500">{"★".repeat(r.rating)}</p>
                    <p className="text-gray-600">{r.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* KANAN */}
        <div className="w-[300px]">
          <div className="bg-white rounded-xl shadow p-6 sticky top-5">
            <div className="bg-green-100/50 rounded-xl p-4 mb-4 backdrop-blur-sm">
              <div className="text-center text-5xl font-bold text-emerald-600">
                {kost.rating}
              </div>
              <div className="text-center text-3xl text-yellow-500">★★★★★</div>
              <p className="text-sm text-center text-gray-600">28 Ulasan</p>
            </div>

            <div className="text-3xl text-center font-bold text-emerald-600">
              Rp {kost.price}
            </div>

            <p className="text-center text-gray-600 mb-4">per bulan</p>

            <Link 
  to={`/booking/${id}`} 
  className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition"
>
  Booking Sekarang
</Link>

            <div className="mt-5 space-y-3 text-sm">
              <p>🏠 Pemilik: Bu Sari</p>
              <p>🛏️ Kamar tersedia: 2</p>
              <p>📅 Ditambahkan: 2026-07-06</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}