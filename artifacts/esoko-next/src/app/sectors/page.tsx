import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/page-metadata';
import { SectorsPage } from '@/components/offering/SectorsPage';
import { SECTORS_HERO_IMAGE } from '@/data/sectors';
import { SECTORS_PAGE_TITLE, SECTORS_PAGE_DESCRIPTION } from '@/data/sectors-page';
import '../home.css';

// SectorStories performs a live no-store publication check.
export const dynamic = 'force-dynamic';

export function generateMetadata(): Metadata {
  return pageMetadata(SECTORS_PAGE_TITLE, SECTORS_PAGE_DESCRIPTION, '/sectors', SECTORS_HERO_IMAGE);
}

export default function Page() {
  return <SectorsPage />;
}
