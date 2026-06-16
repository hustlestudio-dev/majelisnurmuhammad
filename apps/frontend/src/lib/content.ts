import {
  getEmDashCollection,
  getEmDashEntry,
  getSiteSettings as getNativeSettings,
} from 'emdash'

import type {
  Announcement,
  Article,
  ArticleCategory,
  HeroSlide,
  Media,
  Schedule,
  SiteSettings,
  TeamMember,
} from './types'

type EmImage =
  | { src?: string; alt?: string; width?: number; height?: number }
  | null
  | undefined

const toMedia = (img: EmImage): Media | null =>
  img && img.src
    ? {
        url: img.src,
        alt: img.alt ?? null,
        width: img.width ?? null,
        height: img.height ?? null,
      }
    : null

/** Kept for backwards compatibility with components. Images are pre-resolved. */
export const mediaUrl = (media?: Media | null): string | null => media?.url ?? null

const isPublished = (data: any): boolean =>
  data?.status === undefined || data?.status === 'published'

const mapArticle = (entry: any): Article => {
  const d = entry?.data ?? entry ?? {}
  return {
    id: entry?.id ?? d.id,
    title: d.title,
    slug: d.slug ?? entry?.slug,
    category: d.category as ArticleCategory,
    excerpt: d.excerpt ?? null,
    coverImage: toMedia(d.cover_image),
    content: d.content,
    tags: (d.tags ?? []).map((tag: string) => ({ tag })),
    author: d.author ?? null,
    publishedDate: d.published_date ?? null,
  }
}

const mapSchedule = (entry: any): Schedule => {
  const d = entry?.data ?? entry ?? {}
  return {
    id: entry?.id ?? d.id,
    title: d.title,
    day: d.day,
    timeStart: d.time_start ?? null,
    timeEnd: d.time_end ?? null,
    ustadz: d.ustadz ?? null,
    kitab: d.kitab ?? null,
    location: d.location ?? null,
    description: d.description ?? null,
    recurring: d.recurring ?? null,
    order: d.order ?? null,
  }
}

const mapAnnouncement = (entry: any): Announcement => {
  const d = entry?.data ?? entry ?? {}
  return {
    id: entry?.id ?? d.id,
    title: d.title,
    body: d.body,
    date: d.date ?? null,
    pinned: d.pinned ?? null,
  }
}

const mapTeam = (entry: any): TeamMember => {
  const d = entry?.data ?? entry ?? {}
  return {
    id: entry?.id ?? d.id,
    name: d.name,
    role: d.role,
    photo: toMedia(d.photo),
    bio: d.bio ?? null,
    order: d.order ?? null,
  }
}

const heroImage = (img: any): HeroSlide['image'] => {
  if (!img) return null
  const storageKey = (img.meta?.storageKey as string | undefined) ?? null
  const id = (img.id as string | undefined) ?? null
  if (!storageKey && !id) return null
  return {
    storageKey,
    id,
    alt: img.alt ?? null,
    width: img.width ?? null,
    height: img.height ?? null,
  }
}

const mapHeroSlide = (entry: any): HeroSlide => {
  const d = entry?.data ?? {}
  return {
    image: heroImage(d.image),
    heading: d.heading,
    subheading: d.subheading ?? null,
    arabic: d.arabic ?? null,
    ctaLabel: d.cta_label ?? null,
    ctaHref: d.cta_href ?? null,
  }
}

// Maps the single `info_situs` entry to the custom (non-native) settings fields.
const infoFromEntry = (entry: any) => {
  const d = entry?.data ?? {}
  return {
    heroVerse: {
      arabic: d.hero_verse_arabic ?? null,
      translation: d.hero_verse_translation ?? null,
      reference: d.hero_verse_reference ?? null,
    },
    address: d.address ?? null,
    whatsapp: d.whatsapp ?? null,
    email: d.email ?? null,
    tiktok: d.tiktok ?? null,
    donation: {
      bankName: d.donation_bank_name ?? null,
      accountNumber: d.donation_account_number ?? null,
      accountHolder: d.donation_account_holder ?? null,
      note: d.donation_note ?? null,
    },
    footerText: d.footer_text ?? null,
  }
}

const collection = async <T>(
  slug: string,
  map: (entry: any) => T,
  opts?: Record<string, unknown>,
): Promise<T[]> => {
  try {
    const { entries, error } = await getEmDashCollection(slug, opts as any)
    if (error) {
      console.error(`[emdash] collection ${slug}:`, error)
      return []
    }
    return (entries ?? []).map(map)
  } catch (err) {
    console.error(`[emdash] collection ${slug} failed:`, err)
    return []
  }
}

// Hero slides live in their own `hero` collection (auto-slider when >1).
const getHeroSlides = async (): Promise<HeroSlide[]> => {
  try {
    const { entries } = await getEmDashCollection('hero')
    return (entries ?? [])
      .slice()
      .sort((a: any, b: any) => (a?.data?.order ?? 0) - (b?.data?.order ?? 0))
      .map(mapHeroSlide)
  } catch (err) {
    console.error('[emdash] hero collection failed:', err)
    return []
  }
}

// Site settings = native EmDash Site Settings (identity/logo/social) merged with
// the single `info_situs` entry (contact/donation/footer/hero verse) and the
// `hero` collection (slides). Keeps the SiteSettings shape stable for components.
export const getSiteSettings = async (): Promise<SiteSettings> => {
  let native: any = {}
  try {
    native = (await getNativeSettings()) ?? {}
  } catch (err) {
    console.error('[emdash] native site settings failed:', err)
  }

  let info: ReturnType<typeof infoFromEntry> | Record<string, never> = {}
  try {
    const { entries } = await getEmDashCollection('info_situs')
    if (entries?.[0]) info = infoFromEntry(entries[0])
  } catch (err) {
    console.error('[emdash] info_situs collection failed:', err)
  }

  const heroSlides = await getHeroSlides()

  const logo: Media | null = native.logo?.url
    ? {
        url: native.logo.url,
        alt: native.logo.alt ?? null,
        width: native.logo.width ?? null,
        height: native.logo.height ?? null,
      }
    : null

  return {
    siteName: native.title ?? undefined,
    tagline: native.tagline ?? undefined,
    logo,
    heroSlides,
    heroVerse: (info as any).heroVerse ?? {
      arabic: null,
      translation: null,
      reference: null,
    },
    address: (info as any).address ?? null,
    whatsapp: (info as any).whatsapp ?? null,
    email: (info as any).email ?? null,
    social: {
      youtube: native.social?.youtube ?? null,
      tiktok: (info as any).tiktok ?? null,
      instagram: native.social?.instagram ?? null,
      facebook: native.social?.facebook ?? null,
    },
    donation: (info as any).donation ?? {
      bankName: null,
      accountNumber: null,
      accountHolder: null,
      note: null,
    },
    footerText: (info as any).footerText ?? null,
  }
}

export const getSchedules = async (): Promise<Schedule[]> => {
  const items = await collection('schedules', mapSchedule)
  return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

export const getLatestArticles = async (limit = 3): Promise<Article[]> => {
  const items = await collection('articles', mapArticle, { status: 'published' })
  return items
    .sort(
      (a, b) =>
        new Date(b.publishedDate ?? 0).getTime() -
        new Date(a.publishedDate ?? 0).getTime(),
    )
    .slice(0, limit)
}

export const getArticles = async (
  category?: ArticleCategory | 'all',
): Promise<Article[]> => {
  const items = await collection('articles', mapArticle, { status: 'published' })
  const filtered =
    category && category !== 'all'
      ? items.filter((a) => a.category === category)
      : items
  return filtered.sort(
    (a, b) =>
      new Date(b.publishedDate ?? 0).getTime() -
      new Date(a.publishedDate ?? 0).getTime(),
  )
}

export const getArticleBySlug = async (
  slug: string,
): Promise<Article | null> => {
  try {
    const { entry } = await getEmDashEntry('articles', slug, {
      status: 'published',
    } as any)
    if (entry && isPublished(entry.data)) return mapArticle(entry)
  } catch (err) {
    console.error(`[emdash] article ${slug} failed:`, err)
  }
  return null
}

export const getAnnouncements = async (
  pinnedOnly = false,
): Promise<Announcement[]> => {
  const items = await collection('announcements', mapAnnouncement, {
    status: 'published',
  })
  const filtered = pinnedOnly ? items.filter((a) => a.pinned) : items
  return filtered.sort(
    (a, b) =>
      new Date(b.date ?? 0).getTime() - new Date(a.date ?? 0).getTime(),
  )
}

export const getTeam = async (): Promise<TeamMember[]> => {
  const items = await collection('team', mapTeam)
  return items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}
