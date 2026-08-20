import Stripe from 'stripe'

// La integración de Stripe se activa SOLO cuando hay una llave configurada en
// el entorno (Railway). Sin llave, el portal no muestra el botón de tarjeta y
// nada se rompe: los clientes siguen pagando por transferencia + comprobante.
const CLAVE = (process.env.STRIPE_SECRET_KEY || '').trim()

export const stripeHabilitado = Boolean(CLAVE)

export const stripe = stripeHabilitado ? new Stripe(CLAVE) : null

// Secreto para verificar la firma de los webhooks (whsec_...).
export const STRIPE_WEBHOOK_SECRET = (process.env.STRIPE_WEBHOOK_SECRET || '').trim()

// A dónde regresa el cliente después de pagar (o cancelar) en Stripe.
export const PORTAL_URL = (process.env.PORTAL_URL || 'https://www.evslogist.com/portal').replace(/\/+$/, '')

if (stripeHabilitado) {
  console.log('[EVS API] Stripe habilitado (pago con tarjeta activo).')
} else {
  console.log('[EVS API] Stripe deshabilitado (falta STRIPE_SECRET_KEY). El portal usa solo comprobante.')
}
