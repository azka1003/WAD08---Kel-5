import { Link } from "react-router-dom";
export default function KostCard({ kost }) {
  return (
    <Link
      to={`/kost/${kost.id}`}
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
          Rp {kost.price} / bulan
        </span>
      </div>
    </Link>
  );
}