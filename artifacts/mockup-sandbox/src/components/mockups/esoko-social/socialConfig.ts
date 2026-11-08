/**
 * Local preview configuration. Destinations are the exact URLs requested for
 * this mockup; keep them here rather than coupling them to the component.
 */
export const SOCIAL_LINKS = [
  {
    name: "Facebook",
    context: "Life in the field",
    href: "https://www.facebook.com/EsokoNews",
  },
  {
    name: "Instagram",
    context: "Life in the field",
    href: "https://www.instagram.com/esoko_news",
  },
  {
    name: "LinkedIn",
    context: "Company news and stories",
    href: "https://www.linkedin.com/company/1402657",
  },
  {
    name: "X",
    context: "Updates and announcements",
    href: "https://x.com/Esoko",
  },
  {
    name: "YouTube",
    context: "Videos from Esoko",
    href: "https://www.youtube.com/user/esokonetworks",
  },
] as const;

export type SocialPlatform = (typeof SOCIAL_LINKS)[number]["name"];
