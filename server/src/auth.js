import jwt from 'jsonwebtoken'
import { consultar } from './db.js'

const SECRETO = process.env.JWT_SECRET

if (!SECRETO || SECRETO.length < 24) {
  console.error('[EVS API] Falta JWT_SECRET o es demasiado corto (mínimo 24 caracteres).')
  console.error('[EVS API] Genera uno largo y aleatorio y guárdalo como variable en Railway.')
  process.exit(1)
}

const DURACION = process.env.JWT_DURACION || '12h'

export const firmarToken = (usuario) =>
  jwt.sign({ sub: usuario.id, email: usuario.email }, SECRETO, { expiresIn: DURACION })

// Middleware: exige un token válido y carga el usuario en req.usuario.
export const requiereSesion = async (req, res, next) => {
  const cabecera = req.headers.authorization || ''
  const token = cabecera.startsWith('Bearer ') ? cabecera.slice(7) : null

  if (!token) {
    return res.status(401).json({ error: 'Sesión requerida.' })
  }

  let datos
  try {
    datos = jwt.verify(token, SECRETO)
  } catch {
    return res.status(401).json({ error: 'Tu sesión expiró. Inicia sesión de nuevo.' })
  }

  // La consulta va fuera del try: un fallo de base de datos es un error del
  // servidor, no una sesión vencida, y debe reportarse como tal.
  const { rows } = await consultar(
    'SELECT id, email, nombre, activo FROM usuarios WHERE id = $1',
    [datos.sub]
  )
  const usuario = rows[0]

  if (!usuario || !usuario.activo) {
    return res.status(401).json({ error: 'La sesión ya no es válida.' })
  }

  req.usuario = usuario
  next()
}
