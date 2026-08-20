import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaPlus, FaSearch, FaEdit, FaKey, FaUserSlash, FaUserCheck, FaUsers, FaCheck, FaCopy, FaTrash } from 'react-icons/fa'
import { listarClientes, actualizarCliente, cambiarPasswordCliente, eliminarCliente } from '../lib/api'
import { dinero } from './ui'
import FormCliente from './FormCliente'
import { tarjeta, input, boton, enfoque, deshabilitado, COLORES } from './ui'

// Contraseña temporal generada al restablecer.
const generarPassword = () => {
  const letras = 'ABCDEFGHJKMNPQRSTUVWXYZ', numeros = '23456789'
  let c = ''
  for (let i = 0; i < 4; i++) c += letras[Math.floor(Math.random() * letras.length)]
  for (let i = 0; i < 4; i++) c += numeros[Math.floor(Math.random() * numeros.length)]
  return c
}

// Aviso con las credenciales recién creadas, para copiarlas antes de perderlas.
const AvisoCredenciales = ({ numero, password, onCerrar }) => {
  const [copiado, setCopiado] = useState(false)
  const texto = `Portal EVS Logistics\nNúmero de cliente: ${numero}\nContraseña: ${password}\nEntra en: https://www.evslogist.com/portal`

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onCerrar}
      style={{
        position: 'fixed', inset: 0, zIndex: 1250, background: 'rgba(6,14,26,0.8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 16px'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
        onClick={e => e.stopPropagation()}
        style={{ ...tarjeta, padding: '28px', width: '100%', maxWidth: '440px', background: '#132741' }}
      >
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
          Datos de acceso del cliente
        </h3>
        <p style={{ fontSize: '13px', color: COLORES.textoSuave, lineHeight: 1.6, marginBottom: '18px' }}>
          Cópialos y compártelos con el cliente. Por seguridad no se vuelven a mostrar.
        </p>
        <div style={{ background: 'rgba(0,0,0,0.25)', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
          <p style={{ fontSize: '12px', color: COLORES.textoTenue, marginBottom: '2px' }}>Número de cliente</p>
          <p style={{ fontSize: '16px', color: '#fff', fontWeight: 700, letterSpacing: '0.5px', marginBottom: '12px' }}>{numero}</p>
          <p style={{ fontSize: '12px', color: COLORES.textoTenue, marginBottom: '2px' }}>Contraseña temporal</p>
          <p style={{ fontSize: '16px', color: '#fff', fontWeight: 700, fontFamily: 'monospace', letterSpacing: '1px' }}>{password}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="button"
            onClick={() => { navigator.clipboard?.writeText(texto).then(() => { setCopiado(true); setTimeout(() => setCopiado(false), 1800) }).catch(() => {}) }}
            style={{ ...boton.secundario, flex: 1 }}>
            {copiado ? <><FaCheck style={{ color: COLORES.verde }} /> Copiado</> : <><FaCopy /> Copiar todo</>}
          </button>
          <button type="button" onClick={onCerrar} style={{ ...boton.primario, flex: 1 }}>Listo</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

const FilaCliente = ({ cliente, isMobile, onEditar, onPassword, onActivar, onEliminar }) => (
  <motion.div
    layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
    style={{
      ...tarjeta, padding: isMobile ? '16px' : '18px 20px', opacity: cliente.activo ? 1 : 0.55,
      display: 'flex', flexDirection: isMobile ? 'column' : 'row',
      alignItems: isMobile ? 'stretch' : 'center', gap: isMobile ? '12px' : '20px'
    }}
  >
    <div style={{ flex: '0 0 auto', minWidth: isMobile ? 0 : '140px' }}>
      <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff', letterSpacing: '0.3px' }}>{cliente.numero}</p>
      {!cliente.activo && <p style={{ fontSize: '11px', color: COLORES.rojoClaro, marginTop: '2px' }}>Inactivo</p>}
    </div>

    <div style={{ flex: 1, minWidth: 0 }}>
      <p style={{ fontSize: '14px', color: '#fff', fontWeight: 500 }}>{cliente.nombre}</p>
      <p style={{ fontSize: '12px', color: COLORES.textoTenue, marginTop: '3px' }}>
        {cliente.contacto ? `${cliente.contacto} · ` : ''}{cliente.email || 'sin correo'}
        {` · ${cliente.total_facturas ?? 0} factura${cliente.total_facturas === 1 ? '' : 's'}`}
      </p>
    </div>

    <div style={{ flexShrink: 0, textAlign: isMobile ? 'left' : 'right', minWidth: isMobile ? 0 : '120px' }}>
      <p style={{ fontSize: '11px', color: COLORES.textoTenue }}>Saldo</p>
      <p style={{ fontSize: '15px', fontWeight: 700, color: cliente.saldo > 0 ? COLORES.ambarClaro : '#fff' }}>
        {dinero(cliente.saldo || 0)}
      </p>
    </div>

    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
      <button type="button" title="Editar" onClick={() => onEditar(cliente)} style={{ ...boton.fantasma, padding: '8px' }}>
        <FaEdit />
      </button>
      <button type="button" title="Restablecer contraseña" onClick={() => onPassword(cliente)} style={{ ...boton.fantasma, padding: '8px' }}>
        <FaKey style={{ fontSize: '13px' }} />
      </button>
      <button type="button" title={cliente.activo ? 'Desactivar acceso' : 'Reactivar acceso'}
        onClick={() => onActivar(cliente)}
        style={{ ...boton.fantasma, padding: '8px', color: cliente.activo ? COLORES.rojoClaro : COLORES.verdeClaro }}>
        {cliente.activo ? <FaUserSlash style={{ fontSize: '13px' }} /> : <FaUserCheck style={{ fontSize: '13px' }} />}
      </button>
      <button type="button" title="Borrar cliente" onClick={() => onEliminar(cliente)}
        style={{ ...boton.fantasma, padding: '8px', color: COLORES.rojoClaro }}>
        <FaTrash style={{ fontSize: '13px' }} />
      </button>
    </div>
  </motion.div>
)

const Clientes = ({ onAviso }) => {
  const [clientes, setClientes] = useState([])
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [buscar, setBuscar] = useState('')
  const [formAbierto, setFormAbierto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [credenciales, setCredenciales] = useState(null)
  const isMobile = window.matchMedia('(max-width: 768px)').matches

  const cargar = useCallback(async () => {
    setCargando(true)
    setError('')
    try {
      const { clientes } = await listarClientes({ buscar })
      setClientes(clientes)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }, [buscar])

  useEffect(() => {
    const t = setTimeout(cargar, buscar ? 300 : 0)
    return () => clearTimeout(t)
  }, [cargar, buscar])

  const alGuardar = (_cliente, mensaje, password) => {
    setFormAbierto(false)
    setEditando(null)
    onAviso(mensaje)
    cargar()
    if (password) setCredenciales({ numero: _cliente.numero, password })
  }

  const restablecer = async (cliente) => {
    const nueva = generarPassword()
    if (!window.confirm(`¿Generar una nueva contraseña para ${cliente.numero}? La anterior dejará de funcionar.`)) return
    try {
      await cambiarPasswordCliente(cliente.id, nueva)
      setCredenciales({ numero: cliente.numero, password: nueva })
      onAviso('Contraseña restablecida.')
    } catch (err) {
      setError(err.message)
    }
  }

  const activar = async (cliente) => {
    try {
      await actualizarCliente(cliente.id, { activo: !cliente.activo })
      onAviso(cliente.activo ? 'Acceso desactivado.' : 'Acceso reactivado.')
      cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  const eliminar = async (cliente) => {
    if (!window.confirm(`¿Borrar a ${cliente.numero} de forma definitiva? Esta acción no se puede deshacer.\n\n(Si el cliente tiene guías o facturas, no se borrará: mejor desactívalo.)`)) return
    setError('')
    try {
      await eliminarCliente(cliente.id)
      onAviso('Cliente borrado.')
      cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <div style={{
        display: 'flex', flexDirection: isMobile ? 'column' : 'row',
        gap: '12px', alignItems: isMobile ? 'stretch' : 'center', marginBottom: '24px'
      }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <FaSearch style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: COLORES.textoTenue, fontSize: '13px', pointerEvents: 'none' }} />
          <input value={buscar} onChange={e => setBuscar(e.target.value)}
            placeholder="Buscar por número, nombre, contacto o correo" aria-label="Buscar clientes"
            style={{ ...input, paddingLeft: '40px' }} {...enfoque} />
        </div>
        <button type="button" onClick={() => { setEditando(null); setFormAbierto(true) }}
          style={{ ...boton.primario, flexShrink: 0 }}>
          <FaPlus style={{ fontSize: '12px' }} /> Nuevo cliente
        </button>
      </div>

      {error && (
        <div style={{ padding: '14px 16px', borderRadius: '10px', marginBottom: '20px', background: 'rgba(229,62,62,0.12)', border: '1px solid rgba(229,62,62,0.3)' }}>
          <p style={{ fontSize: '13px', color: '#feb2b2' }}>{error}</p>
        </div>
      )}

      {cargando && clientes.length === 0 ? (
        <p style={{ fontSize: '14px', color: COLORES.textoSuave, padding: '40px 0', textAlign: 'center' }}>Cargando clientes…</p>
      ) : clientes.length === 0 ? (
        <div style={{ ...tarjeta, padding: '60px 24px', textAlign: 'center' }}>
          <FaUsers style={{ fontSize: '32px', color: COLORES.textoTenue, marginBottom: '14px' }} />
          <p style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>
            {buscar ? 'No hay clientes que coincidan' : 'Todavía no hay clientes'}
          </p>
          <p style={{ fontSize: '14px', color: COLORES.textoSuave }}>
            {buscar ? 'Prueba con otro término.' : 'Crea el primer cliente y entrégale su número y contraseña.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '10px' }}>
          <AnimatePresence mode="popLayout">
            {clientes.map(cliente => (
              <FilaCliente key={cliente.id} cliente={cliente} isMobile={isMobile}
                onEditar={c => { setEditando(c); setFormAbierto(true) }}
                onPassword={restablecer} onActivar={activar} onEliminar={eliminar} />
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {formAbierto && (
          <FormCliente key="form" cliente={editando}
            onCerrar={() => { setFormAbierto(false); setEditando(null) }}
            onGuardado={alGuardar} />
        )}
        {credenciales && (
          <AvisoCredenciales key="cred" numero={credenciales.numero} password={credenciales.password}
            onCerrar={() => setCredenciales(null)} />
        )}
      </AnimatePresence>
    </>
  )
}

export default Clientes
