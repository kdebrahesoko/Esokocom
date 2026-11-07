import { API_TYPE_TO_PUBLIC } from "./resources";
import type { ResourceListItem } from "./resources";

export function isPublicType(type: string): boolean {
  return ["blog", "events", "podcasts", "webinars", "research", "customer-stories", "reports", "guides"].includes(type);
}

export function resourceHref(resource: Pick<ResourceListItem, "typeSlug" | "slug">) {
  return `/resources/${API_TYPE_TO_PUBLIC[resource.typeSlug] ?? "blog"}/${encodeURIComponent(resource.slug)}/`;
}

export function safePublicUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

export function resourceImage(value: string | null | undefined): string {
  if (!value) return "/esoko-next/resources-fallback.jpg";
  const safe = safePublicUrl(value);
  if (safe) return safe;
  // Object-storage keys, not arbitrary URL schemes.
  if (!value.includes(":") && !value.startsWith("//")) {
    return `/api/storage/public-objects/${value.split("/").map(encodeURIComponent).join("/")}`;
  }
  return "/esoko-next/resources-fallback.jpg";
}
