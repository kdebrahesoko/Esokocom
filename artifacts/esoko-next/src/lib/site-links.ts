/**
 * Link mapping between the migrated Next.js preview and the existing Esoko site.
 *
 * Migrated routes (/, /resources*, /careers* and homepage anchors such as
 * "/#solutions") are returned already prefixed with the Next.js basePath, so
 * they can be used as literal <a href> values. Do NOT pass the result to
 * next/link (that would double-prefix). Every other site path is left as an
 * existing-site root path, e.g. "/company#team" or "/admin/login?role=hr".
 */
/** Switchover controls: all legacy-site navigation must use this map. */
export const SITE_ROUTES = {
  previewBasePath: "/esoko-next",
  existingSiteBase: "",
  migratedPrefixes: ["/", "/resources", "/careers", "/company"] as readonly string[],
};
export const NEXT_BASE_PATH = SITE_ROUTES.previewBasePath;

export function existingSiteHref(path: string): string {
  return `${SITE_ROUTES.existingSiteBase}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Contact/demo flow stays on the existing website. */
export const EXISTING_CONTACT_HREF = existingSiteHref("/#contact");

function isMigratedPath(path: string): boolean {
  return SITE_ROUTES.migratedPrefixes.some(prefix =>
    path === prefix || (prefix !== "/" && path.startsWith(`${prefix}/`)));
}

export function siteHref(href: string): string {
  if (href === "/#contact") return EXISTING_CONTACT_HREF;
  // External URLs, protocol-relative URLs, mailto/tel and bare "#anchor" pass through.
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  if (href === NEXT_BASE_PATH || href.startsWith(NEXT_BASE_PATH + "/")) return href;

  const match = /^([^?#]*)(\?[^#]*)?(#.*)?$/.exec(href);
  const path = match?.[1] || "/";
  const query = match?.[2] ?? "";
  const hash = match?.[3] ?? "";

  if (path === "/api" || path.startsWith("/api/")) return href;
  if (!isMigratedPath(path)) return existingSiteHref(href);
  const withSlash = path.endsWith("/") ? path : path + "/";
  return NEXT_BASE_PATH + withSlash + query + hash;
}

/** Normalise a Next pathname (basePath-free) for active-state comparisons. */
export function normalizeSitePath(pathname: string | null | undefined): string {
  if (!pathname) return "/";
  const trimmed = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return trimmed || "/";
}
