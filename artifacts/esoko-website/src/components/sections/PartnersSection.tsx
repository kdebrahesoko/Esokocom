import { motion } from 'framer-motion';

const CATEGORIES = [
  {
    name: 'Technology Partners',
    partners: ['Microsoft', 'Google Cloud', 'AWS', 'Esri', 'Twilio']
  },
  {
    name: 'Development Partners',
    partners: ['World Bank', 'USAID', 'GIZ', 'IFAD', 'Mastercard Foundation']
  },
  {
    name: 'Government Partners',
    partners: ['Ministry of Agriculture', 'Forestry Commission', 'Meteorological Agency']
  },
  {
    name: 'Research Institutions',
    partners: ['CGIAR', 'IITA', 'Wageningen University', 'FARA']
  }
];

export function PartnersSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-center mb-16">Our Partners</h2>
        
        <div className="space-y-12">
          {CATEGORIES.map((cat, i) => (
            <motion.div 
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-6 border-b border-gray-200 pb-2">
                {cat.name}
              </h3>
              <div className="flex flex-wrap gap-4">
                {cat.partners.map(p => (
                  <div 
                    key={p} 
                    className="bg-white border border-gray-200 px-6 py-3 rounded-full text-foreground/80 font-medium hover:border-primary/30 hover:shadow-md transition-all cursor-pointer"
                  >
                    {p}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
