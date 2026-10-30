import type { CollectionConfig } from 'payload'

// Inbox of the contact form. Created by the website (server action), read only by signed-in users.
export const ContactMessages: CollectionConfig = {
  slug: 'contact-messages',
  labels: { singular: 'შეტყობინება', plural: 'შეტყობინებები' },
  admin: {
    useAsTitle: 'name',
    group: 'შემოსული',
    defaultColumns: ['name', 'topic', 'phone', 'status', 'createdAt'],
    description: 'საიტის კონტაქტის ფორმიდან შემოსული წერილები. პასუხის შემდეგ შეცვალე სტატუსი.',
  },
  access: {
    read: ({ req }) => !!req.user,
    // The website writes here through the server (local API); nobody creates messages by hand.
    create: () => false,
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
        { label: 'პასუხგაცემული', value: 'answered' },
        { label: 'დახურული', value: 'closed' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'topic',
      type: 'select',
      label: 'თემა',
      options: [
        { label: 'ზოგადი კითხვა', value: 'general' },
        { label: 'პოლისის შეძენა', value: 'buy' },
        { label: 'ანაზღაურება', value: 'claim' },
        { label: 'პრეტენზია', value: 'complaint' },
      ],
    },
    { name: 'name', type: 'text', label: 'სახელი', required: true },
    { name: 'phone', type: 'text', label: 'ტელეფონი', required: true },
    { name: 'email', type: 'email', label: 'ელფოსტა' },
    { name: 'message', type: 'textarea', label: 'შეტყობინება', required: true },
    { name: 'consent', type: 'checkbox', label: 'თანხმობა მონაცემების დამუშავებაზე', admin: { components: { Cell: '/components/admin/YesNoCell#YesNoCell' } } },
    { name: 'locale', type: 'text', label: 'საიტის ენა', admin: { readOnly: true, position: 'sidebar' } },
    { name: 'note', type: 'textarea', label: 'შიდა შენიშვნა', admin: { description: 'მხოლოდ თანამშრომლები ხედავენ. მაგ: დავურეკე, თანახმაა.' } },
  ],
}
