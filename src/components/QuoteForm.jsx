import { motion } from 'framer-motion'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa'

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  background: '#f8fafc',
  border: '1px solid rgba(0,0,0,0.08)',
  borderRadius: '10px',
  fontSize: '14px',
  color: '#1a202c',
  outline: 'none',
  transition: 'border-color 0.2s',
  fontFamily: 'inherit'
}

const QuoteForm = () => (
  <section id="cotizar" style={{
    padding: '100px 24px',
    background: '#fff',
    position: 'relative'
  }}>
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr',
        gap: '60px',
        alignItems: 'start'
      }}>
        {/* Left: info */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span style={{
            fontSize: '12px', fontWeight: 600, letterSpacing: '4px',
            textTransform: 'uppercase', color: '#3182ce', display: 'block', marginBottom: '12px'
          }}>
            CONTACTO
          </span>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800,
            color: '#1a202c', lineHeight: 1.1, letterSpacing: '-1px', marginBottom: '16px'
          }}>
            Solicita tu
            <br />
            <span style={{ color: '#3182ce' }}>cotización.</span>
          </h2>
          <p style={{
            fontSize: '15px', color: 'rgba(0,0,0,0.5)', lineHeight: 1.7,
            marginBottom: '32px', maxWidth: '360px'
          }}>
            Cuéntanos sobre tu envío y te responderemos en menos de 2 horas
            con una propuesta personalizada.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: FaEnvelope, text: 'contacto@evslogist.com', href: 'mailto:contacto@evslogist.com' },
              { icon: FaPhone, text: '+52 (55) XXXX-XXXX', href: '#' },
              { icon: FaWhatsapp, text: 'WhatsApp Directo', href: '#' },
              { icon: FaMapMarkerAlt, text: 'Naucalpan de Juárez, Estado de México', href: '#' }
            ].map((item, i) => (
              <a key={i} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                color: 'rgba(0,0,0,0.6)', fontSize: '14px', textDecoration: 'none',
                transition: 'color 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.color = '#3182ce'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(0,0,0,0.6)'}
              >
                <item.icon style={{ fontSize: '14px', color: '#3182ce' }} />
                {item.text}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Right: form */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          style={{
            padding: '36px',
            background: '#fff',
            borderRadius: '16px',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.04)'
          }}
        >
          <form onSubmit={e => e.preventDefault()}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: '6px' }}>Nombre</label>
                <input style={inputStyle} placeholder="Tu nombre" onFocus={e => e.target.style.borderColor = '#3182ce'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: '6px' }}>Empresa</label>
                <input style={inputStyle} placeholder="Tu empresa" onFocus={e => e.target.style.borderColor = '#3182ce'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'} />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: '6px' }}>Email</label>
              <input style={inputStyle} type="email" placeholder="correo@empresa.com" onFocus={e => e.target.style.borderColor = '#3182ce'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: '6px' }}>Origen</label>
                <input style={inputStyle} placeholder="Ciudad / País" onFocus={e => e.target.style.borderColor = '#3182ce'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: '6px' }}>Destino</label>
                <input style={inputStyle} placeholder="Ciudad / País" onFocus={e => e.target.style.borderColor = '#3182ce'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'} />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: '6px' }}>Tipo de carga</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }} onFocus={e => e.target.style.borderColor = '#3182ce'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'}>
                <option value="">Seleccionar...</option>
                <option value="fcl">FCL (Contenedor Completo)</option>
                <option value="lcl">LCL (Carga Consolidada)</option>
                <option value="air">Carga Aérea</option>
                <option value="ground">Transporte Terrestre</option>
                <option value="other">Otro</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#4a5568', display: 'block', marginBottom: '6px' }}>Mensaje</label>
              <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Detalles adicionales..." onFocus={e => e.target.style.borderColor = '#3182ce'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.08)'} />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                background: '#3182ce',
                color: '#fff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#2b6cb0'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#3182ce'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Enviar Solicitud →
            </button>
          </form>
        </motion.div>
      </div>
    </div>

    <style>{`
      @media (max-width: 768px) {
        #cotizar > div > div { grid-template-columns: 1fr !important; }
      }
    `}</style>
  </section>
)

export default QuoteForm
