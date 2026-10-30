import type { Field, FieldHook } from 'payload'

/* Georgian letters to Latin, so URLs read "travel-15" instead of percent-encoded Georgian. */
const KA: Record<string, string> = {
  ა: 'a', ბ: 'b', გ: 'g', დ: 'd', ე: 'e', ვ: 'v', ზ: 'z', თ: 't', ი: 'i', კ: 'k', ლ: 'l', მ: 'm', ნ: 'n', ო: 'o', პ: 'p', ჟ: 'zh',
  რ: 'r', ს: 's', ტ: 't', უ: 'u', ფ: 'p', ქ: 'k', ღ: 'gh', ყ: 'q', შ: 'sh', ჩ: 'ch', ც: 'ts', ძ: 'dz', წ: 'ts', ჭ: 'ch', ხ: 'kh', ჯ: 'j', ჰ: 'h',
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[ა-ჰ]/g, (c) => KA[c] ?? '')
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

const fromTitle =
  (source: string): FieldHook =>
  ({ value, data, originalDoc }) => {
    if (value) return slugify(String(value))
    const v = data?.[source] ?? originalDoc?.[source]
    const text = typeof v === 'string' ? v : v && typeof v === 'object' ? (v as Record<string, string>).ka || Object.values(v)[0] : ''
    return text ? slugify(String(text)) : value
  }

/** Page address. Made from the title automatically; editors can change it in the sidebar. */
export const slugField = (source = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  label: 'გვერდის მისამართი',
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'ივსება ავტომატურად სათაურიდან. მაგ: taoinsurance.ge/offers/travel-15',
  },
  hooks: { beforeValidate: [fromTitle(source)] },
})

/** Internal key used by the site code. Hidden from editors, made from the name once. */
export const keyField = (source = 'name'): Field => ({
  name: 'key',
  type: 'text',
  unique: true,
  index: true,
  admin: { hidden: true },
  hooks: {
    beforeValidate: [
      (args) => {
        if (args.originalDoc?.key) return args.originalDoc.key
        return fromTitle(source)(args)
      },
    ],
  },
})
