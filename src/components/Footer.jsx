import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from 'react-icons/fa'
import logoWhite from '../assets/logo-white.png'

const FooterV2 = () => {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <footer style={{ background: '#0a1628', padding: '60px 24px 30px', color: '#fff' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '40px',
          paddingBottom: '40px',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}>
          <div>
            <img src={logoWhite} alt="EVS Logistics" style={{ height: '36px', marginBottom: '14px' }} />
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: '280px' }}>
              Soluciones logísticas integrales a nivel global.
              Empresa mexicana con alcance internacional.
            </p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              {[
                { icon: FaFacebookF, href: 'https://www.facebook.com/profile.php?id=100080143248684' },
                { icon: FaInstagram, href: '#' },
                { icon: FaLinkedinIn, href: '#' },
                { icon: FaWhatsapp, href: '#' }
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.05)', border: 'none',
                  color: 'rgba(255,255,255,0.5)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '13px', textDecoration: 'none', transition: 'all 0.2s'
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#3182ce'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
                >
                  <s.icon />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', marginBottom: '14px', textTransform: 'uppercase' }}>Navegación</p>
            {['inicio', 'servicios', 'extras', 'credibilidad', 'cotizar'].map(id => (
              <button key={id} onClick={() => scrollTo(id)} style={{
                display: 'block', background: 'none', border: 'none',
                color: 'rgba(255,255,255,0.5)', fontSize: '13px',
                cursor: 'pointer', padding: '3px 0', transition: 'color 0.2s',
                textTransform: 'capitalize'
              }}
                onMouseEnter={e => e.target.style.color = '#63b3ed'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
              >
                {id === 'cotizar' ? 'Contacto' : id === 'credibilidad' ? 'Cobertura' : id}
              </button>
            ))}
          </div>

          <div>
            <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', marginBottom: '14px', textTransform: 'uppercase' }}>Servicios</p>
            {['Forwarding Marítimo', 'Forwarding Aéreo', 'Transporte Terrestre', 'Gestión Aduanal', 'Agente de Compras'].map(s => (
              <p key={s} style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '3px 0' }}>{s}</p>
            ))}
          </div>

          <div>
            <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', marginBottom: '14px', textTransform: 'uppercase' }}>Contacto</p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '3px 0' }}>contacto@evslogist.com</p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '3px 0' }}>+52 (55) XXXX-XXXX</p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '3px 0' }}>Naucalpan de Juárez,</p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', margin: '3px 0' }}>Estado de México</p>
          </div>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: '20px', flexWrap: 'wrap', gap: '12px'
        }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
            &copy; {new Date().getFullYear()} EVS Logistics. Todos los derechos reservados.
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>
            Intelligent Solutions
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer > div > div:first-child { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </footer>
  )
}

export default FooterV2
