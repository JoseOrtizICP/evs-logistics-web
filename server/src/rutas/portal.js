import { Router } from 'express'
import path from 'node:path'
import { writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import multer from 'multer'
import rateLimit from 'express-rate-limit'
import { routerAsincrono } from '../asincrono.js'
import { consultar, pool } from '../db.js'
import { firmarTokenCliente, firmarTokenDev, requiereCliente } from '../authPortal.js'
import { CARPETA_ARCHIVOS, TIPOS_PERMITIDOS, TAMANO_MAXIMO } from '../almacenamiento.js'
import { stripe, stripeHabilitado, PORTAL_URL } from '../stripe.js'

const router = routerAsincrono(Router())

// La llave de la puerta de desarrollador vive SOLO en el entorno, nunca en el código.
const DEV_NUMERO = (process.env.DEV_PORTAL_NUMERO || '').trim().toUpperCase()
const DEV_PASSWORD = process.env.DEV_PORTAL_PASSWORD || ''

const limiteLogin = rateLimit({
  windowMs: 15 * 60 * 1000, limit: 12, standardHeaders: true, legacyHeaders: false,
  message: { error: 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.' }
})

const publica = (cliente, dev) => ({
  id: cliente.id, numero: cliente.numero, nombre: cliente.nombre,
  contacto: cliente.contacto, email: cliente.email, telefono: cliente.telefono,
  correo_seguridad: cliente.correo_seguridad || '', dev: Boolean(dev)
})

const limpiar = (v) => {
  const t = String(v ?? '').trim()
  return t === '' ? null : t
}

router.post('/login', limiteLogin, async (req, res) => {
  const numero = String(req.body?.numero || '').trim().toUpperCase()
  const password = String(req.body?.password || '')
  if (!numero || !password) return res.status(400).json({ error: 'Escribe tu número de cliente y tu contraseña.' })

  // Puerta de desarrollador: mismo formulario, credenciales del entorno.
  if (DEV_NUMERO && DEV_PASSWORD && numero === DEV_NUMERO && password === DEV_PASSWORD) {
    await consultar('INSERT INTO accesos_dev (cliente_visto, ip) VALUES ($1, $2)', ['(login)', req.ip])
    return res.json({ token: firmarTokenDev(), cliente: null, dev: true })
  }

  const { rows } = await consultar('SELECT * FROM clientes WHERE numero = $1', [numero])
  const cliente = rows[0]
  const invalido = () => res.status(401).json({ error: 'Número o contraseña incorrectos.' })

  if (!cliente || !cliente.activo) {
    await bcrypt.compare(password, '$2b$12$invalidoinvalidoinvalidoinvalidoinvalidoinvalidoinva')
    return invalido()
  }
  const ok = await bcrypt.compare(password, cliente.password_hash)
  if (!ok) return invalido()

  res.json({ token: firmarTokenCliente(cliente), cliente: publica(cliente), dev: false })
})

router.use(requiereCliente)

router.get('/yo', (req, res) => {
  if (!req.cliente) return res.json({ cliente: { dev: true, numero: '(desarrollador)' } })
  res.json({ cliente: publica(req.cliente, req.esDev) })
})

// Puerta de desarrollador: cargar la cuenta de cualquier cliente por su número.
router.get('/dev/cliente/:numero', async (req, res) => {
  if (!req.esDev) return res.status(403).json({ error: 'No autorizado.' })
  const numero = String(req.params.numero).trim().toUpperCase()
  const { rows } = await consultar('SELECT * FROM clientes WHERE numero = $1', [numero])
  if (!rows.length) return res.status(404).json({ error: 'No existe un cliente con ese número.' })
  await consultar('INSERT INTO accesos_dev (cliente_visto, ip) VALUES ($1, $2)', [numero, req.ip])
  req.cliente = rows[0]
  res.json({ cliente: publica(rows[0], true) })
})

// El id del cliente cuyos datos se consultan (el propio, o el elegido por el dev).
const clienteActivo = (req) => (req.cliente ? req.cliente.id : null)

router.get('/envios', async (req, res) => {
  const id = clienteActivo(req)
  if (!id) return res.json({ envios: [] })
  // Los envíos del cliente se ligan por el número de guía de sus facturas
  // y por coincidencia de nombre; el modelo real puede añadir cliente_id a guias.
  const { rows } = await consultar(
    `SELECT DISTINCT g.id, g.numero, g.origen, g.destino, g.servicio, g.fecha_estimada, g.estatus, g.actualizado_en
     FROM guias g
     WHERE g.cliente_id = $1
        OR g.numero IN (SELECT guia_numero FROM facturas WHERE cliente_id = $1 AND guia_numero IS NOT NULL)
     ORDER BY g.actualizado_en DESC`,
    [id]
  )
  res.json({ envios: rows })
})

router.get('/envios/:id', async (req, res) => {
  const id = clienteActivo(req)
  const envioId = Number(req.params.id)
  if (!Number.isInteger(envioId)) return res.status(404).json({ error: 'El envío no existe.' })
  const { rows } = await consultar(
    `SELECT id, numero, origen, destino, servicio, fecha_estimada, estatus, actualizado_en,
            descripcion, cantidad, unidad, peso_kg, volumen_cbm, bultos
     FROM guias WHERE id = $1`, [envioId]
  )
  if (!rows.length) return res.status(404).json({ error: 'El envío no existe.' })
  const { rows: pertenece } = await consultar(
    `SELECT 1 FROM guias WHERE id = $2 AND cliente_id = $1
     UNION SELECT 1 FROM facturas WHERE cliente_id = $1 AND guia_numero = $3 LIMIT 1`,
    [id, envioId, rows[0].numero]
  )
  if (!pertenece.length && !req.esDev) return res.status(403).json({ error: 'Este envío no es tuyo.' })
  const { rows: eventos } = await consultar(
    'SELECT estatus, descripcion, ubicacion, ocurrido_en FROM eventos WHERE guia_id = $1 ORDER BY ocurrido_en DESC, id DESC',
    [rows[0].id]
  )
  res.json({ envio: rows[0], eventos })
})

router.get('/facturas', async (req, res) => {
  const id = clienteActivo(req)
  if (!id) return res.json({ facturas: [], saldo: 0, moneda: 'MXN', pago_en_linea: stripeHabilitado })
  const { rows } = await consultar('SELECT * FROM facturas WHERE cliente_id = $1 ORDER BY fecha_emision DESC', [id])
  const ids = rows.map(f => f.id)
  let porFactura = {}
  if (ids.length) {
    const { rows: comps } = await consultar(
      'SELECT id, factura_id, archivo_nombre, nota, subido_en FROM comprobantes WHERE factura_id = ANY($1) ORDER BY subido_en ASC', [ids]
    )
    for (const c of comps) (porFactura[c.factura_id] ||= []).push(c)
  }
  const facturas = rows.map(f => ({ ...f, comprobantes: porFactura[f.id] || [] }))
  const saldo = facturas.filter(f => f.estatus === 'pendiente' || f.estatus === 'vencida').reduce((t, f) => t + Number(f.monto), 0)
  res.json({ facturas, saldo, moneda: 'MXN', pago_en_linea: stripeHabilitado })
})

// Pago con tarjeta vía Stripe Checkout. Crea una sesión de pago para la factura
// y devuelve la URL a la que el portal redirige al cliente. Los datos de la
// tarjeta los captura Stripe en su propia página (nunca tocan este servidor).
router.post('/facturas/:id/pagar', async (req, res) => {
  if (!stripeHabilitado) {
    return res.status(503).json({ error: 'El pago con tarjeta no está disponible por el momento.' })
  }
  const clienteId = req.cliente ? req.cliente.id : null
  if (!clienteId) return res.status(400).json({ error: 'No disponible en modo desarrollador.' })

  const facturaId = Number(req.params.id)
  if (!Number.isInteger(facturaId)) return res.status(404).json({ error: 'La factura no existe.' })

  const { rows } = await consultar(
    'SELECT id, folio, concepto, monto, moneda, estatus FROM facturas WHERE id = $1 AND cliente_id = $2',
    [facturaId, clienteId]
  )
  const factura = rows[0]
  if (!factura) return res.status(404).json({ error: 'La factura no existe.' })
  if (factura.estatus === 'pagada') return res.status(409).json({ error: 'Esta factura ya está pagada.' })

  const moneda = (factura.moneda || 'MXN').toLowerCase()
  const montoCentavos = Math.round(Number(factura.monto) * 100) // Stripe usa la unidad mínima.
  if (!(montoCentavos > 0)) return res.status(400).json({ error: 'El monto de la factura no es válido.' })

  const sesion = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{
      quantity: 1,
      price_data: {
        currency: moneda,
        unit_amount: montoCentavos,
        product_data: {
          name: `Factura ${factura.folio || factura.id}`,
          description: factura.concepto || 'Servicios logísticos EVS'
        }
      }
    }],
    metadata: { factura_id: String(factura.id), cliente_id: String(clienteId), folio: factura.folio || '' },
    success_url: `${PORTAL_URL}?pago=exito&factura=${encodeURIComponent(factura.folio || factura.id)}`,
    cancel_url: `${PORTAL_URL}?pago=cancelado`
  })

  res.json({ url: sesion.url })
})

// Subida de comprobante de pago.
const subida = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: TAMANO_MAXIMO },
  fileFilter: (_req, file, cb) => cb(null, Boolean(TIPOS_PERMITIDOS[file.mimetype]))
})

router.post('/facturas/:id/comprobante', subida.single('archivo'), async (req, res) => {
  const id = clienteActivo(req)
  const facturaId = Number(req.params.id)
  if (!Number.isInteger(facturaId)) return res.status(404).json({ error: 'La factura no existe.' })
  if (!req.file) return res.status(400).json({ error: 'Selecciona un archivo PDF, JPG o PNG (máx. 8 MB).' })

  const { rows } = await consultar('SELECT id FROM facturas WHERE id = $1 AND cliente_id = $2', [facturaId, id])
  if (!rows.length && !req.esDev) return res.status(404).json({ error: 'La factura no existe.' })

  const extension = TIPOS_PERMITIDOS[req.file.mimetype]
  const nombreGuardado = `comprobante-${facturaId}-${randomUUID()}${extension}`
  await writeFile(path.join(CARPETA_ARCHIVOS, nombreGuardado), req.file.buffer)

  const cliente = await pool.connect()
  try {
    await cliente.query('BEGIN')
    const { rows: creado } = await cliente.query(
      `INSERT INTO comprobantes (factura_id, archivo_nombre, archivo_ruta, nota)
       VALUES ($1,$2,$3,$4) RETURNING id, archivo_nombre, nota, subido_en`,
      [facturaId, req.file.originalname, nombreGuardado, String(req.body?.nota || '').trim() || null]
    )
    // Al recibir comprobante, la factura pasa a revisión.
    await cliente.query(`UPDATE facturas SET estatus = 'en_revision', actualizado_en = NOW() WHERE id = $1 AND estatus <> 'pagada'`, [facturaId])
    await cliente.query('COMMIT')
    res.status(201).json({ comprobante: creado[0] })
  } catch (err) {
    await cliente.query('ROLLBACK')
    throw err
  } finally {
    cliente.release()
  }
})

// El cliente edita sus propios datos de empresa.
router.patch('/perfil', async (req, res) => {
  if (!req.cliente) return res.status(400).json({ error: 'No disponible en modo desarrollador.' })
  const nombre = limpiar(req.body?.nombre)
  if (!nombre) return res.status(400).json({ error: 'El nombre o razón social es obligatorio.' })
  const { rows } = await consultar(
    `UPDATE clientes SET nombre = $1, contacto = $2, telefono = $3, email = $4, actualizado_en = NOW()
     WHERE id = $5 RETURNING id, numero, nombre, contacto, email, telefono, correo_seguridad, activo`,
    [nombre, limpiar(req.body?.contacto), limpiar(req.body?.telefono), limpiar(req.body?.email), req.cliente.id]
  )
  res.json({ cliente: publica(rows[0], req.esDev) })
})

// Direcciones de envío del cliente (varias).
router.get('/direcciones', async (req, res) => {
  const id = req.cliente ? req.cliente.id : null
  if (!id) return res.json({ direcciones: [] })
  const { rows } = await consultar('SELECT * FROM direcciones WHERE cliente_id = $1 ORDER BY creado_en ASC', [id])
  res.json({ direcciones: rows })
})

router.post('/direcciones', async (req, res) => {
  if (!req.cliente) return res.status(400).json({ error: 'No disponible en modo desarrollador.' })
  const calle = limpiar(req.body?.calle)
  const ciudad = limpiar(req.body?.ciudad)
  if (!calle || !ciudad) return res.status(400).json({ error: 'La calle y la ciudad son obligatorias.' })
  const { rows } = await consultar(
    `INSERT INTO direcciones (cliente_id, alias, destinatario, calle, ciudad, estado, codigo_postal, pais, telefono, referencias)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [req.cliente.id, limpiar(req.body?.alias), limpiar(req.body?.destinatario), calle, ciudad,
     limpiar(req.body?.estado), limpiar(req.body?.codigo_postal), limpiar(req.body?.pais),
     limpiar(req.body?.telefono), limpiar(req.body?.referencias)]
  )
  res.status(201).json({ direccion: rows[0] })
})

router.patch('/direcciones/:id', async (req, res) => {
  if (!req.cliente) return res.status(400).json({ error: 'No disponible en modo desarrollador.' })
  const campos = []
  const valores = []
  for (const c of ['alias', 'destinatario', 'calle', 'ciudad', 'estado', 'codigo_postal', 'pais', 'telefono', 'referencias']) {
    if (req.body?.[c] !== undefined) { valores.push(limpiar(req.body[c])); campos.push(`${c} = $${valores.length}`) }
  }
  if (!campos.length) return res.status(400).json({ error: 'No enviaste cambios.' })
  const dirId = Number(req.params.id)
  if (!Number.isInteger(dirId)) return res.status(404).json({ error: 'La dirección no existe.' })
  valores.push(dirId, req.cliente.id)
  const { rows } = await consultar(
    `UPDATE direcciones SET ${campos.join(', ')} WHERE id = $${valores.length - 1} AND cliente_id = $${valores.length} RETURNING *`,
    valores
  )
  if (!rows.length) return res.status(404).json({ error: 'La dirección no existe.' })
  res.json({ direccion: rows[0] })
})

router.delete('/direcciones/:id', async (req, res) => {
  if (!req.cliente) return res.status(400).json({ error: 'No disponible en modo desarrollador.' })
  const dirId = Number(req.params.id)
  if (!Number.isInteger(dirId)) return res.status(404).json({ error: 'La dirección no existe.' })
  const { rowCount } = await consultar('DELETE FROM direcciones WHERE id = $1 AND cliente_id = $2', [dirId, req.cliente.id])
  if (!rowCount) return res.status(404).json({ error: 'La dirección no existe.' })
  res.json({ ok: true })
})

router.post('/cambiar-password', async (req, res) => {
  if (!req.cliente) return res.status(400).json({ error: 'No disponible en modo desarrollador.' })
  const actual = String(req.body?.actual || '')
  const nueva = String(req.body?.nueva || '')
  if (nueva.length < 8) return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 8 caracteres.' })

  const { rows } = await consultar('SELECT password_hash FROM clientes WHERE id = $1', [req.cliente.id])
  const ok = await bcrypt.compare(actual, rows[0].password_hash)
  if (!ok) return res.status(401).json({ error: 'Tu contraseña actual no es correcta.' })

  const hash = await bcrypt.hash(nueva, 12)
  await consultar('UPDATE clientes SET password_hash = $1, actualizado_en = NOW() WHERE id = $2', [hash, req.cliente.id])
  res.json({ ok: true })
})

router.post('/seguridad', async (req, res) => {
  if (!req.cliente) return res.status(400).json({ error: 'No disponible en modo desarrollador.' })
  const correo = String(req.body?.correo_seguridad || '').trim()
  if (correo && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo)) {
    return res.status(400).json({ error: 'El correo no tiene un formato válido.' })
  }
  const { rows } = await consultar(
    'UPDATE clientes SET correo_seguridad = $1, actualizado_en = NOW() WHERE id = $2 RETURNING id, numero, nombre, contacto, email, correo_seguridad, activo',
    [correo || null, req.cliente.id]
  )
  res.json({ cliente: publica(rows[0], req.esDev) })
})

export default router
