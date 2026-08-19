import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaPlus, FaFileInvoiceDollar, FaPaperclip, FaCheckCircle, FaTrash, FaSyncAlt } from 'react-icons/fa'
import { listarFacturas, actualizarFactura, eliminarFactura } from '../lib/api'
import { formatearFecha, formatearFechaHora } from '../data/estatus'
import { tarjeta, input, boton, enfoque, dinero, TONO_FACTURA, ESTATUS_FACTURA, COLORES } from './ui'

const FILTROS = [
  { clave: 'por_revisar', etiqueta: 'Por revisar' },
  { clave: '', etiqueta: 'Todas' },
  { clave: 'pendiente', etiqueta: 'Pendientes' },
  { clave: 'vencida', etiqueta: 'Vencidas' },
  { clave: 'pagada', etiqueta: 'Pagadas' }
]

const FilaFactura = ({ factura, isMobile, onEstatus, onEliminar }) => {
  const tono = TONO_FACTURA[factura.estatus] || TONO_FACTURA.pendiente
  const tieneComprobante = factura.comprobantes?.length > 0

  return (
    <motion.div
      layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      style={{
        ...tarjeta, padding: isMobile ? '16px' : '18px 22px',
        border: factura.por_revisar ? '1px solid rgba(99,179,237,0.5)' : tarjeta.border
      }}
    >
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '14px' : '20px', alignItems: isMobile ? 'stretch' : 'center' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
            <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>Factura {factura.folio}</p>
            <span style={{ padding: '4px 11px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, background: tono.fondo, color: tono.color, border: `1px solid ${tono.borde}` }}>
              {tono.texto}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: COLORES.textoSuave }}>
            {factura.cliente_numero} · {factura.cliente_nombre}
          </p>
          <p style={{ fontSize: '12px', color: COLORES.textoTenue, marginTop: '4px' }}>
            {factura.concepto ? `${factura.concepto} · ` : ''}
            {factura.fecha_vencimiento ? `Vence ${formatearFecha(factura.fecha_vencimiento)}` : 'Sin vencimiento'}
          </p>
          {tieneComprobante && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '9px', flexWrap: 'wrap' }}>
              <FaPaperclip style={{ fontSize: '11px', color: COLORES.azulClaro }} />
              <span style={{ fontSize: '12px', color: COLORES.azulClaro }}>
                Comprobante: {factura.comprobantes.at(-1).archivo_nombre}
                {factura.comprobantes.at(-1).nota ? ` — ${factura.comprobantes.at(-1).nota}` : ''}
              </span>
              <span style={{ fontSize: '11px', color: COLORES.textoTenue }}>
                ({formatearFechaHora(factura.comprobantes.at(-1).subido_en)})
              </span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', alignItems: isMobile ? 'center' : 'flex-end', justifyContent: 'space-between', gap: '10px', flexShrink: 0 }}>
          <p style={{ fontSize: '18px', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap' }}>
            {dinero(factura.monto, factura.moneda)}
          </p>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {factura.por_revisar && (
              <button type="button" onClick={() => onEstatus(factura, 'pagada')}
                style={{ ...boton.primario, padding: '9px 14px', fontSize: '13px', background: COLORES.verde }}>
                <FaCheckCircle style={{ fontSize: '12px' }} /> Aprobar pago
              </button>
            )}
            <select value={factura.estatus} onChange={e => onEstatus(factura, e.target.value)}
              aria-label="Cambiar estatus"
              style={{ ...input, width: 'auto', padding: '8px 10px', fontSize: '13px' }} {...enfoque}>
              {ESTATUS_FACTURA.map(e => <option key={e} value={e}>{TONO_FACTURA[e].texto}</option>)}
            </select>
            <button type="button" title="Eliminar factura" onClick={() => onEliminar(factura)}
              style={{ ...boton.fantasma, padding: '8px', color: COLORES.rojoClaro }}>
              <FaTrash style={{ fontSize: '12px' }} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const Facturas = ({ onAviso, FormFactura }) => {
  const [facturas, setFacturas] = useState([])
  const [porRevisar, setPorRevisar] = useState(0)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')
  const [filtro, setFiltro] = useState('por_revisar')
  const [formAbierto, setFormAbierto] = useState(false)
  const isMobile = window.matchMedia('(max-width: 768px)').matches

  const cargar = useCallback(async () => {
    setCargando(true)
    setError('')
    try {
      const estatus = filtro === 'por_revisar' ? '' : filtro
      const { facturas, por_revisar } = await listarFacturas({ estatus })
      setPorRevisar(por_revisar || 0)
      setFacturas(filtro === 'por_revisar' ? facturas.filter(f => f.por_revisar) : facturas)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }, [filtro])

  useEffect(() => { cargar() }, [cargar])

  const cambiarEstatus = async (factura, estatus) => {
    try {
      await actualizarFactura(factura.id, { estatus })
      onAviso(`Factura ${factura.folio}: ${TONO_FACTURA[estatus].texto.toLowerCase()}.`)
      cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  const eliminar = async (factura) => {
    if (!window.confirm(`¿Eliminar la factura ${factura.folio}? El cliente dejará de verla.`)) return
    try {
      await eliminarFactura(factura.id)
      onAviso('Factura eliminada.')
      cargar()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '12px', alignItems: isMobile ? 'stretch' : 'center', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', flex: 1 }}>
          {FILTROS.map(f => {
            const activo = filtro === f.clave
            return (
              <button key={f.clave || 'todas'} type="button" onClick={() => setFiltro(f.clave)}
                style={{
                  ...boton.secundario, padding: '9px 15px', fontSize: '13px',
                  background: activo ? 'rgba(49,130,206,0.25)' : 'rgba(255,255,255,0.08)',
                  color: activo ? COLORES.azulClaro : '#fff'
                }}>
                {f.etiqueta}
                {f.clave === 'por_revisar' && porRevisar > 0 && (
                  <span style={{ marginLeft: '6px', padding: '1px 7px', borderRadius: '999px', background: COLORES.azul, color: '#fff', fontSize: '11px' }}>{porRevisar}</span>
                )}
              </button>
            )
          })}
        </div>
        <button type="button" onClick={cargar} title="Actualizar" style={{ ...boton.secundario, flexShrink: 0 }}>
          <FaSyncAlt style={{ fontSize: '13px' }} />
        </button>
        <button type="button" onClick={() => setFormAbierto(true)} style={{ ...boton.primario, flexShrink: 0 }}>
          <FaPlus style={{ fontSize: '12px' }} /> Nueva factura
        </button>
      </div>

      {error && (
        <div style={{ padding: '14px 16px', borderRadius: '10px', marginBottom: '20px', background: 'rgba(229,62,62,0.12)', border: '1px solid rgba(229,62,62,0.3)' }}>
          <p style={{ fontSize: '13px', color: '#feb2b2' }}>{error}</p>
        </div>
      )}

      {cargando && facturas.length === 0 ? (
        <p style={{ fontSize: '14px', color: COLORES.textoSuave, padding: '40px 0', textAlign: 'center' }}>Cargando facturas…</p>
      ) : facturas.length === 0 ? (
        <div style={{ ...tarjeta, padding: '60px 24px', textAlign: 'center' }}>
          <FaFileInvoiceDollar style={{ fontSize: '32px', color: COLORES.textoTenue, marginBottom: '14px' }} />
          <p style={{ fontSize: '16px', fontWeight: 600, color: '#fff', marginBottom: '6px' }}>
            {filtro === 'por_revisar' ? 'No hay comprobantes por revisar' : 'No hay facturas en esta vista'}
          </p>
          <p style={{ fontSize: '14px', color: COLORES.textoSuave }}>
            {filtro === 'por_revisar' ? 'Cuando un cliente suba un comprobante, aparecerá aquí.' : 'Crea una factura para un cliente.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '10px' }}>
          <AnimatePresence mode="popLayout">
            {facturas.map(factura => (
              <FilaFactura key={factura.id} factura={factura} isMobile={isMobile}
                onEstatus={cambiarEstatus} onEliminar={eliminar} />
            ))}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {formAbierto && FormFactura && (
          <FormFactura key="form"
            onCerrar={() => setFormAbierto(false)}
            onGuardada={() => { setFormAbierto(false); onAviso('Factura creada.'); cargar() }} />
        )}
      </AnimatePresence>
    </>
  )
}

export default Facturas
