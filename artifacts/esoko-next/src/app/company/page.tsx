import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/page-metadata';
import { CompanyPage } from '@/components/company/CompanyPage';
import '../home.css';
import './company.css';

export function generateMetadata(): Metadata {
  return pageMetadata(
    'About Esoko — Empowering Farmers. Restoring Earth.',
    'Since 2008, Esoko has been building digital solutions that connect people, data and services to create meaningful impact across Africa.',
    '/company',
    '/esoko-next/site-assets/about-hero.jpg',
  );
}

export default function Page() {
  return <CompanyPage />;
}
