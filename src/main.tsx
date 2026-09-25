import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom'
import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/cormorant-garamond/600.css'
import '@fontsource/cormorant-garamond/700.css'
import '@fontsource/cormorant-garamond/500-italic.css'
import '@fontsource/cormorant-garamond/600-italic.css'
import '@fontsource/manrope/400.css'
import '@fontsource/manrope/500.css'
import '@fontsource/manrope/600.css'
import '@fontsource/manrope/700.css'
import './index.css'
import { StoreProvider } from './lib/store'
import Layout from './components/Layout'
import Home from './pages/Home'
import Booking from './pages/Booking'
import BookingSuccess from './pages/BookingSuccess'
import Login from './pages/Login'
import Account from './pages/Account'
import NotFound from './pages/NotFound'

// Форма записи пересоздаётся при смене ?service= / ?master=, иначе useState держит старые значения.
function BookingRoute() {
  const { search } = useLocation()
  return <Booking key={search} />
}

// HashRouter: GitHub Pages не умеет отдавать index.html на любые пути,
// поэтому маршруты живут после # и обновление страницы не даёт 404.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="booking" element={<BookingRoute />} />
            <Route path="booking/success" element={<BookingSuccess />} />
            <Route path="login" element={<Login />} />
            <Route path="account" element={<Account />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </HashRouter>
    </StoreProvider>
  </StrictMode>,
)
