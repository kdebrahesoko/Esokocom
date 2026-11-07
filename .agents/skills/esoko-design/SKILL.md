---
name: esoko-design
description: Esoko's design system and UI rules for the website (Next.js in artifacts/esoko-next and the legacy Vite site in artifacts/esoko-website), the Expo mobile app, and the admin areas. Use this skill for ANY visual or UI work, even small ones, including new pages, sections, components, redesigns, hero areas, navigation, mega menus, forms, cards, buttons, colors, typography, spacing, images, icons, animation, responsive layout, dark mode, or making something look "premium", "modern" or "polished". Also use it when migrating a page between frameworks, reviewing a design, or choosing images. Read it before writing any UI code.
---

# Esoko Design System

Esoko connects farmers, agribusinesses, NGOs and governments across Africa with market information, advisory and data services. The design must earn trust from two very different audiences at once: enterprise and government buyers who expect a credible, premium company, and farmers and field agents who often use low-cost Android phones on slow, expensive mobile data. Every design decision should work for both.

## Core principles

1. **Clarity over decoration.** A visitor should understand what a section offers within a few seconds. Remove anything that does not help that.
2. **Real over generic.** Real field photography of Esoko's people and users beats stock or AI-generated imagery every time.
3. **Fast on a slow phone.** Design for a 360px-wide Android phone on a 3G connection first, then scale up.
4. **Consistent, not inventive.** Reuse existing tokens and components. A new color, font, or component style needs a clear reason.
5. **Accessible by default.** Readable contrast, keyboard access and meaningful alt text are requirements, not polish.

## Before you start any UI task

1. Find the existing design tokens: the Tailwind config and the global CSS file (`globals.css` in esoko-next, `index.css` in esoko-website). Use those values. Never hardcode a hex color, font size or spacing value that a token already covers.
2. Check `components/ui/` (shadcn/ui) and existing feature components for something that already does the job. Extend before you create.
3. Look at one or two existing pages that are similar to what you are building, and match their structure and rhythm.
4. If migrating a page, content, section order and imagery must match the source exactly unless the task says otherwise. Add or update a parity test.

## Working alongside the frontend-design skill

This project may also have the general `frontend-design` skill installed. Use both, with these precedence rules:

- **Brand always wins.** Esoko's logo, colors, fonts, radius and other tokens are fixed. Where frontend-design encourages choosing a new palette or typefaces, or taking aesthetic risk with brand basics, follow this skill instead. Its "4 to 6 hex values" token plan should be built from existing Esoko tokens, not invented.
- **Migrations and parity work:** do not apply frontend-design at all. Match the source exactly.
- **Bug fixes and small edits:** match the surrounding page. No redesign.
- **New sections, new pages, or explicit redesign requests:** use frontend-design's process (plan, review against the brief, build, critique) and its creative judgment for layout, composition, hero treatment and the single memorable element, all within Esoko's tokens.
- **Always apply** its guidance on restraint, avoiding generated-looking defaults (all-caps eyebrow labels on every heading, identical card grids, fade-up animation on every section, arrows appended to every button), purposeful motion, and interface writing. These fit Esoko's principles directly.

## Brand

### Color
- **Esoko orange** is the primary brand color. Use it for primary buttons, key highlights, active states and small accents. It should feel like a signal, not a background wash; aim for roughly 10% of a screen, not 50%.
- **Neutrals** (near-black, greys, off-white) carry most of the interface.
- **Greens and earth tones** may support agricultural imagery, but must come from existing tokens.
- **Contrast warning:** bright orange text on white usually fails WCAG AA for normal-size text. For orange *text* or links, use the darker orange token (or create one with approval). White text on an orange button needs to be bold and large enough, or the orange must be dark enough to reach 4.5:1. Check every new color pairing.
- Status colors (success, warning, error, info) come from tokens and are never the only way meaning is shown; pair them with an icon or text.

### Logo
- Use only the official logo files in the project (`public/` or the images folder). Never recreate, recolor, stretch, or add effects to the logo.
- Keep clear space around it at least the height of the "E".
- Use the light version on dark or photographic backgrounds.

### Typography
- Use only the fonts already configured in the project. Do not add a font without approval; every font costs download time.
- Establish hierarchy with size and weight, not color. One clear H1 per page.
- Body text: at least 16px, line height about 1.5 to 1.7, line length about 60 to 75 characters.
- Use sentence case for headings and buttons ("Request a demo", not "Request A Demo").

### Spacing and layout
- Use the Tailwind spacing scale only. Keep section padding consistent across pages (match existing sections).
- Use a centered max-width container for content; let only hero images and intentional full-bleed sections span edge to edge.
- Prefer generous whitespace over borders and boxes to separate content.
- Corner radius and shadow come from tokens; do not mix several radii or heavy shadows on one page.

## Current token values

Audited 2026-11-07. This is a source-backed inventory, not a new theme or an
instruction to normalize existing pages. Recheck the source before each UI
change; do not change application tokens merely to match this snapshot.

Sources:
- Website theme: `artifacts/esoko-website/src/index.css`.
- Next brand scope and root: `artifacts/esoko-next/src/app/globals.css`.
- Scoped public content: `artifacts/esoko-next/src/app/resources/resources.css`
  and `artifacts/esoko-next/src/app/careers/careers.css`.
- Mobile palette: `artifacts/esoko-mobile/constants/colors.ts`; font loading:
  `artifacts/esoko-mobile/app/_layout.tsx`.
- Next shadow defaults: the installed `tailwindcss/theme.css`, currently at
  `artifacts/esoko-next/node_modules/tailwindcss/theme.css`.

### Orange and contrast

| Context / token | Actual value | Contrast with white |
| --- | --- | --- |
| Website light `--brand`; Next `.esoko-home` / `.site-chrome` `--brand` | `hsl(17 76% 48%)`, approximately `#D7521D` | 4.09:1 |
| Existing darker orange: mobile `light.brand` | `#C0570C` | 4.56:1 |
| Legacy website `.dark` `--brand` | `hsl(25 88% 50%)`, approximately `#F06D0F` | 3.05:1 |
| Mobile `dark.brand` | `#D97429` | 3.24:1 |

The website comment says approximately `#D9531E`, but the HSL declaration is
authoritative; the contrast calculation uses its unrounded sRGB channels.
The hex conversion above is rounded for documentation, not a replacement token.

**The main website orange fails WCAG AA for normal text on white:** 4.09:1 is
below 4.5:1. It passes the 3:1 large-text threshold. Large means at least
24 CSS px regular or approximately 18.67 CSS px bold; bold small text alone does
not qualify. White text on the same orange has the same contrast and limitation.

The darker `#C0570C` exists in mobile and passes 4.5:1 on white, but there is no
dedicated darker-orange token in the audited website theme declarations.
Do not pretend that mobile value is already a website token, silently introduce
a web mapping, or hardcode it into web components without approval. The legacy
dark-mode orange is lighter, not an accessible darker-text substitute.
Opacity and actual backgrounds change contrast; assess the resulting pairing.

### Neutrals and supporting colors

Website light and Next brand-scoped values:

| Token | Value |
| --- | --- |
| `--background`, `--card`, `--popover` | `hsl(0 0% 100%)` |
| `--foreground`, `--card-foreground`, `--popover-foreground` | `hsl(215 28% 17%)` |
| `--muted` | `hsl(210 40% 98%)` |
| `--muted-foreground` | `hsl(215 16% 47%)` |
| `--border`, `--card-border`, `--input` | `hsl(214 32% 91%)` |
| Existing CSS `--primary` / `--ring` | `hsl(149 81% 23%)` (green, not orange) |
| `--gold` / `--secondary` | `hsl(44 100% 48%)` |
| `--accent` | `hsl(142 76% 36%)` |

Next's unscoped root differs: background `hsl(150 20% 97%)`, card
`hsl(150 30% 99%)`, border `hsl(150 14% 87%)`, muted text `hsl(215 16% 40%)`.
Resources/Careers keep their scoped paper `#f7f6f0`, card `#fffefb`,
ink `#1b2a20`, muted `#66756b`, line `#e3e8e1`, forest `#0b4a26`,
deep forest `#051c0e`, leaf `#12804a`, and gold `#c9952b`.
Mobile light uses foreground `#1A2B3C`, background/card `#FFFFFF`,
muted `#F5F8FC`, muted foreground `#6B7A8F`, and border/input `#DDE4EE`.
These scopes are not interchangeable; retain each existing page's palette in
migrations and small fixes. Check the legacy `.dark` block or mobile dark
palette directly for dark-mode work rather than reusing light values blindly.

### Fonts

- Website and Next brand scope: body `--app-font-sans: 'Inter', sans-serif`;
  headings `--app-font-heading: 'Plus Jakarta Sans', sans-serif`.
  Their stylesheet imports request Inter 400/500/600 and Plus Jakarta Sans
  500/600/700/800.
- Next unscoped root: `system-ui, -apple-system, "Segoe UI", sans-serif`.
- Resources/Careers declare `"DM Sans", system-ui, sans-serif`; this records
  their CSS stack, not proof DM Sans was downloaded or is the rendered face.
- Mobile loads Inter 400/500/600/700 and Plus Jakarta Sans 500/600/700/800.
  Preserve existing font-family names and component usage.

### Radius

- Website light and Next theme base: `--radius: 1.25rem` (20px at a 16px root).
- Small: `calc(var(--radius) - 4px)`; medium: minus 2px; large: base;
  XL: plus 4px. At that root size these are 16/18/20/24px.
- Existing Resources/Careers cards use 18px; the Resources hero card uses 24px.
- Mobile's actual shared `radius` value is **16**, despite a comment referring
  to the 20px web radius. Record the value, do not fix that difference as part
  of documentation or skill installation.

### Shadows

Legacy website custom properties (black RGBA):

| Token | Value |
| --- | --- |
| `--shadow-2xs` | `0px 2px 0px 0px rgba(0,0,0,0.02)` |
| `--shadow-xs` | `0px 2px 0px 0px rgba(0,0,0,0.04)` |
| `--shadow-sm` | `0px 2px 4px 0px rgba(0,0,0,0.05)` |
| `--shadow` | `0px 4px 8px -2px rgba(0,0,0,0.08)` |
| `--shadow-md` | `0px 8px 16px -4px rgba(0,0,0,0.1)` |
| `--shadow-lg` | `0px 16px 24px -8px rgba(0,0,0,0.12)` |
| `--shadow-xl` | `0px 24px 32px -12px rgba(0,0,0,0.15)` |
| `--shadow-2xl` | `0px 32px 48px -16px rgba(0,0,0,0.2)` |

Next imports Tailwind's default scale rather than those legacy overrides:

| Token | Value |
| --- | --- |
| `--shadow-2xs` | `0 1px rgb(0 0 0 / 0.05)` |
| `--shadow-xs` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` |
| `--shadow-sm` | `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)` |
| `--shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` |
| `--shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` |
| `--shadow-xl` | `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` |
| `--shadow-2xl` | `0 25px 50px -12px rgb(0 0 0 / 0.25)` |

Resources/Careers additionally use scoped hover shadows such as
`0 14px 30px -18px rgba(11,74,38,.45)`; the Resources hero hover uses
`0 20px 40px -24px rgba(11,74,38,.5)`. Native mobile shadows/elevation are
component styles, not these CSS custom properties.

## Imagery

- **Priority order:** real Esoko photography (field work, farmers, staff, events) > licensed photography > illustrations > AI-generated images.
- **Never** present AI-generated images as real Esoko staff, farmers, partners or events. Leadership and team sections use only real, approved headshots.
- Show people with dignity: active, capable, in context. Avoid poverty clichés.
- Every image needs meaningful alt text describing what matters (for people: name and role). Decorative images get empty alt.
- **Performance:**
  - In Next.js always use `next/image` with correct `sizes`. Use `priority` only for the above-the-fold hero.
  - Prefer WebP or AVIF. Hero images should be under about 250 KB; content images under about 150 KB.
  - Never ship HEIC files or unoptimized phone photos.
  - Social preview images: 1200x630, under 300 KB (WhatsApp is strict).

## Icons

- Use the existing icon library in the project (lucide-react). Do not mix icon sets.
- Keep one stroke width and consistent sizes (typically 16, 20, 24px).
- Icon-only buttons need an `aria-label`.

## Components

- **Buttons:** one primary (orange) action per section. Secondary actions use outline or ghost variants. Minimum touch target 44x44px. Labels describe the action ("Download report", not "Click here").
- **Cards:** consistent padding, radius and image ratio within a grid. The whole card can be clickable, but must have one clear link for keyboard and screen-reader users.
- **Forms:** visible labels (never placeholder-only), helpful inline errors that say how to fix the problem, clear required markers, and a visible success state. Inputs at least 16px font to prevent mobile zoom.
- **Navigation and mega menus:** must work by keyboard (Tab, Enter, Escape) and on touch. On mobile, use a full-screen or drawer menu. Keep labels short and familiar.
- **Empty, loading and error states:** every data-driven component designs all three. Use skeletons that match the final layout rather than spinners where possible.

## Motion

- Motion should explain (reveal, transition, feedback), not decorate.
- Keep durations short: about 150 to 300ms for UI, up to about 600ms for hero transitions.
- Always respect `prefers-reduced-motion` by disabling non-essential animation.
- Do not add heavy animation libraries for effects CSS can do. No autoplaying video with sound. Carousels need visible controls and must pause on hover and focus.

## Responsive behavior

- Build mobile-first. Test at 360px, 768px, 1024px and 1440px.
- No horizontal scrolling on the page body. Wide tables scroll inside their own container.
- Hide nothing important on mobile; restructure it instead.

## Writing in the interface

- Plain, confident language. Many readers use English as a second language.
- Lead with what the user gets: "Get weekly market prices by SMS" beats "Leveraging data-driven insights".
- Avoid hype words such as "award-winning", "world-class", "revolutionary" or "cutting-edge" unless the claim is specific and true.
- Use real numbers and specifics when available (countries, farmers reached, years of operation) and never invent statistics.

## Next.js specifics (artifacts/esoko-next)

- Server Components by default; add `"use client"` only to the smallest interactive part.
- Every page sets metadata through `generateMetadata` or `metadata`, including Open Graph image and description.
- All internal links use `<Link>`; links to the legacy site go through `src/lib/site-links.ts`. Never hardcode `/esoko-next/` in URLs.
- Avoid hydration mismatches: no `Date.now()`, random values or browser-only APIs during render.

## Admin and CMS screens

Admin is for staff efficiency, not marketing. Prioritize density, clear tables, obvious primary actions, confirmation before destructive actions, and clear status labels (Draft, Scheduled, Published). Use the same tokens and components, with less decoration.

## Do not

- Add new colors, fonts, or icon sets without approval.
- Use gradients, glassmorphism, or glow effects as a default style.
- Use AI-generated people in place of real staff or customers.
- Put text over busy photos without an overlay that keeps contrast at 4.5:1.
- Remove focus outlines without providing a visible replacement.
- Change content, copy, or section order during a migration unless asked.

## Definition of done (check before reporting completion)

- [ ] Uses existing tokens and components; no hardcoded colors or new fonts
- [ ] Looks correct at 360px, 768px, 1024px and 1440px
- [ ] Text contrast meets WCAG AA (4.5:1 normal text, 3:1 large text and UI)
- [ ] Fully usable by keyboard with visible focus
- [ ] All images optimized, with meaningful alt text
- [ ] Respects `prefers-reduced-motion`
- [ ] Loading, empty and error states handled where data is involved
- [ ] No console errors or hydration warnings
- [ ] Page metadata and social preview set (public pages)
- [ ] Screenshot taken at mobile and desktop sizes and reviewed
