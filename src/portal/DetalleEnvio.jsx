import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaMapMarkerAlt, FaRegCalendarAlt, FaBoxOpen, FaHistory, FaRoute } from 'react-icons/fa'
import useIsMobile from '../hooks/useIsMobile'
import { detalleEnvio } from '../lib/apiPortal'
import { buscarServicio, formatearFecha, formatearFechaHora } from '../data/estatus'
import { Etapas, LineaTiempo, Pastilla } from './Progreso'
import RutaMapa from './RutaMapa'
import { C, panel, btn } from './ui'

const Dato = ({ icono: Icono, etiqueta, valor }) => (
  <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
    <div style={{
      width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
      background: 'rgba(99,179,237,0.12)', color: C.azulClaro,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px'
    }}>
      <Icono />
    </div>
    <div>
      <p style={{
        fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase',
        color: C.tenue, marginBottom: '4px'
      }}>
        {etiqueta}
      </p>
      <p style={{ fontSize: '15px', color: C.texto, fontWeight: 500, lineHeight: 1.4 }}>{valor}</p>
    </div>
  </div>
)

const DetalleEnvio = ({ envioId, onVolver }) => {
  const isMobile = useIsMobile()
  const [datos, setDatos] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    detalleEnvio(envioId)
      .then(setDatos)
      .catch(err => setError(err.message))
      .finally(() => setCargando(false))
  }, [envioId])

  const entregado = datos?.envio.estatus === 'entregado'

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <button type="button" onClick={onVolver}
        style={{ ...btn.texto, marginBottom: '18px', paddingLeft: 0 }}>
        <FaArrowLeft style={{ fontSize: '11px' }} /> Volver a mis envíos
      </button>

      {cargando && <p style={{ fontSize: '14px', color: C.suave }}>Cargando envío…</p>}

      {error && (
        <div style={{ ...panel, padding: '20px', borderColor: 'rgba(229,62,62,0.3)' }}>
          <p style={{ fontSize: '14px', color: C.rojoClaro }}>{error}</p>
        </div>
      )}

      {datos && (
        <>
          <div style={{ ...panel, padding: isMobile ? '22px 18px' : '30px', marginBottom: '16px' }}>
            <div style={{
              display: 'flex', justifyContent: 'space-between', gap: '14px',
              alignItems: isMobile ? 'flex-start' : 'center',
              flexDirection: isMobile ? 'column' : 'row', marginBottom: '26px'
            }}>
              <div>
                <p style={{
                  fontSize: '11px', fontWeight: 600, letterSpacing: '2px',
                  textTransform: 'uppercase', color: C.tenue, marginBottom: '6px'
                }}>
                  Guía
                </p>
                <p style={{ fontSize: isMobile ? '22px' : '27px', fontWeight: 800, color: C.texto, letterSpacing: '0.5px' }}>
                  {datos.envio.numero}
                </p>
              </div>
              <Pastilla estatus={datos.envio.estatus} />
            </div>

            <Etapas estatus={datos.envio.estatus} compacto={isMobile} />

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: '20px', marginTop: '30px', paddingTop: '26px',
              borderTop: `1px solid ${C.borde}`
            }}>
              <Dato icono={FaMapMarkerAlt} etiqueta="Origen" valor={datos.envio.origen} />
              <Dato icono={FaMapMarkerAlt} etiqueta="Destino" valor={datos.envio.destino} />
              <Dato
                icono={FaRegCalendarAlt}
                etiqueta={entregado ? 'Entrega' : 'Entrega estimada'}
                valor={formatearFecha(datos.envio.fecha_estimada) || 'Por confirmar'}
              />
              {buscarServicio(datos.envio.servicio) && (
                <Dato icono={FaBoxOpen} etiqueta="Servicio" valor={buscarServicio(datos.envio.servicio)} />
              )}
            </div>
          </div>

          <div style={{ ...panel, padding: isMobile ? '18px' : '22px', marginBottom: '16px' }}>
            <h2 style={{
              fontSize: '17px', fontWeight: 700, color: C.texto, marginBottom: '18px',
              display: 'flex', alignItems: 'center', gap: '10px'
            }}>
              <FaRoute style={{ fontSize: '14px', color: C.azulClaro }} /> Ruta de tu carga
            </h2>
            <RutaMapa
              origen={datos.envio.origen}
              destino={datos.envio.destino}
              estatus={datos.envio.estatus}
            />
          </div>

          {datos.eventos.length > 0 && (
            <div style={{ ...panel, padding: isMobile ? '22px 18px' : '30px' }}>
              <h2 style={{
                fontSize: '17px', fontWeight: 700, color: C.texto, marginBottom: '24px',
                display: 'flex', alignItems: 'center', gap: '10px'
              }}>
                <FaHistory style={{ fontSize: '14px', color: C.azulClaro }} /> Historial del envío
              </h2>
              <LineaTiempo eventos={datos.eventos} />
            </div>
          )}

          <p style={{ fontSize: '12px', color: C.tenue, textAlign: 'center', marginTop: '18px' }}>
            Última actualización: {formatearFechaHora(datos.envio.actualizado_en)}
          </p>
        </>
      )}
    </motion.div>
  )
}

export default DetalleEnvio
