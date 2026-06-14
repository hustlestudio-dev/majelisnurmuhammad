import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'

export const Team: CollectionConfig = {
  slug: 'team',
  labels: {
    singular: 'Pengurus',
    plural: 'Pengurus',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'order'],
    group: 'Konten',
  },
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'name',
      label: 'Nama',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      label: 'Jabatan',
      type: 'text',
      required: true,
    },
    {
      name: 'photo',
      label: 'Foto',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bio',
      label: 'Biografi Singkat',
      type: 'textarea',
    },
    {
      name: 'order',
      label: 'Urutan',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
