'use client'
import React from 'react'
import { InfoPage, InfoSection, DocList } from './info'
import type { DocumentVM } from '@/lib/content'

/* "Other information" (/other), design v7: three PDF lists, one under another. The documents come from the
   admin (Documents, "რომელ გვერდზე" = სხვა ინფორმაცია: ...). The old /privacy, /terms and /complaints URLs
   redirect here (src/proxy.ts); #privacy and #complaints jump to their list. */

export function Other({ privacy, complaints, other }: { privacy: DocumentVM[]; complaints: DocumentVM[]; other: DocumentVM[] }) {
  return (
    <InfoPage current="/other" title="სხვა ინფორმაცია">
      <InfoSection id="privacy" title="კონფიდენციალურობის პოლიტიკა">
        <DocList docs={privacy} emptyText="დოკუმენტები მალე დაემატება." />
      </InfoSection>
      <InfoSection id="complaints" title="პრეტენზიის განხილვის პროცედურა">
        <DocList docs={complaints} emptyText="დოკუმენტები მალე დაემატება." />
      </InfoSection>
      <InfoSection id="documents" title="სხვა დოკუმენტები">
        <DocList docs={other} emptyText="დოკუმენტები მალე დაემატება." />
      </InfoSection>
    </InfoPage>
  )
}
