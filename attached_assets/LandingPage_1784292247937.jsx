import { useState, useEffect, useRef } from "react";
import { Menu, X, ArrowUpRight, Check } from "lucide-react";

/**
 * MERIDIAN — small-batch mechanical watch studio
 * Design tokens
 * --ink:   #1B1D1F  (graphite, near-black but warm)
 * --paper: #F4F0E6  (warm paper)
 * --brass: #A9814A  (accent, used sparingly)
 * --rust:  #7A4B32  (secondary accent / hover)
 * --steel: #6B7178  (muted supporting tone)
 * Display face: Fraunces (characterful serif, used with restraint)
 * Body face: system sans (Inter-like)
 * Utility face: monospace (case-back engraving / specs)
 */

const FRAUNCES = "'Fraunces', 'Iowan Old Style', Georgia, serif";
const SANS = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
const MONO = "'IBM Plex Mono', 'SF Mono', Menlo, monospace";

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s cubic-bezier(.2,.7,.2,1) ${delay}ms, transform 0.7s cubic-bezier(.2,.7,.2,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* Signature element: a rotating gear-train diagram, drawn from the
   watch's actual movement — this stands in for the generic hero
   gradient/blob and gives the page one memorable image. */
function MovementDiagram() {
  return (
    <svg viewBox="0 0 420 420" className="w-full h-full" aria-hidden="true">
      <defs>
        <radialGradient id="dial" cx="50%" cy="45%" r="65%">
          <stop offset="0%" stopColor="#2A2D30" />
          <stop offset="100%" stopColor="#1B1D1F" />
        </radialGradient>
      </defs>
      <circle cx="210" cy="210" r="188" fill="url(#dial)" stroke="#A9814A" strokeWidth="1.5" opacity="0.9" />
      <circle cx="210" cy="210" r="160" fill="none" stroke="#6B7178" strokeWidth="0.5" opacity="0.5" />
      {[...Array(60)].map((_, i) => {
        const angle = (i / 60) * Math.PI * 2;
        const isHour = i % 5 === 0;
        const r1 = isHour ? 148 : 155;
        const r2 = 160;
        return (
          <line
            key={i}
            x1={210 + r1 * Math.sin(angle)}
            y1={210 - r1 * Math.cos(angle)}
            x2={210 + r2 * Math.sin(angle)}
            y2={210 - r2 * Math.cos(angle)}
            stroke={isHour ? "#F4F0E6" : "#6B7178"}
            strokeWidth={isHour ? 1.6 : 0.6}
            opacity={isHour ? 0.9 : 0.4}
          />
        );
      })}
      {/* gear train, slow rotation */}
      <g style={{ transformOrigin: "210px 210px", animation: "spin 40s linear infinite" }}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const a = (i / 8) * Math.PI * 2;
          const r = 92;
          return (
            <circle
              key={i}
              cx={210 + r * Math.sin(a)}
              cy={210 - r * Math.cos(a)}
              r="3"
              fill="#A9814A"
              opacity="0.75"
            />
          );
        })}
        <circle cx="210" cy="210" r="92" fill="none" stroke="#A9814A" strokeWidth="0.5" opacity="0.35" />
      </g>
      <g style={{ transformOrigin: "210px 210px", animation: "spin 90s linear infinite reverse" }}>
        <circle cx="210" cy="210" r="60" fill="none" stroke="#7A4B32" strokeWidth="0.6" opacity="0.5" strokeDasharray="2 6" />
      </g>
      {/* hands */}
      <g style={{ transformOrigin: "210px 210px", animation: "spin 12s linear infinite" }}>
        <line x1="210" y1="210" x2="210" y2="120" stroke="#F4F0E6" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      <g style={{ transformOrigin: "210px 210px", animation: "spin 3s linear infinite" }}>
        <line x1="210" y1="210" x2="210" y2="90" stroke="#A9814A" strokeWidth="3" strokeLinecap="round" />
      </g>
      <circle cx="210" cy="210" r="5" fill="#F4F0E6" />
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </svg>
  );
}

export default function LandingPage() {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const process = [
    {
      stage: "01",
      title: "Movement selected",
      body: "Each caliber is hand-picked from a small Swiss atelier and inspected under loupe before it ever reaches a case.",
    },
    {
      stage: "02",
      title: "Case machined",
      body: "Solid 316L steel or bronze, turned on a single lathe run of no more than forty pieces per design.",
    },
    {
      stage: "03",
      title: "Dial finished",
      body: "Sunburst, grain, or matte — applied by hand, so no two dials catch the light in quite the same way.",
    },
    {
      stage: "04",
      title: "Regulated & timed",
      body: "Six days on the wrist, checked against a reference clock, before it's cleared to ship.",
    },
  ];

  const specs = [
    ["Movement", "Automatic, 28,800 vph"],
    ["Power reserve", "70 hours"],
    ["Case", "38mm, 316L steel"],
    ["Water resistance", "100m"],
    ["Crystal", "Domed sapphire"],
    ["Production", "40 pieces / design"],
  ];

  return (
    <div style={{ fontFamily: SANS, background: "#F4F0E6", color: "#1B1D1F" }} className="min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        html { scroll-behavior: smooth; }
      `}</style>

      {/* NAV */}
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(244,240,230,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(10px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(27,29,31,0.08)" : "1px solid transparent",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10 flex items-center justify-between h-20">
          <span style={{ fontFamily: FRAUNCES, fontWeight: 500 }} className="text-xl tracking-tight">
            Meridian
          </span>
          <nav className="hidden md:flex items-center gap-10 text-sm" style={{ color: "#4A4D50" }}>
            <a href="#craft" className="hover:text-[#1B1D1F] transition-colors">Craft</a>
            <a href="#process" className="hover:text-[#1B1D1F] transition-colors">Process</a>
            <a href="#specs" className="hover:text-[#1B1D1F] transition-colors">Specifications</a>
            <a
              href="#reserve"
              className="px-5 py-2.5 rounded-full text-[#F4F0E6] transition-transform hover:scale-105"
              style={{ background: "#1B1D1F" }}
            >
              Reserve
            </a>
          </nav>
          <button className="md:hidden" onClick={() => setNavOpen((v) => !v)} aria-label="Toggle menu">
            {navOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {navOpen && (
          <div className="md:hidden px-6 pb-6 flex flex-col gap-4 text-sm" style={{ color: "#4A4D50" }}>
            <a href="#craft" onClick={() => setNavOpen(false)}>Craft</a>
            <a href="#process" onClick={() => setNavOpen(false)}>Process</a>
            <a href="#specs" onClick={() => setNavOpen(false)}>Specifications</a>
            <a href="#reserve" onClick={() => setNavOpen(false)} className="font-medium" style={{ color: "#1B1D1F" }}>Reserve →</a>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 pt-40 pb-24 md:pt-48 md:pb-32 grid md:grid-cols-2 gap-14 items-center">
        <Reveal>
          <p style={{ fontFamily: MONO, color: "#7A4B32" }} className="text-xs tracking-[0.2em] uppercase mb-6">
            Ref. 04 — Autumn release
          </p>
          <h1
            style={{ fontFamily: FRAUNCES, lineHeight: 1.04 }}
            className="text-5xl md:text-6xl font-medium tracking-tight mb-6"
          >
            Time, built by
            <br />
            hand, worn for
            <br />
            <span style={{ color: "#7A4B32" }}>decades.</span>
          </h1>
          <p style={{ color: "#4A4D50" }} className="text-lg max-w-md mb-10 leading-relaxed">
            Meridian makes forty watches at a time — regulated on the wrist,
            not the assembly line, by a workshop of six people who'd rather
            get it right than get it out fast.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#reserve"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-medium transition-transform hover:scale-105"
              style={{ background: "#1B1D1F", color: "#F4F0E6" }}
            >
              Reserve this run <ArrowUpRight size={16} />
            </a>
            <span style={{ fontFamily: MONO, color: "#6B7178" }} className="text-xs">
              14 of 40 remaining
            </span>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <div className="aspect-square max-w-md mx-auto">
            <MovementDiagram />
          </div>
        </Reveal>
      </section>

      {/* CRAFT PILLARS */}
      <section id="craft" className="max-w-6xl mx-auto px-6 md:px-10 py-24 border-t" style={{ borderColor: "rgba(27,29,31,0.08)" }}>
        <Reveal>
          <h2 style={{ fontFamily: FRAUNCES }} className="text-3xl md:text-4xl font-medium mb-16 max-w-lg">
            Three decisions we won't compromise on.
          </h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              title: "No quartz, ever",
              body: "Every Meridian runs on a mechanical automatic movement. If it needs a battery, it isn't a Meridian.",
            },
            {
              title: "Small runs only",
              body: "Forty pieces per design, then it's retired. Scarcity isn't marketing here — it's what our bench can actually finish well.",
            },
            {
              title: "Repairable for life",
              body: "Every movement is documented and serviceable by any competent watchmaker, not just us, for as long as you own it.",
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 120}>
              <div
                style={{ fontFamily: MONO, color: "#A9814A" }}
                className="text-xs tracking-[0.2em] mb-4"
              >
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 style={{ fontFamily: FRAUNCES }} className="text-xl font-medium mb-3">
                {item.title}
              </h3>
              <p style={{ color: "#4A4D50" }} className="leading-relaxed text-[15px]">
                {item.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="py-24" style={{ background: "#1B1D1F", color: "#F4F0E6" }}>
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <Reveal>
            <h2 style={{ fontFamily: FRAUNCES }} className="text-3xl md:text-4xl font-medium mb-16 max-w-lg">
              From atelier to your wrist, in four stages.
            </h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
            {process.map((step, i) => (
              <Reveal key={step.stage} delay={i * 100}>
                <div className="flex gap-6">
                  <span style={{ fontFamily: MONO, color: "#A9814A" }} className="text-sm mt-1">
                    {step.stage}
                  </span>
                  <div>
                    <h3 style={{ fontFamily: FRAUNCES }} className="text-lg font-medium mb-2">
                      {step.title}
                    </h3>
                    <p style={{ color: "#B8BABC" }} className="text-[15px] leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SPECS — styled like a case-back engraving */}
      <section id="specs" className="max-w-6xl mx-auto px-6 md:px-10 py-24">
        <Reveal>
          <div
            className="rounded-2xl p-10 md:p-14"
            style={{ background: "#EDE7D8", border: "1px solid rgba(27,29,31,0.1)" }}
          >
            <p style={{ fontFamily: MONO, color: "#7A4B32" }} className="text-xs tracking-[0.2em] uppercase mb-8">
              Case-back engraving — Ref. 04
            </p>
            <div className="grid sm:grid-cols-2 gap-x-12 gap-y-5">
              {specs.map(([label, value]) => (
                <div key={label} className="flex justify-between border-b pb-3" style={{ borderColor: "rgba(27,29,31,0.12)" }}>
                  <span style={{ color: "#6B7178" }} className="text-sm">{label}</span>
                  <span style={{ fontFamily: MONO }} className="text-sm font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* TESTIMONIAL */}
      <section className="max-w-4xl mx-auto px-6 md:px-10 py-20 text-center">
        <Reveal>
          <p style={{ fontFamily: FRAUNCES }} className="text-2xl md:text-3xl leading-snug font-normal mb-8">
            "It keeps three seconds a week and the finishing on the rotor is
            better than watches twice the price. You can tell six people
            actually looked at it."
          </p>
          <p style={{ color: "#6B7178", fontFamily: MONO }} className="text-xs tracking-[0.15em] uppercase">
            — J. Okafor, owner since Ref. 02
          </p>
        </Reveal>
      </section>

      {/* RESERVE / CTA */}
      <section id="reserve" className="max-w-6xl mx-auto px-6 md:px-10 pb-28">
        <Reveal>
          <div
            className="rounded-2xl px-8 py-16 md:px-16 md:py-20 text-center"
            style={{ background: "#1B1D1F", color: "#F4F0E6" }}
          >
            <h2 style={{ fontFamily: FRAUNCES }} className="text-3xl md:text-4xl font-medium mb-4">
              Fourteen pieces left in Ref. 04.
            </h2>
            <p style={{ color: "#B8BABC" }} className="mb-10 max-w-md mx-auto">
              A refundable deposit holds your place in the finishing queue.
              We'll email you before your watch ships for final approval.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-medium transition-transform hover:scale-105"
              style={{ background: "#A9814A", color: "#1B1D1F" }}
            >
              Reserve with $50 deposit <ArrowUpRight size={16} />
            </a>
            <div className="flex items-center justify-center gap-6 mt-8 text-xs" style={{ color: "#8A8D90" }}>
              <span className="flex items-center gap-1.5"><Check size={14} /> Fully refundable</span>
              <span className="flex items-center gap-1.5"><Check size={14} /> Ships in 6–8 weeks</span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer className="border-t" style={{ borderColor: "rgba(27,29,31,0.08)" }}>
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <span style={{ fontFamily: FRAUNCES }} className="text-lg">Meridian</span>
          <div className="flex gap-8 text-sm" style={{ color: "#6B7178" }}>
            <a href="#craft" className="hover:text-[#1B1D1F]">Craft</a>
            <a href="#process" className="hover:text-[#1B1D1F]">Process</a>
            <a href="#specs" className="hover:text-[#1B1D1F]">Specifications</a>
          </div>
          <span style={{ color: "#8A8D90" }} className="text-xs">© {new Date().getFullYear()} Meridian Studio</span>
        </div>
      </footer>
    </div>
  );
}
