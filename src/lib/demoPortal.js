// Datos de ejemplo del portal de clientes, solo para desarrollo local.
// Nunca se incluyen en el sitio publicado.

const hace = (dias, horas = 0) =>
  new Date(Date.now() - dias * 86400000 - horas * 3600000).toISOString()

const dia = (dias) =>
  new Date(Date.now() + dias * 86400000).toISOString().slice(0, 10)

let secuencia = 500

const cliente = {
  id: 1,
  numero: 'EVS-C-0142',
  nombre: 'Comercializadora del Bajío S.A. de C.V.',
  contacto: 'Laura Méndez',
  email: 'laura.mendez@bajio.mx',
  correo_seguridad: ''
}

// Credenciales de la puerta de desarrollador SOLO para la demostración local.
// En el servidor real la llave vive en variables de entorno de Railway, nunca
// en el código, y este bloque no existe.
const DEV_DEMO = { numero: 'EVS-DEV', password: 'evs-dev-2026' }
let sesionDev = false

const envios = [
  {
    id: 1, numero: 'EVS-2026-004821', origen: 'Shanghái, China', destino: 'Guadalajara, México',
    servicio: 'maritimo', fecha_estimada: dia(9), estatus: 'en_aduana', actualizado_en: hace(1)
  },
  {
    id: 2, numero: 'EVS-2026-007344', origen: 'Ciudad de México', destino: 'Monterrey, México',
    servicio: 'terrestre', fecha_estimada: dia(2), estatus: 'en_reparto', actualizado_en: hace(0, 5)
  },
  {
    id: 3, numero: 'EVS-2026-009156', origen: 'Miami, Estados Unidos', destino: 'Querétaro, México',
    servicio: 'aereo', fecha_estimada: dia(-1), estatus: 'entregado', actualizado_en: hace(1, 3)
  },
  {
    id: 4, numero: 'EVS-2025-118902', origen: 'Hamburgo, Alemania', destino: 'Veracruz, México',
    servicio: 'maritimo', fecha_estimada: dia(-46), estatus: 'entregado', actualizado_en: hace(46)
  }
]

const eventos = {
  1: [
    { id: 14, estatus: 'en_aduana', descripcion: 'En proceso de despacho aduanal.', ubicacion: 'Manzanillo, Colima', ocurrido_en: hace(1) },
    { id: 13, estatus: 'en_transito', descripcion: 'Embarque zarpó con destino a Manzanillo.', ubicacion: 'Puerto de Shanghái', ocurrido_en: hace(25) },
    { id: 12, estatus: 'documentacion', descripcion: 'Documentación de embarque completa.', ubicacion: 'Shanghái, China', ocurrido_en: hace(26) },
    { id: 11, estatus: 'recibido', descripcion: 'Carga recibida y verificada en almacén de origen.', ubicacion: 'Shanghái, China', ocurrido_en: hace(28) }
  ],
  2: [
    { id: 23, estatus: 'en_reparto', descripcion: 'En reparto local, entrega programada para hoy.', ubicacion: 'Monterrey, Nuevo León', ocurrido_en: hace(0, 5) },
    { id: 22, estatus: 'en_transito', descripcion: 'Unidad en ruta.', ubicacion: 'Autopista México - Querétaro', ocurrido_en: hace(5) },
    { id: 21, estatus: 'recibido', descripcion: 'Carga recibida en almacén.', ubicacion: 'Ciudad de México', ocurrido_en: hace(6) }
  ],
  3: [
    { id: 35, estatus: 'entregado', descripcion: 'Entregado y firmado por el destinatario.', ubicacion: 'Querétaro, Querétaro', ocurrido_en: hace(1, 3) },
    { id: 34, estatus: 'en_reparto', descripcion: 'En reparto local.', ubicacion: 'Querétaro, Querétaro', ocurrido_en: hace(2) },
    { id: 33, estatus: 'en_aduana', descripcion: 'Despacho aduanal liberado.', ubicacion: 'AIFA, Estado de México', ocurrido_en: hace(9) },
    { id: 32, estatus: 'en_transito', descripcion: 'Vuelo en ruta.', ubicacion: 'Miami International Airport', ocurrido_en: hace(11) },
    { id: 31, estatus: 'recibido', descripcion: 'Carga recibida en almacén de origen.', ubicacion: 'Miami, Estados Unidos', ocurrido_en: hace(12) }
  ],
  4: [
    { id: 42, estatus: 'entregado', descripcion: 'Entregado en planta.', ubicacion: 'Veracruz, México', ocurrido_en: hace(46) },
    { id: 41, estatus: 'recibido', descripcion: 'Carga recibida en almacén de origen.', ubicacion: 'Hamburgo, Alemania', ocurrido_en: hace(78) }
  ]
}

let facturas = [
  { id: 1, folio: 'A-4821', concepto: 'Flete marítimo Shanghái - Guadalajara', monto: 84600.00, moneda: 'MXN', fecha_emision: dia(-12), fecha_vencimiento: dia(6), estatus: 'pendiente', guia_numero: 'EVS-2026-004821', comprobantes: [] },
  { id: 2, folio: 'A-4790', concepto: 'Maniobras y almacenaje', monto: 12350.50, moneda: 'MXN', fecha_emision: dia(-31), fecha_vencimiento: dia(-3), estatus: 'vencida', guia_numero: 'EVS-2026-007344', comprobantes: [] },
  { id: 3, folio: 'A-4655', concepto: 'Flete aéreo Miami - Querétaro', monto: 45200.00, moneda: 'MXN', fecha_emision: dia(-20), fecha_vencimiento: dia(10), estatus: 'en_revision', guia_numero: 'EVS-2026-009156', comprobantes: [{ id: 1, archivo_nombre: 'transferencia-4655.pdf', subido_en: hace(2) }] },
  { id: 4, folio: 'A-4402', concepto: 'Flete marítimo Hamburgo - Veracruz', monto: 96800.00, moneda: 'MXN', fecha_emision: dia(-75), fecha_vencimiento: dia(-45), estatus: 'pagada', guia_numero: 'EVS-2025-118902', comprobantes: [] }
]

const esperar = () => new Promise(resolve => setTimeout(resolve, 300))

const fallar = (mensaje, codigo = 400) => {
  const err = new Error(mensaje)
  err.codigo = codigo
  throw err
}

export const manejarDemoPortal = async (ruta, opciones = {}) => {
  await esperar()

  const metodo = opciones.method || 'GET'
  const cuerpo = opciones.body instanceof FormData ? null : (opciones.body ? JSON.parse(opciones.body) : {})
  const camino = ruta.split('?')[0]

  if (camino === '/api/portal/login' && metodo === 'POST') {
    if (!cuerpo?.numero?.trim() || !cuerpo?.password) {
      fallar('Escribe tu número de cliente y tu contraseña.')
    }
    // Puerta de desarrollador: acceso de dueño, sin mensajes que la delaten.
    if (cuerpo.numero.trim().toUpperCase() === DEV_DEMO.numero && cuerpo.password === DEV_DEMO.password) {
      sesionDev = true
      return { token: 'demo-token-dev', cliente: { ...cliente, dev: true }, dev: true }
    }
    sesionDev = false
    return { token: 'demo-token-cliente', cliente: { ...cliente, dev: false } }
  }

  if (camino === '/api/portal/yo') return { cliente: { ...cliente, dev: sesionDev } }

  // Solo la sesión de desarrollador puede consultar a otro cliente por su número.
  const verCliente = camino.match(/^\/api\/portal\/dev\/cliente\/(.+)$/)
  if (verCliente) {
    if (!sesionDev) fallar('No autorizado.', 403)
    // En la demostración solo existe un cliente; en producción se busca el real.
    return { cliente: { ...cliente, dev: true } }
  }

  if (camino === '/api/portal/seguridad' && metodo === 'POST') {
    const correo = String(cuerpo?.correo_seguridad || '').trim()
    if (correo && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo)) {
      fallar('El correo no tiene un formato válido.')
    }
    cliente.correo_seguridad = correo
    return { cliente: { ...cliente, dev: sesionDev } }
  }

  if (camino === '/api/portal/envios') {
    return { envios: envios.map(e => ({ ...e, ultimo_evento: eventos[e.id]?.[0]?.descripcion || null })) }
  }

  const detalle = camino.match(/^\/api\/portal\/envios\/(\d+)$/)
  if (detalle) {
    const id = Number(detalle[1])
    const envio = envios.find(e => e.id === id)
    if (!envio) fallar('El envío no existe.', 404)
    return { envio, eventos: eventos[id] || [] }
  }

  if (camino === '/api/portal/facturas') {
    const saldo = facturas
      .filter(f => f.estatus === 'pendiente' || f.estatus === 'vencida')
      .reduce((total, f) => total + Number(f.monto), 0)
    return { facturas, saldo, moneda: 'MXN', pago_en_linea: false }
  }

  const subir = camino.match(/^\/api\/portal\/facturas\/(\d+)\/comprobante$/)
  if (subir && metodo === 'POST') {
    const id = Number(subir[1])
    const factura = facturas.find(f => f.id === id)
    if (!factura) fallar('La factura no existe.', 404)
    const archivo = opciones.body?.get?.('archivo')
    if (!archivo) fallar('Selecciona un archivo.')
    factura.comprobantes = [
      ...factura.comprobantes,
      { id: ++secuencia, archivo_nombre: archivo.name, subido_en: new Date().toISOString() }
    ]
    factura.estatus = 'en_revision'
    return { factura }
  }

  if (camino === '/api/portal/cambiar-password') return { ok: true }

  fallar('Ruta no encontrada en el modo de demostración.', 404)
}
