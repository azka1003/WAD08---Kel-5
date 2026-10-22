import { useNavigate } from 'react-router-dom'

function fmt(price) {
  return `Rp ${Number(price).toLocaleString('id-ID')}`
}

export default function KostCard({ kost }) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/detail/${kost.id}`)}
      className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
    >
      <img
        src={kost.img}
        alt={kost.name}
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
            {kost.tier}
          </span>

          <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded-full">
            {kost.type}
          </span>
        </div>

        <h3 className="font-bold text-gray-900 text-base mb-1">
          {kost.name}
        </h3>

        <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
          📍 {kost.area || kost.address}
        </p>

        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-yellow-400 text-sm">
              ★
            </span>

            <span className="text-xs text-gray-500 ml-1">
              {kost.rating} ({kost.reviews} ulasan)
            </span>
          </div>

          <div className="text-right">
            <p className="text-green-600 font-bold text-sm">
              {fmt(kost.price)}
            </p>

            <p className="text-xs text-gray-400">
              /bulan
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}