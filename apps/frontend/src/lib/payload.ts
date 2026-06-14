import { PAYLOAD_API_URL } from 'astro:env/server'
import type {
  Announcement,
  Article,
  ArticleCategory,
  Media,
  Schedule,
  SiteSettings,
  TeamMember,
} from './types'

const BASE = (PAYLOAD_API_URL ?? 'http://localhost:3000').replace(/\/$/, '')

const api = async <T>(path: string, fallback: T): Promise<T> => {
  try {
    const res = await fetch(`${BASE}${path}`, {
      headers: { Accept: 'application/json' },
    })
    if (!res.ok) {
      console.error(`[payload] ${path} → ${res.status}`)
      return fallback
    }
    return (await res.json()) as T
  } catch (err) {
    console.error(`[payload] ${path} failed:`, err)
    return fallback
  }
}

interface Paginated<T> {
  docs: T[]
  totalDocs: number
}

/** Resolve a media object's URL to an absolute URL. */
export const mediaUrl = (media?: Media | null): string | null => {
  const url = media?.url
  if (!url) return null
  return /^https?:\/\//.test(url) ? url : `${BASE}${url}`
}

export const getSiteSettings = (): Promise<SiteSettings> =>
  api<SiteSettings>('/api/globals/site-settings?depth=1', {})

export const getSchedules = async (): Promise<Schedule[]> => {
  const res = await api<Paginated<Schedule>>(
    '/api/schedules?limit=100&sort=order&depth=0',
    { docs: [], totalDocs: 0 },
  )
  return res.docs
}

export const getLatestArticles = async (limit = 3): Promise<Article[]> => {
  const res = await api<Paginated<Article>>(
    `/api/articles?limit=${limit}&sort=-publishedDate&depth=1`,
    { docs: [], totalDocs: 0 },
  )
  return res.docs
}

export const getArticles = async (
  category?: ArticleCategory | 'all',
): Promise<Article[]> => {
  const filter =
    category && category !== 'all'
      ? `&where[category][equals]=${category}`
      : ''
  const res = await api<Paginated<Article>>(
    `/api/articles?limit=100&sort=-publishedDate&depth=1${filter}`,
    { docs: [], totalDocs: 0 },
  )
  return res.docs
}

export const getArticleBySlug = async (
  slug: string,
): Promise<Article | null> => {
  const res = await api<Paginated<Article>>(
    `/api/articles?where[slug][equals]=${encodeURIComponent(slug)}&limit=1&depth=1`,
    { docs: [], totalDocs: 0 },
  )
  return res.docs[0] ?? null
}

export const getAnnouncements = async (
  pinnedOnly = false,
): Promise<Announcement[]> => {
  const filter = pinnedOnly ? '&where[pinned][equals]=true' : ''
  const res = await api<Paginated<Announcement>>(
    `/api/announcements?limit=50&sort=-date&depth=0${filter}`,
    { docs: [], totalDocs: 0 },
  )
  return res.docs
}

export const getTeam = async (): Promise<TeamMember[]> => {
  const res = await api<Paginated<TeamMember>>(
    '/api/team?limit=100&sort=order&depth=1',
    { docs: [], totalDocs: 0 },
  )
  return res.docs
}
