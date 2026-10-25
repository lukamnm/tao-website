import { isRealtimeConfigured, sealInbox } from '@/lib/neon/realtime'

// Renews the sealed live query for the contact-inbox counters (same query, same fingerprint).
// The sealed query is a short-lived bearer token: never cache it.
export async function POST() {
  if (!isRealtimeConfigured()) {
    return Response.json({ error: 'Neon Realtime is not configured' }, { status: 503 })
  }
  const sealed = await sealInbox()
  return Response.json(sealed, { headers: { 'Cache-Control': 'no-store' } })
}
