import type { CollectionConfig } from 'payload'

// Inbox of the corporate health-insurance lead form on the Health page.
export const CorporateRequests: CollectionConfig = {
  slug: 'corporate-requests',
  labels: { singular: 'კორპორატიული მოთხოვნა', plural: 'კორპორატიული მოთხოვნები' },
  admin: {
    useAsTitle: 'company',
    group: 'შემოსული',
    defaultColumns: ['company', 'firstName', 'phone', 'staff', 'status', 'createdAt'],
    description: 'ჯანმრთელობის დაზღვევის გვერდის "კომპანიებისთვის" ფორმიდან შემოსული მოთხოვნები.',
  },
  access: {
    read: ({ req }) => !!req.user,
    create: () => true,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'status',
      type: 'select',
      label: 'სტატუსი',
      defaultValue: 'new',
      options: [
        { label: 'ახალი', value: 'new' },
        { label: 'დამუშავებაშია', value: 'progress' },
        { label: 'დახურული', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'firstName', type: 'text', label: 'სახელი', required: true },
    { name: 'lastName', type: 'text', label: 'გვარი', required: true },
    { name: 'company', type: 'text', label: 'კომპანია', required: true },
    { name: 'companyCode', type: 'text', label: 'საიდენტიფიკაციო კოდი', required: true },
    { name: 'staff', type: 'number', label: 'თანამშრომლების რაოდენობა', required: true },
    { name: 'phone', type: 'text', label: 'ტელეფონი', required: true },
    { name: 'consent', type: 'checkbox', label: 'თანხმობა მონაცემების დამუშავებაზე' },
    { name: 'locale', type: 'text', label: 'ენა', admin: { readOnly: true } },
    { name: 'note', type: 'textarea', label: 'შიდა შენიშვნა' },
  ],
}
