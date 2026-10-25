import type { CollectionConfig } from 'payload'
import { contentHooks } from '@/lib/revalidate'
import { PRODUCT_OPTIONS } from './options'

// PDF library: legal documents (terms, information sheets, samples, forms) and financial statements.
export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: { singular: 'დოკუმენტი', plural: 'დოკუმენტები' },
  admin: {
    useAsTitle: 'title',
    group: 'კონტენტი',
    defaultColumns: ['title', 'section', 'docType', 'product', 'date'],
  },
  access: { read: () => true },
  hooks: contentHooks,
  upload: {
    mimeTypes: ['application/pdf'],
  },
  fields: [
    { name: 'title', type: 'text', label: 'სათაური', required: true, localized: true },
    {
      name: 'section',
      type: 'select',
      label: 'განყოფილება',
      required: true,
      defaultValue: 'legal',
      options: [
        { label: 'იურიდიული ინფორმაცია', value: 'legal' },
        { label: 'ფინანსური ინფორმაცია', value: 'financial' },
      ],
    },
    {
      name: 'docType',
      type: 'select',
      label: 'ტიპი',
      required: true,
      defaultValue: 'terms',
      options: [
        { label: 'დაზღვევის პირობები', value: 'terms' },
        { label: 'საინფორმაციო ფურცელი', value: 'sheet' },
        { label: 'ნიმუშები და ფორმები', value: 'sample' },
        { label: 'წლიური ანგარიშგება (აუდიტირებული)', value: 'annual' },
        { label: 'კვარტალური ანგარიშგება', value: 'quarterly' },
        { label: 'სხვა', value: 'other' },
      ],
    },
    {
      name: 'product',
      type: 'select',
      label: 'პროდუქტი',
      defaultValue: 'general',
      options: [{ label: 'ზოგადი', value: 'general' }, ...PRODUCT_OPTIONS],
    },
    { name: 'date', type: 'date', label: 'თარიღი', required: true, admin: { date: { pickerAppearance: 'monthOnly', displayFormat: 'MMMM yyyy' } } },
    { name: 'quarter', type: 'select', label: 'კვარტალი', options: ['Q1', 'Q2', 'Q3', 'Q4'].map((q) => ({ label: q, value: q })), admin: { condition: (data) => data?.docType === 'quarterly' } },
    { name: 'code', type: 'text', label: 'დოკუმენტის კოდი', admin: { description: 'მაგ. TAO/HI/R-001/26' } },
    { name: 'order', type: 'number', label: 'რიგითობა', defaultValue: 0 },
  ],
}
