import { notFound } from 'next/navigation'
import { isNeonAuthConfigured } from '@/lib/auth/server'

// Visitor sign-in exists only where Neon Auth is configured; elsewhere these pages do not exist.
export const dynamic = 'force-dynamic'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  if (!isNeonAuthConfigured()) notFound()
  return children
}
