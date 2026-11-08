# Esoko three-slide hero — isolated preview plan

## Direction

**Layout paradigm:** one full-bleed editorial photograph with a fixed, left-aligned message column on desktop and a lower-anchored column on mobile. The carousel controls occupy a reserved upper-right rail; slide copy, CTA position, and hero height remain stable.

**Mood:** human, capable, and trustworthy. Real Esoko field, marketplace, and call-centre photography carries the experience; no added ornament beyond the orange kicker rule and small service markers.

**Palette:** existing Esoko foreground/background, brand orange, and the existing darker accessible orange token from the extracted hero. The dark image-side gradient is functional contrast, not a separate decoration layer.

**Typography:** existing Inter body and Plus Jakarta Sans heading stacks from the isolated brand scope. One H1 remains on the first slide; later titles are H2s.

```text
Desktop:  [image + left gradient]                         [carousel controls]
          [kicker]
          [headline]
          [support / two highlights]
          [primary action] [optional secondary]

Mobile:   [portrait crop + bottom gradient]
                                         [carousel controls]
          [kicker]
          [headline]
          [support / highlights]
          [primary action] [optional secondary]
```

## Preview implementation notes

- Each preview entry starts on its assigned frame and does not autoplay. The visible play control can start the seven-second cycle; hover and keyboard focus pause it. Manual slide navigation stops autoplay, and reduced motion disables autoplay and transitions.
- Controls have 44px touch targets, accessible slide names, keyboard focus, and swipe navigation.
- Original user uploads remain untouched. The preview copies are metadata-stripped WebP: marketplace desktop **185,954 bytes**, mobile **49,062 bytes**; service-pillar desktop **115,364 bytes**, mobile **40,654 bytes**. Mobile variants use portrait crops centred on the people.
- The extracted `Current.tsx`, `_baseline.css`, and `_group.css` remain untouched; all carousel styling is scoped to this group.

## Temporary sandbox limitations

These are isolated React previews, not the full Next integration. Server-rendered slide HTML, `next/image`, priority and responsive image delivery, blurred placeholders, production deferred loading, and Lighthouse before/after measurements remain integration checks. The parent owns preview screenshots and canvas lifecycle; do not merge this work into the application until the user approves the previews.
