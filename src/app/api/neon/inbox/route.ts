import configPromise from '@payload-config'
import { getPayload } from 'payload'

// Development-only helper: inserts a test contact message so the live inbox counters can be seen moving.
// In production the real contact form writes to the same collection; this route then refuses.
export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_TEST_INBOX !== '1') {
    return Response.json({ error: 'Disabled outside development' }, { status: 403 })
  }
  const body = (await request.json().catch(() => ({}))) as { name?: string; message?: string }
  const payload = await getPayload({ config: configPromise })
  const doc = await payload.create({
    collection: 'contact-messages',
    data: {
      name: body.name || 'Neon realtime test',
      phone: '+995 000 000 000',
      message: body.message || `Test message ${new Date().toISOString()}`,
      topic: 'general',
      status: 'new',
      locale: 'ka',
    },
  })
  return Response.json({ id: doc.id, createdAt: doc.createdAt })
}
