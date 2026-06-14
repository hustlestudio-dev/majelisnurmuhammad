---
target: frontend
total_score: 32
p0_count: 0
p1_count: 1
timestamp: 2026-06-14T15-10-31Z
slug: apps-frontend-src-pages-index-astro
---
# Critique — Frontend (Majelis Nur Muhammad)

Browser eval skipped (no running dev server; Cloudflare+Payload dep). Source + detector based. Detector clean (exit 0, []).

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Carousel autoplay only pauses on hover |
| 2 | Match System / Real World | 4 | Indonesian + Islamic terms native |
| 3 | User Control & Freedom | 3 | Mobile menu no Esc / click-outside |
| 4 | Consistency & Standards | 3 | Footer gold bug + inconsistent eyebrow |
| 5 | Error Prevention | 3 | Empty states handled |
| 6 | Recognition Rather Than Recall | 4 | Labeled nav |
| 7 | Flexibility & Efficiency | 3 | Category filter, no search |
| 8 | Aesthetic & Minimalist | 3 | Card hover sameness, hero overlay heavy |
| 9 | Error Recovery | 3 | Empty states; no 404 seen |
| 10 | Help & Documentation | 3 | Contact + WA present |
| Total | | 32/40 | Good |

## Anti-Patterns Verdict
Not AI slop. Committed identity. Detector clean. Minor tells: card hover reflex, two eyebrows on tentang, gradient-block image fallback.

## What's Working
1. Committed brand system — one palette, honored Arabic, restrained ornament.
2. A11y bones — carousel aria roles, focus-visible, lang/dir on Arabic, FOUC theme script, landmarks.
3. Hospitable IA — 5-item nav, purposeful pages, empty states.

## Priority Issues

[P1] Low-contrast text on emerald + gold-on-gold. Footer text-primary-foreground/80 + copyright /70 white over emerald #166534 ~3.3-4:1, fails 4.5:1. "Penting" badge text-gold on bg-gold/15 ~2.5:1. Elder jamaah on phone is stated reader. Fix: footer >=/90 or solid; badge darker gold or solid bg + white. Command: audit then colorize.

[P2] Footer heading dead gold class. h3 has both text-gold AND text-primary-foreground; primary-foreground wins so Navigasi/Kontak render white not gold. Fix: drop text-primary-foreground, verify gold-on-emerald contrast (likely needs lighter #e3c766). Command: polish.

[P2] Hero overlay too heavy. Image slides stack bg-black/65 + bg-black/45 ~80% darkening, photo near invisible. Fix: single gradient scrim. Command: polish/layout.

[P2] Card hover sameness. Schedule/article/announcement/nilai/team all share rounded-2xl border bg-card shadow-sm hover:-translate-y-1. Uniform reflex. Fix: differentiate by role (schedule as timeline, etc). Command: layout.

## Persona Red Flags
- Jordan (first-timer): passes — labeled nav, clear CTAs, greeting orients.
- Casey (mobile): hamburger no Esc/tap-outside, no icon swap; heavy hero assets per slide.
- Sam (a11y): footer/badge contrast below AA; Penting status partly color-only; carousel autoplay no persistent pause (hover only, unusable on touch/kbd).
- Elder Jamaah (project persona): contrast issues hit hardest — gold-on-gold + faded footer fail daylight low-vision reading.

## Minor Observations
- Two eyebrows on tentang (Reserved-Kicker Rule). Fine at 2, watch reflex.
- ArticleCard fallback flat emerald gradient block; motif/texture better.
- Mobile menu toggle variable name inverts meaning; fragile.

## Questions to Consider
- Does a majelis homepage need carousel autoplay? Static reverent hero may fit "stillness".
- Schedule as cards or calendar/timeline?
- If footer gold bug fixed, is gold-on-emerald legible or should headings stay white by design?
