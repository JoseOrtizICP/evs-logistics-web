import { Router } from 'express'
import { randomInt } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { routerAsincrono } from '../asincrono.js'
import { consultar } from '../db.js'
import { requiereSesion } from '../auth.js'

const router = routerAsincrono(Router())
router.use(requiereSesion)

const limpiar = (v) => {
  const t = String(v ?? '').trim()
  return t === '' ? null : t
}

// Número de cliente aleatorio y disponible.
router.get('/sugerir-numero', async (_req, res) => {
  for (let i = 0; i < 12; i++) {
    const numero = `EVS-C-${String(randomInt(0, 10000)).padStart(4, '0')}`
    const { rows } = await consultar('SELECT 1 FROM clientes WHERE numero = $1', [numero])
    if (!rows.length) return res.json({ numero })
  }
  res.status(500).json({ error: 'No se pudo generar un número disponible.' })
})

router.get('/', async (req, res) => {
  const buscar = String(req.query.buscar || '').trim().toLowerCase()
  const valores = []
  let donde = ''
  if (buscar) {
    valores.push(`%${buscar}%`)
    donde = `WHERE LOWER(c.numero) LIKE $1 OR LOWER(c.nombre) LIKE $1
      OR LOWER(COALESCE(c.contacto,'')) LIKE $1 OR LOWER(COALESCE(c.email,'')) LIKE $1`
  }
  const { rows } = await consultar(
    `SELECT c.id, c.numero, c.nombre, c.contacto, c.email, c.telefono, c.activo, c.creado_en,
       (SELECT COUNT(*)::int FROM facturas f WHERE f.cliente_id = c.id) AS total_facturas,
       COALESCE((SELECT SUM(f.monto) FROM facturas f
         WHERE f.cliente_id = c.id AND f.estatus IN ('pendiente','vencida')), 0) AS saldo
     FROM clientes c ${donde}
     ORDER BY c.creado_en DESC LIMIT 500`,
    valores
  )
  res.json({ clientes: rows })
})

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id)) return res.status(404).json({ error: 'El cliente no existe.' })
  const { rows } = await consultar(
    'SELECT id, numero, nombre, contacto, email, telefono, correo_seguridad, activo, creado_en FROM clientes WHERE id = $1',
    [id]
  )
  if (!rows.length) return res.status(404).json({ error: 'El cliente no existe.' })
  const { rows: facturas } = await consultar('SELECT * FROM facturas WHERE cliente_id = $1 ORDER BY fecha_emision DESC', [rows[0].id])
  res.json({ cliente: rows[0], facturas })
})

router.post('/', async (req, res) => {
  const numero = String(req.body?.numero || '').trim().toUpperCase()
  const password = String(req.body?.password || '')
  // El nombre es opcional: si no se captura, se usa el número como nombre
  // provisional y el propio cliente lo completa desde su portal.
  const nombre = limpiar(req.body?.nombre) || numero

  if (numero.length < 4) return res.status(400).json({ error: 'El número de cliente es obligatorio.' })
  if (password.length < 8) return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' })

  const { rows: existe } = await consultar('SELECT 1 FROM clientes WHERE numero = $1', [numero])
  if (existe.length) return res.status(409).json({ error: 'Ya existe un cliente con ese número.' })

  const hash = await bcrypt.hash(password, 12)
  try {
    const { rows } = await consultar(
      `INSERT INTO clientes (numero, nombre, contacto, email, telefono, password_hash, creado_por)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING id, numero, nombre, contacto, email, telefono, activo, creado_en`,
      [numero, nombre, limpiar(req.body?.contacto), limpiar(req.body?.email), limpiar(req.body?.telefono), hash, req.usuario.id]
    )
    res.status(201).json({ cliente: rows[0] })
  } catch (err) {
    // Carrera entre dos altas del mismo número: se responde 409, no 500.
    if (err?.code === '23505') return res.status(409).json({ error: 'Ya existe un cliente con ese número.' })
    throw err
  }
})

router.patch('/:id', async (req, res) => {
  const campos = []
  const valores = []
  for (const campo of ['nombre', 'contacto', 'email', 'telefono', 'activo']) {
    if (req.body?.[campo] !== undefined) {
      valores.push(campo === 'activo' ? Boolean(req.body[campo]) : limpiar(req.body[campo]))
      campos.push(`${campo} = $${valores.length}`)
    }
  }
  if (!campos.length) return res.status(400).json({ error: 'No enviaste cambios.' })
  const id = Number(req.params.id)
  if (!Number.isInteger(id)) return res.status(404).json({ error: 'El cliente no existe.' })
  valores.push(id)
  const { rows } = await consultar(
    `UPDATE clientes SET ${campos.join(', ')}, actualizado_en = NOW()
     WHERE id = $${valores.length}
     RETURNING id, numero, nombre, contacto, email, telefono, activo, creado_en`,
    valores
  )
  if (!rows.length) return res.status(404).json({ error: 'El cliente no existe.' })
  res.json({ cliente: rows[0] })
})

router.post('/:id/password', async (req, res) => {
  const password = String(req.body?.password || '')
  if (password.length < 8) return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' })
  const id = Number(req.params.id)
  if (!Number.isInteger(id)) return res.status(404).json({ error: 'El cliente no existe.' })
  const hash = await bcrypt.hash(password, 12)
  const { rowCount } = await consultar('UPDATE clientes SET password_hash = $1, actualizado_en = NOW() WHERE id = $2', [hash, id])
  if (!rowCount) return res.status(404).json({ error: 'El cliente no existe.' })
  res.json({ ok: true })
})

export default router
