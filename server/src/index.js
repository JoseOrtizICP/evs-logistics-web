import express from 'express'
import cors from 'cors'
import { migrar } from './migrar.js'
import { pool } from './db.js'
import rutasAuth from './rutas/auth.js'
import rutasGuias from './rutas/guias.js'
import rutasRastreo from './rutas/rastreo.js'
import rutasClientes from './rutas/clientes.js'
import rutasFacturas from './rutas/facturas.js'
import rutasPortal from './rutas/portal.js'
import { asegurarCarpeta } from './almacenamiento.js'

const app = express()

// Railway sirve detrás de un proxy: sin esto los límites de peticiones
// verían siempre la misma IP.
app.set('trust proxy', 1)
app.disable('x-powered-by')

const origenesPermitidos = (
  process.env.CORS_ORIGINS ||
  'https://www.evslogist.com,https://evslogist.com,http://localhost:5173,http://localhost:5174,http://localhost:5175'
).split(',').map(o => o.trim()).filter(Boolean)

app.use(cors({
  origin: (origen, callback) => {
    // Permite herramientas sin origen (curl, healthchecks de Railway).
    if (!origen || origenesPermitidos.includes(origen)) return callback(null, true)
    callback(new Error('Origen no permitido por CORS.'))
  }
}))

app.use(express.json({ limit: '100kb' }))

app.get('/api/salud', (_req, res) => res.json({ ok: true, servicio: 'evs-tracking-api' }))

app.use('/api/auth', rutasAuth)
app.use('/api/guias', rutasGuias)
app.use('/api/rastreo', rutasRastreo)
app.use('/api/clientes', rutasClientes)
app.use('/api/facturas', rutasFacturas)
app.use('/api/portal', rutasPortal)

app.use((_req, res) => res.status(404).json({ error: 'Ruta no encontrada.' }))

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[EVS API]', err)
  const mensaje = err?.message === 'Origen no permitido por CORS.'
    ? err.message
    : 'Ocurrió un error en el servidor. Inténtalo de nuevo.'
  res.status(500).json({ error: mensaje })
})

const puerto = process.env.PORT || 3001

const arrancar = async () => {
  try {
    await asegurarCarpeta()
    await migrar()
  } catch (err) {
    console.error('[EVS API] No se pudo preparar la base de datos:', err.message || err.code || err)
    console.error('[EVS API] Revisa que la variable DATABASE_URL apunte al PostgreSQL del proyecto.')
    process.exit(1)
  }

  const servidor = app.listen(puerto, () => {
    console.log(`[EVS API] Escuchando en el puerto ${puerto}`)
    console.log(`[EVS API] Orígenes permitidos: ${origenesPermitidos.join(', ')}`)
  })

  // Apagado ordenado: cuando Railway envía la señal de detener (al desplegar
  // una versión nueva), cerramos el servidor y la base con calma y salimos
  // con código 0. Así Railway ve un cierre limpio y NO lo reporta como caída.
  let cerrando = false
  const apagar = (senal) => {
    if (cerrando) return
    cerrando = true
    console.log(`[EVS API] ${senal} recibida, cerrando ordenadamente…`)
    servidor.close(() => {
      pool.end().catch(() => {}).finally(() => process.exit(0))
    })
    // Red de seguridad: si algo se traba, salimos igual sin marcar error.
    setTimeout(() => process.exit(0), 8000).unref()
  }
  process.on('SIGTERM', () => apagar('SIGTERM'))
  process.on('SIGINT', () => apagar('SIGINT'))
}

arrancar()
