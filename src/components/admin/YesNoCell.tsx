import React from 'react'
import type { DefaultServerCellComponentProps } from 'payload'

/** Checkbox columns in lists read "კი" / "არა" instead of true / false. */
export function YesNoCell({ cellData }: DefaultServerCellComponentProps) {
  const yes = cellData === true
  return <span className={'tao-yesno ' + (yes ? 'is-yes' : 'is-no')}>{yes ? 'კი' : 'არა'}</span>
}
