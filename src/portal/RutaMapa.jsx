import { useEffect, useMemo, useState } from 'react'
import * as d3 from 'd3'
import { cargarMundo } from '../data/mundo'
import { ubicar } from '../data/lugares'
import { ETAPAS, indiceEtapa } from '../data/estatus'
import { C } from './ui'

const ANCHO = 900
const ALTO = 380
const MARGEN = 54
const ESCALA_MAXIMA = 1400

// Dibuja el trayecto del envío sobre el mapa: origen, destino, la ruta que
// siguen y en qué punto va la carga según su etapa.
const RutaMapa = ({ origen, destino, estatus }) => {
  const [mundo, setMundo] = useState(null)

  useEffect(() => {
    let vigente = true
    cargarMundo().then(datos => { if (vigente) setMundo(datos) }).catch(() => {})
    return () => { vigente = false }
  }, [])

  const geo = useMemo(() => {
    const a = ubicar(origen)
    const b = ubicar(destino)
    if (!a || !b) return null

    const interpolar = d3.geoInterpolate(a, b)
    const medio = interpolar(0.5)
    const ruta = {
      type: 'LineString',
      coordinates: d3.range(0, 1.0001, 1 / 96).map(t => interpolar(t))
    }

    // Se gira el globo para centrar la ruta: así nunca se parte en el borde
    // del mapa, ni siquiera cuando cruza el Pacífico.
    const proyeccion = d3.geoNaturalEarth1().rotate([-medio[0], 0])
    proyeccion.fitExtent([[MARGEN, MARGEN], [ANCHO - MARGEN, ALTO - MARGEN]], ruta)

    // Rutas muy cortas se acercarían demasiado: se limita el acercamiento.
    if (proyeccion.scale() > ESCALA_MAXIMA) {
      proyeccion.scale(ESCALA_MAXIMA)
      const [tx, ty] = proyeccion.translate()
      const [mx, my] = proyeccion(medio)
      proyeccion.translate([tx + (ANCHO / 2 - mx), ty + (ALTO / 2 - my)])
    }

    return { a, b, ruta, interpolar, proyeccion, trazo: d3.geoPath(proyeccion) }
  }, [origen, destino])

  // Sin coordenadas conocidas no se dibuja nada: mejor eso que un mapa erróneo.
  if (!geo) return null

  const etapa = indiceEtapa(estatus)
  const avance = etapa < 0 ? 0 : etapa / (ETAPAS.length - 1)
  const posicion = geo.proyeccion(geo.interpolar(Math.min(Math.max(avance, 0), 1)))
  const [ox, oy] = geo.proyeccion(geo.a)
  const [dx, dy] = geo.proyeccion(geo.b)

  const recorrido = {
    type: 'LineString',
    coordinates: d3.range(0, avance + 0.0001, 1 / 96).map(t => geo.interpolar(Math.min(t, 1)))
  }

  const tierra = C.claro ? '#dbe6f3' : '#1e4674'
  const borde = C.claro ? '#c3d4e8' : '#2c5c92'
  const mar = C.claro ? '#eef3f9' : '#0e2036'

  return (
    <div style={{
      borderRadius: '12px', overflow: 'hidden', background: mar,
      border: `1px solid ${C.borde}`
    }}>
      <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} style={{ width: '100%', display: 'block' }}>
        {mundo && (
          <g>
            {mundo.features.map((pais, i) => (
              <path key={i} d={geo.trazo(pais)} fill={tierra} stroke={borde} strokeWidth={0.5} />
            ))}
          </g>
        )}

        {/* Trayecto completo, tenue */}
        <path
          d={geo.trazo(geo.ruta)} fill="none" strokeWidth={2.2} strokeDasharray="6 7"
          stroke={C.claro ? '#9db9d8' : '#3f7fc0'} strokeLinecap="round"
        />

        {/* Tramo ya recorrido */}
        {avance > 0 && (
          <path
            d={geo.trazo(recorrido)} fill="none" strokeWidth={3}
            stroke={C.claro ? '#2b6cb0' : '#63b3ed'} strokeLinecap="round"
          />
        )}

        {/* Origen */}
        <circle cx={ox} cy={oy} r={9} fill={C.claro ? '#2b6cb0' : '#63b3ed'} opacity={0.18} />
        <circle cx={ox} cy={oy} r={4.5} fill={C.claro ? '#2b6cb0' : '#63b3ed'} />

        {/* Destino */}
        <circle cx={dx} cy={dy} r={9} fill={C.claro ? '#276749' : '#68d391'} opacity={0.18} />
        <circle cx={dx} cy={dy} r={4.5} fill={C.claro ? '#276749' : '#68d391'} />

        {/* Posición actual de la carga */}
        <g>
          <circle cx={posicion[0]} cy={posicion[1]} r={14} fill={C.claro ? '#2b6cb0' : '#63b3ed'} opacity={0.16}>
            <animate attributeName="r" values="11;17;11" dur="2.4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.22;0.06;0.22" dur="2.4s" repeatCount="indefinite" />
          </circle>
          <circle cx={posicion[0]} cy={posicion[1]} r={7} fill="#fff"
            stroke={C.claro ? '#2b6cb0' : '#3182ce'} strokeWidth={3} />
        </g>
      </svg>

      <div style={{
        display: 'flex', justifyContent: 'space-between', gap: '14px',
        padding: '12px 16px', borderTop: `1px solid ${C.borde}`, background: C.panel
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <span style={{
            width: '9px', height: '9px', borderRadius: '50%', flexShrink: 0,
            background: C.claro ? '#2b6cb0' : '#63b3ed'
          }} />
          <p style={{ fontSize: '12px', color: C.suave, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {origen}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          <p style={{ fontSize: '12px', color: C.suave, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {destino}
          </p>
          <span style={{
            width: '9px', height: '9px', borderRadius: '50%', flexShrink: 0,
            background: C.claro ? '#276749' : '#68d391'
          }} />
        </div>
      </div>
    </div>
  )
}

export default RutaMapa
