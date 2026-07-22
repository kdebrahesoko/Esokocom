import { motion } from 'framer-motion';
import { Globe2, LayoutDashboard, Brain, Shield, WifiOff, Zap, Puzzle, Leaf } from 'lucide-react';

const FEATURES = [
  {
    icon: Globe2,
    title: 'Enterprise Scale',
    description: 'Cloud-native infrastructure built for nationwide programmes.'
  },
  {
    icon: LayoutDashboard,
    title: 'One Unified Platform',
    description: 'Data collection, messaging, analytics and deployment in one ecosystem.'
  },
  {
    icon: Brain,
    title: 'Artificial Intelligence',
    description: 'AI-powered analytics, predictions, recommendations and automation.'
  },
  {
    icon: Shield,
    title: 'Privacy & Security',
    description: 'Enterprise-grade encryption and compliance.'
  },
  {
    icon: WifiOff,
    title: 'Offline First',
    description: 'Works even in remote communities without internet.'
  },
  {
    icon: Zap,
    title: 'Real-Time Analytics',
    description: 'Live dashboards and instant reporting.'
  },
  {
    icon: Puzzle,
    title: 'Extensible Platform',
    description: 'Powerful APIs and third-party integrations.'
  },
  {
    icon: Leaf,
    title: 'Built for Sustainability',
    description: 'Supporting climate resilience and carbon-smart agriculture.'
  }
];

export function WhyEsokoSection() {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold text-white mb-6"
          >
            Built for Agriculture.<br className="hidden md:block" /> Designed for Impact.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-[#C05C0E]/10 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-[#C05C0E]" />
              </div>
              <h3 className="text-xl font-heading font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
