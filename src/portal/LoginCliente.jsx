import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaExclamationCircle, FaWhatsapp } from 'react-icons/fa'
import logoWhite from '../assets/logo-white.png'
import useIsMobile from '../hooks/useIsMobile'
import Fondo from './Fondo'
import { entrar, guardarTokenCliente, MODO_DEMO } from '../lib/apiPortal'
import { TEMA_OSCURO, apagado } from './ui'

const WHATSAPP = 'https://wa.me/5215548268211?text=Hola,%20necesito%20mis%20datos%20de%20acceso%20al%20portal%20de%20clientes'

// La pantalla de acceso va siempre en azul marino, aunque el interior del
// portal use el tema claro: entrada con marca, interior legible.
const { C, panel, campo, rotulo, btn, foco } = TEMA_OSCURO

const LoginCliente = ({ onEntrar }) => {
  const isMobile = useIsMobile()
  const navigate = useNavigate()
  // Puerta discreta al panel de administración: 3 clics rápidos en el logo
  // llevan a /admin. No hay nada visible; solo el equipo conoce el gesto.
  const golpesLogo = useRef(0)
  const golpeTimer = useRef(null)
  const tocarLogo = () => {
    golpesLogo.current += 1
    clearTimeout(golpeTimer.current)
    if (golpesLogo.current >= 3) {
      golpesLogo.current = 0
      navigate('/admin')
      return
    }
    golpeTimer.current = setTimeout(() => { golpesLogo.current = 0 }, 1200)
  }
  const [numero, setNumero] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    setEnviando(true)
    setError('')

    try {
      const { token, cliente } = await entrar(numero.trim(), password)
      guardarTokenCliente(token)
      onEntrar(cliente)
    } catch (err) {
      setError(err.message)
      setEnviando(false)
    }
  }

  const listo = numero.trim() && password && !enviando

  return (
    <div style={{
      minHeight: '100vh', background: C.fondo, display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: isMobile ? '24px 16px' : '40px 24px',
      position: 'relative'
    }}>
      <Fondo tokens={TEMA_OSCURO} />
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}
      >
        <a href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none',
          color: C.tenue, fontSize: '13px', marginBottom: '28px'
        }}>
          <FaArrowLeft style={{ fontSize: '11px' }} /> Volver al sitio
        </a>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <img src={logoWhite} alt="EVS Logistics" onClick={tocarLogo}
            style={{ height: '52px', objectFit: 'contain', cursor: 'default', userSelect: 'none' }} />
          <p style={{
            fontSize: '12px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase',
            color: C.azulClaro, marginTop: '16px'
          }}>
            Portal de clientes
          </p>
        </div>

        <form onSubmit={enviar} style={{ ...panel, padding: isMobile ? '26px 22px' : '34px' }}>
          <h1 style={{ fontSize: '21px', fontWeight: 700, color: C.texto, marginBottom: '6px' }}>
            Bienvenido
          </h1>
          <p style={{ fontSize: '14px', color: C.suave, lineHeight: 1.6, marginBottom: '26px' }}>
            Consulta tus envíos y tu estado de cuenta.
          </p>

          <div style={{ marginBottom: '18px' }}>
            <label htmlFor="cliente-numero" style={rotulo}>Número de cliente</label>
            <input
              id="cliente-numero" value={numero} autoComplete="username" spellCheck="false"
              placeholder="EVS-C-0000"
              onChange={e => setNumero(e.target.value)}
              style={{ ...campo, letterSpacing: '0.5px' }} {...foco}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="cliente-password" style={rotulo}>Contraseña</label>
            <input
              id="cliente-password" type="password" value={password} autoComplete="current-password"
              onChange={e => setPassword(e.target.value)}
              style={campo} {...foco}
            />
          </div>

          {error && (
            <div style={{
              display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '12px 14px',
              borderRadius: '10px', background: 'rgba(229,62,62,0.12)',
              border: '1px solid rgba(229,62,62,0.3)', marginBottom: '20px'
            }}>
              <FaExclamationCircle style={{ color: C.rojoClaro, marginTop: '2px', flexShrink: 0 }} />
              <p style={{ fontSize: '13px', color: C.rojoClaro, lineHeight: 1.5 }}>{error}</p>
            </div>
          )}

          <button type="submit" disabled={!listo}
            style={{ ...btn.primario, width: '100%', padding: '14px', ...(listo ? {} : apagado) }}>
            {enviando ? 'Entrando…' : 'Entrar'}
          </button>

          {MODO_DEMO && (
            <p style={{ fontSize: '12px', color: C.tenue, marginTop: '18px', textAlign: 'center', lineHeight: 1.5 }}>
              Modo de prueba local: cualquier número y contraseña funcionan.
            </p>
          )}
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ fontSize: '13px', color: C.tenue, marginBottom: '10px' }}>
            ¿No tienes acceso o no recuerdas tu contraseña?
          </p>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
            style={{ ...btn.contorno, textDecoration: 'none', fontSize: '13px', padding: '10px 18px' }}>
            <FaWhatsapp /> Escríbenos por WhatsApp
          </a>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginCliente
