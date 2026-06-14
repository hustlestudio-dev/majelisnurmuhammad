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

  // Packages with Cloudflare Workers (workerd) specific code
  // Read more: https://opennext.js.org/cloudflare/howtos/workerd
  serverExternalPackages: ['jose', 'pg-cloudflare'],

  // Your Next.js config here
  webpack: (webpackConfig: any, { isServer, webpack }: any) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    // The R2 client upload handler imports `getFileKey` from plugin-cloud-storage's
    // utilities barrel, which also re-exports the server-only `resolveSignedURLKey`
    // (pulls `payload/internal` -> undici/pino -> `node:` builtins). Swap it for a
    // stub in the browser bundle so `next build` (webpack) does not choke on it.
    if (!isServer) {
      webpackConfig.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /utilities[\\/]resolveSignedURLKey\.js$/,
          path.resolve(dirname, 'src/stubs/resolveSignedURLKey.client.js'),
        ),
      )
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
