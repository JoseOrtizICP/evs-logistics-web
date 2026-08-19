import jwt from 'jsonwebtoken'
import { consultar } from './db.js'

const SECRETO = process.env.JWT_SECRET
const DURACION = process.env.JWT_DURACION || '12h'

// Token de sesión del cliente. El claim `dev` marca la puerta de desarrollador.
export const firmarTokenCliente = (cliente, dev = false) =>
  jwt.sign({ sub: cliente.id, numero: cliente.numero, tipo: 'cliente', dev }, SECRETO, { expiresIn: DURACION })

// Token de la puerta de desarrollador (sin cliente asociado todavía).
export const firmarTokenDev = () =>
  jwt.sign({ tipo: 'cliente', dev: true, soloDev: true }, SECRETO, { expiresIn: DURACION })

export const requiereCliente = async (req, res, next) => {
  const cabecera = req.headers.authorization || ''
  const token = cabecera.startsWith('Bearer ') ? cabecera.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Sesión requerida.' })

  let datos
  try {
    datos = jwt.verify(token, SECRETO)
  } catch {
    return res.status(401).json({ error: 'Tu sesión expiró. Inicia sesión de nuevo.' })
  }
  if (datos.tipo !== 'cliente') return res.status(401).json({ error: 'Sesión no válida.' })

  req.esDev = Boolean(datos.dev)

  // La puerta de desarrollador puede no tener un cliente asociado aún.
  if (datos.soloDev && !datos.sub) {
    req.cliente = null
    return next()
  }

  const { rows } = await consultar(
    'SELECT id, numero, nombre, contacto, email, correo_seguridad, activo FROM clientes WHERE id = $1',
    [datos.sub]
  )
  const cliente = rows[0]
  // Un cliente normal desactivado no entra; el desarrollador sí (para dar soporte).
  if (!cliente || (!cliente.activo && !req.esDev)) {
    return res.status(401).json({ error: 'La cuenta ya no está activa.' })
  }
  req.cliente = cliente
  next()
}
