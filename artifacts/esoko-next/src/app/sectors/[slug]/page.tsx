import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { pageMetadata } from '@/lib/page-metadata';
import { SectorDetailPage } from '@/components/offering/SectorDetailPage';
import { getSectorBySlug } from '@/data/sectors';
import '../../home.css';

// SectorStories performs a live no-store publication check.
export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sector = getSectorBySlug(slug);
  if (!sector) return {};
  return pageMetadata(`${sector.name} Solutions | Esoko`, sector.seoDescription, `/sectors/${sector.slug}`, sector.heroImage);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const sector = getSectorBySlug(slug);
  if (!sector) notFound();
  return <SectorDetailPage sector={sector} />;
}
