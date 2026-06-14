import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'

export const Schedules: CollectionConfig = {
  slug: 'schedules',
  labels: {
    singular: 'Jadwal Pengajian',
    plural: 'Jadwal Pengajian',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'day', 'timeStart', 'ustadz'],
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
      name: 'title',
      label: 'Nama Kegiatan',
      type: 'text',
      required: true,
    },
    {
      name: 'day',
      label: 'Hari',
      type: 'select',
      required: true,
      options: [
        { label: 'Ahad', value: 'ahad' },
        { label: 'Senin', value: 'senin' },
        { label: 'Selasa', value: 'selasa' },
        { label: 'Rabu', value: 'rabu' },
        { label: 'Kamis', value: 'kamis' },
        { label: "Jum'at", value: 'jumat' },
        { label: 'Sabtu', value: 'sabtu' },
      ],
    },
    {
      name: 'timeStart',
      label: 'Waktu Mulai',
      type: 'text',
      admin: { description: "Contoh: 19:30 atau Ba'da Maghrib." },
    },
    {
      name: 'timeEnd',
      label: 'Waktu Selesai',
      type: 'text',
      admin: { description: 'Opsional.' },
    },
    {
      name: 'ustadz',
      label: 'Pemateri / Ustadz',
      type: 'text',
    },
    {
      name: 'kitab',
      label: 'Kitab / Materi',
      type: 'text',
    },
    {
      name: 'location',
      label: 'Lokasi',
      type: 'text',
    },
    {
      name: 'description',
      label: 'Keterangan',
      type: 'textarea',
    },
    {
      name: 'recurring',
      label: 'Rutin Mingguan',
      type: 'checkbox',
      defaultValue: true,
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
