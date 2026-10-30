import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'ფოტო', plural: 'ფოტოები' },
  admin: {
    group: 'სისტემა',
    description: 'ყველა ატვირთული ფოტო. ფოტოს ატვირთვა შეგიძლია პირდაპირ სიახლიდან, შეთავაზებიდან ან ბანერიდან.',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
  },
  access: { read: () => true },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'რა არის ფოტოზე',
      required: true,
      localized: true,
      admin: { placeholder: 'მაგ: ექიმი პაციენტს ესაუბრება', description: 'მოკლედ აღწერე ფოტო. ამას კითხულობენ უსინათლოები და Google.' },
    },
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
