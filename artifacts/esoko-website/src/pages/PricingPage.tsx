import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, ArrowRight, Users, Building2, Globe2,
  ChevronDown, MessageSquare, BarChart2, Smartphone,
  ClipboardList, ShieldCheck, Zap, HeadphonesIcon,
} from 'lucide-react';
import { Navbar } from '@/components/nav/Navbar';
import { Footer } from '@/components/Footer';
import { useBookDemo } from '@/context/BookDemoContext';

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Data                                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */

const TIERS = [
  {
    icon: Users,
    name: 'Starter',
    tagline: 'For NGOs & small programmes',
    description: 'Get up and running with core survey, messaging, and farmer profile tools — everything a small field team needs.',
    features: [
      'Up to 500 farmer profiles',
      'Survey & data collection (CAPI/CATI)',
      'SMS messaging — 50k/month',
      'Standard analytics dashboard',
      'Advisory content library',
      'Email & chat support',
    ],
    cta: 'Get a quote',
    highlighted: false,
  },
  {
    icon: Building2,
    name: 'Growth',
    tagline: 'For agribusinesses & mid-scale programmes',
    description: 'The full Insyt field-ops suite plus AI analytics and multichannel messaging for programmes managing thousands of farmers.',
    features: [
      'Up to 10,000 farmer profiles',
      'Full Insyt field operations suite',
      'Multichannel messaging (SMS + WhatsApp)',
      'AI-powered analytics & reporting',
      'Real-time market price feeds',
      'GPS farm mapping & verification',
      'Dedicated onboarding manager',
      'Priority support SLA',
    ],
    cta: 'Get a quote',
    highlighted: true,
  },
  {
    icon: Globe2,
    name: 'Enterprise',
    tagline: 'For governments & large development partners',
    description: 'National-scale deployment with white-label, custom integrations, and a dedicated customer success team embedded in your programme.',
    features: [
      'Unlimited farmer profiles',
      'Full platform — all modules',
      'Custom integrations & REST API access',
      'White-label & multi-country rollout',
      'Social protection programme support',
      'SLA-backed 99.9% uptime',
      'Dedicated customer success team',
      'Executive business reviews',
    ],
    cta: 'Talk to sales',
    highlighted: false,
  },
];

const HOW_IT_WORKS = [
  { icon: MessageSquare, step: '01', title: 'Tell us about your programme', desc: 'A short discovery call to understand your geography, farmer count, data needs, and timeline.' },
  { icon: BarChart2, step: '02', title: 'We scope the right package', desc: 'Our solutions team maps your requirements to the Esoko platform modules and builds a custom quote.' },
  { icon: ClipboardList, step: '03', title: 'Pilot, then scale', desc: 'Most programmes start with a focused pilot — typically 500–2,000 farmers — before national rollout.' },
  { icon: Smartphone, step: '04', title: 'You go live, we stay with you', desc: 'Training, onboarding, and ongoing support from a team that has done this across 40+ countries.' },
];

const INCLUDED = [
  { icon: ShieldCheck, title: 'Data security & compliance', desc: 'GDPR-aligned data handling, role-based access control, and audit logs as standard on all plans.' },
  { icon: Zap, title: 'Offline-first mobile', desc: 'Field agents keep working without connectivity — data syncs automatically when back online.' },
  { icon: HeadphonesIcon, title: 'Local language support', desc: 'Platform and IVR voice support available in 15 African languages across all tiers.' },
  { icon: Globe2, title: 'Multi-country deployment', desc: 'Single platform, multiple countries and currencies — manage everything from one dashboard.' },
];

const FAQ = [
  {
    q: 'Do you publish fixed prices?',
    a: 'No — Esoko works exclusively with organisations running structured programmes (governments, NGOs, agribusinesses). Every deployment is scoped to your farmer count, geographies, and module mix, so we quote per programme rather than publish a price list.',
  },
  {
    q: 'How long does onboarding take?',
    a: 'A typical pilot (up to 2,000 farmers) is live within 4–6 weeks of contract sign. National-scale deployments — including custom integrations and white-label builds — usually go live in 10–16 weeks.',
  },
  {
    q: 'Can we start small and expand later?',
    a: 'Yes — most clients start with a focused pilot on the Starter or Growth plan, validate impact, and then scale to Enterprise. Your data and configuration migrate automatically; there\'s no rebuild.',
  },
  {
    q: 'Is there a minimum contract length?',
    a: 'Most programmes run on annual contracts, which gives us time to properly onboard and optimise. Shorter pilots are available for evaluation purposes.',
  },
  {
    q: 'Do you support integration with government MIS or payment systems?',
    a: 'Yes — we have existing connectors for common social protection MIS platforms and mobile money providers across Ghana, Nigeria, Côte d\'Ivoire, Tanzania, and others. Custom integrations are scoped on Enterprise plans.',
  },
];

/* ─────────────────────────────────────────────────────────────────────────── */
/*  FAQ Item                                                                   */
/* ─────────────────────────────────────────────────────────────────────────── */

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span className="font-semibold text-foreground group-hover:text-brand transition-colors text-sm md:text-base">
          {q}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="text-muted-foreground text-sm leading-relaxed pb-5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Page                                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */

export default function PricingPage() {
  const { open: openBookDemo } = useBookDemo();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-4 text-center bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* subtle bg rings */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-brand/4 blur-3xl pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative max-w-3xl mx-auto"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-brand mb-5 bg-brand/10 px-4 py-1.5 rounded-full">
            Pricing
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-6 leading-tight">
            Flexible plans for every scale of impact
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Esoko works with NGOs, governments, and agribusinesses across Africa. All plans are
            custom-quoted — we'll build a package that fits your programme, your farmers, and your budget.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={openBookDemo}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#D9531E] to-[#C84B16] text-white rounded-full px-8 py-3.5 font-semibold text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              Talk to Sales <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 border border-brand/30 text-brand rounded-full px-8 py-3.5 font-semibold text-sm hover:bg-brand/5 transition-colors"
            >
              How it works
            </a>
          </div>
        </motion.div>
      </section>

      {/* ── Tier cards ───────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {TIERS.map((tier, i) => {
              const Icon = tier.icon;
              return (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className={`relative rounded-3xl border flex flex-col ${
                    tier.highlighted
                      ? 'border-brand shadow-2xl shadow-brand/10 bg-white ring-2 ring-brand/20 scale-[1.02]'
                      : 'border-gray-100 shadow-sm bg-white'
                  }`}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-[#D9531E] to-[#C84B16] text-white text-xs font-bold px-5 py-1.5 rounded-full shadow-md">
                        Most popular
                      </span>
                    </div>
                  )}
                  <div className="p-7 flex-1 flex flex-col">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                      tier.highlighted ? 'bg-brand/15 text-brand' : 'bg-gray-100 text-foreground/60'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-foreground">{tier.name}</h3>
                    <p className="text-xs font-medium text-brand mt-0.5 mb-3">{tier.tagline}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 border-b border-gray-100 pb-6">
                      {tier.description}
                    </p>
                    <ul className="space-y-3 flex-1 mb-8">
                      {tier.features.map(f => (
                        <li key={f} className="flex items-start gap-3">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${tier.highlighted ? 'text-brand' : 'text-emerald-500'}`} />
                          <span className="text-sm text-foreground/80">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={openBookDemo}
                      className={`w-full rounded-full py-3 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 group ${
                        tier.highlighted
                          ? 'bg-gradient-to-r from-[#D9531E] to-[#C84B16] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5'
                          : 'border-2 border-brand/30 text-brand hover:border-brand hover:bg-brand/5'
                      }`}
                    >
                      {tier.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            All plans include onboarding support and are billed annually. Volume discounts available for multi-country deployments.
          </p>
        </div>
      </section>

      {/* ── Always included ──────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-gray-50 border-y border-gray-100">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-heading font-bold text-foreground">Always included, on every plan</h2>
            <p className="text-muted-foreground mt-2 text-sm">These aren't upsells — they're part of how Esoko works.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {INCLUDED.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-brand" />
                  </div>
                  <h4 className="font-semibold text-foreground text-sm mb-1.5">{item.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-brand mb-4 bg-brand/10 px-4 py-1.5 rounded-full">
              Engagement model
            </span>
            <h2 className="text-3xl font-heading font-bold text-foreground mb-3">
              From first call to first harvest
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              We don't do self-serve sign-ups — every deployment is partnership-led from day one.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  {/* Connector line (desktop) */}
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div className="hidden lg:block absolute top-6 left-[calc(100%-0px)] w-full h-px bg-gradient-to-r from-brand/30 to-transparent -translate-x-4 pointer-events-none" />
                  )}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-brand/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-brand" />
                      </div>
                      <span className="text-3xl font-heading font-bold text-brand/20">{step.step}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1.5">{step.title}</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-brand mb-4 bg-brand/10 px-4 py-1.5 rounded-full">
              FAQ
            </span>
            <h2 className="text-3xl font-heading font-bold text-foreground">Common questions</h2>
          </motion.div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm px-6 md:px-8">
            {FAQ.map(item => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#042B10] to-[#0f2318]">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4 leading-tight">
              Ready to see Esoko in action?
            </h2>
            <p className="text-white/60 mb-10 text-lg leading-relaxed">
              A 30-minute call is all it takes to scope a pilot. No commitment, no pressure — just a clear picture
              of what's possible for your programme.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={openBookDemo}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#D9531E] to-[#C84B16] text-white rounded-full px-8 py-4 font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                Book a demo call <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="mailto:sales@esoko.com"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-full px-8 py-4 font-semibold hover:-translate-y-0.5 transition-all duration-200"
              >
                Email sales directly
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
