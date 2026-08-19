// Estilos compartidos del panel de administración.
export const COLORES = {
  fondo: '#0d1b2e',
  superficie: 'rgba(255,255,255,0.05)',
  borde: 'rgba(255,255,255,0.1)',
  texto: '#fff',
  textoSuave: 'rgba(255,255,255,0.55)',
  textoTenue: 'rgba(255,255,255,0.35)',
  azul: '#3182ce',
  azulClaro: '#63b3ed',
  verde: '#38a169',
  verdeClaro: '#68d391',
  ambar: '#d69e2e',
  ambarClaro: '#f6c66b',
  rojo: '#e53e3e',
  rojoClaro: '#fc8181'
}

// Formato de moneda para las facturas.
export const dinero = (monto, moneda = 'MXN') =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: moneda }).format(Number(monto || 0))

// Estatus de factura y su color.
export const TONO_FACTURA = {
  pagada:      { texto: 'Pagada',      color: '#68d391', fondo: 'rgba(56,161,105,0.15)', borde: 'rgba(56,161,105,0.4)' },
  en_revision: { texto: 'En revisión', color: '#63b3ed', fondo: 'rgba(99,179,237,0.15)', borde: 'rgba(99,179,237,0.4)' },
  pendiente:   { texto: 'Pendiente',   color: '#f6c66b', fondo: 'rgba(214,158,46,0.15)', borde: 'rgba(214,158,46,0.4)' },
  vencida:     { texto: 'Vencida',     color: '#fc8181', fondo: 'rgba(229,62,62,0.15)',  borde: 'rgba(229,62,62,0.4)' }
}

export const ESTATUS_FACTURA = ['pendiente', 'en_revision', 'pagada', 'vencida']

export const tarjeta = {
  background: COLORES.superficie,
  border: `1px solid ${COLORES.borde}`,
  borderRadius: '16px',
  boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
}

export const input = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '10px',
  border: `1px solid rgba(255,255,255,0.15)`,
  fontSize: '15px',
  fontFamily: 'inherit',
  background: 'rgba(255,255,255,0.05)',
  color: COLORES.texto,
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s'
}

export const etiqueta = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 600,
  color: COLORES.textoSuave,
  marginBottom: '6px',
  letterSpacing: '0.3px'
}

const botonBase = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '11px 20px',
  borderRadius: '10px',
  border: 'none',
  fontSize: '14px',
  fontWeight: 600,
  fontFamily: 'inherit',
  cursor: 'pointer',
  transition: 'opacity 0.2s, background 0.2s'
}

export const boton = {
  primario: { ...botonBase, background: COLORES.azul, color: '#fff', boxShadow: '0 4px 14px rgba(49,130,206,0.35)' },
  secundario: { ...botonBase, background: 'rgba(255,255,255,0.08)', color: '#fff' },
  peligro: { ...botonBase, background: 'rgba(229,62,62,0.15)', color: '#fc8181', border: '1px solid rgba(229,62,62,0.35)' },
  fantasma: { ...botonBase, background: 'transparent', color: COLORES.textoSuave, padding: '8px 12px' }
}

export const deshabilitado = { opacity: 0.5, cursor: 'default', boxShadow: 'none' }

// Enfoque azul en cualquier campo, sin repetir el handler en cada formulario.
export const enfoque = {
  onFocus: (e) => { e.target.style.borderColor = COLORES.azulClaro },
  onBlur: (e) => { e.target.style.borderColor = 'rgba(255,255,255,0.15)' }
}
