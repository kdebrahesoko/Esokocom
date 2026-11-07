import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { notFound } from "next/navigation";
import { getResources, getTaxonomy, type ResourceSearch } from "@/lib/resource-api";
import { TYPE_LABELS } from "@/lib/resources";
import { isPublicType } from "@/lib/resource-urls";
import { ResourceBrowser } from "@/components/resources/ResourceViews";

type Props = { params: Promise<{ type: string }>; searchParams: Promise<ResourceSearch> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params;
  if (!isPublicType(type)) notFound();
  return pageMetadata(`${TYPE_LABELS[type]} | Esoko Resources`,
    `Explore Esoko ${TYPE_LABELS[type].toLowerCase()} and agricultural insights.`, `/resources/${type}`);
}
export default async function ResourceTypePage({ params, searchParams }: Props) {
  const [{ type }, search] = await Promise.all([params, searchParams]);
  if (!isPublicType(type)) notFound();
  const [data, taxonomy] = await Promise.all([getResources(search, type), getTaxonomy()]);
  return <ResourceBrowser data={data} {...taxonomy} search={search} type={type} />;
}
