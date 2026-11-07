// Homepage subset of the existing site sector data (name, slug, description, icon).
import type { ComponentType } from 'react';
import { Wheat, Building2, Heart, GraduationCap, Sprout, CreditCard, Globe2, Briefcase } from 'lucide-react';

export interface HomeSector { slug: string; name: string; description: string; icon: ComponentType<{ className?: string }> }

export const SECTORS_DATA: HomeSector[] = [
  { slug: "agriculture", name: "Agriculture", description: "Support smallholder and commercial farmers with digital tools that improve access to agricultural information, markets, services, and data.", icon: Wheat },
  { slug: "government", name: "Government", description: "Help governments manage large-scale agricultural, social protection, rural development, and public service programmes with reliable digital platforms and real-time data.", icon: Building2 },
  { slug: "ngos-development", name: "NGOs & Development", description: "Enable development organizations to collect reliable data, manage beneficiaries, monitor programmes, communicate with communities, and measure impact at scale.", icon: Heart },
  { slug: "education", name: "Education", description: "Deliver agricultural training, extension services, digital learning, and practical knowledge to communities regardless of location or connectivity.", icon: GraduationCap },
  { slug: "sustainability", name: "Sustainability & Climate", description: "Use digital technology, climate intelligence, field data, and monitoring tools to support sustainable agriculture and climate resilience.", icon: Sprout },
  { slug: "financial-inclusion", name: "Financial Inclusion", description: "Enable financial institutions and development programmes to reach underserved communities with digital data, farmer profiles, communication, credit, and insurance solutions.", icon: CreditCard },
  { slug: "renewable-energy", name: "Renewable Energy", description: "Support organizations deploying renewable energy solutions by tracking beneficiaries, installations, adoption, field activities, and programme outcomes.", icon: Globe2 },
  { slug: "supply-chain", name: "Supply Chain", description: "Connect producers, aggregators, buyers, field agents, and organizations through digital data and traceability.", icon: Briefcase },
];
