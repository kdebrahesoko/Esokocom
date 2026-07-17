import { motion } from 'framer-motion';
import { 
  Wheat, Building2, Heart, Sprout, Leaf, 
  CreditCard, GraduationCap, FlaskConical, 
  Sun, Truck, Radio, TreePine 
} from 'lucide-react';

const SECTORS = [
  { icon: Wheat, name: 'Agriculture', desc: 'End-to-end digital tools for smallholder and commercial farmers' },
  { icon: Building2, name: 'Government', desc: 'National programme management, subsidy tracking, farmer registries' },
  { icon: Heart, name: 'NGOs & Development', desc: 'Beneficiary management, M&E, donor reporting' },
  { icon: Sprout, name: 'Sustainability', desc: 'Carbon credit monitoring, climate-smart agriculture' },
  { icon: Leaf, name: 'Carbon Projects', desc: 'Carbon footprint tracking, verification, reporting' },
  { icon: CreditCard, name: 'Financial Inclusion', desc: 'Agent banking, digital credit, insurance' },
  { icon: GraduationCap, name: 'Education', desc: 'Agricultural training, digital extension services' },
  { icon: FlaskConical, name: 'Research', desc: 'Data collection, longitudinal surveys, impact assessments' },
  { icon: Sun, name: 'Renewable Energy', desc: 'Solar adoption tracking, energy access monitoring' },
  { icon: Truck, name: 'Supply Chain', desc: 'Farm-to-market traceability, logistics coordination' },
  { icon: Radio, name: 'Rural Communication', desc: 'Last-mile connectivity, multilingual messaging' },
  { icon: TreePine, name: 'Climate & Environment', desc: 'Land use monitoring, deforestation tracking' }
];

export function SectorsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold text-foreground"
          >
            Built for Every Sector
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {SECTORS.map((sector, i) => (
            <motion.div
              key={sector.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group p-6 rounded-2xl border border-gray-100 bg-white hover:shadow-xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-primary/10 flex items-center justify-center mb-4 transition-colors">
                <sector.icon className="w-6 h-6 text-foreground/70 group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-xl font-heading font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {sector.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {sector.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
