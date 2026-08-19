import bcrypt from 'bcryptjs'
import { consultar } from './db.js'

// Crea el esquema si no existe. Es idempotente: se ejecuta en cada arranque
// sin riesgo de borrar ni duplicar datos.
const ESQUEMA = `
CREATE TABLE IF NOT EXISTS usuarios (
  id            SERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  nombre        TEXT,
  activo        BOOLEAN NOT NULL DEFAULT TRUE,
  creado_en     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS guias (
  id             SERIAL PRIMARY KEY,
  numero         TEXT UNIQUE NOT NULL,
  cliente        TEXT,
  origen         TEXT NOT NULL,
  destino        TEXT NOT NULL,
  servicio       TEXT,
  fecha_estimada DATE,
  estatus        TEXT NOT NULL DEFAULT 'recibido',
  notas          TEXT,
  creada_por     INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  creado_en      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_guias_numero  ON guias (numero);
CREATE INDEX IF NOT EXISTS idx_guias_estatus ON guias (estatus);

CREATE TABLE IF NOT EXISTS eventos (
  id          SERIAL PRIMARY KEY,
  guia_id     INTEGER NOT NULL REFERENCES guias(id) ON DELETE CASCADE,
  estatus     TEXT NOT NULL,
  descripcion TEXT,
  ubicacion   TEXT,
  ocurrido_en TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  creado_por  INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  creado_en   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_eventos_guia ON eventos (guia_id, ocurrido_en DESC);

CREATE TABLE IF NOT EXISTS clientes (
  id              SERIAL PRIMARY KEY,
  numero          TEXT UNIQUE NOT NULL,
  nombre          TEXT NOT NULL,
  contacto        TEXT,
  email           TEXT,
  telefono        TEXT,
  password_hash   TEXT NOT NULL,
  correo_seguridad TEXT,
  activo          BOOLEAN NOT NULL DEFAULT TRUE,
  creado_por      INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  creado_en       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clientes_numero ON clientes (numero);

CREATE TABLE IF NOT EXISTS facturas (
  id                SERIAL PRIMARY KEY,
  cliente_id        INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  folio             TEXT NOT NULL,
  concepto          TEXT,
  monto             NUMERIC(14,2) NOT NULL,
  moneda            TEXT NOT NULL DEFAULT 'MXN',
  fecha_emision     DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_vencimiento DATE,
  estatus           TEXT NOT NULL DEFAULT 'pendiente',
  guia_numero       TEXT,
  archivo_nombre    TEXT,
  archivo_ruta      TEXT,
  creada_por        INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
  creado_en         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  actualizado_en    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_facturas_cliente ON facturas (cliente_id);
CREATE INDEX IF NOT EXISTS idx_facturas_estatus ON facturas (estatus);

CREATE TABLE IF NOT EXISTS comprobantes (
  id             SERIAL PRIMARY KEY,
  factura_id     INTEGER NOT NULL REFERENCES facturas(id) ON DELETE CASCADE,
  archivo_nombre TEXT NOT NULL,
  archivo_ruta   TEXT NOT NULL,
  nota           TEXT,
  subido_en      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comprobantes_factura ON comprobantes (factura_id);

CREATE TABLE IF NOT EXISTS direcciones (
  id            SERIAL PRIMARY KEY,
  cliente_id    INTEGER NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  alias         TEXT,
  destinatario  TEXT,
  calle         TEXT,
  ciudad        TEXT,
  estado        TEXT,
  codigo_postal TEXT,
  pais          TEXT,
  telefono      TEXT,
  referencias   TEXT,
  creado_en     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_direcciones_cliente ON direcciones (cliente_id);

-- Registro de accesos de la puerta de desarrollador (auditoría).
CREATE TABLE IF NOT EXISTS accesos_dev (
  id           SERIAL PRIMARY KEY,
  cliente_visto TEXT,
  ip           TEXT,
  ocurrido_en  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`

// Crea el primer usuario administrador a partir de las variables de entorno,
// solo si todavía no existe ningún usuario.
const sembrarAdmin = async () => {
  const { rows } = await consultar('SELECT COUNT(*)::int AS total FROM usuarios')
  if (rows[0].total > 0) return

  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD_INICIAL || ''

  if (!email || !password) {
    console.warn('[EVS API] No hay usuarios y no se definieron ADMIN_EMAIL / ADMIN_PASSWORD_INICIAL.')
    console.warn('[EVS API] Define esas dos variables en Railway y reinicia para crear el primer administrador.')
    return
  }

  if (password.length < 8) {
    console.warn('[EVS API] ADMIN_PASSWORD_INICIAL debe tener al menos 8 caracteres. No se creó el usuario.')
    return
  }

  const hash = await bcrypt.hash(password, 12)
  await consultar(
    'INSERT INTO usuarios (email, password_hash, nombre) VALUES ($1, $2, $3)',
    [email, hash, process.env.ADMIN_NOMBRE || 'Administrador']
  )
  console.log(`[EVS API] Usuario administrador creado: ${email}`)
  console.log('[EVS API] Cambia la contraseña desde el panel y borra ADMIN_PASSWORD_INICIAL de Railway.')
}

export const migrar = async () => {
  await consultar(ESQUEMA)
  await sembrarAdmin()
  console.log('[EVS API] Base de datos lista.')
}
