import type { Payload } from 'payload'

// Build a minimal valid Lexical richText value from plain paragraphs.
const rt = (paragraphs: string[]) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr' as const,
    children: paragraphs.map((text) => ({
      type: 'paragraph',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: [
        {
          type: 'text',
          detail: 0,
          format: 0,
          mode: 'normal',
          style: '',
          text,
          version: 1,
        },
      ],
    })),
  },
})

export const seed = async (payload: Payload): Promise<{ seeded: boolean }> => {
  // --- Global: Site Settings (always refreshed; safe to re-run) ---
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      siteName: 'Majelis Nur Muhammad',
      tagline: 'Pondok Pesantren Nur Muhammad Al-Hasany Banjaran',
      heroSlides: [
        {
          heading: 'Majelis Nur Muhammad',
          subheading:
            'Pondok Pesantren Nur Muhammad Al-Hasany Banjaran — menebar cahaya ilmu, dakwah, dan ukhuwah.',
          arabic: 'نُورُ مُحَمَّد',
          ctaLabel: 'Jadwal Pengajian',
          ctaHref: '/jadwal',
        },
        {
          heading: 'Menuntut Ilmu, Meraih Berkah',
          subheading:
            'Hadirilah kajian rutin bersama para asatidz. Terbuka untuk seluruh kalangan.',
          arabic: 'اطْلُبُوا الْعِلْمَ',
          ctaLabel: 'Jelajahi Artikel',
          ctaHref: '/artikel',
        },
        {
          heading: 'Mempererat Ukhuwah Islamiyah',
          subheading:
            'Bersama membangun majelis yang penuh rahmat, keberkahan, dan amal saleh.',
          arabic: 'إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ',
          ctaLabel: 'Tentang Kami',
          ctaHref: '/tentang',
        },
      ],
      heroVerse: {
        arabic: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
        translation: 'Bacalah dengan (menyebut) nama Tuhanmu yang menciptakan.',
        reference: 'QS. Al-‘Alaq: 1',
      },
      address:
        'Jl. Terusan Mukodar No. 297 RT 06/03, Kel. Cibeureum, Kec. Cimahi Selatan, Kota Cimahi',
      whatsapp: '6282218776673',
      email: '',
      social: {
        youtube: 'https://www.youtube.com/@nurmuhammad.banjaran',
        tiktok: 'https://www.tiktok.com/@yai.saman2',
        instagram: '',
        facebook: '',
      },
      donation: {
        bankName: 'BCA (Bank Central Asia)',
        accountNumber: '1392440024',
        accountHolder: 'Kiagus Akbar Saman',
        note: 'Wakaf Pembangunan Ponpes Nur Muhammad Banjaran. Konfirmasi via WhatsApp setelah transfer.',
      },
      footerText:
        'Majelis Nur Muhammad — wadah menuntut ilmu, memperkuat ukhuwah, dan menyebarkan rahmat.',
    } as any,
  })

  // Always: ensure leadership (kiayi) name on existing seeded data.
  const lead = await payload.find({
    collection: 'team',
    where: { role: { like: 'Pengasuh' } },
    limit: 1,
  })
  if (lead.docs[0]) {
    await payload.update({
      collection: 'team',
      id: lead.docs[0].id,
      data: { name: 'KH. KGS Akbar Saman' } as any,
    })
  }

  const existing = await payload.find({ collection: 'articles', limit: 1 })
  if (existing.totalDocs > 0) {
    payload.logger.info('Seed: settings refreshed; content already exists.')
    return { seeded: false }
  }

  payload.logger.info('Seeding Majelis Nur Muhammad content...')

  // Dev admin user (local only — change the password in production).
  const users = await payload.find({ collection: 'users', limit: 1 })
  if (users.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: 'hustlestudio26@gmail.com',
        password: 'admin12345',
        name: 'Administrator',
        role: 'admin',
      } as any,
    })
  }

  // --- Schedules ---
  const schedules = [
    {
      title: 'Pengajian Rutin Malam Senin',
      day: 'ahad',
      timeStart: "Ba'da Isya",
      ustadz: 'KH. Ahmad Al-Hasany',
      kitab: 'Kitab Ihya Ulumuddin',
      location: 'Aula Utama Pondok',
      description: 'Kajian rutin mingguan terbuka untuk umum.',
      recurring: true,
      order: 1,
    },
    {
      title: 'Kajian Kitab Kuning',
      day: 'kamis',
      timeStart: "Ba'da Maghrib",
      ustadz: 'Ustadz Muhammad Saman',
      kitab: 'Kitab Safinatun Najah',
      location: 'Masjid Pondok',
      description: 'Pembahasan fiqih dasar bersama santri dan jamaah.',
      recurring: true,
      order: 2,
    },
    {
      title: 'Tahsin & Tahfizh Al-Qur’an',
      day: 'ahad',
      timeStart: '06:30',
      timeEnd: '08:00',
      ustadz: 'Ustadzah Fatimah',
      kitab: 'Metode Tilawati',
      location: 'Ruang Tahfizh',
      description: 'Kelas perbaikan bacaan Al-Qur’an untuk segala usia.',
      recurring: true,
      order: 3,
    },
    {
      title: 'Pembacaan Maulid & Shalawat',
      day: 'jumat',
      timeStart: "Ba'da Isya",
      ustadz: 'Tim Hadrah Nur Muhammad',
      kitab: 'Maulid Simthud Durar',
      location: 'Aula Utama Pondok',
      description: 'Lantunan shalawat dan maulid bersama jamaah.',
      recurring: true,
      order: 4,
    },
  ]

  for (const data of schedules) {
    await payload.create({ collection: 'schedules', data: data as any })
  }

  // --- Articles ---
  const articles = [
    {
      title: 'Keutamaan Menuntut Ilmu dalam Islam',
      category: 'umum',
      excerpt:
        'Menuntut ilmu adalah kewajiban setiap muslim. Simak keutamaannya menurut Al-Qur’an dan hadits.',
      content: rt([
        'Menuntut ilmu merupakan ibadah yang sangat dimuliakan dalam Islam. Rasulullah ﷺ bersabda bahwa menuntut ilmu itu wajib atas setiap muslim.',
        'Dengan ilmu, seorang hamba dapat mengenal Tuhannya, menjalankan ibadah dengan benar, dan memberi manfaat bagi sesama.',
      ]),
      tags: [{ tag: 'ilmu' }, { tag: 'motivasi' }],
      author: 'Majelis Nur Muhammad',
      _status: 'published',
    },
    {
      title: 'Tafsir Surat Al-Fatihah: Induk Al-Qur’an',
      category: 'tafsir',
      excerpt:
        'Al-Fatihah disebut Ummul Kitab. Mari memahami makna agung di balik tujuh ayatnya.',
      content: rt([
        'Surat Al-Fatihah adalah pembuka Al-Qur’an dan dibaca dalam setiap rakaat shalat.',
        'Di dalamnya terkandung pujian kepada Allah, pengakuan atas rahmat-Nya, serta permohonan petunjuk ke jalan yang lurus.',
      ]),
      tags: [{ tag: 'tafsir' }, { tag: 'al-fatihah' }],
      author: 'Ustadz Muhammad Saman',
      _status: 'published',
    },
    {
      title: 'Akhlak Mulia: Meneladani Rasulullah ﷺ',
      category: 'akhlak',
      excerpt:
        'Rasulullah ﷺ diutus untuk menyempurnakan akhlak. Bagaimana kita meneladaninya?',
      content: rt([
        'Akhlak adalah buah dari keimanan. Rasulullah ﷺ adalah teladan terbaik dalam berakhlak.',
        'Kejujuran, kasih sayang, kesabaran, dan kerendahan hati adalah cermin akhlak yang patut kita amalkan setiap hari.',
      ]),
      tags: [{ tag: 'akhlak' }, { tag: 'teladan' }],
      author: 'KH. Ahmad Al-Hasany',
      _status: 'published',
    },
  ]

  for (const data of articles) {
    await payload.create({ collection: 'articles', data: data as any })
  }

  // --- Announcements ---
  const announcements = [
    {
      title: 'Peringatan Maulid Nabi Muhammad ﷺ 1447 H',
      body: rt([
        'Diberitahukan kepada seluruh jamaah, akan diselenggarakan peringatan Maulid Nabi Muhammad ﷺ pada akhir pekan ini.',
        'Acara terbuka untuk umum. Mari hadir dan ramaikan bersama keluarga.',
      ]),
      pinned: true,
      _status: 'published',
    },
    {
      title: 'Pembukaan Pendaftaran Santri Baru',
      body: rt([
        'Pendaftaran santri baru Pondok Pesantren Nur Muhammad telah dibuka.',
        'Informasi lebih lanjut dapat menghubungi pengurus melalui kontak yang tersedia.',
      ]),
      pinned: false,
      _status: 'published',
    },
  ]

  for (const data of announcements) {
    await payload.create({ collection: 'announcements', data: data as any })
  }

  // --- Team ---
  const team = [
    {
      name: 'KH. KGS Akbar Saman',
      role: 'Pengasuh / Pimpinan',
      bio: 'Pengasuh Pondok Pesantren Nur Muhammad Al-Hasany Banjaran.',
      order: 1,
    },
    {
      name: 'Ustadz Muhammad Saman',
      role: 'Ketua Majelis',
      bio: 'Membina kajian rutin dan kegiatan dakwah majelis.',
      order: 2,
    },
    {
      name: 'Ustadzah Fatimah',
      role: 'Koordinator Tahfizh',
      bio: 'Membimbing program tahsin dan tahfizh Al-Qur’an.',
      order: 3,
    },
  ]

  for (const data of team) {
    await payload.create({ collection: 'team', data: data as any })
  }

  payload.logger.info('Seed complete.')
  return { seeded: true }
}
