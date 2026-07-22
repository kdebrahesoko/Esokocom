import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Users, Building2, Globe2 } from 'lucide-react';
import { Navbar } from '@/components/nav/Navbar';
import { Footer } from '@/components/Footer';
import { useBookDemo } from '@/context/BookDemoContext';

const TIERS = [
  {
    icon: Users,
    name: 'Starter',
    audience: 'NGOs & small programmes',
    features: [
      'Up to 500 farmer profiles',
      'Survey & data collection',
      'SMS messaging (50k/month)',
      'Standard analytics dashboard',
      'Email support',
    ],
  },
  {
    icon: Building2,
    name: 'Growth',
    audience: 'Agribusinesses & mid-scale programmes',
    features: [
      'Up to 10,000 farmer profiles',
      'Full Insyt field operations suite',
      'Multichannel messaging (SMS, WhatsApp)',
      'AI-powered analytics & reporting',
      'Market price feeds',
      'Dedicated onboarding manager',
    ],
    highlighted: true,
  },
  {
    icon: Globe2,
    name: 'Enterprise',
    audience: 'Governments & large development partners',
    features: [
      'Unlimited farmer profiles',
      'Full platform access across all modules',
      'Custom integrations & API access',
      'White-label & multi-country deployment',
      'SLA-backed uptime guarantee',
      'Dedicated customer success team',
    ],
  },
];

export default function PricingPage() {
  const { open: openBookDemo } = useBookDemo();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 text-center bg-gradient-to-b from-gray-50 to-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-brand mb-4 bg-brand/10 px-4 py-1.5 rounded-full">
            Pricing
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6 leading-tight">
            Flexible plans for every scale of impact
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Esoko works with NGOs, governments, and agribusinesses of all sizes. All plans are
            custom-quoted — talk to us and we'll build a package around your programme.
          </p>
        </motion.div>
      </section>

      {/* Tiers */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="grid md:grid-cols-3 gap-6">
            {TIERS.map((tier, i) => {
              const Icon = tier.icon;
              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className={`relative rounded-2xl border flex flex-col ${
                    tier.highlighted
                      ? 'border-brand shadow-xl shadow-brand/10 bg-white ring-2 ring-brand/20'
                      : 'border-gray-100 shadow-sm bg-white'
                  }`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-[#D9531E] to-[#C84B16] text-white text-xs font-semibold px-4 py-1 rounded-full shadow">
                        Most popular
                      </span>
                    </div>
                  )}
                  <div className="p-7 flex-1 flex flex-col">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      tier.highlighted ? 'bg-brand/15 text-brand' : 'bg-gray-100 text-foreground/60'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-foreground mb-1">{tier.name}</h3>
                    <p className="text-sm text-muted-foreground mb-6">{tier.audience}</p>
                    <ul className="space-y-3 flex-1 mb-8">
                      {tier.features.map(f => (
                        <li key={f} className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-brand shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground/80">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={openBookDemo}
                      className={`w-full rounded-full py-2.5 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 group ${
                        tier.highlighted
                          ? 'bg-gradient-to-r from-[#D9531E] to-[#C84B16] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
                          : 'border border-brand text-brand hover:bg-brand/5'
                      }`}
                    >
                      Get a quote <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="py-16 px-4 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-heading font-bold text-foreground mb-3">Not sure which plan fits?</h2>
          <p className="text-muted-foreground mb-8">
            Our team will map your programme's needs to the right package — no commitment required.
          </p>
          <button
            onClick={openBookDemo}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D9531E] to-[#C84B16] text-white rounded-full px-8 py-3 font-semibold text-sm shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
          >
            Talk to Sales <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
