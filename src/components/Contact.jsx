import { useState } from 'react'
import ScrollReveal from './ScrollReveal'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaWhatsapp, FaWarehouse, FaFacebookF, FaInstagram, FaLinkedinIn, FaPaperPlane } from 'react-icons/fa'

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '10px',
  border: '1px solid rgba(0,0,0,0.1)',
  fontSize: '15px',
  fontFamily: 'inherit',
  background: '#f7fafc',
  color: '#1a202c',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box'
}

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: '#4a5568',
  marginBottom: '6px'
}

const Contact = () => {
  const [form, setForm] = useState({ nombre: '', empresa: '', email: '', telefono: '', servicio: '', mensaje: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <section style={{ padding: '100px 24px 60px', background: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', color: '#3182ce', display: 'block', marginBottom: '12px' }}>CONTACTO</span>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: '#1a365d', lineHeight: 1.15 }}>
              Hablemos de tu <span style={{ color: '#3182ce' }}>próximo envío</span>
            </h2>
            <p style={{ fontSize: '16px', color: '#718096', maxWidth: '500px', margin: '12px auto 0', lineHeight: 1.6 }}>
              Solicita una cotización o contáctanos para resolver cualquier duda.
            </p>
          </div>
        </ScrollReveal>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', alignItems: 'start' }} className="contact-grid">
          {/* Formulario */}
          <ScrollReveal>
            <form onSubmit={handleSubmit} style={{
              padding: '36px', borderRadius: '20px',
              background: '#fff', border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.04)'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1a365d', marginBottom: '24px' }}>
                Solicitar Cotización
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Nombre *</label>
                  <input name="nombre" value={form.nombre} onChange={handleChange} required
                    placeholder="Tu nombre" style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#3182ce'; e.target.style.boxShadow = '0 0 0 3px rgba(49,130,206,0.1)' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'none' }} />
                </div>
                <div>
                  <label style={labelStyle}>Empresa</label>
                  <input name="empresa" value={form.empresa} onChange={handleChange}
                    placeholder="Nombre de empresa" style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#3182ce'; e.target.style.boxShadow = '0 0 0 3px rgba(49,130,206,0.1)' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'none' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required
                    placeholder="correo@ejemplo.com" style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#3182ce'; e.target.style.boxShadow = '0 0 0 3px rgba(49,130,206,0.1)' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'none' }} />
                </div>
                <div>
                  <label style={labelStyle}>Teléfono</label>
                  <input name="telefono" value={form.telefono} onChange={handleChange}
                    placeholder="+52 (55) ..." style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#3182ce'; e.target.style.boxShadow = '0 0 0 3px rgba(49,130,206,0.1)' }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'none' }} />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Servicio de interés</label>
                <select name="servicio" value={form.servicio} onChange={handleChange}
                  style={{ ...inputStyle, cursor: 'pointer', appearance: 'auto' }}
                  onFocus={e => { e.target.style.borderColor = '#3182ce'; e.target.style.boxShadow = '0 0 0 3px rgba(49,130,206,0.1)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'none' }}>
                  <option value="">Selecciona un servicio</option>
                  <option value="forwarding">Forwarding (Marítimo/Aéreo)</option>
                  <option value="aduanal">Gestión Aduanal</option>
                  <option value="compras">Agente de Compras</option>
                  <option value="revision">Revisión en Origen</option>
                  <option value="terrestre">Transporte Terrestre</option>
                  <option value="3pl">3PL</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={labelStyle}>Mensaje *</label>
                <textarea name="mensaje" value={form.mensaje} onChange={handleChange} required
                  placeholder="Cuéntanos sobre tu envío: origen, destino, tipo de carga, volumen..."
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '100px' }}
                  onFocus={e => { e.target.style.borderColor = '#3182ce'; e.target.style.boxShadow = '0 0 0 3px rgba(49,130,206,0.1)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.1)'; e.target.style.boxShadow = 'none' }} />
              </div>

              <button type="submit" style={{
                width: '100%', padding: '16px', borderRadius: '12px',
                background: submitted ? '#48bb78' : '#3182ce',
                color: '#fff', border: 'none', fontSize: '16px', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.3s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 4px 16px rgba(49,130,206,0.3)'
              }}
                onMouseEnter={e => { if (!submitted) e.currentTarget.style.background = '#2b6cb0' }}
                onMouseLeave={e => { if (!submitted) e.currentTarget.style.background = '#3182ce' }}>
                {submitted ? (
                  <>✓ Enviado correctamente</>
                ) : (
                  <><FaPaperPlane style={{ fontSize: '14px' }} /> Enviar Cotización</>
                )}
              </button>
            </form>
          </ScrollReveal>

          {/* Info de contacto */}
          <ScrollReveal delay={0.2}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1a365d', marginBottom: '24px' }}>
                Información de Contacto
              </h3>

              {[
                { icon: FaEnvelope, label: 'Email', value: 'contacto@evslogist.com', href: 'mailto:contacto@evslogist.com' },
                { icon: FaPhone, label: 'Teléfono', value: '+52 (55) XXXX-XXXX', href: 'tel:+5255XXXXXXXX' },
                { icon: FaWhatsapp, label: 'WhatsApp', value: 'Mensaje directo', href: '#' }
              ].map((item, i) => (
                <a key={i} href={item.href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '18px 20px', borderRadius: '14px',
                    border: '1px solid rgba(0,0,0,0.06)', marginBottom: '12px',
                    transition: 'all 0.3s', cursor: 'pointer'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(49,130,206,0.2)'; e.currentTarget.style.transform = 'translateX(4px)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateX(0)' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px',
                      background: 'rgba(49,130,206,0.08)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <item.icon style={{ fontSize: '18px', color: '#3182ce' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: '#718096', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>{item.label}</p>
                      <p style={{ fontSize: '15px', fontWeight: 600, color: '#1a365d' }}>{item.value}</p>
                    </div>
                  </div>
                </a>
              ))}

            </div>
          </ScrollReveal>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

export default Contact
