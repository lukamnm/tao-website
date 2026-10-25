import { LiveInbox } from '@/components/neon/LiveInbox'
import { RealtimeRoot } from '@/components/neon/RealtimeRoot'
import { auth, isNeonAuthConfigured } from '@/lib/auth/server'
import { isAiGatewayConfigured } from '@/lib/neon/ai'
import { dbPing, pool } from '@/lib/neon/db'
import { isRealtimeConfigured, sealInbox, type InboxRow } from '@/lib/neon/realtime'
import { isStorageConfigured, NEON_BUCKET, storageRoundTrip } from '@/lib/neon/storage'

// Service status page for the Neon backend (Postgres, Auth, Object Storage, Functions, Realtime, AI Gateway).
// Every check runs per request on the server; nothing here is cached.
export const dynamic = 'force-dynamic'

type Check = { name: string; ok: boolean; detail: string }

async function run(name: string, fn: () => Promise<string>): Promise<Check> {
  try {
    return { name, ok: true, detail: await fn() }
  } catch (err) {
    return { name, ok: false, detail: err instanceof Error ? err.message : String(err) }
  }
}

export default async function NeonStatusPage() {
  const checks = await Promise.all([
    run('Postgres', async () => {
      const r = await dbPing()
      return `${r.db} · ${r.version.split(',')[0]} · server time ${new Date(r.now).toISOString()}`
    }),
    run('Neon Auth', async () => {
      if (!isNeonAuthConfigured()) throw new Error('NEON_AUTH_BASE_URL / NEON_AUTH_COOKIE_SECRET missing')
      const { data: session, error } = await auth.getSession()
      if (error) throw new Error(error.message)
      return session?.user ? `signed in as ${session.user.email}` : 'reachable · no session (visit /auth/sign-in)'
    }),
    run('Object Storage', async () => {
      if (!isStorageConfigured()) throw new Error('AWS_* storage vars missing')
      const r = await storageRoundTrip()
      return `bucket ${NEON_BUCKET} · upload/download ${r.matches ? 'match' : 'MISMATCH'} · presigned via ${r.presignedHost}`
    }),
    run('Function (hello)', async () => {
      const base = process.env.NEON_FUNCTION_HELLO_BASE_URL
      if (!base) throw new Error('NEON_FUNCTION_HELLO_BASE_URL missing')
      const res = await fetch(base, { cache: 'no-store' })
      const j = (await res.json()) as { ok: boolean; branch: string; dbTime: string; contactMessages: number | null }
      if (!res.ok || !j.ok) throw new Error(`function returned ${res.status}`)
      return `branch ${j.branch} · db time ${j.dbTime} · contact messages ${j.contactMessages ?? 'n/a'}`
    }),
    run('AI Gateway', async () => {
      if (!isAiGatewayConfigured()) throw new Error('not configured (Free plan: enable aiGateway in neon.ts after upgrading)')
      return 'configured'
    }),
  ])

  let live: { sealed: Awaited<ReturnType<typeof sealInbox>>; rows: InboxRow[] } | null = null
  let liveError: string | null = null
  if (isRealtimeConfigured()) {
    try {
      const [sealed, { rows }] = await Promise.all([
        sealInbox(),
        pool.query<InboxRow>(
          `SELECT coalesce(status, 'new') AS status, count(*)::int AS total, max(created_at) AS latest
           FROM contact_messages GROUP BY coalesce(status, 'new')`,
        ),
      ])
      live = { sealed, rows }
    } catch (err) {
      liveError = err instanceof Error ? err.message : String(err)
    }
  } else {
    liveError = 'NEON_REALTIME_URL / NEON_REALTIME_SECRET missing'
  }

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 720, margin: '40px auto', padding: '0 16px' }}>
      <h1>Neon backend status</h1>
      <p>
        Branch <code>{process.env.NEON_BRANCH ?? '?'}</code>
      </p>
      <ul>
        {checks.map((c) => (
          <li key={c.name} data-check={c.name} data-ok={c.ok}>
            <strong>{c.ok ? 'OK' : 'FAIL'}</strong> {c.name}: {c.detail}
          </li>
        ))}
        <li data-check="Realtime" data-ok={!!live}>
          <strong>{live ? 'OK' : 'FAIL'}</strong> Realtime: {live ? 'sealed query issued' : liveError}
        </li>
      </ul>
      {live ? (
        <section>
          <h2>Live contact inbox</h2>
          <RealtimeRoot>
            <LiveInbox key={live.sealed.queryFingerprint} sealedQuery={live.sealed} initialData={live.rows} />
          </RealtimeRoot>
        </section>
      ) : null}
    </main>
  )
}
