import { motion } from 'framer-motion';
import { Linkedin } from 'lucide-react';

const LEADERS = [
  { name: 'Brian Gyamfi', title: 'Chief Executive Officer', initials: 'BG', color: 'from-[#E07020] to-brand' },
  { name: 'Dr. Kwame Mensah', title: 'Chief Technology Officer', initials: 'KM', color: 'from-blue-400 to-blue-700' },
  { name: 'Ama Asante', title: 'Chief Operating Officer', initials: 'AA', color: 'from-orange-400 to-red-600' }
];

const VALUES = [
  'Innovation', 'Integrity', 'Customer Success', 'Sustainability', 
  'Collaboration', 'Inclusivity', 'Excellence'
];

export function LeadershipSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6"
          >
            Our Leadership Team
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Our team combines decades of experience in agriculture, technology, software engineering, data science and international development.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-24">
          {LEADERS.map((leader, i) => (
            <motion.div
              key={leader.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center group"
            >
              <div className={`w-40 h-40 mx-auto rounded-full bg-gradient-to-br ${leader.color} mb-6 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                <span className="text-5xl font-heading font-bold text-white/90">{leader.initials}</span>
              </div>
              <h3 className="text-2xl font-bold font-heading text-foreground mb-1">{leader.name}</h3>
              <p className="text-muted-foreground font-medium mb-3">{leader.title}</p>
              <a href="#" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-500 hover:bg-[#0A66C2] hover:text-white transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-16">
          <h3 className="text-3xl font-heading font-bold text-center mb-10">Our Values</h3>
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {VALUES.map((value, i) => (
              <motion.div
                key={value}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="px-6 py-3 bg-gray-50 rounded-full border border-gray-200 text-foreground font-semibold shadow-sm hover:border-brand/30 transition-colors cursor-default"
              >
                {value}
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
