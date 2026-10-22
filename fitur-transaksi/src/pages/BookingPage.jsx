import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Breadcrumb from "../components/Breadcrumb";

const API_URL = "http://127.0.0.1:8000/api/kost";

function formatRupiah(number) {
  return `Rp ${Number(number).toLocaleString("id-ID")}`;
}

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [kost, setKost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [checkin, setCheckin] = useState("");
  const [duration, setDuration] = useState(1);

  const [form, setForm] = useState({
    nama: "",
    email: "",
    phone: "",
    gender: "",
    birthdate: "",
    job: "",
    instansi: "",
    alamat: "",
  });

  useEffect(() => {
    fetch(`${API_URL}/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Data kost tidak ditemukan");
        }

        return response.json();
      })
      .then((result) => {
        setKost(result.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const discountRate =
    duration === 6 ? 0.05 :
    duration === 12 ? 0.10 :
    0;

  const subtotal = kost
    ? Number(kost.price) * duration
    : 0;

  const discount = subtotal * discountRate;

  const total = subtotal - discount;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    if (
      !checkin ||
      !form.nama ||
      !form.email ||
      !form.phone ||
      !form.gender ||
      !form.birthdate ||
      !form.job ||
      !form.alamat
    ) {
      alert("Mohon lengkapi data yang wajib diisi.");
      return;
    }

    const bookingData = {
      kostId: kost.id,
      kostName: kost.name,
      roomName: kost.type,
      roomPrice: Number(kost.price),
      checkin,
      duration,
      subtotal,
      discount: discountRate,
      saving: discount,
      total,
      ...form,
    };

    localStorage.setItem(
      "bookingData",
      JSON.stringify(bookingData)
    );

    navigate(`/transaksi/${kost.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Memuat data booking...</p>
      </div>
    );
  }

  if (error || !kost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            {error || "Data kost tidak ditemukan"}
          </p>

          <button
            onClick={() => navigate("/")}
            className="bg-green-600 text-white px-5 py-2 rounded-xl"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800">

      <Navbar
        backTo={`/detail/${kost.id}`}
        backLabel="Kembali ke Detail"
      />

      <div className="max-w-6xl mx-auto px-6 pt-5">
        <Breadcrumb
          items={[
            { to: "/", label: "Beranda" },
            {
              to: `/detail/${kost.id}`,
              label: "Detail Kost",
            },
            { label: "Booking" },
          ]}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">

        <h1 className="text-2xl font-bold mb-6">
          Booking Kost
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* BAGIAN KIRI */}
          <div className="lg:col-span-2 space-y-6">

            {/* DATA KOST */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">

              <h2 className="font-bold text-lg mb-4">
                Kost yang Dipilih
              </h2>

              <div className="flex gap-4">

                <img
                  src={kost.img}
                  alt={kost.name}
                  className="w-32 h-28 object-cover rounded-xl"
                />

                <div>
                  <h3 className="font-bold text-lg">
                    {kost.name}
                  </h3>

                  <p className="text-gray-500 text-sm mt-1">
                    {kost.address}
                  </p>

                  <p className="text-green-600 font-bold mt-2">
                    {formatRupiah(kost.price)} / bulan
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    Tipe: {kost.type}
                  </p>
                </div>

              </div>
            </div>

            {/* JADWAL */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">

              <h2 className="font-bold text-lg mb-4">
                Jadwal Sewa
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Tanggal Masuk *
                  </label>

                  <input
                    type="date"
                    value={checkin}
                    onChange={(e) => setCheckin(e.target.value)}
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Durasi Sewa *
                  </label>

                  <select
                    value={duration}
                    onChange={(e) =>
                      setDuration(Number(e.target.value))
                    }
                    className="w-full border rounded-xl px-4 py-3 bg-white"
                  >
                    <option value={1}>
                      1 Bulan
                    </option>

                    <option value={3}>
                      3 Bulan
                    </option>

                    <option value={6}>
                      6 Bulan - Hemat 5%
                    </option>

                    <option value={12}>
                      12 Bulan - Hemat 10%
                    </option>
                  </select>
                </div>

              </div>
            </div>

            {/* DATA PENYEWA */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">

              <h2 className="font-bold text-lg mb-4">
                Data Penyewa
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">
                    Nama Lengkap *
                  </label>

                  <input
                    type="text"
                    name="nama"
                    value={form.nama}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap"
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Email *
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="contoh@email.com"
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Nomor HP *
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="08xxxxxxxxxx"
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Jenis Kelamin *
                  </label>

                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 bg-white"
                  >
                    <option value="">
                      Pilih jenis kelamin
                    </option>

                    <option value="Laki-laki">
                      Laki-laki
                    </option>

                    <option value="Perempuan">
                      Perempuan
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Tanggal Lahir *
                  </label>

                  <input
                    type="date"
                    name="birthdate"
                    value={form.birthdate}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Pekerjaan *
                  </label>

                  <select
                    name="job"
                    value={form.job}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 bg-white"
                  >
                    <option value="">
                      Pilih pekerjaan
                    </option>

                    <option value="Mahasiswa">
                      Mahasiswa
                    </option>

                    <option value="Karyawan Swasta">
                      Karyawan Swasta
                    </option>

                    <option value="PNS / ASN">
                      PNS / ASN
                    </option>

                    <option value="Wiraswasta">
                      Wiraswasta
                    </option>

                    <option value="Lainnya">
                      Lainnya
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Instansi / Kampus
                  </label>

                  <input
                    type="text"
                    name="instansi"
                    value={form.instansi}
                    onChange={handleChange}
                    placeholder="Nama kampus/perusahaan"
                    className="w-full border rounded-xl px-4 py-3"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">
                    Alamat Asal *
                  </label>

                  <textarea
                    name="alamat"
                    value={form.alamat}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Masukkan alamat asal"
                    className="w-full border rounded-xl px-4 py-3 resize-none"
                  />
                </div>

              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl"
            >
              Lanjut ke Pembayaran →
            </button>

          </div>

          {/* BAGIAN KANAN */}
          <div>

            <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-20">

              <h2 className="font-bold text-lg mb-5">
                Ringkasan Pembayaran
              </h2>

              <div className="space-y-4 text-sm">

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Harga / bulan
                  </span>

                  <span className="font-semibold">
                    {formatRupiah(kost.price)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Durasi
                  </span>

                  <span className="font-semibold">
                    {duration} bulan
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Subtotal
                  </span>

                  <span className="font-semibold">
                    {formatRupiah(subtotal)}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>
                      Diskon {(discountRate * 100).toFixed(0)}%
                    </span>

                    <span className="font-semibold">
                      - {formatRupiah(discount)}
                    </span>
                  </div>
                )}

                <div className="border-t pt-4 flex justify-between">

                  <span className="font-bold">
                    Total
                  </span>

                  <span className="font-bold text-green-600 text-lg">
                    {formatRupiah(total)}
                  </span>

                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}