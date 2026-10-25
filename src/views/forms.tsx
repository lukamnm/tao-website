'use client'
import React from 'react'
import { useSite } from '@/site/SiteProvider'
import { css } from '@/site/css'

/* Form pieces shared by the contact form and the corporate lead form. */

export function Field({ label, name, error, type = 'text', autoComplete, placeholder, inputMode, optional, multiline, rows }: { label: string; name: string; error?: string; type?: string; autoComplete?: string; placeholder?: string; inputMode?: 'numeric' | 'tel' | 'email' | 'text'; optional?: string; multiline?: boolean; rows?: number }) {
  const { t } = useSite()
  const bad = error ? 'border-color: var(--error);' : ''
  return (
    <label className="tao-cfield" style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
      <span style={{ fontSize: 14, fontWeight: 500 }}>
        {t(label)}
        {optional ? (
          <>
            {' '}
            <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>{t(optional)}</span>
          </>
        ) : null}
      </span>
      {multiline ? (
        <textarea name={name} rows={rows || 5} aria-invalid={!!error} style={css`${bad}`} />
      ) : (
        <input name={name} type={type} autoComplete={autoComplete} placeholder={placeholder ? t(placeholder) : undefined} inputMode={inputMode} aria-invalid={!!error} style={css`${bad}`} />
      )}
      <span className="tao-cerr" style={{ fontSize: 13, color: 'var(--error)' }}>{error ? t(error) : ''}</span>
    </label>
  )
}

export function Consent({ on, error, onToggle }: { on: boolean; error?: boolean; onToggle: () => void }) {
  const { t, L } = useSite()
  return (
    <button type="button" role="checkbox" aria-checked={on} onClick={onToggle} className={'tao-ocheck' + (on ? ' is-on' : '')} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '4px 0', border: 0, background: 'transparent', textAlign: 'left', fontFamily: 'var(--font-sans)', fontSize: 14, lineHeight: 1.5, color: 'var(--text-secondary)', cursor: 'pointer' }}>
      <span className="tao-ocheck__box" aria-hidden="true" style={{ flex: 'none', width: 20, height: 20, marginTop: 1, boxSizing: 'border-box', border: '1px solid ' + (error ? 'var(--error)' : 'var(--control-border)'), display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--on-primary)' }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6.2 4.7 9 10 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
        </svg>
      </span>
      <span>
        {t('ვეთანხმები პერსონალური მონაცემების დამუშავებას')}{' '}
        <a href={L('/privacy')} style={{ color: 'var(--link)' }} onClick={(e) => e.stopPropagation()}>
          {t('კონფიდენციალურობის პოლიტიკის')}
        </a>{' '}
        {t('მიხედვით.')}
      </span>
    </button>
  )
}

export function SubmitRow({ pending, error }: { pending: boolean; error?: string }) {
  const { t } = useSite()
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, paddingTop: 4 }}>
      <button type="submit" className="tao-btn tao-btn--primary tao-btn--md" disabled={pending} style={pending ? { opacity: 0.7 } : undefined}>
        <span className="tao-btn__label tao-caps">{t(pending ? 'იგზავნება...' : 'გაგზავნა')}</span>
      </button>
      <span style={{ fontSize: 13, color: 'var(--error)' }}>{error ? t(error) : ''}</span>
    </div>
  )
}
