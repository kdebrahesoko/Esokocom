import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/page-metadata';
import { PricingPage } from '@/components/offering/PricingPage';
import { TITLE, DESC } from '@/data/pricing';
import '../home.css';

export function generateMetadata(): Metadata {
  return pageMetadata(TITLE, DESC, '/pricing');
}

export default function Page() {
  return <PricingPage />;
}
