import Image from 'next/image';
import { ArrowRight, ChevronRight, Globe2, CheckCircle2 } from 'lucide-react';
import { SiteLink } from '@/components/site/SiteLink';
import { EXISTING_CONTACT_HREF } from '@/lib/site-links';
import { SECTORS_DATA, SECTORS_HERO_IMAGE, SECTORS_CTA_IMAGE, type SectorData } from '@/data/sectors';
import { IMPACT_PROOF, UNIVERSAL_CAPABILITIES } from '@/data/sectors-page';
import { buttonClass } from './button-styles';
import { Motion, FadeUp, RevealUp } from './Motion';
import { ScrollButton } from './ScrollButton';
import { SectorExplorer } from './SectorExplorer';
import { OperatingContexts } from './OperatingContexts';
import { SectorStories } from './SectorStories';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const MATRIX_COLUMNS: ((s: SectorData) => boolean)[] = [
  s => s.capabilities.some(c => c.name.includes('Insyt') || c.name.includes('Data Collection') || c.name.includes('Farmer Data')),
  s => s.capabilities.some(c => c.name.includes('Messaging') || c.name.includes('Voice')),
  s => s.capabilities.some(c => c.name.includes('E-Content')),
  s => s.capabilities.some(c => c.name.includes('Marketplace') || c.name.includes('Commerce')),
  s => s.capabilities.some(c => c.name.includes('AI') || c.name.includes('Analytics') || c.name.includes('Intelligence')),
];

/** Server entry for /sectors. Interactive explorers are isolated client components. */
export function SectorsPage() {
  return (
    <div className="esoko-home min-h-screen w-full bg-background flex flex-col font-sans overflow-x-hidden">
      <main>
        {/* HERO */}
        <section className="relative min-h-[95vh] flex items-center bg-[#051f12] overflow-hidden pt-20">
          <Image src={SECTORS_HERO_IMAGE} alt="Two African farmers reviewing agricultural information together on a smartphone"
            fill priority sizes="100vw" className="absolute inset-0 h-full w-full scale-[1.02] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#051f12]/95 via-[#0B4D2E]/80 to-transparent" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <div className="absolute top-[20%] right-[10%] w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-[10%] left-[15%] w-72 h-72 bg-brand/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-4 md:px-6 relative z-10 py-24">
            <div className="max-w-4xl">
              <FadeUp duration={0.6} ease={EASE} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-bold uppercase tracking-[0.15em] mb-8">
                <Globe2 className="w-3.5 h-3.5" /> Sectors
              </FadeUp>
              <FadeUp as="h1" delay={0.1} duration={0.6} ease={EASE} className="text-4xl sm:text-5xl lg:text-7xl font-heading font-bold text-white leading-[1.1] mb-6 tracking-tight">
                Digital Solutions Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-200">Real-World Impact</span>
              </FadeUp>
              <FadeUp as="p" delay={0.2} duration={0.6} ease={EASE} className="text-lg md:text-xl text-emerald-50/80 max-w-2xl mb-10 leading-relaxed font-light">
                From farms and financial services to government programmes, climate action, education and supply chains, Esoko connects people, data and services across Africa.
              </FadeUp>
              <FadeUp delay={0.3} duration={0.6} ease={EASE} className="flex flex-wrap items-center gap-4">
                <ScrollButton target="explorer" testId="button-explore-sectors"
                  className={buttonClass('rounded-full px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-base h-auto shadow-xl shadow-emerald-900/40')}>
                  Explore Sectors <ArrowRight className="w-4 h-4 ml-1.5" />
                </ScrollButton>
                <a href={EXISTING_CONTACT_HREF} data-testid="link-hero-talk-to-esoko"
                  className={buttonClass('rounded-full px-8 py-4 border-white/25 text-white hover:bg-white/10 bg-transparent font-semibold text-base h-auto', 'outline')}>
                  Talk to Esoko
                </a>
              </FadeUp>
            </div>
          </div>

          <ScrollButton target="explorer" bounce ease="easeInOut" ariaLabel="Scroll to sector explorer"
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 hover:text-white/80 transition-colors">
            <ChevronRight className="w-8 h-8 rotate-90" />
          </ScrollButton>
        </section>

        {/* INTERACTIVE SECTOR EXPLORER */}
        <section id="explorer" className="py-24 md:py-32 bg-gray-50 relative">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mb-16">
              <RevealUp as="h2" y={24} duration={0.5} ease={EASE} className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-6">Explore Our Sectors</RevealUp>
              <RevealUp as="p" y={24} delay={0.1} duration={0.5} ease={EASE} className="text-xl text-gray-600 leading-relaxed font-light">
                Discover how Esoko&apos;s technology supports organizations and communities across different sectors.
              </RevealUp>
            </div>
            <SectorExplorer />
          </div>
        </section>

        {/* AFRICA OPERATING-CONTEXT EXPLORER */}
        <section className="py-24 bg-white overflow-hidden border-t border-gray-100">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <RevealUp as="p" y={24} duration={0.5} ease={EASE} className="text-sm font-bold uppercase tracking-widest text-emerald-600 mb-3">Technology Across Africa</RevealUp>
              <RevealUp as="h2" y={24} delay={0.1} duration={0.5} ease={EASE} className="text-3xl md:text-5xl font-heading font-bold text-gray-900">Scaling Impact Where It Matters</RevealUp>
            </div>
            <OperatingContexts />
          </div>
        </section>

        <section className="bg-[#071d12] py-24 text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-gold">Verified impact</p>
                <h2 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">Built on years of work in the field</h2>
                <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
                  These organisation-wide figures are already published across Esoko’s website and are not sector-specific estimates.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-white/10 lg:grid-cols-4">
                {IMPACT_PROOF.map(stat => (
                  <div key={stat.label} className="bg-white/[0.04] p-6 md:p-8">
                    <p className="text-3xl font-bold text-white md:text-4xl">{stat.value}</p>
                    <p className="mt-2 text-sm leading-snug text-white/60">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTOR TO SOLUTION MATRIX */}
        <section className="py-24 bg-gray-900 text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <RevealUp as="h2" y={24} duration={0.5} ease={EASE} className="text-3xl md:text-5xl font-heading font-bold mb-6">One Platform. Multiple Sectors.</RevealUp>
              <RevealUp as="p" y={24} delay={0.1} duration={0.5} ease={EASE} className="text-xl text-gray-400 font-light">How Esoko products support different industries.</RevealUp>
            </div>

            <div className="overflow-x-auto pb-8 hide-scrollbar">
              <RevealUp y={24} delay={0.2} duration={0.5} ease={EASE} className="min-w-[800px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="py-4 px-6 border-b border-gray-800 text-gray-400 font-semibold w-1/4">Sector</th>
                      <th className="py-4 px-4 border-b border-gray-800 text-center font-semibold text-sm">Insyt</th>
                      <th className="py-4 px-4 border-b border-gray-800 text-center font-semibold text-sm">Messaging</th>
                      <th className="py-4 px-4 border-b border-gray-800 text-center font-semibold text-sm">E-Content</th>
                      <th className="py-4 px-4 border-b border-gray-800 text-center font-semibold text-sm">Marketplace</th>
                      <th className="py-4 px-4 border-b border-gray-800 text-center font-semibold text-sm">AI Analytics</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {SECTORS_DATA.map((sector, i) => (
                      <Motion as="tr" key={sector.id} respectReduced={false}
                        initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                        transition={{ delay: 0.1 * i }}
                        className="hover:bg-gray-800/30 transition-colors">
                        <td className="py-5 px-6 font-medium text-gray-200">{sector.name}</td>
                        {MATRIX_COLUMNS.map((has, ci) => (
                          <td key={ci} className="py-5 px-4 text-center">
                            {has(sector) && (
                              <div className="w-6 h-6 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center"><CheckCircle2 className="w-4 h-4" /></div>
                            )}
                          </td>
                        ))}
                      </Motion>
                    ))}
                  </tbody>
                </table>
              </RevealUp>
            </div>
          </div>
        </section>

        {/* WHY ESOKO */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <RevealUp as="h2" y={24} duration={0.5} ease={EASE} className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-4">Enterprise Ready for Any Sector</RevealUp>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {UNIVERSAL_CAPABILITIES.map((cap, i) => (
                <RevealUp key={cap.title} y={24} delay={i * 0.1} duration={0.5} ease={EASE}
                  className="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:border-emerald-200 transition-colors">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-6">
                    <cap.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{cap.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{cap.desc}</p>
                </RevealUp>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-emerald-50/60 py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12 max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">Customer evidence</p>
              <h2 className="mt-4 text-4xl font-bold text-gray-900 md:text-5xl">Stories from the field</h2>
              <p className="mt-5 text-lg leading-relaxed text-gray-600">
                Published customer stories are loaded directly from Esoko’s Resources CMS.
              </p>
            </div>
            <SectorStories />
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative py-32 bg-[#051f12] overflow-hidden">
          <Image src={SECTORS_CTA_IMAGE} alt="" aria-hidden="true" fill sizes="100vw" className="object-cover object-center opacity-40 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#051f12] via-[#051f12]/80 to-transparent" />
          <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
            <RevealUp as="h2" y={24} duration={0.5} ease={EASE} className="text-4xl md:text-6xl font-heading font-bold text-white mb-6">
              Your Sector. Your Challenge.<br />
              <span className="text-emerald-400">Our Technology.</span>
            </RevealUp>
            <RevealUp as="p" y={24} delay={0.1} duration={0.5} ease={EASE} className="text-xl text-emerald-50/70 max-w-2xl mx-auto mb-10 font-light">
              Tell us what you&apos;re trying to achieve and we&apos;ll help you design the right digital solution for your specific operational context.
            </RevealUp>
            <RevealUp y={24} delay={0.2} duration={0.5} ease={EASE} className="flex flex-wrap items-center justify-center gap-4">
              <a href={EXISTING_CONTACT_HREF} data-testid="link-cta-talk-to-esoko"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-8 py-3 text-lg font-semibold text-white hover:bg-brand/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
                Talk to Esoko
              </a>
              <SiteLink href="/products-services" data-testid="link-cta-explore-products"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 bg-transparent px-8 py-3 text-lg font-semibold text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
                Explore Products
              </SiteLink>
              <a href={EXISTING_CONTACT_HREF} data-testid="link-cta-book-demo"
                className={buttonClass('rounded-full bg-white px-8 py-6 text-lg font-semibold text-emerald-950 hover:bg-emerald-50')}>
                Book a Demo
              </a>
            </RevealUp>
          </div>
        </section>
      </main>
    </div>
  );
}
