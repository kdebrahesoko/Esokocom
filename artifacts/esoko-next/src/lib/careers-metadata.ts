import "server-only";
import type { Metadata } from "next";
import type { PublicJob } from "./careers";
import { deadlineDate, jobIsExpired } from "./careers";
import { publicOrigin } from "./resource-metadata";

export function jobMetadata(job: PublicJob): Metadata {
  const title = job.seoTitle || `${job.title} | Esoko Careers`;
  const description = (job.seoDescription || job.about).replace(/\s+/g, " ").slice(0, 200);
  const url = new URL(`/esoko-next/careers/${encodeURIComponent(job.id)}/`, publicOrigin()).href;
  const image = new URL("/esoko-next/resources-fallback.jpg", publicOrigin()).href;
  return {
    title, description, robots: { index: false, follow: false },
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "Esoko", type: "website", images: [{ url: image, alt: "Esoko" }] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export function jobJsonLd(job: PublicJob): string | null {
  const date = job.publishedAt || job.createdAt;
  // Free-text locations cannot reliably supply a structured postal address.
  // Emit only supported facts; do not invent salary currency or remote eligibility.
  if (jobIsExpired(job) || !date || Number.isNaN(Date.parse(date))) return null;
  const types: Record<string, string> = { "Full Time": "FULL_TIME", Contract: "CONTRACTOR", Internship: "INTERN", Graduate: "OTHER" };
  const description = [
    job.about, "Responsibilities", ...job.responsibilities,
    "Requirements", ...job.requirements, "Nice to have", ...job.niceToHave,
  ].map(s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")).join("<br>");
  return JSON.stringify({
    "@context": "https://schema.org", "@type": "JobPosting",
    title: job.title, description, datePosted: date,
    identifier: { "@type": "PropertyValue", name: "Esoko", value: job.id },
    hiringOrganization: { "@type": "Organization", name: "Esoko" },
    jobLocation: { "@type": "Place", name: job.location },
    ...(types[job.type] ? { employmentType: types[job.type] } : {}),
    ...(deadlineDate(job.deadline) ? { validThrough: deadlineDate(job.deadline) } : {}),
    url: new URL(`/esoko-next/careers/${encodeURIComponent(job.id)}/`, publicOrigin()).href,
  }).replace(/</g, "\\u003c");
}
