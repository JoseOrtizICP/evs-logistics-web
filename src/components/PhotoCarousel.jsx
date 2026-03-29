import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import ScrollReveal from './ScrollReveal'

const photos = [
  { src: '/fotos/bodega-pallets.jpg', caption: 'Bodega y almacenaje de pallets' },
  { src: '/fotos/camion-bodega.jpg', caption: 'Transporte terrestre en bodega' },
  { src: '/fotos/interior-contenedor.jpg', caption: 'Interior de contenedor' },
  { src: '/fotos/contenedor-exterior.jpg', caption: 'Contenedor listo para embarque' },
  { src: '/fotos/contenedor-carga.jpg', caption: 'Carga de contenedor' },
  { src: '/fotos/grua-carga.jpg', caption: 'Operación de grúa portuaria' },
  { src: '/fotos/carga-asegurada.jpg', caption: 'Carga asegurada y lista' }
]

const PhotoCarousel = () => {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setCurrent(p => (p + 1) % photos.length), 5000)
    return () => clearInterval(timer)
  }, [])

  const prev = () => setCurrent(p => (p - 1 + photos.length) % photos.length)
  const next = () => setCurrent(p => (p + 1) % photos.length)

  const btnStyle = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)',
    width: '48px', height: '48px', borderRadius: '50%',
    background: 'rgba(255,255,255,0.9)', border: 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', zIndex: 5, color: '#1a365d', fontSize: '18px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transition: 'all 0.2s'
  }

  return (
    <section style={{ padding: '100px 24px 60px', background: '#f7fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', color: '#3182ce', display: 'block', marginBottom: '12px' }}>GALERÍA</span>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#1a365d', lineHeight: 1.15 }}>
              Nuestro <span style={{ color: '#3182ce' }}>Trabajo</span>
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(0,0,0,0.5)', maxWidth: '500px', margin: '12px auto 0', lineHeight: 1.6 }}>
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
            padding: '50px 24px 20px',
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', zIndex: 4
          }}>
            <p style={{ color: '#fff', fontSize: '17px', fontWeight: 600 }}>{photos[current].caption}</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginTop: '4px' }}>{current + 1} / {photos.length}</p>
          </div>
          <button onClick={prev} style={{ ...btnStyle, left: '16px' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}>
            <FaChevronLeft />
          </button>
          <button onClick={next} style={{ ...btnStyle, right: '16px' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}>
            <FaChevronRight />
          </button>
        </div>

        {/* Thumbnails */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          {photos.map((photo, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              style={{
                width: '80px', height: '56px', borderRadius: '8px', overflow: 'hidden',
                border: current === i ? '2px solid #3182ce' : '2px solid transparent',
                cursor: 'pointer', padding: 0, opacity: current === i ? 1 : 0.5,
                transition: 'all 0.3s', background: '#0a1628'
              }}>
              <img src={photo.src} alt={photo.caption}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PhotoCarousel
