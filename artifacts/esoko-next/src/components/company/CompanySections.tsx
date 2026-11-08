import Image from 'next/image';
import { ArrowRight, MapPin } from 'lucide-react';
import { SiteLink } from '@/components/site/SiteLink';
import { Reveal } from './Reveal';
import { JourneyTimeline } from './JourneyTimeline';
import { ScrollToButton } from './CompanyButtons';
import {
  ASSET_BASE, IMPACT_PATH, MISSION_PILLARS, OVERVIEW_BLOCKS,
  WHY_ESOKO, ECOSYSTEM_LINKS, VALUES
} from './CompanyData';

const UP = { opacity: 0, y: 20 };
const SHOWN_Y = { opacity: 1, y: 0 };

export function MissionSection() {
  return (
    <section id="mission" className="scroll-mt-24 relative overflow-hidden bg-primary py-20 text-primary-foreground md:py-24">
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <Reveal hidden={UP} visible={SHOWN_Y} className="text-center mb-16">
          <span className="mb-4 inline-block rounded-full border border-white/40 px-5 py-2 text-sm font-semibold text-white">
            Our Mission
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">
            Empowering Farmers.<br />Restoring Earth.
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white">
            Connecting last-mile communities with services through digital innovations — empowering farmers, governments, and enterprises across Africa.
          </p>
        </Reveal>

        <div className="relative grid grid-cols-1 gap-0 divide-y divide-white/30 md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-4">
          {MISSION_PILLARS.map((pillar, i) => (
            <Reveal
              key={pillar.title}
              hidden={{ opacity: 0, y: 30 }} visible={SHOWN_Y} delay={0.1 + i * 0.1}
              className="relative z-10 px-6 py-8 md:px-7 lg:px-8"
            >
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-full border border-white/70">
                <div className="h-2.5 w-2.5 rounded-full bg-secondary" />
              </div>
              <h3 className="mb-3 font-bold text-white">{pillar.title}</h3>
              <p className="text-base leading-relaxed text-white">{pillar.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OverviewSection() {
  return (
    <section id="overview" className="scroll-mt-24 relative overflow-hidden bg-muted py-20 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <Reveal hidden={UP} visible={SHOWN_Y} className="text-center mb-16">
          <span className="mb-4 inline-block rounded-full border border-border bg-background px-5 py-2 text-sm font-semibold text-primary">
            Company Overview
          </span>
          <h2 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
            Connecting People, Data and Opportunity
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
            We build technology around people, addressing the unique challenges of agriculture, climate, and development in Africa through accessible digital platforms.
          </p>
        </Reveal>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-x-10 gap-y-0 divide-y divide-border md:grid-cols-2 md:divide-y-0">
          {OVERVIEW_BLOCKS.map((block, i) => {
            const Icon = block.icon;
            return (
              <Reveal
                key={block.title}
                hidden={{ opacity: 0, scale: 0.95 }} visible={{ opacity: 1, scale: 1 }} delay={i * 0.1}
                className="group relative bg-transparent py-8 md:px-3"
              >
                <div className="flex items-start gap-5">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-background text-primary">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="mb-2 font-heading text-lg font-bold text-foreground">{block.title}</h3>
                    <p className="mb-4 text-base leading-relaxed text-muted-foreground">{block.desc}</p>
                    <SiteLink href={block.link} data-testid={`company-overview-link-${i}`} className="inline-flex min-h-11 items-center gap-1.5 rounded font-semibold text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                      Learn more <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </SiteLink>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ImpactSection() {
  return (
    <section id="impact" className="scroll-mt-24 relative overflow-hidden bg-background py-20 md:py-24">
      <div className="relative z-10 container mx-auto px-4 text-center md:px-6">
        <Reveal hidden={UP} visible={SHOWN_Y} className="mb-16">
          <span className="mb-4 inline-block rounded-full border border-border bg-muted px-5 py-2 text-sm font-semibold text-primary">
            Our Impact
          </span>
          <h2 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
            Technology That Reaches the Last Mile
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Our approach connects people, field information and digital services so organisations can move from insight to practical action.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {IMPACT_PATH.map((stage, i) => {
              const Icon = stage.icon;
              return (
                <Reveal
                  key={stage.title}
                  hidden={{ opacity: 0, y: 30 }} visible={SHOWN_Y} delay={0.1 + i * 0.1}
                  className="group flex items-start gap-4 border-t border-border px-4 py-6 text-left transition-colors hover:bg-muted/60 sm:px-6"
                  data-testid={`impact-stage-${i}`}
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-muted text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-foreground">{stage.title}</h3>
                    <p className="mt-1 text-base leading-relaxed text-muted-foreground">{stage.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Reveal>

        <Reveal hidden={{ opacity: 0 }} visible={{ opacity: 1 }} delay={0.6} className="hidden md:flex items-center justify-between max-w-4xl mx-auto mt-20 relative">
            <div className="absolute top-1/2 left-0 right-0 z-0 h-px -translate-y-1/2 bg-primary/50" />
          {['PEOPLE', 'DATA', 'DIGITAL SERVICES', 'DECISIONS', 'ACTION', 'IMPACT'].map((node) => (
            <div key={node} className="relative z-10 group flex flex-col items-center">
              <div className="h-3.5 w-3.5 rounded-full border-2 border-primary bg-background transition-transform group-hover:scale-125 group-hover:bg-secondary" />
              <span className="absolute top-8 whitespace-nowrap text-sm font-semibold text-foreground">
                {node}
              </span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function JourneySection() {
  return (
    <>
      <section id="journey" className="scroll-mt-24 relative overflow-hidden bg-background py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <Reveal hidden={UP} visible={SHOWN_Y} className="text-center mb-16">
            <span className="mb-4 inline-block rounded-full border border-border bg-muted px-5 py-2 text-sm font-semibold text-primary">
              Our Journey
            </span>
            <h2 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
              From 2008 to the Future
            </h2>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
              A story that begins in 2008 and continues through people-centred digital innovation.
            </p>
          </Reveal>
          <JourneyTimeline />
        </div>
      </section>

      <section className="relative flex min-h-[24rem] items-center justify-center overflow-hidden md:min-h-[32rem]">
        <Image src={`${ASSET_BASE}/hero-slide-1.jpg`} alt="" fill sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-primary/65" />
        <div className="relative z-10 text-center px-4">
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-white max-w-4xl leading-tight">
            Building technology for real-world impact.
          </h2>
        </div>
      </section>
    </>
  );
}

export function PresenceSection() {
  return (
    <section id="presence" className="relative overflow-hidden bg-background py-20 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <Reveal hidden={UP} visible={SHOWN_Y}>
          <span className="mb-4 inline-block rounded-full border border-border bg-muted px-5 py-2 text-sm font-semibold text-primary">
            Global Presence
          </span>
          <h2 className="mb-10 font-heading text-3xl font-bold text-foreground md:text-4xl">
            Built in Africa. Designed for Scale.
          </h2>
        </Reveal>

        <Reveal hidden={{ opacity: 0 }} visible={{ opacity: 1 }} delay={0.2} className="grid overflow-hidden rounded-xl border border-border bg-muted md:grid-cols-12">
          <div className="relative min-h-64 md:col-span-5 md:min-h-[22rem]">
            <Image
              src={`${ASSET_BASE}/company-gallery/tablet-in-agricultural-input-shop.webp`}
              alt="Over-the-shoulder view of a tablet in an agricultural input shop."
              fill
              sizes="(min-width: 768px) 42vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center px-7 py-10 md:col-span-7 md:px-12 lg:px-16">
            <MapPin className="mb-5 h-9 w-9 text-primary" />
            <h3 className="mb-3 font-heading text-xl font-bold text-foreground">Designed for African contexts</h3>
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
              Esoko builds digital services around real operating conditions, including field delivery, varied connectivity and the need for accessible communication.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TileImage({ file, alt }: { file: string; alt: string }) {
  return (
    <div className="absolute inset-0">
      <Image src={`${ASSET_BASE}/${file}`} alt={alt} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
    </div>
  );
}

export function MarketOpportunitySection() {
  return (
    <section className="border-t border-border bg-muted py-20 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal hidden={{ opacity: 0, x: -30 }} visible={{ opacity: 1, x: 0 }}>
            <span className="mb-4 inline-block rounded-full border border-border bg-background px-5 py-2 text-sm font-semibold text-primary">
              Market Opportunity
            </span>
            <h2 className="mb-6 font-heading text-3xl font-bold leading-tight text-foreground md:text-4xl">
              The Opportunity Ahead
            </h2>
            <div className="mb-8 space-y-4 text-lg leading-relaxed text-muted-foreground">
              <p>Agriculture, digital inclusion, climate resilience, rural connectivity and market access are closely connected challenges.</p>
              <p>Esoko works where those challenges meet, helping organisations use practical digital services and field information to support communities and make better-informed decisions.</p>
            </div>
            <SiteLink href="/resources/research" data-testid="company-link-research" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary bg-background px-8 py-3.5 font-semibold text-primary transition-colors hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              Explore Research <ArrowRight className="w-4 h-4" />
            </SiteLink>
          </Reveal>
          <Reveal hidden={{ opacity: 0, x: 30 }} visible={{ opacity: 1, x: 0 }} delay={0.2} className="grid grid-cols-2 gap-4">
            <div className="bg-primary text-white p-4 sm:p-8 rounded-xl aspect-square flex flex-col justify-end relative overflow-hidden group">
              <TileImage file="company-gallery/feature-phone-weather-alert-example.webp" alt="Feature phone displaying an Esoko weather-alert SMS." />
              <div className="absolute inset-0 bg-primary/85" />
              <h3 className="relative z-10 font-bold text-lg sm:text-2xl">Digital Inclusion</h3>
            </div>
            <div className="bg-primary text-white p-4 sm:p-8 rounded-xl aspect-square flex flex-col justify-end mt-8 relative overflow-hidden group">
              <TileImage file="company-gallery/hands-holding-maize-kernels.webp" alt="Cupped hands holding maize kernels." />
              <div className="absolute inset-0 bg-primary/85" />
              <h3 className="relative z-10 font-bold text-lg sm:text-2xl">Climate Resilience</h3>
            </div>
            <div className="bg-primary text-white p-4 sm:p-8 rounded-xl aspect-square flex flex-col justify-end -mt-8 relative overflow-hidden group">
              <TileImage file="company-gallery/agricultural-products-and-input-shop-shelves.webp" alt="Agricultural inputs arranged on shop shelving." />
              <div className="absolute inset-0 bg-primary/85" />
              <h3 className="relative z-10 font-bold text-lg sm:text-2xl">Market Access</h3>
            </div>
            <div className="bg-primary text-white p-4 sm:p-8 rounded-xl aspect-square flex flex-col justify-end relative overflow-hidden group">
              <TileImage file="company-gallery/tablet-in-agricultural-input-shop.webp" alt="Tablet in an agricultural input shop." />
              <div className="absolute inset-0 bg-primary/85" />
              <h3 className="relative z-10 font-bold text-lg sm:text-2xl text-white">Data & Visibility</h3>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function WhyEsokoSection() {
  return (
    <section className="bg-background py-20 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <Reveal hidden={UP} visible={SHOWN_Y} className="text-center mb-16">
          <span className="mb-4 inline-block rounded-full border border-border bg-muted px-5 py-2 text-sm font-semibold text-primary">
            Why Esoko
          </span>
          <h2 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
            Built for Real-World Conditions
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Technology fails in rural Africa when it assumes perfect connectivity. We design for reality.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-x-10 gap-y-0 divide-y divide-border md:grid-cols-2 md:divide-y-0 lg:grid-cols-3">
          {WHY_ESOKO.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} hidden={UP} visible={SHOWN_Y} delay={i * 0.1} className="group py-8 md:px-3">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-muted text-primary">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="mb-3 font-heading text-xl font-bold text-foreground">{item.title}</h3>
                <p className="text-base leading-relaxed text-muted-foreground">{item.desc}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ProductEcosystemSection() {
  return (
    <section className="bg-primary py-20 text-primary-foreground md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <Reveal hidden={UP} visible={SHOWN_Y} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">From Strategy to Implementation</h2>
          <p className="mx-auto max-w-2xl text-lg text-white">A complete ecosystem of digital tools and field services.</p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {ECOSYSTEM_LINKS.map((link, i) => {
            const Icon = link.icon;
            return (
              <Reveal key={link.title} hidden={{ opacity: 0, scale: 0.95 }} visible={{ opacity: 1, scale: 1 }} delay={i * 0.05}>
                <SiteLink href={link.link} data-testid={`company-product-link-${i}`} className="flex min-h-[4.5rem] items-center gap-4 border-t border-white/40 py-5 transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/70 text-white">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-base">{link.title}</h3>
                    <p className="mt-0.5 text-base text-white">{link.desc}</p>
                  </div>
                </SiteLink>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FinalStorySection() {
  return (
    <section className="relative flex min-h-[32rem] items-center justify-center overflow-hidden md:min-h-[40rem]">
      <Image src={`${ASSET_BASE}/hero-slide-4.jpg`} alt="" fill sizes="100vw" className="object-cover object-center" />
      <div className="absolute inset-0 bg-primary/75" />
      <div className="relative z-10 container mx-auto px-4 text-center">
        <Reveal as="h2" hidden={{ opacity: 0, y: 30 }} visible={SHOWN_Y} className="text-4xl md:text-5xl lg:text-7xl font-heading font-bold text-white max-w-5xl mx-auto leading-tight mb-8">
          The Future Is Bigger Than Technology.
        </Reveal>
        <Reveal as="p" hidden={UP} visible={SHOWN_Y} delay={0.2} className="mx-auto mb-12 max-w-3xl text-xl font-medium text-white md:text-2xl">
          It is about what technology makes possible for people, organisations and communities.
        </Reveal>
        <Reveal hidden={{ opacity: 0 }} visible={{ opacity: 1 }} delay={0.4} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <SiteLink href="/products-services" data-testid="company-link-final-solutions" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-secondary px-8 py-4 font-semibold text-secondary-foreground transition-colors hover:bg-secondary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
            Explore Our Solutions <ArrowRight className="w-4 h-4" />
          </SiteLink>
          <ScrollToButton target="impact" testId="company-button-final-impact" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/70 px-8 py-4 font-semibold text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
            View Our Impact
          </ScrollToButton>
        </Reveal>
      </div>
    </section>
  );
}

export function ValuesSection() {
  return (
    <section className="overflow-hidden bg-muted py-20 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <Reveal hidden={UP} visible={SHOWN_Y} className="text-center mb-16">
          <h2 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
            Our Values
          </h2>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            The principles that define how we work, build, and partner.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {VALUES.map((v, i) => {
            const Icon = v.icon;
            return (
              <Reveal key={v.title} hidden={UP} visible={SHOWN_Y} delay={i * 0.1}
                className="group border-t border-border bg-transparent py-8 transition-colors hover:bg-background/60">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-background text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-3 font-heading text-xl font-bold text-foreground">{v.title}</h3>
                <p className="text-base leading-relaxed text-muted-foreground">{v.desc}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
