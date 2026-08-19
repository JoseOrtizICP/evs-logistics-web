import { Router } from 'express'
import { routerAsincrono } from '../asincrono.js'
import rateLimit from 'express-rate-limit'
import { consultar } from '../db.js'
import { ESTATUS, SERVICIOS } from '../estatus.js'

const router = routerAsincrono(Router())

// Evita que alguien pruebe números al azar hasta encontrar guías ajenas.
const limiteConsulta = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Hiciste demasiadas consultas. Espera unos minutos e inténtalo de nuevo.' }
})

router.get('/catalogos', (_req, res) => {
  res.json({ estatus: ESTATUS, servicios: SERVICIOS })
})

// Consulta pública: solo devuelve la guía cuyo número exacto se conoce y
// nunca los datos internos (cliente, notas, quién la capturó).
router.get('/:numero', limiteConsulta, async (req, res) => {
  const numero = String(req.params.numero || '').trim().toUpperCase().replace(/\s+/g, '')

  if (numero.length < 4 || numero.length > 40) {
    return res.status(400).json({ error: 'El número de guía no tiene un formato válido.' })
  }

  const { rows } = await consultar(
    `SELECT id, numero, origen, destino, servicio, fecha_estimada, estatus, actualizado_en
     FROM guias WHERE numero = $1`,
    [numero]
  )

  if (!rows.length) {
    return res.status(404).json({ error: 'No encontramos ninguna guía con ese número. Verifícalo e inténtalo de nuevo.' })
  }

  const guia = rows[0]

  const { rows: eventos } = await consultar(
    `SELECT estatus, descripcion, ubicacion, ocurrido_en
     FROM eventos WHERE guia_id = $1
     ORDER BY ocurrido_en DESC, id DESC`,
    [guia.id]
  )

  delete guia.id

  res.json({ guia, eventos })
})

export default router
