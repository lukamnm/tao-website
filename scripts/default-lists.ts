/* The starting entries of the editable lists. The same values are inserted by the migrations
   src/migrations/20261030_110141_admin_lists.ts, 20261030_130100_design_v2_data.ts and 20261103_125900_design_v4_data.ts on PostgreSQL; the seed adds whatever is missing
   (a fresh SQLite file for local work). After that, editors change the lists in the admin. */

export type ListSlug = 'products' | 'news-categories' | 'offer-categories' | 'cities'
type Entry = { key: string; ka: Record<string, string>; en: Record<string, string>; [field: string]: unknown }

const simple = (key: string, ka: string, en: string): Entry => ({ key, ka: { name: ka }, en: { name: en } })

export const DEFAULT_LISTS: Record<ListSlug, Entry[]> = {
  products: [
    { key: 'health', icon: 'health', pagePath: '/health', showInMenu: true, ka: { name: 'ჯანმრთელობის დაზღვევა', shortName: 'ჯანმრთელობა', menuText: 'ექიმი, კვლევები, სტაციონარი', description: 'ექიმი, კვლევები და სტაციონარი ერთ პოლისში' }, en: { name: 'Health insurance', shortName: 'Health', menuText: 'Doctor, tests, hospital', description: 'Doctor, tests and hospital in one policy' } },
    { key: 'travel', icon: 'airplane', pagePath: '/travel', showInMenu: true, ka: { name: 'სამოგზაურო დაზღვევა', shortName: 'მოგზაურობა', menuText: 'სამედიცინო დაფარვა საზღვარგარეთ', description: 'სამედიცინო დაფარვა საზღვარგარეთ' }, en: { name: 'Travel insurance', shortName: 'Travel', menuText: 'Medical cover abroad', description: 'Medical cover abroad' } },
    { key: 'car', icon: 'car', pagePath: '/car', showInMenu: true, ka: { name: 'ავტომობილის კორპორატიული დაზღვევა', shortName: 'ავტო', description: 'კომპანიის ავტოპარკის დაცვა დაზიანების, ქურდობისა და მესამე პირის მიმართ პასუხისმგებლობისგან' }, en: { name: 'Corporate motor insurance', shortName: 'Car', description: 'Protection for your company fleet against damage, theft and third-party liability' } },
    { key: 'property', icon: 'building', pagePath: '/property', showInMenu: true, ka: { name: 'ქონების კორპორატიული დაზღვევა', shortName: 'ქონება', description: 'ქონების დაზღვევა დაგეხმარებათ დაიცვათ თქვენი ბიზნესის კუთვნილი ქონება და უზრუნველყოფს თქვენს ფინანსურ სტაბილურობას' }, en: { name: 'Corporate property insurance', shortName: 'Property', description: 'Property insurance helps you protect your business property and ensures your financial stability' } },
  ],
  'news-categories': [simple('providers', 'პროვაიდერები', 'Providers'), simple('services', 'სერვისები', 'Services'), simple('portal', 'პორტალი / აპი', 'Portal / app'), simple('company', 'კომპანია', 'Company')],
  'offer-categories': [simple('medical', 'კლინიკა და ლაბორატორია', 'Clinic and laboratory'), simple('pharmacy', 'აფთიაქი და ოპტიკა', 'Pharmacy and optics'), simple('sport', 'სპორტი და ფიტნესი', 'Sport and fitness'), simple('trip', 'მოგზაურობა', 'Travel')],
  cities: [simple('tbilisi', 'თბილისი', 'Tbilisi'), simple('batumi', 'ბათუმი', 'Batumi'), simple('kutaisi', 'ქუთაისი', 'Kutaisi')],
}
