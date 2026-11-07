import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { getResources, getTaxonomy, type ResourceSearch } from "@/lib/resource-api";
import { ResourceBrowser } from "@/components/resources/ResourceViews";

export function generateMetadata(): Metadata {
  return pageMetadata("Resources | Esoko",
    "Explore Esoko insights, events, podcasts, webinars, research and customer stories.", "/resources");
}

export default async function ResourcesPage({ searchParams }: { searchParams: Promise<ResourceSearch> }) {
  const search = await searchParams;
  const [data, taxonomy] = await Promise.all([getResources(search), getTaxonomy()]);
  return <ResourceBrowser data={data} {...taxonomy} search={search} />;
}
