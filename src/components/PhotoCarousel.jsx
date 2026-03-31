import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import ScrollReveal from './ScrollReveal'
import useIsMobile from '../hooks/useIsMobile'

const photos = [
  // Originales
  { src: '/fotos/bodega-pallets.jpg', caption: 'Bodega y almacenaje de pallets' },
  { src: '/fotos/camion-bodega.jpg', caption: 'Transporte terrestre en bodega' },
  { src: '/fotos/interior-contenedor.jpg', caption: 'Interior de contenedor' },
  { src: '/fotos/contenedor-exterior.jpg', caption: 'Contenedor listo para embarque' },
  { src: '/fotos/contenedor-carga.jpg', caption: 'Carga de contenedor' },
  { src: '/fotos/grua-carga.jpg', caption: 'Operación de grúa portuaria' },
  { src: '/fotos/carga-asegurada.jpg', caption: 'Carga asegurada y lista' },
  // Contenedores y embarque
  { src: '/fotos/contenedor-pil.jpg', caption: 'Contenedor PIL con carga' },
  { src: '/fotos/contenedor-interior-carga.jpg', caption: 'Interior de contenedor con carga' },
  { src: '/fotos/contenedor-red-carga.jpg', caption: 'Carga asegurada con red' },
  { src: '/fotos/contenedor-especificaciones.jpg', caption: 'Contenedor con especificaciones' },
  { src: '/fotos/carga-contenedor-exterior.jpg', caption: 'Carga de contenedor al exterior' },
  { src: '/fotos/contenedor-organizado.jpg', caption: 'Contenedor organizado' },
  // Transporte terrestre
  { src: '/fotos/camion-contenedor.jpg', caption: 'Camión con contenedor cargado' },
  { src: '/fotos/camion-trasera.jpg', caption: 'Vista trasera de carga en camión' },
  { src: '/fotos/camion-amarillo.jpg', caption: 'Camión de transporte de carga' },
  { src: '/fotos/camiones-bodega.jpg', caption: 'Camiones en bodega' },
  { src: '/fotos/camion-cajas-madera.jpg', caption: 'Transporte de cajas de madera' },
  { src: '/fotos/operador-camion.jpg', caption: 'Operador de transporte' },
  // Almacén y carga
  { src: '/fotos/cajas-almacen.jpg', caption: 'Cajas en almacén' },
  { src: '/fotos/cajas-apiladas.jpg', caption: 'Cajas apiladas en bodega' },
  { src: '/fotos/bodega-cajas.jpg', caption: 'Bodega con mercancía' },
  { src: '/fotos/ibc-contenedores.jpg', caption: 'Contenedores IBC para líquidos' },
  { src: '/fotos/ibc-detalle.jpg', caption: 'Detalle de contenedores IBC' },
  { src: '/fotos/paquete-bodega.jpg', caption: 'Paquete grande en bodega' },
  { src: '/fotos/carga-envuelta.jpg', caption: 'Carga envuelta y protegida' },
  { src: '/fotos/pallets-bodega.jpg', caption: 'Pallets en bodega' },
  { src: '/fotos/envio-grande.jpg', caption: 'Envío de gran tamaño' },
  // Equipo de trabajo
  { src: '/fotos/equipo-trabajo.jpg', caption: 'Equipo de trabajo EVS' },
  { src: '/fotos/equipo-embalaje.jpg', caption: 'Equipo en embalaje de carga' },
  { src: '/fotos/equipo-bodega.jpg', caption: 'Equipo en operaciones de bodega' },
  { src: '/fotos/equipo-camion.jpg', caption: 'Equipo en carga de camión' }
]

const PhotoCarousel = () => {
  const isMobile = useIsMobile()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrent(p => (p + 1) % photos.length), 5000)
    return () => clearInterval(timer)
  }, [])

  const prev = () => setCurrent(p => (p - 1 + photos.length) % photos.length)
  const next = () => setCurrent(p => (p + 1) % photos.length)

  const btnStyle = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    width: isMobile ? '36px' : '48px', height: isMobile ? '36px' : '48px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.9)', border: 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', zIndex: 5, color: '#1a365d', fontSize: isMobile ? '14px' : '18px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transition: 'all 0.2s'
  }

  return (
    <section style={{ padding: isMobile ? '80px 16px 40px' : '100px 24px 60px', background: 'transparent', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', color: '#63b3ed', display: 'block', marginBottom: '12px' }}>GALERÍA</span>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#fff', lineHeight: 1.15 }}>
              Nuestro <span style={{ color: '#63b3ed' }}>Trabajo</span>
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.5)', maxWidth: '500px', margin: '12px auto 0', lineHeight: 1.6 }}>
              Conoce de cerca nuestras operaciones logísticas.
            </p>
          </div>
        </ScrollReveal>

        {/* Main carousel */}
        <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', aspectRatio: '16/9', background: '#1a365d', marginBottom: '16px' }}>
          <AnimatePresence mode="wait">
            <motion.img
              key={current}
              src={photos[current].src}
              alt={photos[current].caption}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                width: '100%', height: '100%',
                objectFit: 'contain',
                position: 'absolute', inset: 0,
                background: '#0a1628'
              }}
            />
          </AnimatePresence>
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: isMobile ? '40px 16px 14px' : '50px 24px 20px',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', zIndex: 4
          }}>
            <p style={{ color: '#fff', fontSize: isMobile ? '14px' : '17px', fontWeight: 600 }}>{photos[current].caption}</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '4px' }}>{current + 1} / {photos.length}</p>
          </div>
          <button onClick={prev} style={{ ...btnStyle, left: isMobile ? '8px' : '16px' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}>
            <FaChevronLeft />
          </button>
          <button onClick={next} style={{ ...btnStyle, right: isMobile ? '8px' : '16px' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}>
            <FaChevronRight />
          </button>
        </div>

        {/* Thumbnails - show 5 centered around current */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {(() => {
            const total = photos.length
            const visible = 5
            const half = Math.floor(visible / 2)
            const indices = []
            for (let offset = -half; offset <= half; offset++) {
              indices.push((current + offset + total) % total)
            }
            return indices.map((i) => (
              <button key={`thumb-${i}`} onClick={() => setCurrent(i)}
                style={{
                  width: isMobile ? '56px' : '100px', height: isMobile ? '40px' : '70px', borderRadius: isMobile ? '6px' : '8px', overflow: 'hidden',
                  border: current === i ? '2px solid #3182ce' : '2px solid transparent',
                  cursor: 'pointer', padding: 0, opacity: current === i ? 1 : 0.5,
                  transition: 'all 0.3s', background: '#0a1628',
                  transform: current === i ? 'scale(1.1)' : 'scale(1)'
                }}>
                <img src={photos[i].src} alt={photos[i].caption}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))
          })()}
        </div>
      </div>
    </section>
  )
}

export default PhotoCarousel
