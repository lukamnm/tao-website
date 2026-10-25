import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'მომხმარებელი', plural: 'მომხმარებლები' },
  admin: { useAsTitle: 'email', group: 'სისტემა' },
  auth: true,
  access: {
    read: ({ req }) => !!req.user,
    create: ({ req }) => req.user?.role === 'admin',
    update: ({ req, id }) => req.user?.role === 'admin' || req.user?.id === id,
    delete: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    { name: 'name', type: 'text', label: 'სახელი' },
    {
      name: 'role',
      type: 'select',
      label: 'როლი',
      defaultValue: 'editor',
      required: true,
      options: [
        { label: 'ადმინისტრატორი', value: 'admin' },
        { label: 'რედაქტორი', value: 'editor' },
      ],
      access: { update: ({ req }) => req.user?.role === 'admin' },
    },
  ],
}
