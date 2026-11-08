import { ASSET_BASE } from "../CompanyData";

/** All 12 user-confirmed images. No inferred identities or new consent. */
export const COMPANY_GALLERY_IMAGES = [
  { id: "market", src: `${ASSET_BASE}/about-hero.jpg`, alt: "A market trader and an Esoko representative look at a tablet beside fresh produce.", caption: "Connecting in the marketplace", category: "Field work", existing: true, position: "50% 50%" },
  { id: "tablet", src: `${ASSET_BASE}/company-gallery/tablet-in-agricultural-input-shop.webp`, alt: "Over-the-shoulder view of a tablet in an agricultural input shop.", caption: "Technology at work", category: "Technology", existing: false, position: "50% 50%" },
  { id: "maize", src: `${ASSET_BASE}/company-gallery/hands-holding-maize-kernels.webp`, alt: "Cupped hands holding pale maize kernels.", caption: "A closer look at maize", category: "Agriculture", existing: false, position: "50% 50%" },
  { id: "team", src: `${ASSET_BASE}/about-team.jpg`, alt: "The Esoko team standing together outside the Farmer Terminal.", caption: "The people behind the work", category: "Team & communities", existing: true, position: "50% 50%" },
  { id: "field", src: `${ASSET_BASE}/hero-slide-1.jpg`, alt: "People looking at mobile devices in a maize field, with an overlaid phone screen.", caption: "Mobile technology in the field", category: "Field work", existing: true, position: "50% 42%" },
  { id: "meeting", src: `${ASSET_BASE}/hero-slide-4.jpg`, alt: "People talking across a table inside an Esoko-branded space.", caption: "Conversations in the community", category: "Team & communities", existing: true, position: "50% 45%" },
  { id: "registration", src: `${ASSET_BASE}/hero-slide-2.jpg`, alt: "Esoko promotional graphic combining a team using devices with survey and registration illustrations.", caption: "Survey and registration services — promotional graphic", category: "Technology", existing: true, position: "50% 50%" },
  { id: "helpline", src: `${ASSET_BASE}/hero-slide-3.jpg`, alt: "Staff working at computers in the Esoko helpline office.", caption: "At the Esoko helpline", category: "Team & communities", existing: true, position: "50% 50%" },
  { id: "bottles", src: `${ASSET_BASE}/company-gallery/agricultural-input-bottles-on-shelves.webp`, alt: "Shelves displaying agricultural input bottles.", caption: "Inside an agricultural input shop", category: "Agriculture", existing: false, position: "50% 50%" },
  { id: "sprayers", src: `${ASSET_BASE}/company-gallery/sprayers-and-inputs-in-farm-shop.webp`, alt: "Boxed sprayers and agricultural supplies on shop shelves.", caption: "Tools for the growing season", category: "Agriculture", existing: false, position: "50% 50%" },
  { id: "products", src: `${ASSET_BASE}/company-gallery/agricultural-products-and-input-shop-shelves.webp`, alt: "Agricultural input bottles, bags and products arranged on shelving.", caption: "Supplies on the shelves", category: "Agriculture", existing: false, position: "50% 50%" },
  { id: "phone", src: `${ASSET_BASE}/company-gallery/feature-phone-weather-alert-example.webp`, alt: "Product graphic of a feature phone displaying an Esoko weather-alert SMS.", caption: "A weather-alert SMS example", category: "Technology", existing: false, position: "50% 50%" },
];

export type GalleryImage = (typeof COMPANY_GALLERY_IMAGES)[number];
