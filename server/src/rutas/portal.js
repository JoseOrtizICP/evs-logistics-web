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
  contacto: cliente.contacto, email: cliente.email,
  correo_seguridad: cliente.correo_seguridad || '', dev: Boolean(dev)
})

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
     WHERE g.numero IN (SELECT guia_numero FROM facturas WHERE cliente_id = $1 AND guia_numero IS NOT NULL)
     ORDER BY g.actualizado_en DESC`,
    [id]
  )
  res.json({ envios: rows })
})

router.get('/envios/:id', async (req, res) => {
  const id = clienteActivo(req)
  const { rows } = await consultar(
    `SELECT id, numero, origen, destino, servicio, fecha_estimada, estatus, actualizado_en
     FROM guias WHERE id = $1`, [Number(req.params.id)]
  )
  if (!rows.length) return res.status(404).json({ error: 'El envío no existe.' })
  const { rows: pertenece } = await consultar(
    `SELECT 1 FROM facturas WHERE cliente_id = $1 AND guia_numero = $2 LIMIT 1`, [id, rows[0].numero]
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
  if (!id) return res.json({ facturas: [], saldo: 0, moneda: 'MXN', pago_en_linea: false })
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
  res.json({ facturas, saldo, moneda: 'MXN', pago_en_linea: false })
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
