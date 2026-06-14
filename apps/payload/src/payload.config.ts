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
