'use server'

import { auth } from '@/lib/auth/server'
import { redirect } from 'next/navigation'

export type AuthFormState = { error?: string }

function field(form: FormData, name: string) {
  const v = form.get(name)
  return typeof v === 'string' ? v.trim() : ''
}

export async function signUpAction(_prev: AuthFormState, form: FormData): Promise<AuthFormState> {
  const name = field(form, 'name')
  const email = field(form, 'email')
  const password = field(form, 'password')
  if (!email || !password) return { error: 'Email and password are required' }
  const { error } = await auth.signUp.email({ name: name || email, email, password })
  if (error) return { error: error.message || 'Sign-up failed' }
  redirect('/account')
}

export async function signInAction(_prev: AuthFormState, form: FormData): Promise<AuthFormState> {
  const email = field(form, 'email')
  const password = field(form, 'password')
  if (!email || !password) return { error: 'Email and password are required' }
  const { error } = await auth.signIn.email({ email, password })
  if (error) return { error: error.message || 'Sign-in failed' }
  redirect('/account')
}

export async function signOutAction() {
  await auth.signOut()
  redirect('/')
}
