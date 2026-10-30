import type { CollectionConfig } from 'payload'
import { contentHooks } from '@/lib/revalidate'

// PDF library: legal documents (terms, information sheets, samples, forms) and financial statements.
export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: { singular: 'დოკუმენტი', plural: 'დოკუმენტები' },
  admin: {
    useAsTitle: 'title',
    group: 'კონტენტი',
    defaultColumns: ['title', 'section', 'docType', 'product', 'date'],
    listSearchableFields: ['title', 'code'],
    description: 'PDF ფაილები: დაზღვევის პირობები, ფორმები და ფინანსური ანგარიშგება. ჩანს იურიდიული და ფინანსური ინფორმაციის გვერდებზე.',
  },
  access: { read: () => true },
  hooks: contentHooks,
  upload: { mimeTypes: ['application/pdf', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'] },
  defaultSort: '-date',
  fields: [
    { name: 'title', type: 'text', label: 'დოკუმენტის სახელი', required: true, localized: true, admin: { placeholder: 'მაგ: სამოგზაურო დაზღვევის პირობები' } },
    {
      type: 'row',
      fields: [
        {
          name: 'section',
          type: 'select',
          label: 'რომელ გვერდზე',
          required: true,
          defaultValue: 'legal',
          options: [
            { label: 'იურიდიული ინფორმაცია', value: 'legal' },
            { label: 'ფინანსური ინფორმაცია', value: 'financial' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'docType',
          type: 'select',
          label: 'დოკუმენტის სახე',
          required: true,
          defaultValue: 'terms',
          options: [
            { label: 'დაზღვევის პირობები', value: 'terms' },
            { label: 'საინფორმაციო ფურცელი', value: 'sheet' },
            { label: 'ნიმუში ან ფორმა', value: 'sample' },
            { label: 'კორპორატიული დოკუმენტი (წესდება, ლიცენზია...)', value: 'other' },
            { label: 'წლიური ანგარიშგება', value: 'annual' },
            { label: 'კვარტალური ანგარიშგება', value: 'quarterly' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'product', type: 'relationship', relationTo: 'products', label: 'პროდუქტი', admin: { width: '50%', description: 'ცარიელი = ზოგადი დოკუმენტი' } },
        { name: 'date', type: 'date', label: 'გამოქვეყნების თარიღი', required: true, admin: { width: '25%', date: { pickerAppearance: 'monthOnly', displayFormat: 'MM.yyyy' } } },
        { name: 'quarter', type: 'select', label: 'კვარტალი', options: ['Q1', 'Q2', 'Q3', 'Q4'].map((q) => ({ label: q, value: q })), admin: { width: '25%', condition: (d) => d?.docType === 'quarterly' } },
      ],
    },
    { name: 'code', type: 'text', label: 'დოკუმენტის კოდი', admin: { placeholder: 'მაგ: TAO/HI/R-001/26', description: 'სურვილისამებრ. ძიებაში გამოიყენება.' } },
  ],
}
