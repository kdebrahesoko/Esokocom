import { motion } from 'framer-motion';
import { 
  BookOpen, FileText, Headphones, Video, 
  Calendar, Users, BarChart, Code 
} from 'lucide-react';
import { Link } from 'wouter';

const RESOURCES = [
  { icon: BookOpen, title: 'Blog', desc: 'Insights on African agriculture, technology, and impact' },
  { icon: FileText, title: 'Research Reports', desc: 'Data-driven analysis of African food systems' },
  { icon: Headphones, title: 'Podcasts', desc: 'Conversations with farmers, policymakers, and innovators' },
  { icon: Video, title: 'Webinars', desc: 'Live and on-demand learning from Esoko experts' },
  { icon: Calendar, title: 'Events', desc: 'Conferences, field days, and partner summits' },
  { icon: Users, title: 'Customer Stories', desc: 'How organizations are transforming agriculture with Esoko' },
  { icon: BarChart, title: 'State of Agriculture Report', desc: 'Annual flagship report on African agriculture' },
  { icon: Code, title: 'Documentation', desc: 'Technical guides for developers and implementors' }
];

export function ResourcesSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold text-foreground"
          >
            Knowledge & Insights
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {RESOURCES.map((res, i) => (
            <motion.div
              key={res.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow flex flex-col h-full"
            >
              <div className="w-12 h-12 rounded-full bg-[#C05C0E]/10 flex items-center justify-center mb-4">
                <res.icon className="w-6 h-6 text-[#C05C0E]" />
              </div>
              <h3 className="text-xl font-heading font-bold text-foreground mb-2">{res.title}</h3>
              <p className="text-sm text-muted-foreground mb-6 flex-1">{res.desc}</p>
              
              <Link href={`/resources/${res.title.toLowerCase().replace(/\s+/g, '-')}`} className="text-[#C05C0E] font-semibold text-sm hover:underline mt-auto">
                Explore &rarr;
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
