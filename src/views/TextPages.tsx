'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Button, Icon } from '@/ds'
import { useSite } from '@/site/SiteProvider'
import { InfoPage, InfoSection, Prose, P, Bullets, Notice, KeyValue, DocList } from './info'
import '@/ds/pages/other.css'
import { RichText } from './RichText'
import type { DocumentVM, PageVM } from '@/lib/content'

/* "Other information" (/other): one info page with three tabs in the URL hash, #privacy (default), #terms
   and #complaints. Privacy policy and terms of use: the design's text is the default; when the admin has
   created a "Pages" document with the same slug (privacy / terms), its rich text replaces the sections.
   Complaints: only the documents list. The old /privacy, /terms and /complaints URLs redirect here (src/proxy.ts). */

function CmsBody({ page }: { page: PageVM }) {
  return (
    <section data-reveal="up" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {page.intro ? (
        <Prose>
          <P>{page.intro}</P>
        </Prose>
      ) : null}
      <div className="tao-rich" style={{ maxWidth: 760 }}>
        <RichText data={page.body} />
      </div>
    </section>
  )
}

function PrivacyPanel({ page, pdf }: { page: PageVM | null; pdf?: DocumentVM }) {
  const { t, settings } = useSite()
  const rights = [
    ['ინფორმაციის მიღება', 'იცოდე, რა მონაცემებს ვამუშავებთ და რა მიზნით'],
    ['წვდომა', 'მოითხოვო შენი მონაცემების ასლი უსასყიდლოდ'],
    ['გასწორება', 'გაასწორებინო არაზუსტი, არასრული ან მოძველებული მონაცემები'],
    ['წაშლა ან დაბლოკვა', 'თუ მიგაჩნია, რომ დამუშავება კანონს არ შეესაბამება'],
    ['თანხმობის გამოხმობა', 'ნებისმიერ დროს, თუ დამუშავება თანხმობას ეფუძნება'],
    ['გასაჩივრება', 'წარადგინო საჩივარი ჩვენთან, ზედამხედველ ორგანოში ან სასამართლოში'],
    ['პორტაბელურობა', 'მიიღო მონაცემები სტრუქტურირებული ფორმით'],
    ['ავტომატური გადაწყვეტილება', 'არ დაექვემდებარო მხოლოდ ავტომატურად მიღებულ მნიშვნელოვან გადაწყვეტილებას'],
  ]
  const data = [
    ['საიდენტიფიკაციო მონაცემები', ': პირის იდენტიფიცირება და ხელშეკრულების გაფორმება'],
    ['საკონტაქტო ინფორმაცია', ': შენთან კომუნიკაცია და შეტყობინებები'],
    ['საბანკო რეკვიზიტები', ': გადახდები და ანაზღაურება'],
    ['ხელშეკრულების და სადაზღვევო შემთხვევის მონაცემები', ': პოლისის მომსახურება და ზარალის დარეგულირება'],
    ['ელექტრონული ხელმოწერა', ': დოკუმენტების დისტანციური გაფორმება, საჭიროების შემთხვევაში'],
  ]
  return (
    <>
      {pdf ? (
        <div data-reveal="up" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '20px 24px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 5 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 15 }}>
            <span style={{ display: 'flex', color: 'var(--link)' }}><Icon name="info-circle" size={22} /></span>
            {t('ქვემოთ მოცემულია პოლიტიკის მოკლე შინაარსი. სრული ვერსია PDF ფორმატშია.')}
          </span>
          <Button variant="secondary" size="sm" iconRight="document-download" href={pdf.url} download="">
            {t('სრული ვერსია (PDF)')}
          </Button>
        </div>
      ) : null}
      {page ? (
        <CmsBody page={page} />
      ) : (
        <>
          <InfoSection id="general" number={1} title="ზოგადი ინფორმაცია">
            <Prose>
              <P>{t('სს „სადაზღვევო კომპანია ტაო“ ლიცენზირებული მზღვეველია. პერსონალურ მონაცემებს ვამუშავებთ საქართველოს კანონმდებლობის, მათ შორის „პერსონალურ მონაცემთა დაცვის შესახებ“ კანონის და საერთაშორისო პრაქტიკის შესაბამისად.')}</P>
              <P>{t('პერსონალური მონაცემი არის ნებისმიერი ინფორმაცია, რომლითაც შესაძლებელია პირის პირდაპირ ან ირიბად იდენტიფიცირება: მაგალითად, სახელი, დაბადების თარიღი, საკონტაქტო ინფორმაცია, ქონება ან სამუშაო ადგილი.')}</P>
            </Prose>
          </InfoSection>
          <InfoSection id="collection" title="ვისი და როგორ ვაგროვებთ მონაცემებს">
            <Prose>
              <P>{t('ვამუშავებთ კლიენტების, დამზღვევების, დაზღვეულების და სადაზღვევო შემთხვევაში ჩართული სხვა პირების მონაცემებს. მონაცემებს ვიღებთ:')}</P>
            </Prose>
            <Bullets items={['უშუალოდ შენგან, მათ შორის სადაზღვევო განაცხადით', 'სატელეფონო ზარის ან ელფოსტით კომუნიკაციისას', 'მესამე პირებისგან, ხელშეკრულების ან კანონის საფუძველზე', 'საჯარო წყაროებიდან'].map((s) => t(s))} />
          </InfoSection>
          <InfoSection id="purposes" title="რა მონაცემებს ვამუშავებთ და რისთვის">
            <Bullets
              items={data.map(([k, v]) => (
                <>
                  <strong>{t(k)}</strong>
                  {t(v)}
                </>
              ))}
            />
            <Notice>{t('მონაცემებს ვამუშავებთ მხოლოდ კანონიერი საფუძვლით: შენი თანხმობით, ხელშეკრულების შესასრულებლად, კანონით დაკისრებული ვალდებულების ან კანონიერი ინტერესის გამო.')}</Notice>
          </InfoSection>
          <InfoSection id="calls" number={2} title="სატელეფონო ზარების ჩაწერა">
            <Prose>
              <P>{t('ზარს ვიწერთ მხოლოდ მას შემდეგ, რაც ამის შესახებ გაცნობებთ. ჩანაწერს ვიყენებთ მომსახურების ხარისხის კონტროლისთვის, დავის შემთხვევაში მტკიცებულებად და კანონის მოთხოვნების შესასრულებლად. ჩანაწერებს ვინახავთ კანონით განსაზღვრული ვადით.')}</P>
            </Prose>
          </InfoSection>
          <InfoSection id="sharing" number={3} title="ვის ვუზიარებთ მონაცემებს">
            <Prose>
              <P>{t('მონაცემებს ვუზიარებთ მხოლოდ საჭიროების შემთხვევაში და კონფიდენციალურობის ვალდებულებით:')}</P>
            </Prose>
            <Bullets items={['ზედამხედველ და სხვა სახელმწიფო ორგანოებს, კანონის მოთხოვნით', 'სამართალდამცავ ორგანოებს, კანონით დადგენილ შემთხვევებში', 'ხელშეკრულებით მოქმედ მომსახურების მიმწოდებლებს', 'თანადამმუშავებლებს, შენი თანხმობით'].map((s) => t(s))} />
            <Prose>
              <P>{t('თუ მონაცემებს არ მოგვაწვდი, შესაძლოა ვერ შევძლოთ მომსახურების გაწევა, პირის იდენტიფიცირება ან განაცხადის განხილვა')}</P>
            </Prose>
          </InfoSection>
          <InfoSection id="retention" number={4} title="შენახვის ვადა">
            <Prose>
              <P>{t('მონაცემებს ვინახავთ მომსახურების განმავლობაში და მისი დასრულების შემდეგ იმ ვადით, რასაც კანონი ან დამუშავების მიზანი მოითხოვს')}</P>
            </Prose>
          </InfoSection>
          <InfoSection id="rights" number={5} title="შენი უფლებები">
            <div className="tao-irights" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', borderTop: '1px solid var(--border)', borderLeft: '1px solid var(--border)' }}>
              {rights.map(([k, v], i) => (
                <div key={k} className="tao-iright" style={{ padding: 24, borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <span style={{ flex: 'none', width: 32, height: 32, boxSizing: 'border-box', border: '1px solid var(--link)', color: 'var(--link)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14 }}>{i + 1}</span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <strong style={{ fontSize: 17, fontWeight: 500 }}>{t(k)}</strong>
                    <span style={{ fontSize: 15, color: 'var(--text-secondary)' }}>{t(v)}</span>
                  </span>
                </div>
              ))}
            </div>
          </InfoSection>
          <InfoSection id="contact" number={6} title="კონტაქტი">
            <KeyValue
              rows={[
                { k: 'მისამართი', v: settings.address },
                { k: 'ტელეფონი', v: <a href={'tel:' + settings.phoneHref} style={{ color: 'var(--link)' }}>{settings.phone}</a> },
                { k: 'ელფოსტა', v: <a href={'mailto:' + settings.email} style={{ color: 'var(--link)' }}>{settings.email}</a> },
                { k: 'პერსონალურ მონაცემთა დაცვის ოფიცერი', v: t('შპს „Privacy Professionals“ (ს/კ 405682916)') },
              ]}
            />
            <Prose>
              <P>{t('პოლიტიკას პერიოდულად ვაახლებთ. ცვლილებები ქვეყნდება ამავე გვერდზე.')}</P>
            </Prose>
          </InfoSection>
        </>
      )}
    </>
  )
}

function TermsPanel({ page }: { page: PageVM | null }) {
  const { t, L, settings } = useSite()
  return (
    <>
      {page ? (
        <CmsBody page={page} />
      ) : (
        <>
          <Notice icon="warning-2">{t('ეს არის საიტის წესების სამუშაო ვერსია. გამოქვეყნებამდე ტექსტი იურისტმა უნდა გადახედოს.')}</Notice>
          <InfoSection id="t1" number={1} title="ზოგადი დებულებები">
            <Prose><P>{t('ვებგვერდი taoinsurance.ge ეკუთვნის სს „სადაზღვევო კომპანია ტაოს“. საიტის გამოყენებით ეთანხმები ამ წესებს. თუ არ ეთანხმები, გთხოვ, საიტით ნუ ისარგებლებ.')}</P></Prose>
          </InfoSection>
          <InfoSection id="t2" number={2} title="ინფორმაცია საიტზე">
            <Prose><P>{t('საიტზე განთავსებული ინფორმაცია საცნობაროა და არ წარმოადგენს სადაზღვევო ხელშეკრულებას. დაზღვევის პირობები განისაზღვრება პოლისით და მისი დანართებით. ფასები და შეთავაზებები შეიძლება შეიცვალოს წინასწარი გაფრთხილების გარეშე.')}</P></Prose>
          </InfoSection>
          <InfoSection id="t3" number={3} title="ონლაინ შეძენა და პორტალი">
            <Prose><P>{t('პოლისის ონლაინ შეძენა და ანაზღაურების მოთხოვნა ხორციელდება ტაო დაზღვევის პორტალზე, რომელსაც საკუთარი წესები აქვს. პასუხისმგებელი ხარ, რომ მითითებული ინფორმაცია იყოს ზუსტი და სრული.')}</P></Prose>
          </InfoSection>
          <InfoSection id="t4" number={4} title="ინტელექტუალური საკუთრება">
            <Prose><P>{t('ლოგო, ბრენდის ელემენტები, ტექსტები, ფოტოები და დიზაინი ტაო დაზღვევის საკუთრებაა ან გამოიყენება ლიცენზიით. მათი კოპირება ან კომერციული გამოყენება წერილობითი თანხმობის გარეშე აკრძალულია.')}</P></Prose>
          </InfoSection>
          <InfoSection id="t5" number={5} title="აკრძალული ქმედებები">
            <Bullets items={['საიტის მუშაობის შეფერხება ან უნებართვო წვდომის მცდელობა', 'სხვისი მონაცემების გამოყენება ან ყალბი ინფორმაციის მიწოდება', 'საიტის შიგთავსის ავტომატური შეგროვება'].map((s) => t(s))} />
          </InfoSection>
          <InfoSection id="t6" number={6} title="პასუხისმგებლობის შეზღუდვა">
            <Prose><P>{t('ვცდილობთ, საიტი იყოს ზუსტი და ხელმისაწვდომი, თუმცა ვერ გარანტირებთ მის უწყვეტ მუშაობას. მესამე მხარის საიტებზე ბმულები მოცემულია მხოლოდ მოხერხებულობისთვის და მათ შიგთავსზე პასუხს არ ვაგებთ.')}</P></Prose>
          </InfoSection>
          <InfoSection id="t7" title="პერსონალური მონაცემები და ქუქიები">
            <Prose>
              <P>
                {t('მონაცემების დამუშავება რეგულირდება')} <a href={L('/other#privacy')} style={{ color: 'var(--link)' }}>{t('კონფიდენციალურობის პოლიტიკით')}</a>
                {t('. საიტი იყენებს ქუქი-ფაილებს მუშაობისთვის და ანალიტიკისთვის; არააუცილებელ ქუქიებზე უარის თქმა ბრაუზერის პარამეტრებში შეგიძლია.')}
              </P>
            </Prose>
          </InfoSection>
          <InfoSection id="t8" title="ცვლილებები და კანონმდებლობა">
            <Prose>
              <P>{t('წესები შეიძლება განახლდეს. ცვლილებები ძალაში შედის ამ გვერდზე გამოქვეყნებისთანავე. ურთიერთობა რეგულირდება საქართველოს კანონმდებლობით.')}</P>
              <P>
                {t('კითხვების შემთხვევაში მოგვწერე:')} <a href={'mailto:' + settings.email} style={{ color: 'var(--link)' }}>{settings.email}</a>.
              </P>
            </Prose>
          </InfoSection>
        </>
      )}
    </>
  )
}

const TABS = [
  { id: 'privacy', label: 'კონფიდენციალურობის პოლიტიკა', icon: 'security-safe' },
  { id: 'terms', label: 'საიტის გამოყენების წესები', icon: 'shield-tick' },
  { id: 'complaints', label: 'პრეტენზიების განხილვის წესი', icon: 'messages-2' },
] as const
type TabId = (typeof TABS)[number]['id']
const tabOf = (hash: string): TabId | null => {
  const h = hash.replace(/^#/, '')
  return TABS.some((x) => x.id === h) ? (h as TabId) : null
}

export function Other({ privacy, terms, pdf, complaintDocs }: { privacy: PageVM | null; terms: PageVM | null; pdf?: DocumentVM; complaintDocs: DocumentVM[] }) {
  const { t } = useSite()
  const [tab, setTab] = useState<TabId>('privacy')
  const tabsRef = useRef<HTMLDivElement>(null)

  // the tab comes from the URL hash: on load, and when an in-page link (e.g. "#privacy" in the terms) changes it
  useEffect(() => {
    const fromHash = tabOf(window.location.hash)
    if (fromHash) setTab(fromHash)
    const onHash = () => {
      const h = tabOf(window.location.hash)
      if (!h) return
      setTab(h)
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // narrow screens: keep the active tab inside the horizontally scrolling tab row
  useEffect(() => {
    const row = tabsRef.current
    const btn = row?.querySelector<HTMLElement>('[aria-selected="true"]')
    if (!row || !btn) return
    if (btn.offsetLeft < row.scrollLeft) row.scrollLeft = btn.offsetLeft
    else if (btn.offsetLeft + btn.offsetWidth > row.scrollLeft + row.clientWidth) row.scrollLeft = btn.offsetLeft + btn.offsetWidth - row.clientWidth
  }, [tab])

  const pick = (id: TabId) => {
    setTab(id)
    try {
      window.history.replaceState(window.history.state, '', '#' + id)
    } catch {}
  }

  const panel: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 72 }
  return (
    <InfoPage current="/other" title="სხვა ინფორმაცია">
      <div ref={tabsRef} role="tablist" aria-label={t('სხვა ინფორმაცია')} className="tao-itabs" style={{ display: 'flex', flexWrap: 'nowrap', gap: 8, marginBottom: -24, overflowX: 'auto', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
        {TABS.map((x) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            id={'tab-' + x.id}
            aria-controls={'panel-' + x.id}
            aria-selected={tab === x.id}
            onClick={() => pick(x.id)}
            className={'tao-itab' + (tab === x.id ? ' is-on' : '')}
            style={{ flex: 'none', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 8, height: 44, padding: '0 16px', boxSizing: 'border-box', border: '1px solid var(--border)', borderRadius: 5, background: 'var(--surface)', fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 500, color: 'var(--text)', cursor: 'pointer' }}
          >
            <Icon name={x.icon} size={18} />
            {t(x.label)}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="tao-ipanel" id="panel-privacy" aria-labelledby="tab-privacy" hidden={tab !== 'privacy'} style={panel}>
        <PrivacyPanel page={privacy} pdf={pdf} />
      </div>
      <div role="tabpanel" className="tao-ipanel" id="panel-terms" aria-labelledby="tab-terms" hidden={tab !== 'terms'} style={panel}>
        <TermsPanel page={terms} />
      </div>
      <div role="tabpanel" className="tao-ipanel" id="panel-complaints" aria-labelledby="tab-complaints" hidden={tab !== 'complaints'} style={panel}>
        <section id="documents" data-reveal="up" style={{ display: 'flex', flexDirection: 'column', gap: 28, scrollMarginTop: 100 }}>
          <DocList docs={complaintDocs} emptyText="დოკუმენტები მალე დაემატება." />
        </section>
      </div>
    </InfoPage>
  )
}
