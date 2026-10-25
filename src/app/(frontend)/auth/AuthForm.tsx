'use client'

import { useActionState } from 'react'
import type { AuthFormState } from './actions'

type Props = {
  title: string
  action: (prev: AuthFormState, form: FormData) => Promise<AuthFormState>
  withName?: boolean
  footer: React.ReactNode
}

export function AuthForm({ title, action, withName, footer }: Props) {
  const [state, formAction, pending] = useActionState(action, {})
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 420, margin: '40px auto', padding: '0 16px' }}>
      <h1>{title}</h1>
      <form action={formAction} style={{ display: 'grid', gap: 12 }}>
        {withName ? (
          <label>
            Name <input name="name" autoComplete="name" />
          </label>
        ) : null}
        <label>
          Email <input name="email" type="email" required autoComplete="email" />
        </label>
        <label>
          Password <input name="password" type="password" required minLength={8} autoComplete={withName ? 'new-password' : 'current-password'} />
        </label>
        {state.error ? <p role="alert">{state.error}</p> : null}
        <button type="submit" disabled={pending}>
          {pending ? 'Please wait' : title}
        </button>
      </form>
      <p>{footer}</p>
    </main>
  )
}
