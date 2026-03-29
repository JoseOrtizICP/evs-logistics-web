import { useState, useEffect } from 'react'
import logoWhite from '../assets/logo-white.png'
import logoDark from '../assets/logo-dark.png'

const NavbarV2 = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const navStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: scrolled ? '12px 0' : '18px 0',
    background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
    backdropFilter: scrolled ? 'blur(20px)' : 'none',
    borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : 'none',
    transition: 'all 0.3s ease'
  }

  const linkColor = scrolled ? '#1a202c' : 'rgba(255,255,255,0.8)'
  const linkHover = scrolled ? '#3182ce' : '#fff'

  const links = [
    { label: 'Servicios', id: 'servicios' },
    { label: 'Soluciones', id: 'extras' },
    { label: 'Cobertura', id: 'credibilidad' },
    { label: 'Contacto', id: 'cotizar' }
  ]

  return (
    <>
      <nav style={navStyle}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <img
            src={scrolled ? logoDark : logoWhite}
            alt="EVS Logistics"
            style={{ height: '32px', objectFit: 'contain', cursor: 'pointer', transition: 'all 0.3s' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="nav-v2-desktop">
            {links.map(link => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: linkColor,
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  padding: 0
                }}
                onMouseEnter={e => e.target.style.color = linkHover}
                onMouseLeave={e => e.target.style.color = linkColor}
              >
                {link.label}
              </button>
            ))}

            <button
              onClick={() => scrollTo('cotizar')}
              style={{
                padding: '10px 22px',
                background: '#3182ce',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#2b6cb0'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#3182ce'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Cotizar
            </button>
          </div>

          <button
            className="nav-v2-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              color: scrolled ? '#1a202c' : '#fff',
              fontSize: '22px'
            }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed',
          top: '60px',
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(20px)',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px'
        }}>
          {links.map(link => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              style={{
                background: 'none',
                border: 'none',
                color: '#1a202c',
                fontSize: '20px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo('cotizar')}
            style={{
              padding: '14px 32px',
              background: '#3182ce',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '8px'
            }}
          >
            Cotizar Ahora
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-v2-desktop { display: none !important; }
          .nav-v2-hamburger { display: block !important; }
        }
      `}</style>
    </>
  )
}

export default NavbarV2
