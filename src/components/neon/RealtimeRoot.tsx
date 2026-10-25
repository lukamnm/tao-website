'use client'

import { createRealtimeClient } from '@neon/realtime/client'
import { RealtimeProvider } from '@neon/realtime-react'
import { useState, type ReactNode } from 'react'

// One Realtime client per mounted app. Created inside the tree so the server render never connects.
export function RealtimeRoot({ children }: { children: ReactNode }) {
  const [client] = useState(() =>
    createRealtimeClient({ url: process.env.NEXT_PUBLIC_NEON_REALTIME_URL || 'wss://realtime.not-configured' }),
  )
  return <RealtimeProvider client={client}>{children}</RealtimeProvider>
}
