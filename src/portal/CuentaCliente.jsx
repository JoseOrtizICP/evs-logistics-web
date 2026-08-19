import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaTimes, FaShieldAlt, FaKey, FaEnvelopeOpenText, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import { cambiarPasswordCliente, guardarCorreoSeguridad } from '../lib/apiPortal'
import { C, panel, campo, rotulo, btn, apagado, foco } from './ui'

const Aviso = ({ tipo, children }) => {
  const rojo = tipo === 'error'
  return (
    <div style={{
      display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '12px 14px', borderRadius: '10px',
      background: rojo ? 'rgba(229,62,62,0.1)' : 'rgba(56,161,105,0.1)',
      border: `1px solid ${rojo ? 'rgba(229,62,62,0.28)' : 'rgba(56,161,105,0.28)'}`,
      marginTop: '14px'
    }}>
      {rojo
        ? <FaExclamationCircle style={{ color: C.rojoClaro, marginTop: '2px', flexShrink: 0 }} />
        : <FaCheckCircle style={{ color: C.verdeClaro, marginTop: '2px', flexShrink: 0 }} />}
      <p style={{ fontSize: '13px', color: rojo ? C.rojoClaro : C.verdeClaro, lineHeight: 1.5 }}>{children}</p>
    </div>
  )
}

const Bloque = ({ icono: Icono, titulo, descripcion, children }) => (
  <section style={{ ...panel, padding: '22px', marginBottom: '16px' }}>
    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '18px' }}>
      <div style={{
        width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
        background: 'rgba(49,130,206,0.12)', color: C.azul,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px'
      }}>
        <Icono />
      </div>
      <div>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: C.texto }}>{titulo}</h3>
        <p style={{ fontSize: '13px', color: C.suave, lineHeight: 1.5, marginTop: '2px' }}>{descripcion}</p>
      </div>
    </div>
    {children}
  </section>
)

const CuentaCliente = ({ cliente, onCerrar, onActualizar }) => {
  // Cambio de contraseña
  const [pass, setPass] = useState({ actual: '', nueva: '', repetir: '' })
  const [avisoPass, setAvisoPass] = useState(null)
  const [guardandoPass, setGuardandoPass] = useState(false)

  // Correo de seguridad
  const [correo, setCorreo] = useState(cliente.correo_seguridad || '')
  const [avisoCorreo, setAvisoCorreo] = useState(null)
  const [guardandoCorreo, setGuardandoCorreo] = useState(false)

  const cambiarPass = async (e) => {
    e.preventDefault()
    setAvisoPass(null)
    if (pass.nueva.length < 8) return setAvisoPass({ tipo: 'error', texto: 'La nueva contraseña debe tener al menos 8 caracteres.' })
    if (pass.nueva !== pass.repetir) return setAvisoPass({ tipo: 'error', texto: 'Las contraseñas nuevas no coinciden.' })

    setGuardandoPass(true)
    try {
      await cambiarPasswordCliente(pass.actual, pass.nueva)
      setPass({ actual: '', nueva: '', repetir: '' })
      setAvisoPass({ tipo: 'ok', texto: 'Tu contraseña se actualizó correctamente.' })
    } catch (err) {
      setAvisoPass({ tipo: 'error', texto: err.message })
    } finally {
      setGuardandoPass(false)
    }
  }

  const guardarCorreo = async (e) => {
    e.preventDefault()
    setAvisoCorreo(null)
    setGuardandoCorreo(true)
    try {
      const { cliente: actualizado } = await guardarCorreoSeguridad(correo.trim())
      setAvisoCorreo({ tipo: 'ok', texto: correo.trim() ? 'Correo de seguridad guardado.' : 'Correo de seguridad eliminado.' })
      if (onActualizar && actualizado) onActualizar(actualizado)
    } catch (err) {
      setAvisoCorreo({ tipo: 'error', texto: err.message })
    } finally {
      setGuardandoCorreo(false)
    }
  }

  const listoPass = pass.actual && pass.nueva && pass.repetir && !guardandoPass
  const correoCambio = correo.trim() !== (cliente.correo_seguridad || '')

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onCerrar}
      style={{
        position: 'fixed', inset: 0, zIndex: 1200, background: 'rgba(5,12,22,0.6)',
        backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'flex-start',
        justifyContent: 'center', padding: '24px 16px', overflowY: 'auto'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
        onClick={e => e.stopPropagation()}
        style={{ width: '100%', maxWidth: '540px', margin: 'auto' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <h2 style={{ fontSize: '19px', fontWeight: 800, color: C.texto, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaShieldAlt style={{ fontSize: '16px', color: C.azul }} /> Cuenta y seguridad
          </h2>
          <button type="button" onClick={onCerrar} aria-label="Cerrar"
            style={{ background: 'none', border: 'none', color: C.suave, fontSize: '18px', cursor: 'pointer' }}>
            <FaTimes />
          </button>
        </div>

        <Bloque icono={FaKey} titulo="Cambiar contraseña"
          descripcion="Usa una contraseña que no utilices en otros sitios.">
          <form onSubmit={cambiarPass}>
            <div style={{ display: 'grid', gap: '13px' }}>
              <div>
                <label htmlFor="c-actual" style={rotulo}>Contraseña actual</label>
                <input id="c-actual" type="password" autoComplete="current-password" value={pass.actual}
                  onChange={e => setPass(p => ({ ...p, actual: e.target.value }))} style={campo} {...foco} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '13px' }}>
                <div>
                  <label htmlFor="c-nueva" style={rotulo}>Nueva contraseña</label>
                  <input id="c-nueva" type="password" autoComplete="new-password" value={pass.nueva}
                    onChange={e => setPass(p => ({ ...p, nueva: e.target.value }))} style={campo} {...foco} />
                </div>
                <div>
                  <label htmlFor="c-repetir" style={rotulo}>Repetir nueva</label>
                  <input id="c-repetir" type="password" autoComplete="new-password" value={pass.repetir}
                    onChange={e => setPass(p => ({ ...p, repetir: e.target.value }))} style={campo} {...foco} />
                </div>
              </div>
            </div>
            {avisoPass && <Aviso tipo={avisoPass.tipo}>{avisoPass.texto}</Aviso>}
            <button type="submit" disabled={!listoPass}
              style={{ ...btn.primario, marginTop: '16px', ...(listoPass ? {} : apagado) }}>
              {guardandoPass ? 'Guardando…' : 'Actualizar contraseña'}
            </button>
          </form>
        </Bloque>

        <Bloque icono={FaEnvelopeOpenText} titulo="Correo de seguridad"
          descripcion="Sirve para recuperar tu acceso si olvidas la contraseña y para avisarte de movimientos importantes.">
          <form onSubmit={guardarCorreo}>
            <label htmlFor="c-correo" style={rotulo}>Correo electrónico</label>
            <input id="c-correo" type="email" autoComplete="email" value={correo}
              placeholder="tucorreo@empresa.com"
              onChange={e => setCorreo(e.target.value)} style={campo} {...foco} />
            {avisoCorreo && <Aviso tipo={avisoCorreo.tipo}>{avisoCorreo.texto}</Aviso>}
            <button type="submit" disabled={!correoCambio || guardandoCorreo}
              style={{ ...btn.primario, marginTop: '16px', ...(correoCambio && !guardandoCorreo ? {} : apagado) }}>
              {guardandoCorreo ? 'Guardando…' : 'Guardar correo'}
            </button>
          </form>
        </Bloque>
      </motion.div>
    </motion.div>
  )
}

export default CuentaCliente
