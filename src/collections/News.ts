import type { CollectionConfig } from 'payload'
import { contentHooks } from '@/lib/revalidate'
import { slugField } from './slug'
import { imageFields } from './fields'
import { previewUrl } from '@/lib/preview'

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'სიახლე', plural: 'სიახლეები' },
  admin: {
    useAsTitle: 'title',
    group: 'კონტენტი',
    defaultColumns: ['title', 'category', 'date', 'published'],
    listSearchableFields: ['title'],
    description: 'კომპანიის ამბები და სტატიები. უახლესი ჩანს მთავარ გვერდზე.',
    preview: (doc, { locale }) => previewUrl(`/news/${doc.slug}`, locale),
  },
  access: { read: () => true },
  hooks: contentHooks,
  defaultSort: '-date',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'ძირითადი',
          fields: [
            { name: 'title', type: 'text', label: 'სათაური', required: true, localized: true },
            {
              type: 'row',
              fields: [
                { name: 'category', type: 'relationship', relationTo: 'news-categories', label: 'კატეგორია', required: true, admin: { width: '34%' } },
                { name: 'product', type: 'relationship', relationTo: 'products', label: 'პროდუქტი', admin: { width: '33%', description: 'თუ სიახლე კონკრეტულ პროდუქტს ეხება' } },
                { name: 'date', type: 'date', label: 'თარიღი', required: true, defaultValue: () => new Date().toISOString(), admin: { width: '33%', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd.MM.yyyy' } } },
              ],
            },
            { name: 'excerpt', type: 'textarea', label: 'მოკლე აღწერა', required: true, localized: true, admin: { description: '1-2 წინადადება. ჩანს სიახლეების სიაში.' } },
            ...imageFields(),
          ],
        },
        {
          label: 'სტატია',
          fields: [
            { name: 'lead', type: 'textarea', label: 'შესავალი', localized: true, admin: { description: 'პირველი აბზაცი, დიდი შრიფტით.' } },
            { name: 'body', type: 'richText', label: 'ტექსტი', localized: true },
          ],
        },
      ],
    },
    { name: 'published', type: 'checkbox', label: 'საიტზე ჩანს', defaultValue: true, admin: { components: { Cell: '/components/admin/YesNoCell#YesNoCell' }, position: 'sidebar', description: 'მოხსენი მონიშვნა, თუ ჯერ არ გინდა გამოქვეყნება.' } },
    slugField(),
  ],
}
