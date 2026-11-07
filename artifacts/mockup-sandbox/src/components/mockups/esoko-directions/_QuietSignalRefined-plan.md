# QuietSignalRefined — plan and critique

## Direction
Keep the selected quiet, forest-green message-led opening, but make the words and sample message do clearer work: one concise promise, a plainly captioned example SMS, then a human-scale account of how Esoko relates to local agricultural decisions. The following sections distinguish Esoko's people and purpose from its practical services without turning either into promotional software inventory.

## Palette — existing Esoko tokens only
- **Forest field:** `hsl(149 81% 23%)` — hero ground and small navigation accents.
- **Paper:** `hsl(0 0% 100%)` — open reading surfaces and logo ground.
- **Mist:** `hsl(210 40% 98%)` — soft transition for the voice/story section.
- **Working ink:** `hsl(215 28% 17%)` — headlines and ordinary text on light ground.
- **Quiet copy:** `hsl(215 16% 47%)` — supporting prose.
- **Signal orange:** `hsl(17 76% 48%)` — one primary CTA, carrying ink text at 20px bold or larger.

## Type scale
Use existing Inter for body/interface and Plus Jakarta Sans for headings. Body and controls at least 16px/1.6; supporting text 16px; hero title clamp(2.5rem, 6vw, 4.75rem), 1.05 line-height; section titles clamp(2rem, 4vw, 3rem); quote 1.5–2rem. Sentence case throughout.

## Layout
Centred green hero with an intimate, compact horizontal phone-example inset as the tangible signature, not a split-photo banner. Keep the headline first, then short plain-language explanation and one orange, ink-on-orange primary route to Products & Services. The first section pairs a quiet explanation with the verbatim farmer voice; no unconsented portrait is implied. The second section is an asymmetric, text-led set of service capabilities with simple anchor/learn-more navigation. On narrow screens, a real native-dialog drawer keeps the header usable and returns focus on close.

```text
┌ logo                              menu / two routes ┐
│                  useful message                      │
│         short statement + exact service path         │
│       [orange primary]   [small example SMS]         │
└───────────────────────────────────────────────────────┘
┌ local decisions       exact farmer voice + planned marker ┐
└────────────────────────────────────────────────────────────┘
┌ what Esoko helps do     varied service descriptions       ┐
└────────────────────────────────────────────────────────────┘
```

## Signature and motion
The photographed feature phone sits in a compact captioned example inset alongside the message, a tangible indication of how information can arrive without implying a live alert. Keep sections static. The only interaction beyond navigation is the user-opened mobile menu; rely on native dialog keyboard/escape behavior, clear close control, focus restoration and reduced-motion-safe transitions.

## Critique before build
Avoid repeating the source carousel, giant image split, equal feature cards, live-data cues, extra trust statistics, decorative counters, hero overlays, gradients, ornamental rules, and scroll-reveal motion. Use the actual navigation destinations: Products & Services at `/esoko-next/products-services/`, Company at `/esoko-next/company/`, and the supplied farmer-voice story route. Keep the orange action large and bold enough for the existing orange/ink pairing; ordinary text links remain forest on white.

## Provenance and people
Read current `QuietSignal.tsx` and `_QuietSignal.css`; retain the parent's centered forest-green direction and compact horizontal phone artifact while rebuilding as an independent component and stylesheet. Brand and image provenance are the existing `_group.css`, `_content.ts`, and the Esoko design skill. Use the official logo and approved `phone` WebP only. Preserve the exact farmerVoice excerpt, name, role, location, and source link. Show the literal `people photo planned` marker at the story/portrait placement; do not associate the anonymous phone or other imagery with Mariama. A filename-specific consent approval would allow only that approved portrait to replace the marker later, with a name-and-role alt text; no image is used to imply her identity before then.
