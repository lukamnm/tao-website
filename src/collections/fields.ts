import type { Field } from 'payload'

/** Photo + the point that must always stay visible when the photo is cropped (picked by clicking the photo). */
export const imageFields = (opts: { required?: boolean; label?: string } = {}): Field[] => [
  { name: 'image', type: 'upload', relationTo: 'media', label: opts.label || 'ფოტო', required: opts.required ?? true },
  {
    name: 'imagePosition',
    type: 'text',
    label: 'ფოტოს მთავარი წერტილი',
    defaultValue: '50% 50%',
    admin: {
      components: { Field: '/components/admin/ImagePositionField#ImagePositionField' },
      condition: (data, sibling) => !!sibling?.image,
    },
  },
]

export const SITE_PAGES = [
  { label: 'მთავარი გვერდი', value: '/' },
  { label: 'მთავარი გვერდი - პროდუქტები', value: '/#products' },
  { label: 'ჯანმრთელობის დაზღვევა', value: '/health' },
  { label: 'სამოგზაურო დაზღვევა', value: '/travel' },
  { label: 'ავტომობილის კორპორატიული დაზღვევა', value: '/car' },
  { label: 'შეთავაზებები', value: '/offers' },
  { label: 'სიახლეები', value: '/news' },
  { label: 'ჩვენ შესახებ', value: '/about' },
  { label: 'კონტაქტი', value: '/contact' },
  { label: 'იურიდიული ინფორმაცია', value: '/legal' },
  { label: 'ფინანსური ინფორმაცია', value: '/financial' },
  { label: 'პრეტენზიების განხილვის წესი', value: '/complaints' },
  { label: 'კონფიდენციალურობის პოლიტიკა', value: '/privacy' },
  { label: 'საიტის გამოყენების წესები', value: '/terms' },
]

/** Where a button leads: chosen from lists instead of typing an address. */
export const linkField = (name = 'link', label = 'სად გადავიდეს ღილაკი'): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    {
      name: 'type',
      type: 'radio',
      label: 'ბმულის ტიპი',
      defaultValue: 'page',
      options: [
        { label: 'საიტის გვერდი', value: 'page' },
        { label: 'შეთავაზება', value: 'offer' },
        { label: 'სიახლე', value: 'news' },
        { label: 'ონლაინ ყიდვა (პორტალი)', value: 'portal' },
        { label: 'სხვა საიტი', value: 'url' },
      ],
      admin: { layout: 'horizontal' },
    },
    { name: 'page', type: 'select', label: 'გვერდი', options: SITE_PAGES, admin: { condition: (_, s) => s?.type === 'page' } },
    { name: 'offer', type: 'relationship', relationTo: 'offers', label: 'შეთავაზება', admin: { condition: (_, s) => s?.type === 'offer' } },
    { name: 'news', type: 'relationship', relationTo: 'news', label: 'სიახლე', admin: { condition: (_, s) => s?.type === 'news' } },
    { name: 'product', type: 'relationship', relationTo: 'products', label: 'რომელი პროდუქტის ყიდვა', admin: { condition: (_, s) => s?.type === 'portal', description: 'ცარიელი = პორტალის მთავარი გვერდი' } },
    { name: 'url', type: 'text', label: 'მისამართი', admin: { condition: (_, s) => s?.type === 'url', placeholder: 'https://...' } },
  ],
})
