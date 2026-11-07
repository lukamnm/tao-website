import { auth, isNeonAuthConfigured } from '@/lib/auth/server'

// Proxies the browser's auth calls to Neon Auth so the session cookie lives on this site's origin.
// Without Neon Auth (AWS hosting) the route answers 404.
type Handler = (req: Request, ctx: { params: Promise<{ path: string[] }> }) => Promise<Response>
const off: Handler = async () => new Response('Not found', { status: 404 })
const handlers = isNeonAuthConfigured() ? (auth.handler() as unknown as Record<string, Handler>) : null

export const GET: Handler = handlers ? handlers.GET : off
export const POST: Handler = handlers ? handlers.POST : off
export const PUT: Handler = handlers ? handlers.PUT : off
export const DELETE: Handler = handlers ? handlers.DELETE : off
export const PATCH: Handler = handlers ? handlers.PATCH : off
