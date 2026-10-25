'use client'
import React from 'react'
import { RichText as LexicalRichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState, SerializedLexicalNode } from '@payloadcms/richtext-lexical/lexical'

/* Design rules for CMS text: a quote may end with a line break followed by the author (rendered as <cite>),
   images sit in a figure (the paragraph right after it reads as the caption). */
const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  quote: ({ node, nodesToJSX }) => {
    const kids = (node as unknown as { children: SerializedLexicalNode[] }).children || []
    const br = kids.findIndex((k) => k.type === 'linebreak')
    if (br < 0) return <blockquote>{nodesToJSX({ nodes: kids })}</blockquote>
    return (
      <blockquote>
        <p>{nodesToJSX({ nodes: kids.slice(0, br) })}</p>
        <cite className="tao-caps">{nodesToJSX({ nodes: kids.slice(br + 1) })}</cite>
      </blockquote>
    )
  },
  upload: ({ node }) => {
    const v = (node as unknown as { value?: { url?: string; alt?: string; sizes?: Record<string, { url?: string }> } }).value
    if (!v || typeof v !== 'object' || !v.url) return null
    return (
      <figure className="tao-rich__fig">
        <img src={v.sizes?.wide?.url || v.url} alt={v.alt || ''} loading="lazy" />
      </figure>
    )
  },
})

/** Lexical rich text from the CMS, rendered inside a .tao-rich container. */
export function RichText({ data, className }: { data: unknown; className?: string }) {
  if (!data || typeof data !== 'object' || !(data as { root?: unknown }).root) return null
  return <LexicalRichText data={data as SerializedEditorState} className={className} converters={converters} disableContainer />
}
