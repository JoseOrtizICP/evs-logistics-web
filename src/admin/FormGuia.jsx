import { useEffect, useState } from 'react'
import { FaMagic, FaExclamationCircle } from 'react-icons/fa'
import Modal from './Modal'
import { crearGuia, actualizarGuia, sugerirNumero, listarClientes } from '../lib/api'
import { ESTATUS, SERVICIOS } from '../data/estatus'
import { input, etiqueta, boton, deshabilitado, enfoque, COLORES } from './ui'

const VACIA = {
  numero: '', cliente: '', cliente_id: '',
  origenPais: '', origenEstado: '', origenRaw: '',
  destinoPais: '', destinoEstado: '', destinoRaw: '',
  servicio: '', fecha_estimada: '', estatus: 'recibido', notas: '',
  descripcion: '', cantidad: '', unidad: '', peso_kg: '', volumen_cbm: '', bultos: ''
}

const UNIDADES = ['Piezas', 'Cajas', 'Tarimas', 'Pallets', 'Bultos', 'Sacos', 'Rollos', 'Contenedor']

const Campo = ({ id, label, children }) => (
  <div>
    <label htmlFor={id} style={etiqueta}>{label}</label>
    {children}
  </div>
)

// Menú de País + Estado usando datos reales (country-state-city).
const SelectorLugar = ({ csc, pais, estado, onPais, onEstado }) => {
  const paises = csc || []
  const estados = (csc && pais) ? (csc.find(p => p.iso === pais)?.estados || []) : []
  return (
    <div style={{ display: 'grid', gap: '8px' }}>
      <select value={pais} onChange={e => onPais(e.target.value)} style={input} {...enfoque} disabled={!csc}>
        <option value="">{csc ? 'Selecciona país…' : 'Cargando países…'}</option>
        {paises.map(p => <option key={p.iso} value={p.iso}>{p.flag} {p.nombre}</option>)}
      </select>
      <select value={estado} onChange={e => onEstado(e.target.value)} style={input} {...enfoque}
        disabled={!pais || !estados.length}>
        <option value="">{!pais ? 'Estado / provincia' : (estados.length ? 'Selecciona estado / provincia…' : 'Sin estados')}</option>
        {estados.map(s => <option key={s.iso} value={s.iso}>{s.nombre}</option>)}
      </select>
    </div>
  )
}

const FormGuia = ({ guia, onCerrar, onGuardada }) => {
  const editando = Boolean(guia)
  const [datos, setDatos] = useState(VACIA)
  const [clientes, setClientes] = useState([])
  const [csc, setCsc] = useState(null)
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    listarClientes().then(({ clientes }) => setClientes(clientes)).catch(() => {})
    // El dataset de países/estados se carga aparte para no pesar el resto del sitio.
    import('../data/paisesEstados.json').then(m => setCsc(m.default)).catch(() => {})
  }, [])

  // Intenta reconocer país/estado a partir de un texto guardado ("Estado, País").
  const matchLugar = (mod, texto) => {
    if (!mod || !texto) return { pais: '', estado: '' }
    const t = String(texto).toLowerCase()
    const pais = mod.find(p => t.includes(p.nombre.toLowerCase()))
    if (!pais) return { pais: '', estado: '' }
    const estado = pais.estados.find(s => t.includes(s.nombre.toLowerCase()))
    return { pais: pais.iso, estado: estado ? estado.iso : '' }
  }

  useEffect(() => {
    if (guia) {
      setDatos({
        ...VACIA,
        numero: guia.numero || '',
        cliente: guia.cliente || '',
        cliente_id: guia.cliente_id ? String(guia.cliente_id) : '',
        origenRaw: guia.origen || '',
        destinoRaw: guia.destino || '',
        servicio: guia.servicio || '',
        fecha_estimada: guia.fecha_estimada ? String(guia.fecha_estimada).slice(0, 10) : '',
        estatus: guia.estatus || 'recibido',
        notas: guia.notas || '',
        descripcion: guia.descripcion || '',
        cantidad: guia.cantidad ?? '',
        unidad: guia.unidad || '',
        peso_kg: guia.peso_kg ?? '',
        volumen_cbm: guia.volumen_cbm ?? '',
        bultos: guia.bultos ?? ''
      })
    } else {
      sugerirNumero()
        .then(({ numero }) => setDatos(d => (d.numero ? d : { ...d, numero })))
        .catch(() => {})
    }
  }, [guia])

  // Al cargar el dataset, intenta preseleccionar país/estado de una guía existente.
  useEffect(() => {
    if (!csc || !guia) return
    setDatos(d => {
      if (d.origenPais || d.destinoPais) return d
      const o = matchLugar(csc, d.origenRaw)
      const de = matchLugar(csc, d.destinoRaw)
      return { ...d, origenPais: o.pais, origenEstado: o.estado, destinoPais: de.pais, destinoEstado: de.estado }
    })
  }, [csc, guia])

  const cambiar = (campo) => (e) => setDatos(d => ({ ...d, [campo]: e.target.value }))
  const set = (campo, valor) => setDatos(d => ({ ...d, [campo]: valor }))

  const nombrePais = (iso) => (csc ? csc.find(p => p.iso === iso)?.nombre : '') || ''
  const nombreEstado = (paisIso, estIso) => {
    if (!csc || !paisIso) return ''
    return csc.find(p => p.iso === paisIso)?.estados.find(s => s.iso === estIso)?.nombre || ''
  }
  const lugarStr = (paisIso, estIso, raw) => {
    const p = nombrePais(paisIso)
    if (!p) return raw || ''
    const e = nombreEstado(paisIso, estIso)
    return e ? `${e}, ${p}` : p
  }

  const enviar = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setError('')

    const cuerpo = {
      numero: datos.numero,
      cliente: datos.cliente.trim() || null,
      cliente_id: datos.cliente_id || null,
      origen: lugarStr(datos.origenPais, datos.origenEstado, datos.origenRaw),
      destino: lugarStr(datos.destinoPais, datos.destinoEstado, datos.destinoRaw),
      servicio: datos.servicio || null,
      fecha_estimada: datos.fecha_estimada || null,
      estatus: datos.estatus,
      notas: datos.notas.trim() || null,
      descripcion: datos.descripcion.trim() || null,
      cantidad: datos.cantidad === '' ? null : datos.cantidad,
      unidad: datos.unidad.trim() || null,
      peso_kg: datos.peso_kg === '' ? null : datos.peso_kg,
      volumen_cbm: datos.volumen_cbm === '' ? null : datos.volumen_cbm,
      bultos: datos.bultos === '' ? null : datos.bultos
    }

    try {
      const respuesta = editando
        ? await actualizarGuia(guia.id, cuerpo)
        : await crearGuia(cuerpo)
      onGuardada(respuesta.guia, editando ? 'Guía actualizada.' : 'Guía creada.')
    } catch (err) {
      setError(err.message)
      setGuardando(false)
    }
  }

  const tieneOrigen = Boolean(datos.origenPais || datos.origenRaw)
  const tieneDestino = Boolean(datos.destinoPais || datos.destinoRaw)
  const listo = datos.numero.trim() && tieneOrigen && tieneDestino && !guardando

  const num = { ...input }

  return (
    <Modal titulo={editando ? 'Editar guía' : 'Nueva guía'} onCerrar={onCerrar}>
      <form onSubmit={enviar}>
        <div style={{ display: 'grid', gap: '16px' }}>
          <Campo id="g-numero" label="Número de guía *  (es también el shipping mark)">
            <div style={{ display: 'flex', gap: '8px' }}>
              <input id="g-numero" value={datos.numero} onChange={cambiar('numero')}
                placeholder="EVS SEA6642" style={{ ...input, letterSpacing: '0.5px' }} {...enfoque} />
              <button type="button" title="Generar número"
                onClick={() => sugerirNumero().then(({ numero }) => setDatos(d => ({ ...d, numero }))).catch(() => {})}
                style={{ ...boton.secundario, padding: '0 16px', flexShrink: 0 }}>
                <FaMagic />
              </button>
            </div>
            <p style={{ fontSize: '11px', color: COLORES.textoTenue, marginTop: '6px' }}>
              Este es el número que le darás al cliente para consultar su envío.
            </p>
          </Campo>

          <Campo id="g-cliente-id" label="Cliente (para que le aparezca esta guía en su portal)">
            <select id="g-cliente-id" value={datos.cliente_id} onChange={cambiar('cliente_id')} style={input} {...enfoque}>
              <option value="">Sin asignar</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.numero} · {c.nombre}</option>)}
            </select>
          </Campo>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <Campo label="Origen *  (país y estado)">
              <SelectorLugar csc={csc} pais={datos.origenPais} estado={datos.origenEstado}
                onPais={v => setDatos(d => ({ ...d, origenPais: v, origenEstado: '' }))}
                onEstado={v => set('origenEstado', v)} />
              {!csc && datos.origenRaw && (
                <p style={{ fontSize: '11px', color: COLORES.textoTenue, marginTop: '6px' }}>Actual: {datos.origenRaw}</p>
              )}
            </Campo>
            <Campo label="Destino *  (país y estado)">
              <SelectorLugar csc={csc} pais={datos.destinoPais} estado={datos.destinoEstado}
                onPais={v => setDatos(d => ({ ...d, destinoPais: v, destinoEstado: '' }))}
                onEstado={v => set('destinoEstado', v)} />
              {!csc && datos.destinoRaw && (
                <p style={{ fontSize: '11px', color: COLORES.textoTenue, marginTop: '6px' }}>Actual: {datos.destinoRaw}</p>
              )}
            </Campo>
          </div>

          <Campo id="g-descripcion" label="Descripción de bienes">
            <textarea id="g-descripcion" value={datos.descripcion} onChange={cambiar('descripcion')} rows={2}
              placeholder="Ej. Herramientas para reparación de celular" style={{ ...input, resize: 'vertical' }} {...enfoque} />
          </Campo>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            <Campo id="g-cantidad" label="Cantidad">
              <input id="g-cantidad" type="number" min="0" step="any" value={datos.cantidad} onChange={cambiar('cantidad')}
                placeholder="0" style={num} {...enfoque} />
            </Campo>
            <Campo id="g-unidad" label="Unidad">
              <input id="g-unidad" list="unidades" value={datos.unidad} onChange={cambiar('unidad')}
                placeholder="Piezas, Tarimas…" style={input} {...enfoque} />
              <datalist id="unidades">
                {UNIDADES.map(u => <option key={u} value={u} />)}
              </datalist>
            </Campo>
            <Campo id="g-bultos" label="Bultos / tarimas">
              <input id="g-bultos" type="number" min="0" step="any" value={datos.bultos} onChange={cambiar('bultos')}
                placeholder="0" style={num} {...enfoque} />
            </Campo>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
            <Campo id="g-peso" label="Peso (KG)">
              <input id="g-peso" type="number" min="0" step="any" value={datos.peso_kg} onChange={cambiar('peso_kg')}
                placeholder="0.00" style={num} {...enfoque} />
            </Campo>
            <Campo id="g-volumen" label="Volumen (CBM / m³)">
              <input id="g-volumen" type="number" min="0" step="any" value={datos.volumen_cbm} onChange={cambiar('volumen_cbm')}
                placeholder="0.000" style={num} {...enfoque} />
            </Campo>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <Campo id="g-servicio" label="Tipo de servicio">
              <select id="g-servicio" value={datos.servicio} onChange={cambiar('servicio')} style={input} {...enfoque}>
                <option value="">Sin especificar</option>
                {SERVICIOS.map(s => <option key={s.clave} value={s.clave}>{s.etiqueta}</option>)}
              </select>
            </Campo>
            <Campo id="g-fecha" label="Fecha estimada de entrega">
              <input id="g-fecha" type="date" value={datos.fecha_estimada} onChange={cambiar('fecha_estimada')}
                style={{ ...input, colorScheme: 'dark' }} {...enfoque} />
            </Campo>
          </div>

          {!editando && (
            <Campo id="g-estatus" label="Estatus inicial">
              <select id="g-estatus" value={datos.estatus} onChange={cambiar('estatus')} style={input} {...enfoque}>
                {ESTATUS.map(e => <option key={e.clave} value={e.clave}>{e.etiqueta}</option>)}
              </select>
            </Campo>
          )}

          <Campo id="g-notas" label="Notas internas (no las ve el cliente)">
            <textarea id="g-notas" value={datos.notas} onChange={cambiar('notas')} rows={2}
              style={{ ...input, resize: 'vertical' }} {...enfoque} />
          </Campo>
        </div>

        {error && (
          <div style={{
            display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '12px 14px', borderRadius: '10px',
            background: 'rgba(229,62,62,0.12)', border: '1px solid rgba(229,62,62,0.3)', marginTop: '18px'
          }}>
            <FaExclamationCircle style={{ color: '#fc8181', marginTop: '2px', flexShrink: 0 }} />
            <p style={{ fontSize: '13px', color: '#feb2b2', lineHeight: 1.5 }}>{error}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '24px' }}>
          <button type="button" onClick={onCerrar} style={boton.secundario}>Cancelar</button>
          <button type="submit" disabled={!listo} style={{ ...boton.primario, ...(listo ? {} : deshabilitado) }}>
            {guardando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Crear guía'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default FormGuia
