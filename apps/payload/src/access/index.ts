import type { Access } from 'payload'

export const anyone: Access = () => true

export const authenticated: Access = ({ req }) => Boolean(req.user)

// Public sees only published docs; authenticated users see everything (incl. drafts).
// Use only on collections with `versions: { drafts: true }` (where `_status` exists).
export const publishedOrAuth: Access = ({ req }) => {
  if (req.user) return true
  return {
    _status: {
      equals: 'published',
    },
  }
}
