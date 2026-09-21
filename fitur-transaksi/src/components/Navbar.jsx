import { Link } from 'react-router-dom'

export default function Navbar({ backTo, backLabel }) {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 md:px-10 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
      <Link to="/" className="text-2xl font-extrabold text-green-600 tracking-tight">HUNIKA</Link>
      <ul className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
        <li><Link to="/" className="hover:text-green-600 transition">Cari Kost</Link></li>
        <li><a href="#" className="hover:text-green-600 transition">Dashboard Pemilik</a></li>
        <li><a href="#" className="hover:text-green-600 transition">Favorit</a></li>
      </ul>
      {backTo ? (
        <Link to={backTo} className="flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
          {backLabel || 'Kembali'}
        </Link>
      ) : (
        <a href="#" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium transition">Login</a>
      )}
    </nav>
  )
}
