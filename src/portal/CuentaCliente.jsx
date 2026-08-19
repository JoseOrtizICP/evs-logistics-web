import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaTimes, FaShieldAlt, FaKey, FaEnvelopeOpenText, FaCheckCircle, FaExclamationCircle, FaBuilding, FaMapMarkerAlt, FaPlus, FaTrash, FaEdit } from 'react-icons/fa'
import { useEffect } from 'react'
import { cambiarPasswordCliente, guardarCorreoSeguridad, actualizarPerfil, misDirecciones, crearDireccion, actualizarDireccion, eliminarDireccion } from '../lib/apiPortal'
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

const FormDireccion = ({ inicial, onGuardar, onCancelar }) => {
  const [d, setD] = useState({
    alias: '', destinatario: '', calle: '', ciudad: '', estado: '',
    codigo_postal: '', pais: 'México', telefono: '', referencias: '', ...inicial
  })
  const cambiar = (k) => (e) => setD(v => ({ ...v, [k]: e.target.value }))
  const listo = d.calle.trim() && d.ciudad.trim()

  const campoMini = { ...campo, padding: '10px 12px', fontSize: '14px' }

  return (
    <form onSubmit={e => { e.preventDefault(); if (listo) onGuardar(d) }}
      style={{ background: 'rgba(0,0,0,0.04)', borderRadius: '10px', padding: '16px', border: `1px solid ${C.borde}` }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '10px' }}>
        <input placeholder="Alias (ej. Bodega CDMX)" value={d.alias} onChange={cambiar('alias')} style={campoMini} {...foco} />
        <input placeholder="Destinatario" value={d.destinatario} onChange={cambiar('destinatario')} style={campoMini} {...foco} />
      </div>
      <input placeholder="Calle y número *" value={d.calle} onChange={cambiar('calle')} style={{ ...campoMini, marginBottom: '10px' }} {...foco} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', marginBottom: '10px' }}>
        <input placeholder="Ciudad *" value={d.ciudad} onChange={cambiar('ciudad')} style={campoMini} {...foco} />
        <input placeholder="Estado" value={d.estado} onChange={cambiar('estado')} style={campoMini} {...foco} />
        <input placeholder="Código postal" value={d.codigo_postal} onChange={cambiar('codigo_postal')} style={campoMini} {...foco} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px', marginBottom: '10px' }}>
        <input placeholder="País" value={d.pais} onChange={cambiar('pais')} style={campoMini} {...foco} />
        <input placeholder="Teléfono" value={d.telefono} onChange={cambiar('telefono')} style={campoMini} {...foco} />
      </div>
      <input placeholder="Referencias (portón, horario…)" value={d.referencias} onChange={cambiar('referencias')} style={{ ...campoMini, marginBottom: '12px' }} {...foco} />
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button type="button" onClick={onCancelar} style={{ ...btn.contorno, padding: '9px 16px', fontSize: '13px' }}>Cancelar</button>
        <button type="submit" disabled={!listo} style={{ ...btn.primario, padding: '9px 16px', fontSize: '13px', ...(listo ? {} : apagado) }}>Guardar</button>
      </div>
    </form>
  )
}

const CuentaCliente = ({ cliente, onCerrar, onActualizar }) => {
  // Cambio de contraseña
  const [pass, setPass] = useState({ actual: '', nueva: '', repetir: '' })
  const [avisoPass, setAvisoPass] = useState(null)
  const [guardandoPass, setGuardandoPass] = useState(false)

  // Correo de seguridad
  const [correo, setCorreo] = useState(cliente.correo_seguridad || '')
  const [avisoCorreo, setAvisoCorreo] = useState(null)
  const [guardandoCorreo, setGuardandoCorreo] = useState(false)

  // Datos de la empresa
  const [perfil, setPerfil] = useState({
    nombre: cliente.nombre || '', contacto: cliente.contacto || '',
    telefono: cliente.telefono || '', email: cliente.email || ''
  })
  const [avisoPerfil, setAvisoPerfil] = useState(null)
  const [guardandoPerfil, setGuardandoPerfil] = useState(false)

  // Direcciones de envío
  const [direcciones, setDirecciones] = useState([])
  const [editandoDir, setEditandoDir] = useState(null) // objeto en edición o {} para nueva
  const [avisoDir, setAvisoDir] = useState(null)

  useEffect(() => { misDirecciones().then(({ direcciones }) => setDirecciones(direcciones)).catch(() => {}) }, [])

  const guardarPerfil = async (e) => {
    e.preventDefault()
    setAvisoPerfil(null)
    if (!perfil.nombre.trim()) return setAvisoPerfil({ tipo: 'error', texto: 'El nombre o razón social es obligatorio.' })
    setGuardandoPerfil(true)
    try {
      const { cliente: act } = await actualizarPerfil({
        nombre: perfil.nombre.trim(), contacto: perfil.contacto.trim() || null,
        telefono: perfil.telefono.trim() || null, email: perfil.email.trim() || null
      })
      setAvisoPerfil({ tipo: 'ok', texto: 'Datos actualizados.' })
      if (onActualizar) onActualizar(act)
    } catch (err) {
      setAvisoPerfil({ tipo: 'error', texto: err.message })
    } finally {
      setGuardandoPerfil(false)
    }
  }

  const guardarDireccion = async (datos) => {
    setAvisoDir(null)
    try {
      if (datos.id) {
        const { direccion } = await actualizarDireccion(datos.id, datos)
        setDirecciones(ds => ds.map(d => (d.id === direccion.id ? direccion : d)))
      } else {
        const { direccion } = await crearDireccion(datos)
        setDirecciones(ds => [...ds, direccion])
      }
      setEditandoDir(null)
    } catch (err) {
      setAvisoDir({ tipo: 'error', texto: err.message })
    }
  }

  const borrarDireccion = async (id) => {
    if (!window.confirm('¿Eliminar esta dirección?')) return
    try {
      await eliminarDireccion(id)
      setDirecciones(ds => ds.filter(d => d.id !== id))
    } catch (err) {
      setAvisoDir({ tipo: 'error', texto: err.message })
    }
  }

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

        <Bloque icono={FaBuilding} titulo="Datos de mi empresa"
          descripcion="Estos datos los usamos para tus envíos y tu facturación.">
          <form onSubmit={guardarPerfil}>
            <div style={{ display: 'grid', gap: '13px' }}>
              <div>
                <label htmlFor="pf-nombre" style={rotulo}>Nombre o razón social *</label>
                <input id="pf-nombre" value={perfil.nombre} onChange={e => setPerfil(p => ({ ...p, nombre: e.target.value }))} style={campo} {...foco} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '13px' }}>
                <div>
                  <label htmlFor="pf-contacto" style={rotulo}>Persona de contacto</label>
                  <input id="pf-contacto" value={perfil.contacto} onChange={e => setPerfil(p => ({ ...p, contacto: e.target.value }))} style={campo} {...foco} />
                </div>
                <div>
                  <label htmlFor="pf-tel" style={rotulo}>Teléfono</label>
                  <input id="pf-tel" value={perfil.telefono} onChange={e => setPerfil(p => ({ ...p, telefono: e.target.value }))} style={campo} {...foco} />
                </div>
              </div>
              <div>
                <label htmlFor="pf-email" style={rotulo}>Correo</label>
                <input id="pf-email" type="email" value={perfil.email} onChange={e => setPerfil(p => ({ ...p, email: e.target.value }))} style={campo} {...foco} />
              </div>
            </div>
            {avisoPerfil && <Aviso tipo={avisoPerfil.tipo}>{avisoPerfil.texto}</Aviso>}
            <button type="submit" disabled={guardandoPerfil} style={{ ...btn.primario, marginTop: '16px', ...(guardandoPerfil ? apagado : {}) }}>
              {guardandoPerfil ? 'Guardando…' : 'Guardar datos'}
            </button>
          </form>
        </Bloque>

        <Bloque icono={FaMapMarkerAlt} titulo="Direcciones de envío"
          descripcion="Agrega las direcciones donde recibes tu carga.">
          {direcciones.length > 0 && (
            <div style={{ display: 'grid', gap: '10px', marginBottom: '14px' }}>
              {direcciones.map(d => (
                <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '12px 14px', borderRadius: '10px', background: 'rgba(0,0,0,0.04)', border: `1px solid ${C.borde}` }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: C.texto }}>{d.alias || d.ciudad}</p>
                    <p style={{ fontSize: '13px', color: C.suave, lineHeight: 1.5, marginTop: '2px' }}>
                      {[d.calle, d.ciudad, d.estado, d.codigo_postal, d.pais].filter(Boolean).join(', ')}
                    </p>
                    {d.referencias && <p style={{ fontSize: '12px', color: C.tenue, marginTop: '3px' }}>{d.referencias}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                    <button type="button" onClick={() => setEditandoDir(d)} style={{ ...btn.texto, padding: '6px' }}><FaEdit /></button>
                    <button type="button" onClick={() => borrarDireccion(d.id)} style={{ ...btn.texto, padding: '6px', color: C.rojoClaro }}><FaTrash style={{ fontSize: '13px' }} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {avisoDir && <Aviso tipo={avisoDir.tipo}>{avisoDir.texto}</Aviso>}
          {editandoDir ? (
            <FormDireccion inicial={editandoDir.id ? editandoDir : {}}
              onGuardar={guardarDireccion} onCancelar={() => setEditandoDir(null)} />
          ) : (
            <button type="button" onClick={() => setEditandoDir({})} style={{ ...btn.neutro, marginTop: direcciones.length ? 0 : '4px' }}>
              <FaPlus style={{ fontSize: '12px' }} /> Agregar dirección
            </button>
          )}
        </Bloque>

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
