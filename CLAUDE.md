# Project: Majelis Nur Muhammad

Monorepo (pnpm + turbo).

- `apps/frontend` — Astro site. Hosts the **EmDash** CMS (Astro-native) inline. Deploys to Cloudflare Workers (D1 + R2).
- `apps/payload` — legacy Payload 3 backend, kept during the EmDash transition. Do not extend; it will be removed once EmDash is verified in production.

## Documentation

Look up EmDash documentation via the `emdash-docs` MCP server when you need to
verify an API, hook, config option, or pattern. Prefer the docs MCP over
assumptions from training data -- the docs reflect the current published
behaviour.
