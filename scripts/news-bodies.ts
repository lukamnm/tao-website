/* Article text for the sample news, taken from the Claude Design project (one body per category),
   written as Lexical rich text in Georgian and English. Used by the seed; fills only empty bodies. */
import type { Payload } from 'payload'
import dict from '../src/i18n/dict.json'

type Block = { h?: string; p?: string; list?: string[]; q?: string; cite?: string; img?: 'phone'; alt?: string }

const BODY: Record<string, Block[]> = {
  company: [
    { h: 'რა იცვლება' },
    { p: 'ცვლილება ეხება იმას, როგორ ვურთიერთობთ მომხმარებლებთან: ნაკლები ქაღალდი, მეტი ციფრული სერვისი და მარტივი, გასაგები ენა.' },
    { list: ['პოლისის შეძენა ონლაინ, რამდენიმე წუთში', 'ანაზღაურების მოთხოვნა პორტალზე', 'ცხელი ხაზი 24/7'] },
    { q: 'ჩვენთვის მთავარია, რომ დაზღვევა საჭირო დროს მუშაობდეს და ყველასთვის გასაგები იყოს.', cite: '[სახელი გვარი], ტაოს გენერალური დირექტორი' },
    { h: 'რა არ იცვლება' },
    { p: 'მოქმედი პოლისები და მათი პირობები უცვლელია. თუ კითხვა გაქვს, დაგვირეკე ან მოგვწერე, ყველა კითხვაზე გიპასუხებთ.' },
  ],
  products: [
    { h: 'როგორ მუშაობს' },
    { p: 'გადადი ტაოს პორტალზე, აირჩიე პროდუქტი და შეავსე მოკლე განაცხადი. ფასს მაშინვე ნახავ, გადახდის შემდეგ კი პოლისი ელფოსტაზე მოგივა.' },
    { list: ['აირჩიე პროდუქტი და პაკეტი', 'შეავსე განაცხადი', 'გადაიხადე ონლაინ და მიიღე პოლისი'] },
    { img: 'phone', alt: 'ტელეფონი ხელში', p: 'პოლისის გაფორმება ტელეფონიდანაც შეგიძლია.' },
    { h: 'რა უნდა გაითვალისწინო' },
    { p: 'სანამ პოლისს შეიძენ, გაეცანი დაზღვევის პირობებს. დოკუმენტები პროდუქტის გვერდზე შეგიძლია ჩამოტვირთო.' },
  ],
  campaigns: [
    { h: 'კამპანიის პირობები' },
    { p: 'კამპანია მოქმედებს მითითებულ ვადაში შეძენილ ახალ პოლისებზე. ფასდაკლება ავტომატურად აისახება პორტალზე, პრომოკოდი საჭირო არ არის.' },
    { list: ['მოქმედებს მხოლოდ ახალ პოლისებზე', 'არ ჯამდება სხვა აქციებთან', 'პოლისის პირობები უცვლელია'] },
    { q: 'გვინდოდა, რომ სრული დაცვა უფრო ხელმისაწვდომი ყოფილიყო.', cite: '[სახელი გვარი], მარკეტინგის ხელმძღვანელი' },
    { p: 'დეტალები და აქტიური შეთავაზებები ნახე შეთავაზებების გვერდზე.' },
  ],
  partners: [
    { h: 'რას ნიშნავს ეს შენთვის' },
    { p: 'პარტნიორობა ტაოს მომხმარებლებს მეტ არჩევანს და სწრაფ მომსახურებას აძლევს. საკმარისია, წარადგინო პოლისის ნომერი ან პირადობის მოწმობა.' },
    { list: ['მომსახურება რიგის გარეშე', 'ანგარიშს პარტნიორთან ტაო ასწორებს', 'სრული სია პოლისის დოკუმენტებშია'] },
    { q: 'ერთად შეგვიძლია, მომხმარებელს დრო და ნერვები დავუზოგოთ.', cite: '[სახელი გვარი], [პარტნიორი]' },
    { p: 'პარტნიორების განახლებულ სიას ვებგვერდზე და პორტალზე ნახავ.' },
  ],
}

const D = dict as Record<string, string>
const base = { format: '', indent: 0, version: 1, direction: 'ltr' as const }
const text = (t: string) => ({ type: 'text', text: t, format: 0, style: '', mode: 'normal', detail: 0, version: 1 })

function lexical(blocks: Block[], locale: 'ka' | 'en', phoneId?: number | string) {
  const tr = (s: string) => (locale === 'en' ? D[s] || s : s)
  const children: unknown[] = []
  for (const b of blocks) {
    if (b.h) children.push({ ...base, type: 'heading', tag: 'h2', children: [text(tr(b.h))] })
    else if (b.list) children.push({ ...base, type: 'list', listType: 'bullet', tag: 'ul', start: 1, children: b.list.map((li, i) => ({ ...base, type: 'listitem', value: i + 1, children: [text(tr(li))] })) })
    else if (b.q) children.push({ ...base, type: 'quote', children: [text(tr(b.q)), { type: 'linebreak', version: 1 }, text(tr(b.cite || ''))] })
    else if (b.img) {
      if (phoneId != null) children.push({ type: 'upload', relationTo: 'media', value: phoneId, fields: null, format: '', version: 3, id: Math.random().toString(16).slice(2, 26) })
      if (b.p) children.push({ ...base, type: 'paragraph', textFormat: 0, textStyle: '', children: [text(tr(b.p))] })
    } else if (b.p) children.push({ ...base, type: 'paragraph', textFormat: 0, textStyle: '', children: [text(tr(b.p))] })
  }
  return { root: { ...base, type: 'root', children } }
}

export async function fillNewsBodies(payload: Payload) {
  const phone = await payload.find({ collection: 'media', where: { filename: { like: 'news-phone-online' } }, limit: 1 })
  const phoneId = phone.docs[0]?.id
  const news = await payload.find({ collection: 'news', limit: 500, locale: 'ka', depth: 0 })
  let n = 0
  for (const item of news.docs) {
    if (item.body) continue
    const blocks = BODY[item.category as string]
    if (!blocks) continue
    await payload.update({ collection: 'news', id: item.id, locale: 'ka', data: { body: lexical(blocks, 'ka', phoneId) as never } })
    await payload.update({ collection: 'news', id: item.id, locale: 'en', data: { body: lexical(blocks, 'en', phoneId) as never } })
    n++
  }
  console.log('news bodies filled:', n)
}
