# Esoko field-photo hero — design plan

**Direction:** human field-documentary, restrained editorial composition. The real working scene is the memorable element; quiet typography and one small orange signal keep the interface credible rather than turning the photo into a software backdrop.

**Tokens:** inherit the extracted Esoko scope unchanged: Inter for body copy, Plus Jakarta Sans for headings, white text over the photograph, and the approved darker orange `#C0570C` for the primary CTA only. The CTA color is used as a local mapping and is not a global theme change.

**Layout:** full-bleed photograph under the existing fixed 84px shared header. On desktop, a left-aligned text column sits in the lower-left portion of the frame, below the workers’ faces. On narrow screens, the image is deliberately center-cropped around the central field worker; the face stays above the message, which is anchored near the bottom with a dark local gradient.

```text
1440 × 1000                         360 × 1100
┌─────────────────────────┐         ┌───────────┐
│      shared header      │         │  header   │
│  workers / field scene  │         │ central   │
│                         │         │ face      │
│ text ──────     phone   │         │           │
│ CTA                     │         │ text      │
└─────────────────────────┘         │ CTAs      │
                                    └───────────┘
```

**Contrast and motion:** white copy is placed over a deep, directional charcoal-green overlay with an opaque-enough lower text zone; orange is reserved for the button, where white label contrast is 4.56:1. One short text-group entrance uses opacity and transform only and is disabled for reduced motion.

**Review before build:** the desktop column must not sit over faces, while a 360px crop cannot preserve all three people and remain legible. Favour the central worker’s face above the mobile message, keep the photo full bleed, and use the original photo’s embedded phone inset only where the desktop crop naturally shows it. No added imagery or claims.
