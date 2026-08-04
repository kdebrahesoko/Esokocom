/* ─────────────────────────────────────────────────────────────────────────
   Esoko Careers — static data (powers both listing and detail pages)
   ───────────────────────────────────────────────────────────────────────── */

export type Department = 'Engineering' | 'Product' | 'Agriculture' | 'Operations' | 'Marketing' | 'Finance' | 'HR';
export type JobType = 'Full Time' | 'Contract' | 'Internship' | 'Graduate';
export type Experience = 'Entry Level' | 'Mid Level' | 'Senior' | 'Leadership';

export interface Job {
  id: string;
  title: string;
  department: Department;
  location: string;
  type: JobType;
  experience: Experience;
  postedDaysAgo: number;
  about: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  skills: string[];
  benefits: string[];
  deadline: string;
}

export const JOBS: Job[] = [
  {
    id: 'senior-software-engineer',
    title: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'Accra / Hybrid',
    type: 'Full Time',
    experience: 'Senior',
    postedDaysAgo: 5,
    about: 'Lead the development of Esoko\'s core agricultural technology platform, building scalable APIs and mobile-first applications used by millions of farmers across Africa. You will collaborate with product, design, and field teams to ship high-impact features.',
    responsibilities: [
      'Design and implement scalable backend services using Node.js and TypeScript',
      'Build and maintain real-time data pipelines for agricultural market information',
      'Collaborate with mobile engineers to deliver offline-capable farmer applications',
      'Conduct code reviews and mentor junior engineers on the team',
      'Work closely with product managers to translate requirements into technical solutions',
      'Contribute to infrastructure decisions around cloud architecture on AWS/GCP',
    ],
    requirements: [
      'Bachelor\'s degree in Computer Science, Software Engineering, or related field',
      '5+ years of professional software engineering experience',
      'Strong proficiency in TypeScript, React, and Node.js',
      'Experience with relational databases (PostgreSQL) and caching layers (Redis)',
      'Demonstrated ability to build and maintain production-grade systems',
    ],
    niceToHave: [
      'Experience with mobile development (React Native / Expo)',
      'Familiarity with agricultural technology or development-sector projects',
      'Knowledge of offline-first architecture patterns',
      'Open source contributions',
    ],
    skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Redis'],
    benefits: ['Competitive salary', 'Health insurance', 'Learning budget', 'Flexible working', 'Remote options'],
    deadline: 'September 30, 2026',
  },
  {
    id: 'ai-ml-engineer',
    title: 'AI / ML Engineer',
    department: 'Engineering',
    location: 'Accra / Remote',
    type: 'Full Time',
    experience: 'Senior',
    postedDaysAgo: 3,
    about: 'Join the AI team to build predictive models for crop yield forecasting, satellite image analysis, and automated agronomic advisory. You will deploy machine learning solutions that directly improve the livelihoods of smallholder farmers across Africa.',
    responsibilities: [
      'Develop and deploy machine learning models for crop disease detection and yield prediction',
      'Build pipelines to process satellite imagery from Sentinel-2 and Landsat sources',
      'Design automated agronomic advisory systems using NLP and LLMs',
      'Collaborate with data engineers to build robust feature stores and training datasets',
      'Evaluate model performance against real-world agricultural outcomes',
    ],
    requirements: [
      'MSc or PhD in Machine Learning, Computer Science, or related field',
      '3+ years of hands-on ML engineering experience in production environments',
      'Strong Python skills with PyTorch or TensorFlow',
      'Experience with MLOps: model versioning, CI/CD, and serving at scale',
    ],
    niceToHave: [
      'Experience with geospatial data (GDAL, rasterio, GEE)',
      'Published research in agriculture AI or climate-related machine learning',
      'Familiarity with multi-lingual NLP for African languages',
    ],
    skills: ['Python', 'PyTorch', 'TensorFlow', 'GCP', 'MLOps', 'SQL'],
    benefits: ['Competitive salary', 'Conference budget', 'Research time', 'Health insurance', 'Flexible working'],
    deadline: 'October 15, 2026',
  },
  {
    id: 'product-manager-data',
    title: 'Product Manager — Data & Analytics',
    department: 'Product',
    location: 'Accra, Ghana',
    type: 'Full Time',
    experience: 'Mid Level',
    postedDaysAgo: 8,
    about: 'Drive the roadmap for Esoko\'s data and analytics products, working at the intersection of agronomy, technology, and user experience. You will define features that give governments, NGOs, and agribusinesses actionable insights from field data.',
    responsibilities: [
      'Own the product vision and roadmap for analytics dashboards and reporting tools',
      'Conduct deep user research with field teams, NGO programme managers, and government partners',
      'Write detailed product specifications and user stories for engineering teams',
      'Define KPIs, run A/B tests, and measure product impact against business outcomes',
      'Partner with the go-to-market team to launch data products to enterprise clients',
    ],
    requirements: [
      '3+ years of product management experience at a software or data company',
      'Strong analytical skills — comfortable with SQL and data visualisation tools',
      'Proven ability to manage cross-functional stakeholders and ship products on time',
      'Experience in agritech, development sector, or emerging markets is a plus',
    ],
    niceToHave: [
      'Background in agriculture, development economics, or environmental science',
      'Experience with GIS or geospatial data products',
    ],
    skills: ['Product Strategy', 'SQL', 'Figma', 'Data Analysis', 'Stakeholder Management'],
    benefits: ['Competitive salary', 'Health insurance', 'Learning budget', 'Team events'],
    deadline: 'September 20, 2026',
  },
  {
    id: 'field-operations-manager',
    title: 'Field Operations Manager',
    department: 'Operations',
    location: 'Accra / Northern Ghana',
    type: 'Full Time',
    experience: 'Mid Level',
    postedDaysAgo: 12,
    about: 'Manage the deployment of Esoko\'s field data collection programmes across farming communities in Ghana and West Africa. You will lead teams of field agents, ensure data quality, and coordinate with government and NGO partners.',
    responsibilities: [
      'Oversee field agent recruitment, training, and performance management for regional deployments',
      'Coordinate logistics for large-scale farmer registration and survey programmes',
      'Monitor data quality and implement corrective actions in real time',
      'Build strong relationships with local agricultural extension officers and community leaders',
      'Report programme outcomes to international development partners and government clients',
    ],
    requirements: [
      '4+ years of field operations experience in development, agriculture, or related sectors',
      'Experience managing distributed teams across rural and remote areas',
      'Strong project management and data analysis skills',
      'Fluency in English and at least one Ghanaian language (Twi, Dagbani, or Hausa preferred)',
    ],
    niceToHave: [
      'Experience with mobile data collection tools (ODK, KoBoCollect, or similar)',
      'Familiarity with M&E frameworks used by USAID, World Bank, or GIZ',
    ],
    skills: ['Programme Management', 'Field Data Collection', 'Team Leadership', 'Reporting'],
    benefits: ['Competitive salary', 'Health insurance', 'Transport allowance', 'Paid leave'],
    deadline: 'October 5, 2026',
  },
  {
    id: 'agronomy-specialist',
    title: 'Agronomy Specialist',
    department: 'Agriculture',
    location: 'Accra, Ghana',
    type: 'Full Time',
    experience: 'Mid Level',
    postedDaysAgo: 7,
    about: 'Provide expert agronomic knowledge to power Esoko\'s digital advisory content and AI models. You will translate agriculture science into practical, localised guidance delivered to millions of smallholder farmers via SMS, voice, and mobile apps.',
    responsibilities: [
      'Develop and validate agronomic content for major staple and cash crops across Africa',
      'Work with the AI team to build training datasets for crop disease identification',
      'Collaborate with content teams to produce farmer-facing advisories in local languages',
      'Engage directly with farmers, cooperatives, and extension agents to validate recommendations',
      'Monitor emerging crop threats, climate patterns, and pest outbreaks to update content',
    ],
    requirements: [
      'BSc or MSc in Agronomy, Crop Science, or related agricultural discipline',
      '4+ years of practical agronomy experience in sub-Saharan Africa',
      'Deep knowledge of smallholder farming systems, soil management, and integrated pest management',
    ],
    niceToHave: [
      'Experience with precision agriculture or digital extension services',
      'Knowledge of climate-smart agriculture and carbon sequestration practices',
    ],
    skills: ['Agronomy', 'Crop Science', 'IPM', 'Soil Science', 'Remote Sensing'],
    benefits: ['Competitive salary', 'Health insurance', 'Field allowance', 'Professional development'],
    deadline: 'September 25, 2026',
  },
  {
    id: 'frontend-engineer',
    title: 'Frontend Engineer',
    department: 'Engineering',
    location: 'Accra / Remote',
    type: 'Full Time',
    experience: 'Mid Level',
    postedDaysAgo: 14,
    about: 'Build beautiful, performant web interfaces for Esoko\'s enterprise platform and farmer-facing applications. You will work on products used daily by governments, NGOs, and agricultural businesses across Africa.',
    responsibilities: [
      'Build responsive, accessible UI components using React and TypeScript',
      'Develop data-rich dashboards for field programme monitoring and analytics',
      'Implement design systems and maintain visual consistency across products',
      'Optimise front-end performance for low-bandwidth environments in rural Africa',
      'Collaborate with backend engineers on API design and integration',
    ],
    requirements: [
      '3+ years of professional frontend development experience',
      'Strong proficiency in React, TypeScript, and modern CSS',
      'Experience with data visualisation libraries (Recharts, D3, or similar)',
      'Understanding of web accessibility standards (WCAG 2.1)',
    ],
    niceToHave: [
      'Experience with React Native or Expo for cross-platform mobile development',
      'Familiarity with offline-first PWA patterns',
    ],
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'GraphQL'],
    benefits: ['Competitive salary', 'Remote options', 'Equipment budget', 'Health insurance'],
    deadline: 'October 10, 2026',
  },
  {
    id: 'marketing-manager',
    title: 'Marketing Manager',
    department: 'Marketing',
    location: 'Accra, Ghana',
    type: 'Full Time',
    experience: 'Senior',
    postedDaysAgo: 9,
    about: 'Lead Esoko\'s marketing efforts to build brand authority, generate enterprise leads, and position the company as Africa\'s most innovative agricultural technology company. You will shape campaigns across digital, events, and content channels.',
    responsibilities: [
      'Develop and execute integrated marketing campaigns across digital and offline channels',
      'Manage content marketing, SEO, social media, and email programmes',
      'Coordinate flagship events including the annual Esoko AgriTech Summit',
      'Build relationships with pan-African agricultural media and thought leaders',
      'Report on pipeline contribution and brand performance metrics',
    ],
    requirements: [
      '5+ years of B2B marketing experience, ideally in technology or development sectors',
      'Proven track record in demand generation and enterprise brand building',
      'Strong written communication skills for thought-leadership content',
    ],
    niceToHave: [
      'Experience marketing to government or NGO audiences',
      'Network within the African agritech or development-finance ecosystem',
    ],
    skills: ['B2B Marketing', 'Content Strategy', 'SEO', 'HubSpot', 'Campaign Management'],
    benefits: ['Competitive salary', 'Health insurance', 'Conference budget', 'Flexible working'],
    deadline: 'October 1, 2026',
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    department: 'Engineering',
    location: 'Accra / Remote',
    type: 'Full Time',
    experience: 'Mid Level',
    postedDaysAgo: 2,
    about: 'Extract insights from Esoko\'s rich agricultural datasets to power strategic decisions and build data products for clients. You will work with field survey data, satellite imagery, market prices, and weather models to generate actionable intelligence.',
    responsibilities: [
      'Analyse large-scale agricultural datasets to identify patterns, anomalies, and opportunities',
      'Build statistical models for crop price forecasting and food security assessments',
      'Create compelling data visualisations and reports for government and donor audiences',
      'Collaborate with ML engineers to productionise models and analytical pipelines',
      'Maintain and document data dictionaries and analytical methodologies',
    ],
    requirements: [
      'MSc in Data Science, Statistics, Economics, or related quantitative field',
      '2+ years of data analysis or data science experience',
      'Proficiency in Python or R for statistical analysis and modelling',
      'Strong SQL skills for working with large relational datasets',
    ],
    niceToHave: [
      'Experience with geospatial analysis (PostGIS, QGIS, or Python geospatial stack)',
      'Background in food systems, development economics, or climate data',
    ],
    skills: ['Python', 'R', 'SQL', 'Pandas', 'Scikit-learn', 'Power BI'],
    benefits: ['Competitive salary', 'Learning budget', 'Remote options', 'Health insurance'],
    deadline: 'October 20, 2026',
  },
];

/* ─────────────────────────────────────────────────────────────────────────
   Internship & Graduate Programmes
   ───────────────────────────────────────────────────────────────────────── */

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
