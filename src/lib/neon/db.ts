import 'server-only'
import { Pool } from 'pg'

// Small node-postgres pool over the POOLED Neon URL (DATABASE_URL) for raw server-side queries
// (status checks, realtime initial reads). Payload CMS keeps its own pool through @payloadcms/db-postgres.
// Migrations / pg_dump use DATABASE_URL_UNPOOLED, never this pool.
declare global {
  // eslint-disable-next-line no-var
  var __taoPgPool: Pool | undefined
}

function createPool() {
  const url = process.env.DATABASE_URL
  if (!url || !/^postgres(ql)?:\/\//.test(url)) {
    throw new Error('DATABASE_URL must be a Postgres connection string (run `neon env pull`)')
  }
  // Neon URLs say sslmode=require; verify-full keeps the same checks and silences pg's warning.
  const pool = new Pool({
    connectionString: url.replace('sslmode=require', 'sslmode=verify-full'),
    max: 3,
  })
  // An idle connection dropped when the compute scales to zero must not crash the server.
  pool.on('error', (err) => console.error('[neon pg pool]', err.message))
  return pool
}

export const pool: Pool = globalThis.__taoPgPool ?? (globalThis.__taoPgPool = createPool())

export async function dbPing() {
  const { rows } = await pool.query<{ now: Date; version: string; db: string }>(
    'SELECT now() AS now, version() AS version, current_database() AS db',
  )
  return rows[0]
}
