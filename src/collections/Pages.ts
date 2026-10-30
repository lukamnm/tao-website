import type { CollectionConfig } from 'payload'
import { contentHooks } from '@/lib/revalidate'
import { previewUrl } from '@/lib/preview'

// Long-form text pages rendered in the info layout: privacy policy, terms of use, complaints procedure.
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: 'ტექსტური გვერდი', plural: 'ტექსტური გვერდები' },
  admin: {
    useAsTitle: 'title',
    group: 'კონტენტი',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: 'კონფიდენციალურობის პოლიტიკა, საიტის წესები და პრეტენზიების წესი. სანამ აქ გვერდს არ შექმნი, საიტზე დიზაინის ტექსტი ჩანს.',
    preview: (doc, { locale }) => previewUrl(`/${doc.slug}`, locale),
  },
  access: { read: () => true },
  hooks: contentHooks,
  fields: [
    {
      name: 'slug',
      type: 'select',
      label: 'რომელი გვერდი',
      required: true,
      unique: true,
      options: [
        { label: 'კონფიდენციალურობის პოლიტიკა', value: 'privacy' },
        { label: 'საიტის გამოყენების წესები', value: 'terms' },
        { label: 'პრეტენზიების განხილვის წესი', value: 'complaints' },
      ],
    },
    { name: 'title', type: 'text', label: 'სათაური', required: true, localized: true },
    { name: 'intro', type: 'textarea', label: 'შესავალი', localized: true },
    { name: 'body', type: 'richText', label: 'ტექსტი', localized: true, required: true },
    { name: 'effectiveDate', type: 'date', label: 'ძალაშია (თარიღი)', admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd.MM.yyyy' } } },
  ],
}
