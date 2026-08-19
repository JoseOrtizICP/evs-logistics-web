import { feature } from 'topojson-client'

// El mapa mundial se descarga una sola vez y se comparte entre componentes.
let promesa = null

export const cargarMundo = () => {
  if (!promesa) {
    promesa = fetch('/world-110m.json')
      .then(r => r.json())
      .then(datos => feature(datos, datos.objects.countries))
      .catch(err => { promesa = null; throw err })
  }
  return promesa
}
