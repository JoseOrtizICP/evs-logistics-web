import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaShip, FaPlane, FaFileContract, FaShoppingCart, FaTruck, FaBoxes, FaArrowLeft, FaCheckCircle } from 'react-icons/fa'
import ScrollReveal from './ScrollReveal'
import useIsMobile from '../hooks/useIsMobile'

const services = [
  {
    icon: FaShip, title: 'Forwarding', tag: 'Marítimo & Aéreo',
    description: 'Coordinación integral de envíos internacionales por vía marítima y aérea, con cobertura global.',
    image: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&h=600&fit=crop&q=90',
    fullDescription: 'Servicio completo de forwarding internacional que conecta tus operaciones en cualquier parte del mundo. Gestionamos carga completa (FCL), consolidada (LCL) y envíos aéreos urgentes.',
    features: ['Carga FCL y LCL', 'Envíos aéreos express y consolidados', 'Coordinación puerta a puerta', 'Seguimiento en tiempo real', 'Documentación completa', 'Cobertura en 5 países'],
    stats: [{ value: '12+', label: 'Puertos' }, { value: '8+', label: 'Aeropuertos' }, { value: '5', label: 'Países' }]
  },
  {
    icon: FaFileContract, title: 'Gestión Aduanal', tag: 'Despacho Aduanero',
    description: 'Manejo integral de trámites aduanales, clasificación arancelaria y cumplimiento normativo.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
    fullDescription: 'Nuestro equipo de especialistas aduanales gestiona todos los procesos de importación y exportación, asegurando el cumplimiento normativo y la optimización de costos arancelarios.',
    features: ['Clasificación arancelaria', 'Despacho de importación y exportación', 'Permisos y regulaciones', 'Cumplimiento normativo', 'Optimización arancelaria', 'Auditoría aduanera'],
    stats: [{ value: '100%', label: 'Cumplimiento' }, { value: '10+', label: 'Años exp.' }]
  },
  {
    icon: FaShoppingCart, title: 'Agente de Compras', tag: 'Sourcing & Trading',
    description: 'Negociamos los mejores términos comerciales, desarrollo de productos y gestión integral.',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&h=400&fit=crop',
    fullDescription: 'Actuamos como tu representante de compras en origen, negociando directamente con proveedores para obtener los mejores precios, calidad y condiciones comerciales.',
    features: ['Negociación con proveedores', 'Desarrollo de productos', 'Control de calidad', 'Marca propia', 'Gestión de crédito', 'Asesoría comercial'],
    stats: [{ value: '50+', label: 'Proveedores' }, { value: '15%', label: 'Ahorro prom.' }, { value: '100+', label: 'Productos' }]
  },
  {
    icon: FaPlane, title: 'Revisión en Origen', tag: 'Quality Control',
    description: 'Inspección y verificación de mercancía directamente en el punto de origen antes del embarque.',
    image: 'https://plus.unsplash.com/premium_photo-1675272834099-62a5d6dbf2f6?w=600&h=400&fit=crop',
    fullDescription: 'Realizamos inspecciones exhaustivas de tu mercancía en el punto de origen para garantizar que cumple con las especificaciones de calidad, cantidad y empaque antes del embarque.',
    features: ['Inspección pre-embarque', 'Verificación de calidad', 'Control de cantidades', 'Revisión de empaque', 'Documentación fotográfica', 'Reportes detallados'],
    stats: [{ value: '99%', label: 'Precisión' }, { value: '48h', label: 'Reporte' }, { value: '0%', label: 'Rechazos' }]
  },
  {
    icon: FaTruck, title: 'Transporte Terrestre', tag: 'Nacional e Internacional',
    description: 'Soluciones de transporte terrestre con flota diversificada para todo tipo de carga.',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=600&h=400&fit=crop',
    fullDescription: 'Contamos con una red de transporte terrestre que cubre las principales rutas nacionales e internacionales, con unidades de diferentes capacidades para adaptarnos a tus necesidades.',
    features: ['Carga completa y parcial', 'Flota diversificada', 'Cobertura nacional', 'Rastreo GPS en tiempo real', 'Seguro de carga incluido', 'Entregas programadas'],
    stats: [{ value: '500+', label: 'Rutas' }, { value: '24/7', label: 'Monitoreo' }, { value: '98%', label: 'On-time' }]
  },
  {
    icon: FaBoxes, title: '3PL', tag: 'Third Party Logistics',
    description: 'Soluciones integrales de logística tercerizada: almacenaje, distribución y fulfillment.',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop',
    fullDescription: 'Ofrecemos servicios completos de tercerización logística que incluyen almacenamiento, gestión de inventarios, preparación de pedidos, distribución y última milla.',
    features: ['Almacenamiento estratégico', 'Gestión de inventarios', 'Preparación de pedidos', 'Cross-docking', 'Distribución y última milla', 'Reportes e indicadores'],
    stats: [{ value: '5,000', label: 'm² almacén' }, { value: '99.5%', label: 'Precisión' }, { value: '< 4h', label: 'Despacho' }]
  }
]

const ServiceCard = ({ service, index, onClick }) => {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        position: 'relative', borderRadius: '16px', overflow: 'hidden',
        cursor: 'pointer', height: '320px',
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 40px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      {/* Background image reveal on hover */}
      {service.splitImage ? (
        <>
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '50%', height: '100%',
            backgroundImage: `url(${service.imageLeft})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            clipPath: hovered ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
            zIndex: 1
          }} />
          <div style={{
            position: 'absolute', top: 0, right: 0, width: '50%', height: '100%',
            backgroundImage: `url(${service.imageRight})`,
            backgroundSize: '280%', backgroundPosition: '55% 65%',
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            clipPath: hovered ? 'inset(0 0 0 0)' : 'inset(0 0 0 100%)',
            zIndex: 1
          }} />
          {hovered && <div style={{
            position: 'absolute', top: 0, left: '50%', width: '2px', height: '100%',
            background: 'rgba(255,255,255,0.5)', zIndex: 3, transform: 'translateX(-50%)'
          }} />}
        </>
      ) : (
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${service.image})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          clipPath: hovered ? 'circle(150% at 50% 50%)' : 'circle(0% at 50% 30%)',
          zIndex: 1
        }} />
      )}
      <div style={{
        position: 'absolute', inset: 0,
        background: hovered ? 'linear-gradient(180deg, rgba(10,22,40,0.3) 0%, rgba(10,22,40,0.85) 100%)' : 'transparent',
        transition: 'all 0.4s', zIndex: 2
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 3, padding: '28px',
        height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
      }}>
        <div>
          <div style={{
            width: '48px', height: '48px', borderRadius: '12px',
            background: hovered ? 'rgba(255,255,255,0.15)' : 'rgba(99,179,237,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '16px', transition: 'all 0.3s'
          }}>
            <service.icon style={{
              fontSize: '22px',
              color: hovered ? '#fff' : '#63b3ed',
              transition: 'color 0.3s'
            }} />
          </div>
          <h3 style={{
            fontSize: '20px', fontWeight: 700, margin: '0 0 6px',
            color: '#fff', transition: 'color 0.3s'
          }}>{service.title}</h3>
          <span style={{
            fontSize: '12px', fontWeight: 600, letterSpacing: '1px',
            color: '#63b3ed', textTransform: 'uppercase',
            transition: 'color 0.3s'
          }}>{service.tag}</span>
        </div>
        <div>
          <p style={{
            fontSize: '14px', lineHeight: 1.6, margin: '0 0 16px',
            color: hovered ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.5)',
            transition: 'color 0.3s'
          }}>{service.description}</p>
          <span style={{
            fontSize: '13px', fontWeight: 600,
            color: '#63b3ed',
            transition: 'color 0.3s'
          }}>Ver más →</span>
        </div>
      </div>
    </motion.div>
  )
}

const ServicePage = ({ service, onBack, isMobile }) => (
  <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.4 }}
    style={{ minHeight: '100vh', padding: isMobile ? '80px 16px 40px' : '100px 24px 60px', background: 'transparent' }}>
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <button onClick={onBack} style={{
        display: 'flex', alignItems: 'center', gap: '8px', background: 'none',
        border: 'none', color: '#63b3ed', fontSize: '14px', fontWeight: 500,
        cursor: 'pointer', marginBottom: isMobile ? '24px' : '40px', padding: 0
      }}>
        <FaArrowLeft /> Volver a servicios
      </button>

      {/* Hero image */}
      <div style={{
        width: '100%', height: isMobile ? '180px' : '280px', borderRadius: '16px', overflow: 'hidden', marginBottom: isMobile ? '24px' : '40px',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: service.splitImage
            ? 'url(https://images.unsplash.com/photo-1605745341112-85968b19335b?w=1400&h=700&fit=crop&q=90)'
            : `url(${service.image})`,
          backgroundSize: 'cover', backgroundPosition: 'center'
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 60%, rgba(10,22,40,0.5) 100%)', zIndex: 2 }} />
        <div style={{ position: 'absolute', bottom: '24px', left: '24px', zIndex: 3 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px',
            background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
            borderRadius: '8px', marginBottom: '8px'
          }}>
            <service.icon style={{ color: '#63b3ed', fontSize: '16px' }} />
            <span style={{ color: '#fff', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>{service.tag}</span>
          </div>
        </div>
      </div>

      <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
        {service.title}
      </h1>
      <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: '40px', maxWidth: '700px' }}>
        {service.fullDescription}
      </p>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '40px', flexWrap: 'wrap' }}>
        {service.stats.map((s, i) => (
          <div key={i} style={{
            padding: isMobile ? '14px 18px' : '20px 30px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', minWidth: isMobile ? '80px' : '120px'
          }}>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#63b3ed' }}>{s.value}</div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <h2 style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>
        Capacidades
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(250px, 1fr))', gap: '12px' }}>
        {service.features.map((f, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px',
            borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <FaCheckCircle style={{ color: '#48bb78', fontSize: '16px', flexShrink: 0 }} />
            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
)

const ServicesV1 = () => {
  const isMobile = useIsMobile()
  const [selectedService, setSelectedService] = useState(null)

  if (selectedService !== null) {
    return (
      <AnimatePresence mode="wait">
        <ServicePage key={selectedService} service={services[selectedService]} onBack={() => setSelectedService(null)} isMobile={isMobile} />
      </AnimatePresence>
    )
  }

  return (
    <section style={{ minHeight: '100vh', padding: isMobile ? '80px 16px 40px' : '100px 24px 60px', background: 'transparent' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <ScrollReveal>
          <p style={{ textAlign: 'center', fontSize: '12px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: '#63b3ed', marginBottom: '12px' }}>Servicios</p>
          <h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, color: '#fff', marginBottom: '16px' }}>
            Soluciones <span style={{ color: '#63b3ed' }}>Completas</span> de Logística
          </h2>
          <p style={{ textAlign: 'center', fontSize: '16px', color: 'rgba(255,255,255,0.5)', maxWidth: '600px', margin: '0 auto 50px', lineHeight: 1.7 }}>
            Ofrecemos una gama integral de servicios diseñados para simplificar y optimizar tus operaciones logísticas.
          </p>
        </ScrollReveal>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {services.map((service, i) => (
            <ServiceCard key={i} service={service} index={i} onClick={() => setSelectedService(i)} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesV1
