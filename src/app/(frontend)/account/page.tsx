import { auth } from '@/lib/auth/server'
import { redirect } from 'next/navigation'
import { signOutAction } from '../auth/actions'

// Protected by src/proxy.ts (Neon Auth middleware); the session is checked again here.
export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const { data: session } = await auth.getSession()
  if (!session?.user) redirect('/auth/sign-in')
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 640, margin: '40px auto', padding: '0 16px' }}>
      <h1>Account</h1>
      <p>
        Signed in as <strong>{session.user.email}</strong>
        {session.user.name ? ` (${session.user.name})` : ''}
      </p>
      <form action={signOutAction}>
        <button type="submit">Sign out</button>
      </form>
    </main>
  )
}
