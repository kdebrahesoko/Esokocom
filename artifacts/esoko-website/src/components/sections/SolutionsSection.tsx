import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { 
  ClipboardList, 
  FileSearch, 
  MessageSquare, 
  BookOpen, 
  Users, 
  ShoppingCart, 
  Smartphone, 
  BarChart2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const SOLUTIONS = [
  {
    icon: ClipboardList,
    name: 'Insyt',
    slug: 'insyt',
    tagline: 'Intelligent Field Operations Platform',
    features: ['Digital profiling', 'GPS capture', 'Biometrics', 'AI validation', 'Offline mode', 'Real-time dashboards', 'Beneficiary management', 'Project monitoring'],
    accent: 'primary'
  },
  {
    icon: FileSearch,
    name: 'Survey',
    slug: 'survey',
    tagline: 'AI-powered Data Collection',
    features: ['Build forms', 'Offline surveys', 'GPS capture', 'Photos & videos', 'Signatures', 'Barcode scanning', 'Live dashboards'],
    accent: 'blue'
  },
  {
    icon: MessageSquare,
    name: 'Messaging',
    slug: 'messaging',
    tagline: 'Reach Millions Instantly',
    features: ['SMS', 'Voice SMS', 'IVR', 'USSD', 'WhatsApp', 'Bulk campaigns', 'Emergency alerts', 'Early warning systems'],
    accent: 'primary'
  },
  {
    icon: BookOpen,
    name: 'Content',
    slug: 'content',
    tagline: 'Personalized Agricultural Advisory',
    features: ['Weather forecasts', 'Climate-smart farming', 'Nutrition guidance', 'Financial literacy', 'Gender inclusion', 'Market intelligence', 'Livestock advisory', 'Pest alerts'],
    accent: 'blue'
  },
  {
    icon: Users,
    name: 'Deployments',
    slug: 'deployments',
    tagline: 'Digitally Coordinate Field Agents',
    features: ['Training management', 'Enumerator coordination', 'Field monitoring', 'Impact evaluations', 'Attendance tracking', 'GPS tracking', 'Performance management'],
    accent: 'primary'
  },
  {
    icon: ShoppingCart,
    name: 'Marketplace',
    slug: 'marketplace',
    tagline: 'Connecting Farmers to Buyers',
    features: ['Direct trading', 'Verified sellers', 'Logistics', 'Digital payments', 'Quality assurance', 'Live market prices', 'Market analytics'],
    accent: 'blue'
  },
  {
    icon: Smartphone,
    name: 'Mobile & Web Platform',
    slug: 'mobile-platform',
    tagline: 'One Platform. Any Device.',
    features: ['Offline mobile apps', 'Progressive Web Apps', 'Admin Portal', 'Dashboards', 'Analytics'],
    accent: 'primary'
  },
  {
    icon: BarChart2,
    name: 'AI & Analytics',
    slug: 'ai-analytics',
    tagline: 'Intelligence at Scale',
    features: ['Predictive Analytics', 'Farmer Segmentation', 'Yield Prediction', 'AI Assistant', 'Image Recognition', 'Satellite Monitoring', 'Carbon Intelligence', 'Natural Language Reports'],
    accent: 'blue'
  }
];

export function SolutionsSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4"
          >
            Our Platform. Your Impact.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground"
          >
            Eight integrated solutions, one powerful ecosystem.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {SOLUTIONS.map((solution, i) => (
            <motion.div
              key={solution.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`h-2 w-full ${solution.accent === 'primary' ? 'bg-[#C05C0E]' : 'bg-sky-500'}`}></div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${solution.accent === 'primary' ? 'bg-[#C05C0E]/10 text-[#C05C0E]' : 'bg-sky-500/10 text-sky-600'}`}>
                    <solution.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-foreground">{solution.name}</h3>
                    <p className="text-muted-foreground font-medium">{solution.tagline}</p>
                  </div>
                </div>

                <div className="my-6 flex-1">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                    {solution.features.map(feature => (
                      <li key={feature} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-[#C05C0E] shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link href={`/solutions/${solution.slug}`} className="inline-flex items-center text-[#C05C0E] font-semibold hover:text-[#A84D0A] transition-colors group-hover:gap-2 mt-auto w-fit">
                  Learn More <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
