---
name: Majelis Nur Muhammad
description: Warm, traditional Islamic identity for a pesantren & majelis — emerald, gold, and honored Arabic script.
colors:
  cream-paper: "#f6faf1"
  forest-ink: "#11271b"
  card-white: "#ffffff"
  emerald-primary: "#166534"
  emerald-accent: "#15803d"
  sage-secondary: "#dcf5dc"
  sage-muted: "#eaf3e4"
  leaf-accent: "#e6f3dc"
  muted-ink: "#54675b"
  gold: "#b8902a"
  lime-brand: "#84cc16"
  border-sage: "#d6e7cc"
  dark-bg-forest: "#08140d"
  dark-card: "#0e2317"
  dark-ink: "#e7f0e6"
  dark-emerald: "#22c55e"
  dark-gold: "#e3c766"
typography:
  display:
    fontFamily: "Poppins, Plus Jakarta Sans Variable, ui-sans-serif, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Poppins, Plus Jakarta Sans Variable, sans-serif"
    fontSize: "clamp(1.875rem, 3vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Plus Jakarta Sans Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  arabic:
    fontFamily: "Amiri, Scheherazade New, serif"
    fontSize: "clamp(1.875rem, 4vw, 2.25rem)"
    fontWeight: 400
    lineHeight: 2
    letterSpacing: "normal"
  label:
    fontFamily: "Plus Jakarta Sans Variable, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.1em"
rounded:
  sm: "0.6rem"
  md: "0.725rem"
  lg: "0.85rem"
  xl: "1.1rem"
  "2xl": "1.35rem"
  "3xl": "1.85rem"
  full: "9999px"
spacing:
  section-y: "4rem"
  card-p: "2rem"
  gap: "1.25rem"
components:
  button-primary:
    backgroundColor: "{colors.emerald-primary}"
    textColor: "{colors.card-white}"
    rounded: "{rounded.full}"
    padding: "0.625rem 1.25rem"
  button-primary-hover:
    backgroundColor: "{colors.emerald-accent}"
    textColor: "{colors.card-white}"
  button-gold:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.card-white}"
    rounded: "{rounded.full}"
    padding: "0.875rem 1.75rem"
  button-outline:
    backgroundColor: "{colors.cream-paper}"
    textColor: "{colors.emerald-primary}"
    rounded: "{rounded.full}"
    padding: "0.625rem 1.25rem"
  card:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.forest-ink}"
    rounded: "{rounded.2xl}"
    padding: "{spacing.card-p}"
---

# Design System: Majelis Nur Muhammad

## 1. Overview

**Creative North Star: "The Serene Majelis"**

The site should feel like stepping into a calm hall of learning — air, light, and reverence. Emerald greens ground it like the cloth and tilework of a prayer space; gold marks what is sacred or invitational, never what is merely for sale. Arabic script (Amiri) is not decoration but voice: divine names and shalawat are given room to breathe. The density is low and the pacing unhurried — this is a place of stillness, hospitality, and trust earned through tradition, not through slickness.

This system explicitly rejects the generic SaaS/template look (icon-card grids, tracked-uppercase eyebrows on every section, gradient text), ornate clutter (heavy filigree, busy Islamic clip-art), cold corporate sterility (fintech-navy, impersonal blandness), and loud marketing hype. Dignity over hype, always. Ornament is seasoning — the star motifs accent and frame at low opacity; they never fill space.

**Key Characteristics:**
- Emerald + gold on cream paper (or deep forest in dark mode) — the logo palette, never re-picked.
- Reverent treatment of Arabic script: gold weight, generous line-height, honored placement.
- Soft pill geometry, gentle elevation, calm hover lift — refined and never aggressive.
- Low ornament density: geometric star motifs as structural accent only.
- Legibility first — body copy reads comfortably for an elder jamaah on a phone in daylight.

## 2. Colors

A warm, living palette: forest emeralds carry identity, gold marks the sacred and the invitation, cream paper keeps it bright and welcoming.

### Primary
- **Emerald Primary** (#166534): The brand's voice. Primary buttons, links, active states, headings accents, the closing CTA panel. In dark mode it brightens to a luminous green (#22c55e) for contrast against deep forest.
- **Emerald Accent** (#15803d): Hover state for primary — a half-step brighter, the gentle lift.

### Secondary
- **Sage Secondary** (#dcf5dc) / **Sage Muted** (#eaf3e4) / **Leaf Accent** (#e6f3dc): Tonal green washes for section backgrounds (`bg-secondary/40`), chips, and quiet surfaces. They layer warmth without introducing a second hue.

### Tertiary
- **Gold** (#b8902a): The sacred-and-invitation color. Arabic verses, the divider star, the highest-intent CTA ("Jadwal Pengajian"). Used sparingly so it stays meaningful. Dark mode: warmer luminous gold (#e3c766).
- **Lime Brand** (#84cc16): A single bright accent, used only in the heading underline gradient (emerald → lime). Energy, restrained.

### Neutral
- **Cream Paper** (#f6faf1): The body background. A bright, faintly green-tinted off-white — welcoming, not the saturated AI-cream default; the tint is the brand's own emerald hue.
- **Forest Ink** (#11271b): Primary text. Deep green-black for warmth over pure black.
- **Card White** (#ffffff): Raised card surfaces against cream paper.
- **Muted Ink** (#54675b): Secondary/subtitle text. Use only where contrast holds; never for primary reading copy.
- **Border Sage** (#d6e7cc): Hairline borders and dividers.

### Named Rules
**The Gold-is-Sacred Rule.** Gold marks the sacred (Arabic script, divine names) and the single highest-intent invitation. It is never a generic accent or a second brand color. If gold appears more than ~3 times on a fold, one of them is wrong.

**The One-Hue Rule.** The palette is emerald, its tonal washes, and gold. Do not introduce a second chromatic family. "Warmth" comes from the cream paper and gold, not from adding orange, teal, or blue.

## 3. Typography

**Display Font:** Poppins (with Plus Jakarta Sans Variable, sans-serif fallback)
**Body Font:** Plus Jakarta Sans Variable (with system-ui fallback)
**Arabic Font:** Amiri (with Scheherazade New, serif fallback)

**Character:** Geometric, friendly authority. Poppins gives headings a rounded, approachable dignity; Jakarta Sans keeps body copy clean and highly legible; Amiri brings classical, calligraphic gravity to Arabic. The pairing contrasts on the geometric-vs-humanist axis, not on two-similar-sans reflex.

### Hierarchy
- **Display** (Poppins 800, clamp(2.25rem → 3.75rem), 1.05): Hero headline and page-defining titles. `text-balance` on. Letter-spacing -0.02em — committed but never cramped.
- **Headline** (Poppins 700, clamp(1.875rem → 2.25rem), 1.15): Section titles ("Jadwal Pengajian", "Artikel Terbaru").
- **Title** (Poppins 600, 1.125rem, 1.3): Card titles, channel names.
- **Body** (Jakarta 400, 1rem, 1.65): Reading copy. Cap measure at 65–75ch (`max-w-2xl` for prose blocks).
- **Arabic** (Amiri 400, clamp(1.875rem → 2.25rem), line-height 2): Verses and shalawat. Always `dir="rtl" lang="ar"`, gold color, extra leading.
- **Label** (Jakarta 600, 0.75rem, tracking 0.1em, uppercase): The hero greeting pill ("Assalamu'alaikum"). Reserved — not an every-section eyebrow.

### Named Rules
**The Honored-Script Rule.** Arabic is never shrunk, cramped, or used as background texture. It gets gold weight, line-height ≥2, and deliberate placement. It is voice, not ornament.

**The Reserved-Kicker Rule.** The uppercase tracked label exists for the hero greeting and rare named labels only. It is forbidden as a repeating eyebrow above every section heading — that is the AI scaffold this brand rejects.

## 4. Elevation

Soft and atmospheric, never heavy. Surfaces rest nearly flat on cream paper, lifted by faint tonal shadows tinted toward emerald. Depth is a quiet response to interaction — cards and buttons lift gently on hover (`-translate-y-0.5` to `-translate-y-1`), they don't slam forward. The 2014-app drop shadow (dark, tight, gray) is forbidden; if a shadow looks like a box edge rather than diffused light, it's wrong.

### Shadow Vocabulary
- **Rest** (`box-shadow: 0 1px 2px rgba(0,0,0,0.05)` — `shadow-sm`): Default card and button resting state.
- **Lift** (`box-shadow: 0 10px 25px rgba(0,0,0,0.08)` — `shadow-lg`): Hover state for cards and primary buttons, paired with a gentle translate.
- **Accent glow** (`shadow-primary/20`): Emerald-tinted soft shadow under primary buttons — warmth, not weight.

### Named Rules
**The Gentle-Lift Rule.** Elevation appears on hover as a small upward translate plus a softer, larger shadow. Rest is calm. No element is permanently floating or aggressively shadowed.

## 5. Components

The feel: **refined and gentle.** Soft pill geometry, calm transitions, dignified hover. Nothing shouts.

### Buttons
- **Shape:** Fully rounded pill (`rounded-full`).
- **Primary:** Emerald fill (#166534), white text, `shadow-sm shadow-primary/20`. Padding 0.625rem×1.25rem (md). Hover: brightens to #15803d, larger shadow, `-translate-y-0.5`.
- **Gold:** Gold fill (#b8902a), white text — the highest-intent invitation only. Hover: `brightness-110` + lift.
- **Outline:** Emerald text, `border-primary/30`. Hover: fills emerald, text goes white.
- **Ghost:** Emerald text, transparent → `bg-accent` on hover.
- **Focus:** `outline-2 outline-offset-2 outline-primary` — always visible, never removed.

### Cards
- **Corner Style:** Generous round (`rounded-2xl`, 1.35rem).
- **Background:** Card white (#ffffff) on cream paper; tonal green surfaces for quiet sections.
- **Shadow Strategy:** Rest = `shadow-sm`; hover = `shadow-lg` + `-translate-y-1` + emerald-tinted border.
- **Border:** `border-border` (#d6e7cc) hairline.
- **Internal Padding:** 2rem (`p-8`) for feature cards.
- **Don't nest cards.** A card inside a card is always wrong here.

### Inputs / Fields
- **Style:** `border-input` (#d6e7cc) hairline, card-white or cream background, soft radius. `@tailwindcss/forms` base.
- **Focus:** Emerald outline (#166534), no harsh glow.
- **Placeholder:** Must meet 4.5:1 — not the default light gray.

### Navigation
- **Style:** Header with logo + Indonesian nav (Beranda, Jadwal, Artikel, Tentang), theme toggle. Body font, medium weight; emerald on hover/active. Mobile: collapses to a menu; keep tap targets ≥44px.

### Signature: Star Divider & Ornaments
A centered divider — two gold gradient hairlines flanking an 8-point star (`StarOrnament`). Used to frame sacred or invitational moments (CTA panels, section breaks). Large star ornaments appear in heroes/CTAs at ~10% opacity as structural backdrop. The `islamic-grid` dotted backdrop (emerald dots at 14% on 22px grid) is the quiet texture option. Restraint is the rule: frame, don't fill.

## 6. Do's and Don'ts

### Do:
- **Do** keep emerald + gold + cream as the entire palette; carry warmth through paper and gold, not a second hue.
- **Do** honor Arabic script: gold, line-height ≥2, `dir="rtl" lang="ar"`, deliberate placement.
- **Do** use the gold/star divider and ornaments to frame sacred and invitational moments — at low opacity, structurally.
- **Do** keep body text at ≥4.5:1 contrast (lean toward Forest Ink #11271b; verify Muted Ink #54675b before using it for anything readers must read).
- **Do** use soft pill buttons with gentle hover lift; keep focus outlines visible.
- **Do** cap prose at 65–75ch and give sections generous vertical air.

### Don't:
- **Don't** ship the generic SaaS/template look — no icon-card grids repeated endlessly, no gradient text (`background-clip: text`), no tracked-uppercase eyebrow above every section.
- **Don't** clutter with ornate filigree or busy Islamic clip-art; one ornament too many means remove it.
- **Don't** go cold/corporate — no fintech-navy, no sterile impersonal stock blandness. It must feel human and spiritual.
- **Don't** be loud or flashy — no CTAs shouting on every fold, no hype tone. Dignity over hype.
- **Don't** use `border-left`/`border-right` >1px as a colored stripe on cards or alerts.
- **Don't** treat gold as a generic accent — it marks the sacred and the single highest invitation only.
- **Don't** nest cards, or let headline copy overflow its container at any breakpoint.
