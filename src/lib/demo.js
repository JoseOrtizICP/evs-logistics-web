// Datos de ejemplo para trabajar en la computadora sin la API.
// Solo se activan en desarrollo (npm run dev) y cuando no hay VITE_API_URL.
// Nunca se usan en el sitio publicado.

const hace = (dias, horas = 0) =>
  new Date(Date.now() - dias * 86400000 - horas * 3600000).toISOString()

const enDias = (dias) =>
  new Date(Date.now() + dias * 86400000).toISOString().slice(0, 10)

let secuencia = 100

const almacen = {
  usuario: { id: 1, email: 'demo@evslogist.com', nombre: 'Usuario de prueba' },
  guias: [
    {
      id: 1, numero: 'EVS-2026-004821', cliente: 'Comercializadora del Bajío',
      origen: 'Shanghái, China', destino: 'Guadalajara, México', servicio: 'maritimo',
      fecha_estimada: enDias(9), estatus: 'en_aduana', notas: '2 contenedores de 40 pies.',
      creado_en: hace(28), actualizado_en: hace(1)
    },
    {
      id: 2, numero: 'EVS-2026-007344', cliente: 'Industrias Vallarta',
      origen: 'Ciudad de México', destino: 'Monterrey, México', servicio: 'terrestre',
      fecha_estimada: enDias(2), estatus: 'en_reparto', notas: null,
      creado_en: hace(6), actualizado_en: hace(0, 5)
    },
    {
      id: 3, numero: 'EVS-2026-009156', cliente: 'Farmacéutica Norte',
      origen: 'Miami, Estados Unidos', destino: 'Querétaro, México', servicio: 'aereo',
      fecha_estimada: enDias(-1), estatus: 'entregado', notas: 'Carga con control de temperatura.',
      creado_en: hace(12), actualizado_en: hace(1, 3)
    }
  ],
  clientes: [
    { id: 1, numero: 'EVS-C-0142', nombre: 'Comercializadora del Bajío S.A. de C.V.', contacto: 'Laura Méndez', email: 'laura.mendez@bajio.mx', telefono: '55 1234 5678', correo_seguridad: '', activo: true, creado_en: hace(120) },
    { id: 2, numero: 'EVS-C-0088', nombre: 'Industrias Vallarta', contacto: 'Roberto Salas', email: 'r.salas@vallarta.mx', telefono: '33 8899 2211', correo_seguridad: '', activo: true, creado_en: hace(60) },
    { id: 3, numero: 'EVS-C-0203', nombre: 'Farmacéutica Norte', contacto: 'Ana Ruiz', email: 'aruiz@farmanorte.mx', telefono: '81 4455 6677', correo_seguridad: '', activo: false, creado_en: hace(20) }
  ],
  facturas: [
    { id: 1, cliente_id: 1, folio: 'A-4821', concepto: 'Flete marítimo Shanghái - Guadalajara', monto: 84600.00, moneda: 'MXN', fecha_emision: enDias(-12), fecha_vencimiento: enDias(6), estatus: 'pendiente', guia_numero: 'EVS-2026-004821', archivo_nombre: 'factura-A-4821.pdf', comprobantes: [] },
    { id: 2, cliente_id: 1, folio: 'A-4790', concepto: 'Maniobras y almacenaje', monto: 12350.50, moneda: 'MXN', fecha_emision: enDias(-31), fecha_vencimiento: enDias(-3), estatus: 'vencida', guia_numero: 'EVS-2026-007344', archivo_nombre: null, comprobantes: [] },
    { id: 3, cliente_id: 1, folio: 'A-4655', concepto: 'Flete aéreo Miami - Querétaro', monto: 45200.00, moneda: 'MXN', fecha_emision: enDias(-20), fecha_vencimiento: enDias(10), estatus: 'en_revision', guia_numero: 'EVS-2026-009156', archivo_nombre: 'factura-A-4655.pdf', comprobantes: [{ id: 1, archivo_nombre: 'transferencia-4655.pdf', nota: 'Transferencia BBVA folio 88213', subido_en: hace(2) }] },
    { id: 4, cliente_id: 2, folio: 'A-4402', concepto: 'Flete terrestre CDMX - Monterrey', monto: 18900.00, moneda: 'MXN', fecha_emision: enDias(-8), fecha_vencimiento: enDias(12), estatus: 'pendiente', guia_numero: 'EVS-2026-007344', archivo_nombre: null, comprobantes: [] }
  ],
  eventos: [
    { id: 1, guia_id: 1, estatus: 'recibido', descripcion: 'Carga recibida y verificada en almacén de origen.', ubicacion: 'Shanghái, China', ocurrido_en: hace(28) },
    { id: 2, guia_id: 1, estatus: 'documentacion', descripcion: 'Documentación de embarque completa.', ubicacion: 'Shanghái, China', ocurrido_en: hace(26) },
    { id: 3, guia_id: 1, estatus: 'en_transito', descripcion: 'Embarque zarpó con destino a Manzanillo.', ubicacion: 'Puerto de Shanghái', ocurrido_en: hace(25) },
    { id: 4, guia_id: 1, estatus: 'en_aduana', descripcion: 'En proceso de despacho aduanal.', ubicacion: 'Manzanillo, Colima', ocurrido_en: hace(1) },
    { id: 5, guia_id: 2, estatus: 'recibido', descripcion: 'Carga recibida en almacén.', ubicacion: 'Ciudad de México', ocurrido_en: hace(6) },
    { id: 6, guia_id: 2, estatus: 'en_transito', descripcion: 'Unidad en ruta.', ubicacion: 'Autopista México - Querétaro', ocurrido_en: hace(5) },
    { id: 7, guia_id: 2, estatus: 'en_reparto', descripcion: 'En reparto local, entrega programada para hoy.', ubicacion: 'Monterrey, Nuevo León', ocurrido_en: hace(0, 5) },
    { id: 8, guia_id: 3, estatus: 'recibido', descripcion: 'Carga recibida en almacén de origen.', ubicacion: 'Miami, Estados Unidos', ocurrido_en: hace(12) },
    { id: 9, guia_id: 3, estatus: 'en_transito', descripcion: 'Vuelo en ruta.', ubicacion: 'Miami International Airport', ocurrido_en: hace(11) },
    { id: 10, guia_id: 3, estatus: 'en_aduana', descripcion: 'Despacho aduanal liberado.', ubicacion: 'AIFA, Estado de México', ocurrido_en: hace(9) },
    { id: 11, guia_id: 3, estatus: 'en_reparto', descripcion: 'En reparto local.', ubicacion: 'Querétaro, Querétaro', ocurrido_en: hace(2) },
    { id: 12, guia_id: 3, estatus: 'entregado', descripcion: 'Entregado y firmado por el destinatario.', ubicacion: 'Querétaro, Querétaro', ocurrido_en: hace(1, 3) }
  ],
  usuarios: [
    { id: 1, email: 'demo@evslogist.com', nombre: 'Usuario de prueba', activo: true, creado_en: hace(60) }
  ]
}

const normalizar = (valor) => String(valor || '').trim().toUpperCase().replace(/\s+/g, '')

const recalcularEstatus = (guiaId) => {
  const eventos = almacen.eventos
    .filter(e => e.guia_id === guiaId)
    .sort((a, b) => new Date(b.ocurrido_en) - new Date(a.ocurrido_en) || b.id - a.id)
  const guia = almacen.guias.find(g => g.id === guiaId)
  if (guia && eventos[0]) guia.estatus = eventos[0].estatus
  if (guia) guia.actualizado_en = new Date().toISOString()
}

const error = (mensaje, codigo = 400) => {
  const err = new Error(mensaje)
  err.codigo = codigo
  throw err
}

// Simula la latencia de red para que la interfaz se vea como en producción.
const esperar = () => new Promise(resolve => setTimeout(resolve, 320))

export const manejarDemo = async (ruta, opciones = {}) => {
  await esperar()

  const metodo = opciones.method || 'GET'
  const cuerpo = opciones.body ? JSON.parse(opciones.body) : {}
  const [camino, query = ''] = ruta.split('?')
  const parametros = new URLSearchParams(query)

  // --- Sesión ---
  if (camino === '/api/auth/login' && metodo === 'POST') {
    if (!cuerpo.email || !cuerpo.password) error('Escribe tu correo y tu contraseña.')
    return { token: 'demo-token', usuario: almacen.usuario }
  }
  if (camino === '/api/auth/yo') return { usuario: almacen.usuario }
  if (camino === '/api/auth/cambiar-password') return { ok: true }
  if (camino === '/api/auth/usuarios' && metodo === 'GET') return { usuarios: almacen.usuarios }
  if (camino === '/api/auth/usuarios' && metodo === 'POST') {
    const usuario = { id: ++secuencia, email: cuerpo.email, nombre: cuerpo.nombre, activo: true, creado_en: new Date().toISOString() }
    almacen.usuarios.push(usuario)
    return { usuario }
  }
  if (camino.startsWith('/api/auth/usuarios/') && metodo === 'DELETE') {
    error('En modo de demostración no se pueden desactivar usuarios.')
  }

  // --- Consulta pública ---
  if (camino === '/api/rastreo/catalogos') return { ok: true }
  if (camino.startsWith('/api/rastreo/')) {
    const numero = normalizar(decodeURIComponent(camino.replace('/api/rastreo/', '')))
    const guia = almacen.guias.find(g => g.numero === numero)
    if (!guia) error('No encontramos ninguna guía con ese número. Verifícalo e inténtalo de nuevo.', 404)
    const { id, cliente, notas, ...publica } = guia
    return {
      guia: publica,
      eventos: almacen.eventos
        .filter(e => e.guia_id === id)
        .sort((a, b) => new Date(b.ocurrido_en) - new Date(a.ocurrido_en) || b.id - a.id)
    }
  }

  // --- Guías (panel) ---
  if (camino === '/api/guias/sugerir-numero') {
    const aleatorio = String(Math.floor(Math.random() * 1000000)).padStart(6, '0')
    return { numero: `EVS-${new Date().getFullYear()}-${aleatorio}` }
  }

  if (camino === '/api/guias' && metodo === 'GET') {
    const buscar = (parametros.get('buscar') || '').toLowerCase()
    const estatus = parametros.get('estatus') || ''
    const guias = almacen.guias
      .filter(g => !estatus || g.estatus === estatus)
      .filter(g => !buscar || [g.numero, g.cliente, g.origen, g.destino]
        .some(campo => String(campo || '').toLowerCase().includes(buscar)))
      .map(g => ({ ...g, total_eventos: almacen.eventos.filter(e => e.guia_id === g.id).length }))
      .sort((a, b) => new Date(b.actualizado_en) - new Date(a.actualizado_en))
    return { guias }
  }

  if (camino === '/api/guias' && metodo === 'POST') {
    const numero = normalizar(cuerpo.numero)
    if (numero.length < 4) error('El número de guía debe tener al menos 4 caracteres.')
    if (!cuerpo.origen?.trim()) error('El origen es obligatorio.')
    if (!cuerpo.destino?.trim()) error('El destino es obligatorio.')
    if (almacen.guias.some(g => g.numero === numero)) error('Ya existe una guía con ese número.', 409)

    const guia = {
      id: ++secuencia, numero, cliente: cuerpo.cliente || null,
      origen: cuerpo.origen, destino: cuerpo.destino, servicio: cuerpo.servicio || null,
      fecha_estimada: cuerpo.fecha_estimada || null, estatus: cuerpo.estatus || 'recibido',
      notas: cuerpo.notas || null, creado_en: new Date().toISOString(), actualizado_en: new Date().toISOString()
    }
    almacen.guias.push(guia)
    almacen.eventos.push({
      id: ++secuencia, guia_id: guia.id, estatus: guia.estatus,
      descripcion: 'Guía registrada en el sistema.', ubicacion: guia.origen,
      ocurrido_en: new Date().toISOString()
    })
    return { guia }
  }

  const coincideGuia = camino.match(/^\/api\/guias\/(\d+)$/)
  if (coincideGuia) {
    const id = Number(coincideGuia[1])
    const guia = almacen.guias.find(g => g.id === id)
    if (!guia) error('La guía no existe.', 404)

    if (metodo === 'GET') {
      return {
        guia,
        eventos: almacen.eventos
          .filter(e => e.guia_id === id)
          .sort((a, b) => new Date(b.ocurrido_en) - new Date(a.ocurrido_en) || b.id - a.id)
      }
    }
    if (metodo === 'PATCH') {
      if (cuerpo.numero !== undefined) {
        const numero = normalizar(cuerpo.numero)
        if (almacen.guias.some(g => g.numero === numero && g.id !== id)) error('Ya existe otra guía con ese número.', 409)
        cuerpo.numero = numero
      }
      Object.assign(guia, cuerpo, { actualizado_en: new Date().toISOString() })
      return { guia }
    }
    if (metodo === 'DELETE') {
      almacen.guias = almacen.guias.filter(g => g.id !== id)
      almacen.eventos = almacen.eventos.filter(e => e.guia_id !== id)
      return { ok: true }
    }
  }

  const coincideEventos = camino.match(/^\/api\/guias\/(\d+)\/eventos$/)
  if (coincideEventos && metodo === 'POST') {
    const guiaId = Number(coincideEventos[1])
    if (!cuerpo.estatus) error('Selecciona un estatus válido.')
    const evento = {
      id: ++secuencia, guia_id: guiaId, estatus: cuerpo.estatus,
      descripcion: cuerpo.descripcion || null, ubicacion: cuerpo.ubicacion || null,
      ocurrido_en: cuerpo.ocurrido_en || new Date().toISOString()
    }
    almacen.eventos.push(evento)
    recalcularEstatus(guiaId)
    return { evento }
  }

  const coincideEvento = camino.match(/^\/api\/guias\/(\d+)\/eventos\/(\d+)$/)
  if (coincideEvento && metodo === 'DELETE') {
    const guiaId = Number(coincideEvento[1])
    almacen.eventos = almacen.eventos.filter(e => e.id !== Number(coincideEvento[2]))
    recalcularEstatus(guiaId)
    return { ok: true }
  }

  // --- Clientes (panel maestro) ---
  if (camino === '/api/clientes/sugerir-numero') {
    const aleatorio = String(Math.floor(Math.random() * 10000)).padStart(4, '0')
    return { numero: `EVS-C-${aleatorio}` }
  }

  if (camino === '/api/clientes' && metodo === 'GET') {
    const buscar = (parametros.get('buscar') || '').toLowerCase()
    const clientes = almacen.clientes
      .filter(c => !buscar || [c.numero, c.nombre, c.contacto, c.email].some(x => String(x || '').toLowerCase().includes(buscar)))
      .map(c => ({
        ...c,
        total_facturas: almacen.facturas.filter(f => f.cliente_id === c.id).length,
        saldo: almacen.facturas
          .filter(f => f.cliente_id === c.id && (f.estatus === 'pendiente' || f.estatus === 'vencida'))
          .reduce((t, f) => t + Number(f.monto), 0)
      }))
      .sort((a, b) => new Date(b.creado_en) - new Date(a.creado_en))
    return { clientes }
  }

  if (camino === '/api/clientes' && metodo === 'POST') {
    const numero = String(cuerpo.numero || '').trim().toUpperCase()
    if (numero.length < 4) error('El número de cliente es obligatorio.')
    if (!cuerpo.nombre?.trim()) error('El nombre o razón social es obligatorio.')
    if (!cuerpo.password || cuerpo.password.length < 8) error('La contraseña debe tener al menos 8 caracteres.')
    if (almacen.clientes.some(c => c.numero === numero)) error('Ya existe un cliente con ese número.', 409)
    const cliente = {
      id: ++secuencia, numero, nombre: cuerpo.nombre, contacto: cuerpo.contacto || null,
      email: cuerpo.email || null, telefono: cuerpo.telefono || null, correo_seguridad: '',
      activo: true, creado_en: new Date().toISOString()
    }
    almacen.clientes.push(cliente)
    return { cliente }
  }

  const cliUno = camino.match(/^\/api\/clientes\/(\d+)$/)
  if (cliUno) {
    const id = Number(cliUno[1])
    const cliente = almacen.clientes.find(c => c.id === id)
    if (!cliente) error('El cliente no existe.', 404)
    if (metodo === 'GET') {
      return { cliente, facturas: almacen.facturas.filter(f => f.cliente_id === id) }
    }
    if (metodo === 'PATCH') {
      Object.assign(cliente, {
        nombre: cuerpo.nombre ?? cliente.nombre,
        contacto: cuerpo.contacto ?? cliente.contacto,
        email: cuerpo.email ?? cliente.email,
        telefono: cuerpo.telefono ?? cliente.telefono,
        activo: cuerpo.activo ?? cliente.activo
      })
      return { cliente }
    }
  }

  const cliPass = camino.match(/^\/api\/clientes\/(\d+)\/password$/)
  if (cliPass && metodo === 'POST') {
    if (!cuerpo.password || cuerpo.password.length < 8) error('La contraseña debe tener al menos 8 caracteres.')
    return { ok: true }
  }

  // --- Facturas (panel maestro) ---
  if (camino === '/api/facturas' && metodo === 'GET') {
    const estatus = parametros.get('estatus') || ''
    const clienteId = parametros.get('cliente') || ''
    const facturas = almacen.facturas
      .filter(f => !estatus || f.estatus === estatus)
      .filter(f => !clienteId || f.cliente_id === Number(clienteId))
      .map(f => {
        const c = almacen.clientes.find(x => x.id === f.cliente_id)
        return { ...f, cliente_numero: c?.numero, cliente_nombre: c?.nombre, por_revisar: f.comprobantes.length > 0 && f.estatus === 'en_revision' }
      })
      .sort((a, b) => new Date(b.fecha_emision) - new Date(a.fecha_emision))
    const porRevisar = facturas.filter(f => f.por_revisar).length
    return { facturas, por_revisar: porRevisar }
  }

  if (camino === '/api/facturas' && metodo === 'POST') {
    if (!cuerpo.cliente_id) error('Selecciona el cliente.')
    if (!cuerpo.folio?.trim()) error('El folio es obligatorio.')
    const monto = Number(cuerpo.monto)
    if (!monto || monto <= 0) error('El monto debe ser mayor a cero.')
    const factura = {
      id: ++secuencia, cliente_id: Number(cuerpo.cliente_id), folio: cuerpo.folio.trim(),
      concepto: cuerpo.concepto || null, monto, moneda: cuerpo.moneda || 'MXN',
      fecha_emision: cuerpo.fecha_emision || new Date().toISOString().slice(0, 10),
      fecha_vencimiento: cuerpo.fecha_vencimiento || null, estatus: cuerpo.estatus || 'pendiente',
      guia_numero: cuerpo.guia_numero || null, archivo_nombre: cuerpo.archivo_nombre || null, comprobantes: []
    }
    almacen.facturas.push(factura)
    return { factura }
  }

  const facUno = camino.match(/^\/api\/facturas\/(\d+)$/)
  if (facUno) {
    const id = Number(facUno[1])
    const factura = almacen.facturas.find(f => f.id === id)
    if (!factura) error('La factura no existe.', 404)
    if (metodo === 'PATCH') {
      Object.assign(factura, {
        estatus: cuerpo.estatus ?? factura.estatus,
        concepto: cuerpo.concepto ?? factura.concepto,
        monto: cuerpo.monto != null ? Number(cuerpo.monto) : factura.monto,
        fecha_vencimiento: cuerpo.fecha_vencimiento ?? factura.fecha_vencimiento
      })
      return { factura }
    }
    if (metodo === 'DELETE') {
      almacen.facturas = almacen.facturas.filter(f => f.id !== id)
      return { ok: true }
    }
  }

  error('Ruta no encontrada en el modo de demostración.', 404)
}
