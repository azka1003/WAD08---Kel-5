import { createBrowserRouter } from 'react-router-dom'
import SearchPage   from '../pages/SearchPage'
import DetailPage   from '../pages/DetailPage'
import BookingPage  from '../pages/BookingPage'
import TransaksiPage from '../pages/TransaksiPage'

export const router = createBrowserRouter([
  { path: '/',                  element: <SearchPage />   },
  { path: '/detail/:id',        element: <DetailPage />   },
  { path: '/booking/:id',       element: <BookingPage />  },
  { path: '/transaksi/:id',     element: <TransaksiPage /> },
])
