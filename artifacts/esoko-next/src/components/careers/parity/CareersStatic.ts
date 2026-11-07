import {
  Sprout, Cpu, Globe2, TrendingUp, Users, Rocket, BookOpen, Award, Clock,
  Stethoscope, Laptop, Calendar, Star, Coffee, Building2,
} from 'lucide-react';

/* Verbatim copies of the original CareersPage static constants (asset paths prefixed). */
export const ASSET_BASE = '/esoko-next/site-assets';

export const WHY_JOIN = [
  { icon: Sprout,   title: 'Purpose Driven',          desc: 'Build technology that improves lives and strengthens rural communities across Africa.',            grad: 'from-emerald-400 to-green-600' },
  { icon: Cpu,      title: 'Innovation Culture',       desc: 'Work with AI, cloud, satellite data, mobile technology, and the latest emerging platforms.',      grad: 'from-blue-400 to-blue-600' },
  { icon: Globe2,   title: 'African Impact',           desc: 'Create solutions actively used across 10+ African countries and growing every year.',             grad: 'from-amber-400 to-orange-500' },
  { icon: TrendingUp, title: 'Career Growth',          desc: 'Continuous learning, mentorship programmes, professional certifications, and leadership paths.',   grad: 'from-purple-400 to-violet-600' },
  { icon: Users,    title: 'Collaborative Environment', desc: 'Work with diverse teams spanning engineering, agriculture, business, and field operations.',      grad: 'from-rose-400 to-pink-600' },
  { icon: Rocket,   title: 'Global Vision',            desc: 'Help build agricultural technology with worldwide relevance — from Ghana to the world.',          grad: 'from-cyan-400 to-teal-600' },
];

export const BENEFITS = [
  { icon: Stethoscope, label: 'Health Insurance',        desc: 'Comprehensive medical for you and family' },
  { icon: BookOpen,    label: 'Learning Budget',          desc: 'Annual allowance for courses & books' },
  { icon: Award,       label: 'Certifications',           desc: 'Professional certs paid by Esoko' },
  { icon: Clock,       label: 'Flexible Working',         desc: 'Hybrid and flexible hours by role' },
  { icon: TrendingUp,  label: 'Career Development',       desc: 'Regular performance reviews & growth plans' },
  { icon: Star,        label: 'Performance Bonuses',      desc: 'Rewarding impact-driven results' },
  { icon: Coffee,      label: 'Team Events',              desc: 'Team offsites, social events & retreats' },
  { icon: Globe2,      label: 'Conferences',              desc: 'Local and international conference attendance' },
  { icon: Laptop,      label: 'Modern Equipment',         desc: 'Latest hardware from day one' },
  { icon: Calendar,    label: 'Paid Leave',               desc: 'Generous leave and public holidays' },
  { icon: Building2,   label: 'Remote Options',           desc: 'Work from anywhere on eligible roles' },
];

export const PROCESS_STEPS = [
  { num: '01', title: 'Application',       desc: 'Submit your CV and cover letter through our careers portal.' },
  { num: '02', title: 'HR Review',         desc: 'Our talent team reviews every application personally within 5 days.' },
  { num: '03', title: 'Assessment',        desc: 'A skills-based take-home task relevant to your role.' },
  { num: '04', title: 'Interview',         desc: 'A structured interview with your future team and manager.' },
  { num: '05', title: 'Leadership Round',  desc: 'A final conversation with a senior leader or director.' },
  { num: '06', title: 'Offer',             desc: 'A competitive offer with full package transparency.' },
  { num: '07', title: 'Welcome',           desc: 'Your first day — we make it memorable. Welcome to Esoko.' },
];

export const TESTIMONIALS = [
  { quote: 'At Esoko, technology is not just about software. It is about changing people\'s lives.', name: 'Akosua Mensah', role: 'Senior Software Engineer', dept: 'Engineering', initials: 'AM', grad: 'from-blue-500 to-blue-700' },
  { quote: 'I came here to work on meaningful problems. Three years later, I am leading a team of twelve.', name: 'Kofi Asante', role: 'Product Manager', dept: 'Product', initials: 'KA', grad: 'from-emerald-500 to-green-700' },
  { quote: 'Nowhere else in Africa can you work on AI for agriculture at this scale and with this impact.', name: 'Amira Diallo', role: 'Data Scientist', dept: 'Engineering', initials: 'AD', grad: 'from-purple-500 to-purple-700' },
];

export const DI_HIGHLIGHTS = ['Gender Inclusion', 'Equal Opportunity', 'Inclusive Hiring', 'Community Impact'];

export const MOSAIC_IMAGES = [
  { src: ASSET_BASE + '/about-hero.jpg',   alt: 'Esoko field agent at market', cls: 'row-span-2' },
  { src: ASSET_BASE + '/hero-slide-2.jpg', alt: 'Esoko team with technology', cls: '' },
  { src: ASSET_BASE + '/hero-slide-3.jpg', alt: 'Agricultural technology', cls: '' },
  { src: ASSET_BASE + '/about-team.jpg',   alt: 'Esoko team group photo', cls: 'row-span-2' },
  { src: ASSET_BASE + '/hero-slide-4.jpg', alt: 'Farmer with mobile device', cls: '' },
  { src: ASSET_BASE + '/hero-slide-5.jpg', alt: 'Innovation in agriculture', cls: '' },
];

export const HERO_STATS = [
  { num: 18, unit: '+', label: 'Years of Innovation' },
  { num: 2000000, unit: '+', label: 'Farmers Impacted', display: '2M+' },
  { num: 10, unit: '+', label: 'African Countries' },
  { num: 100, unit: '+', label: 'Professionals' },
];
