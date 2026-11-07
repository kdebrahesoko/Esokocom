# Final contrast review

Orange/ink action labels are 20px bold so the existing pairing qualifies for the large-text contrast threshold. This is not a normal-text AA claim and no new palette value was added.

# Close to the crop — design plan

## Plan and review

**Hypothesis:** Begin at the scale of a handful of maize, then move from the tangible crop to the farmer's economic choice. This should feel observant and human, not like an overview dashboard. It replaces the current rotating product pitch and metrics with one bounded real detail, a clear purpose, and quieter pathways into Esoko's work.

### Palette — existing Esoko tokens only

- Brand orange `hsl(17 76% 48%)` — a small signal and large-type accent, never small text on white.
- Ink `hsl(215 28% 17%)` — primary text and ink-on-orange CTA text.
- Muted `hsl(215 16% 47%)` — supporting text.
- White `hsl(0 0% 100%)` — primary page surface.
- Mist `hsl(210 40% 98%)` — one cool, low-contrast section surface.
- Forest `hsl(149 81% 23%)` — accessible link/focus accent.

The shared group stylesheet remains the source of its existing color tokens; authored CSS consumes those tokens and does not redefine the brand.

### Type scale

Existing `Plus Jakarta Sans` for headings and `Inter` for body copy. H1 56–76px desktop / 40px mobile; section heading 38–48px / 32px; body 17–19px; labels and links at least 16px. Sentence case, short line lengths.

### Layout idea

An asymmetric crop-led hero: restrained wordmark/navigation above a two-column composition; one short headline and one explanatory paragraph sit beside a deliberately bounded maize image, never enlarged beyond its native width. The next section shifts to a broad, quiet quotation and its exact source attribution; the following section changes structure to three plainly written service pathways in an open staggered list, not equal cards.

```text
DESKTOP
[logo]                           [What we do] [Marketplace]
[headline + purpose] [bounded maize]
-----------------------------------------------
[farmer's exact words]       [source attribution]
[markets / advice / field information — open rows]

MOBILE
[logo]                 [menu]
[headline + purpose]
[bounded maize]
[farmer's words + attribution]
[service pathways, stacked]
```

Left alignment throughout; image is intimate and inset, with negative space around the text rather than text over the photo.

### Signature moment

The maize photo appears as a tactile, cropped object inside a small, off-center frame. A slim orange edge echoes the crop's kernels and visually carries the eye from the photograph toward the farmer's decision. It is explicitly not a portrait and is not associated with the named speaker.

### Images and provenance

- `approvedPhotos.maize` (`hands-holding-maize-kernels.webp`): hero detail; crop-led concept, intentionally bounded due to its 969px native width.
- `approvedPhotos.inputs` (`agricultural-input-bottles-on-shelves.webp`): modest supporting image in the second section, showing practical agricultural information in a tangible setting without suggesting a testimonial.
- `logo`: official copied Esoko logo only.
- Every intended future people-story / portrait replacement is visibly marked exactly **“people photo planned”**. No faces, outside stock, generated images, or assets outside the six-photo allowlist.
- Farmer voice is quoted verbatim from the Marketplace story in `_content.ts`, with the exact supplied name, role, location, and source label. The anonymous photographed hands are never attributed to that speaker.

### Motion

No autoplay, scroll-triggered reveals, or decorative motion. Short, user-triggered hover/focus feedback only, using opacity/transform. Respect `prefers-reduced-motion`; keep focus rings visible.

### Generic-default audit and revisions

- Removed the default full-bleed photo, carousel, floating analytics, numeric proof-points, and feature-card grid: the concept is about the crop and the decision, not a pitch.
- Rejected cream, serif, terracotta, gradient wash, all-caps eyebrows, decorative numbering/rules, and tiny orange text; these are either prohibited or generic defaults.
- Kept the photo deliberately small and the type hierarchy large, so the image remains a real detail rather than stock-style hero scenery.
- Service breadth uses irregular open rows rather than identical cards. Only two responsive siblings reuse this exact one-page component.

### Future consented storytelling

Once consent is explicitly granted for a specific named image and filename, replace only the clearly marked “people photo planned” places with that approved portrait/story image and its authorized caption. Keep the crop-first composition and separate the photograph from Mariama Diallo's existing quotation unless consent and source records specifically connect them. Until then, the marked text remains visible.
