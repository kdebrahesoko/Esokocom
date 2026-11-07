import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { getResources, getTaxonomy, type ResourceSearch } from "@/lib/resource-api";
import { ResourceBrowser } from "@/components/resources/ResourceViews";
import { CATEGORY_CARDS, type TypeCounts } from "@/components/resources/ResourcesParity";

export function generateMetadata(): Metadata {
  return pageMetadata("Resources | Esoko",
    "Explore Esoko insights, events, podcasts, webinars, research and customer stories.", "/resources");
}

export default async function ResourcesPage({ searchParams }: { searchParams: Promise<ResourceSearch> }) {
  const search = await searchParams;
  const [data, taxonomy, counts] = await Promise.all([getResources(search), getTaxonomy(), getTypeCounts()]);
  return <ResourceBrowser data={data} {...taxonomy} search={search} counts={counts} />;
}

/** Counts use published-only fetching; failures reach the existing error boundary. */
async function getTypeCounts(): Promise<TypeCounts> {
  const totals = await Promise.all(CATEGORY_CARDS.map(async ({ slug }) =>
    [slug, (await getResources({}, slug)).total] as const,
  ));
  return Object.fromEntries(totals);
}
