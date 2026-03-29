import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaShip, FaPlane, FaTruck, FaAnchor, FaBoxes, FaRoute, FaClock, FaFileContract, FaWarehouse } from 'react-icons/fa'

const stages = [
  {
    id: 'ocean',
    icon: FaShip,
    label: 'Marítimo',
    color: '#3182ce',
    bgGradient: 'linear-gradient(135deg, #0a1628 0%, #1a365d 100%)',
    headline: 'Ocean Freight',
    subtitle: 'FCL & LCL con cobertura global',
    features: [
      { icon: FaBoxes, title: 'Carga Completa (FCL)', desc: 'Contenedores de 20\' y 40\' exclusivos para tu mercancía' },
      { icon: FaAnchor, title: 'Carga Consolidada (LCL)', desc: 'Comparte contenedor y optimiza costos en volúmenes menores' },
      { icon: FaRoute, title: 'Rutas Directas', desc: 'Conexiones principales: China-México, Colombia-México, Ecuador-México' },
      { icon: FaClock, title: 'Tracking en Tiempo Real', desc: 'Monitoreo satelital de tu carga desde origen hasta destino' }
    ]
  },
  {
    id: 'air',
    icon: FaPlane,
    label: 'Aéreo',
    color: '#63b3ed',
    bgGradient: 'linear-gradient(135deg, #1a365d 0%, #2c5282 100%)',
    headline: 'Air Freight',
    subtitle: 'Carga urgente y de alto valor',
    features: [
      { icon: FaClock, title: 'Envíos Express', desc: 'Entregas puerta a puerta en 3-5 días desde Asia' },
      { icon: FaFileContract, title: 'Documentación Completa', desc: 'Gestión de AWB, facturas y permisos de importación' },
      { icon: FaBoxes, title: 'Carga Especial', desc: 'Perecederos, farmacéutica, electrónica de alto valor' },
      { icon: FaRoute, title: 'Red de Aeropuertos', desc: 'AICM, Guadalajara, Monterrey y conexiones internacionales' }
    ]
  },
  {
    id: 'ground',
    icon: FaTruck,
    label: 'Terrestre',
    color: '#48bb78',
    bgGradient: 'linear-gradient(135deg, #1a365d 0%, #22543d 100%)',
    headline: 'Ground Transport',
    subtitle: 'Distribución nacional puerta a puerta',
    features: [
      { icon: FaTruck, title: 'Flota Completa', desc: 'Kenworth (tráiler), tortón y rabón para todo tipo de carga' },
      { icon: FaWarehouse, title: 'Cross-docking', desc: 'Consolidación y desconsolidación en puntos estratégicos' },
      { icon: FaRoute, title: 'Última Milla B2B', desc: 'Entrega directa a planta, bodega o punto de venta' },
      { icon: FaClock, title: 'Rastreo GPS', desc: 'Localización en tiempo real de cada unidad en ruta' }
    ]
  }
]

const Journey = () => {
  const [active, setActive] = useState(0)
  const stage = stages[active]

  return (
    <section id="journey" style={{
      background: '#0a1628',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Section header */}
      <div style={{
        padding: '80px 24px 0',
        textAlign: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        <motion.span
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: 'rgba(99,179,237,0.6)',
            display: 'block',
            marginBottom: '12px'
          }}
        >
          RECORRIDO DEL ENVÍO
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 800,
            color: '#fff',
            lineHeight: 1.1,
            letterSpacing: '-1px',
            marginBottom: '12px'
          }}
        >
          Tu carga, <span style={{ color: '#63b3ed' }}>tres modos</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          style={{
            fontSize: '16px',
            color: 'rgba(255,255,255,0.45)',
            maxWidth: '450px',
            margin: '0 auto',
            lineHeight: 1.6
          }}
        >
          Selecciona un modo de transporte para explorar cómo movemos tu mercancía.
        </motion.p>
      </div>

      {/* Route selector - 3 tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        padding: '36px 24px 0',
        position: 'relative',
        zIndex: 2
      }}>
        {stages.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setActive(i)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              background: active === i ? s.color : 'rgba(255,255,255,0.04)',
              border: `1px solid ${active === i ? s.color : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '10px',
              color: active === i ? '#fff' : 'rgba(255,255,255,0.5)',
              fontSize: '14px',
              fontWeight: active === i ? 600 : 500,
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={e => { if (active !== i) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}}
            onMouseLeave={e => { if (active !== i) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}}
          >
            <s.icon style={{ fontSize: '16px' }} />
            {s.label}
          </button>
        ))}
      </div>

      {/* Progress line */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '24px 24px 0',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{
          width: '300px',
          height: '3px',
          background: 'rgba(255,255,255,0.08)',
          borderRadius: '3px',
          overflow: 'hidden',
          display: 'flex'
        }}>
          {stages.map((s, i) => (
            <div
              key={s.id}
              style={{
                flex: 1,
                height: '100%',
                background: i <= active ? s.color : 'transparent',
                transition: 'background 0.4s ease'
              }}
            />
          ))}
        </div>
      </div>

      {/* Active stage content */}
      <div style={{
        padding: '48px 24px 80px',
        maxWidth: '1100px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {/* Stage headline */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h3 style={{
                fontSize: 'clamp(24px, 4vw, 36px)',
                fontWeight: 800,
                color: '#fff',
                letterSpacing: '-0.5px',
                marginBottom: '6px'
              }}>
                {stage.headline}
              </h3>
              <p style={{ fontSize: '15px', color: stage.color, fontWeight: 500 }}>
                {stage.subtitle}
              </p>
            </div>

            {/* Features grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px'
            }}>
              {stage.features.map((feat, i) => (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{
                    padding: '24px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)'
                    e.currentTarget.style.borderColor = `${stage.color}33`
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: `${stage.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px'
                  }}>
                    <feat.icon style={{ fontSize: '15px', color: stage.color }} />
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                    {feat.title}
                  </h4>
                  <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
                    {feat.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

export default Journey
