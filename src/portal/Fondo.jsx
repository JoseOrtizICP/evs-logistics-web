import { useEffect, useState } from 'react'
import * as d3 from 'd3'
import { feature } from 'topojson-client'
import { C as C_ACTUAL } from './ui'

// Sedes de EVS (las mismas del globo de "Nosotros").
const SEDES = [
  { nombre: 'México', coords: [-99.13, 19.43] },
  { nombre: 'China', coords: [114.0, 30.0] },
  { nombre: 'Colombia', coords: [-76.52, 3.45] },
  { nombre: 'Rep. Dominicana', coords: [-69.89, 18.47] },
  { nombre: 'Ecuador', coords: [-79.89, -2.19] }
]

// México es el centro de operaciones: de ahí salen las rutas.
const CENTRO = SEDES[0]
const RUTAS = SEDES.slice(1).map(destino => ({
  type: 'LineString',
  coordinates: [CENTRO.coords, destino.coords]
}))

const ANCHO = 1440
const ALTO = 980

// Mapa mundial de fondo con la red de EVS. Es decorativo: no recibe clics
// y se mantiene detrás del contenido.
const Fondo = ({ tokens }) => {
  const C = tokens?.C || C_ACTUAL
  const [mundo, setMundo] = useState(null)

  useEffect(() => {
    let vigente = true
    fetch('/world-110m.json')
      .then(r => r.json())
      .then(datos => { if (vigente) setMundo(feature(datos, datos.objects.countries)) })
      .catch(() => {})
    return () => { vigente = false }
  }, [])

  const proyeccion = d3.geoNaturalEarth1()
    .scale(310)
    .translate([ANCHO / 2, ALTO / 2])
  const trazo = d3.geoPath(proyeccion)

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {/* Profundidad detrás del mapa */}
      <div style={{
        position: 'absolute', inset: 0,
        background: C.claro
          ? 'radial-gradient(1200px 700px at 70% -10%, #e6eef8 0%, rgba(230,238,248,0) 65%)'
          : 'radial-gradient(1200px 700px at 70% -10%, #1a3a5e 0%, rgba(26,58,94,0) 65%)'
      }} />

      {mundo && (
        <svg
          viewBox={`0 0 ${ANCHO} ${ALTO}`} preserveAspectRatio="xMidYMid slice"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        >
          <g opacity={C.claro ? 0.75 : 0.75}>
            {mundo.features.map((pais, i) => (
              <path
                key={i} d={trazo(pais)}
                fill={C.claro ? '#ccdcef' : '#1e4674'}
                stroke={C.claro ? '#b3c9e2' : '#2c5c92'}
                strokeWidth={0.4}
              />
            ))}
          </g>

          {/* Rutas desde México hacia cada sede */}
          <g opacity={C.claro ? 0.7 : 0.8}>
            {RUTAS.map((ruta, i) => (
              <path
                key={i} d={trazo(ruta)} fill="none"
                stroke={C.claro ? '#7aa5d2' : '#3f7fc0'}
                strokeWidth={1.1} strokeDasharray="5 6"
              />
            ))}
          </g>

          {/* Sedes */}
          <g>
            {SEDES.map(sede => {
              const [x, y] = proyeccion(sede.coords)
              return (
                <g key={sede.nombre}>
                  <circle cx={x} cy={y} r={8} fill={C.claro ? '#7aa5d2' : '#63b3ed'} opacity={0.18} />
                  <circle cx={x} cy={y} r={3} fill={C.claro ? '#3d6fa8' : '#8ec6f5'} opacity={0.75} />
                </g>
              )
            })}
          </g>
        </svg>
      )}

      {/* Velo que apaga el mapa donde va el contenido, para que no compita */}
      <div style={{
        position: 'absolute', inset: 0,
        background: C.claro
          ? 'linear-gradient(180deg, rgba(242,245,249,0.42) 0%, rgba(242,245,249,0.74) 100%)'
          : 'linear-gradient(180deg, rgba(11,23,39,0.42) 0%, rgba(11,23,39,0.76) 100%)'
      }} />
    </div>
  )
}

export default Fondo
