import type { CollectionConfig } from 'payload'

import { authenticated, publishedOrAuth } from '../access'
import { formatSlug } from '../hooks/slug'

export const Articles: CollectionConfig = {
  slug: 'articles',
  labels: {
    singular: 'Artikel',
    plural: 'Artikel',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedDate', '_status'],
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
      name: 'slug',
      label: 'Slug (URL)',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Otomatis dari judul bila dikosongkan.',
      },
      hooks: {
        beforeValidate: [formatSlug('title')],
      },
    },
    {
      name: 'category',
      label: 'Kategori',
      type: 'select',
      required: true,
      defaultValue: 'umum',
      options: [
        { label: 'Tafsir', value: 'tafsir' },
        { label: 'Hadits', value: 'hadits' },
        { label: 'Fiqih', value: 'fiqih' },
        { label: 'Akhlak', value: 'akhlak' },
        { label: 'Umum', value: 'umum' },
      ],
    },
    {
      name: 'excerpt',
      label: 'Ringkasan',
      type: 'textarea',
      admin: {
        description: 'Cuplikan singkat untuk kartu artikel & SEO.',
      },
    },
    {
      name: 'coverImage',
      label: 'Gambar Sampul',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'content',
      label: 'Isi',
      type: 'richText',
      required: true,
    },
    {
      name: 'tags',
      label: 'Tag',
      type: 'array',
      fields: [{ name: 'tag', type: 'text' }],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      label: 'Penulis',
      type: 'text',
      defaultValue: 'Majelis Nur Muhammad',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedDate',
      label: 'Tanggal Terbit',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayOnly' },
      },
    },
  ],
}
