import { motion } from 'framer-motion'
import { FaFileContract, FaWarehouse, FaShieldAlt, FaSatelliteDish } from 'react-icons/fa'

const extras = [
  {
    icon: FaFileContract,
    title: 'Customs Brokerage',
    desc: 'Documentación, compliance, clasificación arancelaria y despacho aduanero.'
  },
  {
    icon: FaWarehouse,
    title: 'Warehousing',
    desc: 'Consolidación, almacenaje estratégico y cross-docking en puntos clave.'
  },
  {
    icon: FaShieldAlt,
    title: 'Cargo Insurance',
    desc: 'Seguros puerta a puerta para todo tipo de mercancía y transporte.'
  },
  {
    icon: FaSatelliteDish,
    title: 'Live Tracking',
    desc: 'Monitoreo GPS en tiempo real de tus envíos marítimos, aéreos y terrestres.'
  }
]

const Extras = () => (
  <section id="extras" style={{
    padding: '100px 24px',
    background: '#f8fafc',
    position: 'relative'
  }}>
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginBottom: '50px' }}
      >
        <span style={{
          fontSize: '12px', fontWeight: 600, letterSpacing: '4px',
          textTransform: 'uppercase', color: '#3182ce', display: 'block', marginBottom: '12px'
        }}>
          SOLUCIONES ADICIONALES
        </span>
        <h2 style={{
          fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800,
          color: '#1a202c', lineHeight: 1.1, letterSpacing: '-1px'
        }}>
          Todo lo que tu envío <span style={{ color: '#3182ce' }}>necesita.</span>
        </h2>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px'
      }}>
        {extras.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            style={{
              padding: '32px 28px',
              background: '#fff',
              borderRadius: '14px',
              border: '1px solid rgba(0,0,0,0.05)',
              transition: 'all 0.3s',
              cursor: 'default'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-3px)'
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <div style={{
              width: '44px', height: '44px', borderRadius: '10px',
              background: 'rgba(49,130,206,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <item.icon style={{ fontSize: '18px', color: '#3182ce' }} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1a202c', marginBottom: '6px' }}>{item.title}</h3>
            <p style={{ fontSize: '14px', color: 'rgba(0,0,0,0.5)', lineHeight: 1.6 }}>{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
)

export default Extras
