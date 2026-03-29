import { motion } from 'framer-motion'
import { FaGlobeAmericas, FaShip, FaPlane, FaTruck, FaClock, FaShieldAlt } from 'react-icons/fa'

const trustItems = [
  { icon: FaGlobeAmericas, text: '5 países' },
  { icon: FaShip, text: '12+ puertos' },
  { icon: FaPlane, text: '8+ aeropuertos' },
  { icon: FaClock, text: 'Respuesta < 2hrs' },
  { icon: FaShieldAlt, text: 'Carga asegurada' }
]

// Animated shipment visual - container moving through transport modes
const ShipmentVisual = () => (
  <div style={{ position: 'relative', width: '100%', maxWidth: '500px', height: '280px', margin: '0 auto' }}>
    {/* Route path */}
    <svg viewBox="0 0 500 250" style={{ width: '100%', height: '100%', position: 'absolute' }}>
      <motion.path
        d="M30,200 C100,200 120,120 180,120 C240,120 250,60 310,60 C370,60 400,140 470,140"
        stroke="rgba(99,179,237,0.3)"
        strokeWidth="2"
        fill="none"
        strokeDasharray="6 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
      />
      {/* Port dot */}
      <motion.circle cx="30" cy="200" r="6" fill="#3182ce"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 }} />
      <motion.circle cx="30" cy="200" r="12" fill="none" stroke="#3182ce" strokeWidth="1" opacity="0.4"
        animate={{ r: [12, 20, 12], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }} />
      {/* Airport dot */}
      <motion.circle cx="180" cy="120" r="6" fill="#63b3ed"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2 }} />
      <motion.circle cx="180" cy="120" r="12" fill="none" stroke="#63b3ed" strokeWidth="1" opacity="0.4"
        animate={{ r: [12, 20, 12], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
      {/* Sky node */}
      <motion.circle cx="310" cy="60" r="6" fill="#90cdf4"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.6 }} />
      {/* Destination dot */}
      <motion.circle cx="470" cy="140" r="6" fill="#48bb78"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2 }} />
      <motion.circle cx="470" cy="140" r="12" fill="none" stroke="#48bb78" strokeWidth="1" opacity="0.4"
        animate={{ r: [12, 20, 12], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }} />
    </svg>

    {/* Moving shipment dot */}
    <motion.div
      style={{
        position: 'absolute',
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 0 20px rgba(99,179,237,0.8), 0 0 40px rgba(99,179,237,0.4)',
        zIndex: 5
      }}
      animate={{
        left: ['6%', '36%', '62%', '94%'],
        top: ['80%', '48%', '24%', '56%']
      }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1 }}
    />

    {/* Labels */}
    <motion.div style={{ position: 'absolute', left: '0', bottom: '0', textAlign: 'center' }}
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
      <FaShip style={{ color: '#3182ce', fontSize: '18px' }} />
      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: '4px', letterSpacing: '1px' }}>MAR</div>
    </motion.div>

    <motion.div style={{ position: 'absolute', left: '33%', top: '28%', textAlign: 'center' }}
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}>
      <FaPlane style={{ color: '#63b3ed', fontSize: '18px' }} />
      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: '4px', letterSpacing: '1px' }}>AIRE</div>
    </motion.div>

    <motion.div style={{ position: 'absolute', right: '0', top: '42%', textAlign: 'center' }}
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8 }}>
      <FaTruck style={{ color: '#48bb78', fontSize: '18px' }} />
      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', marginTop: '4px', letterSpacing: '1px' }}>TIERRA</div>
    </motion.div>
  </div>
)

const HeroV2 = () => {
  return (
    <section id="inicio" style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      background: 'linear-gradient(165deg, #0a1628 0%, #1a365d 50%, #1e4278 100%)',
      overflow: 'hidden',
      padding: '100px 24px 60px'
    }}>
      {/* Subtle grid */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(rgba(99,179,237,0.07) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        zIndex: 1
      }} />

      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '1100px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Top: Copy + Visual */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '40px',
          alignItems: 'center',
          marginBottom: '50px'
        }}>
          {/* Left: Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span style={{
                display: 'inline-block',
                padding: '5px 14px',
                borderRadius: '6px',
                background: 'rgba(99,179,237,0.1)',
                border: '1px solid rgba(99,179,237,0.2)',
                color: '#90cdf4',
                fontSize: '12px',
                fontWeight: 500,
                letterSpacing: '1px',
                marginBottom: '20px'
              }}>
                FORWARDING INTERNACIONAL
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              style={{
                fontSize: 'clamp(32px, 5vw, 56px)',
                fontWeight: 800,
                color: '#fff',
                lineHeight: 1.08,
                letterSpacing: '-1.5px',
                marginBottom: '18px'
              }}
            >
              Movemos tu carga
              <br />
              <span style={{ color: '#63b3ed' }}>por mar, aire</span>
              <br />
              <span style={{ color: '#63b3ed' }}>y tierra.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              style={{
                fontSize: '17px',
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.7,
                maxWidth: '420px',
                marginBottom: '28px'
              }}
            >
              Soluciones logísticas integrales desde México hacia el mundo.
              Forwarding, gestión aduanal y transporte terrestre.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
            >
              <button
                onClick={() => document.getElementById('cotizar')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  padding: '14px 28px',
                  background: '#3182ce',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 20px rgba(49,130,206,0.3)'
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#2b6cb0'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#3182ce'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                Solicitar Cotización →
              </button>
              <button
                onClick={() => document.getElementById('journey')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  padding: '14px 28px',
                  background: 'rgba(255,255,255,0.06)',
                  color: 'rgba(255,255,255,0.8)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)' }}
              >
                Ver Recorrido
              </button>
            </motion.div>
          </div>

          {/* Right: Animated shipment visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <ShipmentVisual />
          </motion.div>
        </div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            flexWrap: 'wrap',
            padding: '20px 0',
            borderTop: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          {trustItems.map((item, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '13px',
              fontWeight: 500
            }}>
              <item.icon style={{ fontSize: '14px', color: 'rgba(99,179,237,0.6)' }} />
              {item.text}
            </div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #inicio > div:nth-child(2) > div:first-child {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
        }
      `}</style>
    </section>
  )
}

export default HeroV2
