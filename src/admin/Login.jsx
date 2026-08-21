import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaLock, FaExclamationCircle, FaArrowLeft } from 'react-icons/fa'
import logoWhite from '../assets/logo-white.png'
import { iniciarSesion, guardarToken, MODO_DEMO } from '../lib/api'
import { tarjeta, input, etiqueta, boton, deshabilitado, enfoque, COLORES } from './ui'

const Login = ({ onEntrar }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    setEnviando(true)
    setError('')

    try {
      const { token, usuario } = await iniciarSesion(email, password)
      guardarToken(token)
      onEntrar(usuario)
    } catch (err) {
      setError(err.message)
      setEnviando(false)
    }
  }

  const listo = email.trim() && password && !enviando

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(rgba(11,23,39,0.90), rgba(11,23,39,0.95)), url(/fotos/hero-port.jpg)',
      backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: '400px' }}
      >
        <a href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none',
          color: COLORES.textoTenue, fontSize: '13px', marginBottom: '24px'
        }}>
          <FaArrowLeft style={{ fontSize: '11px' }} /> Volver al sitio
        </a>

        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <img src={logoWhite} alt="EVS Logistics" style={{ height: '48px', objectFit: 'contain' }} />
          <p style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: COLORES.azulClaro, marginTop: '14px' }}>
            Panel de administrador
          </p>
        </div>

        <form onSubmit={enviar} style={{ ...tarjeta, padding: '32px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#fff', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaLock style={{ fontSize: '15px', color: COLORES.azulClaro }} /> Iniciar sesión
          </h1>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="admin-email" style={etiqueta}>Correo</label>
            <input
              id="admin-email" type="email" value={email} autoComplete="username"
              onChange={e => setEmail(e.target.value)} style={input} {...enfoque}
            />
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label htmlFor="admin-password" style={etiqueta}>Contraseña</label>
            <input
              id="admin-password" type="password" value={password} autoComplete="current-password"
              onChange={e => setPassword(e.target.value)} style={input} {...enfoque}
            />
          </div>

          {error && (
            <div style={{
              display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '12px 14px',
              borderRadius: '10px', background: 'rgba(229,62,62,0.12)', border: '1px solid rgba(229,62,62,0.3)',
              marginBottom: '18px'
            }}>
              <FaExclamationCircle style={{ color: '#fc8181', marginTop: '2px', flexShrink: 0 }} />
              <p style={{ fontSize: '13px', color: '#feb2b2', lineHeight: 1.5 }}>{error}</p>
            </div>
          )}

          <button type="submit" disabled={!listo}
            style={{ ...boton.primario, width: '100%', padding: '13px', ...(listo ? {} : deshabilitado) }}>
            {enviando ? 'Entrando…' : 'Entrar'}
          </button>

          {MODO_DEMO && (
            <p style={{ fontSize: '12px', color: COLORES.textoTenue, marginTop: '16px', textAlign: 'center', lineHeight: 1.5 }}>
              Modo de prueba local: cualquier correo y contraseña funcionan.
            </p>
          )}
        </form>

        <p style={{ fontSize: '12px', color: COLORES.textoTenue, textAlign: 'center', marginTop: '20px' }}>
          Acceso exclusivo para personal de EVS Logistics.
        </p>
      </motion.div>
    </div>
  )
}

export default Login
