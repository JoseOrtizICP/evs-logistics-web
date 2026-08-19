import { motion } from 'framer-motion'
import { FaShip, FaPlane, FaTruck, FaGlobeAmericas } from 'react-icons/fa'
import useIsMobile from '../hooks/useIsMobile'
import { T } from '../tema'
import { PORTAL } from '../acceso'
import { FaUserCircle } from 'react-icons/fa'

const AnimatedText = ({ text, delay = 0, style }) => (
  <span style={{ display: 'inline-flex', overflow: 'hidden', ...style }}>
    {text.split('').map((char, i) => (
      <motion.span
        key={i}
        initial={{ y: '110%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        transition={{ duration: 0.5, delay: delay + i * 0.04, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: 'inline-block' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    ))}
  </span>
)

const Counter = ({ end, suffix = '', label, icon: Icon, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    style={{ textAlign: 'center' }}
  >
    <Icon style={{ fontSize: '24px', color: T.acento, marginBottom: '8px' }} />
    <motion.div
      style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: T.texto, lineHeight: 1 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay + 0.2 }}
    >
      <CountUp end={end} />{suffix}
    </motion.div>
    <div style={{ fontSize: '12px', color: T.suave, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '2px' }}>
      {label}
    </div>
  </motion.div>
)

const CountUp = ({ end }) => {
  const ref = { current: null }
  return (
    <motion.span
      initial={{ count: 0 }}
      animate={{ count: end }}
      transition={{ duration: 2, ease: 'easeOut' }}
      onUpdate={latest => {
        if (ref.current) ref.current.textContent = Math.floor(latest.count)
      }}
    >
      <span ref={el => ref.current = el}>0</span>
    </motion.span>
  )
}

const HeroV1 = ({ onNavigate }) => {
  const isMobile = useIsMobile()
  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      background: 'transparent'
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(rgba(99,179,237,0.1) 1px, transparent 1px)',
        backgroundSize: '30px 30px', zIndex: 1
      }} />
      <svg style={{ position: 'absolute', inset: 0, zIndex: 1, opacity: 0.15 }} viewBox="0 0 1400 800" preserveAspectRatio="none">
        <motion.path d="M0,400 Q350,200 700,350 T1400,300" stroke={T.acento} strokeWidth="1" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, delay: 0.5, ease: 'easeInOut' }} />
        <motion.path d="M0,500 Q400,350 800,450 T1400,400" stroke={T.acento} strokeWidth="0.5" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, delay: 1, ease: 'easeInOut' }} />
        <motion.path d="M0,300 Q300,450 650,300 T1400,500" stroke={T.acento} strokeWidth="0.5" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, delay: 1.5, ease: 'easeInOut' }} />
      </svg>
      {[0, 1, 2].map(i => (
        <motion.div key={i} style={{
          position: 'absolute', width: '4px', height: '4px', borderRadius: '50%',
          background: T.acento, boxShadow: `0 0 10px ${T.acento}`, zIndex: 2
        }}
          animate={{ x: [0, 300, 700, 1000, 1400], y: [400 + i * 50, 300 + i * 30, 350 + i * 40, 320 + i * 35, 350 + i * 50] }}
          transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'linear', delay: i * 3 }}
        />
      ))}

      <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', padding: isMobile ? '60px 16px 24px' : '80px 24px 40px', maxWidth: '1100px' }}>

        <h1 style={{
          fontSize: 'clamp(42px, 8vw, 90px)', fontWeight: 900, color: T.texto,
          lineHeight: 0.95, margin: '20px 0', letterSpacing: '-2px'
        }}>
          <AnimatedText text="EVS" delay={0.3} />
          <br />
          <AnimatedText text="LOGISTICS" delay={0.7} style={{ color: T.acento }} />
        </h1>

        <motion.p style={{
          fontSize: 'clamp(16px, 2.5vw, 22px)', color: T.suave,
          lineHeight: 1.7, maxWidth: '550px', margin: '24px auto 0', fontWeight: 300,
          letterSpacing: '1px'
        }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.2 }}>
          Conectamos tu Carga, Impulsamos tu Negocio
        </motion.p>
      </div>

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 1.6 }}
        style={{
          position: 'relative', zIndex: 3, display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: isMobile ? '20px' : '30px', padding: isMobile ? '20px' : '30px 40px', background: 'rgba(10,22,40,0.6)',
          backdropFilter: 'blur(12px)', borderRadius: '16px', border: `1px solid ${T.borde}`,
          margin: '10px 24px 40px', maxWidth: isMobile ? '340px' : '700px', width: '90%'
        }}>
        <Counter end={10} suffix="+" label="Años" icon={FaGlobeAmericas} delay={1.8} />
        <Counter end={5} suffix="" label="Países" icon={FaShip} delay={2.0} />
        <Counter end={1000} suffix="+" label="Envíos" icon={FaTruck} delay={2.2} />
        <Counter end={50} suffix="+" label="Clientes" icon={FaPlane} delay={2.4} />
      </motion.div>

      {/* Llamados a la acción */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 2.8 }}
        style={{
          position: 'relative', zIndex: 3, margin: '24px auto 40px',
          display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center'
        }}>
        <motion.button
          onClick={() => onNavigate && onNavigate('contacto')}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
          style={{
            padding: '16px 48px',
            fontSize: 'clamp(15px, 1.8vw, 18px)', fontWeight: 700,
            letterSpacing: '3px', textTransform: 'uppercase',
            color: '#fff', background: T.azul, border: 'none',
            borderRadius: '12px', cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(49,130,206,0.4)',
            transition: 'background 0.3s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = T.azulHover}
          onMouseLeave={e => e.currentTarget.style.background = T.azul}
        >
          Solicitar Cotización
        </motion.button>

        <motion.a href={PORTAL.href}
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '11px',
            padding: '16px 40px', fontSize: 'clamp(15px, 1.8vw, 18px)', fontWeight: 700,
            letterSpacing: '2px', textTransform: 'uppercase',
            color: '#fff', background: 'rgba(255,255,255,0.08)',
            border: `1.5px solid ${T.bordeFuerte}`, borderRadius: '12px',
            textDecoration: 'none', backdropFilter: 'blur(8px)', transition: 'all 0.3s'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,179,237,0.2)'; e.currentTarget.style.borderColor = T.acento }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = T.bordeFuerte }}
        >
          <FaUserCircle style={{ fontSize: '17px' }} /> {PORTAL.label}
        </motion.a>
      </motion.div>
    </section>
  )
}

export default HeroV1
