// Neon Function "hello" (slug is permanent): a JSON health endpoint that runs next to the database.
// Neon injects DATABASE_URL and NEON_BRANCH at runtime. Deploy with `neon deploy`; run locally with `neon dev`.
import { attachDatabasePool } from '@neon/functions'
import { Pool } from 'pg'

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 })
attachDatabasePool(pool)

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS })
    const started = Date.now()
    try {
      const { rows } = await pool.query<{ now: string; db: string }>(
        'SELECT now()::text AS now, current_database() AS db',
      )
      // The contact inbox table exists once Payload has pushed its schema; report it when present.
      const inbox = await pool
        .query<{ total: string }>('SELECT count(*)::text AS total FROM contact_messages')
        .then((r) => Number(r.rows[0].total))
        .catch(() => null)
      return Response.json(
        {
          ok: true,
          service: 'tao-website hello function',
          branch: process.env.NEON_BRANCH ?? null,
          db: rows[0].db,
          dbTime: rows[0].now,
          contactMessages: inbox,
          ms: Date.now() - started,
        },
        { headers: { ...CORS, 'Cache-Control': 'no-store' } },
      )
    } catch (err) {
      return Response.json(
        { ok: false, error: err instanceof Error ? err.message : String(err) },
        { status: 500, headers: CORS },
      )
    }
  },
}
