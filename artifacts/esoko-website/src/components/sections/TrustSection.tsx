import { motion } from 'framer-motion';

const PARTNERS = [
  'FAO', 'World Bank', 'IFAD', 'USAID', 'Mastercard Foundation', 
  'GIZ', 'UNDP', 'AGRA', 'Mercy Corps', 'Government of Ghana',
  // Duplicate for seamless loop
  'FAO', 'World Bank', 'IFAD', 'USAID', 'Mastercard Foundation', 
  'GIZ', 'UNDP', 'AGRA', 'Mercy Corps', 'Government of Ghana'
];

export function TrustSection() {
  return (
    <section className="py-12 bg-white overflow-hidden border-b border-gray-100">
      <div className="container mx-auto px-4 mb-6">
        <p className="text-center text-sm font-semibold tracking-wider text-muted-foreground uppercase">
          Trusted by governments, NGOs and enterprises across Africa
        </p>
      </div>
      
      <div className="relative flex w-full">
        {/* Gradients for smooth fade on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
        
        <motion.div 
          className="flex whitespace-nowrap gap-6 pl-6"
          animate={{ x: [0, -1920] }} // Arbitrary large number to move it
          transition={{ 
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            },
          }}
        >
          {PARTNERS.map((partner, index) => (
            <div 
              key={index} 
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gray-50 border border-gray-100 text-foreground/70 font-semibold text-sm shadow-sm hover:border-brand/20 hover:text-brand transition-colors cursor-default"
            >
              {partner}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
