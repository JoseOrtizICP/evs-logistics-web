import { useEffect, useState } from 'react'
import { FaExclamationCircle } from 'react-icons/fa'
import Modal from './Modal'
import { crearFactura, listarClientes } from '../lib/api'
import { input, etiqueta, boton, deshabilitado, enfoque, ESTATUS_FACTURA, TONO_FACTURA, COLORES } from './ui'

const VACIA = {
  cliente_id: '', folio: '', concepto: '', monto: '', moneda: 'MXN',
  fecha_emision: new Date().toISOString().slice(0, 10), fecha_vencimiento: '',
  estatus: 'pendiente', guia_numero: ''
}

const Campo = ({ id, label, children }) => (
  <div>
    <label htmlFor={id} style={etiqueta}>{label}</label>
    {children}
  </div>
)

const FormFactura = ({ clientePreseleccionado, onCerrar, onGuardada }) => {
  const [datos, setDatos] = useState({ ...VACIA, cliente_id: clientePreseleccionado || '' })
  const [clientes, setClientes] = useState([])
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    listarClientes().then(({ clientes }) => setClientes(clientes.filter(c => c.activo))).catch(() => {})
  }, [])

  const cambiar = (campo) => (e) => setDatos(d => ({ ...d, [campo]: e.target.value }))

  const enviar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setError('')
    try {
      const { factura } = await crearFactura({
        ...datos, cliente_id: Number(datos.cliente_id), monto: Number(datos.monto),
        concepto: datos.concepto.trim() || null, guia_numero: datos.guia_numero.trim() || null,
        fecha_vencimiento: datos.fecha_vencimiento || null
      })
      onGuardada(factura)
    } catch (err) {
      setError(err.message)
      setGuardando(false)
    }
  }

  const listo = datos.cliente_id && datos.folio.trim() && Number(datos.monto) > 0 && !guardando

  return (
    <Modal titulo="Nueva factura" onCerrar={onCerrar}>
      <form onSubmit={enviar}>
        <div style={{ display: 'grid', gap: '16px' }}>
          <Campo id="f-cliente" label="Cliente *">
            <select id="f-cliente" value={datos.cliente_id} onChange={cambiar('cliente_id')} style={input} {...enfoque}>
              <option value="">Selecciona un cliente</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.numero} · {c.nombre}</option>)}
            </select>
          </Campo>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
            <Campo id="f-folio" label="Folio *">
              <input id="f-folio" value={datos.folio} onChange={cambiar('folio')} placeholder="A-0000" style={input} {...enfoque} />
            </Campo>
            <Campo id="f-guia" label="Guía relacionada">
              <input id="f-guia" value={datos.guia_numero} onChange={cambiar('guia_numero')} placeholder="EVS-2026-000000" style={input} {...enfoque} />
            </Campo>
          </div>

          <Campo id="f-concepto" label="Concepto">
            <input id="f-concepto" value={datos.concepto} onChange={cambiar('concepto')}
              placeholder="Ej. Flete marítimo Shanghái - Guadalajara" style={input} {...enfoque} />
          </Campo>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
            <Campo id="f-monto" label="Monto *">
              <input id="f-monto" type="number" min="0" step="0.01" value={datos.monto} onChange={cambiar('monto')}
                placeholder="0.00" style={input} {...enfoque} />
            </Campo>
            <Campo id="f-moneda" label="Moneda">
              <select id="f-moneda" value={datos.moneda} onChange={cambiar('moneda')} style={input} {...enfoque}>
                <option value="MXN">MXN</option>
                <option value="USD">USD</option>
              </select>
            </Campo>
            <Campo id="f-estatus" label="Estatus">
              <select id="f-estatus" value={datos.estatus} onChange={cambiar('estatus')} style={input} {...enfoque}>
                {ESTATUS_FACTURA.map(e => <option key={e} value={e}>{TONO_FACTURA[e].texto}</option>)}
              </select>
            </Campo>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
            <Campo id="f-emision" label="Fecha de emisión">
              <input id="f-emision" type="date" value={datos.fecha_emision} onChange={cambiar('fecha_emision')}
                style={{ ...input, colorScheme: 'dark' }} {...enfoque} />
            </Campo>
            <Campo id="f-vencimiento" label="Fecha de vencimiento">
              <input id="f-vencimiento" type="date" value={datos.fecha_vencimiento} onChange={cambiar('fecha_vencimiento')}
                style={{ ...input, colorScheme: 'dark' }} {...enfoque} />
            </Campo>
          </div>
        </div>

        {error && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '12px 14px', borderRadius: '10px', background: 'rgba(229,62,62,0.12)', border: '1px solid rgba(229,62,62,0.3)', marginTop: '18px' }}>
            <FaExclamationCircle style={{ color: '#fc8181', marginTop: '2px', flexShrink: 0 }} />
            <p style={{ fontSize: '13px', color: '#feb2b2', lineHeight: 1.5 }}>{error}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button type="button" onClick={onCerrar} style={boton.secundario}>Cancelar</button>
          <button type="submit" disabled={!listo} style={{ ...boton.primario, ...(listo ? {} : deshabilitado) }}>
            {guardando ? 'Guardando…' : 'Crear factura'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default FormFactura
