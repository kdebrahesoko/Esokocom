import { NEXT_BASE_PATH } from "@/lib/site-links";

export type HeroImage = { src: string; alt: string; blurDataURL: string; mobile?: { src: string; width: number; height: number } };

// Metadata-stripped, consented photography. Tiny WebP placeholders are generated offline.
export const heroImages: HeroImage[] = [
  { src: `${NEXT_BASE_PATH}/site-assets/home/hero-field.webp`, alt: "Three people looking at a handheld device in a maize field.", blurDataURL: "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAADwAQCdASoMAAgABABoJbACdAELW4+X74AA+GPLY3cqNfupTQnquQ1ThcnQYbBeOwFbNl1cnlksN6eF7N4PORjR0ihrz2HT3NxHs8Q9GUAAAA==" },
  { src: `${NEXT_BASE_PATH}/site-assets/home/marketplace-desktop.webp`, alt: "Esoko team members standing together at the Esoko Farmer Terminal.", blurDataURL: "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACwAQCdASoMAAgABABoJQBOgB5vdqIAAP7npjDTO9rxbDfX0wMPAZynNJc7H4wt+dR/4XGGtG/aeAhMPBzCKZw+ACZ07sIAyVkAAA==", mobile: { src: `${NEXT_BASE_PATH}/site-assets/home/marketplace-mobile.webp`, width: 720, height: 1200 } },
  { src: `${NEXT_BASE_PATH}/site-assets/home/service-pillars-desktop.webp`, alt: "Esoko call centre staff supporting customers with headsets.", blurDataURL: "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAADQAQCdASoMAAgABABoJQBOgButjVozhgDOMKMzWDY3jZliVVgiIVnQrcN296uqWxBhCIytp3jdyr6qfSYW0mYz9k3mWCSUYAA=", mobile: { src: `${NEXT_BASE_PATH}/site-assets/home/service-pillars-mobile.webp`, width: 720, height: 1200 } },
];
