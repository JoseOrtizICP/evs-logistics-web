import { useEffect, useState } from 'react'
import { FaPlus, FaTrash, FaExclamationCircle, FaCopy, FaCheck } from 'react-icons/fa'
import Modal from './Modal'
import { obtenerGuia, agregarEvento, eliminarEvento } from '../lib/api'
import { ESTATUS, buscarEstatus, buscarServicio, formatearFecha, formatearFechaHora } from '../data/estatus'
import { input, etiqueta, boton, deshabilitado, enfoque, COLORES } from './ui'

// Fecha y hora actuales en el formato que espera <input type="datetime-local">.
const ahoraLocal = () => {
  const ahora = new Date()
  ahora.setMinutes(ahora.getMinutes() - ahora.getTimezoneOffset())
  return ahora.toISOString().slice(0, 16)
}

const NUEVO = { estatus: 'en_transito', descripcion: '', ubicacion: '', ocurrido_en: ahoraLocal() }

const Resumen = ({ guia }) => (
  <div style={{
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px',
    padding: '16px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', marginBottom: '24px'
  }}>
    {[
      ['Origen', guia.origen],
      ['Destino', guia.destino],
      ['Entrega estimada', formatearFecha(guia.fecha_estimada) || 'Por confirmar'],
      ['Servicio', buscarServicio(guia.servicio) || 'Sin especificar']
    ].map(([titulo, valor]) => (
      <div key={titulo}>
        <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', color: COLORES.textoTenue, marginBottom: '4px' }}>
          {titulo}
        </p>
        <p style={{ fontSize: '14px', color: '#fff', lineHeight: 1.4 }}>{valor}</p>
      </div>
    ))}
  </div>
)

const DetalleGuia = ({ guiaId, onCerrar, onCambio }) => {
  const [guia, setGuia] = useState(null)
  const [eventos, setEventos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [nuevo, setNuevo] = useState(NUEVO)
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [copiado, setCopiado] = useState(false)

  const cargar = async () => {
    try {
      const datos = await obtenerGuia(guiaId)
      setGuia(datos.guia)
      setEventos(datos.eventos)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargar() }, [guiaId])

  const copiarNumero = async () => {
    try {
      await navigator.clipboard.writeText(guia.numero)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1800)
    } catch {
      setError('Tu navegador no permitió copiar. Selecciona el número manualmente.')
    }
  }

  const agregar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setError('')

    try {
      await agregarEvento(guiaId, {
        estatus: nuevo.estatus,
        descripcion: nuevo.descripcion.trim() || null,
        ubicacion: nuevo.ubicacion.trim() || null,
        ocurrido_en: nuevo.ocurrido_en ? new Date(nuevo.ocurrido_en).toISOString() : null
      })
      setNuevo({ ...NUEVO, ocurrido_en: ahoraLocal() })
      await cargar()
      onCambio()
    } catch (err) {
      setError(err.message)
    } finally {
      setGuardando(false)
    }
  }

  const borrar = async (eventoId) => {
    if (!window.confirm('¿Eliminar este movimiento? El cliente dejará de verlo.')) return

    try {
      await eliminarEvento(guiaId, eventoId)
      await cargar()
      onCambio()
    } catch (err) {
      setError(err.message)
    }
  }

  const cambiar = (campo) => (e) => setNuevo(n => ({ ...n, [campo]: e.target.value }))

  return (
    <Modal titulo={guia ? `Guía ${guia.numero}` : 'Cargando…'} onCerrar={onCerrar} ancho="720px">
      {cargando && <p style={{ color: COLORES.textoSuave, fontSize: '14px' }}>Cargando información…</p>}

      {guia && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '18px' }}>
            <span style={{
              padding: '7px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 700,
              background: `${buscarEstatus(guia.estatus).color}1f`,
              color: buscarEstatus(guia.estatus).color,
              border: `1px solid ${buscarEstatus(guia.estatus).color}55`
            }}>
              {buscarEstatus(guia.estatus).etiqueta}
            </span>
            {guia.cliente && (
              <span style={{ fontSize: '13px', color: COLORES.textoSuave }}>{guia.cliente}</span>
            )}
            <button type="button" onClick={copiarNumero} style={{ ...boton.fantasma, marginLeft: 'auto' }}>
              {copiado ? <><FaCheck style={{ color: COLORES.verde }} /> Copiado</> : <><FaCopy /> Copiar número</>}
            </button>
          </div>

          <Resumen guia={guia} />

          {guia.notas && (
            <div style={{
              padding: '12px 14px', borderRadius: '10px', marginBottom: '24px',
              background: 'rgba(99,179,237,0.08)', border: '1px solid rgba(99,179,237,0.2)'
            }}>
              <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: COLORES.azulClaro, marginBottom: '4px' }}>
                Notas internas
              </p>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6 }}>{guia.notas}</p>
            </div>
          )}

          {/* Alta de movimiento */}
          <form onSubmit={agregar} style={{
            padding: '18px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${COLORES.borde}`, marginBottom: '28px'
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
              Agregar movimiento
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label htmlFor="e-estatus" style={etiqueta}>Estatus *</label>
                <select id="e-estatus" value={nuevo.estatus} onChange={cambiar('estatus')} style={input} {...enfoque}>
                  {ESTATUS.map(e => <option key={e.clave} value={e.clave}>{e.etiqueta}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="e-fecha" style={etiqueta}>Fecha y hora</label>
                <input id="e-fecha" type="datetime-local" value={nuevo.ocurrido_en} onChange={cambiar('ocurrido_en')}
                  style={{ ...input, colorScheme: 'dark' }} {...enfoque} />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label htmlFor="e-ubicacion" style={etiqueta}>Ubicación</label>
              <input id="e-ubicacion" value={nuevo.ubicacion} onChange={cambiar('ubicacion')}
                placeholder="Ej. Manzanillo, Colima" style={input} {...enfoque} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="e-descripcion" style={etiqueta}>Descripción para el cliente</label>
              <input id="e-descripcion" value={nuevo.descripcion} onChange={cambiar('descripcion')}
                placeholder="Ej. En proceso de despacho aduanal." style={input} {...enfoque} />
            </div>

            <button type="submit" disabled={guardando} style={{ ...boton.primario, ...(guardando ? deshabilitado : {}) }}>
              <FaPlus style={{ fontSize: '12px' }} /> {guardando ? 'Agregando…' : 'Agregar movimiento'}
            </button>
          </form>

          {/* Historial */}
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
            Historial ({eventos.length})
          </h3>

          {eventos.length === 0 ? (
            <p style={{ fontSize: '14px', color: COLORES.textoSuave }}>Esta guía todavía no tiene movimientos.</p>
          ) : (
            <div style={{ position: 'relative', paddingLeft: '26px' }}>
              <div style={{ position: 'absolute', left: '6px', top: '8px', bottom: '8px', width: '2px', background: 'rgba(99,179,237,0.2)' }} />
              {eventos.map((evento, i) => {
                const info = buscarEstatus(evento.estatus)
                return (
                  <div key={evento.id} style={{ position: 'relative', paddingBottom: i === eventos.length - 1 ? 0 : '20px' }}>
                    <div style={{
                      position: 'absolute', left: '-26px', top: '4px', width: '14px', height: '14px',
                      borderRadius: '50%', background: i === 0 ? info.color : COLORES.fondo, border: `2px solid ${info.color}`
                    }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{info.etiqueta}</p>
                        {evento.descripcion && (
                          <p style={{ fontSize: '13px', color: COLORES.textoSuave, lineHeight: 1.5, marginTop: '2px' }}>
                            {evento.descripcion}
                          </p>
                        )}
                        <p style={{ fontSize: '12px', color: COLORES.textoTenue, marginTop: '4px' }}>
                          {formatearFechaHora(evento.ocurrido_en)}{evento.ubicacion ? ` · ${evento.ubicacion}` : ''}
                        </p>
                      </div>
                      <button type="button" onClick={() => borrar(evento.id)} title="Eliminar movimiento"
                        style={{ ...boton.fantasma, color: '#fc8181', flexShrink: 0 }}>
                        <FaTrash style={{ fontSize: '12px' }} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {error && (
        <div style={{
          display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '12px 14px', borderRadius: '10px',
          background: 'rgba(229,62,62,0.12)', border: '1px solid rgba(229,62,62,0.3)', marginTop: '18px'
        }}>
          <FaExclamationCircle style={{ color: '#fc8181', marginTop: '2px', flexShrink: 0 }} />
          <p style={{ fontSize: '13px', color: '#feb2b2', lineHeight: 1.5 }}>{error}</p>
        </div>
      )}
    </Modal>
  )
}

export default DetalleGuia
