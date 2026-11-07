import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { getJobs } from "@/lib/careers-api";
import { CareersLanding } from "@/components/careers/parity/CareersLanding";
export function generateMetadata(): Metadata {
  return pageMetadata("Careers | Esoko", "Explore published opportunities with Esoko across technology, agriculture and operations.", "/careers");
}
type Search = Record<string, string | string[] | undefined>;
export default async function CareersPage({ searchParams }: { searchParams: Promise<Search> }) {
  const [jobs, search] = await Promise.all([getJobs(), searchParams]);
  return <CareersLanding jobs={jobs} search={search} />;
}
