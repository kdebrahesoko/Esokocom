/** No face-flagged originals are approved. This is the complete image allowlist. */
export const approvedPhotos = {
  tablet: "/__mockup/images/esoko-approved/tablet-in-agricultural-input-shop.webp",
  inputs: "/__mockup/images/esoko-approved/agricultural-input-bottles-on-shelves.webp",
  shelves: "/__mockup/images/esoko-approved/agricultural-products-and-input-shop-shelves.webp",
  sprayers: "/__mockup/images/esoko-approved/sprayers-and-inputs-in-farm-shop.webp",
  maize: "/__mockup/images/esoko-approved/hands-holding-maize-kernels.webp",
  phone: "/__mockup/images/esoko-approved/feature-phone-weather-alert-example.webp",
} as const;
export const logo = "/__mockup/images/esoko-approved/esoko-logo.png";
/**
 * Verbatim excerpt of the existing Marketplace-page quote. This is source
 * attribution, not independent verification or a newly collected testimonial.
 * Source: artifacts/esoko-website/src/data/solutions.ts, Marketplace quote.
 * Do not associate the anonymous hands/tablet photographs with the speaker.
 */
export const farmerVoice = {
  quote: "Now I compare prices from four buyers and choose the best deal.",
  name: "Mariama Diallo",
  role: "Smallholder Maize Farmer",
  location: "Northern Region, Ghana",
  sourceLabel: "From Esoko’s Marketplace story",
  href: "/esoko-next/solutions/marketplace/",
} as const;
