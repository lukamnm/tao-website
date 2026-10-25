import type { CollectionConfig } from 'payload'
import { contentHooks } from '@/lib/revalidate'

// Long-form text pages rendered in the info layout: privacy policy, terms of use, complaints procedure.
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'ტექსტური გვერდი', plural: 'ტექსტური გვერდები' },
  admin: {
    useAsTitle: 'title',
    group: 'კონტენტი',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: 'კონფიდენციალურობის პოლიტიკა, საიტის წესები, პრეტენზიების წესი და სხვა ტექსტური გვერდები.',
  },
  access: { read: () => true },
  hooks: contentHooks,
  fields: [
    { name: 'title', type: 'text', label: 'სათაური', required: true, localized: true },
    { name: 'slug', type: 'text', label: 'URL (slug)', required: true, unique: true, admin: { position: 'sidebar', description: 'privacy, terms, complaints' } },
    { name: 'intro', type: 'textarea', label: 'შესავალი', localized: true },
    { name: 'body', type: 'richText', label: 'ტექსტი', localized: true, required: true },
    { name: 'effectiveDate', type: 'date', label: 'ძალაშია: თარიღიდან' },
  ],
}
