import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getResource, getResources, getAdjacent } from "@/lib/resource-api";
import { articleJsonLd, resourceMetadata, sanitizedResourceBody, resourceCanonical } from "@/lib/resource-metadata";
import { ResourceArticle } from "@/components/resources/ResourceViews";

type Props = { params: Promise<{ type: string; slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type, slug } = await params;
  const resource = await getResource(type, slug);
  if (!resource) notFound();
  return resourceMetadata(resource, type);
}
export default async function ResourceDetailPage({ params }: Props) {
  const { type, slug } = await params;
  const resource = await getResource(type, slug);
  if (!resource) notFound();
  const [related, adjacent] = await Promise.all([getResources({}, type), getAdjacent(type, slug)]);
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleJsonLd(resource, type) }} />
    <ResourceArticle resource={resource} type={type}
      bodyHtml={sanitizedResourceBody(resource.body)}
      canonicalUrl={resourceCanonical(type, slug)}
      related={related.resources.filter(r => r.id !== resource.id).slice(0, 3)} adjacent={adjacent} />
  </>;
}
