import type { FieldHook } from 'payload'

const toSlug = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')

// Auto-fills slug from `title` when slug is left empty.
export const formatSlug =
  (fallbackField = 'title'): FieldHook =>
  ({ value, data }) => {
    if (typeof value === 'string' && value.length > 0) return toSlug(value)
    const fallback = data?.[fallbackField]
    if (typeof fallback === 'string') return toSlug(fallback)
    return value
  }
