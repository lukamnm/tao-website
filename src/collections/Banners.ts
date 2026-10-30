import type { CollectionConfig } from 'payload'
import { contentHooks } from '@/lib/revalidate'
import { imageFields, linkField } from './fields'
import { previewUrl } from '@/lib/preview'

// Home page hero slides (photo, title, text, button) and the promo banner strip (photo + link only).
export const Banners: CollectionConfig = {
  slug: 'banners',
  labels: { singular: 'ბანერი', plural: 'ბანერები' },
  orderable: true,
  admin: {
    useAsTitle: 'title',
    group: 'კონტენტი',
    defaultColumns: ['title', 'placement', 'active'],
    description: 'მთავარი გვერდის დიდი სლაიდერი და პრომო-ბანერები (ფოტო-ზოლი გვერდის შუაში). რიგის შესაცვლელად გადაათრიე.',
    preview: (_doc, { locale }) => previewUrl('/', locale),
  },
  access: { read: () => true },
  hooks: contentHooks,
  fields: [
    {
      name: 'placement',
      type: 'radio',
      label: 'სად ჩანს',
      required: true,
      defaultValue: 'hero',
      options: [
        { label: 'დიდი სლაიდერი (გვერდის თავში)', value: 'hero' },
        { label: 'პრომო-ბანერი (მხოლოდ ფოტო და ბმული, გვერდის შუაში)', value: 'promo' },
      ],
      admin: { layout: 'horizontal' },
    },
    { name: 'title', type: 'text', label: 'სათაური', required: true, localized: true, admin: { description: 'პრომო-ბანერზე საიტზე არ ჩანს: მხოლოდ სიაში გეხმარება მის პოვნაში.' } },
    { name: 'text', type: 'textarea', label: 'ტექსტი', localized: true, admin: { description: '1 წინადადება', condition: (d) => d?.placement !== 'promo' } },
    ...imageFields({ label: 'ფოტო' }),
    { name: 'actionLabel', type: 'text', label: 'ღილაკის ტექსტი', localized: true, defaultValue: 'გაიგე მეტი', admin: { condition: (d) => d?.placement !== 'promo' } },
    linkField(),
    { name: 'active', type: 'checkbox', label: 'საიტზე ჩანს', defaultValue: true, admin: { components: { Cell: '/components/admin/YesNoCell#YesNoCell' }, position: 'sidebar' } },
    {
      type: 'collapsible',
      label: 'ჩვენების პერიოდი',
      admin: { position: 'sidebar', initCollapsed: true, description: 'სურვილისამებრ: ბანერი თავად ჩაირთვება და გაითიშება.' },
      fields: [
        { name: 'from', type: 'date', label: 'დან', admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd.MM.yyyy' } } },
        { name: 'until', type: 'date', label: 'მდე', admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'dd.MM.yyyy' } } },
      ],
    },
  ],
}
