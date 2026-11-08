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
    <div className="esoko-home company-page min-h-[100dvh] flex flex-col bg-background">
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
            </>
          }
        >
          <div className="relative z-10 container mx-auto px-4 py-28 text-left md:px-6 md:py-36">
            <Reveal as="span" hidden={{ opacity: 0, y: 20 }} visible={{ opacity: 1, y: 0 }} duration={0.5}
              className="mb-6 inline-block rounded-full border border-white/40 bg-primary/70 px-5 py-2 text-sm font-semibold tracking-wide text-white">
              About Esoko
            </Reveal>
            <Reveal as="h1" hidden={{ opacity: 0, y: 32 }} visible={{ opacity: 1, y: 0 }} delay={0.1} duration={0.7}
              className="mb-6 max-w-2xl font-heading text-4xl font-bold leading-[1.08] text-white sm:text-5xl md:text-6xl lg:max-w-xl xl:max-w-3xl xl:text-7xl">
              Empowering Farmers.<br />
              <span>
                Restoring Earth.
              </span>
            </Reveal>
            <Reveal as="p" hidden={{ opacity: 0, y: 20 }} visible={{ opacity: 1, y: 0 }} delay={0.25}
              className="mb-10 max-w-2xl text-lg leading-relaxed text-white lg:max-w-xl xl:max-w-2xl">
              Since 2008, Esoko has been building digital solutions that connect people, data and services to create meaningful impact across Africa.
            </Reveal>
            <Reveal hidden={{ opacity: 0, y: 16 }} visible={{ opacity: 1, y: 0 }} delay={0.38} duration={0.55}
              className="flex flex-col items-start gap-4 sm:flex-row">
              <ScrollToButton target="overview" testId="company-button-explore-story"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand px-8 py-4 text-xl font-bold text-white transition-shadow duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary">
                Explore Our Story <ArrowRight className="w-4 h-4" />
              </ScrollToButton>
              <WorkWithEsokoButton testId="company-button-work-with-esoko"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/70 px-8 py-4 font-semibold text-white transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                Work With Esoko
              </WorkWithEsokoButton>
            </Reveal>
          </div>
        </CompanyHero>

        <div id="partners" className="scroll-mt-24">
          <TrustSection />
        </div>

        <section id="about" className="scroll-mt-24 border-b border-border bg-background py-20 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
              <Reveal hidden={{ opacity: 0, x: -30 }} visible={{ opacity: 1, x: 0 }} className="lg:col-span-5">
                <span className="mb-4 inline-block rounded-full border border-border bg-muted px-5 py-2 text-sm font-semibold text-primary">
                  Who We Are
                </span>
                <h2 className="font-heading text-3xl font-bold leading-tight text-foreground md:text-4xl">
                  Technology Built Around People.
                </h2>
                <figure className="relative mt-8 aspect-[4/3] overflow-hidden rounded-xl">
                  <Image
                    src={`${ASSET_BASE}/company-gallery/hands-holding-maize-kernels.webp`}
                    alt="Cupped hands holding pale maize kernels."
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                </figure>
              </Reveal>

              <Reveal hidden={{ opacity: 0, x: 30 }} visible={{ opacity: 1, x: 0 }} delay={0.2} className="space-y-6 text-base leading-relaxed text-muted-foreground md:text-lg lg:col-span-7">
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

        <section className="bg-primary px-4 py-20 text-center text-primary-foreground md:py-24">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">Let&apos;s Create Impact Together.</h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-primary-foreground md:text-xl">
              Whether you&apos;re looking to deploy technology, build a partnership or explore what Esoko can do for your organisation, let&apos;s start a conversation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <WorkWithEsokoButton testId="company-button-final-work-with-esoko"
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-secondary px-8 py-4 font-semibold text-secondary-foreground transition-colors hover:bg-secondary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                Work With Esoko <ArrowRight className="w-4 h-4" />
              </WorkWithEsokoButton>
              <SiteLink href="/products-services" data-testid="company-link-products-services"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/70 px-8 py-4 font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                Explore Products & Services
              </SiteLink>
              <a href={DEMO_HREF} data-testid="company-link-contact"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/70 px-8 py-4 font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
