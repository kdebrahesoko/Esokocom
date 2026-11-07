import "server-only";
import { cache } from "react";
import type { ListResponse, ResourceCategory, ResourceDetail, ResourceTag } from "./resources";
import { PUBLIC_TYPE_TO_API } from "./resources";
import { isPublicType } from "./resource-urls";

const REVALIDATE_SECONDS = 60;

function apiUrl(path: string): string {
  const base = process.env.ESOKO_INTERNAL_API_BASE_URL;
  if (!base) throw new Error("ESOKO_INTERNAL_API_BASE_URL must be configured for server-side Resources.");
  const url = new URL(base);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
    throw new Error("The internal API base must be an HTTP(S) URL without credentials.");
  }
  return new URL(path, base.endsWith("/") ? base : `${base}/`).href;
}

async function request<T>(path: string, live = false): Promise<T | null> {
  const response = await fetch(apiUrl(path), {
    ...(live ? { cache: "no-store" as const } : { next: { revalidate: REVALIDATE_SECONDS } }),
    credentials: "omit",
    redirect: "error",
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(15_000),
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Public Resources API returned HTTP ${response.status}.`);
  return response.json() as Promise<T>;
}

export type ResourceSearch = Record<string, string | string[] | undefined>;
export function first(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export function listingQuery(search: ResourceSearch, type?: string): URLSearchParams {
  const q = new URLSearchParams({ limit: "12" });
  const page = Number(first(search.page));
  q.set("page", String(Number.isSafeInteger(page) && page > 0 ? Math.min(page, 10000) : 1));
  for (const name of ["search", "category", "tag"]) {
    const value = first(search[name]).trim().slice(0, 200);
    if (value) q.set(name, value);
  }
  if (type === "webinars" && ["upcoming", "live", "on-demand"].includes(first(search.webinarStatus))) {
    q.set("webinarStatus", first(search.webinarStatus));
  }
  return q;
}

export async function getResources(search: ResourceSearch, type?: string): Promise<ListResponse> {
  const apiType = type ? PUBLIC_TYPE_TO_API[type] : undefined;
  if (type && !isPublicType(type)) throw new Error("Unknown public resource type.");
  const path = `resources${apiType ? `/${apiType}` : ""}?${listingQuery(search, type)}`;
  // Content cache refreshes on a timer; live membership prevents stale unpublished cards.
  const [cached, live] = await Promise.all([
    request<ListResponse>(path),
    request<ListResponse>(path, true),
  ]);
  if (!cached || !live || !Array.isArray(live.resources) || !Array.isArray(cached.resources)) {
    throw new Error("Invalid public Resources listing response.");
  }
  const current = new Map(live.resources.filter(r => r.status === "Published").map(r => [r.id, r]));
  return {
    ...live,
    resources: cached.resources.filter(r =>
      r.status === "Published" && current.get(r.id)?.slug === r.slug,
    ),
  };
}

// React cache is request-scoped: metadata and the page share the same publication check.
export const getResource = cache(async (type: string, slug: string): Promise<ResourceDetail | null> => {
  const apiType = PUBLIC_TYPE_TO_API[type];
  if (!isPublicType(type)) return null;
  const path = `resources/${apiType}/${encodeURIComponent(slug)}`;
  const live = await request<{ resource: ResourceDetail }>(path, true);
  if (!live || live.resource?.status !== "Published") return null;
  const cached = await request<{ resource: ResourceDetail }>(path);
  if (!cached || cached.resource?.status !== "Published" || cached.resource.id !== live.resource.id) {
    return live.resource;
  }
  return cached.resource;
});

export async function getTaxonomy() {
  const [categories, tags] = await Promise.all([
    request<{ categories: ResourceCategory[] }>("resource-categories"),
    request<{ tags: ResourceTag[] }>("resource-tags"),
  ]);
  if (!categories || !tags) throw new Error("Public Resources taxonomy unavailable.");
  return { categories: categories.categories, tags: tags.tags };
}

export async function getAdjacent(type: string, slug: string) {
  type Adjacent = { title: string; slug: string };
  return request<{ prev: Adjacent | null; next: Adjacent | null }>(
    `resources/${PUBLIC_TYPE_TO_API[type]}/${encodeURIComponent(slug)}/adjacent`, true,
  );
}
