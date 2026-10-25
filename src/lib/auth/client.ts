'use client'
import { createAuthClient } from '@neondatabase/auth/next'

// Browser client: talks to the same-origin proxy at /api/auth (no options allowed here).
export const authClient = createAuthClient()
