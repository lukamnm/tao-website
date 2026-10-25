import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'მომხმარებელი', plural: 'მომხმარებლები' },
  admin: { useAsTitle: 'email', group: 'სისტემა' },
  auth: true,
  hooks: {
    // The very first account (created on /admin) is always an administrator.
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        const existing = await req.payload.count({ collection: 'users', overrideAccess: true })
        if (existing.totalDocs === 0) return { ...data, role: 'admin' }
        return data
      },
    ],
  },
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
