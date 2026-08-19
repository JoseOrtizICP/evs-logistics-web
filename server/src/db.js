import pg from 'pg'

const { Pool, types } = pg

// Las columnas DATE se devuelven tal cual ("2026-08-28") en vez de convertirse a
// un instante. Si no, con el servidor en UTC y el cliente en México la fecha
// estimada de entrega se mostraría un día antes.
types.setTypeParser(1082, (valor) => valor)

const cadena = process.env.DATABASE_URL

if (!cadena) {
  console.error('[EVS API] Falta la variable DATABASE_URL. En Railway se genera sola al enlazar la base de datos.')
  process.exit(1)
}

// La red interna de Railway (*.railway.internal) no usa SSL; el acceso público sí.
const esInterna = cadena.includes('.railway.internal')

export const pool = new Pool({
  connectionString: cadena,
  ssl: esInterna ? false : { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000
})

pool.on('error', (err) => {
  console.error('[EVS API] Error inesperado en el pool de PostgreSQL:', err.message)
})

export const consultar = (texto, valores) => pool.query(texto, valores)
