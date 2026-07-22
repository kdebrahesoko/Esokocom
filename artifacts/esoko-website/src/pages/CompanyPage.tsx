import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Users, Calendar, Globe2 } from 'lucide-react';
import { Link } from 'wouter';
import { Navbar } from '@/components/nav/Navbar';
import { Footer } from '@/components/Footer';
import { useBookDemo } from '@/context/BookDemoContext';

const STATS = [
  { value: '5M+', label: 'Farmers reached' },
  { value: '40+', label: 'Countries served' },
  { value: '18 Yrs', label: 'Operational since 2006' },
  { value: '150+', label: 'Programme deployments' },
];

const TEAM = [
  { initials: 'BG', name: 'Brian Gyamfi', title: 'Chief Executive Officer', color: 'from-[#E07020] to-[#C05C0E]' },
  { initials: 'KM', name: 'Dr. Kwame Mensah', title: 'Chief Technology Officer', color: 'from-blue-400 to-blue-700' },
  { initials: 'AA', name: 'Ama Asante', title: 'Chief Operating Officer', color: 'from-orange-400 to-red-600' },
];

const VALUES = [
  { icon: Globe2, title: 'Inclusive by design', desc: 'Every product decision starts with the last-mile farmer in mind.' },
  { icon: Users, title: 'Partnership first', desc: 'We build long-term relationships, not transactional deployments.' },
  { icon: Calendar, title: 'Proven at scale', desc: 'Over 18 years of on-the-ground delivery across 40+ countries.' },
  { icon: MapPin, title: 'Africa-rooted', desc: 'Headquartered in Accra, operating across the continent.' },
];

export default function CompanyPage() {
  const { open: openBookDemo } = useBookDemo();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center bg-gradient-to-b from-gray-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-brand mb-4 bg-brand/10 px-4 py-1.5 rounded-full">
            About Us
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6 leading-tight">
            Connecting communities to opportunity since 2006
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Esoko is Africa's leading agricultural data and digital services platform, trusted by
            governments, NGOs, and agribusinesses to reach farmers at scale.
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 border-y border-gray-100 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="text-3xl font-heading font-bold text-brand mb-1">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">Our mission</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We believe every farmer deserves access to the information, markets, and services that
              help them thrive. Esoko was founded to bridge the data gap between agricultural systems
              and the communities they serve.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              From SMS market prices sent to smallholder farmers in Ghana in 2006, we've grown into a
              full-stack digital infrastructure platform serving millions across the continent.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 gap-4">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-gray-50 rounded-2xl p-5 border border-gray-100"
                >
                  <div className="w-9 h-9 rounded-lg bg-brand/10 flex items-center justify-center mb-3">
                    <Icon className="w-4.5 h-4.5 text-brand" />
                  </div>
                  <h4 className="font-semibold text-foreground text-sm mb-1">{v.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-16 px-4 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-heading font-bold text-foreground mb-10">Leadership</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center gap-3 w-40"
              >
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-bold text-xl shadow-md`}>
                  {member.initials}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 text-center">
        <div className="container mx-auto max-w-xl">
          <h2 className="text-2xl font-heading font-bold text-foreground mb-3">Work with us</h2>
          <p className="text-muted-foreground mb-8">
            Whether you're designing a programme or scaling an existing one, we'd love to show you
            what Esoko can do.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={openBookDemo}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D9531E] to-[#C84B16] text-white rounded-full px-8 py-3 font-semibold text-sm shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
            >
              Book a Demo <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href="/solutions/insyt"
              className="inline-flex items-center gap-2 border border-brand text-brand rounded-full px-8 py-3 font-semibold text-sm hover:bg-brand/5 transition-colors"
            >
              Explore solutions
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
