import { useEffect, useState } from 'react'
import { FaUserPlus, FaExclamationCircle, FaCheckCircle, FaUserSlash } from 'react-icons/fa'
import Modal from './Modal'
import { cambiarPassword, listarUsuarios, crearUsuario, desactivarUsuario } from '../lib/api'
import { input, etiqueta, boton, deshabilitado, enfoque, COLORES } from './ui'

const Aviso = ({ tipo, children }) => {
  const rojo = tipo === 'error'
  return (
    <div style={{
      display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '12px 14px', borderRadius: '10px',
      background: rojo ? 'rgba(229,62,62,0.12)' : 'rgba(56,161,105,0.12)',
      border: `1px solid ${rojo ? 'rgba(229,62,62,0.3)' : 'rgba(56,161,105,0.3)'}`,
      marginTop: '14px'
    }}>
      {rojo
        ? <FaExclamationCircle style={{ color: '#fc8181', marginTop: '2px', flexShrink: 0 }} />
        : <FaCheckCircle style={{ color: '#68d391', marginTop: '2px', flexShrink: 0 }} />}
      <p style={{ fontSize: '13px', color: rojo ? '#feb2b2' : '#9ae6b4', lineHeight: 1.5 }}>{children}</p>
    </div>
  )
}

const Seccion = ({ titulo, children }) => (
  <section style={{ marginBottom: '32px' }}>
    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>{titulo}</h3>
    {children}
  </section>
)

const Cuenta = ({ usuario, onCerrar }) => {
  const [passwords, setPasswords] = useState({ actual: '', nueva: '', repetir: '' })
  const [avisoPassword, setAvisoPassword] = useState(null)
  const [cambiando, setCambiando] = useState(false)

  const [usuarios, setUsuarios] = useState([])
  const [nuevo, setNuevo] = useState({ nombre: '', email: '', password: '' })
  const [avisoUsuario, setAvisoUsuario] = useState(null)
  const [creando, setCreando] = useState(false)

  const cargarUsuarios = () => {
    listarUsuarios()
      .then(({ usuarios }) => setUsuarios(usuarios))
      .catch(err => setAvisoUsuario({ tipo: 'error', texto: err.message }))
  }

  useEffect(() => { cargarUsuarios() }, [])

  const guardarPassword = async (e) => {
    e.preventDefault()
    setAvisoPassword(null)

    if (passwords.nueva.length < 8) {
      return setAvisoPassword({ tipo: 'error', texto: 'La nueva contraseña debe tener al menos 8 caracteres.' })
    }
    if (passwords.nueva !== passwords.repetir) {
      return setAvisoPassword({ tipo: 'error', texto: 'Las contraseñas nuevas no coinciden.' })
    }

    setCambiando(true)
    try {
      await cambiarPassword(passwords.actual, passwords.nueva)
      setPasswords({ actual: '', nueva: '', repetir: '' })
      setAvisoPassword({ tipo: 'ok', texto: 'Tu contraseña se actualizó correctamente.' })
    } catch (err) {
      setAvisoPassword({ tipo: 'error', texto: err.message })
    } finally {
      setCambiando(false)
    }
  }

  const agregarUsuario = async (e) => {
    e.preventDefault()
    setAvisoUsuario(null)
    setCreando(true)

    try {
      await crearUsuario(nuevo)
      setNuevo({ nombre: '', email: '', password: '' })
      setAvisoUsuario({ tipo: 'ok', texto: 'Usuario creado. Ya puede entrar al panel.' })
      cargarUsuarios()
    } catch (err) {
      setAvisoUsuario({ tipo: 'error', texto: err.message })
    } finally {
      setCreando(false)
    }
  }

  const quitar = async (id, email) => {
    if (!window.confirm(`¿Desactivar el acceso de ${email}?`)) return

    try {
      await desactivarUsuario(id)
      cargarUsuarios()
      setAvisoUsuario({ tipo: 'ok', texto: 'El usuario ya no puede entrar al panel.' })
    } catch (err) {
      setAvisoUsuario({ tipo: 'error', texto: err.message })
    }
  }

  const listoPassword = passwords.actual && passwords.nueva && passwords.repetir && !cambiando
  const listoUsuario = nuevo.email.trim() && nuevo.password.length >= 8 && !creando

  return (
    <Modal titulo="Cuenta y usuarios" onCerrar={onCerrar} ancho="640px">
      <Seccion titulo="Cambiar mi contraseña">
        <form onSubmit={guardarPassword}>
          <div style={{ display: 'grid', gap: '14px' }}>
            <div>
              <label htmlFor="p-actual" style={etiqueta}>Contraseña actual</label>
              <input id="p-actual" type="password" autoComplete="current-password" value={passwords.actual}
                onChange={e => setPasswords(p => ({ ...p, actual: e.target.value }))} style={input} {...enfoque} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div>
                <label htmlFor="p-nueva" style={etiqueta}>Nueva contraseña</label>
                <input id="p-nueva" type="password" autoComplete="new-password" value={passwords.nueva}
                  onChange={e => setPasswords(p => ({ ...p, nueva: e.target.value }))} style={input} {...enfoque} />
              </div>
              <div>
                <label htmlFor="p-repetir" style={etiqueta}>Repetir nueva contraseña</label>
                <input id="p-repetir" type="password" autoComplete="new-password" value={passwords.repetir}
                  onChange={e => setPasswords(p => ({ ...p, repetir: e.target.value }))} style={input} {...enfoque} />
              </div>
            </div>
          </div>
          {avisoPassword && <Aviso tipo={avisoPassword.tipo}>{avisoPassword.texto}</Aviso>}
          <button type="submit" disabled={!listoPassword}
            style={{ ...boton.primario, marginTop: '16px', ...(listoPassword ? {} : deshabilitado) }}>
            {cambiando ? 'Guardando…' : 'Cambiar contraseña'}
          </button>
        </form>
      </Seccion>

      <Seccion titulo="Personas con acceso al panel">
        <div style={{ display: 'grid', gap: '8px', marginBottom: '20px' }}>
          {usuarios.filter(u => u.activo).map(u => (
            <div key={u.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
              padding: '12px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)'
            }}>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: '14px', color: '#fff', fontWeight: 600 }}>
                  {u.nombre || u.email}
                  {u.id === usuario.id && (
                    <span style={{ fontSize: '11px', color: COLORES.azulClaro, marginLeft: '8px', fontWeight: 600 }}>tú</span>
                  )}
                </p>
                <p style={{ fontSize: '12px', color: COLORES.textoTenue, overflow: 'hidden', textOverflow: 'ellipsis' }}>{u.email}</p>
              </div>
              {u.id !== usuario.id && (
                <button type="button" onClick={() => quitar(u.id, u.email)} title="Quitar acceso"
                  style={{ ...boton.fantasma, color: '#fc8181', flexShrink: 0 }}>
                  <FaUserSlash />
                </button>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={agregarUsuario} style={{
          padding: '18px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${COLORES.borde}`
        }}>
          <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '14px' }}>Dar acceso a alguien más</p>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '12px' }}>
              <div>
                <label htmlFor="u-nombre" style={etiqueta}>Nombre</label>
                <input id="u-nombre" value={nuevo.nombre} onChange={e => setNuevo(n => ({ ...n, nombre: e.target.value }))}
                  style={input} {...enfoque} />
              </div>
              <div>
                <label htmlFor="u-email" style={etiqueta}>Correo *</label>
                <input id="u-email" type="email" value={nuevo.email} onChange={e => setNuevo(n => ({ ...n, email: e.target.value }))}
                  style={input} {...enfoque} />
              </div>
            </div>
            <div>
              <label htmlFor="u-password" style={etiqueta}>Contraseña temporal * (mínimo 8 caracteres)</label>
              <input id="u-password" type="text" autoComplete="off" value={nuevo.password}
                onChange={e => setNuevo(n => ({ ...n, password: e.target.value }))} style={input} {...enfoque} />
              <p style={{ fontSize: '11px', color: COLORES.textoTenue, marginTop: '6px' }}>
                Compártesela en persona y pídele que la cambie al entrar.
              </p>
            </div>
          </div>
          {avisoUsuario && <Aviso tipo={avisoUsuario.tipo}>{avisoUsuario.texto}</Aviso>}
          <button type="submit" disabled={!listoUsuario}
            style={{ ...boton.primario, marginTop: '16px', ...(listoUsuario ? {} : deshabilitado) }}>
            <FaUserPlus style={{ fontSize: '12px' }} /> {creando ? 'Creando…' : 'Crear usuario'}
          </button>
        </form>
      </Seccion>
    </Modal>
  )
}

export default Cuenta
