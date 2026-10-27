import { useNavigate, Link } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const email = localStorage.getItem("email") || "-";
  const role = localStorage.getItem("role");

  const roleLabel = role === "pemilik" ? "Pemilik Kost" : "Pencari Kost";
  const initial = email !== "-" ? email.charAt(0).toUpperCase() : "?";
  const username = email !== "-" ? email.split("@")[0] : "Pengguna";

  const handleLogout = () => {
    localStorage.removeItem("isLogin");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("token");

    navigate("/");
    window.location.reload(); // supaya navbar ikut berubah jadi "Masuk"
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl border border-gray-100 overflow-hidden">

        {/* Header hijau */}
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-24 relative">
          <Link
            to="/"
            className="absolute top-4 left-4 inline-flex items-center gap-1 text-sm font-medium text-white/90 hover:text-white transition"
          >
            <span aria-hidden="true">←</span> Kembali
          </Link>
        </div>

       {/* Avatar yang menimpa header */}
        <div className="relative z-10 flex justify-center -mt-12">
          <div className="w-24 h-24 rounded-full bg-white p-1 shadow-md">
            <div className="w-full h-full rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-4xl font-bold">
              {initial}
            </div>
          </div>
        </div>

        {/* Info user */}
        <div className="px-8 pt-4 pb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 capitalize">{username}</h1>
          <p className="text-gray-500 text-sm mt-1">{email}</p>

          <span className="inline-block mt-3 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700">
            {roleLabel}
          </span>

          <hr className="my-6 border-gray-100" />

          {/* Menu singkat */}
          <div className="flex flex-col gap-2 text-sm">
            <Link
              to="/"
              className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
            >
              Cari Kost
            </Link>

            {role === "pemilik" && (
              <Link
                to="/dashboard-pemilik"
                className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
              >
                Dashboard Pemilik
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="w-full py-2.5 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition mt-2"
            >
              Logout
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}