// Copied from artifacts/esoko-website/src/pages/ProductsServicesPage.tsx (data + inline arrays).
import {
  Globe, Smartphone, BarChart2, Users, ShoppingCart, MessageSquare, BookOpen,
  ClipboardList, Cloud, Brain, Wifi, Database, Layers, Phone, Radio, Mic,
  CloudRain, Thermometer, Apple, DollarSign, Bell, MapPin, Code, Satellite,
} from 'lucide-react';

export const PRODUCTS_SERVICES_TITLE = 'Products & Services | Esoko — Agricultural Technology Platform';
export const PRODUCTS_SERVICES_DESCRIPTION = 'Explore Esoko\'s complete product ecosystem — Insyt & Survey, Push Messaging, E Content, and Esoko Marketplace — alongside professional services for deployments, software development, and agricultural advisory.';
export const PRODUCTS_HERO_IMAGE = 'https://images.unsplash.com/photo-1595547802775-6ac58ff5dc9e?w=1600&auto=format&fit=crop&q=80';
// The original source URL returned 404 on 2026-11-07. Preserve it above for
// traceability, but use an existing Esoko field photo for display/social cards.
export const PRODUCTS_HERO_DISPLAY_IMAGE = '/esoko-next/site-assets/sector-agriculture.webp';
export const PRODUCTS_CTA_IMAGE = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1600&auto=format&fit=crop&q=80';

export const PRODUCTS = [
  {
    id: 'insyt',
    name: 'Insyt & Survey',
    category: 'Data Collection Platform',
    desc: 'AI-powered field operations and data collection — from GPS-tagged farm boundaries to biometric beneficiary registration and offline-first mobile surveys.',
    url: 'https://insyt-survey.esoko.com/',
    icon: ClipboardList,
    color: '#0B4D2E',
    bg: 'from-[#0B4D2E] to-[#1a6b40]',
    features: ['Offline data collection', 'GPS farm boundaries', 'Biometric verification', 'AI validation', 'Real-time dashboards', 'M&E frameworks'],
    badge: 'Powered by Insyt',
  },
  {
    id: 'push',
    name: 'Push Messaging',
    category: 'Multi-channel Communications',
    desc: 'Reach millions of farmers instantly via SMS, Voice-SMS, IVR, USSD, and WhatsApp — even on feature phones with zero data, in 45+ local languages.',
    url: 'https://push.esoko.com/',
    icon: MessageSquare,
    color: '#7c2d12',
    bg: 'from-[#7c2d12] to-[#9a3412]',
    features: ['Bulk SMS campaigns', 'Voice-SMS & IVR', 'USSD short codes', 'WhatsApp Business', 'Emergency alerts', 'Segmented targeting'],
    badge: 'Powered by Push',
  },
  {
    id: 'econtent',
    name: 'E Content',
    category: 'Agricultural Advisory',
    desc: 'Personalized weather forecasts, crop advisories, market intelligence, and nutrition guidance delivered to every farmer — at the right moment in their season.',
    url: 'https://content-web.esoko.com/',
    icon: BookOpen,
    color: '#166534',
    bg: 'from-[#14532d] to-[#166534]',
    features: ['Hyper-local weather', 'Climate-smart advice', 'Market price alerts', 'Nutrition guidance', 'Pest & disease alerts', 'Multilingual delivery'],
    badge: 'Powered by E Content',
  },
  {
    id: 'marketplace',
    name: 'Esoko Marketplace',
    category: 'Digital Trade Platform',
    desc: 'A verified digital marketplace connecting smallholder farmers directly to buyers, aggregators, and input suppliers — with integrated logistics and digital payments.',
    url: 'https://marketplace.esoko.com/',
    icon: ShoppingCart,
    color: '#1e3a5f',
    bg: 'from-[#1e3a5f] to-[#1d4ed8]',
    features: ['Direct farmer-to-buyer', 'Verified seller profiles', 'Logistics coordination', 'Digital payments', 'Live market prices', 'Quality assurance'],
    badge: 'Powered by Marketplace',
  },
];
export type Product = typeof PRODUCTS[number];

export const SOFTWARE_SERVICES = [
  { icon: Smartphone, title: 'Mobile & Web Data Collection', desc: 'Custom offline-first apps for any data collection programme — built on the Insyt & Survey engine.' },
  { icon: Brain, title: 'AI & Analytics', desc: 'Predictive models, satellite monitoring, yield forecasting, and natural-language dashboards tailored to your data.' },
  { icon: CloudRain, title: 'Climate-Smart Agronomy', desc: 'Season-specific advisory content generation, weather integration, and climate risk scoring for outgrower programmes.' },
  { icon: BarChart2, title: 'Market Pricing Information', desc: 'Real-time price collection, validation, and dissemination systems — from field to farmer in minutes.' },
  { icon: Phone, title: 'Call Center Services', desc: 'IVR flows, agent scripting, and farmer helpdesk infrastructure — powered by Push Messaging.' },
];

export const MESSAGING_CHANNELS = [
  { icon: MessageSquare, label: 'SMS', desc: 'Targeted text messages with 95%+ delivery rate' },
  { icon: Mic,            label: 'Voice-SMS', desc: 'Pre-recorded audio in any local language' },
  { icon: Phone,          label: 'IVR', desc: 'Interactive voice response, no data required' },
  { icon: Radio,          label: 'USSD', desc: 'Keypad menus on any feature phone' },
];

export const CONTENT_CATEGORIES = [
  { icon: CloudRain, label: 'Weather Forecasts' },
  { icon: Thermometer, label: 'Climate-Smart Farming' },
  { icon: Apple, label: 'Nutrition & Health' },
  { icon: DollarSign, label: 'Financial Literacy' },
  { icon: Globe, label: 'Gender & Social Inclusion' },
  { icon: BarChart2, label: 'Market Intelligence' },
  { icon: Bell, label: 'Pest & Disease Alerts' },
];

/** Declared in source but not rendered there; kept for catalog parity. */
export const TECH_CHIPS = [
  'Mobile-first', 'Offline-ready', 'Cloud-native', 'AI-powered',
  'GIS & Mapping', 'Analytics', 'Multi-channel Messaging',
  'REST APIs', 'Data Intelligence', 'Satellite Monitoring',
  'Biometrics', 'Open Standards',
];

export const ECOSYSTEM_NODES = [
  { label: 'Insyt & Survey',   angle: -60,  color: '#0B4D2E', icon: ClipboardList },
  { label: 'Push Messaging',   angle: 0,    color: '#7c2d12', icon: MessageSquare },
  { label: 'E Content',        angle: 60,   color: '#166534', icon: BookOpen },
  { label: 'Marketplace',      angle: 120,  color: '#1e3a5f', icon: ShoppingCart },
  { label: 'AI & Analytics',   angle: 180,  color: '#0369a1', icon: BarChart2 },
  { label: 'Field Operations', angle: -120, color: '#7e22ce', icon: MapPin },
];

export const HERO_STATS = [
  { val: '4', label: 'Live Platforms' },
  { val: '40+', label: 'Countries' },
  { val: '5M+', label: 'Farmers Reached' },
  { val: '18 yrs', label: 'Trusted Since 2006' },
];

export const ECOSYSTEM_FLOWS = [
  'Farmer registered in Insyt → instantly reachable via Push Messaging',
  'Survey data → feeds AI analytics without manual export',
  'Market prices from Marketplace → power E Content advisories',
  'Deployment outcomes → tracked in real-time dashboards',
];

export const PROFESSIONAL_SERVICES = [
  { label: 'Deployments', sub: 'Coordinate Field Agents', icon: Users, power: null },
  { label: 'Software Development', sub: '5 specialist service areas', icon: Code, power: null },
  { label: 'Messaging Services', sub: 'Managed push campaigns', icon: MessageSquare, power: 'Push' },
  { label: 'Content Services', sub: 'Editorial & advisory delivery', icon: BookOpen, power: 'E Content' },
];

export const DEPLOYMENT_FEATURES = ['Enumerator coordination', 'GPS agent tracking', 'Attendance management', 'Performance scoring', 'Impact evaluations', 'Automated alerts'];

export const MESSAGING_SERVICE_FEATURES = ['500M+ messages delivered', '95%+ SMS delivery rate', '45+ languages supported', '10-minute campaign setup'];

export const ARCHITECTURE_LAYERS = [
  {
    layer: 'Data Collection',
    color: '#0B4D2E',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    items: [
      { icon: Smartphone,  label: 'Mobile-first Apps' },
      { icon: Globe,       label: 'Progressive Web Apps' },
      { icon: Wifi,        label: 'Offline-ready Sync' },
      { icon: MapPin,      label: 'GIS & Mapping' },
    ],
  },
  {
    layer: 'Intelligence',
    color: '#0369a1',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    items: [
      { icon: Brain,       label: 'AI & ML Models' },
      { icon: Satellite,   label: 'Satellite Monitoring' },
      { icon: BarChart2,   label: 'Predictive Analytics' },
      { icon: Database,    label: 'Data Intelligence' },
    ],
  },
  {
    layer: 'Delivery',
    color: '#7c2d12',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    items: [
      { icon: MessageSquare, label: 'Multi-channel Messaging' },
      { icon: Code,          label: 'REST APIs' },
      { icon: Cloud,         label: 'Cloud-native' },
      { icon: Layers,        label: 'Open Standards' },
    ],
  },
];
