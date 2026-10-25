'use client'

import type { SealedLiveQuery } from '@neon/realtime/client'
import { useLiveQuery } from '@neon/realtime-react'
import { useCallback, useState } from 'react'

export type InboxRow = { status: string; total: number; latest: Date | string | null }

type Props = { sealedQuery: SealedLiveQuery<InboxRow>; initialData: InboxRow[] }

// Live counters of the contact inbox by status. Rows arrive from the server render first, then the
// subscription takes over; every committed insert/update in `contact_messages` updates the numbers.
export function LiveInbox({ sealedQuery, initialData }: Props) {
  const [query] = useState(sealedQuery) // renewals go through refreshQuery, not through re-renders
  const refreshQuery = useCallback(async () => {
    const res = await fetch('/api/neon/inbox/live', { method: 'POST' })
    if (!res.ok) throw new Error(`Could not renew the live query (${res.status})`)
    return (await res.json()) as SealedLiveQuery<InboxRow>
  }, [])
  const { data, status, error } = useLiveQuery(query, { refreshQuery, initialData })
  const rows = [...(data ?? initialData)].sort((a, b) => a.status.localeCompare(b.status))
  const total = rows.reduce((n, r) => n + Number(r.total), 0)

  return (
    <div data-live-status={status}>
      <p>
        Realtime status: <strong>{status}</strong>
        {error ? <span role="alert"> · {error.message}</span> : null}
      </p>
      <p>
        Contact messages: <strong data-testid="inbox-total">{total}</strong>
      </p>
      <ul>
        {rows.map((r) => (
          <li key={r.status}>
            {r.status}: {String(r.total)}
            {r.latest ? ` (latest ${new Date(r.latest).toISOString()})` : ''}
          </li>
        ))}
      </ul>
    </div>
  )
}
