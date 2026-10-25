import { auth } from '@/lib/auth/server'

// Proxies the browser's auth calls to Neon Auth so the session cookie lives on this site's origin.
export const { GET, POST, PUT, DELETE, PATCH } = auth.handler()
