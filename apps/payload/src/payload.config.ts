import path from 'path'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { s3Storage } from '@payloadcms/storage-s3'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Articles } from './collections/Articles'
import { Schedules } from './collections/Schedules'
import { Announcements } from './collections/Announcements'
import { Team } from './collections/Team'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const isProduction = process.env.NODE_ENV === 'production'

const requiredEnv = {
  PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
  DATABASE_URI: process.env.DATABASE_URI,
  DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN,
  S3_BUCKET: process.env.S3_BUCKET,
  S3_ENDPOINT: process.env.S3_ENDPOINT,
  S3_REGION: process.env.S3_REGION,
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
  NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
  FRONTEND_URL: process.env.FRONTEND_URL,
} as const

const missing = Object.entries(requiredEnv)
  .filter(([, v]) => v === undefined || v === '')
  .map(([k]) => k)

const present = Object.entries(requiredEnv)
  .filter(([, v]) => v !== undefined && v !== '')
  .map(([k, v]) => `${k}=${k.includes('SECRET') || k.includes('TOKEN') || k.includes('KEY') ? '<redacted>' : v}`)

const banner = '\n[payload.config] ========== ENV CHECK START ==========\n'
const presentLine = `[payload.config] present (${present.length}): ${present.join(', ')}\n`
const missingLine = `[payload.config] MISSING (${missing.length}): ${missing.join(', ')}\n`
const bannerEnd = '[payload.config] ========== ENV CHECK END ==========\n'

process.stderr.write(banner + presentLine + missingLine + bannerEnd)

if (missing.length > 0) {
  const msg = `Missing required env vars: ${missing.join(', ')}. Set them in Netlify UI -> Site settings -> Environment variables (scope must include Functions / runtime, not just Builds).`
  process.stderr.write(`[payload.config] THROW: ${msg}\n`)
  throw new Error(msg)
}

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
const frontendURL = process.env.FRONTEND_URL || 'http://localhost:4321'

export default buildConfig({
  serverURL,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    theme: 'light',
  },
  collections: [Articles, Schedules, Announcements, Team, Media, Users],
  globals: [SiteSettings],
  cors: [serverURL, frontendURL],
  csrf: [serverURL, frontendURL],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || 'file:./payload.db',
      authToken: process.env.DATABASE_AUTH_TOKEN,
    },
    // Dev: auto-push schema for fast iteration. Prod: use migrations
    // (run `payload migrate` during the Netlify build).
    push: !isProduction && process.env.PAYLOAD_DB_PUSH !== 'false',
  }),
  plugins: [
    s3Storage({
      collections: { media: true },
      bucket: process.env.S3_BUCKET || 'nurmuhammad-media',
      config: {
        endpoint: process.env.S3_ENDPOINT,
        region: process.env.S3_REGION || 'auto',
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        forcePathStyle: true,
      },
    }),
  ],
})
