import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FaChevronRight, FaBoxOpen, FaShip, FaPlane, FaTruck, FaLayerGroup } from 'react-icons/fa'
import useIsMobile from '../hooks/useIsMobile'
import { misEnvios } from '../lib/apiPortal'
import { buscarServicio, formatearFecha } from '../data/estatus'
import { Etapas, Pastilla } from './Progreso'
import { C, panel, btn } from './ui'

const ICONO_SERVICIO = {
  maritimo: FaShip, aereo: FaPlane, terrestre: FaTruck, multimodal: FaLayerGroup
}

const FILTROS = [
  { clave: 'activos', etiqueta: 'En curso' },
  { clave: 'entregados', etiqueta: 'Entregados' },
  { clave: 'todos', etiqueta: 'Todos' }
]

const Tarjeta = ({ envio, isMobile, onAbrir, indice }) => {
  const Icono = ICONO_SERVICIO[envio.servicio] || FaBoxOpen
  const entregado = envio.estatus === 'entregado'

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: indice * 0.05, duration: 0.35 }}
      onClick={() => onAbrir(envio)}
      style={{
        ...panel, padding: isMobile ? '18px' : '22px 24px', width: '100%', textAlign: 'left',
        cursor: 'pointer', fontFamily: 'inherit', display: 'block', transition: 'border-color 0.15s'
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,179,237,0.45)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = C.borde }}
    >
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        gap: '14px', marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', minWidth: 0 }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '11px', flexShrink: 0,
            background: 'rgba(99,179,237,0.12)', color: C.azulClaro,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px'
          }}>
            <Icono />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '16px', fontWeight: 700, color: C.texto, letterSpacing: '0.3px' }}>
              {envio.numero}
            </p>
            <p style={{ fontSize: '13px', color: C.suave, marginTop: '3px' }}>
              {envio.origen} <span style={{ color: C.azulClaro }}>→</span> {envio.destino}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {!isMobile && <Pastilla estatus={envio.estatus} />}
          <FaChevronRight style={{ color: C.tenue, fontSize: '13px' }} />
        </div>
      </div>

      {isMobile && <div style={{ marginBottom: '14px' }}><Pastilla estatus={envio.estatus} /></div>}

      <Etapas estatus={envio.estatus} compacto />

      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: isMobile ? '6px 14px' : '20px',
        marginTop: '14px', fontSize: '12px', color: C.tenue
      }}>
        {buscarServicio(envio.servicio) && <span>{buscarServicio(envio.servicio)}</span>}
        <span>
          {entregado ? 'Entregado el ' : 'Entrega estimada: '}
          {formatearFecha(envio.fecha_estimada) || 'por confirmar'}
        </span>
      </div>
    </motion.button>
  )
}

const Resumen = ({ envios, isMobile }) => {
  const enCurso = envios.filter(e => e.estatus !== 'entregado')
  const entregados = envios.filter(e => e.estatus === 'entregado')
  const proxima = [...enCurso]
    .filter(e => e.fecha_estimada)
    .sort((a, b) => new Date(a.fecha_estimada) - new Date(b.fecha_estimada))[0]

  const tarjetas = [
    { titulo: 'Envíos en curso', valor: String(enCurso.length) },
    { titulo: 'Próxima entrega', valor: formatearFecha(proxima?.fecha_estimada) || '—' },
    { titulo: 'Entregados', valor: String(entregados.length) }
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
          <p style={{ fontSize: '22px', fontWeight: 800, color: C.texto, letterSpacing: '-0.4px' }}>
            {t.valor}
          </p>
        </div>
      ))}
    </div>
  )
}

const MisEnvios = ({ onAbrir }) => {
  const isMobile = useIsMobile()
  const [envios, setEnvios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [filtro, setFiltro] = useState('activos')

  useEffect(() => {
    misEnvios()
      .then(({ envios }) => setEnvios(envios))
      .catch(err => setError(err.message))
      .finally(() => setCargando(false))
  }, [])

  const visibles = envios.filter(e =>
    filtro === 'todos' ? true
      : filtro === 'entregados' ? e.estatus === 'entregado'
        : e.estatus !== 'entregado'
  )

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 800, color: C.texto, marginBottom: '6px' }}>
          Mis envíos
        </h1>
        <p style={{ fontSize: '14px', color: C.suave }}>
          Consulta el avance de cada embarque en tiempo real.
        </p>
      </div>

      {!cargando && !error && envios.length > 0 && <Resumen envios={envios} isMobile={isMobile} />}

      <div style={{ display: 'flex', gap: '8px', marginBottom: '22px', flexWrap: 'wrap' }}>
        {FILTROS.map(f => {
          const activo = filtro === f.clave
          const cuantos = envios.filter(e =>
            f.clave === 'todos' ? true
              : f.clave === 'entregados' ? e.estatus === 'entregado'
                : e.estatus !== 'entregado'
          ).length
          return (
            <button key={f.clave} type="button" onClick={() => setFiltro(f.clave)}
              style={{
                ...btn.contorno, padding: '9px 16px', fontSize: '13px',
                background: activo ? 'rgba(49,130,206,0.18)' : 'transparent',
                color: activo ? C.azulClaro : C.suave,
                borderColor: activo ? 'rgba(99,179,237,0.5)' : C.bordeFuerte
              }}>
              {f.etiqueta} <span style={{ opacity: 0.65 }}>{cuantos}</span>
            </button>
          )
        })}
      </div>

      {cargando ? (
        <p style={{ fontSize: '14px', color: C.suave, padding: '40px 0' }}>Cargando tus envíos…</p>
      ) : error ? (
        <div style={{ ...panel, padding: '20px', borderColor: 'rgba(229,62,62,0.3)' }}>
          <p style={{ fontSize: '14px', color: C.rojoClaro }}>{error}</p>
        </div>
      ) : visibles.length === 0 ? (
        <div style={{ ...panel, padding: '56px 24px', textAlign: 'center' }}>
          <FaBoxOpen style={{ fontSize: '30px', color: C.tenue, marginBottom: '14px' }} />
          <p style={{ fontSize: '16px', fontWeight: 600, color: C.texto, marginBottom: '6px' }}>
            No hay envíos en esta vista
          </p>
          <p style={{ fontSize: '14px', color: C.suave }}>
            {filtro === 'activos' ? 'Todos tus envíos ya fueron entregados.' : 'Aquí aparecerán tus embarques.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {visibles.map((envio, i) => (
            <Tarjeta key={envio.id} envio={envio} isMobile={isMobile} onAbrir={onAbrir} indice={i} />
          ))}
        </div>
      )}
    </div>
  )
}

export default MisEnvios
