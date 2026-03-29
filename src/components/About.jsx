import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaArrowLeft, FaMapMarkerAlt } from 'react-icons/fa'
import * as d3 from 'd3'
import { feature } from 'topojson-client'
import ScrollReveal from './ScrollReveal'
import useIsMobile from '../hooks/useIsMobile'

const countries = {
  mexico: {
    name: 'México', flag: '🇲🇽', year: 2016,
    intro: 'El inicio del proyecto en 2016. Desde México coordinamos operaciones logísticas hacia todo el mundo, siendo nuestra sede principal y centro de operaciones.',
    clients: [
      { name: 'Holcim', logo: '/logos/holcim.png' },
      { name: 'Comap', logo: '/logos/comap.png' },
      { name: 'Bubble Gummers', logo: '/logos/bubblegummers.png' },
      { name: 'Andrea', logo: '/logos/andrea.png' },
      { name: 'Price Shoes', logo: '/logos/priceshoes.png' },
      { name: 'ICP', logo: '/logos/icp.png' }
    ],
    locations: [
      { type: 'Oficinas', place: 'Cuajimalpa de Morelos, CDMX' },
      { type: 'Bodega', place: 'Buenavista, Estado de México' }
    ],
    color: '#48bb78',
    flagColors: ['#006847', '#fff', '#CE1126'],
    coords: [-99.13, 19.43]
  },
  china: {
    name: 'China', flag: '🇨🇳', year: 2016,
    intro: 'A la par con el inicio de operaciones en México, iniciamos operaciones en China para ofrecer un servicio integral. Presencia estratégica en la conexión Asia-Latam.',
    clients: [],
    locations: [
      { type: 'Bodega', place: 'Nansha, Guangzhou' },
      { type: 'Bodega', place: 'Yantian, Shenzhen' },
      { type: 'Bodega', place: 'Pudong, Shanghai' },
      { type: 'Bodega', place: 'Binhai, Tianjin' },
      { type: 'Bodega', place: 'Huangdao, Qingdao' },
      { type: 'Bodega', place: 'Caofeidian, Hebei' },
      { type: 'Bodega', place: 'Beilun, Ningbo' },
      { type: 'Bodega', place: 'Haicang, Xiamen' }
    ],
    color: '#e53e3e',
    flagColors: ['#DE2910', '#FFDE00', '#DE2910'],
    coords: [114.0, 30.0]
  },
  colombia: {
    name: 'Colombia', flag: '🇨🇴', year: 2020,
    intro: 'A raíz de los servicios prestados en China, nos logramos expandir a más lugares de Latinoamérica. En este caso Colombia en 2020.',
    clients: [
      { name: 'Colombina', logo: '/logos/colombina.png' },
      { name: 'Quala', logo: '/logos/quala.png' },
      { name: 'Haceb', logo: '/logos/haceb.png' },
      { name: 'Alkosto', logo: '/logos/alkosto.png' },
      { name: 'Alpina', logo: '/logos/alpina.png' }
    ],
    locations: [{ type: 'Oficina', place: 'Buenaventura, Valle del Cauca' }],
    color: '#ecc94b',
    flagColors: ['#FCD116', '#003893', '#CE1126'],
    coords: [-76.52, 3.45]
  },
  rd: {
    name: 'Rep. Dominicana', flag: '🇩🇴', year: 2021,
    intro: 'Del mismo modo llegamos a República Dominicana en 2021, ampliando nuestra cobertura en el Caribe.',
    clients: [
      { name: 'Carballo', logo: '/logos/carballo.svg' },
      { name: 'Hergall S.R.L.', logo: '/logos/hergall.png' },
      { name: 'Alsike Group S.R.L.', logo: '/logos/alsike.svg' },
      { name: 'LENICIA S.R.L.', logo: '/logos/lenicia.png' }
    ],
    locations: [
      { type: 'Oficina', place: 'Haina, San Cristóbal' }
    ],
    color: '#3182ce',
    flagColors: ['#002D62', '#CE1126', '#fff'],
    coords: [-69.89, 18.47]
  },
  ecuador: {
    name: 'Ecuador', flag: '🇪🇨', year: 2022,
    intro: 'Nuestra última incursión fue en Ecuador, donde llegamos en 2022 para ofrecer nuestros servicios de forwarding y logística.',
    clients: [
      { name: 'Orve Hogar', logo: '/logos/orvehogar.png' },
      { name: 'Distribuidora Oña', logo: '/logos/distribuidoraona.svg' },
      { name: 'Dibeal', logo: '/logos/dibeal.png' }
    ],
    locations: [{ type: 'Oficina', place: 'Guayaquil, Guayas' }],
    color: '#ed8936',
    flagColors: ['#FFD100', '#003DA5', '#CE1126'],
    coords: [-79.89, -2.19]
  }
}

const D3Globe = ({ onSelectCountry, size = 450 }) => {
  const svgRef = useRef(null)
  const [worldData, setWorldData] = useState(null)
  const [rotation, setRotation] = useState([99, -5, 0])
  const [hovered, setHovered] = useState(null)
  const dragging = useRef(false)
  const lastPos = useRef(null)
  const autoRotate = useRef(true)
  const rotRef = useRef([99, -5, 0])

  // Load world data
  useEffect(() => {
    fetch('/world-110m.json')
      .then(r => r.json())
      .then(data => {
        const land = feature(data, data.objects.countries)
        setWorldData(land)
      })
  }, [])

  // Auto-rotate
  useEffect(() => {
    let frame
    const animate = () => {
      if (autoRotate.current && !dragging.current) {
        rotRef.current = [rotRef.current[0] - 0.2, rotRef.current[1], 0]
        setRotation([...rotRef.current])
      }
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  const projection = d3.geoOrthographic()
    .scale(size / 2 - 10)
    .translate([size / 2, size / 2])
    .rotate(rotation)
    .clipAngle(90)

  const path = d3.geoPath(projection)

  const handlePointerDown = (e) => {
    dragging.current = true
    autoRotate.current = false
    lastPos.current = { x: e.clientX, y: e.clientY }
  }

  const handlePointerMove = (e) => {
    if (!dragging.current || !lastPos.current) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    rotRef.current = [
      rotRef.current[0] - dx * 0.4,
      Math.max(-60, Math.min(60, rotRef.current[1] + dy * 0.4)),
      0
    ]
    setRotation([...rotRef.current])
    lastPos.current = { x: e.clientX, y: e.clientY }
  }

  const handlePointerUp = () => {
    dragging.current = false
    lastPos.current = null
    // Resume auto-rotate after 3 seconds
    setTimeout(() => { autoRotate.current = true }, 3000)
  }

  // Get projected position for a country marker
  const getMarkerPos = (coords) => {
    const projected = projection(coords)
    if (!projected) return null
    // Check if point is on visible hemisphere
    const r = projection.rotate()
    const λ = coords[0] * Math.PI / 180
    const φ = coords[1] * Math.PI / 180
    const r0 = -r[0] * Math.PI / 180
    const r1 = -r[1] * Math.PI / 180
    const cosAngle = Math.sin(φ) * Math.sin(r1) + Math.cos(φ) * Math.cos(r1) * Math.cos(λ - r0)
    if (cosAngle < 0) return null
    return { x: projected[0], y: projected[1], depth: cosAngle }
  }

  return (
    <div style={{ position: 'relative', width: `${size}px`, maxWidth: '90vw', margin: '0 auto', aspectRatio: '1' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Atmosphere glow */}
      <div style={{
        position: 'absolute', inset: '-5%', borderRadius: '50%',
        background: 'radial-gradient(circle, transparent 44%, rgba(99,179,237,0.1) 48%, rgba(99,179,237,0.04) 52%, transparent 56%)',
        pointerEvents: 'none'
      }} />

      <svg
        ref={svgRef}
        viewBox={`0 0 ${size} ${size}`}
        style={{ width: '100%', height: '100%', cursor: dragging.current ? 'grabbing' : 'grab' }}
      >
        <defs>
          {/* Sphere gradient for 3D effect */}
          <radialGradient id="globeShading" cx="35%" cy="30%">
            <stop offset="0%" stopColor="rgba(120,180,255,0.1)" />
            <stop offset="40%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.45)" />
          </radialGradient>
          <radialGradient id="globeGlow" cx="50%" cy="50%">
            <stop offset="85%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(99,179,237,0.15)" />
          </radialGradient>
          {/* Ocean gradient - deeper blue */}
          <radialGradient id="oceanGrad" cx="35%" cy="30%">
            <stop offset="0%" stopColor="#1a3a5c" />
            <stop offset="100%" stopColor="#0d2137" />
          </radialGradient>
          {/* Relief lighting filter */}
          <filter id="relief" x="-2%" y="-2%" width="104%" height="104%">
            <feDiffuseLighting in="SourceGraphic" result="light" surfaceScale="3" diffuseConstant="0.8">
              <fePointLight x={size * 0.3} y={size * 0.25} z="80" />
            </feDiffuseLighting>
            <feComposite in="SourceGraphic" in2="light" operator="arithmetic" k1="0.7" k2="0.3" k3="0" k4="0" />
          </filter>
        </defs>

        {/* Ocean / base sphere */}
        <circle
          cx={size / 2} cy={size / 2} r={size / 2 - 10}
          fill="url(#oceanGrad)"
          stroke="rgba(99,179,237,0.15)" strokeWidth="1"
        />

        {/* Graticule (grid lines) */}
        <path
          d={path(d3.geoGraticule10())}
          fill="none" stroke="rgba(99,179,237,0.06)" strokeWidth="0.5"
        />

        {/* Countries with natural earth colors */}
        <g filter="url(#relief)">
          {worldData && worldData.features.map((f, i) => {
            // Natural earth palette - greens, tans, browns
            const earthColors = [
              '#2d6a4f', '#40916c', '#52b788', '#74c69d', '#386641',
              '#6b705c', '#a68a64', '#7f8c5c', '#588157', '#3a5a40',
              '#4a7c59', '#8fbc8f', '#5e8c61', '#6b8e5e', '#4f7942',
              '#718355', '#8b9e6b', '#5c7a3b', '#7d8f69', '#637a4f'
            ]
            const color = earthColors[i % earthColors.length]
            return (
              <path
                key={i}
                d={path(f)}
                fill={color}
                stroke="rgba(0,0,0,0.2)"
                strokeWidth="0.4"
                opacity="0.85"
              />
            )
          })}
        </g>

        {/* 3D shading overlay */}
        <circle
          cx={size / 2} cy={size / 2} r={size / 2 - 10}
          fill="url(#globeShading)" pointerEvents="none"
        />

        {/* Atmosphere glow edge */}
        <circle
          cx={size / 2} cy={size / 2} r={size / 2 - 10}
          fill="url(#globeGlow)" pointerEvents="none"
        />
      </svg>

      {/* Country markers (HTML overlay for better interactivity) */}
      {Object.entries(countries).map(([key, c]) => {
        const pos = getMarkerPos(c.coords)
        if (!pos) return null

        const scale = 0.5 + pos.depth * 0.5

        return (
          <div key={key} style={{
            position: 'absolute',
            left: `${(pos.x / size) * 100}%`,
            top: `${(pos.y / size) * 100}%`,
            transform: `translate(-50%, -50%) scale(${scale})`,
            zIndex: 10, cursor: 'pointer',
            width: '14px', height: '14px'
          }}
            onClick={(e) => { e.stopPropagation(); onSelectCountry(key) }}
            onMouseEnter={() => setHovered(key)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Pulse - centered exactly on the dot */}
            <motion.div style={{
              position: 'absolute',
              top: '50%', left: '50%',
              width: '14px', height: '14px',
              marginTop: '-7px', marginLeft: '-7px',
              borderRadius: '50%',
              border: `2px solid ${c.color}`
            }} animate={{ scale: [1, 2.5, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 2.5, repeat: Infinity }} />

            {/* Dot */}
            <div style={{
              width: '14px', height: '14px', borderRadius: '50%',
              background: c.color, boxShadow: `0 0 12px ${c.color}80`,
              border: '2px solid rgba(255,255,255,0.9)',
              position: 'relative', zIndex: 2
            }} />

            {/* Tooltip */}
            <AnimatePresence>
              {hovered === key && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  style={{
                    position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
                    marginBottom: '12px',
                    padding: '10px 16px', borderRadius: '10px', background: 'rgba(0,0,0,0.92)',
                    backdropFilter: 'blur(10px)', whiteSpace: 'nowrap', pointerEvents: 'none',
                    border: `1px solid ${c.color}50`, boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                  }}>
                  <span style={{ fontSize: '18px', marginRight: '8px' }}>{c.flag}</span>
                  <span style={{ color: '#fff', fontSize: '14px', fontWeight: 600 }}>{c.name}</span>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginLeft: '8px' }}>{c.year}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

// Client logos - one at a time with slow fade
const ClientLogos = ({ clients }) => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrent(p => (p + 1) % clients.length), 3500)
    return () => clearInterval(timer)
  }, [clients.length])

  return (
    <div style={{ margin: '20px 0' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '24px', minHeight: '100px'
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              minWidth: '200px', height: '100px'
            }}
          >
            <img
              src={clients[current].logo}
              alt={clients[current].name}
              style={{
                maxWidth: '180px', maxHeight: '80px', objectFit: 'contain',
                filter: 'brightness(0) invert(1)', opacity: 0.9
              }}
            />
          </motion.div>
        </AnimatePresence>
        <div style={{ display: 'flex', gap: '6px' }}>
          {clients.map((_, i) => (
            <div key={i} style={{
              width: current === i ? '20px' : '6px', height: '6px', borderRadius: '3px',
              background: current === i ? '#63b3ed' : 'rgba(255,255,255,0.15)',
              transition: 'all 0.3s'
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Zoom transition with flag colors
const ZoomTransition = ({ country, onComplete, isMobile }) => {
  const c = countries[country]
  useEffect(() => {
    if (c) {
      const timer = setTimeout(onComplete, 1600)
      return () => clearTimeout(timer)
    }
  }, [country])
  if (!c) return null
  return (
    <motion.div
      style={{ position: 'fixed', inset: 0, zIndex: 950, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${c.flagColors[0]} 0%, ${c.flagColors[1]} 50%, ${c.flagColors[2]} 100%)` }}
        initial={{ clipPath: 'circle(0% at 50% 50%)' }}
        animate={{ clipPath: 'circle(150% at 50% 50%)' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.4 }}>
        <span style={{ fontSize: isMobile ? '56px' : '80px', display: 'block' }}>{c.flag}</span>
        <h2 style={{ fontSize: isMobile ? '26px' : '36px', fontWeight: 800, color: '#fff', textShadow: '0 2px 20px rgba(0,0,0,0.4)', marginTop: '12px' }}>{c.name}</h2>
      </motion.div>
    </motion.div>
  )
}

// Country detail page
const CountryPage = ({ countryKey, onBack, isMobile }) => {
  const c = countries[countryKey]
  if (!c) return null
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
      style={{ minHeight: '100vh', padding: isMobile ? '80px 16px 40px' : '100px 24px 60px', background: 'transparent' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#63b3ed', fontSize: '14px', fontWeight: 500, cursor: 'pointer', marginBottom: isMobile ? '24px' : '40px', padding: 0 }}>
          <FaArrowLeft /> Volver al mapa
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '12px' : '16px', marginBottom: '12px' }}>
          <span style={{ fontSize: isMobile ? '36px' : '48px' }}>{c.flag}</span>
          <div>
            <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, color: '#fff', margin: 0 }}>{c.name}</h1>
            <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', background: `${c.color}20`, color: c.color, fontSize: '13px', fontWeight: 600, marginTop: '6px' }}>Desde {c.year}</span>
          </div>
        </div>
        <p style={{ fontSize: isMobile ? '15px' : '17px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: isMobile ? '30px' : '50px', maxWidth: '700px' }}>{c.intro}</p>
        {c.clients.length > 0 && (
          <div style={{ marginBottom: '50px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>Clientes Destacados</h2>
            <ClientLogos clients={c.clients} />
          </div>
        )}
        <div>
          <h2 style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>Ubicaciones</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(250px, 1fr))', gap: '14px' }}>
            {c.locations.map((loc, i) => (
              <div key={i} style={{ padding: '18px 20px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <FaMapMarkerAlt style={{ color: c.color, fontSize: '16px', marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: '12px', color: c.color, fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>{loc.type}</p>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{loc.place}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const About = () => {
  const isMobile = useIsMobile()
  const [showPage, setShowPage] = useState(null)
  const [zoomingTo, setZoomingTo] = useState(null)

  const handleSelectCountry = (key) => setZoomingTo(key)
  const handleZoomComplete = () => { setShowPage(zoomingTo); setZoomingTo(null) }
  const handleBack = () => setShowPage(null)

  if (showPage) {
    return <CountryPage countryKey={showPage} onBack={handleBack} isMobile={isMobile} />
  }

  return (
    <>
      <AnimatePresence>
        {zoomingTo && <ZoomTransition country={zoomingTo} onComplete={handleZoomComplete} isMobile={isMobile} />}
      </AnimatePresence>

      <section style={{ minHeight: '100vh', padding: isMobile ? '80px 16px 40px' : '100px 24px 60px', background: 'transparent', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <ScrollReveal>
            <p style={{ textAlign: 'center', fontSize: '12px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: '#63b3ed', marginBottom: '12px' }}>Nosotros</p>
            <h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
              Presencia <span style={{ color: '#63b3ed' }}>Global</span>
            </h2>
            <p style={{ textAlign: 'center', fontSize: '16px', color: 'rgba(255,255,255,0.5)', maxWidth: '600px', margin: '0 auto 50px', lineHeight: 1.7 }}>
              Operamos en 5 países estratégicos, conectando Latinoamérica con Asia para optimizar tu cadena de suministro.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <D3Globe onSelectCountry={handleSelectCountry} size={isMobile ? 300 : 450} />
            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '11px', color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Arrastra para rotar • Click en un punto para explorar
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: isMobile ? '10px' : '16px', flexWrap: 'wrap', marginTop: isMobile ? '24px' : '40px' }}>
              {Object.entries(countries).map(([key, c]) => (
                <motion.button key={key} onClick={() => handleSelectCountry(key)}
                  whileHover={{ scale: 1.05, y: -4 }}
                  style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '10px', padding: isMobile ? '10px 14px' : '14px 22px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', transition: 'all 0.2s' }}>
                  <span style={{ fontSize: isMobile ? '20px' : '24px' }}>{c.flag}</span>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontSize: isMobile ? '12px' : '14px', color: '#fff', fontWeight: 600, margin: 0 }}>{c.name}</p>
                    <p style={{ fontSize: isMobile ? '10px' : '11px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Desde {c.year}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}

export default About
