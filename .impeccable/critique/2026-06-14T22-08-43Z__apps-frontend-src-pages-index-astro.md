---
target: frontend
total_score: 31
p0_count: 0
p1_count: 0
timestamp: 2026-06-14T22-08-43Z
slug: apps-frontend-src-pages-index-astro
---
# Critique: frontend (homepage primary)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Nav active states, carousel dots + new pause control; no form states (few forms) |
| 2 | Match System / Real World | 4 | Indonesian + Islamic domain terms land perfectly for jamaah/santri |
| 3 | User Control and Freedom | 3 | Carousel pause added; mobile menu has no Esc / click-outside |
| 4 | Consistency and Standards | 3 | Strong token system; lime gradient divider conflicts with stated one-hue |
| 5 | Error Prevention | 3 | Empty states present ("Belum ada jadwal"); external links rel-safe |
| 6 | Recognition Rather Than Recall | 4 | Text-labeled nav, labeled controls, no icon-only traps |
| 7 | Flexibility and Efficiency | 3 | Keyboard-reachable controls; no shortcuts (fine for brand site) |
| 8 | Aesthetic and Minimalist Design | 3 | Calm & on-brand post-fix; repeated gradient divider + 2 generic video cards |
| 9 | Error Recovery | 3 | Minimal surface; safe external links |
| 10 | Help and Documentation | 2 | Contact in footer; no FAQ (acceptable for register) |
| **Total** | | **31/40** | **Good** |

## Anti-Patterns Verdict
**LLM:** Not AI slop. Distinctive emerald+gold Islamic identity, reverent tone, domain-true copy. Hero is genuinely crafted (single emerald scrim, accessible pause, reduced-motion). Two residual template tells: repeated gradient divider under every section heading, and the large-rounded-icon card pattern in Kanal Dakwah.
**Deterministic scan:** `detect.mjs` over `apps/frontend/src` → 0 findings, exit 0. Clean.

## What's Working
- Audience/language fit is excellent — domain terms (jadwal, asatidz, kitab) read native.
- Hero post-fix: single emerald-ink gradient scrim, keyboard+touch pause toggle, prefers-reduced-motion start-paused.
- Recognition: text-labeled nav, no icon-only navigation, labeled mobile button.
- Contrast now WCAG AA across footer/badge/buttons (the P1 work).

## Priority Issues
- **[P2] Repeated gradient divider under every section heading.** SectionHeading.astro:37 — `bg-gradient-to-r from-primary to-lime-brand` renders on every section. This is section-grammar scaffolding (same family as the banned per-section eyebrow), and lime is a second chromatic family violating the One-Hue rule. Fix: reuse the star Divider for sacred/invitational moments only, or replace with a single solid emerald hairline; drop lime. Command: /impeccable typeset or quieter.
- **[P2] Mobile menu accessibility gaps.** Header.astro:85 — toggles `hidden` only. No Esc-to-close, no click-outside, no hamburger→X icon swap, and `aria-label` stays "Buka menu" when open. Fails Sam (a11y) and Casey (mobile). Command: /impeccable harden.
- **[P2] Generic icon-card pattern in Kanal Dakwah.** index.astro:115 — large rounded icon above heading + text, the template tell ("icons above every heading"). Only 2 cards, but it's the reflex shape. Fix: differentiate (channel-led layout, thumbnail, or inline list). Command: /impeccable layout or distill.
- **[P3] SectionHeading eyebrow prop is a footgun.** SectionHeading.astro:23 — uppercase tracked pill. Unused on homepage now; if ever passed it's the banned per-section eyebrow. Consider removing the prop.
- **[P3] Announcement + video cards still share generic chrome.** Schedule/article/team are now role-distinct; announcement and channel cards still ride the default `bg-card border hover-lift`. Announcements should read quieter than destinations.

## Persona Red Flags
**Sam (a11y):** Mobile menu not dismissible by keyboard (no Esc); aria-label doesn't reflect open state. Carousel pause control is a win (keyboard+touch reachable).
**Casey (mobile):** Mobile menu stays open on outside tap / route change; no icon feedback for open state. Hero pause reachable by thumb.
**Jordan (first-timer):** Clear — Indonesian labels, obvious nav, greeting sets context. No jargon barrier.

## Minor Observations
- `h-18` on header is a custom spacing value; confirm it's a defined token.
- Kanal Dakwah uses identical play-triangle icon for YouTube + TikTok; platform-true marks would aid recognition.

## Questions to Consider
- Should the section divider be a sacred/invitational marker (star, used sparingly) rather than a uniform per-section underline?
- Does the Kanal Dakwah section need cards at all, or would a quiet two-row list with platform marks be calmer and more on-brand?
