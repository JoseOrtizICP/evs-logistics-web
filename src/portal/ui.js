// Sistema visual del portal de clientes.
//
// Las tres paletas existen para comparar acabados durante el diseño. Se elige
// con ?tema= en la dirección; en cuanto quede definida, se deja solo una.
const PALETAS = {
  // Azul marino parejo, como el sitio público.
  oscuro: {
    claro: false,
    fondo: '#0b1727',
    panel: '#132741',
    panelAlto: '#1a3352',
    borde: 'rgba(255,255,255,0.09)',
    bordeFuerte: 'rgba(255,255,255,0.16)',
    campoFondo: '#0e1e33',
    texto: '#ffffff',
    suave: 'rgba(255,255,255,0.62)',
    tenue: 'rgba(255,255,255,0.38)',
    menuFondo: '#132741',
    menuBorde: 'rgba(255,255,255,0.09)',
    sombra: 'none'
  },
  // Menú azul marino de la marca, área de trabajo clara.
  claro: {
    claro: true,
    fondo: '#f2f5f9',
    panel: '#ffffff',
    panelAlto: '#e8edf4',
    borde: 'rgba(16,42,73,0.11)',
    bordeFuerte: 'rgba(16,42,73,0.2)',
    campoFondo: '#ffffff',
    texto: '#12253f',
    suave: '#4d6076',
    tenue: '#8494a7',
    menuFondo: '#12253f',
    menuBorde: 'rgba(255,255,255,0.1)',
    sombra: '0 2px 10px rgba(16,42,73,0.07)'
  }
}


const EQUIVALENTE_CLARO = {
  '#63b3ed': '#2b6cb0',
  '#3182ce': '#2c5282',
  '#2b6cb0': '#2a4365',
  '#38a169': '#276749',
  '#e53e3e': '#c53030'
}

const construir = (base) => {
  const C = {
    ...base,
    azul: '#3182ce',
    azulClaro: base.claro ? '#2b6cb0' : '#63b3ed',
    verde: '#38a169',
    verdeClaro: base.claro ? '#2f855a' : '#68d391',
    ambar: '#d69e2e',
    ambarClaro: base.claro ? '#b7791f' : '#f6c66b',
    rojo: '#e53e3e',
    rojoClaro: base.claro ? '#c53030' : '#fc8181',
    // El menú lateral siempre va en azul marino, en cualquier tema.
    menuTexto: '#ffffff',
    menuSuave: 'rgba(255,255,255,0.62)',
    menuTenue: 'rgba(255,255,255,0.4)',
    // Fondo de las barras de etapa todavía no alcanzadas.
    pista: base.claro ? 'rgba(16,42,73,0.13)' : 'rgba(255,255,255,0.1)'
  }

  const panel = {
    background: C.panel,
    border: `1px solid ${C.borde}`,
    borderRadius: '14px',
    boxShadow: C.sombra
  }

  const campo = {
    width: '100%',
    padding: '13px 15px',
    borderRadius: '10px',
    border: `1px solid ${C.bordeFuerte}`,
    fontSize: '15px',
    fontFamily: 'inherit',
    background: C.campoFondo,
    color: C.texto,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s'
  }

  const rotulo = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: C.suave,
    marginBottom: '7px'
  }

  const base_boton = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '9px',
    padding: '12px 22px',
    borderRadius: '10px',
    border: 'none',
    fontSize: '14px',
    fontWeight: 600,
    fontFamily: 'inherit',
    cursor: 'pointer',
    transition: 'background 0.15s, opacity 0.15s'
  }

  const btn = {
    primario: { ...base_boton, background: C.azul, color: '#fff' },
    neutro: { ...base_boton, background: C.panelAlto, color: C.texto },
    contorno: { ...base_boton, background: 'transparent', color: C.suave, border: `1px solid ${C.bordeFuerte}` },
    texto: { ...base_boton, background: 'transparent', color: C.suave, padding: '8px 10px' }
  }

  const foco = {
    onFocus: (e) => { e.target.style.borderColor = C.azul },
    onBlur: (e) => { e.target.style.borderColor = C.bordeFuerte }
  }

  const tinte = (color, opacidad) => {
    const alfa = C.claro ? opacidad * 0.55 : opacidad
    return `${color}${Math.round(alfa * 255).toString(16).padStart(2, '0')}`
  }

  const TONO_FACTURA = {
    pagada:      { texto: 'Pagada',      color: C.verdeClaro, fondo: tinte('#38a169', 0.16), borde: tinte('#38a169', 0.42) },
    en_revision: { texto: 'En revisión', color: C.azulClaro,  fondo: tinte('#3182ce', 0.16), borde: tinte('#3182ce', 0.42) },
    pendiente:   { texto: 'Pendiente',   color: C.ambarClaro, fondo: tinte('#d69e2e', 0.16), borde: tinte('#d69e2e', 0.42) },
    vencida:     { texto: 'Vencida',     color: C.rojoClaro,  fondo: tinte('#e53e3e', 0.16), borde: tinte('#e53e3e', 0.42) }
  }

  // Los colores de estatus se definen para fondo oscuro; sobre fondo claro hay
  // que oscurecerlos o el texto queda ilegible.
  const paraFondo = (color) => (C.claro ? (EQUIVALENTE_CLARO[color] || color) : color)

  return { C, panel, campo, rotulo, btn, foco, TONO_FACTURA, paraFondo }
}

// Tema del portal y, aparte, el oscuro fijo para la pantalla de acceso.
const ACTUAL = construir(PALETAS.claro)
export const TEMA_OSCURO = construir(PALETAS.oscuro)

export const { C, panel, campo, rotulo, btn, foco, TONO_FACTURA, paraFondo } = ACTUAL

export const apagado = { opacity: 0.45, cursor: 'default' }

export const dinero = (monto, moneda = 'MXN') =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: moneda }).format(Number(monto || 0))
