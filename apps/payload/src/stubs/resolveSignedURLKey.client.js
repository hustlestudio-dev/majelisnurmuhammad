// Client-only stub for @payloadcms/plugin-cloud-storage's resolveSignedURLKey.
// The real module imports `payload/internal`, which transitively pulls undici/pino
// and `node:` builtins that webpack cannot bundle for the browser. The R2 client
// upload handler only uses `getFileKey` from the same barrel, never this function,
// so replacing it on the client bundle is safe.
export const resolveSignedURLKey = () => {
  throw new Error('resolveSignedURLKey is server-only and must not run in the browser')
}
