'use client'
import React from 'react'
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

/** Lexical rich text from the CMS, rendered inside a .tao-rich container. */
export function RichText({ data, className }: { data: unknown; className?: string }) {
  if (!data || typeof data !== 'object' || !(data as { root?: unknown }).root) return null
  return <LexicalRichText data={data as SerializedEditorState} className={className} disableContainer />
}
