import { useParams, Link } from 'react-router-dom'
import { FiMapPin } from 'react-icons/fi'
import {
  FaWhatsapp, FaLinkedinIn, FaFacebookF, FaInstagram, FaEnvelope, FaGlobe, FaRegAddressCard,
} from 'react-icons/fa'
import logoWhite from '../assets/logo-white.png'
import { getVendedor, empresaRedes } from '../data/vendedores'

// --- Paleta EVS ---
const NAVY = '#0d1b2e'
const BLUE = '#3182ce'
const BLUE_LIGHT = '#63b3ed'

// Genera el archivo .vcf (contacto) y lo descarga al teléfono
const guardarContacto = (v) => {
  const [nombre, ...resto] = v.nombre.split(' ')
  const apellido = resto.join(' ')
  const tel = v.whatsapp ? `+${v.whatsapp}` : ''
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${apellido};${nombre};;;`,
    `FN:${v.nombre}`,
    v.empresa ? `ORG:${v.empresa}` : '',
    v.cargo ? `TITLE:${v.cargo}` : '',
    tel ? `TEL;TYPE=CELL:${tel}` : '',
    v.email ? `EMAIL;TYPE=WORK:${v.email}` : '',
    v.sitioWeb ? `URL:${v.sitioWeb}` : '',
    v.ciudad ? `ADR;TYPE=WORK:;;${v.ciudad};;;;` : '',
    'END:VCARD',
  ].filter(Boolean).join('\n')

  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${v.nombre.replace(/\s+/g, '-')}.vcf`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

const iniciales = (nombre) =>
  nombre.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0]).join('').toUpperCase()

// Ícono grande tipo "app" con su etiqueta debajo
const AppTile = ({ href, onClick, icon: Icon, label, bg }) => {
  const tile = (
    <span style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      width: 74, height: 74, borderRadius: 18, margin: '0 auto',
      background: bg, color: '#fff',
      boxShadow: '0 4px 12px rgba(0,0,0,0.22)',
    }}>
      <Icon size={30} />
    </span>
  )
  const labelEl = (
    <span style={{ color: '#fff', fontSize: 13, fontWeight: 500, marginTop: 8 }}>{label}</span>
  )
  const wrap = {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    textDecoration: 'none', cursor: 'pointer', background: 'none', border: 'none',
    fontFamily: 'inherit', padding: 0,
  }
  return onClick ? (
    <button type="button" onClick={onClick} style={wrap}>{tile}{labelEl}</button>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" style={wrap}>{tile}{labelEl}</a>
  )
}

const SellerCard = () => {
  const { slug } = useParams()
  const v = getVendedor(slug)

  // Fondo con el barco (igual que la página principal)
  const Background = () => (
    <>
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        backgroundImage: 'url(/fotos/hero-port.jpg)',
        backgroundSize: 'cover', backgroundPosition: 'center',
      }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: 'rgba(13,27,46,0.90)' }} />
      <svg style={{ position: 'fixed', inset: 0, zIndex: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        <path d="M0,600 Q360,300 720,400 T1440,200" fill="none" stroke="rgba(99,179,237,0.10)" strokeWidth="0.8" />
        <path d="M0,200 Q400,500 800,350 T1440,650" fill="none" stroke="rgba(99,179,237,0.08)" strokeWidth="0.7" />
        <path d="M0,450 Q350,250 720,300 T1440,450" fill="none" stroke="rgba(99,179,237,0.07)" strokeWidth="0.6" />
      </svg>
    </>
  )

  // Vendedor no encontrado
  if (!v) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', background: NAVY }}>
        <Background />
        <div style={{
          position: 'relative', zIndex: 1, minHeight: '100vh', color: '#fff',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', textAlign: 'center', padding: 24, gap: 16,
        }}>
          <img src={logoWhite} alt="EVS Logistics" style={{ height: 46, marginBottom: 8 }} />
          <h1 style={{ fontSize: 22 }}>Tarjeta no encontrada</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 320 }}>
            No existe ninguna tarjeta con esa dirección.
          </p>
          <Link to="/" style={{ color: BLUE_LIGHT, fontWeight: 600 }}>Ir a evslogist.com →</Link>
        </div>
      </div>
    )
  }

  // Íconos de la cuadrícula — todos en escala de azules de EVS
  const tiles = [
    v.email && {
      key: 'email', label: 'Email', icon: FaEnvelope,
      href: `mailto:${v.email}`, bg: 'linear-gradient(135deg, #2b6cb0, #3182ce)',
    },
    v.whatsapp && {
      key: 'wa', label: 'WhatsApp', icon: FaWhatsapp,
      href: `https://wa.me/${v.whatsapp}`, bg: 'linear-gradient(135deg, #1e4e8c, #2b6cb0)',
    },
    v.sitioWeb && {
      key: 'web', label: 'Sitio web', icon: FaGlobe,
      href: v.sitioWeb, bg: 'linear-gradient(135deg, #3182ce, #4a90d9)',
    },
    { key: 'in', label: 'LinkedIn', icon: FaLinkedinIn, href: empresaRedes.linkedin, bg: 'linear-gradient(135deg, #23548f, #2f6cae)' },
    { key: 'fb', label: 'Facebook', icon: FaFacebookF, href: empresaRedes.facebook, bg: 'linear-gradient(135deg, #2b6cb0, #3f86d1)' },
    {
      key: 'ig', label: 'Instagram', icon: FaInstagram, href: empresaRedes.instagram,
      bg: 'linear-gradient(135deg, #4a90d9, #63b3ed)',
    },
  ].filter(Boolean)

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: NAVY, fontFamily: "'Inter', sans-serif" }}>
      <Background />

      <div style={{
        position: 'relative', zIndex: 1, minHeight: '100vh',
        display: 'flex', justifyContent: 'center', padding: '32px 20px 48px',
      }}>
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Logo EVS */}
          <div style={{ textAlign: 'center', marginBottom: 26 }}>
            <img src={logoWhite} alt="EVS Logistics" style={{ height: 40, objectFit: 'contain' }} />
          </div>

          {/* Foto / iniciales */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 18 }}>
            {v.foto ? (
              <img src={v.foto} alt={v.nombre} style={{
                width: 112, height: 112, borderRadius: '50%', objectFit: 'cover',
                border: `3px solid ${BLUE_LIGHT}`, boxShadow: '0 12px 28px rgba(0,0,0,0.5)',
              }} />
            ) : (
              <div style={{
                width: 112, height: 112, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE_LIGHT} 100%)`,
                color: '#fff', fontSize: 40, fontWeight: 700,
                border: '3px solid rgba(255,255,255,0.15)',
                boxShadow: '0 12px 28px rgba(0,0,0,0.5)',
              }}>
                {iniciales(v.nombre)}
              </div>
            )}
          </div>

          {/* Nombre / cargo */}
          <div style={{ textAlign: 'center', marginBottom: 26 }}>
            <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>
              {v.nombre}
            </h1>
            {v.cargo && (
              <p style={{ color: BLUE_LIGHT, fontSize: 15, fontWeight: 600, marginTop: 6 }}>
                {v.cargo}
              </p>
            )}
            {v.empresa && (
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, marginTop: 2 }}>
                {v.empresa}
              </p>
            )}
            {v.ciudad && (
              <p style={{
                color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 10,
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                <FiMapPin size={13} /> {v.ciudad}
              </p>
            )}
          </div>

          {/* Botón: Guardar contacto */}
          <button
            type="button"
            onClick={() => guardarContacto(v)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              width: '100%', padding: '16px', borderRadius: 16, border: 'none',
              background: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE_LIGHT} 100%)`,
              color: '#fff', fontSize: 17, fontWeight: 700, fontFamily: 'inherit',
              cursor: 'pointer', marginBottom: 30,
              boxShadow: '0 5px 14px rgba(0,0,0,0.22)',
            }}
          >
            <FaRegAddressCard size={20} /> Guardar contacto
          </button>

          {/* Cuadrícula de íconos */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px 12px',
          }}>
            {tiles.map((t) => (
              <AppTile key={t.key} href={t.href} icon={t.icon} label={t.label} bg={t.bg} />
            ))}
          </div>

          {/* Pie */}
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 40 }}>
            © 2026 EVS Logistics
          </p>
        </div>
      </div>
    </div>
  )
}

export default SellerCard
