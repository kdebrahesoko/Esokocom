import Image from 'next/image';
import {
  ArrowRight, ExternalLink, CheckCircle2, Users, BookOpen, Layers, ChevronRight,
} from 'lucide-react';
import { HashScroll } from '@/components/home/HashScroll';
import { SiteLink } from '@/components/site/SiteLink';
import { EXISTING_CONTACT_HREF } from '@/lib/site-links';
import {
  PRODUCTS, SOFTWARE_SERVICES, MESSAGING_CHANNELS, CONTENT_CATEGORIES, HERO_STATS,
  ECOSYSTEM_FLOWS, PROFESSIONAL_SERVICES, DEPLOYMENT_FEATURES, MESSAGING_SERVICE_FEATURES,
  ARCHITECTURE_LAYERS, PRODUCTS_HERO_DISPLAY_IMAGE, PRODUCTS_CTA_IMAGE,
} from '@/data/products-services';
import { buttonClass } from './button-styles';
import { Motion, FadeUp, RevealUp } from './Motion';
import { ScrollButton } from './ScrollButton';
import { HeroDots } from './HeroDots';
import { EcosystemDiagram } from './EcosystemDiagram';
import { ProductCard, PoweredBadge } from './ProductCard';

/** Server entry for /products-services. Root layout supplies the shared Navbar/Footer. */
export function ProductsServicesPage() {
  return (
    <div className="esoko-home min-h-screen w-full bg-white flex flex-col font-sans">
      <HashScroll />

      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#051f12]" aria-label="Hero">
        <Image src={PRODUCTS_HERO_DISPLAY_IMAGE} alt="" fill priority sizes="100vw" className="object-cover object-center" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#051f12]/92 via-[#0B4D2E]/80 to-[#051f12]/95" />
        <HeroDots />

        <div className="container mx-auto px-4 md:px-6 relative z-10 pt-32 pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <FadeUp as="p" delay={0} className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-400 mb-5">
              Esoko Platform Ecosystem
            </FadeUp>
            <FadeUp as="h1" delay={0.08} className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-white leading-[1.05] mb-6">
              Products &{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-200">Services</span>
            </FadeUp>
            <FadeUp as="p" delay={0.14} className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
              Four enterprise-grade platforms and a full suite of professional services — powering agricultural transformation across 40+ countries.
            </FadeUp>
            <FadeUp delay={0.2} className="flex flex-wrap items-center justify-center gap-4">
              <ScrollButton target="products" testId="button-explore-products"
                className={buttonClass('rounded-full px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-base h-auto shadow-xl shadow-emerald-900/40')}>
                Explore Products <ArrowRight className="w-4 h-4 ml-1.5" />
              </ScrollButton>
              <a href={EXISTING_CONTACT_HREF} data-testid="link-talk-to-team"
                className={buttonClass('rounded-full px-8 py-3.5 border-white/25 text-white hover:bg-white/10 bg-transparent font-semibold text-base h-auto', 'outline')}>
                Talk to Our Team
              </a>
            </FadeUp>
          </div>

          <FadeUp delay={0.3} className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 max-w-3xl mx-auto">
            {HERO_STATS.map(s => (
              <div key={s.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center">
                <p className="text-3xl font-heading font-bold text-emerald-400">{s.val}</p>
                <p className="text-xs text-white/50 mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </FadeUp>
        </div>

        <ScrollButton target="products" bounce ariaLabel="Scroll to products"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 hover:text-white/60 transition-colors">
          <ChevronRight className="w-6 h-6 rotate-90" />
        </ScrollButton>
      </section>

      {/* PRODUCTS & PLATFORMS */}
      <section id="products" className="py-28 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <RevealUp as="p" className="text-sm font-bold uppercase tracking-[0.18em] text-brand mb-3">Products & Platforms</RevealUp>
            <RevealUp as="h2" delay={0.08} className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">Four platforms. One ecosystem.</RevealUp>
            <RevealUp as="p" delay={0.14} className="text-gray-500 text-lg leading-relaxed">
              Each product is a standalone SaaS platform — and a building block of Esoko&apos;s integrated agricultural data ecosystem.
            </RevealUp>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PRODUCTS.map((p, i) => <ProductCard key={p.id} p={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* ECOSYSTEM VISUALISATION */}
      <section className="py-28 bg-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <RevealUp as="p" className="text-sm font-bold uppercase tracking-[0.18em] text-brand mb-3">Platform Architecture</RevealUp>
              <RevealUp as="h2" delay={0.08} className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">
                One Digital Ecosystem.{' '}<span className="text-emerald-700">Multiple Solutions.</span>
              </RevealUp>
              <RevealUp as="p" delay={0.14} className="text-gray-500 text-lg leading-relaxed mb-8">
                Every Esoko product connects to a shared data layer — meaning farmer profiles, field data, messages, and market prices all flow between platforms without duplication or manual transfers.
              </RevealUp>
              <RevealUp as="ul" delay={0.18} className="space-y-3">
                {ECOSYSTEM_FLOWS.map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </RevealUp>
            </div>
            <RevealUp delay={0.1} className="flex items-center justify-center">
              <EcosystemDiagram />
            </RevealUp>
          </div>
        </div>
      </section>

      {/* PRODUCTS vs SERVICES */}
      <section className="py-20 bg-gradient-to-br from-[#0B4D2E] to-[#051f12]">
        <div className="container mx-auto px-4 md:px-6">
          <RevealUp className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3">Products vs Services</h2>
            <p className="text-white/60 max-w-xl mx-auto">Understand the difference — and how they work together.</p>
          </RevealUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <RevealUp delay={0.08} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-3xl p-8">
              <div className="inline-flex items-center gap-2 bg-emerald-400/20 text-emerald-300 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
                <Layers className="w-3.5 h-3.5" /> Products & Platforms
              </div>
              <p className="text-white/70 text-sm mb-6 leading-relaxed">
                Self-service SaaS platforms you deploy and operate independently — each with its own domain, mobile apps, and real-time dashboard.
              </p>
              <div className="space-y-3">
                {PRODUCTS.map(p => {
                  const Icon = p.icon;
                  return (
                    <div key={p.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: p.color }}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">{p.name}</p>
                        <p className="text-xs text-white/50 truncate">{p.category}</p>
                      </div>
                      <a href={p.url} target="_blank" rel="noopener noreferrer" aria-label={`Open ${p.name} — new tab`}
                        className="text-white/40 hover:text-emerald-400 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  );
                })}
              </div>
            </RevealUp>

            <RevealUp delay={0.12} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-3xl p-8">
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/70 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
                <Users className="w-3.5 h-3.5" /> Professional Services
              </div>
              <p className="text-white/70 text-sm mb-6 leading-relaxed">
                Managed deployments and consulting engagements — Esoko&apos;s team designs, implements, and operates solutions for your specific programme.
              </p>
              <div className="space-y-3">
                {PROFESSIONAL_SERVICES.map(s => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">{s.label}</p>
                        <p className="text-xs text-white/50">{s.sub}</p>
                      </div>
                      {s.power && (
                        <span className="text-[10px] font-bold text-emerald-300 bg-emerald-400/15 px-2 py-0.5 rounded-full whitespace-nowrap">
                          via {s.power}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </RevealUp>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-28 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <RevealUp as="p" className="text-sm font-bold uppercase tracking-[0.18em] text-brand mb-3">Professional Services</RevealUp>
            <RevealUp as="h2" delay={0.08} className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              We don&apos;t just build tools.
              <br /><span className="text-emerald-700">We run programmes.</span>
            </RevealUp>
            <RevealUp as="p" delay={0.14} className="text-gray-500 text-lg leading-relaxed">
              Esoko&apos;s field operations and technical teams deliver end-to-end managed services — from design and deployment to ongoing operations and analytics.
            </RevealUp>
          </div>

          {/* Deployments */}
          <RevealUp className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-10 lg:p-14">
                <PoweredBadge label="Powered by Insyt" color="#0B4D2E" />
                <h3 className="text-3xl font-heading font-bold text-gray-900 mt-5 mb-4">Deployments</h3>
                <p className="text-gray-500 leading-relaxed mb-6">
                  Esoko coordinates large-scale field operations — from training and assigning thousands of enumerators to GPS tracking, performance management, and live progress dashboards.
                </p>
                <ul className="grid grid-cols-2 gap-3 mb-8">
                  {DEPLOYMENT_FEATURES.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
                <SiteLink href="/solutions/deployments" data-testid="link-deployments-learn-more"
                  className={buttonClass('rounded-full bg-[#0B4D2E] hover:bg-[#0B4D2E]/90 text-white h-auto px-7 py-3')}>
                  Learn More <ArrowRight className="w-4 h-4 ml-1.5" />
                </SiteLink>
              </div>
              <div className="bg-gradient-to-br from-[#0B4D2E] to-[#1a6b40] flex items-center justify-center p-12 min-h-[280px]">
                <div className="text-center text-white">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-80" />
                  <p className="text-4xl font-heading font-bold">50,000+</p>
                  <p className="text-white/60 mt-1">Field Agents Managed</p>
                </div>
              </div>
            </div>
          </RevealUp>

          {/* Software Development Services */}
          <RevealUp id="software-dev" className="mb-8">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 lg:p-14">
              <div className="max-w-xl mb-10">
                <h3 className="text-3xl font-heading font-bold text-gray-900 mb-4">Software Development Services</h3>
                <p className="text-gray-500 leading-relaxed">
                  Esoko&apos;s engineering team builds custom agricultural technology solutions — from data collection apps to AI analytics dashboards — on top of the Esoko platform.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {SOFTWARE_SERVICES.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <Motion key={s.title}
                      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className="group bg-gray-50 hover:bg-emerald-50 border border-gray-100 hover:border-emerald-200 rounded-2xl p-6 transition-all duration-200 flex flex-col">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center mb-4 transition-colors flex-shrink-0">
                        <Icon className="w-5 h-5 text-emerald-700" />
                      </div>
                      <h4 className="font-heading font-bold text-gray-900 text-sm mb-2">{s.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed flex-1">{s.desc}</p>
                      <a href={EXISTING_CONTACT_HREF} data-testid={`link-discuss-service-${i}`}
                        className="mt-4 text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition-colors">
                        Discuss this service <ArrowRight className="w-3 h-3" />
                      </a>
                    </Motion>
                  );
                })}
                <Motion
                  initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="bg-[#0B4D2E] rounded-2xl p-6 flex flex-col justify-between">
                  <p className="text-white font-semibold text-sm mb-2">Ready to build something remarkable?</p>
                  <p className="text-white/60 text-xs mb-5">Our engineering team designs, builds, and operates custom AgTech solutions from scratch.</p>
                  <a href={EXISTING_CONTACT_HREF} data-testid="link-talk-to-us"
                    className={buttonClass('rounded-full bg-white text-[#0B4D2E] hover:bg-white/90 h-auto px-5 py-2.5 text-sm font-bold w-fit')}>
                    Talk to Us <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </a>
                </Motion>
              </div>
            </div>
          </RevealUp>

          {/* Messaging Service */}
          <RevealUp className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="bg-gradient-to-br from-[#7c2d12] to-[#9a3412] flex items-center justify-center p-12 min-h-[280px] order-last lg:order-first">
                <div className="grid grid-cols-2 gap-4">
                  {MESSAGING_CHANNELS.map(ch => {
                    const Icon = ch.icon;
                    return (
                      <div key={ch.label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-center">
                        <Icon className="w-7 h-7 text-white mx-auto mb-2 opacity-80" />
                        <p className="text-white font-bold text-sm">{ch.label}</p>
                        <p className="text-white/50 text-[10px] mt-1">{ch.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="p-10 lg:p-14">
                <PoweredBadge label="Powered by Push" color="#7c2d12" />
                <h3 className="text-3xl font-heading font-bold text-gray-900 mt-5 mb-4">Messaging Services</h3>
                <p className="text-gray-500 leading-relaxed mb-6">
                  Esoko designs and manages end-to-end messaging campaigns — from content creation and farmer segmentation to delivery optimization and analytics — at millions-per-day scale.
                </p>
                <ul className="space-y-2 mb-8">
                  {MESSAGING_SERVICE_FEATURES.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-[#9a3412] flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <a href="https://push.esoko.com/" target="_blank" rel="noopener noreferrer" aria-label="Open Push Messaging platform — new tab"
                  className={buttonClass('rounded-full bg-[#9a3412] hover:bg-[#7c2d12] text-white h-auto px-7 py-3')}>
                  Explore Push <ExternalLink className="w-4 h-4 ml-1.5" />
                </a>
              </div>
            </div>
          </RevealUp>

          {/* Content Service */}
          <RevealUp className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-10 lg:p-14">
                <PoweredBadge label="Powered by E Content" color="#166534" />
                <h3 className="text-3xl font-heading font-bold text-gray-900 mt-5 mb-4">Content Services</h3>
                <p className="text-gray-500 leading-relaxed mb-6">
                  Esoko&apos;s content team curates, localizes, and distributes agricultural advisory content across seven thematic areas — with editorial oversight and continuous impact measurement.
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {CONTENT_CATEGORIES.map(c => {
                    const Icon = c.icon;
                    return (
                      <span key={c.label} className="inline-flex items-center gap-1.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 rounded-full">
                        <Icon className="w-3.5 h-3.5" /> {c.label}
                      </span>
                    );
                  })}
                </div>
                <a href="https://content-web.esoko.com/" target="_blank" rel="noopener noreferrer" aria-label="Open E Content platform — new tab"
                  className={buttonClass('rounded-full bg-[#166534] hover:bg-[#14532d] text-white h-auto px-7 py-3')}>
                  Explore E Content <ExternalLink className="w-4 h-4 ml-1.5" />
                </a>
              </div>
              <div className="bg-gradient-to-br from-[#14532d] to-[#166534] flex items-center justify-center p-12 min-h-[280px]">
                <div className="text-center text-white">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-80" />
                  <p className="text-4xl font-heading font-bold">2M+</p>
                  <p className="text-white/60 mt-1">Active Advisory Subscribers</p>
                </div>
              </div>
            </div>
          </RevealUp>
        </div>
      </section>

      {/* TECHNOLOGY ECOSYSTEM */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <RevealUp as="p" className="text-sm font-bold uppercase tracking-[0.18em] text-brand mb-3">Technology Architecture</RevealUp>
            <RevealUp as="h2" delay={0.08} className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              Built for Africa.{' '}<span className="text-emerald-700">Designed to Scale.</span>
            </RevealUp>
            <RevealUp as="p" delay={0.14} className="text-gray-500 text-lg">
              Every capability below is live in production across 40+ countries — not a roadmap item.
            </RevealUp>
          </div>

          <div className="max-w-4xl mx-auto">
            {ARCHITECTURE_LAYERS.map((row, ri) => (
              <Motion key={row.layer}
                initial={{ opacity: 0, x: ri % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.5, delay: ri * 0.1 }}
                className="mb-4">
                <div className={`${row.bg} ${row.border} border rounded-2xl p-5`}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2" style={{ color: row.color }}>
                    <span className="w-5 h-0.5 inline-block" style={{ background: row.color }} />
                    {row.layer} Layer
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {row.items.map((item, ii) => {
                      const Icon = item.icon;
                      return (
                        <Motion key={item.label}
                          initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: ri * 0.1 + ii * 0.05 }}
                          className="bg-white rounded-xl p-4 flex flex-col items-center gap-2.5 text-center border border-white shadow-sm hover:shadow-md transition-shadow">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${row.color}18` }}>
                            <Icon className="w-4.5 h-4.5" style={{ color: row.color }} />
                          </div>
                          <span className="text-xs font-semibold text-gray-700 leading-tight">{item.label}</span>
                        </Motion>
                      );
                    })}
                  </div>
                </div>
                {ri < 2 && (
                  <div className="flex justify-center my-1" aria-hidden="true">
                    <ChevronRight className="w-5 h-5 text-gray-300 rotate-90" />
                  </div>
                )}
              </Motion>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-28 overflow-hidden bg-[#051f12]">
        <Image src={PRODUCTS_CTA_IMAGE} alt="" fill sizes="100vw" className="object-cover object-center" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#051f12]/90 via-[#0B4D2E]/80 to-[#051f12]/95" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <RevealUp as="h2" className="text-4xl md:text-5xl font-heading font-bold text-white mb-5">Ready to transform your programme?</RevealUp>
          <RevealUp as="p" delay={0.08} className="text-white/60 text-lg max-w-xl mx-auto mb-10">
            Whether you need a single platform or a fully managed deployment — our team is ready to design the right solution for you.
          </RevealUp>
          <RevealUp delay={0.14} className="flex flex-wrap items-center justify-center gap-4">
            <a href={EXISTING_CONTACT_HREF} data-testid="link-cta-book-demo"
              className={buttonClass('rounded-full px-10 py-4 bg-brand hover:bg-brand/90 text-white font-bold text-base h-auto shadow-2xl shadow-brand/30')}>
              Book a Demo <ArrowRight className="w-4 h-4 ml-1.5" />
            </a>
            <ScrollButton target="products" testId="button-cta-explore-products"
              className={buttonClass('rounded-full px-10 py-4 border-white/25 text-white hover:bg-white/10 bg-transparent font-semibold text-base h-auto', 'outline')}>
              Explore Products
            </ScrollButton>
          </RevealUp>
        </div>
      </section>
    </div>
  );
}
