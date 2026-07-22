import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import CountUp from 'react-countup';
import { Calendar, Globe, Users, Database } from 'lucide-react';

export function WhoWeAreSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left: Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <div className="inline-flex px-3 py-1 rounded-full bg-[#C05C0E]/10 text-[#C05C0E] font-semibold text-sm w-fit">
              Who Is Esoko?
            </div>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground leading-tight">
              Founded in 2008.<br />
              Built for Africa's Future.
            </h2>
            <div className="space-y-4 text-muted-foreground text-lg">
              <p>
                Esoko is one of Africa's leading Agritech companies dedicated to transforming agricultural markets through technology. We help organizations collect high-quality data, deliver critical information, deploy field operations, connect farmers to markets, and build resilient agricultural ecosystems across Africa.
              </p>
              <p>
                Through innovative mobile technologies, artificial intelligence, cloud platforms, and digital communication tools, Esoko supports governments, NGOs, agribusinesses, financial institutions, and development partners in creating measurable social and economic impact.
              </p>
            </div>
          </motion.div>

          {/* Right: Stats Grid */}
          <div ref={ref} className="grid grid-cols-2 gap-6">
            <StatCard 
              icon={<Calendar className="w-6 h-6 text-[#C05C0E]" />}
              end={18}
              suffix="+"
              label="Years of Experience"
              inView={inView}
              delay={0}
            />
            <StatCard 
              icon={<Globe className="w-6 h-6 text-[#C05C0E]" />}
              end={40}
              suffix="+"
              label="African Countries"
              inView={inView}
              delay={0.1}
            />
            <StatCard 
              icon={<Users className="w-6 h-6 text-[#C05C0E]" />}
              end={5}
              suffix="M+"
              label="Farmers Reached"
              inView={inView}
              delay={0.2}
            />
            <StatCard 
              icon={<Database className="w-6 h-6 text-[#C05C0E]" />}
              end={1}
              suffix="B+"
              label="Data Points Collected"
              inView={inView}
              delay={0.3}
            />
          </div>

        </div>
      </div>
    </section>
  );
}

function StatCard({ 
  icon, end, suffix, label, inView, delay 
}: { 
  icon: React.ReactNode, end: number, suffix: string, label: string, inView: boolean, delay: number 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
      className="bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
    >
      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4">
        {icon}
      </div>
      <div className="text-4xl font-heading font-bold text-primary mb-1">
        {inView ? <CountUp end={end} duration={2.5} separator="," /> : '0'}
        {suffix}
      </div>
      <div className="text-muted-foreground font-medium">
        {label}
      </div>
    </motion.div>
  );
}
