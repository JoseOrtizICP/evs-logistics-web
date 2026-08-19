import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaPlus, FaSearch, FaSignOutAlt, FaUserCog, FaEdit, FaTrash, FaSyncAlt, FaBoxOpen, FaUsers, FaFileInvoiceDollar } from 'react-icons/fa'
import logoWhite from '../assets/logo-white.png'
import useIsMobile from '../hooks/useIsMobile'
import { listarGuias, eliminarGuia, verificarSesion, leerToken, borrarToken, MODO_DEMO } from '../lib/api'
import { ESTATUS, buscarEstatus, buscarServicio, formatearFecha, formatearFechaHora } from '../data/estatus'
import Login from './Login'
import FormGuia from './FormGuia'
import DetalleGuia from './DetalleGuia'
import Cuenta from './Cuenta'
import Clientes from './Clientes'
import Facturas from './Facturas'
import FormFactura from './FormFactura'
import { tarjeta, input, boton, enfoque, COLORES } from './ui'

const Insignia = ({ estatus }) => {
  const info = buscarEstatus(estatus)
  return (
    <span style={{
      padding: '5px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700,
      background: `${info.color}1f`, color: info.color, border: `1px solid ${info.color}44`,
      whiteSpace: 'nowrap', display: 'inline-block'
    }}>
      {info.etiqueta}
    </span>
  )
}

const FilaGuia = ({ guia, isMobile, onAbrir, onEditar, onEliminar }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
    onClick={() => onAbrir(guia)}
    style={{
      ...tarjeta, padding: isMobile ? '16px' : '18px 20px', cursor: 'pointer',
      display: 'flex', flexDirection: isMobile ? 'column' : 'row',
      alignItems: isMobile ? 'stretch' : 'center', gap: isMobile ? '12px' : '20px'
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,179,237,0.4)' }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = COLORES.borde }}
  >
    <div style={{ flex: '0 0 auto', minWidth: isMobile ? 0 : '170px' }}>
      <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff', letterSpacing: '0.3px' }}>{guia.numero}</p>
      {guia.cliente && (
        <p style={{ fontSize: '12px', color: COLORES.textoTenue, marginTop: '3px' }}>{guia.cliente}</p>
      )}
    </div>

    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.4 }}>
        {guia.origen} <span style={{ color: COLORES.azulClaro }}>→</span> {guia.destino}
      </p>
      <p style={{ fontSize: '12px', color: COLORES.textoTenue, marginTop: '3px' }}>
        {buscarServicio(guia.servicio) ? `${buscarServicio(guia.servicio)} · ` : ''}
        {guia.fecha_estimada ? `Entrega estimada ${formatearFecha(guia.fecha_estimada)}` : 'Sin fecha estimada'}
        {` · ${guia.total_eventos ?? 0} movimiento${guia.total_eventos === 1 ? '' : 's'}`}
      </p>
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
      <Insignia estatus={guia.estatus} />
      <button type="button" title="Editar datos"
        onClick={e => { e.stopPropagation(); onEditar(guia) }}
        style={{ ...boton.fantasma, padding: '8px' }}>
        <FaEdit />
      </button>
      <button type="button" title="Eliminar guía"
        onClick={e => { e.stopPropagation(); onEliminar(guia) }}
        style={{ ...boton.fantasma, padding: '8px', color: '#fc8181' }}>
        <FaTrash style={{ fontSize: '13px' }} />
      </button>
    </div>
  </motion.div>
)

const Admin = () => {
  const isMobile = useIsMobile()
  const [usuario, setUsuario] = useState(null)
  const [verificando, setVerificando] = useState(true)

  const [guias, setGuias] = useState([])
  const [cargando, setCargando] = useState(false)
  const [errorLista, setErrorLista] = useState('')
  const [buscar, setBuscar] = useState('')
  const [filtro, setFiltro] = useState('')

  const [formAbierto, setFormAbierto] = useState(false)
  const [guiaEditando, setGuiaEditando] = useState(null)
  const [detalleId, setDetalleId] = useState(null)
  const [cuentaAbierta, setCuentaAbierta] = useState(false)
  const [seccion, setSeccion] = useState('guias')
  const [aviso, setAviso] = useState('')

  // Sesión guardada: se valida contra el servidor antes de mostrar el panel.
  useEffect(() => {
    if (!leerToken()) {
      setVerificando(false)
      return
    }
    verificarSesion()
      .then(({ usuario }) => setUsuario(usuario))
      .catch(() => borrarToken())
      .finally(() => setVerificando(false))
  }, [])

  const cargar = useCallback(async () => {
    setCargando(true)
    setErrorLista('')
    try {
      const { guias } = await listarGuias({ buscar, estatus: filtro })
      setGuias(guias)
    } catch (err) {
      setErrorLista(err.message)
      if (err.codigo === 401) setUsuario(null)
    } finally {
      setCargando(false)
    }
  }, [buscar, filtro])

  // Espera a que el usuario deje de escribir antes de consultar.
  useEffect(() => {
    if (!usuario) return
    const temporizador = setTimeout(cargar, buscar ? 300 : 0)
    return () => clearTimeout(temporizador)
  }, [usuario, cargar, buscar])

  useEffect(() => {
    if (!aviso) return
    const temporizador = setTimeout(() => setAviso(''), 3200)
    return () => clearTimeout(temporizador)
  }, [aviso])

  const salir = () => {
    borrarToken()
    setUsuario(null)
    setGuias([])
  }

  const eliminar = async (guia) => {
    if (!window.confirm(`¿Eliminar la guía ${guia.numero}? Se borrará también su historial y el cliente ya no podrá consultarla.`)) return
    try {
      await eliminarGuia(guia.id)
      setAviso('Guía eliminada.')
      cargar()
    } catch (err) {
      setErrorLista(err.message)
    }
  }

  const alGuardar = (_guia, mensaje) => {
    setFormAbierto(false)
    setGuiaEditando(null)
    setAviso(mensaje)
    cargar()
  }

  if (verificando) {
    return (
      <div style={{ minHeight: '100vh', background: COLORES.fondo, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: COLORES.textoSuave, fontSize: '14px' }}>Verificando sesión…</p>
      </div>
    )
  }

  if (!usuario) return <Login onEntrar={setUsuario} />

  return (
    <div style={{ minHeight: '100vh', background: COLORES.fondo, color: '#fff' }}>
      {/* Encabezado */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 900, background: 'rgba(26,54,93,0.97)',
        backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '12px 16px' : '14px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
            <img src={logoWhite} alt="EVS Logistics" style={{ height: '32px', objectFit: 'contain' }} />
            {!isMobile && (
              <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: COLORES.azulClaro }}>
                Panel maestro
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {!isMobile && (
              <span style={{ fontSize: '13px', color: COLORES.textoSuave, marginRight: '6px' }}>
                {usuario.nombre || usuario.email}
              </span>
            )}
            <button type="button" onClick={() => setCuentaAbierta(true)} title="Cuenta y usuarios" style={boton.fantasma}>
              <FaUserCog />
            </button>
            <button type="button" onClick={salir} title="Cerrar sesión" style={boton.fantasma}>
              <FaSignOutAlt />
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '20px 16px 60px' : '32px 24px 80px' }}>
        {/* Secciones del panel maestro */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '22px', flexWrap: 'wrap' }}>
          {[
            { clave: 'guias', etiqueta: 'Guías', icono: FaBoxOpen },
            { clave: 'clientes', etiqueta: 'Clientes', icono: FaUsers },
            { clave: 'facturas', etiqueta: 'Facturas', icono: FaFileInvoiceDollar }
          ].map(s => {
            const activo = seccion === s.clave
            return (
              <button key={s.clave} type="button" onClick={() => setSeccion(s.clave)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '9px', padding: '11px 20px',
                  borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: '14px', fontWeight: activo ? 700 : 500,
                  background: activo ? 'rgba(49,130,206,0.22)' : 'rgba(255,255,255,0.05)',
                  color: activo ? COLORES.azulClaro : COLORES.textoSuave, transition: 'all 0.15s'
                }}>
                <s.icono style={{ fontSize: '14px' }} /> {s.etiqueta}
              </button>
            )
          })}
        </div>

        {MODO_DEMO && (
          <div style={{
            padding: '12px 16px', borderRadius: '10px', marginBottom: '20px',
            background: 'rgba(99,179,237,0.1)', border: '1px solid rgba(99,179,237,0.3)'
          }}>
            <p style={{ fontSize: '13px', color: '#bee3f8', lineHeight: 1.5 }}>
              Modo de prueba local: los cambios se guardan solo en esta pestaña y se pierden al recargar.
            </p>
          </div>
        )}

        {seccion === 'guias' && (
        <>
        {/* Barra de acciones */}
        <div style={{
          display: 'flex', flexDirection: isMobile ? 'column' : 'row',
          gap: '12px', alignItems: isMobile ? 'stretch' : 'center', marginBottom: '24px'
        }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <FaSearch style={{
              position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
              color: COLORES.textoTenue, fontSize: '13px', pointerEvents: 'none'
            }} />
            <input
              value={buscar} onChange={e => setBuscar(e.target.value)}
              placeholder="Buscar por número, cliente, origen o destino"
              aria-label="Buscar guías"
              style={{ ...input, paddingLeft: '40px' }} {...enfoque}
            />
          </div>

          <select value={filtro} onChange={e => setFiltro(e.target.value)} aria-label="Filtrar por estatus"
            style={{ ...input, width: isMobile ? '100%' : '210px' }} {...enfoque}>
            <option value="">Todos los estatus</option>
            {ESTATUS.map(e => <option key={e.clave} value={e.clave}>{e.etiqueta}</option>)}
          </select>

          <button type="button" onClick={cargar} title="Actualizar" style={{ ...boton.secundario, flexShrink: 0 }}>
            <FaSyncAlt style={{ fontSize: '13px' }} />
          </button>

          <button type="button" onClick={() => { setGuiaEditando(null); setFormAbierto(true) }}
            style={{ ...boton.primario, flexShrink: 0 }}>
            <FaPlus style={{ fontSize: '12px' }} /> Nueva guía
          </button>
        </div>

        {errorLista && (
          <div style={{
            padding: '14px 16px', borderRadius: '10px', marginBottom: '20px',
            background: 'rgba(229,62,62,0.12)', border: '1px solid rgba(229,62,62,0.3)'
          }}>
            <p style={{ fontSize: '13px', color: '#feb2b2', lineHeight: 1.5 }}>{errorLista}</p>
          </div>
        )}

        {/* Listado */}
        {cargando && guias.length === 0 ? (
          <p style={{ fontSize: '14px', color: COLORES.textoSuave, padding: '40px 0', textAlign: 'center' }}>
            Cargando guías…
          </p>
        ) : guias.length === 0 ? (
          <div style={{ ...tarjeta, padding: '60px 24px', textAlign: 'center' }}>
            <FaBoxOpen style={{ fontSize: '32px', color: COLORES.textoTenue, marginBottom: '14px' }} />
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>
              {buscar || filtro ? 'No hay guías que coincidan' : 'Todavía no hay guías registradas'}
            </p>
            <p style={{ fontSize: '14px', color: COLORES.textoSuave, lineHeight: 1.6 }}>
              {buscar || filtro
                ? 'Prueba con otro término o quita el filtro.'
                : 'Crea la primera guía y compártele el número a tu cliente.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '10px' }}>
            <AnimatePresence mode="popLayout">
              {guias.map(guia => (
                <FilaGuia
                  key={guia.id} guia={guia} isMobile={isMobile}
                  onAbrir={g => setDetalleId(g.id)}
                  onEditar={g => { setGuiaEditando(g); setFormAbierto(true) }}
                  onEliminar={eliminar}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {guias.length > 0 && (
          <p style={{ fontSize: '12px', color: COLORES.textoTenue, marginTop: '20px', textAlign: 'center' }}>
            {guias.length} guía{guias.length === 1 ? '' : 's'} · actualizado {formatearFechaHora(new Date().toISOString())}
          </p>
        )}
        </>
        )}

        {seccion === 'clientes' && <Clientes onAviso={setAviso} />}
        {seccion === 'facturas' && <Facturas onAviso={setAviso} FormFactura={FormFactura} />}
      </main>

      {/* Modales */}
      <AnimatePresence>
        {formAbierto && (
          <FormGuia
            key="form" guia={guiaEditando}
            onCerrar={() => { setFormAbierto(false); setGuiaEditando(null) }}
            onGuardada={alGuardar}
          />
        )}
        {detalleId && (
          <DetalleGuia
            key="detalle" guiaId={detalleId}
            onCerrar={() => setDetalleId(null)}
            onCambio={cargar}
          />
        )}
        {cuentaAbierta && (
          <Cuenta key="cuenta" usuario={usuario} onCerrar={() => setCuentaAbierta(false)} />
        )}
      </AnimatePresence>

      {/* Aviso flotante */}
      <AnimatePresence>
        {aviso && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            style={{
              position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 1300,
              padding: '13px 24px', borderRadius: '999px', background: '#1a365d',
              border: '1px solid rgba(99,179,237,0.4)', boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
              fontSize: '14px', color: '#fff', fontWeight: 600, whiteSpace: 'nowrap'
            }}
          >
            {aviso}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Admin
