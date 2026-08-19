// Núcleo de comunicación con la API, compartido por el panel interno y el
// portal de clientes. Cada uno guarda su propia sesión por separado.
const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

// Sin servidor configurado y trabajando en la computadora: datos de ejemplo.
// En el sitio publicado esto siempre es falso.
export const MODO_DEMO = !BASE && import.meta.env.DEV

export const SESION = {
  staff: 'evs_admin_token',
  cliente: 'evs_cliente_token'
}

export const guardarToken = (tipo, token) => localStorage.setItem(SESION[tipo], token)
export const leerToken = (tipo) => localStorage.getItem(SESION[tipo])
export const borrarToken = (tipo) => localStorage.removeItem(SESION[tipo])

export class ErrorApi extends Error {
  constructor(mensaje, codigo) {
    super(mensaje)
    this.codigo = codigo
  }
}

export const solicitar = async (ruta, opciones = {}) => {
  const { sesion, ...resto } = opciones

  // La comparación literal con import.meta.env.DEV deja los datos de ejemplo
  // fuera del sitio publicado: en producción esta rama se elimina al compilar.
  if (import.meta.env.DEV && MODO_DEMO) {
    const modulo = ruta.startsWith('/api/portal')
      ? await import('./demoPortal.js')
      : await import('./demo.js')
    const manejar = modulo.manejarDemoPortal || modulo.manejarDemo
    try {
      return await manejar(ruta, resto)
    } catch (err) {
      throw new ErrorApi(err.message, err.codigo || 400)
    }
  }

  if (!BASE) {
    throw new ErrorApi('El servicio no está configurado. Contacta al administrador del sitio.', 0)
  }

  const cabeceras = { ...(resto.headers || {}) }

  // FormData define su propio Content-Type (con el separador); no hay que tocarlo.
  if (resto.body && !(resto.body instanceof FormData)) {
    cabeceras['Content-Type'] = 'application/json'
  }

  if (sesion) {
    const token = leerToken(sesion)
    if (token) cabeceras.Authorization = `Bearer ${token}`
  }

  let respuesta
  try {
    respuesta = await fetch(`${BASE}${ruta}`, { ...resto, headers: cabeceras })
  } catch {
    throw new ErrorApi('No pudimos conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.', 0)
  }

  let datos = null
  try {
    datos = await respuesta.json()
  } catch {
    datos = null
  }

  if (!respuesta.ok) {
    if (respuesta.status === 401 && sesion) borrarToken(sesion)
    throw new ErrorApi(datos?.error || 'Ocurrió un error inesperado.', respuesta.status)
  }

  return datos
}
