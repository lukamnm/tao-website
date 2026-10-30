'use client'
import React from 'react'
import { FieldLabel, useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'
import { Icon } from '@/ds/Icon'

/* Icon chosen from the brand icon set by clicking, instead of typing an icon name. */
const CHOICES = ['health', 'airplane', 'car', 'house', 'building', 'shield-tick', 'security-safe', '24-support', 'call-calling', 'receipt-item', 'wallet', 'card', 'money-send', 'calendar', 'document-text', 'location', 'global', 'messages-2']

export const IconPickerField: TextFieldClientComponent = ({ path, field }) => {
  const { value, setValue } = useField<string>({ path })
  return (
    <div className="field-type" style={{ marginBottom: 24 }}>
      <FieldLabel label={field?.label || 'აიქონი'} path={path} required={field?.required} />
      <div className="tao-iconpick" role="radiogroup">
        {CHOICES.map((name) => (
          <button key={name} type="button" role="radio" aria-checked={value === name} aria-label={name} className={'tao-iconpick__item' + (value === name ? ' is-on' : '')} onClick={() => setValue(name)}>
            <Icon name={name} size={24} />
          </button>
        ))}
      </div>
    </div>
  )
}
