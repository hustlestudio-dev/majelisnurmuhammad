import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { withPayload } from '@payloadcms/next/withPayload'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
  },
  // Monorepo: trace files from the repo root so Next writes .nft.json to the
  // correct path. Without it, build trace collection fails with ENOENT.
  outputFileTracingRoot: path.resolve(dirname, '../../'),
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
