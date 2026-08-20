// Llamadas del panel interno (personal de EVS).
import { solicitar, guardarToken as guardar, leerToken as leer, borrarToken as borrar, MODO_DEMO } from './http'

export { MODO_DEMO }

export const guardarToken = (token) => guardar('staff', token)
export const leerToken = () => leer('staff')
export const borrarToken = () => borrar('staff')

const conSesion = (ruta, opciones = {}) => solicitar(ruta, { ...opciones, sesion: 'staff' })

// --- Público ---
export const rastrear = (numero) =>
  solicitar(`/api/rastreo/${encodeURIComponent(String(numero).trim())}`)

// --- Sesión del panel ---
export const iniciarSesion = (email, password) =>
  solicitar('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })

export const verificarSesion = () => conSesion('/api/auth/yo')

export const cambiarPassword = (actual, nueva) =>
  conSesion('/api/auth/cambiar-password', { method: 'POST', body: JSON.stringify({ actual, nueva }) })

export const listarUsuarios = () => conSesion('/api/auth/usuarios')

export const crearUsuario = (datos) =>
  conSesion('/api/auth/usuarios', { method: 'POST', body: JSON.stringify(datos) })

export const desactivarUsuario = (id) =>
  conSesion(`/api/auth/usuarios/${id}`, { method: 'DELETE' })

// --- Guías ---
export const listarGuias = ({ buscar = '', estatus = '' } = {}) => {
  const parametros = new URLSearchParams()
  if (buscar) parametros.set('buscar', buscar)
  if (estatus) parametros.set('estatus', estatus)
  const query = parametros.toString()
  return conSesion(`/api/guias${query ? `?${query}` : ''}`)
}

export const obtenerGuia = (id) => conSesion(`/api/guias/${id}`)

export const sugerirNumero = () => conSesion('/api/guias/sugerir-numero')

export const crearGuia = (datos) =>
  conSesion('/api/guias', { method: 'POST', body: JSON.stringify(datos) })

export const actualizarGuia = (id, datos) =>
  conSesion(`/api/guias/${id}`, { method: 'PATCH', body: JSON.stringify(datos) })

export const eliminarGuia = (id) =>
  conSesion(`/api/guias/${id}`, { method: 'DELETE' })

export const agregarEvento = (guiaId, datos) =>
  conSesion(`/api/guias/${guiaId}/eventos`, { method: 'POST', body: JSON.stringify(datos) })

export const eliminarEvento = (guiaId, eventoId) =>
  conSesion(`/api/guias/${guiaId}/eventos/${eventoId}`, { method: 'DELETE' })

// --- Clientes (panel maestro) ---
export const listarClientes = ({ buscar = '' } = {}) => {
  const parametros = new URLSearchParams()
  if (buscar) parametros.set('buscar', buscar)
  const query = parametros.toString()
  return conSesion(`/api/clientes${query ? `?${query}` : ''}`)
}

export const obtenerCliente = (id) => conSesion(`/api/clientes/${id}`)

export const sugerirNumeroCliente = () => conSesion('/api/clientes/sugerir-numero')

export const crearCliente = (datos) =>
  conSesion('/api/clientes', { method: 'POST', body: JSON.stringify(datos) })

export const actualizarCliente = (id, datos) =>
  conSesion(`/api/clientes/${id}`, { method: 'PATCH', body: JSON.stringify(datos) })

export const cambiarPasswordCliente = (id, password) =>
  conSesion(`/api/clientes/${id}/password`, { method: 'POST', body: JSON.stringify({ password }) })

export const eliminarCliente = (id) =>
  conSesion(`/api/clientes/${id}`, { method: 'DELETE' })

// --- Facturas (panel maestro) ---
export const listarFacturas = ({ estatus = '', cliente = '' } = {}) => {
  const parametros = new URLSearchParams()
  if (estatus) parametros.set('estatus', estatus)
  if (cliente) parametros.set('cliente', cliente)
  const query = parametros.toString()
  return conSesion(`/api/facturas${query ? `?${query}` : ''}`)
}

export const crearFactura = (datos) =>
  conSesion('/api/facturas', { method: 'POST', body: JSON.stringify(datos) })

export const actualizarFactura = (id, datos) =>
  conSesion(`/api/facturas/${id}`, { method: 'PATCH', body: JSON.stringify(datos) })

export const eliminarFactura = (id) =>
  conSesion(`/api/facturas/${id}`, { method: 'DELETE' })
