import type { CollectionConfig } from 'payload'
import { contentHooks } from '@/lib/revalidate'

// Home page hero slides and the promo banner block ("campaigns, benefits, announcements").
export const Banners: CollectionConfig = {
  slug: 'banners',
  labels: { singular: 'ბანერი', plural: 'ბანერები' },
  admin: {
    useAsTitle: 'title',
    group: 'კონტენტი',
    defaultColumns: ['title', 'placement', 'active', 'order'],
    description: 'მთავარი გვერდის სლაიდერი (hero) და პრომო-ბანერები.',
  },
  access: { read: () => true },
  hooks: contentHooks,
  fields: [
    {
      name: 'placement',
      type: 'select',
      label: 'ადგილი',
      required: true,
      defaultValue: 'hero',
      options: [
        { label: 'მთავარი სლაიდერი (hero)', value: 'hero' },
        { label: 'პრომო-ბანერი', value: 'promo' },
      ],
    },
    { name: 'kicker', type: 'text', label: 'ზედწარწერა (მაგ. კამპანია)', localized: true, admin: { condition: (data) => data?.placement === 'promo' } },
    { name: 'title', type: 'text', label: 'სათაური', required: true, localized: true },
    { name: 'text', type: 'textarea', label: 'ტექსტი', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'სურათი', required: true },
    { name: 'imagePosition', type: 'text', label: 'სურათის პოზიცია (object-position)', defaultValue: '50% 50%', admin: { description: 'მაგ. 80% 50%' } },
    { name: 'actionLabel', type: 'text', label: 'ღილაკის ტექსტი', localized: true, defaultValue: 'გაიგე მეტი' },
    { name: 'href', type: 'text', label: 'ბმული', required: true, admin: { description: 'შიდა გვერდი (/health, /offers/slug) ან სრული URL. "portal" - ტაოს პორტალი.' } },
    { name: 'active', type: 'checkbox', label: 'აქტიური', defaultValue: true },
    { name: 'order', type: 'number', label: 'რიგითობა', defaultValue: 0 },
    { name: 'from', type: 'date', label: 'ჩვენება: დან' },
    { name: 'until', type: 'date', label: 'ჩვენება: მდე' },
  ],
}
