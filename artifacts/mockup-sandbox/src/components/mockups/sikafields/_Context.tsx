import type { ReactNode, ComponentProps } from "react";
import { useLayoutEffect } from "react";
import { ArrowRight, ChevronRight, CheckCircle2, Globe2, Building2, Sprout, MapPin, BarChart2, TabletSmartphone, LineChart, Users } from "lucide-react";
import { FadeUp, RevealUp } from "./_Motion";
import "./_group.css";
const imgSustainability = "/esoko-next/site-assets/sector-sustainability.webp";
const sector = {
    id: 'sustainability',
    slug: 'sustainability',
    name: 'Sustainability & Climate',
    category: 'Private Sector',
    headline: 'Technology for a More Resilient Future',
    description: 'Use digital technology, climate intelligence, field data, and monitoring tools to support sustainable agriculture and climate resilience.',
    heroImage: imgSustainability,
    imageAlt: 'Two field workers planting a young tree during a sustainability activity',
    icon: Sprout,
    audience: ['Climate Projects', 'Carbon Developers', 'Sustainable Agribusiness', 'Conservation Orgs'],
    useCases: [
      'Climate-smart agriculture',
      'Carbon project monitoring',
      'Farmer enrolment',
      'Environmental monitoring',
      'Climate alerts',
      'GIS',
      'MRV',
      'Sustainability reporting'
    ],
    capabilities: [
      { name: 'GIS', icon: MapPin },
      { name: 'AI & Analytics', icon: BarChart2 },
      { name: 'Mobile Data Collection', icon: TabletSmartphone },
      { name: 'Climate Intelligence', icon: LineChart },
      { name: 'Field Monitoring', icon: Users }
    ],
    statistics: [
      { value: '58', label: 'Value Chains' },
      { value: '10+', label: 'Countries' },
      { value: '18+', label: 'Years of Experience' }
    ],
    featured: true,
    cta: 'Explore Sustainability Solutions',
    seoTitle: 'Sustainability & Climate Solutions | Esoko',
    seoDescription: 'Support sustainable agriculture and climate resilience with digital technology and field monitoring tools.'
  };
const DEMO_HREF = "#";
const buttonClass = (classes: string) => classes;
function SiteLink(props: ComponentProps<"a">) { return <a {...props} onClick={event => event.preventDefault()} />; }
function Image({fill, priority, style, ...props}: ComponentProps<"img"> & {fill?: boolean; priority?: boolean}) { return <img {...props} style={{...(fill ? {position:"absolute",inset:0,width:"100%",height:"100%"} as const : {}),...style}} />; }
const EASE: [number,number,number,number] = [.16,1,.3,1];
const fade={duration:.6,ease:EASE};
const rev={y:24,duration:.5,ease:EASE};

export function SectorOpening({ children }: { children?: ReactNode }) {
  // Vite mounts after the browser's first hash scroll; this preview-only adapter
  // opens the comparison at the insertion point, with the actual hero above it.
  useLayoutEffect(() => {
    if (window.location.hash !== "#preview-feature-position") return;
    const frame = requestAnimationFrame(() => document.getElementById("preview-feature-position")
      ?.scrollIntoView({ block: "start", behavior: "instant" }));
    return () => cancelAnimationFrame(frame);
  }, []);
  const Icon = sector.icon;
  return (
    <div className="esoko-sika-preview esoko-home min-h-screen w-full bg-background flex flex-col font-sans overflow-x-hidden">
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

        <div id="preview-feature-position" />
        {children}
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

      </main>
    </div>
  );
}
