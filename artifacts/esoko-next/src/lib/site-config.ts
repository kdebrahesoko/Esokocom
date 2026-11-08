/** Public organisation profiles supplied and approved by Esoko. */
export const SITE_SOCIAL_LINKS = [
  { name: "Facebook", context: "Life in the field", href: "https://www.facebook.com/EsokoNews" },
  { name: "Instagram", context: "Life in the field", href: "https://www.instagram.com/esoko_news" },
  { name: "LinkedIn", context: "Company news and stories", href: "https://www.linkedin.com/company/1402657" },
  { name: "X", context: "Updates and announcements", href: "https://x.com/Esoko" },
  { name: "YouTube", context: "Videos from Esoko", href: "https://www.youtube.com/user/esokonetworks" },
] as const;

export type SocialPlatform = (typeof SITE_SOCIAL_LINKS)[number]["name"];

/** Public issue-reporting portal; shared by desktop and mobile Resources menus. */
export const ISSUE_REPORTING_URL = "https://issues.esoko.com/";
