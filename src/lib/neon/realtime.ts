import 'server-only'
import { createRealtime, rawSql } from '@neon/realtime/server'

// Neon Realtime: live SQL queries. The secret seals queries on the server only; the browser gets the sealed
// capability (a 60 s bearer token renewed through /api/neon/inbox/live) and NEXT_PUBLIC_NEON_REALTIME_URL.
const dbName = (() => {
  try {
    return new URL(process.env.DATABASE_URL || '').pathname.replace(/^\//, '') || 'neondb'
  } catch {
    return 'neondb'
  }
})()

export const isRealtimeConfigured = () =>
  !!process.env.NEON_REALTIME_SECRET && !!process.env.NEON_REALTIME_URL

export const realtime = createRealtime({
  secret: process.env.NEON_REALTIME_SECRET || 'missing-realtime-secret-run-neon-env-pull',
  db: dbName,
})

/** One row per status of the contact inbox (Payload collection `contact-messages`). No personal data leaves the server. */
export type InboxRow = { status: string; total: number; latest: Date | null }

export const inboxByStatusQuery = () =>
  rawSql<InboxRow>(
    `SELECT coalesce(status, 'new') AS status, count(*)::int AS total, max(created_at) AS latest
     FROM contact_messages
     GROUP BY coalesce(status, 'new')`,
  )

export const sealInbox = () => realtime.seal({ query: inboxByStatusQuery() })
