import { motion } from 'framer-motion'
import { ETAPAS, buscarEstatus, indiceEtapa, formatearFechaHora } from '../data/estatus'
import { C, paraFondo } from './ui'

// Barra de etapas: hasta dónde llegó el envío.
export const Etapas = ({ estatus, compacto = false }) => {
  const actual = indiceEtapa(estatus)
  if (actual < 0) return null

  return (
    <div style={{ display: 'flex', gap: compacto ? '4px' : '7px' }}>
      {ETAPAS.map((etapa, i) => {
        const alcanzada = i <= actual
        return (
          <div key={etapa.clave} style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                height: compacto ? '4px' : '5px', borderRadius: '3px',
                background: alcanzada ? C.azulClaro : C.pista,
                transition: 'background 0.3s'
              }}
            />
            {!compacto && (
              <p style={{
                fontSize: '11px', marginTop: '8px', lineHeight: 1.3,
                color: alcanzada ? C.suave : C.tenue, fontWeight: i === actual ? 700 : 500
              }}>
                {etapa.etiqueta}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}

// Historial de movimientos, del más reciente al más antiguo.
export const LineaTiempo = ({ eventos }) => (
  <div style={{ position: 'relative', paddingLeft: '28px' }}>
    <div style={{
      position: 'absolute', left: '7px', top: '10px', bottom: '10px',
      width: '2px', background: 'rgba(99,179,237,0.22)'
    }} />
    {eventos.map((evento, i) => {
      const info = buscarEstatus(evento.estatus)
      const color = paraFondo(info.color)
      const reciente = i === 0
      return (
        <motion.div
          key={evento.id ?? `${evento.ocurrido_en}-${i}`}
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06, duration: 0.35 }}
          style={{ position: 'relative', paddingBottom: i === eventos.length - 1 ? 0 : '24px' }}
        >
          <div style={{
            position: 'absolute', left: '-28px', top: '3px',
            width: '16px', height: '16px', borderRadius: '50%',
            background: reciente ? color : C.panel,
            border: `2px solid ${color}`,
            boxShadow: reciente ? `0 0 0 5px ${color}22` : 'none'
          }} />
          <p style={{ fontSize: '15px', fontWeight: 700, color: reciente ? C.texto : C.suave }}>
            {info.etiqueta}
          </p>
          {evento.descripcion && (
            <p style={{ fontSize: '14px', color: C.suave, lineHeight: 1.6, marginTop: '3px' }}>
              {evento.descripcion}
            </p>
          )}
          <p style={{ fontSize: '12px', color: C.tenue, marginTop: '5px' }}>
            {formatearFechaHora(evento.ocurrido_en)}
            {evento.ubicacion ? ` · ${evento.ubicacion}` : ''}
          </p>
        </motion.div>
      )
    })}
  </div>
)

export const Pastilla = ({ estatus }) => {
  const info = buscarEstatus(estatus)
  const color = paraFondo(info.color)
  return (
    <span style={{
      padding: '6px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: 700,
      background: `${color}${C.claro ? '14' : '1f'}`, color, border: `1px solid ${color}${C.claro ? '44' : '55'}`,
      whiteSpace: 'nowrap', display: 'inline-block'
    }}>
      {info.etiqueta}
    </span>
  )
}
