import { useState, useEffect } from 'react'
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import logoWhite from '../assets/logo-white.png'
import { T } from '../tema'
import { PORTAL } from '../acceso'

const navLinks = [
  { label: 'Inicio', page: 'inicio' },
  { label: 'Nosotros', page: 'nosotros' },
  { label: 'Servicios', page: 'servicios' },
  { label: 'Galería', page: 'galeria' }
]

const CTA = { label: 'Solicitar Cotización', page: 'contacto' }

const NavbarV1 = ({ currentPage, onNavigate }) => {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleNav = (page) => {
    onNavigate(page)
    setMenuOpen(false)
    window.scrollTo(0, 0)
  }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: T.barra, backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 20px rgba(0,0,0,0.15)'
      }}>
        {/* Barra principal */}
        <div style={{
          maxWidth: '1200px', margin: '0 auto', padding: '10px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <button onClick={() => handleNav('inicio')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <img src={logoWhite} alt="EVS Logistics" style={{ height: '40px', objectFit: 'contain' }} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }} className="nav-desktop">
            {navLinks.map(link => (
              <button key={link.page} onClick={() => handleNav(link.page)}
                style={{
                  color: currentPage === link.page ? T.acento : T.barraSuave,
                  fontSize: '14px', fontWeight: currentPage === link.page ? 600 : 500,
                  cursor: 'pointer', padding: '6px 0', background: 'none', border: 'none',
                  borderBottom: `2px solid ${currentPage === link.page ? T.acento : 'transparent'}`,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { if (currentPage !== link.page) e.target.style.color = T.acento }}
                onMouseLeave={e => { if (currentPage !== link.page) e.target.style.color = T.barraSuave }}>
                {link.label}
              </button>
            ))}

            <button onClick={() => handleNav(CTA.page)}
              style={{
                color: '#fff', fontSize: '13px', fontWeight: 700, letterSpacing: '0.8px',
                textTransform: 'uppercase', cursor: 'pointer', padding: '11px 24px',
                background: T.azul, border: 'none', borderRadius: '8px',
                boxShadow: '0 4px 14px rgba(49,130,206,0.4)', transition: 'all 0.2s', marginLeft: '4px'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = T.azulHover; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = T.azul; e.currentTarget.style.transform = 'translateY(0)' }}>
              {CTA.label}
            </button>

          </div>

          <button style={{ display: 'none', background: 'none', border: 'none', color: T.barraTexto, fontSize: '24px', cursor: 'pointer' }}
            className="nav-hamburger" onClick={() => setMenuOpen(true)}>
            <FaBars />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(26, 54, 93, 0.98)', backdropFilter: 'blur(10px)',
              zIndex: 999, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: '24px'
            }}>
            <button onClick={() => setMenuOpen(false)}
              style={{ position: 'absolute', top: '20px', right: '24px', background: 'none', border: 'none', color: '#fff', fontSize: '28px', cursor: 'pointer' }}>
              <FaTimes />
            </button>

            {navLinks.map((link, i) => (
              <motion.button key={link.page}
                style={{
                  color: currentPage === link.page ? T.acento : '#fff', fontSize: '22px',
                  fontWeight: currentPage === link.page ? 700 : 600, cursor: 'pointer',
                  background: 'none', border: 'none'
                }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => handleNav(link.page)}>
                {link.label}
              </motion.button>
            ))}

            <motion.button
              style={{
                color: '#fff', fontSize: '20px', fontWeight: 700, letterSpacing: '2px',
                textTransform: 'uppercase', cursor: 'pointer', background: T.azul,
                border: 'none', borderRadius: '10px', padding: '14px 40px', marginTop: '8px',
                boxShadow: '0 6px 18px rgba(49,130,206,0.45)'
              }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              onClick={() => handleNav(CTA.page)}>
              {CTA.label}
            </motion.button>

            <motion.a href={PORTAL.href}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '9px', marginTop: '14px',
                color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '16px', fontWeight: 500
              }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
              <FaUserCircle /> {PORTAL.label}
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: block !important; }
        }
      `}</style>
    </>
  )
}

export default NavbarV1
