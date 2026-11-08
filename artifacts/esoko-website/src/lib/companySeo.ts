// Production origin verified through deployment information. Keep all absolute
// About-page URLs together so a future domain change has one source of truth.
export const SITE_URL = 'https://esokocom.replit.app';
export const COMPANY_TITLE = "About Esoko | Africa's Digital Agriculture Platform";
export const COMPANY_DESCRIPTION = 'Meet Esoko, a Ghana-based AgriTech company building digital agriculture platforms, farmer advisory and data services for organisations across Africa since 2008.';
export const COMPANY_URL = `${SITE_URL}/company`;
export const COMPANY_META = [
  ['name', 'description', COMPANY_DESCRIPTION],
  ['property', 'og:title', COMPANY_TITLE],
  ['property', 'og:description', COMPANY_DESCRIPTION],
  ['property', 'og:type', 'website'],
  ['property', 'og:image', `${SITE_URL}/hero-slide-1.jpg`],
  ['property', 'og:url', COMPANY_URL],
  ['name', 'twitter:card', 'summary_large_image'],
  ['name', 'twitter:title', COMPANY_TITLE],
  ['name', 'twitter:description', COMPANY_DESCRIPTION],
  ['name', 'twitter:image', `${SITE_URL}/hero-slide-1.jpg`],
] as const;

export const COMPANY_ORGANIZATION = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Esoko',
  foundingDate: '2008',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'GH',
  },
  url: SITE_URL,
  logo: `${SITE_URL}/esoko-logo.png`,
};
