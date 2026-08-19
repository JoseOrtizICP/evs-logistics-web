// Catálogo de estatus de una guía.
// El orden define el avance de la línea de tiempo que ve el cliente.
export const ESTATUS = [
  { clave: 'recibido',      etiqueta: 'Recibido en almacén', color: '#63b3ed' },
  { clave: 'documentacion', etiqueta: 'En documentación',    color: '#63b3ed' },
  { clave: 'en_transito',   etiqueta: 'En tránsito',         color: '#3182ce' },
  { clave: 'en_aduana',     etiqueta: 'En aduana',           color: '#3182ce' },
  { clave: 'en_reparto',    etiqueta: 'En reparto',          color: '#2b6cb0' },
  { clave: 'entregado',     etiqueta: 'Entregado',           color: '#38a169' },
  { clave: 'incidencia',    etiqueta: 'Incidencia',          color: '#e53e3e' }
]

export const CLAVES_ESTATUS = ESTATUS.map(e => e.clave)

export const esEstatusValido = (clave) => CLAVES_ESTATUS.includes(clave)

export const SERVICIOS = ['maritimo', 'aereo', 'terrestre', 'multimodal']
