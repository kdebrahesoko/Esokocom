import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { pageMetadata } from '@/lib/page-metadata';
import { SolutionPage } from '@/components/offering/SolutionPage';
import { SOLUTIONS_DATA, getSolutionBySlug } from '@/data/solutions';
import { MarketplacePage } from '@/components/offering/marketplace/MarketplacePage';
import { MARKETPLACE_TITLE, MARKETPLACE_DESCRIPTION } from '@/components/offering/marketplace/marketplace-content';
import { NEXT_BASE_PATH } from '@/lib/site-links';
import '../../home.css';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SOLUTIONS_DATA.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);
  if (!solution) return {};
  if (slug === 'marketplace') {
    return pageMetadata(`Esoko Marketplace | ${MARKETPLACE_TITLE}`, MARKETPLACE_DESCRIPTION,
      '/solutions/marketplace', `${NEXT_BASE_PATH}/site-assets/marketplace/marketplace-social.webp`);
  }
  return pageMetadata(`Esoko ${solution.name} | ${solution.tagline}`, solution.description, `/solutions/${solution.slug}`);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);
  if (!solution) notFound();
  if (slug === 'marketplace') return <MarketplacePage />;
  return <SolutionPage solution={solution} />;
}
