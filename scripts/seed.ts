/* Seed the CMS with the design's sample content (banners, offers, news, settings).
   Run once on an empty database:  npm run seed
   Safe to re-run: documents that already exist (by slug / title) are skipped.
   npm run seed -- --update  also rewrites the texts of the existing sample records with the current design
   texts (scripts/sample-content.json, built from the Claude Design project); photos and dates stay. */
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { fillNewsBodies } from './news-bodies'
import { DEFAULT_LISTS, type ListSlug } from './default-lists'
import sample from './sample-content.json'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const IMG = (name: string) => path.resolve(dirname, '../public/img', name + '.jpg')

type Loc = { ka: string; en: string }
const L = (ka: string, en: string): Loc => ({ ka, en })
const UPDATE = process.argv.includes('--update')
const S = sample as unknown as {
  news: Record<string, { cat: string; title: Loc; excerpt: Loc; lead: Loc }>
  offers: Record<string, { title: Loc; excerpt: Loc; note: Loc; value: string; online: boolean }>
  hero: { title: Loc; text: Loc; action: Loc }[]
}

async function main() {
  const payload = await getPayload({ config })
  const media = new Map<string, number>()

  async function image(name: string, alt: Loc) {
    if (media.has(name)) return media.get(name)!
    const existing = await payload.find({ collection: 'media', where: { filename: { like: name } }, limit: 1 })
    if (existing.docs[0]) {
      media.set(name, existing.docs[0].id as number)
      return existing.docs[0].id as number
    }
    const doc = await payload.create({ collection: 'media', data: { alt: alt.ka }, filePath: IMG(name), locale: 'ka' })
    await payload.update({ collection: 'media', id: doc.id, data: { alt: alt.en }, locale: 'en' })
    media.set(name, doc.id as number)
    console.log('media', name)
    return doc.id as number
  }

  /* ---------- settings ---------- */
  await payload.updateGlobal({ slug: 'settings', locale: 'ka', data: { phone: '+995 32 219 52 12', email: 'contact@taoinsurance.ge', serviceAddress: 'შალვა ნუცუბიძის ქ. 72, 0186 თბილისი', serviceAddressShort: 'შალვა ნუცუბიძის ქ. 72', serviceCity: '0186 თბილისი', serviceHours: [{ days: 'ორშაბათი - პარასკევი', time: '9:00 - 18:00' }, { days: 'შაბათი', time: '9:30 - 14:00' }], address: 'ანა პოლიტკოვსკაიას ქ. 16, 0186 თბილისი', addressShort: 'ანა პოლიტკოვსკაიას ქ. 16', city: '0186 თბილისი', hours: 'ორშ-პარ, 10:00-18:00', portalUrl: 'https://portal.taoinsurance.ge', foundedYear: '2007', siteName: 'ტაო დაზღვევა', siteDescription: 'ჯანმრთელობის და სამოგზაურო დაზღვევა 2007 წლიდან. პოლისი ონლაინ, ანაზღაურება სწრაფად.' } })
  const hoursKa = ((await payload.findGlobal({ slug: 'settings', locale: 'ka' })) as { serviceHours?: { id?: string | null }[] }).serviceHours || []
  await payload.updateGlobal({ slug: 'settings', locale: 'en', data: { serviceAddress: '72 Shalva Nutsubidze St, 0186 Tbilisi', serviceAddressShort: '72 Shalva Nutsubidze St', serviceCity: '0186 Tbilisi', serviceHours: hoursKa.map((h, i) => ({ id: h.id, days: ['Monday - Friday', 'Saturday'][i] || '', time: ['9:00 - 18:00', '9:30 - 14:00'][i] || '' })), address: '16 Anna Politkovskaya St, 0186 Tbilisi', addressShort: '16 Anna Politkovskaya St', city: '0186 Tbilisi', hours: 'Mon-Fri, 10:00-18:00', siteName: 'TAO Insurance', siteDescription: 'Health and travel insurance since 2007. Policies online, claims paid fast.' } })
  console.log('settings')

  /* ---------- editable lists (the migration creates them on PostgreSQL; a fresh SQLite file needs them here) ---------- */
  const ids: Record<ListSlug, Map<string, number>> = { products: new Map(), 'news-categories': new Map(), 'offer-categories': new Map(), cities: new Map() }
  for (const slug of Object.keys(DEFAULT_LISTS) as ListSlug[]) {
    for (const item of DEFAULT_LISTS[slug]) {
      const found = await payload.find({ collection: slug, where: { key: { equals: item.key } }, limit: 1, depth: 0 })
      let id = found.docs[0]?.id as number | undefined
      if (!id) {
        const { key, ka, en, ...rest } = item
        const doc = await payload.create({ collection: slug, locale: 'ka', data: { key, ...rest, ...ka } as never })
        await payload.update({ collection: slug, id: doc.id, locale: 'en', data: en as never })
        id = doc.id as number
        console.log(slug, key)
      }
      ids[slug].set(item.key, id)
    }
  }
  const idOf = (slug: ListSlug, key: string) => ids[slug].get(key)

  /* ---------- offers ---------- */
  const offers = [
    { slug: 'travel-15', product: 'travel', type: 'discount', cities: ['online'], value: '15%', pct: 15, title: L('სამოგზაურო პოლისი 15%-იანი ფასდაკლებით', 'Travel policy with a 15% discount'), text: L('იმოგზაურე მშვიდად: სამოგზაურო პოლისი ონლაინ, 15%-ით იაფად.', 'Travel with peace of mind: a travel policy online, 15% cheaper.'), from: '2026-10-01', until: '2026-12-31', image: 'hero-travel-airport', alt: L('მგზავრი ჩემოდნით აეროპორტში', 'Traveller with a suitcase at the airport'), pos: '50% 50%', featured: true },
    { slug: 'family', product: 'health', type: 'bundle', cities: ['online'], value: '[N]%', pct: 0, title: L('ოჯახის პაკეტი', 'Family package'), text: L('ჯანმრთელობის დაზღვევა მთელი ოჯახისთვის, სპეციალურ ფასად.', 'Health insurance for the whole family at a special price.'), from: '2026-09-15', until: '2027-01-31', image: 'offer-family-health', alt: L('ოჯახი დივანზე წიგნს კითხულობს', 'Family reading a book on the sofa'), pos: '50% 50%', note: L('ოჯახის ყველა წევრი ერთ პოლისში', 'The whole family in one policy'), featured: true },
    { slug: 'fitness', product: 'health', type: 'partner', category: 'sport', cities: ['tbilisi', 'batumi'], value: '20%', pct: 20, title: L('ფიტნეს-კლუბის აბონემენტი 20%-ით იაფად', 'Fitness club membership 20% cheaper'), text: L('ჯანმრთელობის პოლისის მფლობელებს პარტნიორ ფიტნეს-კლუბში 20%-იანი ფასდაკლება აქვთ.', 'Health policy holders get a 20% discount at the partner fitness club.'), from: '2026-09-01', until: '2027-03-31', image: 'photo-people', alt: L('წყვილი ლურჯ კართან', 'Couple at a blue door'), pos: '50% 40%', featured: true },
    { slug: 'lab', product: 'health', type: 'partner', category: 'medical', cities: ['tbilisi', 'batumi', 'kutaisi'], value: '10%', pct: 10, title: L('10% ფასდაკლება ლაბორატორიულ კვლევებზე', '10% off laboratory tests'), text: L('პარტნიორ ლაბორატორიაში ანალიზები და კვლევები 10%-ით იაფად, მაშინაც კი, როცა პოლისი მათ არ ფარავს.', 'Tests and analyses at the partner laboratory 10% cheaper, even when the policy does not cover them.'), from: '2026-08-20', until: '2027-02-28', image: 'hero-health-clinic', alt: L('ექიმი პაციენტს ესაუბრება კლინიკაში', 'Doctor talking to a patient in a clinic'), pos: '70% 50%' },
    { slug: 'optics', product: 'health', type: 'partner', category: 'pharmacy', cities: ['tbilisi', 'batumi'], value: '15%', pct: 15, title: L('სათვალეები და ლინზები 15%-ით იაფად', 'Glasses and lenses 15% cheaper'), text: L('პარტნიორ ოპტიკაში მხედველობის შემოწმება უფასოა, სათვალეები და ლინზები კი 15%-ით იაფი.', 'Eye tests are free at the partner optician, glasses and lenses are 15% cheaper.'), from: '2026-08-01', until: '2026-12-31', image: 'hero-home-tbilisi', alt: L('ქალი ლურჯ პალტოში თბილისის ქუჩაზე', 'Woman in a blue coat on a Tbilisi street'), pos: '82% 50%' },
    { slug: 'pharmacy', product: 'health', type: 'partner', category: 'pharmacy', cities: ['tbilisi', 'batumi', 'kutaisi'], value: '5%', pct: 5, title: L('5% ქეშბექი პარტნიორ აფთიაქებში', '5% cashback at partner pharmacies'), text: L('გადაიხადე პოლისის ბარათით და ყოველი შენაძენის 5% ბალანსზე დაგიბრუნდება.', 'Pay with your policy card and 5% of every purchase is returned to your balance.'), from: '2026-07-01', until: '2027-06-30', image: 'news-phone-online', alt: L('ტელეფონი ხელში', 'Phone in hand'), pos: '50% 50%' },
    { slug: 'flights', product: 'travel', type: 'partner', category: 'trip', cities: ['online'], value: '50 ₾', pct: 18, title: L('50 ₾ ფასდაკლება ავიაბილეთზე', '50 GEL off a flight ticket'), text: L('სამოგზაურო პოლისის მფლობელებს პარტნიორ ტურისტულ სააგენტოში ავიაბილეთზე 50 ლარიანი ფასდაკლება აქვთ.', 'Travel policy holders get 50 GEL off a flight ticket at the partner travel agency.'), from: '2026-06-01', until: '2026-12-31', image: 'hero-travel-airport', alt: L('მგზავრი ჩემოდნით აეროპორტში', 'Traveller with a suitcase at the airport'), pos: '20% 50%' },
    { slug: 'corporate', product: 'health', type: 'bundle', cities: ['online'], value: '[N]%', pct: 0, title: L('ჯგუფური დაზღვევა მცირე ბიზნესისთვის', 'Group insurance for small business'), text: L('გუნდის ჯანმრთელობის დაზღვევა 5 თანამშრომლიდან, სპეციალურ ფასად.', 'Team health insurance from 5 employees, at a special price.'), from: '2026-05-20', until: '2027-05-31', image: 'about-team-office', alt: L('გუნდი ოფისში', 'Team in the office'), pos: '40% 50%', note: L('გუნდისთვის 5 თანამშრომლიდან', 'For teams from 5 employees') },
    { slug: 'dental', product: 'health', type: 'partner', category: 'medical', cities: ['tbilisi'], value: '25%', pct: 25, title: L('სტომატოლოგიური მომსახურება 25%-ით იაფად', 'Dental services 25% cheaper'), text: L('პროფილაქტიკური დათვალიერება და წმენდა პარტნიორ კლინიკაში 25%-იანი ფასდაკლებით.', 'Preventive check-up and cleaning at the partner clinic with a 25% discount.'), from: '2026-05-01', until: '2026-11-30', image: 'hero-health-clinic', alt: L('ექიმი პაციენტს ესაუბრება კლინიკაში', 'Doctor talking to a patient in a clinic'), pos: '20% 50%' },
    { slug: 'luggage', product: 'travel', type: 'partner', category: 'trip', cities: ['tbilisi', 'batumi'], value: '15%', pct: 15, title: L('ჩემოდნები და სამოგზაურო აქსესუარები 15%-ით იაფად', 'Suitcases and travel accessories 15% cheaper'), text: L('სამოგზაურო პოლისის მფლობელებს პარტნიორ მაღაზიაში 15%-იანი ფასდაკლება აქვთ.', 'Travel policy holders get a 15% discount at the partner shop.'), from: '2026-04-15', until: '2027-04-30', image: 'hero-home-tbilisi', alt: L('ქალი ლურჯ პალტოში თბილისის ქუჩაზე', 'Woman in a blue coat on a Tbilisi street'), pos: '60% 50%' },
  ]
  for (const o of offers) {
    const t = S.offers[o.slug]
    if (t) Object.assign(o, { title: t.title, text: t.excerpt, note: t.note.ka ? t.note : o.note, value: t.value || o.value })
    const online = t ? t.online : o.cities.includes('online')
    o.cities = o.cities.filter((c) => c !== 'online')
    const exists = await payload.find({ collection: 'offers', where: { slug: { equals: o.slug } }, limit: 1 })
    if (exists.docs[0]) {
      if (!UPDATE) continue
      const id = exists.docs[0].id
      await payload.update({ collection: 'offers', id, locale: 'ka', data: { title: o.title.ka, excerpt: o.text.ka, note: o.note?.ka, online } })
      await payload.update({ collection: 'offers', id, locale: 'en', data: { title: o.title.en, excerpt: o.text.en, note: o.note?.en } })
      console.log('offer updated', o.slug)
      continue
    }
    const img = await image(o.image, o.alt)
    const doc = await payload.create({
      collection: 'offers',
      locale: 'ka',
      data: { slug: o.slug, product: idOf('products', o.product)!, type: o.type as 'discount', category: o.category ? idOf('offer-categories', o.category) : undefined, online, cities: o.cities.map((c) => idOf('cities', c)!), value: o.value, pct: o.pct, note: o.note?.ka, title: o.title.ka, excerpt: o.text.ka, image: img, imagePosition: o.pos, from: o.from, until: o.until, featured: !!o.featured },
    })
    await payload.update({ collection: 'offers', id: doc.id, locale: 'en', data: { title: o.title.en, excerpt: o.text.en, value: o.value, note: o.note?.en } })
    console.log('offer', o.slug)
  }

  /* ---------- news ---------- */
  const news = [
    { slug: 'new-look', cat: 'company', product: '', date: '2026-10-08', title: L('ტაოს ახალი სახე', 'The new face of TAO'), excerpt: L('2026 წელს ტაო ახალი ბრენდით და ვებგვერდით გაგრძელებს.', 'In 2026 TAO continues with a new brand and website.'), lead: L('ტაო ახალი ბრენდით და ახალი ვებგვერდით იწყებს. მიზანი მარტივია: დაზღვევა, რომელიც გასაგებია და საჭირო დროს მუშაობს.', 'TAO starts with a new brand and a new website. The goal is simple: insurance that is clear and works when needed.'), image: 'photo-people', alt: L('წყვილი ლურჯ კართან', 'Couple at a blue door'), pos: '50% 40%' },
    { slug: 'health-online', cat: 'products', product: 'health', date: '2026-10-01', title: L('ჯანმრთელობის დაზღვევა ახლა ონლაინ', 'Health insurance now online'), excerpt: L('პოლისის შეძენა ახლა ტაოს პორტალზეა შესაძლებელი.', 'You can now buy a policy on the TAO portal.'), lead: L('ჯანმრთელობის დაზღვევის შეძენა ახლა ოფისში მისვლის გარეშე შეგიძლია: ტაოს პორტალზე პოლისს რამდენიმე წუთში გააფორმებ.', 'You can now buy health insurance without visiting the office: on the TAO portal a policy takes a few minutes.'), image: 'news-phone-online', alt: L('ტელეფონი ხელში, ონლაინ ყიდვა', 'Phone in hand, buying online'), pos: '50% 50%' },
    { slug: 'before-you-travel', cat: 'products', product: 'travel', date: '2026-09-20', title: L('5 რამ, რაც მოგზაურობამდე უნდა გააკეთო', '5 things to do before you travel'), excerpt: L('მოკლე ჩამონათვალი, რომ მოგზაურობა უპრობლემოდ ჩაიაროს.', 'A short checklist for a trouble-free trip.'), lead: L('ბილეთი და სასტუმრო დაჯავშნილია? სანამ ჩემოდანს ჩაკეტავ, გადახედე ამ მოკლე ჩამონათვალს.', 'Ticket and hotel booked? Before you close the suitcase, run through this short checklist.'), image: 'hero-travel-airport', alt: L('მგზავრი ჩემოდნით აეროპორტში', 'Traveller with a suitcase at the airport'), pos: '50% 50%' },
    { slug: 'schengen-policy', cat: 'products', product: 'travel', date: '2026-09-12', title: L('სამოგზაურო პოლისი შენგენის ვიზისთვის', 'A travel policy for a Schengen visa'), excerpt: L('პოლისი შენგენის ვიზის ყველა მოთხოვნას აკმაყოფილებს და ონლაინ ფორმდება.', 'The policy meets every Schengen visa requirement and is issued online.'), lead: L('ვიზისთვის საჭირო სამოგზაურო პოლისი ახლა რამდენიმე წუთში, ონლაინ შეგიძლია გააფორმო. პოლისი შენგენის ზონის მოთხოვნებს სრულად აკმაყოფილებს.', 'The travel policy you need for a visa can now be issued online in a few minutes. It fully meets the Schengen requirements.'), image: 'hero-travel-airport', alt: L('მგზავრი ჩემოდნით აეროპორტში', 'Traveller with a suitcase at the airport'), pos: '35% 50%' },
    { slug: 'service-standard', cat: 'company', product: '', date: '2026-09-02', title: L('მომსახურების ახალი სტანდარტი', 'A new standard of service'), excerpt: L('ცხელ ხაზზე უფრო სწრაფად გიპასუხებთ და საკითხს ერთ ზარში მოვაგვარებთ.', 'We answer the hotline faster and solve the matter in one call.'), lead: L('ტაო მომსახურების ახალ სტანდარტს ნერგავს: ცხელ ხაზზე ზარს უფრო სწრაფად ვპასუხობთ, ხოლო საკითხების უმეტესობას პირველივე ზარში ვაგვარებთ.', 'TAO is introducing a new service standard: we answer hotline calls faster and solve most matters in the very first call.'), image: 'about-team-office', alt: L('გუნდი ოფისში', 'Team in the office'), pos: '40% 50%' },
    { slug: 'family-package', cat: 'products', product: 'health', date: '2026-08-25', title: L('ოჯახის პაკეტი ჯანმრთელობის დაზღვევაში', 'The family package in health insurance'), excerpt: L('ოჯახის ყველა წევრი ერთ პოლისში, სპეციალურ ფასად.', 'The whole family in one policy, at a special price.'), lead: L('ახალი ოჯახის პაკეტით ოჯახის ყველა წევრის დაზღვევა ერთ პოლისში შეგიძლია, თითოეულისთვის ცალკე განაცხადის გარეშე.', 'With the new family package you can insure every family member in one policy, without a separate application for each.'), image: 'offer-family-health', alt: L('ოჯახი დივანზე წიგნს კითხულობს', 'Family reading a book on the sofa'), pos: '50% 50%' },
    { slug: 'clinic-network', cat: 'partners', product: 'health', date: '2026-08-14', title: L('პარტნიორი კლინიკების ქსელი გაფართოვდა', 'The partner clinic network has grown'), excerpt: L('ჯანმრთელობის პოლისით მომსახურება ახლა მეტ ქალაქში შეგიძლია.', 'You can now use your health policy in more cities.'), lead: L('ტაოს პარტნიორი კლინიკების ქსელს ახალი სამედიცინო დაწესებულებები შეუერთდა. მომსახურება ახლა თბილისის გარდა ბათუმსა და ქუთაისშიც ხელმისაწვდომია.', 'New medical institutions have joined the TAO partner clinic network. Services are now available in Batumi and Kutaisi as well as Tbilisi.'), image: 'hero-health-clinic', alt: L('ექიმი პაციენტს ესაუბრება კლინიკაში', 'Doctor talking to a patient in a clinic'), pos: '70% 50%' },
    { slug: 'small-business', cat: 'products', product: 'health', date: '2026-08-05', title: L('ჯანმრთელობის დაზღვევა მცირე ბიზნესისთვის', 'Health insurance for small business'), excerpt: L('გუნდის დაზღვევა 5 თანამშრომლიდან, მარტივი განაცხადით.', 'Team insurance from 5 employees, with a simple application.'), lead: L('მცირე ბიზნესს ახლა შეუძლია, თანამშრომლები 5 ადამიანიდან დააზღვიოს. განაცხადი ერთია მთელი გუნდისთვის, პოლისი კი თითოეულის საჭიროებას ერგება.', 'Small businesses can now insure their staff from 5 people. One application covers the whole team and the policy fits each person.'), image: 'about-team-office', alt: L('გუნდი ოფისში', 'Team in the office'), pos: '45% 50%' },
    { slug: 'marathon', cat: 'partners', product: '', date: '2026-07-28', title: L('ტაო ქალაქის მარათონის პარტნიორია', 'TAO is a partner of the city marathon'), excerpt: L('წელს მარათონის ყველა მონაწილე დაზღვეული იქნება.', 'This year every marathon participant will be insured.'), lead: L('ტაო თბილისის მარათონის ოფიციალური სადაზღვევო პარტნიორია. რბოლის დღეს ყველა რეგისტრირებული მონაწილე დაზღვეული იქნება.', 'TAO is the official insurance partner of the Tbilisi marathon. On race day every registered participant will be insured.'), image: 'hero-home-tbilisi', alt: L('ქალი ლურჯ პალტოში თბილისის ქუჩაზე', 'Woman in a blue coat on a Tbilisi street'), pos: '82% 50%' },
    { slug: 'summer-campaign', cat: 'campaigns', product: 'travel', date: '2026-07-01', title: L('ზაფხულის სამოგზაურო კამპანია', 'Summer travel campaign'), excerpt: L('სამოგზაურო პოლისი ონლაინ, ზაფხულის განსაკუთრებული ფასით.', 'A travel policy online at a special summer price.'), lead: L('ზაფხულის მოგზაურობებისთვის ტაო სამოგზაურო პოლისზე სპეციალურ ფასს გთავაზობს. პოლისს ონლაინ, რამდენიმე წუთში შეიძენ.', 'For summer trips TAO offers a special price on the travel policy. Buy it online in a few minutes.'), image: 'hero-travel-airport', alt: L('მგზავრი ჩემოდნით აეროპორტში', 'Traveller with a suitcase at the airport'), pos: '20% 50%' },
    { slug: 'claims-portal', cat: 'products', product: '', date: '2026-06-18', title: L('ანაზღაურების მოთხოვნა ახლა პორტალზე', 'Claims now on the portal'), excerpt: L('დოკუმენტების ატვირთვა და სტატუსის ნახვა ერთ სივრცეში.', 'Upload documents and track the status in one place.'), lead: L('ანაზღაურების მოთხოვნისთვის ოფისში მისვლა აღარ გჭირდება: დოკუმენტებს პორტალზე ატვირთავ და სტატუსს იქვე ადევნებ თვალს.', 'You no longer need to visit the office to file a claim: upload the documents on the portal and follow the status there.'), image: 'news-phone-online', alt: L('ტელეფონი ხელში', 'Phone in hand'), pos: '30% 50%' },
    { slug: 'year-results', cat: 'company', product: '', date: '2026-05-30', title: L('ტაოს წლის შედეგები', 'TAO annual results'), excerpt: L('ანაზღაურებული შემთხვევები, ახალი მომხმარებლები და გეგმები.', 'Claims paid, new customers and plans.'), lead: L('გასულ წელს ტაომ [N] სადაზღვევო შემთხვევა აანაზღაურა და [N] ახალ მომხმარებელს შეუერთდა. ვაჯამებთ წელს და ვყვებით გეგმებზე.', 'Last year TAO paid [N] claims and welcomed [N] new customers. We sum up the year and share our plans.'), image: 'photo-people', alt: L('წყვილი ლურჯ კართან', 'Couple at a blue door'), pos: '50% 40%' },
    { slug: 'assistance-partner', cat: 'partners', product: 'travel', date: '2026-05-15', title: L('ახალი ასისტანს პარტნიორი საზღვარგარეთ', 'A new assistance partner abroad'), excerpt: L('სამოგზაურო პოლისით დახმარება 24/7, ნებისმიერ ქვეყანაში.', 'Help 24/7 with the travel policy, in any country.'), lead: L('ტაოს სამოგზაურო პოლისის მფლობელებს ახალი საერთაშორისო ასისტანს პარტნიორი ემსახურება. საზღვარგარეთ ექიმი თუ დაგჭირდა, ცხელ ხაზზე 24/7 გიპასუხებენ და გეტყვიან, სად მიხვიდე.', 'TAO travel policy holders are now served by a new international assistance partner. If you need a doctor abroad, the hotline answers 24/7 and tells you where to go.'), image: 'hero-home-tbilisi', alt: L('ქალი ლურჯ პალტოში თბილისის ქუჩაზე', 'Woman in a blue coat on a Tbilisi street'), pos: '70% 50%' },
  ]
  const updatedNews: string[] = []
  for (const n of news) {
    const t = S.news[n.slug]
    if (t) Object.assign(n, { cat: t.cat, title: t.title, excerpt: t.excerpt, lead: t.lead })
    const exists = await payload.find({ collection: 'news', where: { slug: { equals: n.slug } }, limit: 1 })
    if (exists.docs[0]) {
      if (!UPDATE) continue
      const id = exists.docs[0].id
      await payload.update({ collection: 'news', id, locale: 'ka', data: { category: idOf('news-categories', n.cat)!, title: n.title.ka, excerpt: n.excerpt.ka, lead: n.lead.ka } })
      await payload.update({ collection: 'news', id, locale: 'en', data: { title: n.title.en, excerpt: n.excerpt.en, lead: n.lead.en } })
      updatedNews.push(n.slug)
      console.log('news updated', n.slug)
      continue
    }
    const img = await image(n.image, n.alt)
    const doc = await payload.create({ collection: 'news', locale: 'ka', data: { slug: n.slug, category: idOf('news-categories', n.cat)!, product: n.product ? idOf('products', n.product) : undefined, date: n.date, title: n.title.ka, excerpt: n.excerpt.ka, lead: n.lead.ka, image: img, imagePosition: n.pos, published: true } })
    await payload.update({ collection: 'news', id: doc.id, locale: 'en', data: { title: n.title.en, excerpt: n.excerpt.en, lead: n.lead.en } })
    console.log('news', n.slug)
  }

  /* ---------- hero slides + promo banners ---------- */
  // Hero slides (texts from the design), then the image-only promo banners of the design's banner strip
  const heroLinks = ['/#products', '/health', '/travel']
  const heroImages = [
    { image: 'hero-home-tbilisi', alt: L('ქალი ლურჯ პალტოში თბილისის ქუჩაზე', 'Woman in a blue coat on a Tbilisi street'), pos: '83% 50%' },
    { image: 'hero-health-clinic', alt: L('ექიმი პაციენტს ესაუბრება კლინიკაში', 'Doctor talking to a patient in a clinic'), pos: '80% 50%' },
    { image: 'hero-travel-airport', alt: L('მგზავრი ჩემოდნით აეროპორტში', 'Traveller with a suitcase at the airport'), pos: '86% 50%' },
  ]
  const banners: { placement: 'hero' | 'promo'; title: Loc; text?: Loc; image: string; alt: Loc; pos: string; action?: Loc; href: string }[] = [
    ...S.hero.map((h, i) => ({ placement: 'hero' as const, title: h.title, text: h.text, action: h.action, href: heroLinks[i] || '/', ...heroImages[i] })),
    { placement: 'promo', title: L('სამოგზაურო დაზღვევა', 'Travel insurance'), image: 'hero-travel-airport', alt: L('მგზავრი ჩემოდნით აეროპორტში', 'Traveller with a suitcase at the airport'), pos: '50% 45%', href: '/travel' },
    { placement: 'promo', title: L('ჯანმრთელობის დაზღვევა', 'Health insurance'), image: 'offer-family-health', alt: L('ოჯახი დივანზე წიგნს კითხულობს', 'Family reading a book on the sofa'), pos: '50% 40%', href: '/health' },
    { placement: 'promo', title: L('ტაო დაზღვევის გუნდი', 'The TAO Insurance team'), image: 'about-team-office', alt: L('გუნდი ოფისში', 'Team in the office'), pos: '50% 35%', href: '/about' },
    { placement: 'promo', title: L('შეთავაზებები', 'Offers'), image: 'photo-people', alt: L('წყვილი ლურჯ კართან', 'Couple at a blue door'), pos: '50% 40%', href: '/offers' },
  ]
  /** The old typed address as a link choice (page / offer / news / portal / other site). */
  async function linkFor(href: string) {
    const m = href.match(/^\/(offers|news)\/(.+)$/)
    if (m) {
      const found = await payload.find({ collection: m[1] as 'offers', where: { slug: { equals: m[2] } }, limit: 1, depth: 0 })
      if (found.docs[0]) return { type: m[1] === 'offers' ? ('offer' as const) : ('news' as const), [m[1] === 'offers' ? 'offer' : 'news']: found.docs[0].id }
    }
    if (href === 'portal' || href.startsWith('portal:')) return { type: 'portal' as const, product: idOf('products', href.split(':')[1] || '') }
    if (href.startsWith('http')) return { type: 'url' as const, url: href }
    return { type: 'page' as const, page: href as '/' }
  }
  if (UPDATE) {
    // hero slides keep their place in the order: rewrite their texts in turn
    const hero = await payload.find({ collection: 'banners', where: { placement: { equals: 'hero' } }, sort: '_order', limit: 3, locale: 'ka', depth: 0 })
    for (const [i, doc] of hero.docs.entries()) {
      const b = banners[i]
      if (!b || b.placement !== 'hero') continue
      await payload.update({ collection: 'banners', id: doc.id, locale: 'ka', data: { title: b.title.ka, text: b.text?.ka, actionLabel: b.action?.ka } })
      await payload.update({ collection: 'banners', id: doc.id, locale: 'en', data: { title: b.title.en, text: b.text?.en, actionLabel: b.action?.en } })
      console.log('banner updated', b.title.ka)
    }
    // the old text promo banners give way to the design's image banners (switched off, not deleted)
    const keep = new Set(banners.filter((b) => b.placement === 'promo').map((b) => b.title.ka))
    const oldPromo = await payload.find({ collection: 'banners', where: { placement: { equals: 'promo' } }, limit: 50, locale: 'ka', depth: 0 })
    for (const doc of oldPromo.docs) {
      if (keep.has(doc.title as string)) continue
      await payload.update({ collection: 'banners', id: doc.id, data: { active: false } })
      console.log('banner switched off', doc.title)
    }
  }
  for (const b of banners) {
    if (UPDATE && b.placement === 'hero') continue
    const exists = await payload.find({ collection: 'banners', where: { and: [{ title: { equals: b.title.ka } }, { placement: { equals: b.placement } }] }, limit: 1, locale: 'ka' })
    if (exists.docs[0]) continue
    const img = await image(b.image, b.alt)
    const doc = await payload.create({ collection: 'banners', locale: 'ka', data: { placement: b.placement, title: b.title.ka, text: b.text?.ka, image: img, imagePosition: b.pos, actionLabel: b.action?.ka, link: await linkFor(b.href), active: true } })
    await payload.update({ collection: 'banners', id: doc.id, locale: 'en', data: { title: b.title.en, text: b.text?.en, actionLabel: b.action?.en } })
    console.log('banner', b.title.ka)
  }

  await fillNewsBodies(payload, UPDATE ? { force: true, slugs: updatedNews } : {})

  console.log('done')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
