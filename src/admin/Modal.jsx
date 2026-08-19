import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaTimes } from 'react-icons/fa'
import { COLORES } from './ui'

const Modal = ({ titulo, onCerrar, children, ancho = '620px' }) => {
  useEffect(() => {
    const cerrarConEscape = (e) => { if (e.key === 'Escape') onCerrar() }
    document.addEventListener('keydown', cerrarConEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', cerrarConEscape)
      document.body.style.overflow = ''
    }
  }, [onCerrar])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onCerrar}
      style={{
        position: 'fixed', inset: 0, zIndex: 1200, background: 'rgba(6,14,26,0.8)',
        backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-start',
        justifyContent: 'center', padding: '24px 16px', overflowY: 'auto'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
        transition={{ duration: 0.25 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: ancho, background: '#132741',
          border: `1px solid ${COLORES.borde}`, borderRadius: '18px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)', margin: 'auto'
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px', borderBottom: `1px solid ${COLORES.borde}`
        }}>
          <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#fff' }}>{titulo}</h2>
          <button type="button" onClick={onCerrar} aria-label="Cerrar"
            style={{ background: 'none', border: 'none', color: COLORES.textoSuave, fontSize: '18px', cursor: 'pointer', padding: '4px' }}>
            <FaTimes />
          </button>
        </div>
        <div style={{ padding: '24px' }}>{children}</div>
      </motion.div>
    </motion.div>
  )
}

export default Modal
