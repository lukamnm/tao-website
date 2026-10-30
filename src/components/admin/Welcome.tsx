import React from 'react'
import type { Payload } from 'payload'
import { siteUrl } from '@/lib/site-url'
import { Icon } from '@/ds/Icon'

/* Start page of the admin: what is new, the most common tasks as big buttons, and a short guide. */

type Props = { payload: Payload; user?: { name?: string | null; email?: string; role?: string } | null }

const TASKS = [
  { href: '/admin/collections/news/create', title: 'სიახლის დამატება', text: 'კომპანიის ამბავი ან სტატია', icon: 'document-text' },
  { href: '/admin/collections/offers/create', title: 'შეთავაზების დამატება', text: 'აქცია ან პარტნიორის ფასდაკლება', icon: 'receipt-item' },
  { href: '/admin/collections/banners', title: 'ბანერების შეცვლა', text: 'მთავარი გვერდის სლაიდერი და პრომო', icon: 'global' },
  { href: '/admin/collections/documents/create', title: 'დოკუმენტის ატვირთვა', text: 'PDF: პირობები, ანგარიშგება', icon: 'document-download' },
  { href: '/admin/collections/products', title: 'პროდუქტები და კატეგორიები', text: 'დამატება, სახელის შეცვლა, წაშლა', icon: 'shield-tick' },
  { href: '/admin/globals/settings', title: 'საიტის პარამეტრები', text: 'ტელეფონი, მისამართი, სოც. ქსელები', icon: 'call-calling' },
]

export async function Welcome({ payload, user }: Props) {
  const [messages, requests] = await Promise.all([
    payload.count({ collection: 'contact-messages', where: { status: { equals: 'new' } }, overrideAccess: true }).catch(() => ({ totalDocs: 0 })),
    payload.count({ collection: 'corporate-requests', where: { status: { equals: 'new' } }, overrideAccess: true }).catch(() => ({ totalDocs: 0 })),
  ])
  const name = user?.name || user?.email?.split('@')[0] || ''
  return (
    <div className="tao-welcome">
      <div className="tao-welcome__head">
        <div>
          <h1>გამარჯობა{name ? `, ${name}` : ''}</h1>
          <p>აქედან მართავ საიტის ყველა ტექსტს, ფოტოს და დოკუმენტს. ცვლილება საიტზე შენახვისთანავე ჩანს.</p>
        </div>
        <a className="tao-welcome__site" href={siteUrl()} target="_blank" rel="noopener">
          საიტის ნახვა
          <Icon name="export-square" size={18} />
        </a>
      </div>

      <div className="tao-welcome__inbox">
        <a href="/admin/collections/contact-messages?where[status][equals]=new" className={messages.totalDocs ? 'is-new' : ''}>
          <strong>{messages.totalDocs}</strong>
          <span>ახალი შეტყობინება</span>
          <em>კონტაქტის ფორმიდან</em>
        </a>
        <a href="/admin/collections/corporate-requests?where[status][equals]=new" className={requests.totalDocs ? 'is-new' : ''}>
          <strong>{requests.totalDocs}</strong>
          <span>ახალი კორპორატიული მოთხოვნა</span>
          <em>ჯანმრთელობის დაზღვევის გვერდიდან</em>
        </a>
      </div>

      <h2 className="tao-welcome__h">რისი გაკეთება გინდა?</h2>
      <div className="tao-welcome__tasks">
        {TASKS.map((t) => (
          <a key={t.href} href={t.href} className="tao-welcome__task">
            <span className="tao-welcome__ic" aria-hidden="true"><Icon name={t.icon} size={22} /></span>
            <span>
              <strong>{t.title}</strong>
              <em>{t.text}</em>
            </span>
          </a>
        ))}
      </div>

      <details className="tao-welcome__guide">
        <summary>როგორ მუშაობს? (მოკლე ინსტრუქცია)</summary>
        <ol>
          <li><strong>ქართული და ინგლისური.</strong> ჯერ შეავსე ქართულად და შეინახე. შემდეგ ზედა მარჯვენა კუთხეში აირჩიე „English“ და შეავსე ინგლისური ტექსტი. თუ ინგლისურს არ შეავსებ, საიტი ქართულს აჩვენებს.</li>
          <li><strong>ფოტო.</strong> ფოტოს ატვირთვის შემდეგ დააჭირე მის იმ ნაწილს, რომელიც ყოველთვის უნდა ჩანდეს.</li>
          <li><strong>გადახედვა.</strong> შენახვის შემდეგ ზედა ღილაკი „გადახედვა“ გვერდს საიტზე გახსნის.</li>
          <li><strong>დამალვა წაშლის გარეშე.</strong> სიახლეს და ბანერს აქვს „საიტზე ჩანს“. მოხსენი მონიშვნა და ჩანაწერი საიტიდან გაქრება, მაგრამ შენთან დარჩება.</li>
          <li><strong>შეთავაზების ვადა.</strong> ვადის გასვლის შემდეგ შეთავაზება საიტიდან თავად ქრება.</li>
        </ol>
      </details>
    </div>
  )
}
