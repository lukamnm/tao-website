export const PRODUCT_OPTIONS = [
  { label: 'ჯანმრთელობის დაზღვევა', value: 'health' },
  { label: 'სამოგზაურო დაზღვევა', value: 'travel' },
  { label: 'ავტოდაზღვევა', value: 'car' },
  { label: 'ქონების დაზღვევა', value: 'property' },
]

export const PRODUCT_LABEL: Record<string, { ka: string; en: string; short: string; shortEn: string; icon: string; route: string }> = {
  health: { ka: 'ჯანმრთელობის დაზღვევა', en: 'Health insurance', short: 'ჯანმრთელობა', shortEn: 'Health', icon: 'health', route: '/health' },
  travel: { ka: 'სამოგზაურო დაზღვევა', en: 'Travel insurance', short: 'მოგზაურობა', shortEn: 'Travel', icon: 'airplane', route: '/travel' },
  car: { ka: 'ავტოდაზღვევა', en: 'Car insurance', short: 'ავტო', shortEn: 'Car', icon: 'car', route: '/car' },
  property: { ka: 'ქონების დაზღვევა', en: 'Property insurance', short: 'ქონება', shortEn: 'Property', icon: 'house', route: '/property' },
}

export const OFFER_TYPES = [
  { label: 'ფასდაკლება პოლისზე', value: 'discount' },
  { label: 'პაკეტი', value: 'bundle' },
  { label: 'პარტნიორის შეთავაზება', value: 'partner' },
]

export const OFFER_CATEGORIES = [
  { label: 'კლინიკა და ლაბორატორია', value: 'medical' },
  { label: 'აფთიაქი და ოპტიკა', value: 'pharmacy' },
  { label: 'სპორტი და ფიტნესი', value: 'sport' },
  { label: 'მოგზაურობა', value: 'trip' },
]

export const CITIES = [
  { label: 'ონლაინ', value: 'online' },
  { label: 'თბილისი', value: 'tbilisi' },
  { label: 'ბათუმი', value: 'batumi' },
  { label: 'ქუთაისი', value: 'kutaisi' },
]

export const NEWS_CATEGORIES = [
  { label: 'კომპანია', value: 'company' },
  { label: 'პროდუქტები', value: 'products' },
  { label: 'კამპანიები', value: 'campaigns' },
  { label: 'პარტნიორობა', value: 'partners' },
]
