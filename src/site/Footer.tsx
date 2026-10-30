'use client'
import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Button, Icon, LanguageSwitch, Logo } from '@/ds'
import { useSite } from './SiteProvider'
import { switchLocalePath } from '@/i18n'

/* Footer: bento of separate panels on the page ground (help panel in TAO blue, the rest black). */
export function Footer() {
  const { t, L, locale, settings } = useSite()
  const pathname = usePathname()
  const router = useRouter()
  const year = new Date().getFullYear()
  const onLang = (v: string) => {
    if (v === locale) return
    router.push(switchLocalePath(locale, pathname))
  }
  const tile: React.CSSProperties = { boxSizing: 'border-box', display: 'flex', alignItems: 'center', gap: 20, padding: '16px 16px', borderTop: '1px solid var(--on-blue-line)', color: 'var(--on-primary)', textDecoration: 'none' }
  const flink: React.CSSProperties = { color: 'var(--on-primary)', textDecoration: 'none', fontSize: 15 }
  const kicker: React.CSSProperties = { margin: '0 0 20px', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', color: '#A8ADB3' }
  const ul: React.CSSProperties = { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }
  const socials = [{ label: 'Facebook', href: settings.facebook || '#facebook' }]
  const caps: React.CSSProperties = { margin: 0, fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', color: '#A8ADB3' }
  const addr = (label: string, text: string) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <p className="tao-caps" style={caps}>{t(label)}</p>
      <p style={{ margin: 0, display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 15, lineHeight: 1.5 }}>
        <span style={{ display: 'flex', flex: 'none', paddingTop: 2 }}>
          <Icon name="location" size={18} />
        </span>
        {text}
      </p>
    </div>
  )

  return (
    <footer className="tao-bento" data-reveal="up" style={{ margin: '4px 4px 0', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 3fr)', gap: 4 }}>
      <div className="tao-bento__brand" style={{ borderRadius: 5, boxSizing: 'border-box', minWidth: 0, gridRow: 'span 2', background: 'var(--brand-black)', color: 'var(--on-primary)', padding: '48px 40px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <Logo variant="whitetext" height={36} href="#top" />
        <p style={{ margin: 0, fontSize: 16, color: '#A8ADB3' }}>{t('დაზღვევა, რომელიც მუშაობს')}</p>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {addr('ოფისი', settings.address)}
          {addr('სერვის ცენტრი', settings.service.address)}
          <div style={{ display: 'flex', gap: 16, paddingTop: 8 }}>
            {socials.map((s) => (
              <a key={s.label} href={s.href} className="tao-flink" style={flink} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noopener">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="tao-bento__help" style={{ borderRadius: 5, boxSizing: 'border-box', minWidth: 0, background: 'var(--primary)', color: 'var(--on-primary)', padding: 48, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 40 }}>
        <div style={{ flex: '1 1 280px', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 16 }}>
          <h2 className="tao-h tao-h--h2" style={{ margin: 0, color: 'var(--on-primary)' }}>{t('გჭირდება დახმარება?')}</h2>
          <p style={{ margin: 0, maxWidth: 380, fontSize: 17, color: 'var(--on-blue-muted)' }}>{t('დაგვირეკე ან მოგვწერე - ყველა კითხვაზე გიპასუხებთ')}</p>
          <Button variant="onBlue" iconRight="arrow-right" href={L('/contact')}>
            {t('დაგვიკავშირდი')}
          </Button>
        </div>
        <div style={{ flex: '1.6 1 460px', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <a href={'tel:' + settings.phoneHref} className="tao-helptile" style={tile}>
            <span style={{ display: 'flex', flex: 'none' }}><Icon name="call-calling" size={22} /></span>
            <span className="tao-caps" style={{ flex: '0 0 160px', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', color: 'var(--on-blue-muted)' }}>{t('ტელეფონი')}</span>
            <span style={{ flex: 1, minWidth: 0, fontSize: 20, fontWeight: 500, whiteSpace: 'nowrap' }}>{settings.phone}</span>
            <span style={{ display: 'flex', flex: 'none' }}><Icon name="arrow-right" size={18} /></span>
          </a>
          <a href={'mailto:' + settings.email} className="tao-helptile" style={{ ...tile, borderBottom: '1px solid var(--on-blue-line)' }}>
            <span style={{ display: 'flex', flex: 'none' }}><Icon name="sms" size={22} /></span>
            <span className="tao-caps" style={{ flex: '0 0 160px', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em', color: 'var(--on-blue-muted)' }}>{t('ელფოსტა')}</span>
            <span style={{ flex: 1, minWidth: 0, fontSize: 20, fontWeight: 500, whiteSpace: 'nowrap' }}>{settings.email}</span>
            <span style={{ display: 'flex', flex: 'none' }}><Icon name="arrow-right" size={18} /></span>
          </a>
        </div>
      </div>
      <nav aria-label={t('ფუტერის ბმულები')} className="tao-bento__links" style={{ borderRadius: 5, boxSizing: 'border-box', minWidth: 0, background: 'var(--brand-black)', color: 'var(--on-primary)', padding: '40px 48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32 }}>
        <div style={{ minWidth: 0 }}>
          <p className="tao-caps" style={kicker}>{t('დაზღვევა')}</p>
          <ul style={ul}>
            {settings.products.filter((p) => p.inMenu).map((p) => (
              <li key={p.key}><a href={L(p.href)} className="tao-flink" style={flink}>{p.name}</a></li>
            ))}
          </ul>
        </div>
        <div style={{ minWidth: 0 }}>
          <p className="tao-caps" style={kicker}>{t('კომპანია')}</p>
          <ul style={ul}>
            <li><a href={L('/about')} className="tao-flink" style={flink}>{t('ჩვენ შესახებ')}</a></li>
            <li><a href={L('/offers')} className="tao-flink" style={flink}>{t('შეთავაზებები')}</a></li>
            <li><a href={L('/news')} className="tao-flink" style={flink}>{t('სიახლეები')}</a></li>
            <li><a href={L('/contact')} className="tao-flink" style={flink}>{t('კონტაქტი')}</a></li>
          </ul>
        </div>
        <div style={{ minWidth: 0 }}>
          <p className="tao-caps" style={kicker}>{t('ინფორმაცია')}</p>
          <ul style={ul}>
            <li><a href={L('/legal')} className="tao-flink" style={flink}>{t('იურიდიული ინფორმაცია')}</a></li>
            <li><a href={L('/financial')} className="tao-flink" style={flink}>{t('ფინანსური ინფორმაცია')}</a></li>
            <li><a href={L('/complaints')} className="tao-flink" style={flink}>{t('პრეტენზიების განხილვის წესი')}</a></li>
            <li><a href={L('/privacy')} className="tao-flink" style={flink}>{t('კონფიდენციალურობის პოლიტიკა')}</a></li>
            <li><a href={L('/terms')} className="tao-flink" style={flink}>{t('საიტის გამოყენების წესები')}</a></li>
          </ul>
        </div>
      </nav>
      <div className="tao-bento__bottom" style={{ borderRadius: 5, boxSizing: 'border-box', minWidth: 0, gridColumn: '1 / -1', background: 'var(--brand-black)', color: '#A8ADB3', padding: '18px 40px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <p className="tao-caps" style={{ margin: 0, fontSize: 12, fontWeight: 500, letterSpacing: '0.08em' }}>
          {locale === 'en' ? `© ${year} TAO Insurance Company. All rights reserved.` : `© ${year} სადაზღვევო კომპანია ტაო. ყველა უფლება დაცულია.`}
        </p>
        <LanguageSwitch tone="onBlue" value={locale} onChange={onLang} />
        <a href="#top" className="tao-caps tao-flink" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--on-primary)', textDecoration: 'none', fontSize: 12, fontWeight: 500, letterSpacing: '0.08em' }}>
          {t('ზემოთ')}
          <Icon name="arrow-up-2" size={16} />
        </a>
      </div>
    </footer>
  )
}
