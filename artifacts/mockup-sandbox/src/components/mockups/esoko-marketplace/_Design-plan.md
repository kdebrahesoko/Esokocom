# Esoko Marketplace redesign — plan

**Direction:** documentary editorial, using the terminal and event photography as evidence of a real community rather than inventing product screens or transaction imagery. The memorable element is the full-bleed terminal hero, with a deep overlay supporting legibility.

**Palette:** existing Esoko foreground `hsl(215 28% 17%)`, white background, muted surface `hsl(210 40% 98%)`, muted text `hsl(215 16% 47%)`, line `hsl(214 32% 91%)`, and the user-approved accessible orange `#C0570C` for key actions and fine signals. Existing Plus Jakarta Sans headings and Inter body are retained from the Esoko scope; no added fonts.

**Layout:** at 1440px, a spacious editorial split-feature layout and asymmetric photo mosaic. At 360px, a short navigation, readable overlaid hero, stacked features and two-column gallery. Shared container rhythm keeps the page legible without hiding content.

```text
1440: [wordmark                              How it works]
      [photo + legible headline, copy, actions            ]
      [intro] [wide documentary photo]
      [wide documentary photo] [feature copy]
      [large photo | small photo across]
      [small photo | wide photo | small photo]
360:  [wordmark                    link]
      [photo / overlay / copy / two actions]
      [feature copy]
      [photo]
      [feature copy]
      [photo]
      [asymmetric two-column photo gallery]
      [closing photo / CTA]
```

**Principles:** no unsupported statistics, testimonial, mock dashboard, or fabricated transaction scenes. Captions describe only the visible event activities; no locations or identities are asserted. Gallery photos are lazy, responsive, dimension-reserved and blur-backed; hero alone is eager/high priority. The gallery uses a native dialog with keyboard navigation, Escape, native focus containment/return, and 48px controls.

**Review against brief:** replaced the generic software-page pattern with a photo-led documentary narrative. The two requested capabilities are feature articles, not numbered workflow steps; image order and composition avoid identical cards. All buttons and links navigate to a real section or the external Marketplace with new-tab disclosure.

**Verification notes:** this preview uses Vite `<picture>`/`<img>` adapters and the provided manifest paths, not `next/image`; production migration should map them to Next Image and central site links. Lighthouse was not run in this sandbox. Hero and content source sizes are within the provided optimized variants; no API/backend changes.
