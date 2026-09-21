import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const email = localStorage.getItem("email");

  const handleLogout = () => {
    localStorage.removeItem("isLogin");
    localStorage.removeItem("email");

    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-center">

        <img
          src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
          alt="Profile"
          className="w-24 h-24 mx-auto mb-4"
        />

        <h1 className="text-2xl font-bold mb-2">
          Profil Saya
        </h1>

        <p className="text-gray-500 mb-6">
          {email}
        </p>

        <button
          onClick={handleLogout}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>

      </div>

    </div>
  );
}