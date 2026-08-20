// Llamadas del portal de clientes.
import { solicitar, guardarToken, leerToken, borrarToken, MODO_DEMO } from './http'

export { MODO_DEMO }

export const guardarTokenCliente = (token) => guardarToken('cliente', token)
export const leerTokenCliente = () => leerToken('cliente')
export const borrarTokenCliente = () => borrarToken('cliente')

const conSesion = (ruta, opciones = {}) => solicitar(ruta, { ...opciones, sesion: 'cliente' })

export const entrar = (numero, password) =>
  solicitar('/api/portal/login', { method: 'POST', body: JSON.stringify({ numero, password }) })

export const verificarCliente = () => conSesion('/api/portal/yo')

export const misEnvios = () => conSesion('/api/portal/envios')

export const detalleEnvio = (id) => conSesion(`/api/portal/envios/${id}`)

export const misFacturas = () => conSesion('/api/portal/facturas')

export const subirComprobante = (facturaId, archivo, nota = '') => {
  const datos = new FormData()
  datos.append('archivo', archivo)
  if (nota) datos.append('nota', nota)
  return conSesion(`/api/portal/facturas/${facturaId}/comprobante`, { method: 'POST', body: datos })
}

// Pago con tarjeta: pide a la API una sesión de Stripe Checkout y devuelve la
// URL a la que el portal debe redirigir al cliente para pagar.
export const pagarFactura = (facturaId) =>
  conSesion(`/api/portal/facturas/${facturaId}/pagar`, { method: 'POST' })

export const cambiarPasswordCliente = (actual, nueva) =>
  conSesion('/api/portal/cambiar-password', { method: 'POST', body: JSON.stringify({ actual, nueva }) })

export const guardarCorreoSeguridad = (correo) =>
  conSesion('/api/portal/seguridad', { method: 'POST', body: JSON.stringify({ correo_seguridad: correo }) })

// Puerta de desarrollador: carga la cuenta de otro cliente por su número.
// Solo funciona si la sesión actual entró con las credenciales de desarrollador.
export const verClienteDev = (numero) =>
  conSesion(`/api/portal/dev/cliente/${encodeURIComponent(String(numero).trim())}`)

// --- Perfil del cliente ---
export const actualizarPerfil = (datos) =>
  conSesion('/api/portal/perfil', { method: 'PATCH', body: JSON.stringify(datos) })

// --- Direcciones de envío ---
export const misDirecciones = () => conSesion('/api/portal/direcciones')

export const crearDireccion = (datos) =>
  conSesion('/api/portal/direcciones', { method: 'POST', body: JSON.stringify(datos) })

export const actualizarDireccion = (id, datos) =>
  conSesion(`/api/portal/direcciones/${id}`, { method: 'PATCH', body: JSON.stringify(datos) })

export const eliminarDireccion = (id) =>
  conSesion(`/api/portal/direcciones/${id}`, { method: 'DELETE' })
