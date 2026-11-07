# Final contrast review

Orange/ink action labels are 20px bold: the existing pairing meets the large-text threshold, not the normal-text threshold. No darker orange, new font or palette colour was introduced. Company links use the actual existing Company route.

# Field Notes — design plan

## Hypothesis
The first impression should begin with the everyday decision, not a platform inventory: a farmer or buyer compares choices, and Esoko helps useful information reach that moment. This is a photo-led, human-scale reading experience rather than a software pitch.

## Palette
Use only existing Esoko tokens:
- `hsl(17 76% 48%)` — precise orange signal for a large highlight or small visual marker, never small orange-on-white text.
- `hsl(215 28% 17%)` — ink for headings and body.
- `hsl(0 0% 100%)` — clear page field and image breathing room.
- `hsl(210 40% 98%)` — quiet cool mist surface behind the second section.
- `hsl(149 81% 23%)` — forest for readable CTA labels and focus.
- `hsl(214 32% 91%)` — restrained separation where needed.

## Type scale
Existing brand families only: Plus Jakarta Sans for headings, Inter for body and navigation. H1 `clamp(2.75rem, 6.2vw, 5.5rem)` with compact leading; section heading `clamp(2rem, 3.8vw, 3.4rem)`; body 1–1.125rem with 1.55–1.65 leading; nav and helper copy 1rem minimum. Sentence case throughout.

## Layout idea
Hero: left-aligned wordmark navigation and a large text lead sits beside one tangible photo of a person reviewing a tablet in an input shop. The photo gets a modest crop and no text laid over it. The lower edge of the hero hands off to a standalone sourced voice excerpt.

First section: an intimate quote / crop pairing, with the quote plainly attributed and explicitly separated from the anonymous tablet image. Then a short, offset three-part account of information pathways (market, advisory, field data) rather than another feature-card grid.

```text
┌─────────────────────────────────────────────────────┐
│ Esoko                         What we do   Learn more│
│                                                       │
│ Information for the     ┌────────────────────────┐  │
│ choices a season asks.   │ tablet in input shop   │  │
│ [Explore how it works]   │ photo, not testimonial │  │
│                                                       │
├────────────── farmerVoice quote + attribution ───────┤
│ decision voice     crop detail       clear pathway   │
└─────────────────────────────────────────────────────┘
```
At 360px, keep the same order but stack the content and photo; no horizontal scroll or hidden content.

## Signature moment
The tablet-in-input-shop image is treated as a quiet window onto practical work. A small, adjacent note names it as an anonymous field image, while the exact Marketplace voice is quoted separately below, so no words appear to belong to the pictured person.

## Approved imagery
- `tablet` leads: the image contains the tangible tool and input-shop setting named in the brief; keep it at natural scale in a contained portrait-ish crop.
- `maize` supports the first section as a close crop of the material being considered, never a portrait or implied speaker likeness; use only at native size.
- `inputs` is a small secondary supporting photo if needed to ground the information-pathway section in real tools.
Do not use the remaining allowed files merely to fill space. No face imagery, generated artwork, or external photos.

## Motion
No autoplay, no scroll-reveal choreography, and no animation on page load. Use a short CSS transform on the in-page navigation hover/focus and a subtle pressed-state response on links; disable transitions under reduced motion. Smooth anchor scrolling only when motion is permitted.

## Review before build: generic-default audit and revisions
- Rejected the familiar rotating product carousel, stat grid, and equal feature-card rows: they make the page feel like a generic SaaS pitch and invent no useful opening hierarchy.
- Rejected cream paper, serif editorial styling, gradients, decorative rules, all-caps eyebrow labels, badges, and numbered feature columns. Brand fonts and Esoko's cool neutral/forest/orange tokens stay in charge.
- Rejected a quote overlay on a person or a fabricated attributed anecdote; exact quote and source stay text-first and visibly distinct from all anonymous imagery.
- Three distinct design hypotheses were supplied: Field Notes (decision + photo-led), Quiet Signal (service-led), and Close to the Crop (crop-led). This file develops Field Notes only; its variations are not reskins.

## Source provenance
Reference comprehension: `artifacts/esoko-next/src/components/home/HeroCarousel.tsx`, `WhoWeAreSection.tsx`, and `WhyEsokoSection.tsx`. Brand values and font names: `.agents/skills/esoko-design/SKILL.md` and local read-only `_group.css`. Image paths and the exact Marketplace excerpt are imported from local read-only `_content.ts`; no other content claims or outcomes are added.

## Future people-photo placements
The anonymous tablet photo is not a speaker portrait. The only intended future replacements for a named-person story are visibly marked `people photo planned`; any such placement stays a small inline note, not a blank image box. After filename-specific consent is granted, replace only that note with the specifically consented portrait, matching the actual speaker and approved usage; keep the sourced excerpt and attribution unchanged. No consent means no portrait.
