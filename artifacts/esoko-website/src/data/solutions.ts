import {
  ClipboardList,
  FileSearch,
  MessageSquare,
  BookOpen,
  Users,
  ShoppingCart,
  Smartphone,
  BarChart2,
  MapPin,
  Fingerprint,
  WifiOff,
  CheckCircle2,
  Layers,
  Bell,
  PieChart,
  Target,
  Phone,
  Radio,
  Send,
  Mic,
  CloudRain,
  Apple,
  DollarSign,
  Thermometer,
  GraduationCap,
  Navigation,
  CalendarDays,
  Star,
  TrendingUp,
  ShieldCheck,
  Truck,
  CreditCard,
  LineChart,
  Brain,
  Eye,
  Satellite,
  Globe,
  FileBarChart,
  Zap,
  ScanBarcode,
  Camera,
  PenLine,
  Layout,
  Monitor,
  TabletSmartphone,
  PackageCheck,
  Handshake,
} from 'lucide-react';

export interface SolutionFeature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}

export interface SolutionUseCase {
  title: string;
  description: string;
  sector: string;
}

export interface SolutionStat {
  value: string;
  label: string;
}

export interface SolutionQuote {
  text: string;
  author: string;
  role: string;
  org: string;
}

export interface SolutionData {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  heroGradient: string;
  accentColor: string;
  icon: React.ComponentType<{ className?: string }>;
  stats: SolutionStat[];
  features: SolutionFeature[];
  useCases: SolutionUseCase[];
  quote: SolutionQuote;
  mockupLabel: string;
  mockupColor: string;
}

export const SOLUTIONS_DATA: SolutionData[] = [
  {
    slug: 'insyt',
    name: 'Insyt',
    tagline: 'Intelligent Field Operations Platform',
    description:
      'Insyt transforms how organizations register, profile, and manage beneficiaries in the field. From digital household surveys to GPS-tagged farm boundaries, Insyt turns paper-based chaos into real-time intelligence — even without internet connectivity.',
    heroGradient: 'from-[#0B4D2E] via-[#1a6b40] to-[#0B4D2E]',
    accentColor: 'var(--color-brand)',
    icon: ClipboardList,
    stats: [
      { value: '4M+', label: 'Farmers Profiled' },
      { value: '98%', label: 'Data Accuracy' },
      { value: '60%', label: 'Faster Registration' },
      { value: '30+', label: 'Countries Deployed' },
    ],
    features: [
      {
        icon: ClipboardList,
        title: 'Digital Beneficiary Profiling',
        desc: 'Build rich farmer and household profiles with custom fields, photos, and biometric data. Replace paper registers with structured digital records accessible across your organization.',
      },
      {
        icon: MapPin,
        title: 'GPS Farm Boundary Capture',
        desc: 'Walk farm perimeters to capture precise GPS polygons. Automatically calculate acreage, detect overlaps, and generate farm maps — all from a mobile device.',
      },
      {
        icon: Fingerprint,
        title: 'Biometric Verification',
        desc: 'Fingerprint and facial recognition prevent duplicate registrations and ghost beneficiaries. Ensure every subsidy, input, or payment reaches a verified individual.',
      },
      {
        icon: WifiOff,
        title: 'Fully Offline Operation',
        desc: 'Field agents work without connectivity. Data syncs automatically when signal returns, supporting operations in the most remote agricultural regions.',
      },
      {
        icon: CheckCircle2,
        title: 'AI-Powered Data Validation',
        desc: 'Smart validation rules catch errors at point of entry. AI flags inconsistencies, outliers, and duplicate records before they enter your database.',
      },
      {
        icon: BarChart2,
        title: 'Real-time Dashboards',
        desc: 'Monitor field progress in real time. See registrations by location, agent, or date — with drill-down into individual records and exportable reports.',
      },
      {
        icon: Layers,
        title: 'Beneficiary Management',
        desc: 'Manage ongoing relationships with registered beneficiaries. Track interventions, disbursements, and outcomes across the entire programme lifecycle.',
      },
      {
        icon: Target,
        title: 'Project Monitoring & M&E',
        desc: 'Set targets, track milestones, and generate impact reports. Built-in M&E frameworks align with USAID, World Bank, and IFAD reporting standards.',
      },
    ],
    useCases: [
      {
        title: 'National Farmer Registry',
        description:
          'A Ministry of Food and Agriculture deployed Insyt to register 1.2 million smallholder farmers across all 16 regions. GPS farm boundaries enabled input subsidy targeting that reduced leakage by 40%.',
        sector: 'Government',
      },
      {
        title: 'NGO Beneficiary Management',
        description:
          'An international development organization used Insyt to profile 200,000 rural women across five countries, tracking household income, food security scores, and programme participation in one unified system.',
        sector: 'NGO / Development',
      },
      {
        title: 'Agribusiness Supplier Registry',
        description:
          'A large cocoa aggregator digitized their outgrower management, capturing GPS farm polygons and biometrics for 85,000 farmers — enabling traceable, Rainforest Alliance–certified supply chains.',
        sector: 'Private Sector',
      },
    ],
    quote: {
      text: 'Insyt gave us a single source of truth for our 500,000 registered farmers. We can now target interventions with GPS precision and produce audit-ready reports in hours, not weeks.',
      author: 'Kofi Mensah',
      role: 'Director, Extension Services',
      org: 'Ghana Ministry of Food and Agriculture',
    },
    mockupLabel: 'Farmer Registry Dashboard',
    mockupColor: '#0B4D2E',
  },
  {
    slug: 'survey',
    name: 'Survey',
    tagline: 'AI-powered Data Collection at Scale',
    description:
      'Build and deploy sophisticated surveys, assessments, and monitoring forms in minutes — no coding required. Esoko Survey works offline, supports multimedia capture, and delivers live analytics as data flows in from the field.',
    heroGradient: 'from-[#075985] via-[#0369a1] to-[#075985]',
    accentColor: '#0369a1',
    icon: FileSearch,
    stats: [
      { value: '50M+', label: 'Surveys Completed' },
      { value: '150+', label: 'Form Templates' },
      { value: '99.5%', label: 'Sync Reliability' },
      { value: '72hrs', label: 'Avg. Deploy Time' },
    ],
    features: [
      {
        icon: FileSearch,
        title: 'Drag-and-Drop Form Builder',
        desc: 'Design complex surveys with skip logic, validation rules, and branching — all through an intuitive visual editor. No technical skills required.',
      },
      {
        icon: WifiOff,
        title: 'Offline Data Collection',
        desc: 'Enumerators collect data in areas with zero connectivity. Forms, lookup tables, and media sync automatically when signal is restored.',
      },
      {
        icon: MapPin,
        title: 'GPS Location Capture',
        desc: 'Automatically record GPS coordinates with every submission. Map responses geographically and validate that surveys were conducted at the correct location.',
      },
      {
        icon: Camera,
        title: 'Photos & Video Evidence',
        desc: 'Attach photos, videos, and audio recordings directly to form responses. Document conditions, crop diseases, or infrastructure state with visual evidence.',
      },
      {
        icon: PenLine,
        title: 'Digital Signatures',
        desc: 'Collect witnessed and participant signatures on-device. Legally binding digital consent and acknowledgment built into any form.',
      },
      {
        icon: ScanBarcode,
        title: 'Barcode & QR Scanning',
        desc: 'Scan product barcodes, beneficiary ID cards, or asset tags to pre-populate form fields. Eliminate manual data entry errors at the point of collection.',
      },
      {
        icon: PieChart,
        title: 'Live Analytics Dashboard',
        desc: 'Watch results populate your dashboard in real time. Filter, cross-tabulate, and visualize responses as they arrive — with export to Excel, CSV, and Power BI.',
      },
      {
        icon: Brain,
        title: 'AI-assisted Analysis',
        desc: 'AI summarizes open-text responses, detects sentiment, and surfaces emerging themes — turning thousands of qualitative answers into actionable insight.',
      },
    ],
    useCases: [
      {
        title: 'Agricultural Baseline Assessment',
        description:
          'A World Bank project used Survey to conduct a 45,000-household baseline in three countries within six weeks, replacing a paper process that previously took six months.',
        sector: 'Development Finance',
      },
      {
        title: 'Crop Disease Surveillance',
        description:
          'Field extension agents used photo capture and GPS to report fall armyworm outbreaks in real time, enabling the government to mobilize pesticide distribution to affected areas within 48 hours.',
        sector: 'Government',
      },
      {
        title: 'Market Price Monitoring',
        description:
          'A commodity exchange deployed Survey to 200 market agents across West Africa, collecting daily price data for 30 commodities to power regional market intelligence.',
        sector: 'Private Sector',
      },
    ],
    quote: {
      text: 'We deployed Survey for a national food security assessment across 12 districts. The live dashboard meant our analysts could identify data quality issues and coach enumerators in real time — a complete game changer.',
      author: 'Dr. Abena Asante',
      role: 'M&E Lead',
      org: 'USAID Ghana Mission',
    },
    mockupLabel: 'Survey Analytics Dashboard',
    mockupColor: '#075985',
  },
  {
    slug: 'messaging',
    name: 'Messaging',
    tagline: 'Reach Millions of Farmers Instantly',
    description:
      'Send the right message to the right farmer at the right time — via SMS, voice, USSD, WhatsApp, or IVR. Esoko Messaging is the communications backbone for agricultural programmes across Africa, reaching feature-phone users with no data required.',
    heroGradient: 'from-[#7c2d12] via-[#9a3412] to-[#7c2d12]',
    accentColor: 'var(--color-brand)',
    icon: MessageSquare,
    stats: [
      { value: '500M+', label: 'Messages Sent' },
      { value: '95%', label: 'SMS Delivery Rate' },
      { value: '45+', label: 'Languages Supported' },
      { value: '10min', label: 'Campaign Setup Time' },
    ],
    features: [
      {
        icon: MessageSquare,
        title: 'Bulk SMS Campaigns',
        desc: 'Send targeted SMS to thousands of registered farmers in seconds. Personalize messages with farmer name, crop, location, or any profile attribute.',
      },
      {
        icon: Mic,
        title: 'Voice SMS & IVR',
        desc: 'Reach illiterate and low-literacy farmers with pre-recorded voice messages in local languages. Interactive IVR lets farmers respond and get information without data.',
      },
      {
        icon: Radio,
        title: 'USSD Short Codes',
        desc: 'Deploy USSD menus accessible from any phone — no internet, no app download required. Farmers can access prices, weather, and advice through simple keypad navigation.',
      },
      {
        icon: Send,
        title: 'WhatsApp Business Integration',
        desc: 'Send rich media messages — images, PDFs, videos — via WhatsApp to farmers with smartphones. Two-way conversations with automated responses and agent handoff.',
      },
      {
        icon: Bell,
        title: 'Emergency & Early Warning Alerts',
        desc: 'Activate mass alerts for drought, flood, pest outbreaks, or market disruptions within minutes. Geo-targeted messaging reaches only the farmers at risk.',
      },
      {
        icon: Target,
        title: 'Segmented Targeting',
        desc: 'Use farmer profile data to send hyper-targeted messages. Reach only rice farmers in a specific district, or women farmers with plots under 2 hectares.',
      },
      {
        icon: PieChart,
        title: 'Campaign Analytics',
        desc: 'Track delivery, open, and response rates across every campaign. A/B test message variants and optimize engagement over time.',
      },
      {
        icon: CalendarDays,
        title: 'Automated Scheduling',
        desc: 'Set up seasonal messaging calendars. Automatically send planting reminders at the start of rains, harvest advisories in October, or input application schedules.',
      },
    ],
    useCases: [
      {
        title: 'Fertilizer Subsidy Voucher Alerts',
        description:
          'A national fertilizer programme sent SMS voucher codes to 800,000 registered farmers, reducing distribution fraud by 62% and ensuring 94% uptake within the window.',
        sector: 'Government',
      },
      {
        title: 'Weather-Triggered Planting Advisories',
        description:
          'An NGO integrated meteorological data with Esoko Messaging to automatically send voice SMS advisories in Hausa and Twi when optimal planting conditions were detected.',
        sector: 'NGO / Development',
      },
      {
        title: 'Market Price Alerts',
        description:
          'A commodity trader subscribed 120,000 farmers to daily maize price SMS, enabling farmers to time their sales and increasing average farm gate prices by 18%.',
        sector: 'Private Sector',
      },
    ],
    quote: {
      text: 'During the armyworm crisis, we sent geo-targeted voice alerts to 400,000 farmers in their local languages within four hours. That speed of response simply wasn\'t possible before Esoko.',
      author: 'Grace Owusu-Acheampong',
      role: 'Programme Director',
      org: 'ECOWAS Agricultural Programme',
    },
    mockupLabel: 'Campaign Performance Dashboard',
    mockupColor: '#9a3412',
  },
  {
    slug: 'content',
    name: 'Content',
    tagline: 'Personalized Agricultural Advisory at Scale',
    description:
      'Deliver the right advice to every farmer at the right moment in their season. Esoko Content curates and distributes weather forecasts, crop advisories, market intelligence, and nutrition guidance — personalized by crop, location, and farmer profile.',
    heroGradient: 'from-[#14532d] via-[#166534] to-[#14532d]',
    accentColor: '#16a34a',
    icon: BookOpen,
    stats: [
      { value: '2M+', label: 'Active Subscribers' },
      { value: '12+', label: 'Advisory Categories' },
      { value: '85%', label: 'Farmer Satisfaction' },
      { value: '22%', label: 'Avg. Yield Improvement' },
    ],
    features: [
      {
        icon: CloudRain,
        title: 'Weather Forecasts',
        desc: '10-day hyper-local weather forecasts delivered to farmers by SMS, voice, or WhatsApp. Calibrated for agricultural decision-making — rainfall probability, temperature, wind.',
      },
      {
        icon: Thermometer,
        title: 'Climate-Smart Farming Advice',
        desc: 'Season-specific advisories on soil preparation, variety selection, planting density, and irrigation based on climate forecasts and historical patterns for each location.',
      },
      {
        icon: Apple,
        title: 'Nutrition & Food Security Guidance',
        desc: 'Reach rural women with practical nutrition messages tied to seasonal food availability. Support maternal health, child nutrition, and dietary diversity programmes.',
      },
      {
        icon: DollarSign,
        title: 'Financial Literacy & Inclusion',
        desc: 'Educate farmers on savings, credit, and insurance products via structured learning journeys. Drive uptake of digital financial services in rural communities.',
      },
      {
        icon: Globe,
        title: 'Gender & Social Inclusion Content',
        desc: 'Tailor advisory content for women farmers, youth, and marginalized communities. Track engagement by demographic to measure inclusion outcomes.',
      },
      {
        icon: LineChart,
        title: 'Market Intelligence',
        desc: 'Daily commodity prices from 200+ markets across Africa. Help farmers decide where to sell and when — with price trend analysis and buyer directories.',
      },
      {
        icon: Target,
        title: 'Livestock & Aquaculture Advisory',
        desc: 'Veterinary advisories, disease alerts, and feed management guidance for livestock farmers. Extend services beyond crops to diversified farming households.',
      },
      {
        icon: Bell,
        title: 'Pest & Disease Alerts',
        desc: 'Real-time alerts when crop threats are detected in a farmer\'s area. Early warnings enable preventive action before outbreaks cause irreversible losses.',
      },
    ],
    useCases: [
      {
        title: 'Extension at Scale',
        description:
          'A national extension programme used Esoko Content to deliver weekly advisories to 1.5 million farmers — achieving the same reach as 5,000 additional extension officers at 3% of the cost.',
        sector: 'Government',
      },
      {
        title: 'Nutrition-Sensitive Agriculture',
        description:
          'A UNICEF-funded programme used Content to deliver monthly nutrition messages to 180,000 pregnant and lactating women in rural northern Ghana, contributing to a measurable reduction in stunting rates.',
        sector: 'NGO / Development',
      },
      {
        title: 'Outgrower Scheme Advisory',
        description:
          'A palm oil company used Content to send crop-specific agronomic advisories to 60,000 smallholder outgrowers, improving FFB quality grades and increasing certified yields by 28%.',
        sector: 'Private Sector',
      },
    ],
    quote: {
      text: 'The weather and market price content changed how our farmers make decisions. Women farmers who previously sold at the farm gate are now timing their sales based on market data. Income increases of 15-20% are not uncommon.',
      author: 'Fatima Al-Hassan',
      role: 'Senior Programme Officer',
      org: 'International Fund for Agricultural Development (IFAD)',
    },
    mockupLabel: 'Content Advisory Platform',
    mockupColor: '#166534',
  },
  {
    slug: 'deployments',
    name: 'Deployments',
    tagline: 'Digitally Coordinate Your Field Workforce',
    description:
      'Manage large-scale field operations with military precision. Esoko Deployments coordinates enumerators, extension agents, and field officers — tracking attendance, assignments, performance, and GPS location across thousands of agents simultaneously.',
    heroGradient: 'from-[#1e3a5f] via-[#1d4ed8] to-[#1e3a5f]',
    accentColor: '#1d4ed8',
    icon: Users,
    stats: [
      { value: '50,000+', label: 'Field Agents Managed' },
      { value: '40%', label: 'Productivity Gain' },
      { value: '99%', label: 'Assignment Accuracy' },
      { value: '35+', label: 'Active Deployments' },
    ],
    features: [
      {
        icon: GraduationCap,
        title: 'Training Management',
        desc: 'Schedule and track training sessions for field agents. Record attendance, competency assessments, and certifications — with automated training reminders and refresher alerts.',
      },
      {
        icon: Users,
        title: 'Enumerator Coordination',
        desc: 'Assign geographic zones, household quotas, and daily targets to each agent. Monitor completion rates in real time and reassign workloads dynamically to meet deadlines.',
      },
      {
        icon: Navigation,
        title: 'GPS Agent Tracking',
        desc: 'View the real-time location of every field agent on a live map. Verify that surveys and farm visits are conducted at the assigned location, not remotely.',
      },
      {
        icon: CalendarDays,
        title: 'Attendance & Scheduling',
        desc: 'Digital attendance capture via GPS check-in. Automated work schedules, leave management, and overtime tracking for large field teams.',
      },
      {
        icon: Star,
        title: 'Performance Management',
        desc: 'Score every agent on productivity, data quality, and compliance. Identify top performers and those needing coaching — with data-driven feedback loops.',
      },
      {
        icon: Target,
        title: 'Field Monitoring',
        desc: 'Supervisors conduct spot-checks with a dedicated monitoring form. Compare supervisor observations against enumerator data to detect quality issues early.',
      },
      {
        icon: FileBarChart,
        title: 'Impact Evaluations',
        desc: 'Design randomized control trials and impact evaluations directly in Deployments. Randomize treatment and control groups, assign enumerators, and track data collection fidelity.',
      },
      {
        icon: Bell,
        title: 'Automated Alerts',
        desc: 'Set productivity thresholds that trigger SMS alerts to supervisors. Catch underperformance before it threatens programme timelines.',
      },
    ],
    useCases: [
      {
        title: 'Large-scale National Survey',
        description:
          'A national statistics office coordinated 3,000 enumerators across all 260 districts using Deployments, completing a national agriculture census 30% ahead of schedule.',
        sector: 'Government',
      },
      {
        title: 'Extension Agent Network Management',
        description:
          'An NGO managing 1,200 extension agents across East Africa used Deployments to eliminate phantom agents, reduce payroll fraud by $1.2M annually, and improve agent productivity by 35%.',
        sector: 'NGO / Development',
      },
      {
        title: 'Supply Chain Field Force',
        description:
          'A tea company coordinated 400 field buyers across 3 countries, using GPS tracking and performance dashboards to optimize routing and reduce collection costs by 22%.',
        sector: 'Private Sector',
      },
    ],
    quote: {
      text: 'Managing 2,000 field agents across 10 districts used to require armies of supervisors and mountains of paperwork. With Deployments, two programme managers oversee everything from a single dashboard — in real time.',
      author: 'Emmanuel Boateng',
      role: 'Field Operations Manager',
      org: 'Catholic Relief Services Ghana',
    },
    mockupLabel: 'Field Operations Dashboard',
    mockupColor: '#1d4ed8',
  },
  {
    slug: 'marketplace',
    name: 'Marketplace',
    tagline: 'Connecting Farmers Directly to Buyers',
    description:
      'Eliminate costly middlemen and bring transparency to agricultural trade. Esoko Marketplace connects verified smallholder farmers with institutional buyers, processors, and exporters — with digital payments, logistics support, and live price discovery.',
    heroGradient: 'from-[#713f12] via-[#854d0e] to-[#713f12]',
    accentColor: 'var(--color-brand)',
    icon: ShoppingCart,
    stats: [
      { value: '$120M+', label: 'Trade Facilitated' },
      { value: '85,000+', label: 'Active Farmers' },
      { value: '18%', label: 'Avg. Price Premium' },
      { value: '200+', label: 'Verified Buyers' },
    ],
    features: [
      {
        icon: Handshake,
        title: 'Direct Farmer-to-Buyer Trading',
        desc: 'Farmers list produce and receive offers directly from verified buyers. Negotiate and close deals without leaving the farm — via SMS, USSD, or app.',
      },
      {
        icon: ShieldCheck,
        title: 'Verified Seller Profiles',
        desc: 'Every farmer and buyer is KYC-verified. Digital profiles include crop history, GPS farm location, quality grades, and transaction track record.',
      },
      {
        icon: Truck,
        title: 'Logistics Coordination',
        desc: 'Connect with vetted transporters and aggregation centers. Track produce from farm to warehouse with digital waybills and GPS tracking.',
      },
      {
        icon: CreditCard,
        title: 'Digital Payments',
        desc: 'Secure mobile money payments directly to farmers\' wallets upon delivery confirmation. Escrow services protect both parties during disputes.',
      },
      {
        icon: PackageCheck,
        title: 'Quality Assurance',
        desc: 'Standardized grading frameworks and independent quality verification. Digital certificates of quality travel with every lot to build buyer confidence.',
      },
      {
        icon: LineChart,
        title: 'Live Market Prices',
        desc: 'Real-time price discovery across 200+ markets. Farmers see prices before accepting offers — eliminating information asymmetry that has historically exploited smallholders.',
      },
      {
        icon: BarChart2,
        title: 'Market Analytics',
        desc: 'Seasonal price trend analysis, demand forecasting, and trade flow visualization. Help buyers plan procurement and farmers time their sales.',
      },
      {
        icon: TrendingUp,
        title: 'Supply Aggregation',
        desc: 'Aggregate smallholder supply to meet minimum lot sizes for institutional buyers. Farmer groups and cooperatives can pool produce and negotiate collectively.',
      },
    ],
    useCases: [
      {
        title: 'Cooperative Produce Aggregation',
        description:
          'A farmer cooperative with 8,000 members used Marketplace to aggregate maize and sell directly to a brewery, achieving a 25% price premium over local trader prices.',
        sector: 'Agriculture',
      },
      {
        title: 'Export Supply Chain',
        description:
          'A shea exporter used Marketplace to source certified organic shea from 12,000 women farmers, with GPS farm data supporting EU deforestation regulation compliance.',
        sector: 'Private Sector',
      },
      {
        title: 'Government Procurement',
        description:
          'A school feeding programme procured 4,000 metric tons of locally grown food from smallholders via Marketplace, eliminating import dependence and paying farmers 30% above market rate.',
        sector: 'Government',
      },
    ],
    quote: {
      text: 'Before Esoko Marketplace, I sold maize to whoever came to my farm and accepted any price offered. Now I compare prices from four buyers and choose the best deal. My income has doubled in two seasons.',
      author: 'Mariama Diallo',
      role: 'Smallholder Maize Farmer',
      org: 'Northern Region, Ghana',
    },
    mockupLabel: 'Marketplace Trading Platform',
    mockupColor: '#854d0e',
  },
  {
    slug: 'mobile-platform',
    name: 'Mobile Platform',
    tagline: 'One Platform. Any Device. Any Connection.',
    description:
      'The Esoko Mobile & Web Platform powers every product in the Esoko ecosystem. A single, unified platform delivers consistent experiences across Android, iOS, feature phones, and browsers — with enterprise-grade offline capabilities and centralized administration.',
    heroGradient: 'from-[#312e81] via-[#4338ca] to-[#312e81]',
    accentColor: '#4338ca',
    icon: Smartphone,
    stats: [
      { value: '2M+', label: 'Monthly Active Users' },
      { value: '99.97%', label: 'Platform Uptime' },
      { value: '< 3s', label: 'Avg. Sync Time' },
      { value: 'ISO 27001', label: 'Security Certified' },
    ],
    features: [
      {
        icon: TabletSmartphone,
        title: 'Native Android & iOS Apps',
        desc: 'Full-featured native apps for Android and iOS with biometric authentication, push notifications, and hardware integration — cameras, GPS, and NFC.',
      },
      {
        icon: WifiOff,
        title: 'Offline-First Architecture',
        desc: 'All Esoko apps work without internet. Intelligent sync resolves conflicts and ensures data integrity when connectivity is restored — even after days offline.',
      },
      {
        icon: Globe,
        title: 'Progressive Web Apps',
        desc: 'Install Esoko directly from the browser on any device. PWA support extends reach to low-cost Android devices and ensures consistent UX across hardware tiers.',
      },
      {
        icon: Monitor,
        title: 'Admin Portal',
        desc: 'Centralized web-based administration for user management, role-based access, form configuration, messaging, and reporting — all in one portal.',
      },
      {
        icon: Layout,
        title: 'Custom Dashboards',
        desc: 'Build tailored dashboards for different stakeholders — field agents see their assignments, supervisors see team performance, executives see programme KPIs.',
      },
      {
        icon: ShieldCheck,
        title: 'Enterprise Security',
        desc: 'End-to-end encryption, ISO 27001 certification, GDPR and African data protection law compliance. Data sovereignty options with in-country hosting.',
      },
      {
        icon: Zap,
        title: 'API-First Integration',
        desc: 'RESTful APIs and webhooks enable deep integration with existing systems — ERP, HR, financial management, and GIS platforms. Comprehensive developer documentation.',
      },
      {
        icon: TrendingUp,
        title: 'Scalable Cloud Infrastructure',
        desc: 'Built on AWS with auto-scaling to handle millions of simultaneous users. Multi-region deployment options for data residency requirements.',
      },
    ],
    useCases: [
      {
        title: 'Enterprise Rollout Across Five Ministries',
        description:
          'A government deployed the Esoko platform across five ministries, consolidating 12 fragmented data systems into a single platform used by 8,000 civil servants.',
        sector: 'Government',
      },
      {
        title: 'Feature Phone Integration for Last-Mile Reach',
        description:
          'An NGO combined the Esoko app for supervisors with USSD interfaces for farmers, reaching 400,000 smallholders across regions with no smartphone penetration.',
        sector: 'NGO / Development',
      },
      {
        title: 'Multi-Country Platform Standardization',
        description:
          'A multinational agribusiness standardized all 14 country operations on the Esoko platform, creating a unified view of 2 million outgrower farmers across sub-Saharan Africa.',
        sector: 'Private Sector',
      },
    ],
    quote: {
      text: 'We evaluated six platforms and Esoko was the only one that genuinely worked offline in our remote field sites. The admin portal is simple enough that our IT team manages it without vendor support.',
      author: 'Nana Yaw Asare',
      role: 'Chief Information Officer',
      org: 'Rainforest Alliance Africa',
    },
    mockupLabel: 'Platform Administration Portal',
    mockupColor: '#4338ca',
  },
  {
    slug: 'ai-analytics',
    name: 'AI & Analytics',
    tagline: 'Intelligence at Scale Across Your Agri-Data',
    description:
      'Transform your field data into predictive intelligence. Esoko AI & Analytics applies machine learning, satellite imagery, and natural language processing to unlock insights that were previously impossible — from yield prediction to carbon baseline measurement.',
    heroGradient: 'from-[#0f172a] via-[#1e293b] to-[#0f172a]',
    accentColor: 'var(--color-brand)',
    icon: BarChart2,
    stats: [
      { value: '94%', label: 'Yield Prediction Accuracy' },
      { value: '30TB+', label: 'Data Processed Monthly' },
      { value: '3x', label: 'Faster Reporting' },
      { value: '15M', label: 'Farmers in AI Models' },
    ],
    features: [
      {
        icon: Brain,
        title: 'Predictive Analytics',
        desc: 'Machine learning models trained on 15 years of African agricultural data predict yield outcomes, input demand, market prices, and farmer credit risk — weeks in advance.',
      },
      {
        icon: Target,
        title: 'Farmer Segmentation',
        desc: 'AI clusters farmers by productivity potential, vulnerability, and programme responsiveness. Target interventions where they will have the highest impact.',
      },
      {
        icon: TrendingUp,
        title: 'Yield Prediction',
        desc: 'Predict crop yields by farm polygon using satellite NDVI, weather data, and soil maps. Enable procurement planning, insurance underwriting, and input distribution optimization.',
      },
      {
        icon: Zap,
        title: 'AI Assistant',
        desc: 'A natural language interface for your agricultural data. Ask questions in plain English — "Which districts have the lowest yield this season?" — and get instant, data-backed answers.',
      },
      {
        icon: Eye,
        title: 'Computer Vision & Image Recognition',
        desc: 'Identify crop diseases, pest damage, and nutrient deficiencies from field photos. AI diagnoses submitted images and recommends treatment within seconds.',
      },
      {
        icon: Satellite,
        title: 'Satellite Monitoring',
        desc: 'Monitor farm-level vegetation health via Sentinel-2 and Landsat imagery. Detect deforestation, land use change, and crop stress — without a field visit.',
      },
      {
        icon: Globe,
        title: 'Carbon Intelligence',
        desc: 'Measure, monitor, and report soil carbon sequestration at farm polygon level. Generate MRV-compliant carbon credit documentation for voluntary markets.',
      },
      {
        icon: FileBarChart,
        title: 'Natural Language Reports',
        desc: 'AI writes programme narrative reports from your data — for donors, boards, and government stakeholders — cutting reporting time from weeks to hours.',
      },
    ],
    useCases: [
      {
        title: 'Insurance Product Design',
        description:
          'A microinsurance provider used Esoko AI to build index-based crop insurance products for 200,000 smallholders, with satellite triggers replacing expensive loss-adjustment visits.',
        sector: 'Financial Services',
      },
      {
        title: 'Deforestation-Free Supply Chain',
        description:
          'A chocolate manufacturer used satellite monitoring to certify 95% of their cocoa supply chain as deforestation-free — a requirement for the EU market — within 12 months.',
        sector: 'Private Sector',
      },
      {
        title: 'Carbon Credit Programme',
        description:
          'An NGO used Carbon Intelligence to baseline 50,000 smallholder farms and issue verified carbon credits, generating $2.8M in additional income for participating farmers.',
        sector: 'Sustainability',
      },
    ],
    quote: {
      text: 'Esoko\'s AI predicted which districts would face food insecurity six weeks before it became visible in field data. That early warning allowed us to pre-position food aid and reach 80,000 vulnerable households before a crisis developed.',
      author: 'Dr. Sylvia Osei',
      role: 'Head of Data Science',
      org: 'World Food Programme, West Africa',
    },
    mockupLabel: 'AI Analytics Intelligence Suite',
    mockupColor: '#1e293b',
  },
];

export function getSolutionBySlug(slug: string): SolutionData | undefined {
  return SOLUTIONS_DATA.find(s => s.slug === slug);
}
