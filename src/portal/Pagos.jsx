import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaFileInvoiceDollar, FaCloudUploadAlt, FaCreditCard, FaCheckCircle,
  FaTimes, FaPaperclip, FaExclamationCircle, FaWhatsapp
} from 'react-icons/fa'
import useIsMobile from '../hooks/useIsMobile'
import { misFacturas, subirComprobante } from '../lib/apiPortal'
import { formatearFecha, formatearFechaHora } from '../data/estatus'
import { C, panel, campo, rotulo, btn, apagado, foco, TONO_FACTURA, dinero } from './ui'

const WHATSAPP = 'https://wa.me/5215548268211?text=Hola,%20tengo%20una%20duda%20sobre%20mi%20estado%20de%20cuenta'

const TIPOS_PERMITIDOS = ['application/pdf', 'image/jpeg', 'image/png']
const TAMANO_MAXIMO = 8 * 1024 * 1024

const Resumen = ({ saldo, moneda, facturas, isMobile }) => {
  const pendientes = facturas.filter(f => f.estatus === 'pendiente' || f.estatus === 'vencida')
  const vencidas = facturas.filter(f => f.estatus === 'vencida')
  const proxima = [...pendientes]
    .filter(f => f.fecha_vencimiento)
    .sort((a, b) => new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento))[0]

  const tarjetas = [
    { titulo: 'Saldo por pagar', valor: dinero(saldo, moneda), destacado: true },
    { titulo: 'Facturas pendientes', valor: String(pendientes.length) },
    {
      titulo: vencidas.length ? 'Facturas vencidas' : 'Próximo vencimiento',
      valor: vencidas.length ? String(vencidas.length) : (formatearFecha(proxima?.fecha_vencimiento) || '—'),
      alerta: vencidas.length > 0
    }
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
      gap: '12px', marginBottom: '26px'
    }}>
      {tarjetas.map(t => (
        <div key={t.titulo} style={{ ...panel, padding: '20px 22px' }}>
          <p style={{
            fontSize: '11px', fontWeight: 600, letterSpacing: '1px',
            textTransform: 'uppercase', color: C.tenue, marginBottom: '10px'
          }}>
            {t.titulo}
          </p>
          <p style={{
            fontSize: t.destacado ? '26px' : '22px', fontWeight: 800,
            color: t.alerta ? C.rojoClaro : t.destacado ? C.texto : C.texto,
            letterSpacing: '-0.5px'
          }}>
            {t.valor}
          </p>
        </div>
      ))}
    </div>
  )
}

const ModalComprobante = ({ factura, onCerrar, onSubido }) => {
  const entrada = useRef(null)
  const [archivo, setArchivo] = useState(null)
  const [nota, setNota] = useState('')
  const [error, setError] = useState('')
  const [subiendo, setSubiendo] = useState(false)

  const elegir = (e) => {
    const elegido = e.target.files?.[0]
    setError('')
    if (!elegido) return setArchivo(null)

    if (!TIPOS_PERMITIDOS.includes(elegido.type)) {
      setArchivo(null)
      return setError('El archivo debe ser PDF, JPG o PNG.')
    }
    if (elegido.size > TAMANO_MAXIMO) {
      setArchivo(null)
      return setError('El archivo no debe pesar más de 8 MB.')
    }
    setArchivo(elegido)
  }

  const enviar = async (e) => {
    e.preventDefault()
    if (!archivo) return
    setSubiendo(true)
    setError('')

    try {
      await subirComprobante(factura.id, archivo, nota.trim())
      onSubido()
    } catch (err) {
      setError(err.message)
      setSubiendo(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onCerrar}
      style={{
        position: 'fixed', inset: 0, zIndex: 1200, background: 'rgba(5,12,22,0.82)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px 16px', overflowY: 'auto'
      }}
    >
      <motion.form
        initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
        onClick={e => e.stopPropagation()} onSubmit={enviar}
        style={{ ...panel, width: '100%', maxWidth: '460px', padding: '26px', margin: 'auto' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: C.texto }}>Subir comprobante</h2>
            <p style={{ fontSize: '13px', color: C.suave, marginTop: '4px' }}>
              Factura {factura.folio} · {dinero(factura.monto, factura.moneda)}
            </p>
          </div>
          <button type="button" onClick={onCerrar} aria-label="Cerrar"
            style={{ background: 'none', border: 'none', color: C.suave, fontSize: '17px', cursor: 'pointer' }}>
            <FaTimes />
          </button>
        </div>

        <button type="button" onClick={() => entrada.current?.click()}
          style={{
            width: '100%', padding: '28px 20px', borderRadius: '12px', cursor: 'pointer',
            background: 'rgba(99,179,237,0.06)', border: `1.5px dashed ${archivo ? C.verde : C.bordeFuerte}`,
            color: C.suave, fontFamily: 'inherit', textAlign: 'center', marginBottom: '18px'
          }}>
          {archivo ? (
            <>
              <FaCheckCircle style={{ fontSize: '22px', color: C.verdeClaro, marginBottom: '10px' }} />
              <p style={{ fontSize: '14px', color: C.texto, fontWeight: 600, wordBreak: 'break-all' }}>
                {archivo.name}
              </p>
              <p style={{ fontSize: '12px', color: C.tenue, marginTop: '4px' }}>
                {(archivo.size / 1024 / 1024).toFixed(2)} MB · toca para cambiarlo
              </p>
            </>
          ) : (
            <>
              <FaCloudUploadAlt style={{ fontSize: '26px', color: C.azulClaro, marginBottom: '10px' }} />
              <p style={{ fontSize: '14px', color: C.texto, fontWeight: 600 }}>
                Selecciona tu comprobante
              </p>
              <p style={{ fontSize: '12px', color: C.tenue, marginTop: '4px' }}>
                PDF, JPG o PNG · máximo 8 MB
              </p>
            </>
          )}
        </button>

        <input ref={entrada} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={elegir} style={{ display: 'none' }} />

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="nota-comprobante" style={rotulo}>Referencia o nota (opcional)</label>
          <input id="nota-comprobante" value={nota} onChange={e => setNota(e.target.value)}
            placeholder="Ej. Transferencia BBVA folio 88213" style={campo} {...foco} />
        </div>

        {error && (
          <div style={{
            display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '12px 14px',
            borderRadius: '10px', background: 'rgba(229,62,62,0.12)',
            border: '1px solid rgba(229,62,62,0.3)', marginBottom: '18px'
          }}>
            <FaExclamationCircle style={{ color: C.rojoClaro, marginTop: '2px', flexShrink: 0 }} />
            <p style={{ fontSize: '13px', color: C.rojoClaro, lineHeight: 1.5 }}>{error}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button type="button" onClick={onCerrar} style={btn.contorno}>Cancelar</button>
          <button type="submit" disabled={!archivo || subiendo}
            style={{ ...btn.primario, ...(archivo && !subiendo ? {} : apagado) }}>
            {subiendo ? 'Enviando…' : 'Enviar comprobante'}
          </button>
        </div>
      </motion.form>
    </motion.div>
  )
}

const FilaFactura = ({ factura, isMobile, pagoEnLinea, onSubir, indice }) => {
  const tono = TONO_FACTURA[factura.estatus] || TONO_FACTURA.pendiente
  const porPagar = factura.estatus === 'pendiente' || factura.estatus === 'vencida'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: indice * 0.04, duration: 0.3 }}
      style={{ ...panel, padding: isMobile ? '18px' : '20px 24px' }}
    >
      <div style={{
        display: 'flex', flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '14px' : '20px', alignItems: isMobile ? 'stretch' : 'center'
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '5px' }}>
            <p style={{ fontSize: '15px', fontWeight: 700, color: C.texto }}>Factura {factura.folio}</p>
            <span style={{
              padding: '4px 11px', borderRadius: '999px', fontSize: '11px', fontWeight: 700,
              background: tono.fondo, color: tono.color, border: `1px solid ${tono.borde}`
            }}>
              {tono.texto}
            </span>
          </div>
          <p style={{ fontSize: '13px', color: C.suave, lineHeight: 1.5 }}>{factura.concepto}</p>
          <p style={{ fontSize: '12px', color: C.tenue, marginTop: '5px' }}>
            {factura.guia_numero ? `Guía ${factura.guia_numero} · ` : ''}
            {factura.fecha_vencimiento
              ? `Vence el ${formatearFecha(factura.fecha_vencimiento)}`
              : 'Sin fecha de vencimiento'}
          </p>

          {factura.comprobantes?.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginTop: '9px' }}>
              <FaPaperclip style={{ fontSize: '11px', color: C.azulClaro }} />
              <p style={{ fontSize: '12px', color: C.azulClaro }}>
                Comprobante enviado el {formatearFechaHora(factura.comprobantes.at(-1).subido_en)}
              </p>
            </div>
          )}
        </div>

        <div style={{
          display: 'flex', flexDirection: isMobile ? 'row' : 'column',
          alignItems: isMobile ? 'center' : 'flex-end',
          justifyContent: 'space-between', gap: '12px', flexShrink: 0
        }}>
          <p style={{ fontSize: '19px', fontWeight: 800, color: C.texto, whiteSpace: 'nowrap' }}>
            {dinero(factura.monto, factura.moneda)}
          </p>
          {porPagar && (
            <div style={{ display: 'flex', gap: '8px' }}>
              {pagoEnLinea && (
                <button type="button" style={{ ...btn.primario, padding: '10px 16px', fontSize: '13px' }}>
                  <FaCreditCard style={{ fontSize: '12px' }} /> Pagar
                </button>
              )}
              <button type="button" onClick={() => onSubir(factura)}
                style={{ ...btn.neutro, padding: '10px 16px', fontSize: '13px' }}>
                <FaCloudUploadAlt style={{ fontSize: '13px' }} /> Comprobante
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

const Pagos = () => {
  const isMobile = useIsMobile()
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [facturaSubiendo, setFacturaSubiendo] = useState(null)
  const [aviso, setAviso] = useState('')

  const cargar = () => {
    setCargando(true)
    misFacturas()
      .then(setDatos)
      .catch(err => setError(err.message))
      .finally(() => setCargando(false))
  }

  useEffect(cargar, [])

  useEffect(() => {
    if (!aviso) return
    const t = setTimeout(() => setAviso(''), 3600)
    return () => clearTimeout(t)
  }, [aviso])

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 800, color: C.texto, marginBottom: '6px' }}>
          Pagos y facturas
        </h1>
        <p style={{ fontSize: '14px', color: C.suave }}>
          Tu estado de cuenta y el envío de comprobantes.
        </p>
      </div>

      {cargando && <p style={{ fontSize: '14px', color: C.suave, padding: '40px 0' }}>Cargando tu estado de cuenta…</p>}

      {error && (
        <div style={{ ...panel, padding: '20px', borderColor: 'rgba(229,62,62,0.3)' }}>
          <p style={{ fontSize: '14px', color: C.rojoClaro }}>{error}</p>
        </div>
      )}

      {datos && (
        <>
          <Resumen saldo={datos.saldo} moneda={datos.moneda} facturas={datos.facturas} isMobile={isMobile} />

          {datos.facturas.length === 0 ? (
            <div style={{ ...panel, padding: '56px 24px', textAlign: 'center' }}>
              <FaFileInvoiceDollar style={{ fontSize: '30px', color: C.tenue, marginBottom: '14px' }} />
              <p style={{ fontSize: '16px', fontWeight: 600, color: C.texto, marginBottom: '6px' }}>
                No tienes facturas registradas
              </p>
              <p style={{ fontSize: '14px', color: C.suave }}>
                Aquí aparecerá tu estado de cuenta.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {datos.facturas.map((factura, i) => (
                <FilaFactura
                  key={factura.id} factura={factura} isMobile={isMobile} indice={i}
                  pagoEnLinea={datos.pago_en_linea}
                  onSubir={setFacturaSubiendo}
                />
              ))}
            </div>
          )}

          {!datos.pago_en_linea && datos.facturas.length > 0 && (
            <p style={{ fontSize: '12px', color: C.tenue, marginTop: '20px', textAlign: 'center', lineHeight: 1.6 }}>
              Realiza tu transferencia a la cuenta que aparece en tu factura y sube aquí el comprobante.
              <br />
              ¿Dudas con tu estado de cuenta?{' '}
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" style={{ color: C.azulClaro }}>
                Escríbenos <FaWhatsapp style={{ fontSize: '11px' }} />
              </a>
            </p>
          )}
        </>
      )}

      <AnimatePresence>
        {facturaSubiendo && (
          <ModalComprobante
            factura={facturaSubiendo}
            onCerrar={() => setFacturaSubiendo(null)}
            onSubido={() => {
              setFacturaSubiendo(null)
              setAviso('Comprobante enviado. Lo validaremos y actualizaremos tu factura.')
              cargar()
            }}
          />
        )}
        {aviso && (
          <motion.div
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            style={{
              position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 1300,
              padding: '14px 24px', borderRadius: '12px', background: C.panelAlto,
              border: `1px solid ${C.bordeFuerte}`, boxShadow: '0 10px 34px rgba(0,0,0,0.5)',
              fontSize: '14px', color: C.texto, fontWeight: 600, maxWidth: '90vw', textAlign: 'center'
            }}
          >
            {aviso}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Pagos
