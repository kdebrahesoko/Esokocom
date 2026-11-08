import "server-only";
import type { Metadata } from "next";
import { publicOrigin } from "./resource-metadata";
import { siteHref } from "./site-links";
import { SITE_SOCIAL_LINKS } from "./site-config";

export function pageMetadata(title: string, description: string, path: string, image = "/esoko-next/resources-fallback.jpg"): Metadata {
  const origin = publicOrigin();
  const url = new URL(siteHref(path), origin).href;
  const imageUrl = new URL(image, origin).href;
  return {
    title, description, robots: { index: false, follow: false },
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", siteName: "Esoko", images: [{ url: imageUrl, alt: "Esoko" }] },
    twitter: { card: "summary_large_image", title, description, images: [imageUrl] },
  };
}

/** Organization facts only; personal profile URLs are not organization sameAs. */
export function organizationJsonLd(): string {
  const origin = publicOrigin();
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Esoko",
    logo: new URL(`${siteHref("/")}site-assets/esoko-logo.png`, origin).href,
    url: new URL(siteHref("/"), origin).href,
    sameAs: SITE_SOCIAL_LINKS.map(profile => profile.href),
  }).replace(/</g, "\\u003c");
}
