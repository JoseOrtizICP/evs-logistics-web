import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp, FaUserCircle } from 'react-icons/fa'
import logoWhite from '../assets/logo-white.png'
import useIsMobile from '../hooks/useIsMobile'
import { T } from '../tema'

const socialLinks = [
  { icon: FaFacebookF, href: 'https://www.facebook.com/profile.php?id=100080143248684', label: 'Facebook' },
  { icon: FaInstagram, href: 'https://www.instagram.com/evslogistic', label: 'Instagram' },
  { icon: FaLinkedinIn, href: 'https://www.linkedin.com/company/evs-logistic/', label: 'LinkedIn' },
  { icon: FaWhatsapp, href: '#', label: 'WhatsApp' }
]

const FooterV1 = ({ onNavigate }) => {
  const isMobile = useIsMobile()
  const handleNav = (page) => { if (onNavigate) { onNavigate(page); window.scrollTo(0, 0) } }

  return (
    <footer style={{ background: T.pie, borderTop: `1px solid ${T.bandaBorde}`, padding: isMobile ? '40px 16px 20px' : '60px 24px 30px', color: T.pieTexto }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'flex', flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'space-between',
          alignItems: isMobile ? 'center' : 'flex-start', gap: isMobile ? '24px' : '40px', paddingBottom: isMobile ? '24px' : '40px',
          borderBottom: `1px solid ${T.pieBorde}`,
          flexDirection: isMobile ? 'column' : 'row', textAlign: isMobile ? 'center' : 'left'
        }}>
          {/* Logo + descripción */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'center' : 'flex-start' }}>
            <button onClick={() => handleNav('inicio')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <img src={logoWhite} alt="EVS Logistics" style={{ height: '50px', objectFit: 'contain' }} />
            </button>
            <p style={{ fontSize: '14px', color: T.pieSuave, lineHeight: 1.7, maxWidth: '300px', marginTop: '12px' }}>
              Soluciones logísticas integrales a nivel global. Empresa mexicana con alcance internacional.
            </p>
          </div>

          {/* Acceso de clientes */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'center' : 'flex-start' }}>
            <p style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px', color: T.pieSuave }}>Clientes</p>
            <a href="/portal" style={{
              display: 'inline-flex', alignItems: 'center', gap: '9px', textDecoration: 'none',
              color: T.pieTexto, fontSize: '14px', fontWeight: 600, padding: '11px 20px',
              borderRadius: '10px', border: `1px solid ${T.pieBorde}`, transition: 'all 0.2s'
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,179,237,0.16)'; e.currentTarget.style.borderColor = '#63b3ed' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = T.pieBorde }}>
              <FaUserCircle style={{ fontSize: '15px' }} /> Portal de clientes
            </a>
            <p style={{ fontSize: '12px', color: T.pieTenue, marginTop: '10px', maxWidth: '210px', lineHeight: 1.6, textAlign: isMobile ? 'center' : 'left' }}>
              Consulta tus envíos y tu estado de cuenta.
            </p>
          </div>

          {/* Redes sociales */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'center' : 'flex-start' }}>
            <p style={{ fontSize: '14px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px', color: T.pieSuave }}>Síguenos</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              {socialLinks.map(social => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer"
                  style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: T.pieSuperficie, border: 'none', color: T.pieTexto,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.2s', textDecoration: 'none', fontSize: '15px'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#3182ce' }}
                  onMouseLeave={e => { e.currentTarget.style.background = T.pieSuperficie }}>
                  <social.icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: isMobile ? 'center' : 'space-between', alignItems: 'center', paddingTop: isMobile ? '16px' : '24px', gap: isMobile ? '8px' : '16px', flexDirection: isMobile ? 'column' : 'row' }}>
          <p style={{ fontSize: '13px', color: T.pieTenue }}>&copy; {new Date().getFullYear()} EVS Logistics. Todos los derechos reservados.</p>
          <p style={{ fontSize: '13px', color: T.pieTenue }}>Intelligent Solutions</p>
        </div>
      </div>
    </footer>
  )
}

export default FooterV1
