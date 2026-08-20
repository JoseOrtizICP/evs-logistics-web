import { stripe, stripeHabilitado, STRIPE_WEBHOOK_SECRET } from '../stripe.js'
import { consultar } from '../db.js'

// Webhook de Stripe: se llama cuando un pago se completa. Verifica la firma con
// el secreto del webhook y marca la factura correspondiente como pagada.
// Debe montarse con el cuerpo CRUDO (express.raw), antes de express.json.
export const manejarWebhookStripe = async (req, res) => {
  if (!stripeHabilitado || !STRIPE_WEBHOOK_SECRET) {
    return res.status(503).json({ error: 'Pagos en línea no configurados.' })
  }

  // 1) Verificar que el evento viene realmente de Stripe (firma).
  let evento
  try {
    evento = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    // Firma inválida: no reintentar. 400 le dice a Stripe que no insista.
    return res.status(400).json({ error: `Firma no válida: ${err.message}` })
  }

  // 2) Procesar el pago completado. Si la base falla, devolvemos 500 para que
  //    Stripe reintente el webhook más tarde (no perdemos el pago).
  try {
    if (evento.type === 'checkout.session.completed') {
      const sesion = evento.data.object
      const facturaId = Number(sesion.metadata?.factura_id)
      const referencia = sesion.payment_intent || sesion.id

      if (Number.isInteger(facturaId) && sesion.payment_status === 'paid') {
        await consultar(
          `UPDATE facturas
             SET estatus = 'pagada', pago_referencia = $1, actualizado_en = NOW()
           WHERE id = $2 AND estatus <> 'pagada'`,
          [String(referencia), facturaId]
        )
      }
    }
    res.json({ recibido: true })
  } catch (err) {
    console.error('[EVS API] Error procesando webhook de Stripe:', err)
    res.status(500).json({ error: 'Error procesando el evento.' })
  }
}
