import { useState } from 'react'
import NavbarV1 from './components/NavbarV1'
import HeroV1 from './components/HeroV1'
import About from './components/About'
import ServicesV1 from './components/ServicesV1'
import PhotoCarousel from './components/PhotoCarousel'
import Contact from './components/Contact'
import FooterV1 from './components/FooterV1'
import Marquee from './components/Marquee'
import { T } from './tema'

const pages = {
  inicio: HeroV1,
  nosotros: About,
  servicios: ServicesV1,
  galeria: PhotoCarousel,
  contacto: Contact
}

const pagesWithMarquee = ['inicio', 'nosotros', 'servicios', 'galeria', 'contacto']

const App = () => {
  const [currentPage, setCurrentPage] = useState('inicio')

  const handleNavigate = (page) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  const PageComponent = pages[currentPage]

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Fondo fijo: fotografía del puerto con velo azul marino */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: 'url(/fotos/hero-port.jpg)',
        backgroundSize: 'cover', backgroundPosition: 'center',
      }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: T.velo }} />
      {/* Líneas curvas de acento */}
      <svg style={{ position: 'fixed', inset: 0, zIndex: 0, width: '100%', height: '100%', pointerEvents: 'none' }} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <path d="M0,600 Q360,300 720,400 T1440,200" fill="none" stroke={T.lineas} strokeWidth="0.8" />
        <path d="M0,200 Q400,500 800,350 T1440,650" fill="none" stroke={T.lineas} strokeWidth="0.7" opacity="0.8" />
        <path d="M0,450 Q350,250 720,300 T1440,450" fill="none" stroke={T.lineas} strokeWidth="0.6" opacity="0.7" />
      </svg>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <NavbarV1 currentPage={currentPage} onNavigate={handleNavigate} />
        <PageComponent onNavigate={handleNavigate} />
        {pagesWithMarquee.includes(currentPage) && <Marquee />}
        <FooterV1 onNavigate={handleNavigate} />
      </div>
    </div>
  )
}

export default App
