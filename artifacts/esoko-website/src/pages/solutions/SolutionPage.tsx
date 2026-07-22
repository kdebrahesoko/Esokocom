import { useParams, Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Quote, CheckCircle2, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/nav/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { useBookDemo } from '@/context/BookDemoContext';
import { getSolutionBySlug, SOLUTIONS_DATA } from '@/data/solutions';

function NotFoundSolution() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-heading font-bold mb-4">Solution not found</h1>
          <Link href="/" className="text-brand hover:underline">Return home</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mock screenshot UI                                                   */
/* ------------------------------------------------------------------ */
function ScreenshotMockup({ label, color }: { label: string; color: string }) {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Browser chrome */}
      <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
        {/* Title bar */}
        <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-400 border border-gray-200">
            app.esoko.com
          </div>
        </div>

        {/* App window */}
        <div className="bg-white flex" style={{ minHeight: 340 }}>
          {/* Sidebar */}
          <div className="w-48 border-r border-gray-100 bg-gray-50 flex flex-col p-3 gap-1 shrink-0">
            <div className="h-8 mb-3 flex items-center gap-2 px-2">
              <div className="w-6 h-6 rounded" style={{ background: color, opacity: 0.9 }} />
              <div className="h-3 w-16 rounded bg-gray-200" />
            </div>
            {[0.9, 0.6, 0.5, 0.7, 0.45].map((op, i) => (
              <div
                key={i}
                className={`h-8 rounded-lg flex items-center gap-2 px-2 ${i === 0 ? 'bg-white shadow-sm border border-gray-100' : ''}`}
              >
                <div className="w-4 h-4 rounded" style={{ background: color, opacity: op * 0.4 }} />
                <div className="h-2.5 rounded flex-1 bg-gray-200" style={{ opacity: op * 0.6 }} />
              </div>
            ))}
          </div>

          {/* Main content */}
          <div className="flex-1 p-5 flex flex-col gap-4">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 w-32 rounded bg-gray-800 mb-1.5" />
                <div className="h-2.5 w-48 rounded bg-gray-300" />
              </div>
              <div
                className="h-8 w-24 rounded-full text-white text-xs flex items-center justify-center font-semibold"
                style={{ background: color }}
              >
                + New
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: '12,450', lbl: 'Total Records' },
                { val: '98.2%', lbl: 'Accuracy Rate' },
                { val: '847', lbl: 'Today' },
              ].map((stat, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="text-sm font-bold" style={{ color }}>{stat.val}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{stat.lbl}</div>
                </div>
              ))}
            </div>

            {/* Chart area */}
            <div className="flex-1 bg-gray-50 rounded-xl border border-gray-100 p-3 flex flex-col gap-2">
              <div className="h-2.5 w-24 rounded bg-gray-300" />
              <div className="flex-1 flex items-end gap-1.5 pt-2">
                {[55, 72, 48, 85, 60, 90, 70, 82, 65, 95, 75, 88].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: color, opacity: 0.2 + (i / 12) * 0.6 }} />
                ))}
              </div>
            </div>

            {/* Table rows */}
            <div className="space-y-1.5">
              {[0.9, 0.7, 0.5].map((op, i) => (
                <div key={i} className="flex items-center gap-3 py-1.5 border-b border-gray-50">
                  <div className="w-6 h-6 rounded-full" style={{ background: color, opacity: op * 0.5 }} />
                  <div className="h-2.5 flex-1 rounded bg-gray-200" style={{ opacity: op }} />
                  <div className="h-2.5 w-14 rounded bg-gray-200" style={{ opacity: op * 0.6 }} />
                  <div className="h-5 w-16 rounded-full" style={{ background: color, opacity: op * 0.15 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Label badge */}
      <div
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-white text-xs font-semibold shadow-lg whitespace-nowrap"
        style={{ background: color }}
      >
        {label}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Related Solutions                                                    */
/* ------------------------------------------------------------------ */
function RelatedSolutions({ currentSlug }: { currentSlug: string }) {
  const others = SOLUTIONS_DATA.filter(s => s.slug !== currentSlug).slice(0, 3);
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-8">Explore More Solutions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {others.map(sol => {
            const Icon = sol.icon;
            return (
              <Link key={sol.slug} href={`/solutions/${sol.slug}`}>
                <div className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer">
                  <div className="w-11 h-11 rounded-xl bg-brand/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-brand" />
                  </div>
                  <h3 className="font-heading font-bold text-foreground mb-1 group-hover:text-brand transition-colors">
                    {sol.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{sol.tagline}</p>
                  <div className="flex items-center gap-1 text-sm font-semibold text-brand">
                    Learn more <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Main Page                                                            */
/* ------------------------------------------------------------------ */
export default function SolutionPage() {
  const params = useParams<{ slug: string }>();
  const { open: openBookDemo } = useBookDemo();
  const solution = getSolutionBySlug(params.slug);

  if (!solution) return <NotFoundSolution />;

  const Icon = solution.icon;

  return (
    <div className="min-h-screen w-full bg-background flex flex-col font-sans">
      <Navbar />

      {/* -------- Hero -------- */}
      <section className={`relative bg-gradient-to-br ${solution.heroGradient} pt-32 pb-24 overflow-hidden`}>
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-white/20 blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-white/10 blur-2xl translate-y-1/2 -translate-x-1/4" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-white/60 text-sm mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/#solutions" className="hover:text-white transition-colors">Solutions</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white">{solution.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Copy */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-white/70 font-medium text-sm uppercase tracking-widest">Esoko {solution.name}</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight mb-4">
                {solution.tagline}
              </h1>
              <p className="text-lg text-white/75 mb-8 leading-relaxed max-w-xl">
                {solution.description}
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={openBookDemo}
                  className="rounded-full px-8 py-3 bg-brand hover:bg-brand/80 text-white font-semibold h-auto"
                >
                  Request a Demo
                </Button>
                <Link href="/#solutions">
                  <Button
                    variant="outline"
                    className="rounded-full px-8 py-3 border-white/30 text-white hover:bg-white/10 bg-transparent h-auto"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    All Solutions
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Right: Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="grid grid-cols-2 gap-4"
            >
              {solution.stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <div className="text-3xl font-heading font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* -------- Features -------- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm font-semibold uppercase tracking-widest text-brand mb-3"
            >
              Platform Capabilities
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-heading font-bold text-foreground"
            >
              Everything you need to succeed in the field
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {solution.features.map((feature, i) => {
              const FIcon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.4, delay: (i % 4) * 0.08 }}
                  className="group p-6 rounded-2xl border border-gray-100 hover:border-brand/20 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white"
                >
                  <div className="w-11 h-11 rounded-xl bg-brand/10 flex items-center justify-center mb-4 group-hover:bg-brand/20 transition-colors">
                    <FIcon className="w-5 h-5 text-brand" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2 text-sm">{feature.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* -------- Screenshot Mockup -------- */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm font-semibold uppercase tracking-widest text-brand mb-3"
            >
              Platform Preview
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-heading font-bold text-foreground"
            >
              Designed for the real world
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="text-muted-foreground mt-3"
            >
              An intuitive interface built for field teams in low-connectivity environments — with enterprise-grade power for programme managers.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="pb-10"
          >
            <ScreenshotMockup label={solution.mockupLabel} color={solution.mockupColor} />
          </motion.div>
        </div>
      </section>

      {/* -------- Use Cases -------- */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm font-semibold uppercase tracking-widest text-brand mb-3"
            >
              Real-World Impact
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-heading font-bold text-foreground"
            >
              Proven across sectors and scale
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {solution.useCases.map((uc, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="flex flex-col"
              >
                <div className="inline-flex mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand/10 text-brand">
                    {uc.sector}
                  </span>
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-3">{uc.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">{uc.description}</p>
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">Verified case study</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* -------- Customer Quote -------- */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-6">
              <Quote className="w-6 h-6 text-brand" />
            </div>
            <blockquote className="text-xl md:text-2xl font-heading font-medium text-foreground leading-relaxed mb-8">
              "{solution.quote.text}"
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand to-brand/70 flex items-center justify-center text-white font-bold text-lg">
                {solution.quote.author.charAt(0)}
              </div>
              <div className="text-left">
                <div className="font-semibold text-foreground">{solution.quote.author}</div>
                <div className="text-sm text-muted-foreground">{solution.quote.role}</div>
                <div className="text-xs text-brand font-medium">{solution.quote.org}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* -------- CTA Banner -------- */}
      <section className={`py-20 bg-gradient-to-br ${solution.heroGradient} relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-60 h-60 rounded-full bg-white/10 blur-2xl" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-heading font-bold text-white mb-4"
          >
            Ready to see {solution.name} in action?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-white/70 text-lg mb-8 max-w-xl mx-auto"
          >
            Book a 30-minute personalized demo with one of our agricultural technology experts.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Button
              onClick={openBookDemo}
              className="rounded-full px-10 py-4 bg-brand hover:bg-brand/80 text-white font-semibold text-base h-auto shadow-xl"
            >
              Book a Free Demo <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Link href="/#contact">
              <Button
                variant="outline"
                className="rounded-full px-10 py-4 border-white/30 text-white hover:bg-white/10 bg-transparent font-semibold text-base h-auto"
              >
                Contact Sales
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* -------- Related Solutions -------- */}
      <RelatedSolutions currentSlug={solution.slug} />

      <Footer />
    </div>
  );
}
