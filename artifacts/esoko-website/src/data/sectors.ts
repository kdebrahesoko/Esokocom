import { 
  Wheat, Building2, Heart, Sprout, CreditCard, Globe2, Briefcase, GraduationCap,
  ClipboardList, BookOpen, MessageSquare, LineChart, BarChart2, Smartphone, MapPin, TabletSmartphone, Users, Truck
} from 'lucide-react';
import type { ComponentType } from 'react';

import imgAgriculture from '@assets/sector-agriculture.webp';
import imgGovernment from '@assets/sector-government.webp';
import imgNgos from '@assets/sector-ngos.webp';
import imgEducation from '@assets/sector-education.webp';
import imgSustainability from '@assets/sector-sustainability.webp';
import imgFinancialInclusion from '@assets/sector-financial-inclusion.webp';
import imgRenewableEnergy from '@assets/sector-renewable-energy.webp';
import imgSupplyChain from '@assets/sector-supply-chain.webp';

export interface SectorData {
  id: string;
  slug: string;
  name: string;
  category: 'Public Sector' | 'Private Sector';
  headline: string;
  description: string;
  heroImage: string;
  imageAlt: string;
  icon: ComponentType<{ className?: string }>;
  audience: string[];
  useCases: string[];
  capabilities: { name: string; icon: ComponentType<{ className?: string }> }[];
  statistics: { value: string; label: string }[];
  featured: boolean;
  cta: string;
  seoTitle: string;
  seoDescription: string;
}

export const SECTORS_DATA: SectorData[] = [
  {
    id: 'agriculture',
    slug: 'agriculture',
    name: 'Agriculture',
    category: 'Public Sector',
    headline: 'Digital Agriculture From Farm to Market',
    description: 'Support smallholder and commercial farmers with digital tools that improve access to agricultural information, markets, services, and data.',
    heroImage: imgAgriculture,
    imageAlt: 'Two African farmers reviewing agricultural information together on a smartphone in a field',
    icon: Wheat,
    audience: ['Smallholder Farmers', 'Commercial Farmers', 'Agribusinesses', 'Farmer Organizations'],
    useCases: [
      'Farmer registration',
      'Digital farmer profiling',
      'Agricultural advisory',
      'Weather information',
      'Market price information',
      'Digital extension',
      'Data collection',
      'Market linkages',
      'Field monitoring'
    ],
    capabilities: [
      { name: 'Insyt Survey', icon: ClipboardList },
      { name: 'E-Content', icon: BookOpen },
      { name: 'Messaging', icon: MessageSquare },
      { name: 'Market Intelligence', icon: LineChart },
      { name: 'AI & Analytics', icon: BarChart2 },
      { name: 'Mobile & Web Platforms', icon: Smartphone }
    ],
    statistics: [
      { value: '2M+', label: 'Farmers Reached' },
      { value: '18+', label: 'Years of Experience' },
      { value: '58', label: 'Value Chains' }
    ],
    featured: true,
    cta: 'Explore Agriculture Solutions',
    seoTitle: 'Digital Agriculture Solutions | Esoko',
    seoDescription: 'Support smallholder and commercial farmers with digital tools that improve access to agricultural information, markets, services, and data.'
  },
  {
    id: 'government',
    slug: 'government',
    name: 'Government',
    category: 'Public Sector',
    headline: 'Digital Infrastructure for National Programmes',
    description: 'Help governments manage large-scale agricultural, social protection, rural development, and public service programmes with reliable digital platforms and real-time data.',
    heroImage: imgGovernment,
    imageAlt: 'Esoko team members meeting with public-sector programme leaders around a conference table',
    icon: Building2,
    audience: ['Ministries of Agriculture', 'Social Protection Agencies', 'Local Government', 'National Statistics'],
    useCases: [
      'National farmer registration',
      'Beneficiary management',
      'Social protection',
      'Programme monitoring',
      'Field agent management',
      'Surveys',
      'Government communication',
      'GIS mapping',
      'Real-time reporting'
    ],
    capabilities: [
      { name: 'Insyt Survey', icon: ClipboardList },
      { name: 'Data Intelligence', icon: BarChart2 },
      { name: 'GIS', icon: MapPin },
      { name: 'Messaging', icon: MessageSquare },
      { name: 'Analytics', icon: LineChart },
      { name: 'Field Deployment', icon: Users }
    ],
    statistics: [
      { value: '10+', label: 'Countries' },
      { value: '150+', label: 'Programmes' },
      { value: '18+', label: 'Years of Experience' }
    ],
    featured: true,
    cta: 'Explore Government Solutions',
    seoTitle: 'Digital Infrastructure for Governments | Esoko',
    seoDescription: 'Help governments manage large-scale agricultural and social protection programmes with reliable digital platforms.'
  },
  {
    id: 'ngos-development',
    slug: 'ngos-development',
    name: 'NGOs & Development',
    category: 'Public Sector',
    headline: 'Technology for Measurable Development Impact',
    description: 'Enable development organizations to collect reliable data, manage beneficiaries, monitor programmes, communicate with communities, and measure impact at scale.',
    heroImage: imgNgos,
    imageAlt: 'Esoko field team members collaborating during a community programme visit',
    icon: Heart,
    audience: ['International NGOs', 'Development Agencies', 'Local NGOs', 'Foundations'],
    useCases: [
      'Beneficiary registration',
      'Monitoring & Evaluation',
      'Surveys',
      'Impact assessments',
      'Field monitoring',
      'Last-mile communication',
      'Programme management',
      'Digital payments',
      'Community engagement'
    ],
    capabilities: [
      { name: 'Insyt', icon: ClipboardList },
      { name: 'Messaging', icon: MessageSquare },
      { name: 'Field Deployment', icon: Users },
      { name: 'Analytics', icon: BarChart2 },
      { name: 'Data Collection', icon: TabletSmartphone },
      { name: 'AI', icon: LineChart }
    ],
    statistics: [
      { value: '150+', label: 'Programmes' },
      { value: '2M+', label: 'Farmers Reached' },
      { value: '10+', label: 'Countries' }
    ],
    featured: true,
    cta: 'Explore Development Solutions',
    seoTitle: 'Technology for Development Impact | Esoko',
    seoDescription: 'Enable development organizations to manage beneficiaries and measure impact at scale with digital tools.'
  },
  {
    id: 'education',
    slug: 'education',
    name: 'Education',
    category: 'Public Sector',
    headline: 'Digital Learning That Reaches the Last Mile',
    description: 'Deliver agricultural training, extension services, digital learning, and practical knowledge to communities regardless of location or connectivity.',
    heroImage: imgEducation,
    imageAlt: 'Community members taking part in an outdoor agricultural training session',
    icon: GraduationCap,
    audience: ['Extension Agents', 'Trainers', 'Educational Institutions', 'Community Leaders'],
    useCases: [
      'Agricultural extension',
      'Digital training',
      'E-learning',
      'Mobile learning',
      'Offline content',
      'Farmer education',
      'Community training',
      'Knowledge dissemination'
    ],
    capabilities: [
      { name: 'E-Content', icon: BookOpen },
      { name: 'Messaging', icon: MessageSquare },
      { name: 'Mobile Platforms', icon: Smartphone },
      { name: 'Voice', icon: MessageSquare },
      { name: 'SMS', icon: MessageSquare },
      { name: 'Offline Content', icon: TabletSmartphone }
    ],
    statistics: [
      { value: '45+', label: 'Local Languages' },
      { value: '2M+', label: 'Active Subscribers' },
      { value: '18+', label: 'Years of Experience' }
    ],
    featured: false,
    cta: 'Explore Education Solutions',
    seoTitle: 'Digital Learning and Extension | Esoko',
    seoDescription: 'Deliver agricultural training and practical knowledge to communities regardless of location or connectivity.'
  },
  {
    id: 'sustainability',
    slug: 'sustainability',
    name: 'Sustainability & Climate',
    category: 'Private Sector',
    headline: 'Technology for a More Resilient Future',
    description: 'Use digital technology, climate intelligence, field data, and monitoring tools to support sustainable agriculture and climate resilience.',
    heroImage: imgSustainability,
    imageAlt: 'Two field workers planting a young tree during a sustainability activity',
    icon: Sprout,
    audience: ['Climate Projects', 'Carbon Developers', 'Sustainable Agribusiness', 'Conservation Orgs'],
    useCases: [
      'Climate-smart agriculture',
      'Carbon project monitoring',
      'Farmer enrolment',
      'Environmental monitoring',
      'Climate alerts',
      'GIS',
      'MRV',
      'Sustainability reporting'
    ],
    capabilities: [
      { name: 'GIS', icon: MapPin },
      { name: 'AI & Analytics', icon: BarChart2 },
      { name: 'Mobile Data Collection', icon: TabletSmartphone },
      { name: 'Climate Intelligence', icon: LineChart },
      { name: 'Field Monitoring', icon: Users }
    ],
    statistics: [
      { value: '58', label: 'Value Chains' },
      { value: '10+', label: 'Countries' },
      { value: '18+', label: 'Years of Experience' }
    ],
    featured: true,
    cta: 'Explore Sustainability Solutions',
    seoTitle: 'Sustainability & Climate Solutions | Esoko',
    seoDescription: 'Support sustainable agriculture and climate resilience with digital technology and field monitoring tools.'
  },
  {
    id: 'financial-inclusion',
    slug: 'financial-inclusion',
    name: 'Financial Inclusion',
    category: 'Private Sector',
    headline: 'Bringing Financial Services Closer to Rural Communities',
    description: 'Enable financial institutions and development programmes to reach underserved communities with digital data, farmer profiles, communication, credit, and insurance solutions.',
    heroImage: imgFinancialInclusion,
    imageAlt: 'Woman farmer standing in a cultivated field with a hoe over her shoulder',
    icon: CreditCard,
    audience: ['Microfinance Institutions', 'Banks', 'Insurance Providers', 'FinTechs'],
    useCases: [
      'Digital farmer identity',
      'KYC',
      'Credit programmes',
      'Insurance',
      'Digital payments',
      'Financial education',
      'Beneficiary management',
      'Risk assessment'
    ],
    capabilities: [
      { name: 'Farmer Data', icon: ClipboardList },
      { name: 'Mobile', icon: Smartphone },
      { name: 'Messaging', icon: MessageSquare },
      { name: 'Analytics', icon: BarChart2 },
      { name: 'Digital Identity', icon: Users },
      { name: 'Field Operations', icon: MapPin }
    ],
    statistics: [
      { value: '2M+', label: 'Farmers Reached' },
      { value: '10+', label: 'Countries' },
      { value: '18+', label: 'Years of Experience' }
    ],
    featured: true,
    cta: 'Explore Financial Inclusion',
    seoTitle: 'Digital Financial Inclusion | Esoko',
    seoDescription: 'Reach underserved communities with digital data, credit, and insurance solutions.'
  },
  {
    id: 'renewable-energy',
    slug: 'renewable-energy',
    name: 'Renewable Energy',
    category: 'Private Sector',
    headline: 'Accelerating Clean Energy Adoption',
    description: 'Support organizations deploying renewable energy solutions by tracking beneficiaries, installations, adoption, field activities, and programme outcomes.',
    heroImage: imgRenewableEnergy,
    imageAlt: 'Field technology and weather monitoring equipment installed in an African farming landscape',
    icon: Globe2,
    audience: ['Solar Providers', 'Energy NGOs', 'Rural Electrification Agencies'],
    useCases: [
      'Solar adoption tracking',
      'Household registration',
      'Asset tracking',
      'Field surveys',
      'Installation monitoring',
      'Beneficiary management',
      'Impact measurement',
      'GIS mapping'
    ],
    capabilities: [
      { name: 'Insyt Survey', icon: ClipboardList },
      { name: 'GIS', icon: MapPin },
      { name: 'Mobile', icon: Smartphone },
      { name: 'Analytics', icon: BarChart2 },
      { name: 'Field Deployment', icon: Users }
    ],
    statistics: [
      { value: '150+', label: 'Programmes' },
      { value: '10+', label: 'Countries' },
      { value: '18+', label: 'Years of Experience' }
    ],
    featured: false,
    cta: 'Explore Renewable Energy',
    seoTitle: 'Renewable Energy Tracking | Esoko',
    seoDescription: 'Track beneficiaries and installations for renewable energy solutions across rural Africa.'
  },
  {
    id: 'supply-chain',
    slug: 'supply-chain',
    name: 'Supply Chain',
    category: 'Private Sector',
    headline: 'From Farm to Market With Greater Visibility',
    description: 'Connect producers, aggregators, buyers, field agents, and organizations through digital data and traceability.',
    heroImage: imgSupplyChain,
    imageAlt: 'Field worker presenting locally produced organic compost beside a cultivated plot',
    icon: Briefcase,
    audience: ['Agribusinesses', 'Commodity Traders', 'Processors', 'Exporters'],
    useCases: [
      'Farmer traceability',
      'Product aggregation',
      'Field monitoring',
      'Commodity tracking',
      'Quality assurance',
      'Market linkage',
      'Inventory',
      'Delivery tracking'
    ],
    capabilities: [
      { name: 'Marketplace', icon: Truck },
      { name: 'GIS', icon: MapPin },
      { name: 'Farmer Data', icon: ClipboardList },
      { name: 'Mobile', icon: Smartphone },
      { name: 'Analytics', icon: BarChart2 },
      { name: 'Digital Commerce', icon: CreditCard }
    ],
    statistics: [
      { value: '58', label: 'Value Chains' },
      { value: '2M+', label: 'Farmers Reached' },
      { value: '10+', label: 'Countries' }
    ],
    featured: true,
    cta: 'Explore Supply Chain Solutions',
    seoTitle: 'Agricultural Supply Chain Traceability | Esoko',
    seoDescription: 'Connect producers and buyers with digital data and farm-to-market traceability.'
  }
];
