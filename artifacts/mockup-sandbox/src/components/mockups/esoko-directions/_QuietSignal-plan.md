# Final critique pass

The first screenshot exposed an overly familiar split-copy/phone hero. The final version changes the structure to centred, full-width typography on the existing forest token, with a compact horizontal SMS-example inset below, rather than a second photo-led split layout. White-on-forest is the readable hero pairing; orange remains a small action signal. Mobile service labels stack above descriptions so “Understand” never breaks across syllables. Orange/ink action labels are 20px bold to use the valid large-text contrast threshold, not a normal-text AA claim.

# QuietSignal — design plan

## Hypothesis
**A quiet signal:** a useful piece of agricultural information can make the next decision feel clearer. This is a service- and typography-led homepage opening, not a large split-photo hero. It should feel like a thoughtful conversation grounded in working tools and everyday decisions.

## Palette (existing Esoko tokens only)
- **Brand signal:** `hsl(17 76% 48%)` — orange, reserved for small accents and a large-type highlight; no small orange-on-white text.
- **Working ink:** `hsl(215 28% 17%)` — primary copy and headings.
- **Quiet copy:** `hsl(215 16% 47%)` — secondary explanation.
- **Paper:** `hsl(0 0% 100%)` — page ground.
- **Mist:** `hsl(210 40% 98%)` — the SMS-example surface.
- **Field green:** `hsl(149 81% 23%)` — accessible small CTA text and active/focus detail.

## Type scale
Use only the existing Esoko stacks: Inter for body/navigation and Plus Jakarta Sans for headings. Body 16px/1.6; small supporting copy 16px; navigation 16px; section heading clamp(2rem, 4vw, 3rem); hero headline clamp(2.7rem, 6.3vw, 5.5rem), tight 1.05 line-height. No all-caps labels.

## Layout idea
The hero opens with a compact site header and a left-anchored, large conversational statement; the actual approved feature-phone SMS image is a carefully bounded product artifact beside/below it, with an explicit “example message” caption. It is not a full-bleed or full-width image. The first section is a readable explanation of Esoko's work, joined to the verbatim farmer voice excerpt as a quiet pull-quote; it is not a statistics grid. The second section reframes capabilities as a practical information-to-decision sequence with a different, asymmetric service layout and a real route to learn more.

```text
┌ logo + simple in-page navigation ────────────────┐
│ A useful message can help                         │
│ make the next decision clearer.    [phone SMS]    │
│ Learn how Esoko works                             │
└───────────────────────────────────────────────────┘
┌ Esoko connects information to action ─────────────┐
│ short plain-language overview     farmer voice    │
└───────────────────────────────────────────────────┘
┌ Information, made practical ──────────────────────┐
│ advisory → market information → service pathways  │
└───────────────────────────────────────────────────┘
```

## Signature moment
The phone's photographed sample message feels like a small, tangible arrival beside a headline that reads like a human exchange. The graphic is clearly marked as an example, never represented as a live alert or price.

## Approved imagery and rationale
Only use paths exported from `_content.ts`. Use the approved feature-phone example image (`phone`) as the tangible service artifact; optionally use the approved agricultural inputs/shelves (`inputs` or `shelves`) for a tightly cropped product-context detail in the second section. Do not use maize at a display size beyond its 969px source width. Do not imply any anonymous hands, tablet, or other photo represents Mariama Diallo.

## Motion approach
Static by default. No autoplay or scroll-triggered section entrances. One small, user-triggered CSS response may clarify a selected in-page navigation target; reduced-motion disables all transitions and smooth scrolling. Respect the shared visible focus style.

## Generic-default audit and revision
Rejected a full-bleed split-photo hero, rotating product carousel, metric cards, repeated equal feature cards, all-caps eyebrows, gradients, decorative rules, and repeated reveal animations. The source homepage's breadth becomes a brief conversational statement plus a semantic service sequence: information to a practical decision, rather than more feature inventory. Replaced anonymous stat-grid credibility with the supplied, accurately attributed voice excerpt and no new outcomes.

## Source provenance
Original hero and section components read for comprehension: `artifacts/esoko-next/src/components/home/HeroCarousel.tsx`, `sections/WhoWeAreSection.tsx`, and `sections/WhyEsokoSection.tsx`. Brand values, fonts, contrast and usage follow `.agents/skills/esoko-design/SKILL.md`; process follows `.agents/skills/frontend-design/SKILL.md`. Image URLs and the verbatim quote/attribution come only from `./_content.ts`; no external assets, App Storage, stock or generated imagery.

## Future people-photo placements
The quote/story currently has a visible, compact **people photo planned** marker. A real portrait or story image may replace that marker only after filename-specific consent is granted for that exact person and use. Keep the phone and any hands/tablet imagery separate from Mariama's attribution. Once consent exists, place the approved portrait beside the quote with a name-and-role alt description, preserve the quote's exact source attribution, and re-check crop, consent scope, and mobile layout.
