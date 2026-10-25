import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'სურათი', plural: 'სურათები' },
  admin: { group: 'მედია' },
  access: { read: () => true },
  fields: [
    { name: 'alt', type: 'text', label: 'აღწერა (alt)', required: true, localized: true },
  ],
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumb', width: 480, height: undefined, position: 'centre' },
      { name: 'card', width: 960 },
      { name: 'wide', width: 1600 },
      { name: 'hero', width: 2000 },
    ],
    adminThumbnail: 'thumb',
  },
}
