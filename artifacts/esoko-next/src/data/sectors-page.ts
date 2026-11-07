// Copied from artifacts/esoko-website/src/pages/SectorsPage.tsx.
import { MapPin, Database, BarChart2, ShieldCheck } from 'lucide-react';

export const SECTORS_PAGE_TITLE = 'Sectors | Esoko — Digital Solutions Built for Real-World Impact';
export const SECTORS_PAGE_DESCRIPTION = 'Explore Esoko digital solutions for agriculture, government, development, education, climate, finance, energy and supply chains across Africa.';

export const OPERATING_CONTEXTS = [
  {
    label: 'Last-mile agriculture',
    title: 'Tools that keep working beyond reliable connectivity',
    description: 'Offline data collection, mobile delivery, messaging and local-language content help programmes reach people where they work.',
    position: 'left-[20%] top-[30%]',
  },
  {
    label: 'National programmes',
    title: 'A connected view of complex public programmes',
    description: 'Registration, field operations, communication and reporting can work as one coordinated digital system.',
    position: 'right-[16%] top-[38%]',
  },
  {
    label: 'Climate resilience',
    title: 'Field evidence for climate-aware decisions',
    description: 'Location data, monitoring and analytics support teams working across agriculture, resilience and environmental programmes.',
    position: 'right-[24%] bottom-[20%]',
  },
  {
    label: 'Rural services',
    title: 'People, services and markets in one flow',
    description: 'Profiles, communications and field data make it easier to connect rural communities with services and opportunities.',
    position: 'left-[25%] bottom-[14%]',
  },
] as const;

export const IMPACT_PROOF = [
  { value: '5M+', label: 'Farmers reached' },
  { value: '40+', label: 'Countries served' },
  { value: '500M+', label: 'Messages delivered' },
  { value: '18+', label: 'Years of field experience' },
] as const;

export const UNIVERSAL_CAPABILITIES = [
  { icon: MapPin, title: 'Built for the Last Mile', desc: 'Designed for challenging connectivity and real-world field environments. Fully offline capable.' },
  { icon: Database, title: 'Data at Scale', desc: 'Capture and manage massive volumes of field data with complex organizational hierarchies.' },
  { icon: BarChart2, title: 'AI & Intelligence', desc: 'Turn raw field data into actionable insights with built-in analytics and predictive models.' },
  { icon: ShieldCheck, title: 'Secure by Design', desc: 'Role-aware workflows and scalable platform foundations for complex institutional programmes.' },
];
