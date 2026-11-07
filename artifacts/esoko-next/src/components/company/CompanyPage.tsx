import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { TrustSection } from '@/components/home/sections/TrustSection';
import { SiteLink } from '@/components/site/SiteLink';
import { DEMO_HREF } from '@/lib/site-links';
import { CompanyNav } from './CompanyNav';
import { CompanyHero } from './CompanyHero';
import { Reveal } from './Reveal';
import { ScrollToButton, WorkWithEsokoButton } from './CompanyButtons';
import { ASSET_BASE } from './CompanyData';
import {
  MissionSection, OverviewSection, ImpactSection, JourneySection,
  PresenceSection, MarketOpportunitySection, WhyEsokoSection,
  ProductEcosystemSection, FinalStorySection, ValuesSection
} from './CompanySections';
import { GallerySection } from './GallerySection';
import { TeamSection } from './TeamSection';
import { StoryVideoSection } from './StoryVideoSection';

/** Server entry for /company. Root layout supplies the shared Navbar/Footer. */
export function CompanyPage() {
  return (
    <div className="esoko-home company-page min-h-screen flex flex-col bg-white">
      <CompanyNav />
      <main>
        <CompanyHero
          background={
            <>
              <Image
                src={`${ASSET_BASE}/about-hero.jpg`}
                alt="Esoko field agent in action"
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#042B10]/80 via-[#042B10]/60 to-[#042B10]/90" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#042B10]/60 via-transparent to-[#042B10]/40" />
            </>
          }
        >
          <div className="relative z-10 container mx-auto px-4 md:px-6 text-center py-36">
            <Reveal as="span" hidden={{ opacity: 0, y: 20 }} visible={{ opacity: 1, y: 0 }} duration={0.5}
              className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-emerald-400 mb-6 bg-emerald-400/10 px-5 py-2 rounded-full border border-emerald-400/20">
              About Esoko
            </Reveal>
            <Reveal as="h1" hidden={{ opacity: 0, y: 32 }} visible={{ opacity: 1, y: 0 }} delay={0.1} duration={0.7}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white max-w-5xl mx-auto leading-[1.08] mb-6">
              Empowering Farmers.<br />
              <span className="bg-gradient-to-r from-emerald-400 to-[#D9531E] bg-clip-text text-transparent">
                Restoring Earth.
              </span>
            </Reveal>
            <Reveal as="p" hidden={{ opacity: 0, y: 20 }} visible={{ opacity: 1, y: 0 }} delay={0.25}
              className="text-lg md:text-xl text-white/65 max-w-2xl mx-auto mb-10 leading-relaxed">
              Since 2008, Esoko has been building digital solutions that connect people, data and services to create meaningful impact across Africa.
            </Reveal>
            <Reveal hidden={{ opacity: 0, y: 16 }} visible={{ opacity: 1, y: 0 }} delay={0.38} duration={0.55}
              className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <ScrollToButton target="overview" testId="company-button-explore-story"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white rounded-full px-8 py-4 font-semibold shadow-lg hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-200">
                Explore Our Story <ArrowRight className="w-4 h-4" />
              </ScrollToButton>
              <WorkWithEsokoButton testId="company-button-work-with-esoko"
                className="inline-flex items-center gap-2 border border-white/30 text-white rounded-full px-8 py-4 font-semibold hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200">
                Work With Esoko
              </WorkWithEsokoButton>
            </Reveal>
          </div>
        </CompanyHero>

        <div id="partners" className="scroll-mt-24">
          <TrustSection />
        </div>

        <section id="about" className="scroll-mt-24 py-24 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <Reveal hidden={{ opacity: 0, x: -30 }} visible={{ opacity: 1, x: 0 }} className="lg:col-span-5">
                <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-600 mb-4 bg-emerald-50 px-5 py-2 rounded-full border border-emerald-100">
                  Who We Are
                </span>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 leading-tight">
                  Technology Built Around People.
                </h2>
              </Reveal>

              <div className="hidden lg:block lg:col-span-1 h-32 w-px bg-gradient-to-b from-gray-200 to-transparent mx-auto" />

              <Reveal hidden={{ opacity: 0, x: 30 }} visible={{ opacity: 1, x: 0 }} delay={0.2} className="lg:col-span-6 space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  Esoko addresses the complex challenges of agriculture, climate change, and development in Africa by building digital platforms that work where others don&apos;t.
                </p>
                <p>
                  We believe that connecting rural communities to accurate data, reliable communication, and essential services is the foundation of inclusive economic growth. From farmer advisory via SMS to large-scale biometric registries and agricultural marketplaces, our platforms are designed to bridge the last-mile connectivity gap.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        <StoryVideoSection />
        <MissionSection />
        <OverviewSection />
        <JourneySection />
        <ImpactSection />
        <PresenceSection />
        <TeamSection />
        <GallerySection />

        <MarketOpportunitySection />
        <WhyEsokoSection />
        <ProductEcosystemSection />
        <ValuesSection />
        <FinalStorySection />

        <section className="py-24 bg-[#042B10] text-center px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">Let&apos;s Create Impact Together.</h2>
            <p className="text-white/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Whether you&apos;re looking to deploy technology, build a partnership or explore what Esoko can do for your organisation, let&apos;s start a conversation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <WorkWithEsokoButton testId="company-button-final-work-with-esoko"
                className="inline-flex items-center gap-2 bg-[#D9531E] hover:bg-[#c84b16] text-white rounded-full px-8 py-4 font-semibold transition-colors">
                Work With Esoko <ArrowRight className="w-4 h-4" />
              </WorkWithEsokoButton>
              <SiteLink href="/products-services" data-testid="company-link-products-services"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-full px-8 py-4 font-semibold transition-colors">
                Explore Products & Services
              </SiteLink>
              <a href={DEMO_HREF} data-testid="company-link-contact"
                className="inline-flex items-center gap-2 border border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-400 rounded-full px-8 py-4 font-semibold transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
