import type { CollectionConfig } from 'payload'
import { contentHooks } from '@/lib/revalidate'
import { NEWS_CATEGORIES, PRODUCT_OPTIONS } from './options'
import { slugField } from './slug'

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'სიახლე', plural: 'სიახლეები' },
  admin: {
    useAsTitle: 'title',
    group: 'კონტენტი',
    defaultColumns: ['title', 'category', 'date', 'published'],
  },
  access: { read: () => true },
  hooks: contentHooks,
  defaultSort: '-date',
  fields: [
    { name: 'title', type: 'text', label: 'სათაური', required: true, localized: true },
    slugField(),
    {
      type: 'row',
      fields: [
        { name: 'category', type: 'select', label: 'კატეგორია', required: true, defaultValue: 'company', options: NEWS_CATEGORIES },
        { name: 'product', type: 'select', label: 'პროდუქტი (სურვილისამებრ)', options: PRODUCT_OPTIONS },
        { name: 'date', type: 'date', label: 'თარიღი', required: true, defaultValue: () => new Date().toISOString() },
      ],
    },
    { name: 'excerpt', type: 'textarea', label: 'მოკლე აღწერა', required: true, localized: true },
    { name: 'lead', type: 'textarea', label: 'შესავალი აბზაცი', localized: true },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'სურათი', required: true },
    { name: 'imagePosition', type: 'text', label: 'სურათის პოზიცია', defaultValue: '50% 50%' },
    { name: 'body', type: 'richText', label: 'სტატია', localized: true },
    { name: 'published', type: 'checkbox', label: 'გამოქვეყნებული', defaultValue: true },
  ],
}
