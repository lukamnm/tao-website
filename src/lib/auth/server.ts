import 'server-only'
import { createNeonAuth } from '@neondatabase/auth/next/server'

// Neon Managed Better Auth (visitor accounts). NEON_AUTH_BASE_URL is written by `neon deploy` / `neon env pull`;
// NEON_AUTH_COOKIE_SECRET (32+ chars) is a local secret: `openssl rand -base64 32`.
// Payload's own admin users (/admin) are separate from this.
export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET! },
})

export const isNeonAuthConfigured = () =>
  !!process.env.NEON_AUTH_BASE_URL && (process.env.NEON_AUTH_COOKIE_SECRET?.length ?? 0) >= 32
