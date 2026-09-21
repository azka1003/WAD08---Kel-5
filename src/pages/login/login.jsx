import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmits = (e) => {
    e.preventDefault();

    // Logika Role
    if (email === "user@gmail.com" && password === "123") {
      localStorage.setItem("isLogin", "true");
      localStorage.setItem("role", "pencari");
      setIsLoggedIn(true);
      navigate("/");
    } else if (email === "owner@gmail.com" && password === "123") {
      localStorage.setItem("isLogin", "true");
      localStorage.setItem("role", "pemilik");
      setIsLoggedIn(true);
      navigate("/dashboard-pemilik");
    } else {
      alert("Email atau Password salah!");
    }
  };

  return (
    <div className="bg-slate-100 h-screen flex justify-center items-center">
      <div className="w-[400px] bg-white p-10 rounded-2xl shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-500">HUNIKA</h1>
          <p className="text-gray-500 mt-2">Masuk ke akun Anda</p>
        </div>

        <form onSubmit={handleSubmits} className="flex flex-col gap-3">
          <label className="font-medium">Email</label>
          <input
            type="email"
            placeholder="Masukkan Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          <label className="font-medium">Password</label>
          <input
            type="password"
            placeholder="Masukkan Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />

          <button
            type="submit"
            className="w-full mt-2 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}