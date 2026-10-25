// Server-side call to the Neon Function "hello" (health endpoint running next to the database).
// NEON_FUNCTION_HELLO_BASE_URL is written by `neon deploy`; each branch has its own function URL.
export async function GET() {
  const base = process.env.NEON_FUNCTION_HELLO_BASE_URL
  if (!base) return Response.json({ error: 'NEON_FUNCTION_HELLO_BASE_URL is not set' }, { status: 503 })
  const started = Date.now()
  const res = await fetch(base, { cache: 'no-store' })
  const data = await res.json().catch(() => null)
  return Response.json(
    { url: base, status: res.status, roundTripMs: Date.now() - started, data },
    { status: res.ok ? 200 : 502, headers: { 'Cache-Control': 'no-store' } },
  )
}
