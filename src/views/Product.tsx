'use client'
import React, { useState } from 'react'
import { Button, Icon, SectionMarker } from '@/ds'
import { useSite } from '@/site/SiteProvider'
import { Breadcrumb } from './shared'
import { OfferCard } from './OfferCard'
import type { OfferVM } from '@/lib/content'

/* Product pages (design "Health", "Travel", "Car" - ავტომობილის კორპორატიული დაზღვევა,
   "Property" - ქონების კორპორატიული დაზღვევა). */

export type ProductConfig = {
  product: 'health' | 'travel' | 'car' | 'property'
  /** hero title lines (joined with a space for the breadcrumb and aria-label) */
  title: string[]
  /** hero title font-size (default: the two-line size) */
  titleSize?: string
  lead: string
  image: string
  imageAlt: string
  imagePos: string
  /** section 01 title (default "რას ფარავს") */
  coversTitle?: string
  /** section 01 grid columns (default 4) */
  coversCols?: number
  /** section 01 card min-height (default 240) */
  coverMinHeight?: number
  /** smaller card titles (property: 18px / 1.3) */
  coverTitleSmall?: boolean
  covers: { icon: string; title: string; text?: string }[]
  /** paragraphs under the section 01 grid (property) */
  coversProse?: string[]
  schemes?: { icon: string; title: string; steps: string[] }[]
  schemesTitle?: string
  schemesText?: string
  /** section 02 "coverage area" (car): numbered cards in the cover style, then text cards */
  area?: {
    title: string
    items: { icon: string; title: string; note?: string }[]
    cards: { title: string; text: string }[]
  }
  /** section 02 "property types" (property): bullet list, then an add-on card */
  types?: {
    title: string
    items: string[]
    extra: { label: string; title: string; texts: string[] }
  }
  faq: { q: string; a: string }[]
}

export const HEALTH: ProductConfig = {
  product: 'health',
  title: ['ჯანმრთელობის', 'დაზღვევა'],
  lead: 'იზრუნე ჯანმრთელობაზე და ხარჯები ჩვენ მოგვანდე. პოლისი შენთვის, შენი ოჯახისთვის და შენი გუნდისთვის.',
  image: '/img/hero-health-clinic.jpg',
  imageAlt: 'ექიმი პაციენტს ესაუბრება კლინიკაში',
  imagePos: '78% 50%',
  covers: [
    { icon: 'health', title: 'ამბულატორიული მომსახურება', text: 'ექიმის კონსულტაციები და დიაგნოსტიკური კვლევები' },
    { icon: 'building', title: 'სტაციონარული მკურნალობა', text: 'ჰოსპიტალიზაცია და ოპერაციები' },
    { icon: '24-support', title: 'გადაუდებელი დახმარება', text: 'სასწრაფო სამედიცინო დახმარება 24/7' },
    { icon: 'receipt-item', title: 'მედიკამენტები', text: 'წამლების ხარჯის ნაწილობრივი ანაზღაურება' },
    { icon: 'security-safe', title: 'სტომატოლოგია', text: 'პაკეტის მიხედვით' },
    { icon: 'call-calling', title: 'ოჯახის ექიმი', text: 'ოჯახის ექიმის კონსულტაციები, მათ შორის სატელეფონო და ვიდეო' },
    { icon: 'shield-tick', title: 'დაავადებათა პროფილაქტიკა', text: 'პროფილაქტიკური შემოწმებები, პაკეტის მიხედვით' },
    { icon: 'calendar', title: 'გეგმური ჰოსპიტალიზაცია', text: 'წინასწარ დაგეგმილი მკურნალობა სტაციონარში' },
  ],
  faq: [
    { q: 'როდიდან იწყებს პოლისი მოქმედებას?', a: 'მოქმედების დაწყების თარიღი ხელშეკრულებაშია მითითებული. ზოგიერთ მომსახურებაზე შეიძლება მოლოდინის პერიოდი მოქმედებდეს.' },
    { q: 'რომელ კლინიკებში შემიძლია მომსახურების მიღება?', a: 'პარტნიორი კლინიკების სიას პოლისთან ერთად მიიღებ' },
    { q: 'შემიძლია ოჯახის წევრების დაზღვევა?', a: 'კი, ოჯახის წევრების ჩართვა ერთ პოლისში შეგიძლია' },
    { q: 'როგორ მივიღო ანაზღაურება?', a: 'დაგვიკავშირდი ცხელ ხაზზე ან მოთხოვნა პორტალზე გამოგზავნე - საჭირო დოკუმენტებს ჩვენ გეტყვით' },
    { q: 'რა უნდა გავითვალისწინო შეძენამდე?', a: 'საქართველოს კანონმდებლობით, კერძო დაზღვევის შეძენისას ვერ ისარგებლებ საყოველთაო ჯანდაცვის პროგრამის სტანდარტული პაკეტით. კერძო დაზღვევის გაუქმების შემთხვევაში, იგივე პირობა 6 თვის განმავლობაში მოქმედებს.' },
  ],
}

export const TRAVEL: ProductConfig = {
  product: 'travel',
  title: ['სამოგზაურო', 'დაზღვევა'],
  lead: 'ჩაალაგე ჩემოდანი, დანარჩენზე ჩვენ ვიზრუნებთ. სამედიცინო დაფარვა საზღვარგარეთ, ნებისმიერი მოგზაურობისთვის.',
  image: '/img/hero-travel-airport.jpg',
  imageAlt: 'მგზავრი ჩემოდნით აეროპორტში',
  imagePos: '82% 50%',
  covers: [
    { icon: 'health', title: 'სამედიცინო ხარჯები', text: 'მკურნალობა საზღვარგარეთ, მოულოდნელი ავადმყოფობის ან ტრავმის დროს' },
    { icon: '24-support', title: 'ასისტანსი 24/7', text: 'დახმარება ნებისმიერ დროს, ნებისმიერ ქვეყანაში' },
    { icon: 'airplane', title: 'სამედიცინო ტრანსპორტირება', text: 'საჭიროების შემთხვევაში, სამშობლოში დაბრუნება' },
    { icon: 'receipt-item', title: 'ბარგი', text: 'დაკარგული ან დაგვიანებული ბარგი, პაკეტის მიხედვით' },
    { icon: 'building', title: 'გადაუდებელი ჰოსპიტალიზაცია', text: 'სტაციონარული მკურნალობა, პოლისის ლიმიტის ფარგლებში' },
    { icon: 'security-safe', title: 'გადაუდებელი სტომატოლოგია', text: 'სტომატოლოგიური დახმარება მწვავე ტკივილის დროს' },
    { icon: 'calendar', title: 'რეისის გადადება', text: 'დამატებითი სერვისი, პაკეტის მიხედვით' },
    { icon: 'global', title: 'მთელი მსოფლიო', text: 'პოლისი მოქმედებს არჩეულ ქვეყნებში' },
  ],
  schemesTitle: 'საზღვარგარეთ',
  schemesText: 'რა უნდა გააკეთო, თუ მოგზაურობისას დახმარება დაგჭირდა',
  schemes: [
    { icon: '24-support', title: 'თუ ექიმი დაგჭირდა', steps: ['დარეკე ასისტანსის ნომერზე, რომელიც პოლისზეა მითითებული', 'გეტყვიან, რომელ პარტნიორ კლინიკაში მიხვიდე', 'კლინიკასთან ანგარიშსწორებას ჩვენ მოვახდენთ, ფრანშიზის შემთხვევაში, შენ მხოლოდ შენი წილის გადახდა მოგიწევს'] },
    { icon: 'receipt-item', title: 'თუ თავად გადაიხადე', steps: ['შეინახე კლინიკის დასკვნა, მომსახურების ჩამონათვალი და ქვითარი', 'დაბრუნებიდან 10 დღის განმავლობაში წარმოგვიდგინე დოკუმენტები', 'ანაზღაურებას პოლისის პირობების მიხედვით მიიღებ'] },
  ],
  faq: [
    { q: 'გამოდგება პოლისი შენგენის ვიზისთვის?', a: 'კი, პოლისი შენგენის ვიზის მოთხოვნებს აკმაყოფილებს' },
    { q: 'სავალდებულოა სამოგზაურო დაზღვევა?', a: 'ზოგიერთ ქვეყანაში სავალდებულოა, თუმცა ნებისმიერ შემთხვევაში რეკომენდებულია - ის გიცავს მოულოდნელი ხარჯებისგან' },
    { q: 'რა ვქნა, თუ საზღვარგარეთ ექიმი დამჭირდა?', a: 'დარეკე ასისტანსის ნომერზე, რომელიც პოლისზეა მითითებული - გეტყვიან, სად მიხვიდე' },
    { q: 'შემიძლია პოლისის ყიდვა უკვე საზღვარგარეთ ყოფნისას?', a: 'პოლისი გამგზავრებამდე უნდა შეიძინო' },
    { q: 'რა არის ფრანშიზა?', a: 'თანხა, რომელსაც დაზღვეული თავად იხდის, დანარჩენს კი ჩვენ ვანაზღაურებთ. ის წინასწარ არის განსაზღვრული პოლისში.' },
  ],
}

/* Business FAQ shared by the car and property designs (identical lists in both). */
const BUSINESS_FAQ: ProductConfig['faq'] = [
  { q: 'რატომ არის საჭირო დააზღვიოთ თქვენი ბიზნესი?', a: 'ბიზნესის დაზღვევა უზრუნველყოფს ფინანსურ დაცვას მოულოდნელი მოვლენებისგან, რამაც შეიძლება გამოიწვიოს მნიშვნელოვანი ფინანსური ზარალი. დაზღვევა გეხმარებათ დაიცვათ თქვენი აქტივები, თანამშრომლები და თქვენი ბიზნეს საქმიანობის უწყვეტობა.' },
  { q: 'რა არის პროფესიული პასუხისმგებლობის დაზღვევა?', a: 'პროფესიული პასუხისმგებლობის დაზღვევა, რომელიც ასევე ცნობილია როგორც შეცდომებისა და უმოქმედობის (E&O) დაზღვევა, იცავს ბიზნესებს, რომლებიც უზრუნველყოფენ პროფესიულ მომსახურებას დაუდევრობის ან შეცდომებისგან, რაც იწვევს კლიენტების ფინანსურ ზარალს.' },
  { q: 'რა არის პასუხისმგებლობის ზოგადი დაზღვევა და რატომ არის ის მნიშვნელოვანი?', a: 'პასუხისმგებლობის ზოგადი დაზღვევა უზრუნველყოფს მესამე მხარის სხეულის დაზიანების და ქონებრივი ზიანის დაფარვას. ეს აუცილებელია თქვენი ბიზნესის დასაცავად საერთო რისკებისა და სამართლებრივი ვალდებულებებისგან.' },
  { q: 'როგორ იცავს თქვენს ბიზნესს ქონების დაზღვევა?', a: 'ქონების დაზღვევა ფარავს თქვენი ბიზნესის ქონების, მათ შორის შენობების, ინვენტარის, აღჭურვილობისა და სხვა აქტივების დაზიანებას ან ზარალს, ისეთი მოვლენების გამო, როგორიცაა ხანძარი, ქურდობა ან სტიქიური უბედურებები.' },
  { q: 'რა ფაქტორები მოქმედებს ბიზნესის დაზღვევის ღირებულებაზე?', a: 'ბიზნესის დაზღვევის ღირებულებაზე შეიძლება გავლენა იქონიოს ისეთმა ფაქტორებმა, როგორიცაა თქვენი ბიზნესის ზომა, ინდუსტრია, მდებარეობა, დაფარვის ლიმიტები და ა.შ.' },
  { q: 'როგორ განსაზღვროთ სწორი სადაზღვევო პროდუქტი თქვენი ბიზნესისთვის?', a: 'ტაო დაზღვევის გუნდი დაგეხმარებათ სწორად შეაფასოთ თქვენი ბიზნესის რისკები და მოირგოთ თქვენთვის საჭირო სადაზღვევო პროდუქტები.' },
  { q: 'რა სახის ბიზნეს დაზღვევა არსებობს?', a: 'ბიზნესის დაზღვევა მოიცავს პასუხისმგებლობის, ქონების, ბიზნესის უწყვეტობის, ავტოტრანსპორტის, თანამშრომლების, პროფესიული პასუხისმგებლობის დაზღვევას და ა.შ. თქვენი ბიზნესის სპეციფიკური საჭიროებები განსაზღვრავს შესაბამის დაფარვას.' },
  { q: 'რა არის ბიზნესის დაზღვევა?', a: 'ბიზნესის დაზღვევა არის დაფარვის სახეობა, რომელიც იცავს თქვენს ბიზნესს სხვადასხვა რისკებით გამოწვეული ფინანსური ზარალისგან, როგორიცაა ქონების დაზიანება, ბიზნესის შეწყვეტა და ა.შ.' },
]

export const CAR: ProductConfig = {
  product: 'car',
  title: ['ავტომობილის', 'კორპორატიული', 'დაზღვევა'],
  titleSize: 'min(64px, 4.4vw)',
  lead: 'ტრანსპორტის დაზღვევა ბიზნესისთვის გთავაზობთ ნებისმიერი სახის (მსუბუქი, სატვირთო, ავტობუსი და სხვა) ავტოტრანსპორტის დაზღვევას',
  image: '/img/hero-car-mountain.jpg',
  imageAlt: 'ლურჯი მანქანა მთის გზაზე',
  imagePos: '50% 50%',
  coversTitle: 'ტრანსპორტის დაზღვევა ფარავს:',
  coverMinHeight: 200,
  covers: [
    { icon: 'car', title: 'ავტოსაგზაო შემთხვევა' },
    { icon: 'info-circle', title: 'აფეთქება' },
    { icon: 'shield-tick', title: 'გარეგანი დაზიანება' },
    { icon: 'warning-2', title: 'ხანძარი' },
    { icon: 'global', title: 'სტიქიური მოვლენები' },
    { icon: 'close-circle', title: 'ვანდალიზმი' },
    { icon: 'security-safe', title: 'ძარცვა, ქურდობა, ყაჩაღობა' },
  ],
  area: {
    title: 'დაზღვევის მოქმედების არეალი:',
    items: [
      { icon: 'location', title: 'საქართველო' },
      { icon: 'location', title: 'დსთ-ს ქვეყნები' },
      { icon: 'location', title: 'თურქეთი' },
      { icon: 'global', title: 'მსოფლიოს მასშტაბით სხვა ქვეყნები', note: '(მომხმარებლის სურვილის შემთხვევაში)' },
    ],
    cards: [
      { title: 'მძღოლისა და მგზავრთა უბედური შემთხვევისგან დაზღვევა', text: 'ანაზღაურდება ზარალი, რომელიც დაზღვეული ავტოტრანსპორტის მართვისას მიადგა მძღოლს ან/და მგზავრებს (გარდაცვალება, სხეულის დაზიანება).' },
      { title: 'ავტომფლობელთა მესამე პირის პასუხისმგებლობის დაზღვევა', text: 'სამოქალაქო პასუხისმგებლობის ნებაყოფლობითი დაზღვევით ანაზღაურდება მატერიალური ზარალი, რომელიც წარმოიშვა მძღოლის მიერ დაზღვეული ავტოტრანსპორტის მართვისას მესამე მხარის ჯანმრთელობის ან ქონების მიმართ მიყენებული ზიანის შედეგად.' },
    ],
  },
  faq: BUSINESS_FAQ,
}

/* The design's hero photo is a blob ("თანამედროვე ოფისი თბილისში"); the closest existing image is the About office photo. */
export const PROPERTY: ProductConfig = {
  product: 'property',
  title: ['ქონების', 'კორპორატიული', 'დაზღვევა'],
  titleSize: 'min(64px, 4.4vw)',
  lead: 'ქონების დაზღვევა დაგეხმარებათ დაიცვათ თქვენი ბიზნესის კუთვნილი ქონება და უზრუნველყოფს თქვენს ფინანსურ სტაბილურობას',
  image: '/img/about-team-office.jpg',
  imageAlt: 'თანამედროვე ოფისი თბილისში',
  imagePos: '70% 50%',
  coversTitle: 'ბიზნეს ქონება ფარავს:',
  coversCols: 5,
  coverMinHeight: 200,
  coverTitleSmall: true,
  covers: [
    { icon: 'global', title: 'წყალდიდობა' },
    { icon: 'airplane', title: 'თვითმფრინავის ან სხვა საჰაერო ტრანსპორტის ჩამოვარდნა' },
    { icon: 'car', title: 'ავტოტრანსპორტის შეჯახება' },
    { icon: 'house', title: 'წყალგაყვანილობის სისტემის მწყობრიდან უეცარი და მოულოდნელი გამოსვლა' },
    { icon: 'building', title: 'მიწისძვრა' },
    { icon: 'info-circle', title: 'შტორმი, ქარიშხალი, უხვთოვლიანობა' },
    { icon: 'warning-2', title: 'ნიადაგის ჩამოშლა, მეწყერი' },
    { icon: 'security-safe', title: 'ძარცვა, ქურდობა, ყაჩაღობა' },
    { icon: 'shield-tick', title: 'ხანძარი, აფეთქება, მეხის დაცემა' },
    { icon: 'close-circle', title: 'მესამე მხარის მიერ განზრახ მიყენებული ზიანი' },
  ],
  coversProse: [
    'დაზღვევის ფარგლებში ტაო დაზღვევა გთავაზობთ თქვენი ქონების, დასაწყობებული მარაგების, მანქანა-დანადგარების, სხვა სასაქონლო-მატერიალური ფასეულობებისა და საქმიანობის შეჩერების დაზღვევას.',
    'სადაზღვევო პოლისი უზრუნველყოფს თქვენს ფინანსურ დაცვას კრიტიკული სიტუაციებისგან. მოულოდნელი და გაუთვალისწინებელი შემთხვევებით გამოწვეულმა ფინანსურმა ზარალმა შეიძლება სოლიდური ზიანი მიაყენოს თქვენს კომპანიას. ქონების დაზღვევა, როგორც რისკის მართვის მექანიზმი, მსგავსი შემთხვევების თავიდან არიდების საუკეთესო გზაა.',
  ],
  types: {
    title: 'დააზღვიეთ სხვადასხვა ტიპის ქონება:',
    items: [
      'შენობა-ნაგებობები, მანქანა-დანადგარები, საწარმო-ტექნოლოგიური ხაზები, სამეურნეო ინვენტარი',
      'მარაგები, ინტერიერის საგნები, მოპირკეთება (ფანჯრის მინები, სარკეები, ვიტრინები და სხვა)',
      'საკომუნიკაციო მოწყობილობები, მაღალი ძაბვის სისტემები და მსგავსი საწარმო-ტექნიკური დანიშნულების მექანიზმები და მოწყობილობები',
      'საყოფაცხოვრებო ტექნიკა, ავეჯი და სხვა (ელექტროტექნიკა, კომპიუტერები და სხვა)',
      'ოფისები (მათ შორის: ბანკები, ბიზნეს ცენტრები)',
      'სასტუმროები, მაღაზიები, სავაჭრო ცენტრები',
      'საგანმანათლებლო დაწესებულებები, კლინიკები',
      'ავტოგასამართი სადგურები, ნავთობის ბაზები',
      'ქარხნები, საწარმოები, საამქროები და სხვა',
    ],
    extra: {
      label: 'დამატებით შეგიძლიათ შეიძინოთ:',
      title: 'საქმიანობის შეჩერებით გამოწვეული შემოსავლების დაკარგვის დაზღვევა',
      texts: [
        'ქონების დაზღვევის პოლისით დაფარული რისკით დაზღვეული ქონების დაზიანების და/ან განადგურების შემთხვევაში თქვენ აგინაზღაურდებათ ქონების აღნიშნული ზიანის შედეგად საქმიანობის შეჩერებით გამოწვეული ზარალი',
        'აღნიშნული დამატებითი დაფარვის შეძენა შესაძლებელია მხოლოდ ქონების დაზღვევის პოლისთან ერთად',
      ],
    },
  },
  faq: BUSINESS_FAQ,
}

const WRAP: React.CSSProperties = { boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 48 }
const NUM: React.CSSProperties = { flex: 'none', width: 32, height: 32, boxSizing: 'border-box', border: '1px solid var(--link)', color: 'var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, fontSize: 14 }

export function Product({ cfg, offers = [] }: { cfg: ProductConfig; offers?: OfferVM[] }) {
  const { t, L } = useSite()
  const [faqOpen, setFaqOpen] = useState(0)
  let n = 0
  const next = () => ++n
  // a white section 02 (schemes, area, types) puts the FAQ on white too; otherwise the FAQ takes the grey ground
  const plainFaq = !!(cfg.schemes || cfg.area || cfg.types)

  return (
    <>
      {/* Product hero: framed blue panel */}
      <section data-hero="" className="tao-canvas" style={{ margin: 4, borderRadius: 5, overflow: 'hidden', color: 'var(--on-primary)' }}>
        <div style={{ boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '150px 24px 64px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 48 }}>
          <div className="tao-intro" style={{ ['--i' as string]: '0', flex: '1 1 520px', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 24 }}>
            <Breadcrumb current={cfg.title.join(' ')} parent={{ label: 'დაზღვევა', href: '/#products' }} />
            <h1 className="tao-h tao-h--display" aria-label={t(cfg.title.join(' '))} style={{ margin: 0, color: 'var(--on-primary)', fontSize: cfg.titleSize || 'min(76px, 5.3vw)', lineHeight: 0.95, display: 'flex', flexDirection: 'column' }}>
              {cfg.title.map((line) => (
                <span key={line} style={{ whiteSpace: 'nowrap' }}>{t(line)}</span>
              ))}
            </h1>
            <p style={{ margin: 0, maxWidth: 520, fontSize: 19, lineHeight: 1.55, color: 'var(--on-blue-muted)' }}>{t(cfg.lead)}</p>
          </div>
          <div className="tao-intro" style={{ ['--i' as string]: '2', flex: '1 1 420px', minWidth: 0, position: 'relative', minHeight: 460 }}>
            <div style={{ position: 'absolute', inset: 0, border: '1px solid var(--on-blue-line)', borderRadius: 5, transform: 'translate(14px, -14px)' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: 5, overflow: 'hidden', background: 'var(--surface)' }}>
              <img src={cfg.image} alt={t(cfg.imageAlt)} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: cfg.imagePos, display: 'block' }} />
            </div>
          </div>
        </div>
        {/* quick facts strip */}
        <div style={{ borderTop: '1px solid var(--on-blue-line)' }}>
          <div className="tao-facts" style={{ boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
            <a href="#covered" className="tao-fact" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '22px 0', color: 'var(--on-primary)', textDecoration: 'none' }}>
              <Icon name="shield-tick" size={22} />
              <span className="tao-caps" style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.08em' }}>{t('რას ფარავს')}</span>
            </a>
            <a href="#faq" className="tao-fact" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '22px 0 22px 24px', borderLeft: '1px solid var(--on-blue-line)', color: 'var(--on-primary)', textDecoration: 'none' }}>
              <Icon name="messages-2" size={22} />
              <span className="tao-caps" style={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.08em' }}>{t('ხშირად დასმული კითხვები')}</span>
            </a>
          </div>
        </div>
      </section>

      {/* What's covered */}
      <section id="covered" style={{ background: 'var(--bg)', marginTop: 4, padding: '96px 0' }}>
        <div style={WRAP}>
          <div data-reveal="up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24 }}>
            <SectionMarker number={next()} title={t(cfg.coversTitle || 'რას ფარავს')} />
            <SectionMarker number={n} variant="diagonal" />
          </div>
          <div data-reveal="stagger" className="tao-cover" style={{ display: 'grid', gridTemplateColumns: `repeat(${cfg.coversCols || 4}, minmax(0, 1fr))`, borderTop: '1px solid var(--border)', borderLeft: '1px solid var(--border)' }}>
            {cfg.covers.map((c) => (
              <div key={c.title} className="tao-coveritem" style={{ boxSizing: 'border-box', padding: '32px 28px 36px', borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 16, minHeight: cfg.coverMinHeight || 240 }}>
                <span className="tao-coveritem__icon" style={{ width: 52, height: 52, boxSizing: 'border-box', border: '1px solid var(--link)', color: 'var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={c.icon} size={22} />
                </span>
                <h3 className="tao-h tao-h--h4" style={cfg.coverTitleSmall ? { margin: '8px 0 0', fontSize: 18, lineHeight: 1.3 } : { margin: '8px 0 0' }}>{t(c.title)}</h3>
                {c.text ? <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 15 }}>{t(c.text)}</p> : null}
              </div>
            ))}
          </div>
          {cfg.coversProse ? (
            <div data-reveal="up" className="tao-iprose" style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 860 }}>
              {cfg.coversProse.map((p) => (
                <p key={p} style={{ margin: 0, fontSize: 17, lineHeight: 1.7, color: 'var(--text-secondary)' }}>{t(p)}</p>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* Car: coverage area as numbered cards in the cover style, then two text cards */}
      {cfg.area ? (
        <section style={{ padding: '96px 0' }}>
          <div style={WRAP}>
            <div data-reveal="up">
              <SectionMarker number={next()} title={t(cfg.area.title)} />
            </div>
            <div data-reveal="up" style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
              <div className="tao-cover" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', borderTop: '1px solid var(--border)', borderLeft: '1px solid var(--border)', background: 'var(--surface)' }}>
                {cfg.area.items.map((a, i) => (
                  <div key={a.title} className="tao-coveritem" style={{ boxSizing: 'border-box', padding: 28, borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 20, minHeight: 200 }}>
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span className="tao-coveritem__icon" style={{ width: 52, height: 52, boxSizing: 'border-box', border: '1px solid var(--link)', color: 'var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name={a.icon} size={22} />
                      </span>
                      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text-muted)' }}>{String(i + 1).padStart(2, '0')}</span>
                    </span>
                    <span style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <h3 className="tao-h tao-h--h4" style={{ margin: 0 }}>{t(a.title)}</h3>
                      {a.note ? <span style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--text-secondary)' }}>{t(a.note)}</span> : null}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(380px, 100%), 1fr))', gap: 24 }}>
                {cfg.area.cards.map((c) => (
                  <div key={c.title} style={{ boxSizing: 'border-box', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 5, padding: 32, display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
                    <h3 className="tao-h tao-h--h4" style={{ margin: 0 }}>{t(c.title)}</h3>
                    <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: 'var(--text-secondary)' }}>{t(c.text)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Property: insurable property types as a bullet list, then the add-on card */}
      {cfg.types ? (
        <section style={{ padding: '96px 0' }}>
          <div style={WRAP}>
            <div data-reveal="up">
              <SectionMarker number={next()} title={t(cfg.types.title)} />
            </div>
            <div data-reveal="up" style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(440px, 100%), 1fr))', gap: '14px 48px' }}>
                {cfg.types.items.map((it) => (
                  <li key={it} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', fontSize: 16, lineHeight: 1.6, color: 'var(--text)' }}>
                    <span aria-hidden="true" style={{ flex: 'none', width: 8, height: 8, marginTop: 9, background: 'var(--link)' }} />
                    <span>{t(it)}</span>
                  </li>
                ))}
              </ul>
              <div style={{ boxSizing: 'border-box', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 5, padding: 32, display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
                <p className="tao-caps" style={{ margin: 0, fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', color: 'var(--link)' }}>{t(cfg.types.extra.label)}</p>
                <h3 className="tao-h tao-h--h4" style={{ margin: 0 }}>{t(cfg.types.extra.title)}</h3>
                {cfg.types.extra.texts.map((p) => (
                  <p key={p} style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: 'var(--text-secondary)' }}>{t(p)}</p>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* How to use: two schemes (travel, car) */}
      {cfg.schemes ? (
        <section style={{ padding: '96px 0' }}>
          <div style={WRAP}>
            <div data-reveal="up">
              <SectionMarker number={next()} title={t(cfg.schemesTitle || '')} text={cfg.schemesText ? t(cfg.schemesText) : undefined} />
            </div>
            <div data-reveal="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 24 }}>
              {cfg.schemes.map((sc) => (
                <div key={sc.title} style={{ boxSizing: 'border-box', border: '1px solid var(--link)', borderRadius: 5, overflow: 'hidden', background: 'var(--surface)' }}>
                  <div style={{ display: 'flex', alignItems: 'stretch', borderBottom: '1px solid var(--link)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', padding: '0 18px', borderRight: '1px solid var(--link)', color: 'var(--link)' }}>
                      <Icon name={sc.icon} size={22} />
                    </span>
                    <h3 className="tao-h tao-h--h4" style={{ margin: 0, flex: 1, padding: '20px 20px' }}>{t(sc.title)}</h3>
                  </div>
                  <ol style={{ listStyle: 'none', margin: 0, padding: '8px 28px 28px', display: 'flex', flexDirection: 'column' }}>
                    {sc.steps.map((st, i) => (
                      <li key={i} style={{ display: 'flex', gap: 18, alignItems: 'flex-start', padding: '20px 0', borderBottom: '1px solid var(--border)' }}>
                        <span style={{ ...NUM, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15 }}>{i + 1}</span>
                        <span style={{ paddingTop: 4, fontSize: 16, lineHeight: 1.5 }}>{t(st)}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Current offers (hidden when there are none) */}
      {offers.length ? (
        <section style={{ background: cfg.schemes ? 'var(--bg)' : undefined, padding: '96px 0' }}>
          <div style={WRAP}>
            <div data-reveal="up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
              <SectionMarker number={next()} title={t('აქტიური შეთავაზებები')} />
              <Button variant="secondary" iconRight="arrow-right" href={L('/offers')}>
                {t('ყველა შეთავაზება')}
              </Button>
            </div>
            <div data-reveal="stagger" className="tao-pogrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
              {offers.slice(0, 3).map((o) => (
                <OfferCard key={o.id} o={o} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* FAQ: question list only, full width (no number) */}
      <section id="faq" style={{ background: plainFaq ? undefined : 'var(--bg)', padding: '96px 0' }}>
        <div style={{ boxSizing: 'border-box', maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', flexWrap: 'wrap', gap: 48 }}>
          <div data-reveal="up" style={{ flex: '1 1 100%', minWidth: 0 }}>
            <div className="tao-faq" style={{ borderTop: '1px solid var(--text)' }}>
              {cfg.faq.map((q, i) => {
                const open = faqOpen === i
                return (
                  <div key={i} className={'tao-faq__item' + (open ? ' is-open' : '')} style={{ borderBottom: '1px solid var(--border)' }}>
                    <button type="button" onClick={() => setFaqOpen(open ? -1 : i)} aria-expanded={open} className="tao-faq__q" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, padding: '22px 0', border: 0, background: 'transparent', textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 500, lineHeight: 1.4, color: 'var(--text)' }}>
                      <span>{t(q.q)}</span>
                      <span className="tao-faq__icon" aria-hidden="true" style={{ flex: 'none', width: 36, height: 36, boxSizing: 'border-box', border: '1px solid var(--link)', color: 'var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name={open ? 'minus' : 'add'} size={18} />
                      </span>
                    </button>
                    {open ? <p className="tao-faq__a" style={{ margin: 0, padding: '0 60px 24px 0', fontSize: 16, lineHeight: 1.6, color: 'var(--text-secondary)' }}>{t(q.a)}</p> : null}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
