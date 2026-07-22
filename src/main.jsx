import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import SellerCard from './components/SellerCard'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Sitio principal */}
        <Route path="/" element={<App />} />
        {/* Tarjeta digital de cada vendedor: /nombre-apellido */}
        <Route path="/:slug" element={<SellerCard />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
