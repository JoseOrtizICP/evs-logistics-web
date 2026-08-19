import { Router } from 'express'
import { routerAsincrono } from '../asincrono.js'
import bcrypt from 'bcryptjs'
import rateLimit from 'express-rate-limit'
import { consultar } from '../db.js'
import { firmarToken, requiereSesion } from '../auth.js'

const router = routerAsincrono(Router())

// Hash de descarte: se compara contra él cuando el correo no existe, para que
// responder tarde lo mismo con o sin usuario y no se pueda deducir cuáles existen.
const HASH_DESCARTE = bcrypt.hashSync('usuario-inexistente', 12)

// Frena intentos de adivinar contraseñas.
const limiteLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos. Espera 15 minutos e inténtalo de nuevo.' }
})

router.post('/login', limiteLogin, async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase()
  const password = String(req.body?.password || '')

  if (!email || !password) {
    return res.status(400).json({ error: 'Escribe tu correo y tu contraseña.' })
  }

  const { rows } = await consultar(
    'SELECT id, email, nombre, activo, password_hash FROM usuarios WHERE email = $1',
    [email]
  )
  const usuario = rows[0]

  // Mismo mensaje en ambos casos: no revelamos si el correo existe.
  const invalido = () => res.status(401).json({ error: 'Correo o contraseña incorrectos.' })

  if (!usuario || !usuario.activo) {
    await bcrypt.compare(password, HASH_DESCARTE)
    return invalido()
  }

  const coincide = await bcrypt.compare(password, usuario.password_hash)
  if (!coincide) return invalido()

  res.json({
    token: firmarToken(usuario),
    usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre }
  })
})

router.get('/yo', requiereSesion, (req, res) => {
  res.json({ usuario: req.usuario })
})

router.post('/cambiar-password', requiereSesion, async (req, res) => {
  const actual = String(req.body?.actual || '')
  const nueva = String(req.body?.nueva || '')

  if (nueva.length < 8) {
    return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 8 caracteres.' })
  }

  const { rows } = await consultar('SELECT password_hash FROM usuarios WHERE id = $1', [req.usuario.id])
  const coincide = await bcrypt.compare(actual, rows[0].password_hash)

  if (!coincide) {
    return res.status(401).json({ error: 'Tu contraseña actual no es correcta.' })
  }

  const hash = await bcrypt.hash(nueva, 12)
  await consultar('UPDATE usuarios SET password_hash = $1 WHERE id = $2', [hash, req.usuario.id])

  res.json({ ok: true })
})

// --- Gestión de usuarios del panel ---

router.get('/usuarios', requiereSesion, async (_req, res) => {
  const { rows } = await consultar(
    'SELECT id, email, nombre, activo, creado_en FROM usuarios ORDER BY creado_en ASC'
  )
  res.json({ usuarios: rows })
})

router.post('/usuarios', requiereSesion, async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase()
  const nombre = String(req.body?.nombre || '').trim()
  const password = String(req.body?.password || '')

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ error: 'El correo no tiene un formato válido.' })
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres.' })
  }

  const { rows: existentes } = await consultar('SELECT id FROM usuarios WHERE email = $1', [email])
  if (existentes.length) {
    return res.status(409).json({ error: 'Ya existe un usuario con ese correo.' })
  }

  const hash = await bcrypt.hash(password, 12)
  const { rows } = await consultar(
    'INSERT INTO usuarios (email, password_hash, nombre) VALUES ($1, $2, $3) RETURNING id, email, nombre, activo, creado_en',
    [email, hash, nombre || null]
  )

  res.status(201).json({ usuario: rows[0] })
})

router.delete('/usuarios/:id', requiereSesion, async (req, res) => {
  const id = Number(req.params.id)

  if (id === req.usuario.id) {
    return res.status(400).json({ error: 'No puedes desactivar tu propio usuario.' })
  }

  const { rows: activos } = await consultar('SELECT COUNT(*)::int AS total FROM usuarios WHERE activo = TRUE')
  if (activos[0].total <= 1) {
    return res.status(400).json({ error: 'Debe quedar al menos un usuario activo.' })
  }

  await consultar('UPDATE usuarios SET activo = FALSE WHERE id = $1', [id])
  res.json({ ok: true })
})

export default router
