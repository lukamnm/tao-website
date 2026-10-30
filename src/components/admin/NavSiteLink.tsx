import React from 'react'
import { siteUrl } from '@/lib/site-url'
import { Icon } from '@/ds/Icon'

/** Link to the public site at the bottom of the admin menu. */
export function NavSiteLink() {
  return (
    <a className="tao-navsite" href={siteUrl()} target="_blank" rel="noopener">
      საიტის ნახვა <Icon name="export-square" size={16} />
    </a>
  )
}
