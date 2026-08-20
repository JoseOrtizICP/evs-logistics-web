import { Router } from 'express'
import { routerAsincrono } from '../asincrono.js'
import { randomInt } from 'node:crypto'
import { pool, consultar } from '../db.js'
import { requiereSesion } from '../auth.js'
import { esEstatusValido, SERVICIOS } from '../estatus.js'

const router = routerAsincrono(Router())

router.use(requiereSesion)

// Normaliza el número de guía para que "evs 2026 1234" y "EVS-2026-1234"
// no se guarden como dos guías distintas.
export const normalizarNumero = (valor) =>
  String(valor || '').trim().toUpperCase().replace(/\s+/g, '')

const limpiar = (valor) => {
  const texto = String(valor ?? '').trim()
  return texto === '' ? null : texto
}

const validarGuia = (cuerpo, { parcial = false } = {}) => {
  const errores = []
  const datos = {}

  if (!parcial || cuerpo.numero !== undefined) {
    const numero = normalizarNumero(cuerpo.numero)
    if (numero.length < 4) errores.push('El número de guía debe tener al menos 4 caracteres.')
    if (numero.length > 40) errores.push('El número de guía es demasiado largo.')
    datos.numero = numero
  }

  if (!parcial || cuerpo.origen !== undefined) {
    const origen = limpiar(cuerpo.origen)
    if (!origen) errores.push('El origen es obligatorio.')
    datos.origen = origen
  }

  if (!parcial || cuerpo.destino !== undefined) {
    const destino = limpiar(cuerpo.destino)
    if (!destino) errores.push('El destino es obligatorio.')
    datos.destino = destino
  }

  if (cuerpo.servicio !== undefined) {
    const servicio = limpiar(cuerpo.servicio)
    if (servicio && !SERVICIOS.includes(servicio)) errores.push('El tipo de servicio no es válido.')
    datos.servicio = servicio
  }

  if (cuerpo.estatus !== undefined) {
    const estatus = limpiar(cuerpo.estatus)
    if (estatus && !esEstatusValido(estatus)) errores.push('El estatus no es válido.')
    datos.estatus = estatus
  }

  if (cuerpo.fecha_estimada !== undefined) {
    const fecha = limpiar(cuerpo.fecha_estimada)
    if (fecha && !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) errores.push('La fecha estimada debe tener formato AAAA-MM-DD.')
    datos.fecha_estimada = fecha
  }

  if (cuerpo.cliente !== undefined) datos.cliente = limpiar(cuerpo.cliente)
  if (cuerpo.cliente_id !== undefined) datos.cliente_id = cuerpo.cliente_id ? Number(cuerpo.cliente_id) : null
  if (cuerpo.notas !== undefined) datos.notas = limpiar(cuerpo.notas)

  // Datos de almacén / packing list.
  if (cuerpo.descripcion !== undefined) datos.descripcion = limpiar(cuerpo.descripcion)
  if (cuerpo.unidad !== undefined) datos.unidad = limpiar(cuerpo.unidad)
  for (const campo of ['cantidad', 'peso_kg', 'volumen_cbm', 'bultos']) {
    if (cuerpo[campo] === undefined) continue
    if (cuerpo[campo] === null || cuerpo[campo] === '') { datos[campo] = null; continue }
    const numero = Number(cuerpo[campo])
    if (Number.isNaN(numero) || numero < 0) errores.push('El peso, volumen, cantidad y bultos deben ser números válidos.')
    else datos[campo] = numero
  }

  return { errores, datos }
}

// Sugiere un número aleatorio (no consecutivo, para que no se puedan adivinar
// las guías de otros clientes).
router.get('/sugerir-numero', async (_req, res) => {
  const anio = new Date().getFullYear()

  for (let intento = 0; intento < 12; intento++) {
    const numero = `EVS-${anio}-${String(randomInt(0, 1_000_000)).padStart(6, '0')}`
    const { rows } = await consultar('SELECT 1 FROM guias WHERE numero = $1', [numero])
    if (!rows.length) return res.json({ numero })
  }

  res.status(500).json({ error: 'No se pudo generar un número disponible. Inténtalo de nuevo.' })
})

// Listado con buscador y filtro por estatus.
router.get('/', async (req, res) => {
  const buscar = String(req.query.buscar || '').trim()
  const estatus = String(req.query.estatus || '').trim()

  const condiciones = []
  const valores = []

  if (buscar) {
    valores.push(`%${buscar.toLowerCase()}%`)
    condiciones.push(`(LOWER(g.numero) LIKE $${valores.length}
      OR LOWER(COALESCE(g.cliente, '')) LIKE $${valores.length}
      OR LOWER(g.destino) LIKE $${valores.length}
      OR LOWER(g.origen) LIKE $${valores.length})`)
  }

  if (estatus && esEstatusValido(estatus)) {
    valores.push(estatus)
    condiciones.push(`g.estatus = $${valores.length}`)
  }

  const donde = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : ''

  const { rows } = await consultar(
    `SELECT g.*, c.numero AS cliente_numero, c.nombre AS cliente_nombre,
       (SELECT COUNT(*)::int FROM eventos e WHERE e.guia_id = g.id) AS total_eventos
     FROM guias g
     LEFT JOIN clientes c ON c.id = g.cliente_id
     ${donde}
     ORDER BY g.actualizado_en DESC
     LIMIT 300`,
    valores
  )

  res.json({ guias: rows })
})

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id)) return res.status(404).json({ error: 'La guía no existe.' })
  const { rows } = await consultar('SELECT * FROM guias WHERE id = $1', [id])
  if (!rows.length) return res.status(404).json({ error: 'La guía no existe.' })

  const { rows: eventos } = await consultar(
    'SELECT * FROM eventos WHERE guia_id = $1 ORDER BY ocurrido_en DESC, id DESC',
    [rows[0].id]
  )

  res.json({ guia: rows[0], eventos })
})

router.post('/', async (req, res) => {
  const { errores, datos } = validarGuia(req.body)
  if (errores.length) return res.status(400).json({ error: errores[0], errores })

  const { rows: repetidos } = await consultar('SELECT id FROM guias WHERE numero = $1', [datos.numero])
  if (repetidos.length) return res.status(409).json({ error: 'Ya existe una guía con ese número.' })

  const estatus = datos.estatus || 'recibido'
  const cliente = await pool.connect()

  try {
    await cliente.query('BEGIN')

    const { rows } = await cliente.query(
      `INSERT INTO guias (numero, cliente, cliente_id, origen, destino, servicio, fecha_estimada, estatus, notas,
         descripcion, cantidad, unidad, peso_kg, volumen_cbm, bultos, creada_por)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16) RETURNING *`,
      [datos.numero, datos.cliente ?? null, datos.cliente_id ?? null, datos.origen, datos.destino, datos.servicio ?? null,
       datos.fecha_estimada ?? null, estatus, datos.notas ?? null,
       datos.descripcion ?? null, datos.cantidad ?? null, datos.unidad ?? null,
       datos.peso_kg ?? null, datos.volumen_cbm ?? null, datos.bultos ?? null, req.usuario.id]
    )

    // Primer movimiento de la línea de tiempo, para que el cliente vea algo desde el inicio.
    await cliente.query(
      `INSERT INTO eventos (guia_id, estatus, descripcion, ubicacion, creado_por)
       VALUES ($1, $2, $3, $4, $5)`,
      [rows[0].id, estatus, 'Guía registrada en el sistema.', datos.origen, req.usuario.id]
    )

    await cliente.query('COMMIT')
    res.status(201).json({ guia: rows[0] })
  } catch (err) {
    await cliente.query('ROLLBACK')
    // Carrera: dos altas simultáneas del mismo número pasan la verificación previa
    // y una choca contra el índice único. Se responde 409, no 500.
    if (err?.code === '23505') return res.status(409).json({ error: 'Ya existe una guía con ese número.' })
    throw err
  } finally {
    cliente.release()
  }
})

router.patch('/:id', async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id)) return res.status(404).json({ error: 'La guía no existe.' })
  const { errores, datos } = validarGuia(req.body, { parcial: true })
  if (errores.length) return res.status(400).json({ error: errores[0], errores })

  const campos = Object.keys(datos)
  if (!campos.length) return res.status(400).json({ error: 'No enviaste ningún cambio.' })

  if (datos.numero) {
    const { rows } = await consultar('SELECT id FROM guias WHERE numero = $1 AND id <> $2', [datos.numero, id])
    if (rows.length) return res.status(409).json({ error: 'Ya existe otra guía con ese número.' })
  }

  const asignaciones = campos.map((campo, i) => `${campo} = $${i + 1}`)
  const valores = campos.map(campo => datos[campo])
  valores.push(id)

  const { rows } = await consultar(
    `UPDATE guias SET ${asignaciones.join(', ')}, actualizado_en = NOW()
     WHERE id = $${valores.length} RETURNING *`,
    valores
  )

  if (!rows.length) return res.status(404).json({ error: 'La guía no existe.' })
  res.json({ guia: rows[0] })
})

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id)) return res.status(404).json({ error: 'La guía no existe.' })
  const { rowCount } = await consultar('DELETE FROM guias WHERE id = $1', [id])
  if (!rowCount) return res.status(404).json({ error: 'La guía no existe.' })
  res.json({ ok: true })
})

// --- Movimientos de la línea de tiempo ---

router.post('/:id/eventos', async (req, res) => {
  const guiaId = Number(req.params.id)
  if (!Number.isInteger(guiaId)) return res.status(404).json({ error: 'La guía no existe.' })
  const estatus = limpiar(req.body?.estatus)
  const descripcion = limpiar(req.body?.descripcion)
  const ubicacion = limpiar(req.body?.ubicacion)
  const ocurridoEn = limpiar(req.body?.ocurrido_en)

  if (!estatus || !esEstatusValido(estatus)) {
    return res.status(400).json({ error: 'Selecciona un estatus válido.' })
  }

  if (ocurridoEn && Number.isNaN(Date.parse(ocurridoEn))) {
    return res.status(400).json({ error: 'La fecha del movimiento no es válida.' })
  }

  const { rows: existe } = await consultar('SELECT id FROM guias WHERE id = $1', [guiaId])
  if (!existe.length) return res.status(404).json({ error: 'La guía no existe.' })

  const cliente = await pool.connect()

  try {
    await cliente.query('BEGIN')

    const { rows } = await cliente.query(
      `INSERT INTO eventos (guia_id, estatus, descripcion, ubicacion, ocurrido_en, creado_por)
       VALUES ($1, $2, $3, $4, COALESCE($5::timestamptz, NOW()), $6) RETURNING *`,
      [guiaId, estatus, descripcion, ubicacion, ocurridoEn, req.usuario.id]
    )

    // El estatus de la guía siempre refleja su movimiento más reciente.
    await cliente.query(
      `UPDATE guias g
       SET estatus = (
             SELECT e.estatus FROM eventos e
             WHERE e.guia_id = g.id
             ORDER BY e.ocurrido_en DESC, e.id DESC
             LIMIT 1
           ),
           actualizado_en = NOW()
       WHERE g.id = $1`,
      [guiaId]
    )

    await cliente.query('COMMIT')
    res.status(201).json({ evento: rows[0] })
  } catch (err) {
    await cliente.query('ROLLBACK')
    throw err
  } finally {
    cliente.release()
  }
})

router.delete('/:id/eventos/:eventoId', async (req, res) => {
  const guiaId = Number(req.params.id)
  const eventoId = Number(req.params.eventoId)
  if (!Number.isInteger(guiaId) || !Number.isInteger(eventoId)) {
    return res.status(404).json({ error: 'El movimiento no existe.' })
  }

  const { rowCount } = await consultar(
    'DELETE FROM eventos WHERE id = $1 AND guia_id = $2',
    [eventoId, guiaId]
  )

  if (!rowCount) return res.status(404).json({ error: 'El movimiento no existe.' })

  await consultar(
    `UPDATE guias g
     SET estatus = COALESCE((
           SELECT e.estatus FROM eventos e
           WHERE e.guia_id = g.id
           ORDER BY e.ocurrido_en DESC, e.id DESC
           LIMIT 1
         ), g.estatus),
         actualizado_en = NOW()
     WHERE g.id = $1`,
    [guiaId]
  )

  res.json({ ok: true })
})

export default router
