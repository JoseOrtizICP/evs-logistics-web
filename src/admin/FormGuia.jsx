import { useEffect, useState } from 'react'
import { FaMagic, FaExclamationCircle } from 'react-icons/fa'
import Modal from './Modal'
import { crearGuia, actualizarGuia, sugerirNumero } from '../lib/api'
import { ESTATUS, SERVICIOS } from '../data/estatus'
import { input, etiqueta, boton, deshabilitado, enfoque, COLORES } from './ui'

const VACIA = {
  numero: '', cliente: '', origen: '', destino: '',
  servicio: '', fecha_estimada: '', estatus: 'recibido', notas: ''
}

const Campo = ({ id, label, children }) => (
  <div>
    <label htmlFor={id} style={etiqueta}>{label}</label>
    {children}
  </div>
)

const FormGuia = ({ guia, onCerrar, onGuardada }) => {
  const editando = Boolean(guia)
  const [datos, setDatos] = useState(VACIA)
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (guia) {
      setDatos({
        numero: guia.numero || '',
        cliente: guia.cliente || '',
        origen: guia.origen || '',
        destino: guia.destino || '',
        servicio: guia.servicio || '',
        fecha_estimada: guia.fecha_estimada ? String(guia.fecha_estimada).slice(0, 10) : '',
        estatus: guia.estatus || 'recibido',
        notas: guia.notas || ''
      })
    } else {
      // Número sugerido para no tener que inventarlo a mano.
      sugerirNumero()
        .then(({ numero }) => setDatos(d => (d.numero ? d : { ...d, numero })))
        .catch(() => {})
    }
  }, [guia])

  const cambiar = (campo) => (e) => setDatos(d => ({ ...d, [campo]: e.target.value }))

  const enviar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setError('')

    const cuerpo = {
      ...datos,
      cliente: datos.cliente.trim() || null,
      servicio: datos.servicio || null,
      fecha_estimada: datos.fecha_estimada || null,
      notas: datos.notas.trim() || null
    }

    try {
      const respuesta = editando
        ? await actualizarGuia(guia.id, cuerpo)
        : await crearGuia(cuerpo)
      onGuardada(respuesta.guia, editando ? 'Guía actualizada.' : 'Guía creada.')
    } catch (err) {
      setError(err.message)
      setGuardando(false)
    }
  }

  const listo = datos.numero.trim() && datos.origen.trim() && datos.destino.trim() && !guardando

  return (
    <Modal titulo={editando ? 'Editar guía' : 'Nueva guía'} onCerrar={onCerrar}>
      <form onSubmit={enviar}>
        <div style={{ display: 'grid', gap: '16px' }}>
          <Campo id="g-numero" label="Número de guía *">
            <div style={{ display: 'flex', gap: '8px' }}>
              <input id="g-numero" value={datos.numero} onChange={cambiar('numero')}
                placeholder="EVS-2026-000000" style={{ ...input, letterSpacing: '0.5px' }} {...enfoque} />
              <button type="button" title="Generar número"
                onClick={() => sugerirNumero().then(({ numero }) => setDatos(d => ({ ...d, numero }))).catch(() => {})}
                style={{ ...boton.secundario, padding: '0 16px', flexShrink: 0 }}>
                <FaMagic />
              </button>
            </div>
            <p style={{ fontSize: '11px', color: COLORES.textoTenue, marginTop: '6px' }}>
              Este es el número que le darás al cliente para consultar su envío.
            </p>
          </Campo>

          <Campo id="g-cliente" label="Cliente (uso interno, no lo ve el cliente)">
            <input id="g-cliente" value={datos.cliente} onChange={cambiar('cliente')} style={input} {...enfoque} />
          </Campo>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <Campo id="g-origen" label="Origen *">
              <input id="g-origen" value={datos.origen} onChange={cambiar('origen')}
                placeholder="Ciudad, País" style={input} {...enfoque} />
            </Campo>
            <Campo id="g-destino" label="Destino *">
              <input id="g-destino" value={datos.destino} onChange={cambiar('destino')}
                placeholder="Ciudad, País" style={input} {...enfoque} />
            </Campo>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <Campo id="g-servicio" label="Tipo de servicio">
              <select id="g-servicio" value={datos.servicio} onChange={cambiar('servicio')} style={input} {...enfoque}>
                <option value="">Sin especificar</option>
                {SERVICIOS.map(s => <option key={s.clave} value={s.clave}>{s.etiqueta}</option>)}
              </select>
            </Campo>
            <Campo id="g-fecha" label="Fecha estimada de entrega">
              <input id="g-fecha" type="date" value={datos.fecha_estimada} onChange={cambiar('fecha_estimada')}
                style={{ ...input, colorScheme: 'dark' }} {...enfoque} />
            </Campo>
          </div>

          {!editando && (
            <Campo id="g-estatus" label="Estatus inicial">
              <select id="g-estatus" value={datos.estatus} onChange={cambiar('estatus')} style={input} {...enfoque}>
                {ESTATUS.map(e => <option key={e.clave} value={e.clave}>{e.etiqueta}</option>)}
              </select>
            </Campo>
          )}

          <Campo id="g-notas" label="Notas internas (no las ve el cliente)">
            <textarea id="g-notas" value={datos.notas} onChange={cambiar('notas')} rows={3}
              style={{ ...input, resize: 'vertical' }} {...enfoque} />
          </Campo>
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
            {guardando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Crear guía'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default FormGuia
