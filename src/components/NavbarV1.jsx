import { useState, useEffect } from 'react'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp, FaBars, FaTimes } from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import logoWhite from '../assets/logo-white.png'

const navLinks = [
  { label: 'Inicio', page: 'inicio' },
  { label: 'Nosotros', page: 'nosotros' },
  { label: 'Servicios', page: 'servicios' },
  { label: 'Galería', page: 'galeria' },
  { label: 'Contacto', page: 'contacto' }
]

const socialLinks = [
  { icon: FaFacebookF, href: 'https://www.facebook.com/profile.php?id=100080143248684', label: 'Facebook' },
  { icon: FaInstagram, href: 'https://www.instagram.com/evs.logistics', label: 'Instagram' },
  { icon: FaLinkedinIn, href: 'https://www.linkedin.com/company/evs-logistic/', label: 'LinkedIn' },
  { icon: FaWhatsapp, href: '#', label: 'WhatsApp' }
]

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
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, padding: '10px 0',
        background: 'rgba(26, 54, 93, 0.97)', backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 20px rgba(0,0,0,0.15)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => handleNav('inicio')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <img src={logoWhite} alt="EVS Logistics" style={{ height: '40px', objectFit: 'contain' }} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }} className="nav-desktop">
            {navLinks.map(link => (
              <button key={link.page} onClick={() => handleNav(link.page)}
                style={{
                  color: currentPage === link.page ? '#63b3ed' : 'rgba(255,255,255,0.7)',
                  textDecoration: 'none', fontSize: '14px', fontWeight: currentPage === link.page ? 600 : 500,
                  cursor: 'pointer', padding: '6px 0', background: 'none', border: 'none',
                  borderBottom: `2px solid ${currentPage === link.page ? '#63b3ed' : 'transparent'}`,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { if (currentPage !== link.page) e.target.style.color = '#63b3ed' }}
                onMouseLeave={e => { if (currentPage !== link.page) e.target.style.color = 'rgba(255,255,255,0.7)' }}>
                {link.label}
              </button>
            ))}
            <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
              {socialLinks.map(social => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer"
                  style={{
                    width: '30px', height: '30px', borderRadius: '50%',
                    border: '1px solid rgba(255,255,255,0.3)', background: 'transparent',
                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.2s', textDecoration: 'none', fontSize: '12px'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#63b3ed'; e.currentTarget.style.borderColor = '#63b3ed' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)' }}>
                  <social.icon />
                </a>
              ))}
            </div>
          </div>
          <button style={{ display: 'none', background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer' }}
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
                style={{ color: currentPage === link.page ? '#63b3ed' : '#fff', textDecoration: 'none', fontSize: '22px', fontWeight: currentPage === link.page ? 700 : 600, cursor: 'pointer', background: 'none', border: 'none' }}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => handleNav(link.page)}>
                {link.label}
              </motion.button>
            ))}
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
