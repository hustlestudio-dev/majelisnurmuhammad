export const NAV_LINKS = [
  { href: '/', label: 'Beranda' },
  { href: '/jadwal', label: 'Jadwal' },
  { href: '/artikel', label: 'Artikel' },
  { href: '/tentang', label: 'Tentang' },
] as const

export const DAY_LABELS: Record<string, string> = {
  ahad: 'Ahad',
  senin: 'Senin',
  selasa: 'Selasa',
  rabu: 'Rabu',
  kamis: 'Kamis',
  jumat: "Jum'at",
  sabtu: 'Sabtu',
}

export const DAY_ORDER = [
  'ahad',
  'senin',
  'selasa',
  'rabu',
  'kamis',
  'jumat',
  'sabtu',
]

export const CATEGORY_LABELS: Record<string, string> = {
  tafsir: 'Tafsir',
  hadits: 'Hadits',
  fiqih: 'Fiqih',
  akhlak: 'Akhlak',
  umum: 'Umum',
}

export const formatDateID = (value?: string | null): string => {
  if (!value) return ''
  try {
    return new Date(value).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}
