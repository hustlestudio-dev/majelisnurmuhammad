export interface Media {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
}

export interface HeroVerse {
  arabic?: string | null
  translation?: string | null
  reference?: string | null
}

export interface HeroSlide {
  image?: Media | null
  heading: string
  subheading?: string | null
  arabic?: string | null
  ctaLabel?: string | null
  ctaHref?: string | null
}

export interface SocialLinks {
  youtube?: string | null
  tiktok?: string | null
  instagram?: string | null
  facebook?: string | null
}

export interface Donation {
  bankName?: string | null
  accountNumber?: string | null
  accountHolder?: string | null
  note?: string | null
}

export interface SiteSettings {
  siteName?: string
  tagline?: string
  logo?: Media | null
  heroSlides?: HeroSlide[] | null
  heroVerse?: HeroVerse
  address?: string | null
  whatsapp?: string | null
  email?: string | null
  social?: SocialLinks
  donation?: Donation
  footerText?: string | null
}

export type ArticleCategory = 'tafsir' | 'hadits' | 'fiqih' | 'akhlak' | 'umum'

export interface Article {
  id: number | string
  title: string
  slug: string
  category: ArticleCategory
  excerpt?: string | null
  coverImage?: Media | null
  content?: unknown
  tags?: { tag?: string | null }[] | null
  author?: string | null
  publishedDate?: string | null
}

export interface Schedule {
  id: number | string
  title: string
  day: 'ahad' | 'senin' | 'selasa' | 'rabu' | 'kamis' | 'jumat' | 'sabtu'
  timeStart?: string | null
  timeEnd?: string | null
  ustadz?: string | null
  kitab?: string | null
  location?: string | null
  description?: string | null
  recurring?: boolean | null
  order?: number | null
}

export interface Announcement {
  id: number | string
  title: string
  body?: unknown
  date?: string | null
  pinned?: boolean | null
}

export interface TeamMember {
  id: number | string
  name: string
  role: string
  photo?: Media | null
  bio?: string | null
  order?: number | null
}
