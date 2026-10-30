import { APIError, type CollectionBeforeDeleteHook, type CollectionConfig, type CollectionSlug } from 'payload'
import { contentHooks } from '@/lib/revalidate'
import { keyField } from './slug'

/* Editable lists used across the site: products, news categories, partner categories, cities.
   Editors add, rename, reorder (drag) and remove entries; the site reads them from the database. */

const GROUP = 'კატეგორიები'

type Ref = { collection: CollectionSlug; field: string; label: string }

/** An entry still in use cannot be deleted: the editor gets a plain message saying where it is used. */
const blockDeleteIfUsed =
  (refs: Ref[]): CollectionBeforeDeleteHook =>
  async ({ req, id }) => {
    const used: string[] = []
    for (const r of refs) {
      const { totalDocs } = await req.payload.count({ collection: r.collection, where: { [r.field]: { in: [id] } }, req, overrideAccess: true })
      if (totalDocs) used.push(`${r.label}: ${totalDocs}`)
    }
    if (used.length) throw new APIError(`ვერ წაიშლება, რადგან ჯერ კიდევ გამოიყენება (${used.join(', ')}). ჯერ იმ ჩანაწერებში აირჩიე სხვა, ან წაშალე ისინი.`, 400, null, true)
  }

const listCollection = (slug: string, singular: string, plural: string, description: string, usedIn: Ref[]): CollectionConfig => ({
  slug,
  labels: { singular, plural },
  orderable: true,
  admin: {
    useAsTitle: 'name',
    group: GROUP,
    defaultColumns: ['name'],
    description,
  },
  access: { read: () => true },
  hooks: { ...contentHooks, beforeDelete: [blockDeleteIfUsed(usedIn)] },
  fields: [
    { name: 'name', type: 'text', label: 'სახელი', required: true, localized: true },
    keyField(),
  ],
})

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'პროდუქტი', plural: 'პროდუქტები' },
  orderable: true,
  admin: {
    useAsTitle: 'name',
    group: GROUP,
    defaultColumns: ['name', 'pagePath', 'showInMenu'],
    description: 'დაზღვევის პროდუქტები. ჩანს შეთავაზებებში, სიახლეებში, დოკუმენტებში და საიტის მენიუში. რიგის შესაცვლელად გადაათრიე.',
  },
  access: { read: () => true },
  hooks: {
    ...contentHooks,
    beforeDelete: [
      blockDeleteIfUsed([
        { collection: 'offers', field: 'product', label: 'შეთავაზებები' },
        { collection: 'news', field: 'product', label: 'სიახლეები' },
        { collection: 'documents', field: 'product', label: 'დოკუმენტები' },
        { collection: 'banners', field: 'link.product', label: 'ბანერები' },
      ]),
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', label: 'სახელი', required: true, localized: true, admin: { width: '60%', placeholder: 'მაგ: ჯანმრთელობის დაზღვევა' } },
        { name: 'shortName', type: 'text', label: 'მოკლე სახელი', localized: true, admin: { width: '40%', placeholder: 'მაგ: ჯანმრთელობა', description: 'ფილტრის ღილაკებზე' } },
      ],
    },
    {
      name: 'icon',
      type: 'text',
      label: 'აიქონი',
      required: true,
      defaultValue: 'shield-tick',
      admin: { components: { Field: '/components/admin/IconPickerField#IconPickerField' } },
    },
    { name: 'menuText', type: 'text', label: 'ქვესათაური მენიუში', localized: true, admin: { placeholder: 'მაგ: ექიმი, კვლევები, სტაციონარი' } },
    { name: 'description', type: 'text', label: 'მოკლე აღწერა', localized: true, admin: { description: 'ჩანს სიახლის გვერდზე, პროდუქტის ბარათში.' } },
    {
      name: 'pagePath',
      type: 'select',
      label: 'პროდუქტის გვერდი საიტზე',
      options: [
        { label: 'ჯანმრთელობის დაზღვევის გვერდი', value: '/health' },
        { label: 'სამოგზაურო დაზღვევის გვერდი', value: '/travel' },
        { label: 'ავტომობილის დაზღვევის გვერდი', value: '/car' },
      ],
      admin: { description: 'ახალ პროდუქტს საკუთარი გვერდი ჯერ არ აქვს: ის დიზაინით ემატება. მანამდე დატოვე ცარიელი.' },
    },
    { name: 'showInMenu', type: 'checkbox', label: 'მენიუში ჩვენება', defaultValue: false, admin: { components: { Cell: '/components/admin/YesNoCell#YesNoCell' }, description: 'მხოლოდ იმ პროდუქტებისთვის, რომლებსაც გვერდი აქვთ.' } },
    { name: 'portalUrl', type: 'text', label: 'ონლაინ ყიდვის ბმული (ტაოს პორტალი)', admin: { placeholder: 'https://portal.taoinsurance.ge/...', description: 'თუ ცარიელია, ღილაკი პორტალის მთავარ გვერდს გახსნის.' } },
    keyField(),
  ],
}

export const NewsCategories = listCollection('news-categories', 'სიახლის კატეგორია', 'სიახლის კატეგორიები', 'სიახლეების კატეგორიები (კომპანია, პროდუქტები...). ჩანს სიახლეების ფილტრში.', [{ collection: 'news', field: 'category', label: 'სიახლეები' }])
export const OfferCategories = listCollection('offer-categories', 'პარტნიორის კატეგორია', 'პარტნიორის კატეგორიები', 'პარტნიორების სფეროები (კლინიკა, აფთიაქი...). ჩანს შეთავაზებების ფილტრში.', [{ collection: 'offers', field: 'category', label: 'შეთავაზებები' }])
export const Cities = listCollection('cities', 'ქალაქი / რეგიონი', 'ქალაქები / რეგიონები', 'სად მოქმედებს პარტნიორის შეთავაზება. ჩანს შეთავაზებების ფილტრში "ქალაქი / რეგიონი". ონლაინ შეთავაზება ცალკე ინიშნება თავად შეთავაზებაში.', [{ collection: 'offers', field: 'cities', label: 'შეთავაზებები' }])
