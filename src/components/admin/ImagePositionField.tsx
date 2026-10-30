'use client'
import React, { useEffect, useRef, useState } from 'react'
import { FieldLabel, useField, useFormFields } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'

/* "Main point of the photo": the editor clicks the part of the photo that must always stay visible.
   Stored as an object-position value ("70% 40%"). Previews show how the photo is cut in a wide and a tall frame. */

const parse = (v: unknown): [number, number] => {
  const m = typeof v === 'string' ? v.match(/(-?\d+(?:\.\d+)?)%\s+(-?\d+(?:\.\d+)?)%/) : null
  return m ? [Math.min(100, Math.max(0, +m[1])), Math.min(100, Math.max(0, +m[2]))] : [50, 50]
}

export const ImagePositionField: TextFieldClientComponent = ({ path, field }) => {
  const { value, setValue } = useField<string>({ path })
  const imagePath = path.replace(/imagePosition$/, 'image')
  const imageId = useFormFields(([fields]) => fields[imagePath]?.value) as unknown
  const [url, setUrl] = useState<string | null>(null)
  const box = useRef<HTMLDivElement>(null)
  const [x, y] = parse(value)

  useEffect(() => {
    let dead = false
    const id = imageId && typeof imageId === 'object' ? (imageId as { id?: string | number }).id : imageId
    if (!id) {
      setUrl(null)
      return
    }
    fetch(`/api/media/${id}?depth=0`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!dead && d) setUrl(d.sizes?.card?.url || d.url || null)
      })
      .catch(() => {})
    return () => {
      dead = true
    }
  }, [imageId])

  const pick = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = box.current?.getBoundingClientRect()
    if (!r) return
    const px = Math.round(((e.clientX - r.left) / r.width) * 100)
    const py = Math.round(((e.clientY - r.top) / r.height) * 100)
    setValue(`${px}% ${py}%`)
  }

  if (!url) return null
  const pos = `${x}% ${y}%`
  return (
    <div className="field-type tao-imgpos" style={{ marginBottom: 24 }}>
      <FieldLabel label={field?.label || 'ფოტოს მთავარი წერტილი'} path={path} />
      <p className="tao-imgpos__help">დააჭირე ფოტოზე იმ ადგილს, რომელიც ყოველთვის უნდა ჩანდეს (მაგ: სახე). საიტზე ფოტო სხვადასხვა ფორმით იჭრება.</p>
      <div className="tao-imgpos__row">
        <div ref={box} className="tao-imgpos__pick" onClick={pick} role="button" aria-label="მთავარი წერტილის არჩევა">
          <img src={url} alt="" draggable={false} />
          <span className="tao-imgpos__dot" style={{ left: `${x}%`, top: `${y}%` }} />
        </div>
        <div className="tao-imgpos__previews">
          <span className="tao-imgpos__cap">ასე ჩანს საიტზე:</span>
          <div className="tao-imgpos__wide" style={{ backgroundImage: `url(${url})`, backgroundPosition: pos }} title="ფართო" />
          <div style={{ display: 'flex', gap: 8 }}>
            <div className="tao-imgpos__square" style={{ backgroundImage: `url(${url})`, backgroundPosition: pos }} title="კვადრატი" />
            <div className="tao-imgpos__tall" style={{ backgroundImage: `url(${url})`, backgroundPosition: pos }} title="ვიწრო" />
          </div>
          <button type="button" className="tao-imgpos__reset" onClick={() => setValue('50% 50%')}>
            ცენტრში დაბრუნება
          </button>
        </div>
      </div>
    </div>
  )
}
