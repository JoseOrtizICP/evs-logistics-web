import { useState } from 'react'
import NavbarV1 from './components/NavbarV1'
import HeroV1 from './components/HeroV1'
import About from './components/About'
import ServicesV1 from './components/ServicesV1'
import PhotoCarousel from './components/PhotoCarousel'
import Contact from './components/Contact'
import FooterV1 from './components/FooterV1'
import Marquee from './components/Marquee'

const pages = {
  inicio: HeroV1,
  nosotros: About,
  servicios: ServicesV1,
  galeria: PhotoCarousel,
  contacto: Contact
}

const pagesWithMarquee = ['inicio', 'nosotros', 'contacto']

const App = () => {
  const [currentPage, setCurrentPage] = useState('inicio')

  const handleNavigate = (page) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  const PageComponent = pages[currentPage]

  return (
    <div>
      <NavbarV1 currentPage={currentPage} onNavigate={handleNavigate} />
      <PageComponent />
      {pagesWithMarquee.includes(currentPage) && <Marquee />}
      <FooterV1 onNavigate={handleNavigate} />
    </div>
  )
}

export default App
