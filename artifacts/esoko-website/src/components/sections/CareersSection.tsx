import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function CareersSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#0a522d] to-[#1F2937]"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
            Join Us in Transforming African Agriculture
          </h2>
          <p className="text-xl text-white/80 mb-10 leading-relaxed">
            We're building the future of digital agriculture. Join a team of passionate technologists, agronomists, and changemakers across Africa.
          </p>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-10">
            <div className="text-white font-semibold text-lg">50+ Team Members</div>
            <div className="hidden sm:block w-px h-6 bg-white/30"></div>
            <div className="text-white font-semibold text-lg">8 Countries</div>
            <div className="hidden sm:block w-px h-6 bg-white/30"></div>
            <div className="text-brand font-bold text-lg">Open Positions: 12</div>
          </div>

          <Button size="lg" className="bg-white text-brand hover:bg-white/90 rounded-full px-8 h-14 text-lg font-bold border-0">
            View Open Positions
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
