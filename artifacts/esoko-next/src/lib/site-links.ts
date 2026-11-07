/**
 * Link mapping between the migrated Next.js preview and the existing Esoko site.
 *
 * Migrated routes (/, /resources*, /careers* and homepage anchors such as
 * "/#solutions") are returned already prefixed with the Next.js basePath, so
 * they can be used as literal <a href> values. Do NOT pass the result to
 * next/link (that would double-prefix). Every other site path is left as an
 * existing-site root path, e.g. "/company#team" or "/admin/login?role=hr".
 */
export const NEXT_BASE_PATH = "/esoko-next";

/** Contact/demo flow stays on the existing website. */
export const EXISTING_CONTACT_HREF = "/#contact";

function isMigratedPath(path: string): boolean {
  return (
    path === "/" ||
    path === "/resources" || path.startsWith("/resources/") ||
    path === "/careers" || path.startsWith("/careers/")
  );
}

export function siteHref(href: string): string {
  // External URLs, protocol-relative URLs, mailto/tel and bare "#anchor" pass through.
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  if (href === NEXT_BASE_PATH || href.startsWith(NEXT_BASE_PATH + "/")) return href;

  const match = /^([^?#]*)(\?[^#]*)?(#.*)?$/.exec(href);
  const path = match?.[1] || "/";
  const query = match?.[2] ?? "";
  const hash = match?.[3] ?? "";

  if (!isMigratedPath(path)) return href;
  const withSlash = path.endsWith("/") ? path : path + "/";
  return NEXT_BASE_PATH + withSlash + query + hash;
}

/** Normalise a Next pathname (basePath-free) for active-state comparisons. */
export function normalizeSitePath(pathname: string | null | undefined): string {
  if (!pathname) return "/";
  const trimmed = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return trimmed || "/";
}
