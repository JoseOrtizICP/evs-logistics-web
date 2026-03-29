import ScrollReveal from './ScrollReveal'
import { FaTruck, FaRoute, FaShieldAlt, FaClock } from 'react-icons/fa'

const trucks = [
  { name: 'Kenworth', type: 'Tráiler / Full', capacity: 'Hasta 30 toneladas', description: 'Unidades de carga completa para grandes volúmenes. Ideales para transporte de larga distancia y carga pesada.', icon: '🚛' },
  { name: 'Tortón', type: 'Camión de 6 ejes', capacity: 'Hasta 15 toneladas', description: 'Versatilidad para cargas medianas. Acceso a zonas urbanas e industriales con capacidad intermedia.', icon: '🚚' },
  { name: 'Rabón', type: 'Camión de 3 ejes', capacity: 'Hasta 8 toneladas', description: 'Distribución urbana y entregas de última milla. Maniobrable y eficiente para cargas menores.', icon: '📦' }
]

const features = [
  { icon: FaRoute, label: 'Cobertura Nacional' },
  { icon: FaShieldAlt, label: 'Carga Asegurada' },
  { icon: FaClock, label: 'Rastreo en Tiempo Real' },
  { icon: FaTruck, label: 'Flota Propia' }
]

const Fleet = () => (
  <section style={{ padding: '100px 24px 60px', background: '#fff', minHeight: '100vh' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <ScrollReveal>
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#3182ce', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px', textAlign: 'center' }}>Transporte Terrestre</p>
        <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#1a365d', lineHeight: 1.15, marginBottom: '16px', textAlign: 'center', letterSpacing: '-0.5px' }}>
          Flota de <span style={{ color: '#3182ce' }}>Transporte</span> Nacional
        </h2>
        <p style={{ fontSize: '17px', color: '#718096', textAlign: 'center', maxWidth: '600px', margin: '0 auto 60px', lineHeight: 1.7 }}>
          Contamos con unidades propias para la distribución de mercancía en todo el territorio mexicano.
        </p>
      </ScrollReveal>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '28px', marginBottom: '60px' }}>
        {trucks.map((truck, i) => (
          <ScrollReveal key={truck.name} delay={i * 0.12}>
            <div style={{ background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)', borderRadius: '20px', padding: '40px 32px', border: '1px solid #e2e8f0', textAlign: 'center', transition: 'all 0.3s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.08)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
              <span style={{ fontSize: '56px', marginBottom: '20px', display: 'block' }}>{truck.icon}</span>
              <h3 style={{ fontSize: '24px', fontWeight: 700, color: '#1a365d', marginBottom: '4px' }}>{truck.name}</h3>
              <p style={{ fontSize: '14px', color: '#3182ce', fontWeight: 500, marginBottom: '4px' }}>{truck.type}</p>
              <p style={{ fontSize: '13px', color: '#a0aec0', fontWeight: 500, marginBottom: '16px' }}>{truck.capacity}</p>
              <p style={{ fontSize: '14px', color: '#718096', lineHeight: 1.7 }}>{truck.description}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
      <ScrollReveal>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
          {features.map((f, i) => (
            <ScrollReveal key={f.label} delay={i * 0.1} style={{ display: 'inline-block' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 24px', background: '#1a365d', borderRadius: '12px', color: '#fff', fontSize: '14px', fontWeight: 500 }}>
                <f.icon /> {f.label}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </ScrollReveal>
    </div>
  </section>
)

export default Fleet
