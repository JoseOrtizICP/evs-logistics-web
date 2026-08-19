import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import SellerCard from './components/SellerCard'
import Admin from './admin/Admin'
import Portal from './portal/Portal'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Sitio principal */}
        <Route path="/" element={<App />} />
        {/* Panel interno de rastreo. Va antes de /:slug para que no lo capture. */}
        <Route path="/admin" element={<Admin />} />
        {/* Portal de clientes. También antes de /:slug. */}
        <Route path="/portal" element={<Portal />} />
        {/* Tarjeta digital de cada vendedor: /nombre-apellido */}
        <Route path="/:slug" element={<SellerCard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
