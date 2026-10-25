import type { CollectionConfig } from 'payload'
import { contentHooks } from '@/lib/revalidate'
import { CITIES, OFFER_CATEGORIES, OFFER_TYPES, PRODUCT_OPTIONS } from './options'
import { slugField } from './slug'

export const Offers: CollectionConfig = {
  slug: 'offers',
  labels: { singular: 'შეთავაზება', plural: 'შეთავაზებები' },
  admin: {
    useAsTitle: 'title',
    group: 'კონტენტი',
    defaultColumns: ['title', 'product', 'type', 'until', 'featured'],
  },
  access: { read: () => true },
  hooks: contentHooks,
  fields: [
    { name: 'title', type: 'text', label: 'სათაური', required: true, localized: true },
    slugField(),
    {
      type: 'row',
      fields: [
        { name: 'product', type: 'select', label: 'პროდუქტი', required: true, options: PRODUCT_OPTIONS },
        { name: 'type', type: 'select', label: 'ტიპი', required: true, defaultValue: 'discount', options: OFFER_TYPES },
        { name: 'category', type: 'select', label: 'პარტნიორის კატეგორია', options: OFFER_CATEGORIES, admin: { condition: (data) => data?.type === 'partner' } },
      ],
    },
    { name: 'cities', type: 'select', hasMany: true, label: 'სად მოქმედებს', defaultValue: ['online'], options: CITIES },
    {
      type: 'row',
      fields: [
        { name: 'value', type: 'text', label: 'ღირებულება (მაგ. 15% ან 50 ₾)', localized: true },
        { name: 'pct', type: 'number', label: 'ფასდაკლება % (სორტირებისთვის)', defaultValue: 0 },
      ],
    },
    { name: 'note', type: 'text', label: 'ღირებულების მინაწერი', localized: true, admin: { description: 'მაგ. "ოჯახის ყველა წევრი ერთ პოლისში"' } },
    { name: 'excerpt', type: 'textarea', label: 'მოკლე აღწერა', required: true, localized: true },
    { name: 'image', type: 'upload', relationTo: 'media', label: 'სურათი', required: true },
    { name: 'imagePosition', type: 'text', label: 'სურათის პოზიცია', defaultValue: '50% 50%' },
    {
      type: 'row',
      fields: [
        { name: 'from', type: 'date', label: 'მოქმედებს: დან', required: true },
        { name: 'until', type: 'date', label: 'მოქმედებს: მდე', required: true },
      ],
    },
    { name: 'body', type: 'richText', label: 'სრული აღწერა', localized: true },
    {
      name: 'steps',
      type: 'array',
      label: 'როგორ ვისარგებლო (ნაბიჯები)',
      localized: true,
      fields: [{ name: 'text', type: 'text', required: true, label: 'ნაბიჯი' }],
    },
    {
      name: 'terms',
      type: 'array',
      label: 'პირობები',
      localized: true,
      fields: [{ name: 'text', type: 'text', required: true, label: 'პირობა' }],
    },
    {
      name: 'partner',
      type: 'group',
      label: 'პარტნიორი',
      admin: { condition: (data) => data?.type === 'partner' },
      fields: [
        { name: 'name', type: 'text', label: 'სახელი', localized: true },
        { name: 'phone', type: 'text', label: 'ტელეფონი' },
        { name: 'address', type: 'text', label: 'მისამართი', localized: true },
        { name: 'website', type: 'text', label: 'ვებგვერდი (URL)' },
      ],
    },
    { name: 'featured', type: 'checkbox', label: 'მთავარ გვერდზე (გამორჩეული)', defaultValue: false },
    { name: 'order', type: 'number', label: 'რიგითობა', defaultValue: 0 },
  ],
}
