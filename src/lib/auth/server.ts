import 'server-only'
import { createNeonAuth } from '@neondatabase/auth/next/server'

// Neon Managed Better Auth (visitor accounts). NEON_AUTH_BASE_URL is written by `neon deploy` / `neon env pull`;
// NEON_AUTH_COOKIE_SECRET (32+ chars) is a local secret: `openssl rand -base64 32`.
// Payload's own admin users (/admin) are separate from this.
// Without those variables (AWS hosting) visitor accounts are off: /auth and /account answer 404, and the
// client is never created (creating it without a cookie secret throws, which used to break `next build`).
export const isNeonAuthConfigured = () =>
  !!process.env.NEON_AUTH_BASE_URL && (process.env.NEON_AUTH_COOKIE_SECRET?.length ?? 0) >= 32

type NeonAuth = ReturnType<typeof createNeonAuth>
let instance: NeonAuth | undefined

export const auth = new Proxy({} as NeonAuth, {
  get(_target, prop) {
    instance ??= createNeonAuth({
      baseUrl: process.env.NEON_AUTH_BASE_URL!,
      cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET! },
    })
    return Reflect.get(instance, prop)
  },
})
