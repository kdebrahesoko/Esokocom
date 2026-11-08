const existingBase = "/__mockup/images/esoko-gallery-existing";
const approvedBase = "/__mockup/images/esoko-approved";

/** Exact source gallery records; retained for the extracted Current baseline. */
export const ORIGINAL_GALLERY_IMAGES = [
  { src: `${existingBase}/about-hero.jpg`, alt: "Esoko field agent interacting with a market trader", category: "FIELD WORK" },
  { src: `${existingBase}/about-team.jpg`, alt: "Esoko team at the Farmer Terminal", category: "TECHNOLOGY" },
  { src: `${existingBase}/hero-slide-4.jpg`, alt: "Farmer using mobile technology in the field", category: "FARMERS" },
  { src: `${existingBase}/hero-slide-1.jpg`, alt: "Field team surveying agricultural land", category: "FIELD WORK" },
  { src: `${existingBase}/hero-slide-2.jpg`, alt: "Digital biometric registration of beneficiaries", category: "IMPACT" },
  { src: `${existingBase}/hero-slide-3.jpg`, alt: "Esoko Farmer Helpline call center serving rural communities", category: "COMMUNITIES" },
];

/** All 12 user-confirmed images. No inferred identities or new consent. */
export const CONFIRMED_IMAGES = [
  { id: "market", src: `${existingBase}/about-hero.jpg`, alt: "A market trader and an Esoko representative look at a tablet beside fresh produce.", caption: "Connecting in the marketplace", category: "Field work", existing: true, position: "50% 50%" },
  { id: "tablet", src: `${approvedBase}/tablet-in-agricultural-input-shop.webp`, alt: "Over-the-shoulder view of a tablet in an agricultural input shop.", caption: "Technology at work", category: "Technology", existing: false, position: "50% 50%" },
  { id: "maize", src: `${approvedBase}/hands-holding-maize-kernels.webp`, alt: "Cupped hands holding pale maize kernels.", caption: "A closer look at maize", category: "Agriculture", existing: false, position: "50% 50%" },
  { id: "team", src: `${existingBase}/about-team.jpg`, alt: "The Esoko team standing together outside the Farmer Terminal.", caption: "The people behind the work", category: "Team & communities", existing: true, position: "50% 50%" },
  { id: "field", src: `${existingBase}/hero-slide-1.jpg`, alt: "People looking at mobile devices in a maize field, with an overlaid phone screen.", caption: "Mobile technology in the field", category: "Field work", existing: true, position: "50% 42%" },
  { id: "meeting", src: `${existingBase}/hero-slide-4.jpg`, alt: "People talking across a table inside an Esoko-branded space.", caption: "Conversations in the community", category: "Team & communities", existing: true, position: "50% 45%" },
  { id: "registration", src: `${existingBase}/hero-slide-2.jpg`, alt: "Esoko promotional graphic combining a team using devices with survey and registration illustrations.", caption: "Survey and registration services — promotional graphic", category: "Technology", existing: true, position: "50% 50%" },
  { id: "helpline", src: `${existingBase}/hero-slide-3.jpg`, alt: "Staff working at computers in the Esoko helpline office.", caption: "At the Esoko helpline", category: "Team & communities", existing: true, position: "50% 50%" },
  { id: "bottles", src: `${approvedBase}/agricultural-input-bottles-on-shelves.webp`, alt: "Shelves displaying agricultural input bottles.", caption: "Inside an agricultural input shop", category: "Agriculture", existing: false, position: "50% 50%" },
  { id: "sprayers", src: `${approvedBase}/sprayers-and-inputs-in-farm-shop.webp`, alt: "Boxed sprayers and agricultural supplies on shop shelves.", caption: "Tools for the growing season", category: "Agriculture", existing: false, position: "50% 50%" },
  { id: "products", src: `${approvedBase}/agricultural-products-and-input-shop-shelves.webp`, alt: "Agricultural input bottles, bags and products arranged on shelving.", caption: "Supplies on the shelves", category: "Agriculture", existing: false, position: "50% 50%" },
  { id: "phone", src: `${approvedBase}/feature-phone-weather-alert-example.webp`, alt: "Product graphic of a feature phone displaying an Esoko weather-alert SMS.", caption: "A weather-alert SMS example", category: "Technology", existing: false, position: "50% 50%" },
];
