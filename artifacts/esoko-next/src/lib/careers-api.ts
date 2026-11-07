import "server-only";
import { cache } from "react";
import type { PublicJob } from "./careers";

async function get<T>(path: string): Promise<T | null> {
  const base = process.env.ESOKO_INTERNAL_API_BASE_URL;
  if (!base) throw new Error("ESOKO_INTERNAL_API_BASE_URL is required for Careers.");
  const origin = new URL(base);
  if (!["http:", "https:"].includes(origin.protocol) || origin.username || origin.password) {
    throw new Error("Internal API base must be an HTTP(S) URL without credentials.");
  }
  // Jobs can close at any time. Do not cache vacancy availability or application questions.
  const response = await fetch(new URL(path, base.endsWith("/") ? base : `${base}/`), {
    cache: "no-store", credentials: "omit", redirect: "error",
    headers: { Accept: "application/json" }, signal: AbortSignal.timeout(15000),
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Public Careers API returned HTTP ${response.status}.`);
  return response.json() as Promise<T>;
}

function projectJob(raw: PublicJob): PublicJob {
  // Explicit projection: omit staff IDs and all other backend-only fields.
  return {
    id: raw.id, slug: raw.slug, title: raw.title, department: raw.department,
    location: raw.location, type: raw.type, experience: raw.experience,
    featured: raw.featured, about: raw.about, responsibilities: raw.responsibilities,
    requirements: raw.requirements, niceToHave: raw.niceToHave, skills: raw.skills,
    benefits: raw.benefits, salaryRange: raw.salaryRange, deadline: raw.deadline,
    applicationQuestions: raw.applicationQuestions, seoTitle: raw.seoTitle,
    seoDescription: raw.seoDescription, status: raw.status,
    publishedAt: raw.publishedAt, createdAt: raw.createdAt, updatedAt: raw.updatedAt,
  };
}

export const getJobs = cache(async (): Promise<PublicJob[]> => {
  const data = await get<{ jobs: PublicJob[] }>("jobs");
  if (!data || !Array.isArray(data.jobs)) throw new Error("Invalid public jobs response.");
  return data.jobs.filter(job => job.status === "Published").map(projectJob);
});

export const getJob = cache(async (id: string): Promise<PublicJob | null> => {
  if (!id || id.length > 200 || !/^[a-zA-Z0-9_-]+$/.test(id)) return null;
  const data = await get<{ job: PublicJob }>(`jobs/${encodeURIComponent(id)}`);
  return data?.job?.status === "Published" ? projectJob(data.job) : null;
});
