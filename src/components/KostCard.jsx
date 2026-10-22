import { Link } from "react-router-dom";
import { fmt } from "../data/dataKost"
export default function KostCard({ kost }) {
  return (
    <Link
      to={`/detail/${kost.id}`} 
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition border border-slate-100 block"
    >
      <img
        src={kost.img}
        alt={kost.name}
        className="w-full h-52 object-cover"
      />

      <div className="p-4">
        <h3 className="font-semibold text-lg">{kost.name}</h3>
        <p className="text-gray-500 text-sm mt-1">📍 {kost.loc}</p>
        <span className="block mt-2 font-bold text-green-600">
          {fmt(Number(kost.price))} / bulan
        </span>
      </div>
    </Link>
  );
}