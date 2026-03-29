import { motion } from 'framer-motion'
import { FaFileContract, FaShoppingCart, FaSearch, FaClipboardCheck } from 'react-icons/fa'

const services = [
  {
    icon: FaFileContract,
    title: 'Gestión Aduanal',
    desc: 'Clasificación arancelaria, permisos, documentación y cumplimiento normativo para importaciones y exportaciones.',
    tag: 'Despacho Aduanero'
  },
  {
    icon: FaShoppingCart,
    title: 'Agente de Compras',
    desc: 'Sourcing internacional, negociación comercial, desarrollo de productos y gestión de marca propia.',
    tag: 'Sourcing & Trading'
  },
  {
    icon: FaSearch,
    title: 'Consultoría Logística',
    desc: 'Análisis de cadenas de suministro, optimización de costos y diseño de rutas eficientes.',
    tag: 'Optimización'
  },
  {
    icon: FaClipboardCheck,
    title: 'Seguros de Carga',
    desc: 'Protección integral para tu mercancía en cualquier modo de transporte, puerta a puerta.',
    tag: 'Protección'
  }
]

const ServicesV2 = () => (
  <section id="servicios" style={{
    padding: '100px 24px',
    background: '#fff',
    position: 'relative'
  }}>
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '60px',
        alignItems: 'start'
      }}>
        {/* Left: sticky header */}
        <div style={{ position: 'sticky', top: '100px' }}>
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '4px',
              textTransform: 'uppercase',
              color: '#3182ce',
              display: 'block',
              marginBottom: '12px'
            }}
          >
            SERVICIOS
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 800,
              color: '#1a202c',
              lineHeight: 1.1,
              letterSpacing: '-1px',
              marginBottom: '16px'
            }}
          >
            Más allá del
            <br />
            <span style={{ color: '#3182ce' }}>transporte.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            style={{
              fontSize: '16px',
              color: 'rgba(0,0,0,0.5)',
              lineHeight: 1.7,
              maxWidth: '380px'
            }}
          >
            Servicios complementarios que completan tu cadena logística
            de principio a fin.
          </motion.p>
        </div>

        {/* Right: service cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {services.map((svc, i) => (
            <motion.div
              key={svc.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              style={{
                padding: '28px',
                borderRadius: '14px',
                border: '1px solid rgba(0,0,0,0.06)',
                background: '#fafbfc',
                transition: 'all 0.3s ease',
                cursor: 'default'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(49,130,206,0.2)'
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(49,130,206,0.08)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'start', gap: '16px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: 'rgba(49,130,206,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <svc.icon style={{ fontSize: '16px', color: '#3182ce' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1a202c' }}>{svc.title}</h3>
                    <span style={{
                      fontSize: '11px',
                      color: '#3182ce',
                      background: 'rgba(49,130,206,0.06)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontWeight: 500
                    }}>
                      {svc.tag}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: 'rgba(0,0,0,0.5)', lineHeight: 1.6 }}>{svc.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>

    <style>{`
      @media (max-width: 768px) {
        #servicios > div > div { grid-template-columns: 1fr !important; }
        #servicios > div > div > div:first-child { position: static !important; }
      }
    `}</style>
  </section>
)

export default ServicesV2
