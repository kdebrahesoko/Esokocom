import { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/nav/Navbar';
import { Footer } from '@/components/Footer';
import { useBookDemo } from '@/context/BookDemoContext';

const TITLE = 'Enterprise Pricing | Esoko';
const DESC =
  'Esoko is quoted per programme for governments, NGOs and agribusinesses. Talk to our sales team to scope a package for your farmers and goals.';

const VALUE = [
  { title: 'Scoped to your programme', desc: 'Your geography, farmer base and the modules you need shape the package, so you pay for what your programme uses.' },
  { title: 'One platform, many tools', desc: 'Field data collection, messaging, advisory content and market connections work together instead of as separate purchases.' },
  { title: 'A partner, not a checkout', desc: 'Our team works alongside yours from the first conversation through deployment and beyond.' },
];

const STEPS = [
  { n: '01', title: 'Tell us about your programme', desc: 'Share your goals, the farmers you serve and where you work.' },
  { n: '02', title: 'We shape a proposal', desc: 'Our team maps your needs to Esoko products and services and prepares a tailored quote.' },
  { n: '03', title: 'Agree the path forward', desc: 'Review the proposal together and decide how to begin, including whether to start with a pilot.' },
];

const META: [string, string][] = [
  ['meta[name="description"]', DESC],
  ['meta[property="og:title"]', TITLE],
  ['meta[property="og:description"]', DESC],
];

function useSeo() {
  useEffect(() => {
    const prevTitle = document.title;
    const restore: (() => void)[] = [];
    document.title = TITLE;
    META.forEach(([sel, val]) => {
      let el = document.head.querySelector<HTMLMetaElement>(sel);
      const created = !el;
      if (!el) {
        el = document.createElement('meta');
        const m = sel.match(/\[(\w+)="([^"]+)"\]/)!;
        el.setAttribute(m[1], m[2]);
        document.head.appendChild(el);
      }
      const prev = el.getAttribute('content');
      el.setAttribute('content', val);
      const node = el;
      restore.push(() => {
        if (created) node.remove();
        else if (prev === null) node.removeAttribute('content');
        else node.setAttribute('content', prev);
      });
    });
    return () => {
      document.title = prevTitle;
      restore.forEach(fn => fn());
    };
  }, []);
}

export default function PricingPage() {
  const { open: openBookDemo } = useBookDemo();
  useSeo();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <section className="bg-gradient-to-br from-[#042B10] to-[#0f2318] pt-36 pb-20 px-4 md:px-6">
          <div className="container mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300 mb-4">Enterprise pricing</p>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-white leading-tight mb-5">
              Pricing built around your programme
            </h1>
            <p className="text-lg text-white/70 leading-relaxed mb-8">
              Esoko works with governments, NGOs and agribusinesses. We do not publish a price list. Every
              engagement is quoted to fit the programme it serves.
            </p>
            <button
              type="button"
              onClick={openBookDemo}
              className="inline-flex items-center justify-center gap-2 bg-brand hover:bg-brand/90 text-white rounded-full px-8 py-3.5 font-semibold text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#042B10] transition-colors"
            >
              Contact Sales <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </section>

        <section className="py-16 px-4 md:px-6" aria-labelledby="value-heading">
          <div className="container mx-auto max-w-5xl">
            <h2 id="value-heading" className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-10 max-w-xl">
              What a custom quote gives you
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {VALUE.map(v => (
                <div key={v.title} className="border-t-2 border-brand pt-4">
                  <h3 className="font-heading font-semibold text-foreground mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 md:px-6 bg-gray-50 border-t border-gray-100" aria-labelledby="steps-heading">
          <div className="container mx-auto max-w-3xl">
            <h2 id="steps-heading" className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-8">
              How we work with you
            </h2>
            <ol className="space-y-6">
              {STEPS.map(s => (
                <li key={s.n} className="flex gap-5">
                  <span className="text-2xl font-heading font-bold text-brand/40" aria-hidden="true">{s.n}</span>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-10">
              <button
                type="button"
                onClick={openBookDemo}
                className="inline-flex items-center gap-2 border-2 border-brand text-brand hover:bg-brand/5 rounded-full px-7 py-3 font-semibold text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 transition-colors"
              >
                Contact Sales <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
