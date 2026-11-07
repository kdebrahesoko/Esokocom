import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getJob, getJobs } from "@/lib/careers-api";
import { jobMetadata, jobJsonLd } from "@/lib/careers-metadata";
import { CareerDetail } from "@/components/careers/CareersViews";
type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getJob((await params).id);
  if (!job) notFound();
  return jobMetadata(job);
}
export default async function JobPage({ params }: Props) {
  const job = await getJob((await params).id);
  if (!job) notFound();
  const jobs = await getJobs();
  const json = jobJsonLd(job);
  return <>
    {json && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />}
    <CareerDetail job={job} related={jobs.filter(j => j.id !== job.id && j.department === job.department).slice(0, 3)} />
  </>;
}
