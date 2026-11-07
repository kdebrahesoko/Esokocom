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
    <section id="mission" className="scroll-mt-24 py-24 relative overflow-hidden bg-[#042B10]">
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, #4ade80 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <Reveal hidden={UP} visible={SHOWN_Y} className="text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-4 bg-emerald-400/10 px-5 py-2 rounded-full border border-emerald-400/20">
            Our Mission
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6">
            Empowering Farmers.<br />Restoring Earth.
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed">
            Connecting last-mile communities with services through digital innovations — empowering farmers, governments, and enterprises across Africa.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          <div className="hidden lg:block absolute top-1/2 left-[12%] right-[12%] h-px bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 -translate-y-1/2 z-0" />
          {MISSION_PILLARS.map((pillar, i) => (
            <Reveal
              key={pillar.title}
              hidden={{ opacity: 0, y: 30 }} visible={SHOWN_Y} delay={0.1 + i * 0.1}
              className="relative z-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6 border border-emerald-500/30">
                <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
              </div>
              <h3 className="text-white font-bold mb-3">{pillar.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{pillar.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function OverviewSection() {
  return (
    <section id="overview" className="scroll-mt-24 py-24 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <Reveal hidden={UP} visible={SHOWN_Y} className="text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-600 mb-4 bg-emerald-50 px-5 py-2 rounded-full border border-emerald-200">
            Company Overview
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
            Connecting People, Data and Opportunity
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
            We build technology around people, addressing the unique challenges of agriculture, climate, and development in Africa through accessible digital platforms.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {OVERVIEW_BLOCKS.map((block, i) => {
            const Icon = block.icon;
            return (
              <Reveal
                key={block.title}
                hidden={{ opacity: 0, scale: 0.95 }} visible={{ opacity: 1, scale: 1 }} delay={i * 0.1}
                className="group relative bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300"
              >
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-gray-900 text-lg mb-2">{block.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{block.desc}</p>
                    <SiteLink href={block.link} data-testid={`company-overview-link-${i}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 group-hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded">
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
    <section id="impact" className="scroll-mt-24 py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #021608 0%, #042B10 50%, #021608 100%)' }}>
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'radial-gradient(circle, #4ade80 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
        <Reveal hidden={UP} visible={SHOWN_Y} className="mb-16">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-400 mb-4 bg-emerald-400/10 px-5 py-2 rounded-full border border-emerald-400/20">
            Our Impact
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Technology That Reaches the Last Mile
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed mb-16">
            Our approach connects people, field information and digital services so organisations can move from insight to practical action.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {IMPACT_PATH.map((stage, i) => {
              const Icon = stage.icon;
              return (
                <Reveal
                  key={stage.title}
                  hidden={{ opacity: 0, y: 30 }} visible={SHOWN_Y} delay={0.1 + i * 0.1}
                  className="group flex items-start gap-4 text-left px-6 py-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-emerald-400/40 hover:bg-white/10 transition-colors"
                  data-testid={`impact-stage-${i}`}
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-emerald-400/15 text-emerald-300 flex-shrink-0 group-hover:bg-emerald-400 group-hover:text-[#042B10] transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-white text-lg">{stage.title}</h3>
                    <p className="text-white/55 text-sm leading-relaxed mt-1">{stage.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Reveal>

        <Reveal hidden={{ opacity: 0 }} visible={{ opacity: 1 }} delay={0.6} className="hidden md:flex items-center justify-between max-w-4xl mx-auto mt-20 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/20 via-emerald-400 to-[#D9531E]/80 -translate-y-1/2 z-0" />
          {['PEOPLE', 'DATA', 'DIGITAL SERVICES', 'DECISIONS', 'ACTION', 'IMPACT'].map((node) => (
            <div key={node} className="relative z-10 group flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-[#042B10] border-2 border-emerald-400 group-hover:scale-150 group-hover:bg-emerald-400 transition-all duration-300 shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
              <span className="absolute top-8 text-[10px] font-bold tracking-widest text-emerald-200 uppercase whitespace-nowrap opacity-50 group-hover:opacity-100 group-hover:translate-y-1 transition-all duration-300">
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
      <section id="journey" className="scroll-mt-24 py-24 relative overflow-hidden bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <Reveal hidden={UP} visible={SHOWN_Y} className="text-center mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-600 mb-4 bg-emerald-50 px-5 py-2 rounded-full border border-emerald-100">
              Our Journey
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              From 2008 to the Future
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
              A story that begins in 2008 and continues through people-centred digital innovation.
            </p>
          </Reveal>
          <JourneyTimeline />
        </div>
      </section>

      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <Image src={`${ASSET_BASE}/hero-slide-1.jpg`} alt="" fill sizes="100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-[#042B10]/60" />
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
    <section id="presence" className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <Reveal hidden={UP} visible={SHOWN_Y}>
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-600 mb-4 bg-emerald-50 px-5 py-2 rounded-full border border-emerald-100">
            Global Presence
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6">
            Built in Africa. Designed for Scale.
          </h2>
        </Reveal>

        <Reveal hidden={{ opacity: 0 }} visible={{ opacity: 1 }} delay={0.2} className="relative max-w-4xl mx-auto h-[400px] flex items-center justify-center mt-10">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #059669 2px, transparent 2px)', backgroundSize: '20px 20px', maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)' }} />
          <div className="relative z-10 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-3xl p-8 shadow-xl max-w-lg mx-auto">
            <MapPin className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
            <h3 className="font-heading font-bold text-xl text-gray-900 mb-2">Designed for African contexts</h3>
            <p className="text-gray-600 leading-relaxed">
              Esoko builds digital services around real operating conditions, including field delivery, varied connectivity and the need for accessible communication.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TileImage({ file }: { file: string }) {
  return (
    <div className="absolute inset-0 opacity-20 mix-blend-overlay group-hover:scale-110 transition-transform duration-700">
      <Image src={`${ASSET_BASE}/${file}`} alt="" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
    </div>
  );
}

export function MarketOpportunitySection() {
  return (
    <section className="py-24 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal hidden={{ opacity: 0, x: -30 }} visible={{ opacity: 1, x: 0 }}>
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-600 mb-4 bg-emerald-50 px-5 py-2 rounded-full border border-emerald-100">
              Market Opportunity
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-6 leading-tight">
              The Opportunity Ahead
            </h2>
            <div className="space-y-4 text-lg text-gray-600 leading-relaxed mb-8">
              <p>Agriculture, digital inclusion, climate resilience, rural connectivity and market access are closely connected challenges.</p>
              <p>Esoko works where those challenges meet, helping organisations use practical digital services and field information to support communities and make better-informed decisions.</p>
            </div>
            <SiteLink href="/resources/research" data-testid="company-link-research" className="inline-flex items-center gap-2 bg-white text-emerald-700 border border-emerald-200 rounded-full px-8 py-3.5 font-semibold hover:bg-emerald-50 hover:-translate-y-0.5 transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500">
              Explore Research <ArrowRight className="w-4 h-4" />
            </SiteLink>
          </Reveal>
          <Reveal hidden={{ opacity: 0, x: 30 }} visible={{ opacity: 1, x: 0 }} delay={0.2} className="grid grid-cols-2 gap-4">
            <div className="bg-[#042B10] text-white p-8 rounded-3xl aspect-square flex flex-col justify-end relative overflow-hidden group">
              <TileImage file="hero-slide-4.jpg" />
              <h3 className="relative z-10 font-bold text-2xl">Digital Inclusion</h3>
            </div>
            <div className="bg-emerald-600 text-white p-8 rounded-3xl aspect-square flex flex-col justify-end mt-8 relative overflow-hidden group">
              <TileImage file="hero-slide-1.jpg" />
              <h3 className="relative z-10 font-bold text-2xl">Climate Resilience</h3>
            </div>
            <div className="bg-[#D9531E] text-white p-8 rounded-3xl aspect-square flex flex-col justify-end -mt-8 relative overflow-hidden group">
              <TileImage file="hero-slide-3.jpg" />
              <h3 className="relative z-10 font-bold text-2xl">Market Access</h3>
            </div>
            <div className="bg-white border border-gray-100 text-gray-900 p-8 rounded-3xl aspect-square flex flex-col justify-end shadow-lg relative overflow-hidden group">
              <h3 className="relative z-10 font-bold text-2xl text-emerald-700">Data & Visibility</h3>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function WhyEsokoSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <Reveal hidden={UP} visible={SHOWN_Y} className="text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-emerald-600 mb-4 bg-emerald-50 px-5 py-2 rounded-full border border-emerald-100">
            Why Esoko
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
            Built for Real-World Conditions
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Technology fails in rural Africa when it assumes perfect connectivity. We design for reality.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_ESOKO.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} hidden={UP} visible={SHOWN_Y} delay={i * 0.1} className="bg-gray-50 border border-gray-100 rounded-3xl p-8 hover:bg-white hover:shadow-xl transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-xl text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{item.desc}</p>
                <div className="flex items-center text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0">
                  <ArrowRight className="w-5 h-5" />
                </div>
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
    <section className="py-24 bg-[#042B10] text-white">
      <div className="container mx-auto px-4 md:px-6">
        <Reveal hidden={UP} visible={SHOWN_Y} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">From Strategy to Implementation</h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg">A complete ecosystem of digital tools and field services.</p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {ECOSYSTEM_LINKS.map((link, i) => {
            const Icon = link.icon;
            return (
              <Reveal key={link.title} hidden={{ opacity: 0, scale: 0.95 }} visible={{ opacity: 1, scale: 1 }} delay={i * 0.05}>
                <SiteLink href={link.link} data-testid={`company-product-link-${i}`} className="flex items-center gap-4 bg-white/5 hover:bg-white/15 border border-white/10 rounded-2xl p-5 transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-400 group-hover:text-[#042B10] transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-sm tracking-wide">{link.title}</h3>
                    <p className="text-white/50 text-xs mt-0.5">{link.desc}</p>
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
    <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <Image src={`${ASSET_BASE}/hero-slide-4.jpg`} alt="" fill sizes="100vw" className="object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#021608] via-[#042B10]/60 to-[#042B10]/80" />
      <div className="relative z-10 container mx-auto px-4 text-center">
        <Reveal as="h2" hidden={{ opacity: 0, y: 30 }} visible={SHOWN_Y} className="text-4xl md:text-5xl lg:text-7xl font-heading font-bold text-white max-w-5xl mx-auto leading-tight mb-8">
          The Future Is Bigger Than Technology.
        </Reveal>
        <Reveal as="p" hidden={UP} visible={SHOWN_Y} delay={0.2} className="text-xl md:text-2xl text-emerald-300 font-medium max-w-3xl mx-auto mb-12 italic">
          It is about what technology makes possible for people, organisations and communities.
        </Reveal>
        <Reveal hidden={{ opacity: 0 }} visible={{ opacity: 1 }} delay={0.4} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <SiteLink href="/products-services" data-testid="company-link-final-solutions" className="inline-flex items-center gap-2 bg-emerald-600 text-white rounded-full px-8 py-4 font-semibold hover:bg-emerald-500 hover:-translate-y-0.5 transition-all shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
            Explore Our Solutions <ArrowRight className="w-4 h-4" />
          </SiteLink>
          <ScrollToButton target="impact" testId="company-button-final-impact" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full px-8 py-4 font-semibold hover:bg-white/20 hover:-translate-y-0.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
            View Our Impact
          </ScrollToButton>
        </Reveal>
      </div>
    </section>
  );
}

export function ValuesSection() {
  return (
    <section className="py-24 bg-gray-50 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <Reveal hidden={UP} visible={SHOWN_Y} className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
            Our Values
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            The principles that define how we work, build, and partner.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {VALUES.map((v, i) => {
            const Icon = v.icon;
            return (
              <Reveal key={v.title} hidden={UP} visible={SHOWN_Y} delay={i * 0.1}
                className="group bg-white rounded-3xl p-8 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${v.grad} flex items-center justify-center mb-6 shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-heading font-bold text-gray-900 text-xl mb-3">{v.title}</h3>
                <p className="text-gray-600 leading-relaxed">{v.desc}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
