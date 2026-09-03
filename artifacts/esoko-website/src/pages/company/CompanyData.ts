import {
  Users, Zap, Lightbulb, ShieldCheck, Handshake, MessageSquare, BarChart2,
  Smartphone, Database, Sprout, Network, Navigation, Target, Focus,
  ClipboardList, BookOpen, ShoppingCart
} from 'lucide-react';

export const IMPACT_PATH = [
  { title: 'People', desc: 'Start with the realities, priorities and ambitions of the communities a programme serves.', icon: Users },
  { title: 'Data', desc: 'Capture reliable field information that helps organisations understand what is happening.', icon: Database },
  { title: 'Digital services', desc: 'Deliver information and services through channels designed for real operating conditions.', icon: Smartphone },
  { title: 'Decisions', desc: 'Turn information into clearer choices for teams, partners and programme leaders.', icon: Target },
  { title: 'Action', desc: 'Support coordinated delivery in the field and communication with the people involved.', icon: Zap },
  { title: 'Impact', desc: 'Create practical outcomes that can be reviewed, learned from and improved over time.', icon: BarChart2 },
];

export const TIMELINE = [
  { year: '2008', title: 'Our story begins', detail: 'Esoko began its journey in 2008, using digital innovation to connect people, information and opportunity.', image: '/hero-slide-4.jpg' },
  { year: 'Today', title: 'Built around people', detail: 'Our work brings together field experience, data, communication and technology to support agriculture and inclusive development.', image: '/about-hero.jpg' },
  { year: 'Ahead', title: 'A resilient future', detail: 'We continue to focus on technology that helps organisations and communities respond to changing agricultural and climate realities.', image: '/hero-slide-1.jpg' },
];

export const TEAM = [
  { 
    initials: 'DA', 
    name: 'Dr. Daniel Asare-Kyei', 
    role: 'Chief Executive Officer — CEO', 
    grad: 'from-[#D9531E] to-[#C84B16]',
    linkedinUrl: 'https://www.linkedin.com/in/dasarekyeiprofile/' 
  },
  { 
    initials: 'WO', 
    name: 'Mr. William Osei Agyemang', 
    role: 'Chief Finance Officer — CFO', 
    grad: 'from-emerald-500 to-emerald-700',
    linkedinUrl: 'https://www.linkedin.com/in/william-osei-agyemang' 
  },
  { 
    initials: 'KD', 
    name: 'Dr. Kwame Ofosu Debrah', 
    role: 'Chief Technology Officer — CTO', 
    grad: 'from-blue-500 to-blue-700',
    linkedinUrl: 'https://www.linkedin.com/in/kwamedebrah/' 
  },
  { 
    initials: 'SM', 
    name: 'Mr. Solomon Tematey Mensah', 
    role: 'Chief Operating Officer — COO', 
    grad: 'from-purple-500 to-purple-700',
    linkedinUrl: 'https://www.linkedin.com/in/solomon-mensah' 
  },
  { 
    initials: 'PA', 
    name: 'Mr. Philip Asihene', 
    role: 'Director of Operations', 
    grad: 'from-amber-500 to-orange-600',
    linkedinUrl: 'https://www.linkedin.com/in/philipasihene/' 
  },
  { 
    initials: 'CO', 
    name: 'Charlotte Owusu-Ansah', 
    role: 'Chief Talent and Administrative Officer', 
    grad: 'from-cyan-500 to-teal-600',
    linkedinUrl: 'https://www.linkedin.com/in/charlotte-owusu-ansah-' 
  },
  { 
    initials: 'HY', 
    name: 'Mr. Henry Osei Yankson', 
    role: 'Business Development Associate', 
    grad: 'from-rose-500 to-pink-600',
    linkedinUrl: 'https://www.linkedin.com/in/henry-yankson' 
  },
  { 
    initials: 'TK', 
    name: 'Mr. Thomas Kensah', 
    role: 'Engineering Manager', 
    grad: 'from-slate-500 to-slate-700',
    linkedinUrl: 'https://www.linkedin.com/in/thomas-kensah/' 
  },
];

export const VALUES = [
  { icon: Target,  title: 'Purpose',     desc: 'Every decision is measured against one question: does it meaningfully improve the lives of farmers and communities?', grad: 'from-emerald-400 to-green-600' },
  { icon: Lightbulb, title: 'Innovation',     desc: 'We build transformative, context-aware technology that solves real problems for farming communities across Africa.', grad: 'from-amber-400 to-orange-500' },
  { icon: Zap,        title: 'Impact',         desc: 'We focus on scalable, measurable outcomes that create lasting resilience and opportunity.', grad: 'from-blue-400 to-blue-600' },
  { icon: Handshake,  title: 'Collaboration',  desc: 'We build long-term, trust-based partnerships with governments, NGOs, donors, and the private sector.', grad: 'from-purple-400 to-violet-600' },
  { icon: ShieldCheck, title: 'Integrity',     desc: 'We act with transparency, honesty, and absolute accountability in every programme we deliver.', grad: 'from-rose-400 to-pink-600' },
  { icon: Users,      title: 'Inclusion',      desc: 'We design for the last mile, ensuring our digital services are accessible regardless of literacy or location.', grad: 'from-teal-400 to-emerald-600' },
];

export const GALLERY_IMAGES = [
  { src: '/about-hero.jpg', alt: 'Esoko field agent interacting with a market trader', category: 'FIELD WORK' },
  { src: '/about-team.jpg', alt: 'Esoko team at the Farmer Terminal', category: 'TECHNOLOGY' },
  { src: '/hero-slide-4.jpg', alt: 'Farmer using mobile technology in the field', category: 'FARMERS' },
  { src: '/hero-slide-1.jpg', alt: 'Field team surveying agricultural land', category: 'FIELD WORK' },
  { src: '/hero-slide-2.jpg', alt: 'Digital biometric registration of beneficiaries', category: 'IMPACT' },
  { src: '/hero-slide-3.jpg', alt: 'Esoko Farmer Helpline call center serving rural communities', category: 'COMMUNITIES' },
];

export const MISSION_PILLARS = [
  { title: 'EMPOWER FARMERS', desc: 'Help farmers access information, services, markets and opportunities.' },
  { title: 'DIGITAL INNOVATION', desc: 'Build technology that improves how organisations collect, manage and use data.' },
  { title: 'CLIMATE ACTION', desc: 'Support climate-smart and sustainable approaches to agriculture.' },
  { title: 'INCLUSIVE DEVELOPMENT', desc: 'Connect organisations and communities through accessible digital services.' }
];

export const OVERVIEW_BLOCKS = [
  { icon: Smartphone, title: 'DIGITAL PLATFORMS', desc: 'Robust web and mobile applications designed for low-connectivity environments.', link: '/products-services' },
  { icon: Database, title: 'DATA & INSIGHTS', desc: 'Comprehensive field data collection, biometric registration, and analytics.', link: '/solutions/insyt' },
  { icon: MessageSquare, title: 'COMMUNICATION', desc: 'Multi-channel messaging via SMS, Voice, IVR, and call centers in local languages.', link: '/solutions/messaging' },
  { icon: Navigation, title: 'FIELD OPERATIONS', desc: 'Supporting field teams with tools for surveys, deployment, and monitoring.', link: '/solutions/deployments' },
];

export const WHY_ESOKO = [
  { icon: Focus, title: 'FIELD EXPERIENCE', desc: 'Solutions shaped by the realities of field teams, communities and programme delivery.' },
  { icon: Smartphone, title: 'DIGITAL TECHNOLOGY', desc: 'Web and mobile tools designed for the environments in which they are used.' },
  { icon: BarChart2, title: 'DATA & INSIGHTS', desc: 'Field information organised to support monitoring, learning and better decisions.' },
  { icon: Network, title: 'LAST-MILE COMMUNICATION', desc: 'Multiple channels that help organisations communicate beyond dependable internet access.' },
  { icon: Sprout, title: 'AGRICULTURE FOCUS', desc: 'Services built around agricultural information, field operations and market connections.' },
  { icon: Zap, title: 'DELIVERY SUPPORT', desc: 'Technology and implementation services that can adapt to programme needs.' },
];

export const ECOSYSTEM_LINKS = [
  { title: 'INSYT SURVEY', desc: 'Data collection & biometrics', link: '/solutions/insyt', icon: ClipboardList },
  { title: 'PUSH MESSAGING', desc: 'Mass communication', link: '/solutions/messaging', icon: MessageSquare },
  { title: 'E-CONTENT', desc: 'Agricultural advisory', link: '/solutions/content', icon: BookOpen },
  { title: 'MARKETPLACE', desc: 'Connecting buyers & sellers', link: '/products-services', icon: ShoppingCart },
  { title: 'DEPLOYMENTS', desc: 'Field agent management', link: '/solutions/deployments', icon: Users },
  { title: 'SOFTWARE DEV', desc: 'Custom tech solutions', link: '/products-services', icon: Smartphone },
];
