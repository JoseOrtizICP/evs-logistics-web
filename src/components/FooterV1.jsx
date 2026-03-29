import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa'
import logoWhite from '../assets/logo-white.png'

const socialLinks = [
  { icon: FaFacebookF, href: 'https://www.facebook.com/profile.php?id=100080143248684', label: 'Facebook' },
  { icon: FaInstagram, href: 'https://www.instagram.com/evs.logistics', label: 'Instagram' },
  { icon: FaLinkedinIn, href: 'https://www.linkedin.com/company/evs-logistic/', label: 'LinkedIn' },
  { icon: FaWhatsapp, href: '#', label: 'WhatsApp' }
]

const FooterV1 = ({ onNavigate }) => {
  const handleNav = (page) => { if (onNavigate) { onNavigate(page); window.scrollTo(0, 0) } }

  return (
    <footer style={{ background: '#1a365d', padding: '60px 24px 30px', color: '#fff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
          alignItems: 'flex-start', gap: '40px', paddingBottom: '40px',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          {/* Logo + descripción */}
          <div>
            <button onClick={() => handleNav('inicio')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <img src={logoWhite} alt="EVS Logistics" style={{ height: '50px', objectFit: 'contain' }} />
            </button>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '300px', marginTop: '12px' }}>
              Soluciones logísticas integrales a nivel global. Empresa mexicana con alcance internacional.
            </p>
          </div>

          {/* Redes sociales */}
          <div>
            <p style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px', color: 'rgba(255,255,255,0.6)' }}>Síguenos</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {socialLinks.map(social => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer"
                  style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.2s', textDecoration: 'none', fontSize: '15px'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#3182ce' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}>
                  <social.icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', paddingTop: '24px', gap: '16px' }}>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>&copy; {new Date().getFullYear()} EVS Logistics. Todos los derechos reservados.</p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>Intelligent Solutions</p>
        </div>
      </div>
    </footer>
  )
}

export default FooterV1
