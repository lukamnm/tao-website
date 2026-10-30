import type { CollectionConfig } from 'payload'
import { contentHooks } from '@/lib/revalidate'
import { OFFER_TYPES } from './options'
import { slugField } from './slug'
import { imageFields } from './fields'
import { previewUrl } from '@/lib/preview'

export const Offers: CollectionConfig = {
  slug: 'offers',
  labels: { singular: 'შეთავაზება', plural: 'შეთავაზებები' },
  admin: {
    useAsTitle: 'title',
    group: 'კონტენტი',
    defaultColumns: ['title', 'product', 'until', 'featured'],
    listSearchableFields: ['title'],
    description: 'აქციები, ფასდაკლებები და პარტნიორების შეთავაზებები. ვადაგასული შეთავაზება საიტზე ავტომატურად ქრება.',
    preview: (doc, { locale }) => previewUrl(`/offers/${doc.slug}`, locale),
  },
  access: { read: () => true },
  hooks: {
    ...contentHooks,
    beforeChange: [
      // "15%" -> 15, used for the "biggest discount" sort; nobody has to fill it in.
      ({ data }) => {
        const v = typeof data?.value === 'string' ? data.value : ''
        const m = v.match(/(\d+(?:[.,]\d+)?)\s*%/)
        return { ...data, pct: m ? Math.round(parseFloat(m[1].replace(',', '.'))) : 0 }
      },
    ],
  },
  defaultSort: '-from',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'ძირითადი',
          fields: [
            { name: 'title', type: 'text', label: 'სათაური', required: true, localized: true, admin: { placeholder: 'მაგ: სამოგზაურო პოლისი 15%-იანი ფასდაკლებით' } },
            {
              type: 'row',
              fields: [
                { name: 'product', type: 'relationship', relationTo: 'products', label: 'პროდუქტი', required: true, admin: { width: '50%' } },
                {
                  name: 'type',
                  type: 'select',
                  label: 'შეთავაზების სახე',
                  required: true,
                  defaultValue: 'discount',
                  options: OFFER_TYPES,
                  admin: { width: '50%', description: 'პარტნიორის შეთავაზებაზე ჩნდება პარტნიორის ველები და ღილაკი მის საიტზე.' },
                },
              ],
            },
            { name: 'excerpt', type: 'textarea', label: 'მოკლე აღწერა', required: true, localized: true, admin: { description: '1-2 წინადადება. ჩანს ბარათზე და გვერდის თავში.' } },
            {
              type: 'row',
              fields: [
                { name: 'value', type: 'text', label: 'ფასდაკლება', localized: true, admin: { width: '35%', placeholder: '15% ან 50 ₾', description: 'დიდი ციფრი ფოტოზე' } },
                { name: 'note', type: 'text', label: 'ფასდაკლების ახსნა', localized: true, admin: { width: '65%', placeholder: 'მაგ: ოჯახის ყველა წევრი ერთ პოლისში' } },
              ],
            },
            ...imageFields(),
            {
              type: 'row',
              fields: [
                { name: 'from', type: 'date', label: 'მოქმედებს დან', required: true, admin: { width: '50%', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd.MM.yyyy' } } },
                { name: 'until', type: 'date', label: 'მოქმედებს მდე', required: true, admin: { width: '50%', date: { pickerAppearance: 'dayOnly', displayFormat: 'dd.MM.yyyy' }, description: 'ამ დღის შემდეგ საიტზე აღარ ჩანს' } },
              ],
            },
          ],
        },
        {
          label: 'სად მოქმედებს',
          fields: [
            { name: 'category', type: 'relationship', relationTo: 'offer-categories', label: 'პარტნიორის კატეგორია', admin: { condition: (d) => d?.type === 'partner' } },
            { name: 'cities', type: 'relationship', relationTo: 'cities', hasMany: true, label: 'ქალაქები', admin: { description: 'ჩვეულებრივ "ონლაინ". პარტნიორისთვის აირჩიე ქალაქები, სადაც ფილიალები აქვს.' } },
            {
              name: 'partner',
              type: 'group',
              label: 'პარტნიორი',
              admin: { condition: (d) => d?.type === 'partner' },
              fields: [
                { name: 'name', type: 'text', label: 'პარტნიორის სახელი', localized: true },
                { type: 'row', fields: [
                  { name: 'phone', type: 'text', label: 'ტელეფონი', admin: { width: '50%' } },
                  { name: 'website', type: 'text', label: 'ვებგვერდი', admin: { width: '50%', placeholder: 'https://...' } },
                ] },
                { name: 'address', type: 'text', label: 'მისამართი', localized: true },
              ],
            },
          ],
        },
        {
          label: 'სრული ტექსტი',
          description: 'სურვილისამებრ. თუ ცარიელს დატოვებ, საიტი სტანდარტულ ტექსტს აჩვენებს.',
          fields: [
            { name: 'body', type: 'richText', label: 'დეტალური აღწერა', localized: true },
            { name: 'steps', type: 'array', label: 'როგორ ვისარგებლო', localized: true, labels: { singular: 'ნაბიჯი', plural: 'ნაბიჯები' }, fields: [{ name: 'text', type: 'text', required: true, label: 'ნაბიჯი' }] },
            { name: 'terms', type: 'array', label: 'პირობები', localized: true, labels: { singular: 'პირობა', plural: 'პირობები' }, fields: [{ name: 'text', type: 'text', required: true, label: 'პირობა' }] },
          ],
        },
      ],
    },
    slugField(),
    { name: 'featured', type: 'checkbox', label: 'მთავარ გვერდზე ჩვენება', defaultValue: false, admin: { components: { Cell: '/components/admin/YesNoCell#YesNoCell' }, position: 'sidebar', description: 'მთავარ გვერდზე ჩანს 3 მონიშნული შეთავაზება.' } },
    { name: 'pct', type: 'number', defaultValue: 0, admin: { hidden: true } },
  ],
}
