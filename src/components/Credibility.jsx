import { motion } from 'framer-motion'
import { FaGlobeAmericas, FaShip, FaPlane, FaIndustry, FaUsers, FaClock } from 'react-icons/fa'

const kpis = [
  { value: '15+', label: 'Años de experiencia', icon: FaClock },
  { value: '5', label: 'Países de operación', icon: FaGlobeAmericas },
  { value: '12+', label: 'Puertos conectados', icon: FaShip },
  { value: '8+', label: 'Aeropuertos', icon: FaPlane },
  { value: '50+', label: 'Clientes activos', icon: FaUsers },
  { value: '<2hrs', label: 'Tiempo de respuesta', icon: FaClock }
]

const countries = [
  { name: 'México', flag: '🇲🇽', role: 'HQ & Hub principal' },
  { name: 'China', flag: '🇨🇳', role: 'Sourcing & manufactura' },
  { name: 'Colombia', flag: '🇨🇴', role: 'Comercio regional' },
  { name: 'Ecuador', flag: '🇪🇨', role: 'Mercado andino' },
  { name: 'Rep. Dominicana', flag: '🇩🇴', role: 'Caribe & Centroamérica' }
]

const industries = ['Automotriz', 'Retail', 'Manufactura', 'Farmacéutica', 'Tecnología', 'Alimentos', 'Construcción', 'Textil']

const Credibility = () => (
  <section id="credibilidad" style={{
    padding: '100px 24px',
    background: '#0a1628',
    position: 'relative',
    overflow: 'hidden'
  }}>
    {/* Dot grid */}
    <div style={{
      position: 'absolute', inset: 0,
      backgroundImage: 'radial-gradient(rgba(99,179,237,0.06) 1px, transparent 1px)',
      backgroundSize: '40px 40px'
    }} />

    <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: '60px' }}
      >
        <span style={{
          fontSize: '12px', fontWeight: 600, letterSpacing: '4px',
          textTransform: 'uppercase', color: 'rgba(99,179,237,0.6)', display: 'block', marginBottom: '12px'
        }}>
          POR QUÉ ELEGIRNOS
        </span>
        <h2 style={{
          fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800,
          color: '#fff', lineHeight: 1.1, letterSpacing: '-1px'
        }}>
          Números que <span style={{ color: '#63b3ed' }}>respaldan.</span>
        </h2>
      </motion.div>

      {/* KPIs grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '16px',
        marginBottom: '60px'
      }}>
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            style={{
              padding: '24px 20px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '12px',
              textAlign: 'center'
            }}
          >
            <kpi.icon style={{ fontSize: '16px', color: '#63b3ed', marginBottom: '8px' }} />
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{kpi.value}</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>{kpi.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Countries + Industries */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px'
      }}>
        {/* Countries */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
            Cobertura Global
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {countries.map(c => (
              <div key={c.name} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}>
                  {c.flag} {c.name}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px' }}>
                  {c.role}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Industries */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#fff', marginBottom: '16px' }}>
            Industrias
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {industries.map(ind => (
              <span key={ind} style={{
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '13px',
                fontWeight: 500
              }}>
                {ind}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>

    <style>{`
      @media (max-width: 768px) {
        #credibilidad > div:nth-child(2) > div:last-child { grid-template-columns: 1fr !important; }
      }
    `}</style>
  </section>
)

export default Credibility
