/* Article text for the sample news, taken from the Claude Design project (one body per kind of story),
   written as Lexical rich text in Georgian and English. Used by the seed: fills empty bodies,
   or rewrites them all with `force` (seed --update). Texts live in sample-content.json. */
import type { Payload } from 'payload'
import sample from './sample-content.json'

type Loc = { ka: string; en: string }
type Block = { h?: Loc; p?: Loc; list?: Loc[]; q?: Loc; cite?: Loc; img?: string; alt?: Loc }

const BODIES = sample.bodies as unknown as Record<string, Block[]>
const BODY_FOR = sample.bodyFor as Record<string, string>

const base = { format: '', indent: 0, version: 1, direction: 'ltr' as const }
const text = (t: string) => ({ type: 'text', text: t, format: 0, style: '', mode: 'normal', detail: 0, version: 1 })

function lexical(blocks: Block[], locale: 'ka' | 'en', phoneId?: number | string) {
  const tr = (s?: Loc) => (s ? s[locale] : '')
  const children: unknown[] = []
  for (const b of blocks) {
    if (b.h) children.push({ ...base, type: 'heading', tag: 'h2', children: [text(tr(b.h))] })
    else if (b.list) children.push({ ...base, type: 'list', listType: 'bullet', tag: 'ul', start: 1, children: b.list.map((li, i) => ({ ...base, type: 'listitem', value: i + 1, children: [text(tr(li))] })) })
    else if (b.q) children.push({ ...base, type: 'quote', children: [text(tr(b.q)), { type: 'linebreak', version: 1 }, text(tr(b.cite))] })
    else if (b.img) {
      if (phoneId != null) children.push({ type: 'upload', relationTo: 'media', value: phoneId, fields: null, format: '', version: 3, id: Math.random().toString(16).slice(2, 26) })
      if (b.p) children.push({ ...base, type: 'paragraph', textFormat: 0, textStyle: '', children: [text(tr(b.p))] })
    } else if (b.p) children.push({ ...base, type: 'paragraph', textFormat: 0, textStyle: '', children: [text(tr(b.p))] })
  }
  return { root: { ...base, type: 'root', children } }
}

export async function fillNewsBodies(payload: Payload, opts: { force?: boolean; slugs?: string[] } = {}) {
  const phone = await payload.find({ collection: 'media', where: { filename: { like: 'news-phone-online' } }, limit: 1 })
  const phoneId = phone.docs[0]?.id
  const news = await payload.find({ collection: 'news', limit: 500, locale: 'ka', depth: 1 })
  let n = 0
  for (const item of news.docs) {
    if (item.body && !(opts.force && (!opts.slugs || opts.slugs.includes(item.slug as string)))) continue
    const cat = item.category as { key?: string } | number
    const key = typeof cat === 'object' ? cat.key || '' : ''
    const blocks = BODIES[BODY_FOR[key] || key]
    if (!blocks) continue
    await payload.update({ collection: 'news', id: item.id, locale: 'ka', data: { body: lexical(blocks, 'ka', phoneId) as never } })
    await payload.update({ collection: 'news', id: item.id, locale: 'en', data: { body: lexical(blocks, 'en', phoneId) as never } })
    n++
  }
  console.log('news bodies filled:', n)
}
