import type { Metadata } from "next";
import { getJobs } from "@/lib/careers-api";
import { CareersListing } from "@/components/careers/CareersViews";
export const metadata: Metadata = {
  title: "Careers | Esoko", description: "Explore published opportunities with Esoko across technology, agriculture and operations.",
};
type Search = Record<string, string | string[] | undefined>;
export default async function CareersPage({ searchParams }: { searchParams: Promise<Search> }) {
  const [jobs, search] = await Promise.all([getJobs(), searchParams]);
  return <CareersListing jobs={jobs} search={search} />;
}
