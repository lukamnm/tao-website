/* The starting entries of the editable lists. The same values are inserted by the migration
   src/migrations/20261030_110141_admin_lists.ts on PostgreSQL; the seed adds whatever is missing
   (a fresh SQLite file for local work). After that, editors change the lists in the admin. */

export type ListSlug = 'products' | 'news-categories' | 'offer-categories' | 'cities'
type Entry = { key: string; ka: Record<string, string>; en: Record<string, string>; [field: string]: unknown }

const simple = (key: string, ka: string, en: string): Entry => ({ key, ka: { name: ka }, en: { name: en } })

export const DEFAULT_LISTS: Record<ListSlug, Entry[]> = {
  products: [
    { key: 'health', icon: 'health', pagePath: '/health', showInMenu: true, ka: { name: 'ჯანმრთელობის დაზღვევა', shortName: 'ჯანმრთელობა', menuText: 'ექიმი, კვლევები, სტაციონარი', description: 'ექიმი, კვლევები და სტაციონარი ერთ პოლისში.' }, en: { name: 'Health insurance', shortName: 'Health', menuText: 'Doctor, tests, hospital', description: 'Doctor, tests and hospital in one policy.' } },
    { key: 'travel', icon: 'airplane', pagePath: '/travel', showInMenu: true, ka: { name: 'სამოგზაურო დაზღვევა', shortName: 'მოგზაურობა', menuText: 'სამედიცინო დაფარვა საზღვარგარეთ', description: 'სამედიცინო დაფარვა საზღვარგარეთ.' }, en: { name: 'Travel insurance', shortName: 'Travel', menuText: 'Medical cover abroad', description: 'Medical cover abroad.' } },
    { key: 'car', icon: 'car', ka: { name: 'ავტოდაზღვევა', shortName: 'ავტო', description: 'ავტომობილის დაცვა ყოველდღიურად.' }, en: { name: 'Car insurance', shortName: 'Car', description: 'Protection for your car, every day.' } },
    { key: 'property', icon: 'house', ka: { name: 'ქონების დაზღვევა', shortName: 'ქონება', description: 'სახლი და ქონება, დაცული.' }, en: { name: 'Property insurance', shortName: 'Property', description: 'Home and property, protected.' } },
  ],
  'news-categories': [simple('company', 'კომპანია', 'Company'), simple('products', 'პროდუქტები', 'Products'), simple('campaigns', 'კამპანიები', 'Campaigns'), simple('partners', 'პარტნიორობა', 'Partnerships')],
  'offer-categories': [simple('medical', 'კლინიკა და ლაბორატორია', 'Clinic and laboratory'), simple('pharmacy', 'აფთიაქი და ოპტიკა', 'Pharmacy and optics'), simple('sport', 'სპორტი და ფიტნესი', 'Sport and fitness'), simple('trip', 'მოგზაურობა', 'Travel')],
  cities: [simple('online', 'ონლაინ', 'Online'), simple('tbilisi', 'თბილისი', 'Tbilisi'), simple('batumi', 'ბათუმი', 'Batumi'), simple('kutaisi', 'ქუთაისი', 'Kutaisi')],
}
