import Image from 'next/image';
import { ArrowRight, ChevronRight, CheckCircle2, Globe2, Building2 } from 'lucide-react';
import { SiteLink } from '@/components/site/SiteLink';
import { DEMO_HREF } from '@/lib/site-links';
import type { SectorData } from '@/data/sectors';
import { buttonClass } from './button-styles';
import { FadeUp, RevealUp } from './Motion';
import { SectorStories } from './SectorStories';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];
const fade = { duration: 0.6, ease: EASE };
const rev = { y: 24, duration: 0.5, ease: EASE };

/** Server entry for /sectors/[slug]. */
export function SectorDetailPage({ sector }: { sector: SectorData }) {
  const Icon = sector.icon;
  return (
    <div className="esoko-home min-h-screen w-full bg-background flex flex-col font-sans overflow-x-hidden">
      <main>
        {/* HERO */}
        <section className="relative min-h-[70vh] flex items-end pb-24 bg-[#051f12] overflow-hidden pt-32">
          <Image src={sector.heroImage} alt={sector.imageAlt} fill priority sizes="100vw" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#051f12] via-[#051f12]/80 to-transparent" />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-4xl">
              <FadeUp {...fade} className="flex items-center gap-2 text-sm text-emerald-400 font-medium mb-8">
                <SiteLink href="/sectors" data-testid="link-breadcrumb-sectors" className="hover:text-white transition-colors">Sectors</SiteLink>
                <ChevronRight className="w-4 h-4 opacity-50" />
                <span className="text-white">{sector.name}</span>
              </FadeUp>
              <FadeUp {...fade} delay={0.1} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-bold uppercase tracking-[0.15em] mb-6">
                <Icon className="w-3.5 h-3.5" /> {sector.category}
              </FadeUp>
              <FadeUp as="h1" {...fade} delay={0.2} className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white leading-[1.1] mb-6 tracking-tight">
                {sector.headline}
              </FadeUp>
              <FadeUp as="p" {...fade} delay={0.3} className="text-lg md:text-xl text-emerald-50/80 max-w-2xl leading-relaxed font-light">
                {sector.description}
              </FadeUp>
            </div>
          </div>
        </section>

        {/* CONTENT & SIDEBAR */}
        <section className="py-24 bg-white relative">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col lg:flex-row gap-16">
              <div className="w-full lg:w-2/3">
                <RevealUp {...rev}>
                  <h2 className="text-3xl font-heading font-bold text-gray-900 mb-8">Primary Use Cases</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
                    {sector.useCases.map(uc => (
                      <div key={uc} className="flex items-start gap-3 p-5 rounded-2xl bg-gray-50 border border-gray-100">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 font-medium leading-snug">{uc}</span>
                      </div>
                    ))}
                  </div>
                </RevealUp>

                <RevealUp {...rev}>
                  <h2 className="text-3xl font-heading font-bold text-gray-900 mb-8">Esoko Capabilities</h2>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    We deploy a combination of our core platforms to deliver solutions specifically tailored for the {sector.name.toLowerCase()} sector.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
                    {sector.capabilities.map(cap => {
                      const CapIcon = cap.icon;
                      return (
                        <div key={cap.name} className="flex items-center gap-4 p-5 rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all">
                          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                            <CapIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{cap.name}</h4>
                            <SiteLink href="/products-services" className="text-xs text-emerald-600 hover:underline font-medium mt-1 inline-block">
                              View Platform
                            </SiteLink>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </RevealUp>
              </div>

              <div className="w-full lg:w-1/3">
                <div className="sticky top-28 space-y-8">
                  <RevealUp {...rev} delay={0.1} className="bg-gray-900 rounded-3xl p-8 text-white">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-6">Sector Impact</h3>
                    <div className="space-y-6">
                      {sector.statistics.map(stat => (
                        <div key={stat.label} className="border-l-2 border-emerald-500/30 pl-4">
                          <div className="text-3xl font-heading font-bold text-white mb-1">{stat.value}</div>
                          <div className="text-sm text-gray-400 font-medium uppercase tracking-wide">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </RevealUp>

                  <RevealUp {...rev} delay={0.2} className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-800 mb-6">Who We Work With</h3>
                    <ul className="space-y-4">
                      {sector.audience.map(aud => (
                        <li key={aud} className="flex items-start gap-3">
                          <Building2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                          <span className="text-emerald-900 font-medium">{aud}</span>
                        </li>
                      ))}
                    </ul>
                  </RevealUp>

                  <RevealUp {...rev} delay={0.3} className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm text-center">
                    <Globe2 className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to transform your operations?</h3>
                    <p className="text-sm text-gray-500 mb-6">Speak with an Esoko expert about our {sector.name.toLowerCase()} solutions.</p>
                    <a href={DEMO_HREF} data-testid="link-book-consultation"
                      className={buttonClass('w-full bg-brand hover:bg-brand/90 text-white rounded-full')}>
                      Book a Consultation
                    </a>
                  </RevealUp>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CMS-BACKED CUSTOMER STORIES */}
        <section className="py-24 bg-gray-50 border-t border-gray-100">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <RevealUp as="h2" {...rev} className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">Success Stories</RevealUp>
                <RevealUp as="p" {...rev} delay={0.1} className="text-lg text-gray-600 max-w-2xl">
                  Verified customer stories are loaded directly from Esoko’s Resources CMS when they are published.
                </RevealUp>
              </div>
              <RevealUp {...rev} delay={0.2}>
                <SiteLink href="/resources/customer-stories" data-testid="link-all-case-studies"
                  className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
                  View all case studies <ArrowRight className="w-4 h-4" />
                </SiteLink>
              </RevealUp>
            </div>
            <SectorStories />
          </div>
        </section>

        <section className="bg-[#071d12] py-24 text-center text-white">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-4xl font-bold md:text-5xl">Discuss your {sector.name.toLowerCase()} challenge</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/70">
              Bring Esoko your operating context, programme goals and field constraints. The team will help shape the right combination of platforms and services.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <a href={DEMO_HREF} data-testid="link-book-demo"
                className={buttonClass('rounded-full bg-brand px-8 py-6 text-base font-semibold text-white hover:bg-brand/90')}>
                Book a Demo
              </a>
              <SiteLink href="/products-services" data-testid="link-explore-products-services"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/25 px-8 py-3 font-semibold text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
                Explore Products &amp; Services <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </SiteLink>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
