import { motion } from 'framer-motion';
import { 
  BookOpen, FileText, Headphones, Video, 
  Calendar, Users, ArrowRight,
} from 'lucide-react';
import { Link } from 'wouter';

const RESOURCE_TYPES = [
  {
    icon: BookOpen,
    title: 'Blog',
    desc: 'Insights on African agriculture, technology, and impact',
    href: '/resources/blog',
    grad: 'from-blue-500 to-blue-700',
    iconColor: 'text-blue-100',
  },
  {
    icon: FileText,
    title: 'Research Reports',
    desc: 'Data-driven analysis of African food systems',
    href: '/resources/research',
    grad: 'from-emerald-500 to-green-700',
    iconColor: 'text-emerald-100',
  },
  {
    icon: Headphones,
    title: 'Podcasts',
    desc: 'Conversations with farmers, policymakers, and innovators',
    href: '/resources/podcasts',
    grad: 'from-amber-500 to-orange-600',
    iconColor: 'text-amber-100',
  },
  {
    icon: Video,
    title: 'Webinars',
    desc: 'Live and on-demand learning from Esoko experts',
    href: '/resources/webinars',
    grad: 'from-rose-500 to-rose-700',
    iconColor: 'text-rose-100',
  },
  {
    icon: Calendar,
    title: 'Events',
    desc: 'Conferences, field days, and partner summits',
    href: '/resources/events',
    grad: 'from-purple-500 to-purple-700',
    iconColor: 'text-purple-100',
  },
  {
    icon: Users,
    title: 'Customer Stories',
    desc: 'How organisations are transforming agriculture with Esoko',
    href: '/resources/customer-stories',
    grad: 'from-teal-500 to-teal-700',
    iconColor: 'text-teal-100',
  },
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
            Knowledge &amp; Insights
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mt-4 max-w-xl mx-auto"
          >
            Explore our library of data, stories, and learning resources on African agriculture.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESOURCE_TYPES.map((res, i) => (
            <motion.div
              key={res.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Link href={res.href}>
                <div className="group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${res.grad} flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md transition-shadow`}>
                    <res.icon className={`w-6 h-6 ${res.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2 group-hover:text-emerald-700 transition-colors">{res.title}</h3>
                  <p className="text-sm text-muted-foreground mb-5 flex-1">{res.desc}</p>
                  <span className="text-brand font-semibold text-sm flex items-center gap-1 mt-auto group-hover:gap-2 transition-all">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA to full resources page */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link href="/resources">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 border border-emerald-200 hover:border-emerald-300 px-6 py-3 rounded-full bg-white hover:shadow-sm transition-all">
              View all resources <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
