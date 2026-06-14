import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuth } from '../access'

export const Announcements: CollectionConfig = {
  slug: 'announcements',
  labels: {
    singular: 'Pengumuman',
    plural: 'Pengumuman',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'pinned', '_status'],
    group: 'Konten',
  },
  access: {
    read: publishedOrAuth,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      label: 'Judul',
      type: 'text',
      required: true,
    },
    {
      name: 'body',
      label: 'Isi Pengumuman',
      type: 'richText',
      required: true,
    },
    {
      name: 'date',
      label: 'Tanggal',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'pinned',
      label: 'Sematkan (tampil di beranda)',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'expiresAt',
      label: 'Berlaku Sampai',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Opsional. Kosongkan bila tanpa batas waktu.',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
  ],
}
