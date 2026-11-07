import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { pageMetadata } from '@/lib/page-metadata';
import { SolutionPage } from '@/components/offering/SolutionPage';
import { SOLUTIONS_DATA, getSolutionBySlug } from '@/data/solutions';
import '../../home.css';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return SOLUTIONS_DATA.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);
  if (!solution) return {};
  return pageMetadata(`Esoko ${solution.name} | ${solution.tagline}`, solution.description, `/solutions/${solution.slug}`);
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const solution = getSolutionBySlug(slug);
  if (!solution) notFound();
  return <SolutionPage solution={solution} />;
}
