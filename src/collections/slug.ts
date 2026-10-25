import type { Field } from 'payload'

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')

// URL slug: typed by the editor or derived from the title on first save.
export const slugField = (): Field => ({
  name: 'slug',
  type: 'text',
  label: 'URL (slug)',
  unique: true,
  index: true,
  admin: { position: 'sidebar', description: 'ლათინური ასოები, ციფრები და ტირე. მაგ. travel-15' },
  hooks: {
    beforeValidate: [
      ({ value, data, originalDoc }) => {
        if (value) return slugify(String(value))
        const title = data?.title || originalDoc?.title
        if (typeof title === 'string') return slugify(title)
        return value
      },
    ],
  },
})
