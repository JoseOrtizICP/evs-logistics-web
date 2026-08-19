import { useState } from 'react'
import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaWhatsapp, FaWarehouse, FaFacebookF, FaInstagram, FaLinkedinIn, FaPaperPlane } from 'react-icons/fa'
import useIsMobile from '../hooks/useIsMobile'
import { T } from '../tema'

const inputStyle = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '10px',
  border: `1px solid ${T.bordeFuerte}`,
  fontSize: '15px',
  fontFamily: 'inherit',
  background: T.superficie,
  color: T.texto,
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box'
}

const labelStyle = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: T.suave,
  marginBottom: '6px'
}

// Endpoint del formulario (Formspree). Reemplaza TU_FORM_ID por el id real de tu
// formulario de Formspree apuntando a Fernanda.Rios@evslogist.com.
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xkoloaaz'

const Contact = () => {
  const isMobile = useIsMobile()
  const [form, setForm] = useState({ nombre: '', empresa: '', email: '', telefono: '', servicio: '', mensaje: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...form, _subject: `Nueva cotización de ${form.nombre || 'sitio web'}` })
      })
      if (res.ok) {
        setStatus('success')
        setForm({ nombre: '', empresa: '', email: '', telefono: '', servicio: '', mensaje: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section style={{ padding: isMobile ? '80px 16px 40px' : '100px 24px 60px', background: 'transparent', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <ScrollReveal>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', color: T.acento, display: 'block', marginBottom: '12px' }}>CONTACTO</span>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: T.texto, lineHeight: 1.15 }}>
              Hablemos de tu <span style={{ color: T.acento }}>próximo envío</span>
            </h2>
            <p style={{ fontSize: '16px', color: T.suave, maxWidth: '500px', margin: '12px auto 0', lineHeight: 1.6 }}>
              Solicita una cotización o contáctanos para resolver cualquier duda.
            </p>
          </div>
        </ScrollReveal>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '30px' : '50px', alignItems: 'start' }}>
          {/* Formulario */}
          <ScrollReveal>
            {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              style={{
                padding: isMobile ? '40px 24px' : '60px 40px', borderRadius: '20px',
                background: T.superficie, border: '1px solid rgba(43,108,176,0.4)',
                boxShadow: T.sombra, textAlign: 'center'
              }}>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
                style={{
                  width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 24px',
                  background: 'linear-gradient(135deg, #2b6cb0, #1a365d)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '38px', color: '#fff', fontWeight: 700,
                  boxShadow: '0 8px 24px rgba(43,108,176,0.5)'
                }}>✓</motion.div>
              <motion.h3
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.6 }}
                style={{ fontSize: '24px', fontWeight: 700, color: T.texto, marginBottom: '12px' }}>
                ¡Gracias!
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.6 }}
                style={{ fontSize: '16px', color: T.suave, lineHeight: 1.7, maxWidth: '360px', margin: '0 auto' }}>
                Un ejecutivo se comunicará contigo a la brevedad.
              </motion.p>
            </motion.div>
            ) : (
            <form onSubmit={handleSubmit} style={{
              padding: isMobile ? '20px' : '36px', borderRadius: '20px',
              background: T.superficie, border: `1px solid ${T.borde}`,
              boxShadow: T.sombra
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: T.texto, marginBottom: '24px' }}>
                Solicitar Cotización
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Nombre *</label>
                  <input name="nombre" value={form.nombre} onChange={handleChange} required
                    placeholder="Tu nombre" style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#3182ce'; e.target.style.boxShadow = '0 0 0 3px rgba(49,130,206,0.1)' }}
                    onBlur={e => { e.target.style.borderColor = T.bordeFuerte; e.target.style.boxShadow = 'none' }} />
                </div>
                <div>
                  <label style={labelStyle}>Empresa</label>
                  <input name="empresa" value={form.empresa} onChange={handleChange}
                    placeholder="Nombre de empresa" style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#3182ce'; e.target.style.boxShadow = '0 0 0 3px rgba(49,130,206,0.1)' }}
                    onBlur={e => { e.target.style.borderColor = T.bordeFuerte; e.target.style.boxShadow = 'none' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required
                    placeholder="correo@ejemplo.com" style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#3182ce'; e.target.style.boxShadow = '0 0 0 3px rgba(49,130,206,0.1)' }}
                    onBlur={e => { e.target.style.borderColor = T.bordeFuerte; e.target.style.boxShadow = 'none' }} />
                </div>
                <div>
                  <label style={labelStyle}>Teléfono</label>
                  <input name="telefono" value={form.telefono} onChange={handleChange}
                    placeholder="+52 (55) ..." style={inputStyle}
                    onFocus={e => { e.target.style.borderColor = '#3182ce'; e.target.style.boxShadow = '0 0 0 3px rgba(49,130,206,0.1)' }}
                    onBlur={e => { e.target.style.borderColor = T.bordeFuerte; e.target.style.boxShadow = 'none' }} />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>Servicio de interés</label>
                <select name="servicio" value={form.servicio} onChange={handleChange}
                  style={{ ...inputStyle, cursor: 'pointer', appearance: 'auto' }}
                  onFocus={e => { e.target.style.borderColor = '#3182ce'; e.target.style.boxShadow = '0 0 0 3px rgba(49,130,206,0.1)' }}
                  onBlur={e => { e.target.style.borderColor = T.bordeFuerte; e.target.style.boxShadow = 'none' }}>
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
                  onBlur={e => { e.target.style.borderColor = T.bordeFuerte; e.target.style.boxShadow = 'none' }} />
              </div>

              <button type="submit" disabled={status === 'sending'} style={{
                width: '100%', padding: '16px', borderRadius: '12px',
                background: status === 'success' ? '#48bb78' : status === 'error' ? '#e53e3e' : '#3182ce',
                color: '#fff', border: 'none', fontSize: '16px', fontWeight: 600,
                cursor: status === 'sending' ? 'wait' : 'pointer', transition: 'all 0.3s',
                opacity: status === 'sending' ? 0.8 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                boxShadow: '0 4px 16px rgba(49,130,206,0.3)'
              }}
                onMouseEnter={e => { if (status === 'idle') e.currentTarget.style.background = '#2b6cb0' }}
                onMouseLeave={e => { if (status === 'idle') e.currentTarget.style.background = '#3182ce' }}>
                {status === 'sending' ? (
                  <>Enviando...</>
                ) : status === 'success' ? (
                  <>✓ Enviado correctamente</>
                ) : status === 'error' ? (
                  <>✕ Error al enviar, intenta de nuevo</>
                ) : (
                  <><FaPaperPlane style={{ fontSize: '14px' }} /> Solicitar Cotización</>
                )}
              </button>
            </form>
            )}
          </ScrollReveal>

          {/* Info de contacto */}
          <ScrollReveal delay={0.2}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, color: T.texto, marginBottom: '24px' }}>
                Información de Contacto
              </h3>

              {[
                { icon: FaEnvelope, label: 'Email', value: 'Fernanda.Rios@evslogist.com', href: 'mailto:Fernanda.Rios@evslogist.com' },
                { icon: FaPhone, label: 'Teléfono fijo', value: '+52 (55) 5576-4581', href: 'tel:+525555764581' },
                { icon: FaWhatsapp, label: 'WhatsApp', value: 'Mensaje directo', href: '#' }
              ].map((item, i) => (
                <a key={i} href={item.href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '16px',
                    padding: '18px 20px', borderRadius: '14px',
                    border: `1px solid ${T.borde}`, marginBottom: '12px',
                    transition: 'all 0.3s', cursor: 'pointer'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,179,237,0.3)'; e.currentTarget.style.transform = 'translateX(4px)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = T.borde; e.currentTarget.style.transform = 'translateX(0)' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px',
                      background: 'rgba(99,179,237,0.1)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <item.icon style={{ fontSize: '18px', color: '#3182ce' }} />
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', color: T.suave, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>{item.label}</p>
                      <p style={{ fontSize: '15px', fontWeight: 600, color: T.texto }}>{item.value}</p>
                    </div>
                  </div>
                </a>
              ))}

            </div>
          </ScrollReveal>
        </div>
      </div>

    </section>
  )
}

export default Contact
