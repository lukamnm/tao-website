// End-to-end Realtime check: subscribe to the sealed contact-inbox query from the running app,
// insert a test message through the app, and confirm the live result changes.
// Usage: NEON_REALTIME_URL=wss://... node scripts/neon-realtime-check.mjs [http://localhost:3001]
import { createRealtimeClient } from '@neon/realtime/client'

const base = process.argv[2] || 'http://localhost:3001'
const url = process.env.NEON_REALTIME_URL || process.env.NEXT_PUBLIC_NEON_REALTIME_URL
if (!url) throw new Error('NEON_REALTIME_URL is not set')

const seal = async () => {
  const res = await fetch(`${base}/api/neon/inbox/live`, { method: 'POST' })
  if (!res.ok) throw new Error(`seal ${res.status}: ${await res.text()}`)
  return res.json()
}

const client = createRealtimeClient({ url })
const sealed = await seal()
console.log('sealed query fingerprint', sealed.queryFingerprint, 'expires', new Date(sealed.expiresAt).toISOString())

const total = (rows) => rows.reduce((n, r) => n + Number(r.total), 0)
const sub = client.subscribe(sealed)
let updates = 0
let firstTotal = null

const done = new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`timed out; last state ${JSON.stringify(sub.getState())}`)), 45_000)
  sub.onChange((snapshot) => {
    const rows = snapshot.data ?? []
    updates += 1
    console.log(`update #${updates}: status=${snapshot.status} total=${total(rows)} rows=${JSON.stringify(rows)}`)
    if (snapshot.error) return reject(new Error(`realtime error: ${snapshot.error.message}`))
    if (snapshot.status === 'live' && firstTotal === null) {
      firstTotal = total(rows)
      fetch(`${base}/api/neon/inbox`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ name: 'Realtime check', message: `inserted at ${new Date().toISOString()}` }),
      })
        .then(async (r) => console.log('insert ->', r.status, await r.text()))
        .catch(reject)
    } else if (firstTotal !== null && total(rows) > firstTotal) {
      clearTimeout(timer)
      console.log(`LIVE UPDATE RECEIVED: ${firstTotal} -> ${total(rows)}`)
      resolve()
    }
  })
})

try {
  await done
  console.log('REALTIME OK')
  sub.unsubscribe()
  client.close()
  process.exit(0)
} catch (err) {
  console.error('REALTIME FAILED:', err.message)
  process.exit(1)
}
