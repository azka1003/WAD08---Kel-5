import { Link } from 'react-router-dom'

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-400">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && <span>/</span>}
          {item.to
            ? <Link to={item.to} className="hover:text-green-600 transition">{item.label}</Link>
            : <span className="text-gray-700 font-medium">{item.label}</span>
          }
        </span>
      ))}
    </nav>
  )
}
