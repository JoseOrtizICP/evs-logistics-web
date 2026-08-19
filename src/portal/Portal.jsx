import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaBoxOpen, FaFileInvoiceDollar, FaSignOutAlt, FaUserCircle, FaWhatsapp, FaCog, FaUserShield, FaSearch } from 'react-icons/fa'
import logoWhite from '../assets/logo-white.png'
import logoDark from '../assets/logo-dark.png'
import useIsMobile from '../hooks/useIsMobile'
import { verificarCliente, leerTokenCliente, borrarTokenCliente, MODO_DEMO } from '../lib/apiPortal'
import Fondo from './Fondo'
import LoginCliente from './LoginCliente'
import MisEnvios from './MisEnvios'
import DetalleEnvio from './DetalleEnvio'
import Pagos from './Pagos'
import CuentaCliente from './CuentaCliente'
import { verClienteDev } from '../lib/apiPortal'
import { C, btn } from './ui'

const SECCIONES = [
  { clave: 'envios', etiqueta: 'Mis envíos', icono: FaBoxOpen },
  { clave: 'pagos', etiqueta: 'Pagos y facturas', icono: FaFileInvoiceDollar }
]

const ANCHO_MENU = 250

const AYUDA = 'https://wa.me/5215548268211?text=Hola,%20necesito%20ayuda%20con%20mi%20cuenta%20del%20portal'

const Portal = () => {
  const isMobile = useIsMobile(900)
  const [cliente, setCliente] = useState(null)
  const [verificando, setVerificando] = useState(true)
  const [seccion, setSeccion] = useState('envios')
  const [envioAbierto, setEnvioAbierto] = useState(null)
  const [cuentaAbierta, setCuentaAbierta] = useState(false)
  const [numeroDev, setNumeroDev] = useState('')

  useEffect(() => {
    if (!leerTokenCliente()) {
      setVerificando(false)
      return
    }
    verificarCliente()
      .then(({ cliente }) => setCliente(cliente))
      .catch(() => borrarTokenCliente())
      .finally(() => setVerificando(false))
  }, [])

  const salir = () => {
    borrarTokenCliente()
    setCliente(null)
    setSeccion('envios')
    setEnvioAbierto(null)
  }

  const irA = (clave) => {
    setSeccion(clave)
    setEnvioAbierto(null)
    window.scrollTo(0, 0)
  }

  // Modo desarrollador: cargar la cuenta de otro cliente por su número.
  const verCliente = async (e) => {
    e.preventDefault()
    const numero = numeroDev.trim()
    if (!numero) return
    try {
      const { cliente: otro } = await verClienteDev(numero)
      setCliente({ ...otro, dev: true })
      setSeccion('envios')
      setEnvioAbierto(null)
      window.scrollTo(0, 0)
    } catch (err) {
      window.alert(err.message)
    }
  }

  if (verificando) {
    return (
      <div style={{
        minHeight: '100vh', background: C.fondo, display: 'flex',
        alignItems: 'center', justifyContent: 'center'
      }}>
        <p style={{ color: C.suave, fontSize: '14px' }}>Verificando tu sesión…</p>
      </div>
    )
  }

  if (!cliente) return <LoginCliente onEntrar={setCliente} />

  const Menu = () => (
    <nav style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: '6px' }}>
      {SECCIONES.map(s => {
        const activo = seccion === s.clave
        return (
          <button key={s.clave} type="button" onClick={() => irA(s.clave)}
            style={{
              display: 'flex', alignItems: 'center', gap: '12px', width: '100%',
              padding: isMobile ? '11px 14px' : '13px 16px', borderRadius: '10px',
              border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: isMobile ? '13px' : '14px', fontWeight: activo ? 700 : 500,
              background: activo ? 'rgba(49,130,206,0.28)' : 'transparent',
              color: activo ? '#90cdf4' : (isMobile ? C.suave : C.menuSuave),
              justifyContent: isMobile ? 'center' : 'flex-start',
              transition: 'background 0.15s, color 0.15s'
            }}>
            <s.icono style={{ fontSize: '15px', flexShrink: 0 }} />
            {isMobile ? s.etiqueta.split(' ')[0] === 'Mis' ? 'Envíos' : 'Pagos' : s.etiqueta}
          </button>
        )
      })}
    </nav>
  )

  return (
    <div style={{ minHeight: '100vh', background: C.fondo, display: 'flex', position: 'relative' }}>
      <Fondo />
      {/* Menú lateral (escritorio) */}
      {!isMobile && (
        <aside style={{
          width: `${ANCHO_MENU}px`, flexShrink: 0, background: C.menuFondo,
          borderRight: `1px solid ${C.menuBorde}`, padding: '26px 18px',
          display: 'flex', flexDirection: 'column', position: 'fixed',
          top: 0, bottom: 0, left: 0, zIndex: 2
        }}>
          <a href="/" style={{ display: 'block', marginBottom: '10px', padding: '0 8px' }}>
            <img src={logoWhite} alt="EVS Logistics" style={{ height: '38px', objectFit: 'contain' }} />
          </a>
          <p style={{
            fontSize: '10px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase',
            color: C.menuTenue, padding: '0 8px', marginBottom: '30px'
          }}>
            Portal de clientes
          </p>

          <Menu />

          <a href={AYUDA} target="_blank" rel="noopener noreferrer"
            style={{
              marginTop: 'auto', display: 'block', padding: '18px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.menuBorde}`,
              textDecoration: 'none', marginBottom: '20px'
            }}>
            <FaWhatsapp style={{ fontSize: '19px', color: '#68d391', marginBottom: '9px' }} />
            <p style={{ fontSize: '13px', fontWeight: 700, color: C.menuTexto, marginBottom: '4px' }}>
              ¿Necesitas ayuda?
            </p>
            <p style={{ fontSize: '12px', color: C.menuTenue, lineHeight: 1.5 }}>
              Escríbele a tu ejecutivo por WhatsApp.
            </p>
          </a>

          <div style={{ paddingTop: '22px', borderTop: `1px solid ${C.menuBorde}` }}>
            <div style={{ display: 'flex', gap: '11px', alignItems: 'center', padding: '0 8px', marginBottom: '14px' }}>
              <FaUserCircle style={{ fontSize: '26px', color: C.menuTenue, flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <p style={{
                  fontSize: '13px', fontWeight: 600, color: C.menuTexto,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>
                  {cliente.nombre}
                </p>
                <p style={{ fontSize: '11px', color: C.menuTenue }}>{cliente.numero}</p>
              </div>
            </div>
            <button type="button" onClick={() => setCuentaAbierta(true)}
              style={{ ...btn.texto, color: C.menuSuave, width: '100%', justifyContent: 'flex-start', fontSize: '13px' }}>
              <FaCog style={{ fontSize: '13px' }} /> Cuenta y seguridad
            </button>
            <button type="button" onClick={salir}
              style={{ ...btn.texto, color: C.menuSuave, width: '100%', justifyContent: 'flex-start', fontSize: '13px' }}>
              <FaSignOutAlt style={{ fontSize: '13px' }} /> Cerrar sesión
            </button>
          </div>
        </aside>
      )}

      {/* Contenido */}
      <div style={{
        flex: 1, minWidth: 0, position: 'relative', zIndex: 1,
        marginLeft: isMobile ? 0 : `${ANCHO_MENU}px`,
        paddingBottom: isMobile ? '80px' : 0
      }}>
        {isMobile && (
          <header style={{
            position: 'sticky', top: 0, zIndex: 900, background: C.panel,
            borderBottom: `1px solid ${C.borde}`, padding: '12px 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <a href="/">
              <img src={C.claro ? logoDark : logoWhite} alt="EVS Logistics" style={{ height: '30px', objectFit: 'contain' }} />
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <p style={{
                fontSize: '12px', color: C.suave, overflow: 'hidden',
                textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px'
              }}>
                {cliente.numero}
              </p>
              <button type="button" onClick={() => setCuentaAbierta(true)} aria-label="Cuenta y seguridad"
                style={{ ...btn.texto, padding: '6px' }}>
                <FaCog />
              </button>
              <button type="button" onClick={salir} aria-label="Cerrar sesión"
                style={{ ...btn.texto, padding: '6px' }}>
                <FaSignOutAlt />
              </button>
            </div>
          </header>
        )}

        {cliente.dev && (
          <div style={{
            background: '#3a1d6e', borderBottom: '1px solid rgba(255,255,255,0.14)',
            padding: isMobile ? '10px 16px' : '10px 40px',
            display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap'
          }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', fontSize: '12px', fontWeight: 700, color: '#d6bcfa' }}>
              <FaUserShield /> Modo desarrollador
            </span>
            <form onSubmit={verCliente} style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '220px', maxWidth: '420px' }}>
              <input
                value={numeroDev} onChange={e => setNumeroDev(e.target.value)}
                placeholder="Ver cuenta de otro cliente (número)"
                style={{
                  flex: 1, padding: '8px 12px', borderRadius: '8px', fontSize: '13px', fontFamily: 'inherit',
                  background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', outline: 'none'
                }}
              />
              <button type="submit" style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontSize: '13px',
                fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer'
              }}>
                <FaSearch style={{ fontSize: '11px' }} /> Ver
              </button>
            </form>
            <span style={{ fontSize: '12px', color: '#b794e6' }}>Viendo: {cliente.numero}</span>
          </div>
        )}

        <main style={{
          maxWidth: '1000px', margin: '0 auto',
          padding: isMobile ? '22px 16px 40px' : '40px 40px 70px'
        }}>
          {MODO_DEMO && (
            <div style={{
              padding: '12px 16px', borderRadius: '10px', marginBottom: '22px',
              background: 'rgba(99,179,237,0.1)', border: '1px solid rgba(99,179,237,0.3)'
            }}>
              <p style={{ fontSize: '13px', color: '#bee3f8', lineHeight: 1.5 }}>
                Modo de prueba local con datos de ejemplo.
              </p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {seccion === 'envios' && envioAbierto && (
              <DetalleEnvio key="detalle" envioId={envioAbierto} onVolver={() => setEnvioAbierto(null)} />
            )}
            {seccion === 'envios' && !envioAbierto && (
              <motion.div key="envios" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <MisEnvios onAbrir={envio => { setEnvioAbierto(envio.id); window.scrollTo(0, 0) }} />
              </motion.div>
            )}
            {seccion === 'pagos' && (
              <motion.div key="pagos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Pagos />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {cuentaAbierta && (
          <CuentaCliente
            key="cuenta" cliente={cliente}
            onCerrar={() => setCuentaAbierta(false)}
            onActualizar={actualizado => setCliente(c => ({ ...c, ...actualizado }))}
          />
        )}
      </AnimatePresence>

      {/* Menú inferior (celular) */}
      {isMobile && (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 900,
          background: C.panel, borderTop: `1px solid ${C.borde}`,
          padding: '8px 12px calc(8px + env(safe-area-inset-bottom))',
          display: 'flex', gap: '8px'
        }}>
          <Menu />
        </div>
      )}
    </div>
  )
}

export default Portal
