import type { Metadata } from "next";
import { getResources, getTaxonomy, type ResourceSearch } from "@/lib/resource-api";
import { ResourceBrowser } from "@/components/resources/ResourceViews";

export const metadata: Metadata = {
  title: "Resources | Esoko",
  description: "Explore Esoko insights, events, podcasts, webinars, research and customer stories.",
};

export default async function ResourcesPage({ searchParams }: { searchParams: Promise<ResourceSearch> }) {
  const search = await searchParams;
  const [data, taxonomy] = await Promise.all([getResources(search), getTaxonomy()]);
  return <ResourceBrowser data={data} {...taxonomy} search={search} />;
}
