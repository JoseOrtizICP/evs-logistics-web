import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'

const locations = [
  { name: 'México', country: 'MX', x: '22%', y: '42%', flag: '🇲🇽' },
  { name: 'Colombia', country: 'CO', x: '27%', y: '58%', flag: '🇨🇴' },
  { name: 'Ecuador', country: 'EC', x: '24%', y: '62%', flag: '🇪🇨' },
  { name: 'Rep. Dominicana', country: 'DO', x: '30%', y: '44%', flag: '🇩🇴' },
  { name: 'China', country: 'CN', x: '78%', y: '38%', flag: '🇨🇳' }
]

const OperationsMap = () => (
  <section style={{
    padding: '100px 24px 60px', background: '#0a1628', position: 'relative',
    overflow: 'hidden', minHeight: '100vh',
    backgroundImage: 'radial-gradient(rgba(99,179,237,0.12) 1px, transparent 1px)',
    backgroundSize: '30px 30px'
  }}>
    <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', border: '1px solid rgba(99,179,237,0.08)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
    <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', border: '1px solid rgba(99,179,237,0.08)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
    <div style={{ position: 'absolute', width: '700px', height: '700px', borderRadius: '50%', border: '1px solid rgba(99,179,237,0.08)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />

    <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
      <ScrollReveal>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#63b3ed', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center' }}>Cobertura Global</p>
        <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: '16px', textAlign: 'center', letterSpacing: '-0.5px' }}>
          Áreas de <span style={{ color: '#63b3ed' }}>Operación</span>
        </h2>
        <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.6)', textAlign: 'center', maxWidth: '600px', margin: '0 auto 60px', lineHeight: 1.7 }}>
          Conectamos a nuestros clientes con los mercados más importantes del mundo a través de nuestra red logística internacional.
        </p>
      </ScrollReveal>

      <ScrollReveal>
        <div style={{ position: 'relative', width: '100%', maxWidth: '900px', margin: '0 auto', aspectRatio: '2 / 1', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          {locations.map((loc, i) => (
            <motion.div key={loc.name}
              style={{ position: 'absolute', left: loc.x, top: loc.y, transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'default' }}
              initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.5, type: 'spring' }}>
              <motion.div
                style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#63b3ed', position: 'relative', boxShadow: '0 0 20px rgba(99,179,237,0.6)' }}
                animate={{ boxShadow: ['0 0 10px rgba(99,179,237,0.4)', '0 0 30px rgba(99,179,237,0.8)', '0 0 10px rgba(99,179,237,0.4)'] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
              <span style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: '6px 14px', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', border: '1px solid rgba(255,255,255,0.1)' }}>
                {loc.flag} {loc.name}
              </span>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', marginTop: '48px' }}>
        {locations.map((loc, i) => (
          <ScrollReveal key={loc.name} delay={i * 0.08} style={{ display: 'inline-block' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 24px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '15px', fontWeight: 500, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,179,237,0.15)'; e.currentTarget.style.borderColor = 'rgba(99,179,237,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}>
              <span style={{ fontSize: '24px' }}>{loc.flag}</span>
              {loc.name}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
)

export default OperationsMap
