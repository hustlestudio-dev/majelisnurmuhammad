import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Pengaturan Situs',
  admin: {
    group: 'Pengaturan',
  },
  access: {
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Umum',
          fields: [
            {
              name: 'siteName',
              label: 'Nama Situs',
              type: 'text',
              required: true,
              defaultValue: 'Majelis Nur Muhammad',
            },
            {
              name: 'tagline',
              label: 'Tagline',
              type: 'text',
              defaultValue: 'Pondok Pesantren Nur Muhammad Al-Hasany Banjaran',
            },
            {
              name: 'logo',
              label: 'Logo',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          label: 'Hero',
          fields: [
            {
              name: 'heroSlides',
              label: 'Slide Hero (Slider Beranda)',
              type: 'array',
              labels: { singular: 'Slide', plural: 'Slide' },
              admin: {
                description:
                  'Slider di bagian atas beranda. Kosongkan untuk memakai tampilan ayat default.',
                initCollapsed: true,
              },
              fields: [
                {
                  name: 'image',
                  label: 'Gambar Latar',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'heading',
                  label: 'Judul',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'subheading',
                  label: 'Sub-judul',
                  type: 'textarea',
                },
                {
                  name: 'arabic',
                  label: 'Teks Arab (opsional)',
                  type: 'text',
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'ctaLabel',
                      label: 'Teks Tombol',
                      type: 'text',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'ctaHref',
                      label: 'Tautan Tombol',
                      type: 'text',
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
            },
            {
              name: 'heroVerse',
              label: 'Ayat Hero (tampilan default)',
              type: 'group',
              fields: [
                {
                  name: 'arabic',
                  label: 'Teks Arab',
                  type: 'textarea',
                },
                {
                  name: 'translation',
                  label: 'Terjemahan',
                  type: 'textarea',
                },
                {
                  name: 'reference',
                  label: 'Sumber (QS. ...)',
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          label: 'Kontak',
          fields: [
            { name: 'address', label: 'Alamat', type: 'textarea' },
            { name: 'whatsapp', label: 'WhatsApp', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
          ],
        },
        {
          label: 'Media Sosial',
          fields: [
            {
              name: 'social',
              label: 'Tautan Media Sosial',
              type: 'group',
              fields: [
                { name: 'youtube', label: 'YouTube', type: 'text' },
                { name: 'tiktok', label: 'TikTok', type: 'text' },
                { name: 'instagram', label: 'Instagram', type: 'text' },
                { name: 'facebook', label: 'Facebook', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Donasi',
          fields: [
            {
              name: 'donation',
              label: 'Informasi Donasi',
              type: 'group',
              fields: [
                { name: 'bankName', label: 'Nama Bank', type: 'text' },
                { name: 'accountNumber', label: 'Nomor Rekening', type: 'text' },
                { name: 'accountHolder', label: 'Atas Nama', type: 'text' },
                { name: 'note', label: 'Catatan', type: 'textarea' },
              ],
            },
          ],
        },
        {
          label: 'Footer',
          fields: [
            {
              name: 'footerText',
              label: 'Teks Footer',
              type: 'textarea',
              defaultValue:
                'Majelis Nur Muhammad — wadah menuntut ilmu, memperkuat ukhuwah, dan menyebarkan rahmat.',
            },
          ],
        },
      ],
    },
  ],
}
