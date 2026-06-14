# PRODUCT.md — Majelis Nur Muhammad

## Register
**Brand.** The site is the public face of Pondok Pesantren / Majelis Nur Muhammad Al-Hasany Banjaran. Design carries the impression: trust, dignity, and spiritual warmth come through the surface itself, not just the content. Stance: communicate and invite, not transact.

## What it is
Public website for an Indonesian Islamic boarding school (pondok pesantren) and study circle (majelis). Content is CMS-driven (Payload): pengajian schedules (jadwal), announcements (pengumuman), Islamic articles (artikel — tafsir, hadits, fiqih, akhlak), team/asatidz profiles, and da'wah social channels (YouTube/TikTok). Frontend: Astro on Cloudflare. Language: Indonesian, with Arabic (Amiri) for verses and shalawat.

## Users & purpose
Three audiences, balanced — no single dominant goal:
1. **Jamaah / local community** — find pengajian schedules, read announcements, attend the majelis.
2. **Prospective santri & parents** — learn about the pondok, drive pendaftaran santri baru (enrollment).
3. **Wider da'wah audience** — read articles, follow social channels, receive teaching online.

Every page should serve at least one of these clearly; the homepage threads all three.

## Brand personality
**Warm, traditional, dignified Islamic.** Serene and classical — emerald green + gold, Amiri Arabic script, gentle star ornamentation. Trust is earned through tradition and sincerity, not slickness. Spiritual hospitality (the hero greets with "Assalamu'alaikum"). Calm authority: the voice of a respected kiayi, not a marketer.

Three voice words: **reverent · welcoming · grounded.**

## Anti-references (what it must NOT be)
- **Generic SaaS / template look** — no cookie-cutter icon-card grids, tracked-uppercase eyebrows on every section, gradient text, or the AI landing-page scaffold.
- **Overly ornate / cluttered** — no heavy gold filigree, busy Islamic clip-art, or ornaments competing for attention. Ornament is seasoning, not the meal.
- **Cold / corporate** — no sterile fintech-navy, no impersonal stock-photo blandness. Must feel human and spiritual.
- **Loud / flashy** — no aggressive marketing, CTAs shouting on every fold, or hype tone. **Dignity over hype.**

## Strategic design principles
1. **Reverence first.** Arabic script, divine names, and shalawat are treated with care — generous spacing, gold weight, never decorative throwaway. Tone never undercuts the sacred.
2. **Hospitality in the layout.** The site greets and guides like a host. Clear paths to jadwal, pendaftaran, and artikel; warmth in spacing and copy, not just color.
3. **Ornament with restraint.** Star/geometric motifs accent and frame — low opacity, structural, never filler. When in doubt, remove one ornament.
4. **Quiet authority in type.** Hierarchy carries weight (Poppins display, Jakarta body, Amiri Arabic). Earn emphasis through scale and weight, not loudness or color noise.
5. **Trust through legibility.** Body text meets ≥4.5:1 contrast against cream/forest backgrounds — no washed-out muted gray. An elder jamaah on a phone in daylight must read it comfortably.

## Tech notes
- Astro 6 (SSR, Cloudflare adapter) + Tailwind v4 + Payload CMS.
- Committed tokens live in `apps/frontend/src/styles/starwind.css` (light cream + dark forest themes, emerald/gold). **Identity-preservation wins** — do not re-pick the palette or fonts; extend within the system.
- Fonts: Poppins (display), Plus Jakarta Sans (body), Amiri (Arabic).
