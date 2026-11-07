import "server-only";
import type { Metadata } from "next";
import sanitizeHtml from "sanitize-html";
import type { ResourceDetail } from "./resources";
import { resourceImage } from "./resource-urls";

export function publicOrigin(): string {
  const value = process.env.ESOKO_PUBLIC_SITE_URL ??
    (process.env.NODE_ENV !== "production" && process.env.REPLIT_DEV_DOMAIN
      ? `https://${process.env.REPLIT_DEV_DOMAIN}` : undefined);
  if (!value) throw new Error("ESOKO_PUBLIC_SITE_URL must be configured for production Resources metadata.");
  const url = new URL(value);
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) {
    throw new Error("ESOKO_PUBLIC_SITE_URL must be a public HTTP(S) origin without credentials.");
  }
  return url.origin;
}

export function resourceDescription(resource: ResourceDetail): string {
  return sanitizeHtml(resource.seoDescription || resource.shortDescription || resource.body || resource.title, {
    allowedTags: [], allowedAttributes: {},
  }).replace(/\s+/g, " ").trim().slice(0, 200);
}

export function resourceCanonical(type: string, slug: string): string {
  return new URL(`/esoko-next/resources/${type}/${encodeURIComponent(slug)}/`, publicOrigin()).href;
}

export function resourceMetadata(resource: ResourceDetail, type: string): Metadata {
  const title = resource.seoTitle || resource.title;
  const description = resourceDescription(resource);
  const image = new URL(resourceImage(resource.featuredImageUrl), publicOrigin()).href;
  const url = resourceCanonical(type, resource.slug);
  return {
    title, description,
    robots: { index: false, follow: false },
    alternates: { canonical: url },
    openGraph: {
      title, description, url, siteName: "Esoko", type: "article",
      images: [{ url: image, alt: resource.title }],
      ...(resource.publishedAt ? { publishedTime: resource.publishedAt } : {}),
      modifiedTime: resource.updatedAt,
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export function articleJsonLd(resource: ResourceDetail, type: string): string {
  return JSON.stringify({
    "@context": "https://schema.org", "@type": "Article",
    headline: resource.title, description: resourceDescription(resource),
    image: [new URL(resourceImage(resource.featuredImageUrl), publicOrigin()).href],
    mainEntityOfPage: resourceCanonical(type, resource.slug),
    ...(resource.publishedAt ? { datePublished: resource.publishedAt } : {}),
    dateModified: resource.updatedAt,
    publisher: { "@type": "Organization", name: "Esoko" },
  }).replace(/</g, "\\u003c");
}

export function sanitizedResourceBody(body: string | null): string {
  return sanitizeHtml(body ?? "", {
    allowedTags: ["p", "br", "b", "strong", "i", "em", "u", "s", "h1", "h2", "h3", "h4",
      "h5", "h6", "ul", "ol", "li", "blockquote", "a", "img", "pre", "code", "table",
      "thead", "tbody", "tr", "th", "td", "hr", "figure", "figcaption"],
    allowedAttributes: { a: ["href", "title", "target", "rel"], img: ["src", "alt", "width", "height", "title"] },
    allowedSchemes: ["https", "http", "mailto"],
    allowedSchemesByTag: { img: ["https", "http"] },
    allowProtocolRelative: false,
    transformTags: { a: (_tag, attrs) => ({ tagName: "a", attribs: { ...attrs, rel: "noopener noreferrer" } }) },
  });
}
