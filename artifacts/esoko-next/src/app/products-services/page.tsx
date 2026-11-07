import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/page-metadata';
import { ProductsServicesPage } from '@/components/offering/ProductsServicesPage';
import { PRODUCTS_SERVICES_TITLE, PRODUCTS_SERVICES_DESCRIPTION, PRODUCTS_HERO_DISPLAY_IMAGE } from '@/data/products-services';
import '../home.css';

export function generateMetadata(): Metadata {
  return pageMetadata(PRODUCTS_SERVICES_TITLE, PRODUCTS_SERVICES_DESCRIPTION, '/products-services', PRODUCTS_HERO_DISPLAY_IMAGE);
}

export default function Page() {
  return <ProductsServicesPage />;
}
