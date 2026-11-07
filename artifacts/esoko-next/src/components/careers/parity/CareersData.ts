/* Parity copy of the original website careers data module (programmes, FAQ, team). Fixture job listings intentionally excluded. */
export interface Programme {
  id: string;
  title: string;
  duration: string;
  eligibility: string;
  outcomes: string[];
  type: 'Internship' | 'Graduate';
}

export const PROGRAMMES: Programme[] = [
  {
    id: 'software-engineering-internship',
    title: 'Software Engineering Internship',
    duration: '3–6 months',
    eligibility: 'Final-year CS / Software Engineering students',
    outcomes: ['Production code ownership', 'Mentorship from senior engineers', 'Agile team experience'],
    type: 'Internship',
  },
  {
    id: 'data-science-internship',
    title: 'Data Science Internship',
    duration: '3–6 months',
    eligibility: 'Students in Data Science, Statistics, or Mathematics',
    outcomes: ['Real agricultural datasets', 'ML model deployment', 'Research publication support'],
    type: 'Internship',
  },
  {
    id: 'ai-research-internship',
    title: 'AI Research Internship',
    duration: '6 months',
    eligibility: 'MSc / PhD candidates in AI, Computer Vision, or NLP',
    outcomes: ['Satellite imagery research', 'Co-authorship opportunities', 'Hardware & GPU access'],
    type: 'Internship',
  },
  {
    id: 'agritech-graduate-programme',
    title: 'Agritech Graduate Programme',
    duration: '12 months',
    eligibility: 'Recent graduates in Agriculture, Agronomy, or Environmental Science',
    outcomes: ['Rotational placements across field and tech teams', 'Mentorship by industry experts', 'Full-time offer pathway'],
    type: 'Graduate',
  },
  {
    id: 'product-management-programme',
    title: 'Product Management Programme',
    duration: '12 months',
    eligibility: 'Recent graduates with strong analytical and communication skills',
    outcomes: ['Product ownership from day one', 'User research training', 'Leadership track acceleration'],
    type: 'Graduate',
  },
];

/* ─────────────────────────────────────────────────────────────────────────
   FAQ
   ───────────────────────────────────────────────────────────────────────── */

export const FAQ_ITEMS = [
  {
    q: 'How do I apply for a role at Esoko?',
    a: 'Browse our Open Positions section, click "View Position" on any role, and submit your application using the "Apply Now" button. You\'ll need your CV and a short cover letter. We review every application personally.',
  },
  {
    q: 'Can I work remotely at Esoko?',
    a: 'Many of our roles offer hybrid or fully remote options, especially within the Engineering and Data teams. Each job listing specifies the location flexibility. We believe in flexibility balanced with strong team culture.',
  },
  {
    q: 'Do you accept interns and graduate applicants?',
    a: 'Absolutely. We run structured Internship and Graduate Programmes throughout the year. See the Internship & Graduate Programme section on this page for current openings and eligibility criteria.',
  },
  {
    q: 'What technologies does Esoko use?',
    a: 'Our stack includes TypeScript, React, React Native (Expo), Node.js, PostgreSQL, Redis, Python (for data and ML), TensorFlow/PyTorch, AWS and GCP infrastructure, and Tailwind CSS for frontend design.',
  },
  {
    q: 'How long does the recruitment process take?',
    a: 'Our typical process takes 3–5 weeks from application to offer: HR review (1 week), technical assessment (1 week), two interview rounds (1–2 weeks), and a leadership discussion. We keep you updated at every stage.',
  },
  {
    q: 'What benefits do Esoko employees receive?',
    a: 'We offer competitive salaries benchmarked to market, comprehensive health insurance, learning and certification budgets, flexible working arrangements, performance bonuses, paid leave, modern equipment, and a collaborative team culture.',
  },
  {
    q: 'Does Esoko hire internationally?',
    a: 'Yes. While our headquarters is in Accra, Ghana, we have team members across Africa and support remote work for select roles. We are particularly interested in candidates across sub-Saharan Africa with a passion for agricultural transformation.',
  },
];

/* ─────────────────────────────────────────────────────────────────────────
   Careers Team (filterable grid)
   ───────────────────────────────────────────────────────────────────────── */

export type TeamCategory = 'Leadership' | 'Technology' | 'Operations' | 'Agriculture';

export interface CareerTeamMember {
  initials: string;
  name: string;
  role: string;
  bio: string;
  category: TeamCategory;
  grad: string;
}

export const CAREERS_TEAM: CareerTeamMember[] = [
  { initials: 'BG', name: 'Brian Gyamfi',     role: 'Chief Executive Officer',    category: 'Leadership',   grad: 'from-[#D9531E] to-[#C84B16]',   bio: 'Visionary entrepreneur with 18+ years transforming African agriculture through digital innovation.' },
  { initials: 'KM', name: 'Dr. Kwame Mensah', role: 'Chief Technology Officer',   category: 'Technology',   grad: 'from-blue-500 to-blue-700',       bio: 'PhD in CS. Architect of Esoko\'s AI platform, satellite analytics, and offline-first mobile stack.' },
  { initials: 'AA', name: 'Ama Asante',       role: 'Chief Operating Officer',    category: 'Leadership',   grad: 'from-emerald-500 to-green-700',   bio: 'Operations leader managing complex multi-stakeholder programmes across 10+ African countries.' },
  { initials: 'DE', name: 'Daniel Eshun',     role: 'Director of Engineering',    category: 'Technology',   grad: 'from-purple-500 to-purple-700',   bio: 'Full-stack engineering leader overseeing the core platform and API infrastructure for millions of users.' },
  { initials: 'FO', name: 'Fatima Ouedraogo', role: 'Director of Operations',     category: 'Operations',   grad: 'from-amber-500 to-orange-600',    bio: 'Programme management specialist in large-scale beneficiary registration and digital transformation.' },
  { initials: 'PK', name: 'Philip Kojo',      role: 'Director of Product',        category: 'Technology',   grad: 'from-cyan-500 to-teal-600',       bio: 'Human-centred product designer bringing Esoko\'s farmer-first philosophy to every product decision.' },
  { initials: 'JA', name: 'Joyce Agyemang',   role: 'Head of Agronomy',           category: 'Agriculture',  grad: 'from-lime-500 to-green-600',      bio: 'Agronomist with deep expertise in smallholder crop systems and digital extension service design.' },
  { initials: 'MB', name: 'Moussa Bamba',     role: 'Field Programme Director',   category: 'Operations',   grad: 'from-teal-500 to-cyan-700',       bio: 'Francophone Africa specialist managing large-scale field deployments across Côte d\'Ivoire, Mali, and Senegal.' },
  { initials: 'EK', name: 'Efua Kumi',        role: 'Senior Data Scientist',      category: 'Technology',   grad: 'from-violet-500 to-purple-600',   bio: 'Builds predictive models for crop price forecasting and food security assessments.' },
  { initials: 'RA', name: 'Rashida Adom',     role: 'Agriculture Technology Lead', category: 'Agriculture', grad: 'from-rose-500 to-pink-700',       bio: 'Bridges agronomy and technology — translating field insights into AI training datasets.' },
  { initials: 'YD', name: 'Yaw Darko',        role: 'Head of Field Operations',   category: 'Operations',   grad: 'from-orange-500 to-red-600',      bio: 'Leads field agent networks across Ghana, overseeing quality, logistics and training for national programmes.' },
  { initials: 'SA', name: 'Serena Abbiw',     role: 'Director of Partnerships',   category: 'Leadership',   grad: 'from-indigo-500 to-blue-700',     bio: 'International development specialist managing Esoko\'s relationships with donors and governments.' },
];
