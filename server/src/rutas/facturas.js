import { Router } from 'express'
import { routerAsincrono } from '../asincrono.js'
import { consultar } from '../db.js'
import { requiereSesion } from '../auth.js'

const router = routerAsincrono(Router())
router.use(requiereSesion)

const ESTATUS = ['pendiente', 'en_revision', 'pagada', 'vencida']
const limpiar = (v) => {
  const t = String(v ?? '').trim()
  return t === '' ? null : t
}

// Adjunta a cada factura sus comprobantes.
const conComprobantes = async (facturas) => {
  if (!facturas.length) return facturas
  const ids = facturas.map(f => f.id)
  const { rows } = await consultar(
    'SELECT id, factura_id, archivo_nombre, nota, subido_en FROM comprobantes WHERE factura_id = ANY($1) ORDER BY subido_en ASC',
    [ids]
  )
  const porFactura = {}
  for (const c of rows) (porFactura[c.factura_id] ||= []).push(c)
  return facturas.map(f => ({ ...f, comprobantes: porFactura[f.id] || [] }))
}

router.get('/', async (req, res) => {
  const estatus = String(req.query.estatus || '').trim()
  const cliente = String(req.query.cliente || '').trim()
  const cond = []
  const valores = []
  if (estatus && ESTATUS.includes(estatus)) { valores.push(estatus); cond.push(`f.estatus = $${valores.length}`) }
  if (cliente) { valores.push(Number(cliente)); cond.push(`f.cliente_id = $${valores.length}`) }
  const donde = cond.length ? `WHERE ${cond.join(' AND ')}` : ''

  const { rows } = await consultar(
    `SELECT f.*, c.numero AS cliente_numero, c.nombre AS cliente_nombre
     FROM facturas f JOIN clientes c ON c.id = f.cliente_id
     ${donde} ORDER BY f.fecha_emision DESC, f.id DESC LIMIT 500`,
    valores
  )
  const facturas = (await conComprobantes(rows)).map(f => ({
    ...f, por_revisar: f.estatus === 'en_revision' && f.comprobantes.length > 0
  }))
  res.json({ facturas, por_revisar: facturas.filter(f => f.por_revisar).length })
})

router.post('/', async (req, res) => {
  const clienteId = Number(req.body?.cliente_id)
  const folio = limpiar(req.body?.folio)
  const monto = Number(req.body?.monto)

  if (!clienteId) return res.status(400).json({ error: 'Selecciona el cliente.' })
  if (!folio) return res.status(400).json({ error: 'El folio es obligatorio.' })
  if (!monto || monto <= 0) return res.status(400).json({ error: 'El monto debe ser mayor a cero.' })

  const { rows: existe } = await consultar('SELECT 1 FROM clientes WHERE id = $1', [clienteId])
  if (!existe.length) return res.status(400).json({ error: 'El cliente no existe.' })

  const estatus = ESTATUS.includes(req.body?.estatus) ? req.body.estatus : 'pendiente'
  const { rows } = await consultar(
    `INSERT INTO facturas (cliente_id, folio, concepto, monto, moneda, fecha_emision, fecha_vencimiento, estatus, guia_numero, creada_por)
     VALUES ($1,$2,$3,$4,$5,COALESCE($6::date, CURRENT_DATE),$7,$8,$9,$10) RETURNING *`,
    [clienteId, folio, limpiar(req.body?.concepto), monto, limpiar(req.body?.moneda) || 'MXN',
     limpiar(req.body?.fecha_emision), limpiar(req.body?.fecha_vencimiento), estatus, limpiar(req.body?.guia_numero), req.usuario.id]
  )
  res.status(201).json({ factura: { ...rows[0], comprobantes: [] } })
})

router.patch('/:id', async (req, res) => {
  const campos = []
  const valores = []
  if (req.body?.estatus !== undefined) {
    if (!ESTATUS.includes(req.body.estatus)) return res.status(400).json({ error: 'Estatus no válido.' })
    valores.push(req.body.estatus); campos.push(`estatus = $${valores.length}`)
  }
  if (req.body?.concepto !== undefined) { valores.push(limpiar(req.body.concepto)); campos.push(`concepto = $${valores.length}`) }
  if (req.body?.monto !== undefined) { valores.push(Number(req.body.monto)); campos.push(`monto = $${valores.length}`) }
  if (req.body?.fecha_vencimiento !== undefined) { valores.push(limpiar(req.body.fecha_vencimiento)); campos.push(`fecha_vencimiento = $${valores.length}`) }
  if (!campos.length) return res.status(400).json({ error: 'No enviaste cambios.' })
  valores.push(Number(req.params.id))
  const { rows } = await consultar(
    `UPDATE facturas SET ${campos.join(', ')}, actualizado_en = NOW() WHERE id = $${valores.length} RETURNING *`,
    valores
  )
  if (!rows.length) return res.status(404).json({ error: 'La factura no existe.' })
  res.json({ factura: rows[0] })
})

router.delete('/:id', async (req, res) => {
  const { rowCount } = await consultar('DELETE FROM facturas WHERE id = $1', [Number(req.params.id)])
  if (!rowCount) return res.status(404).json({ error: 'La factura no existe.' })
  res.json({ ok: true })
})

export default router
