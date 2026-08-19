// Express 4 no reenvía al manejador de errores las excepciones de funciones
// async: quedarían como promesas rechazadas y tumbarían el proceso.
// Esta envoltura hace que cualquier error termine en el manejador central.
const envolver = (manejador) => (req, res, next) =>
  Promise.resolve(manejador(req, res, next)).catch(next)

export const routerAsincrono = (router) => {
  for (const metodo of ['get', 'post', 'patch', 'put', 'delete', 'use']) {
    const original = router[metodo].bind(router)
    router[metodo] = (...argumentos) =>
      original(...argumentos.map(arg => (typeof arg === 'function' ? envolver(arg) : arg)))
  }
  return router
}
