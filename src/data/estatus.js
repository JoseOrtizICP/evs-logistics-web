// Catálogo de estatus (debe coincidir con server/src/estatus.js).
export const ESTATUS = [
  { clave: 'recibido',      etiqueta: 'Recibido en almacén', color: '#63b3ed' },
  { clave: 'documentacion', etiqueta: 'En documentación',    color: '#63b3ed' },
  { clave: 'en_transito',   etiqueta: 'En tránsito',         color: '#3182ce' },
  { clave: 'en_aduana',     etiqueta: 'En aduana',           color: '#3182ce' },
  { clave: 'en_reparto',    etiqueta: 'En reparto',          color: '#2b6cb0' },
  { clave: 'entregado',     etiqueta: 'Entregado',           color: '#38a169' },
  { clave: 'incidencia',    etiqueta: 'Incidencia',          color: '#e53e3e' }
]

// Etapas que se dibujan como barra de avance. "incidencia" queda fuera
// porque no es un paso del camino, es una alerta.
export const ETAPAS = ESTATUS.filter(e => e.clave !== 'incidencia')

export const SERVICIOS = [
  { clave: 'maritimo',   etiqueta: 'Marítimo' },
  { clave: 'aereo',      etiqueta: 'Aéreo' },
  { clave: 'terrestre',  etiqueta: 'Terrestre' },
  { clave: 'multimodal', etiqueta: 'Multimodal' }
]

export const buscarEstatus = (clave) =>
  ESTATUS.find(e => e.clave === clave) || { clave, etiqueta: clave, color: '#63b3ed' }

export const buscarServicio = (clave) =>
  SERVICIOS.find(s => s.clave === clave)?.etiqueta || null

export const indiceEtapa = (clave) => ETAPAS.findIndex(e => e.clave === clave)

const FORMATO_FECHA = new Intl.DateTimeFormat('es-MX', {
  day: '2-digit', month: 'long', year: 'numeric'
})

const FORMATO_FECHA_HORA = new Intl.DateTimeFormat('es-MX', {
  day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
})

export const formatearFecha = (valor) => {
  if (!valor) return null
  // Las fechas sin hora (AAAA-MM-DD) se interpretan como locales, no UTC,
  // para que no se recorran un día.
  const fecha = /^\d{4}-\d{2}-\d{2}$/.test(valor)
    ? new Date(`${valor}T12:00:00`)
    : new Date(valor)
  return Number.isNaN(fecha.getTime()) ? null : FORMATO_FECHA.format(fecha)
}

export const formatearFechaHora = (valor) => {
  if (!valor) return null
  const fecha = new Date(valor)
  return Number.isNaN(fecha.getTime()) ? null : FORMATO_FECHA_HORA.format(fecha)
}
