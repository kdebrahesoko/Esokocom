import { motion } from 'framer-motion';
import { Phone, PhoneCall, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ContactSection() {
  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-8">
              Get In Touch
            </h2>
            
            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Address</h4>
                  <p className="text-muted-foreground text-sm">11 Potato Avenue, East Legon<br />Accra, Ghana</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Phone</h4>
                  <p className="text-muted-foreground text-sm">+233 30 221 1611</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Call Centre</h4>
                  <p className="text-muted-foreground text-sm">1900</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Email</h4>
                  <p className="text-muted-foreground text-sm">info@esoko.com</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-[#C05C0E] text-white hover:bg-[#A84D0A] rounded-full px-8">
                Book a Meeting
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8">
                Request Demo
              </Button>
              <Button size="lg" variant="ghost" className="rounded-full px-8">
                Become a Partner
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[500px] bg-primary/5 rounded-3xl border border-primary/10 overflow-hidden flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-30"></div>
            
            {/* Map Simulation */}
            <div className="relative w-full h-full">
              {Array.from({length: 20}).map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-1.5 h-1.5 bg-primary/30 rounded-full"
                  style={{
                    top: `${20 + Math.random() * 60}%`,
                    left: `${20 + Math.random() * 60}%`
                  }}
                />
              ))}
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-xl shadow-primary/30 mb-2 animate-bounce">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-lg text-sm font-bold text-foreground">
                  Accra Headquarters
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
