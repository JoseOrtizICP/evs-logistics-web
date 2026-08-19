import { useEffect, useState } from 'react'
import { FaMagic, FaExclamationCircle, FaCopy, FaCheck } from 'react-icons/fa'
import Modal from './Modal'
import { crearCliente, actualizarCliente, sugerirNumeroCliente } from '../lib/api'
import { input, etiqueta, boton, deshabilitado, enfoque, COLORES } from './ui'

const VACIO = { numero: '', nombre: '', contacto: '', email: '', telefono: '', password: '' }

// Genera una contraseña temporal legible para entregar al cliente.
const generarPassword = () => {
  const letras = 'ABCDEFGHJKMNPQRSTUVWXYZ'
  const numeros = '23456789'
  let clave = ''
  for (let i = 0; i < 4; i++) clave += letras[Math.floor(Math.random() * letras.length)]
  for (let i = 0; i < 4; i++) clave += numeros[Math.floor(Math.random() * numeros.length)]
  return clave
}

const Campo = ({ id, label, children }) => (
  <div>
    <label htmlFor={id} style={etiqueta}>{label}</label>
    {children}
  </div>
)

const FormCliente = ({ cliente, onCerrar, onGuardado }) => {
  const editando = Boolean(cliente)
  const [datos, setDatos] = useState(VACIO)
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [copiado, setCopiado] = useState('')

  useEffect(() => {
    if (cliente) {
      setDatos({
        numero: cliente.numero || '', nombre: cliente.nombre || '',
        contacto: cliente.contacto || '', email: cliente.email || '',
        telefono: cliente.telefono || '', password: ''
      })
    } else {
      // Número y contraseña sugeridos para no inventarlos a mano.
      sugerirNumeroCliente()
        .then(({ numero }) => setDatos(d => (d.numero ? d : { ...d, numero, password: generarPassword() })))
        .catch(() => setDatos(d => ({ ...d, password: generarPassword() })))
    }
  }, [cliente])

  const cambiar = (campo) => (e) => setDatos(d => ({ ...d, [campo]: e.target.value }))

  // Mensaje completo listo para pegar y enviar al cliente.
  const mensajeCliente = () =>
    `¡Hola! Estos son tus datos para entrar al Portal de Clientes de EVS Logistics:\n\n` +
    `Número de cliente: ${datos.numero}\n` +
    `Contraseña temporal: ${datos.password}\n\n` +
    `Entra aquí: https://www.evslogist.com/portal\n\n` +
    `Por seguridad, cambia tu contraseña la primera vez que entres. ` +
    `Dentro puedes seguir tus envíos y ver tu estado de cuenta.`

  const copiar = async (texto, cual) => {
    try {
      await navigator.clipboard.writeText(texto)
      setCopiado(cual)
      setTimeout(() => setCopiado(''), 1800)
    } catch { /* el navegador no permitió copiar */ }
  }

  const enviar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setError('')
    const cuerpo = {
      ...datos,
      contacto: datos.contacto.trim() || null,
      email: datos.email.trim() || null,
      telefono: datos.telefono.trim() || null
    }
    try {
      const respuesta = editando
        ? await actualizarCliente(cliente.id, cuerpo)
        : await crearCliente(cuerpo)
      onGuardado(respuesta.cliente, editando ? 'Cliente actualizado.' : 'Cliente creado.', editando ? null : datos.password)
    } catch (err) {
      setError(err.message)
      setGuardando(false)
    }
  }

  const listo = datos.numero.trim() && (editando || datos.password.length >= 8) && !guardando

  return (
    <Modal titulo={editando ? 'Editar cliente' : 'Nuevo cliente'} onCerrar={onCerrar}>
      <form onSubmit={enviar}>
        <div style={{ display: 'grid', gap: '16px' }}>
          <Campo id="cl-numero" label="Número de cliente *">
            <div style={{ display: 'flex', gap: '8px' }}>
              <input id="cl-numero" value={datos.numero} onChange={cambiar('numero')}
                placeholder="EVS-C-0000" style={{ ...input, letterSpacing: '0.5px' }} {...enfoque} disabled={editando} />
              {!editando && (
                <>
                  <button type="button" title="Generar número"
                    onClick={() => sugerirNumeroCliente().then(({ numero }) => setDatos(d => ({ ...d, numero }))).catch(() => {})}
                    style={{ ...boton.secundario, padding: '0 16px', flexShrink: 0 }}>
                    <FaMagic />
                  </button>
                  <button type="button" title="Copiar" onClick={() => copiar(datos.numero, 'numero')}
                    style={{ ...boton.secundario, padding: '0 14px', flexShrink: 0 }}>
                    {copiado === 'numero' ? <FaCheck style={{ color: COLORES.verde }} /> : <FaCopy />}
                  </button>
                </>
              )}
            </div>
            <p style={{ fontSize: '11px', color: COLORES.textoTenue, marginTop: '6px' }}>
              Con este número el cliente entra a su portal.
            </p>
          </Campo>

          <p style={{ fontSize: '12px', color: COLORES.textoSuave, lineHeight: 1.5, margin: '-4px 0 0' }}>
            Solo necesitas el número y la contraseña. El cliente completa su nombre,
            contacto y direcciones desde su portal.
          </p>

          {!editando && (
            <Campo id="cl-password" label="Contraseña temporal * (mínimo 8 caracteres)">
              <div style={{ display: 'flex', gap: '8px' }}>
                <input id="cl-password" type="text" value={datos.password} onChange={cambiar('password')}
                  style={{ ...input, letterSpacing: '1px', fontFamily: 'monospace' }} {...enfoque} />
                <button type="button" title="Generar contraseña"
                  onClick={() => setDatos(d => ({ ...d, password: generarPassword() }))}
                  style={{ ...boton.secundario, padding: '0 16px', flexShrink: 0 }}>
                  <FaMagic />
                </button>
                <button type="button" title="Copiar" onClick={() => copiar(datos.password, 'password')}
                  style={{ ...boton.secundario, padding: '0 14px', flexShrink: 0 }}>
                  {copiado === 'password' ? <FaCheck style={{ color: COLORES.verde }} /> : <FaCopy />}
                </button>
              </div>
              <p style={{ fontSize: '11px', color: COLORES.textoTenue, marginTop: '6px' }}>
                Compártela con el cliente y pídele que la cambie al entrar. No podrás volver a verla después.
              </p>
            </Campo>
          )}

          {!editando && (
            <button type="button"
              onClick={() => copiar(mensajeCliente(), 'todo')}
              style={{ ...boton.primario, width: '100%', justifyContent: 'center',
                background: copiado === 'todo' ? COLORES.verde : COLORES.azul }}>
              {copiado === 'todo'
                ? <><FaCheck /> ¡Copiado! Ya solo pégalo al cliente</>
                : <><FaCopy /> Copiar todo para enviar al cliente</>}
            </button>
          )}
        </div>

        {error && (
          <div style={{
            display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '12px 14px', borderRadius: '10px',
            background: 'rgba(229,62,62,0.12)', border: '1px solid rgba(229,62,62,0.3)', marginTop: '18px'
          }}>
            <FaExclamationCircle style={{ color: '#fc8181', marginTop: '2px', flexShrink: 0 }} />
            <p style={{ fontSize: '13px', color: '#feb2b2', lineHeight: 1.5 }}>{error}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button type="button" onClick={onCerrar} style={boton.secundario}>Cancelar</button>
          <button type="submit" disabled={!listo} style={{ ...boton.primario, ...(listo ? {} : deshabilitado) }}>
            {guardando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Crear cliente'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default FormCliente
