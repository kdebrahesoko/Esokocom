import { useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

/* ─── Partner logos ─────────────────────────────────────────────────── */
const LOGOS = [
  { src: '/partners/partner-01.png', alt: 'Government & development agency partner 1' },
  { src: '/partners/partner-02.png', alt: 'NGO & international organisation partner 2' },
  { src: '/partners/partner-03.png', alt: 'Enterprise & agribusiness partner 3' },
  { src: '/partners/partner-04.png', alt: 'Government & development agency partner 4' },
  { src: '/partners/partner-05.png', alt: 'NGO & international organisation partner 5' },
  { src: '/partners/partner-06.png', alt: 'Enterprise & agribusiness partner 6' },
  { src: '/partners/partner-07.png', alt: 'Government & development agency partner 7' },
  { src: '/partners/partner-08.png', alt: 'NGO & international organisation partner 8' },
  { src: '/partners/partner-09.png', alt: 'Enterprise & agribusiness partner 9' },
  { src: '/partners/partner-10.png', alt: 'Government & development agency partner 10' },
  { src: '/partners/partner-11.png', alt: 'NGO & international organisation partner 11' },
  { src: '/partners/partner-12.png', alt: 'Enterprise & agribusiness partner 12' },
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ─── Motion helpers ─────────────────────────────────────────────────
   When prefersReducedMotion is true every helper returns props that
   render the element immediately in its final visible state with no
   transition (duration 0, no opacity/transform change).
─────────────────────────────────────────────────────────────────────── */

/** Props for a fade-up entrance element. */
function fadeUpProps(
  reduced: boolean,
  inView: boolean,
  delay: number,
): React.ComponentProps<typeof motion.div> {
  if (reduced) {
    // Immediately visible, no animation
    return { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } };
  }
  return {
    initial: { opacity: 0, y: 24 },
    animate: inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 },
    transition: { duration: 0.65, ease: EASE, delay },
  };
}

/** Props for the animated green divider. */
function dividerProps(
  reduced: boolean,
  inView: boolean,
): React.ComponentProps<typeof motion.div> {
  if (reduced) {
    return { initial: { scaleX: 1, opacity: 1 }, animate: { scaleX: 1, opacity: 1 } };
  }
  return {
    initial: { scaleX: 0, opacity: 0 },
    animate: inView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 },
    transition: { duration: 0.8, ease: EASE, delay: 0.35 },
  };
}

/** Props for a staggered logo card. */
function cardProps(
  reduced: boolean,
  inView: boolean,
  index: number,
): React.ComponentProps<typeof motion.div> {
  if (reduced) {
    return { initial: { opacity: 1, y: 0, scale: 1 }, animate: { opacity: 1, y: 0, scale: 1 } };
  }
  return {
    initial: { opacity: 0, y: 20, scale: 0.96 },
    animate: inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.96 },
    transition: { duration: 0.5, ease: EASE, delay: 0.55 + index * 0.06 },
  };
}

/* ─── Logo card ──────────────────────────────────────────────────────── */
function LogoCard({
  logo,
  index,
  inView,
  reduced,
}: {
  logo: { src: string; alt: string };
  index: number;
  inView: boolean;
  reduced: boolean;
}) {
  const cardCls = reduced
    ? // Fluid width so the card fills its grid cell; no hover motion
      'group w-full h-24 flex items-center justify-center bg-white rounded-[20px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.06)] px-4 py-4 cursor-default'
    : // Fixed size for marquee; full hover interactions
      'group flex-shrink-0 flex items-center justify-center w-[160px] h-[100px] bg-white rounded-[20px] border border-gray-100 shadow-[0_2px_12px_rgba(0,0,0,0.06)] px-7 py-6 mx-3 cursor-default transition-[transform,box-shadow] duration-[350ms] ease-out hover:shadow-[0_8px_32px_rgba(22,101,52,0.18),0_0_0_1.5px_rgba(22,101,52,0.15)] hover:-translate-y-1 hover:scale-105';

  const imgCls = reduced
    ? // Static: show at full opacity, no filter transition
      'h-10 w-auto max-w-[110px] object-contain'
    : // Animated: greyscale default, colour on hover
      'h-10 w-auto max-w-[110px] object-contain grayscale opacity-75 transition-[filter,opacity] duration-[350ms] ease-out group-hover:grayscale-0 group-hover:opacity-100';

  return (
    <motion.div {...cardProps(reduced, inView, index)} className={cardCls}>
      <img
        src={logo.src}
        alt={logo.alt}
        loading="lazy"
        width={110}
        height={40}
        className={imgCls}
      />
    </motion.div>
  );
}

/* ─── Main component ─────────────────────────────────────────────────── */
export function TrustSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-80px' });
  const reduced = useReducedMotion() ?? false;
  const [paused, setPaused] = useState(false);

  // Double the list for seamless CSS marquee loop
  const track = [...LOGOS, ...LOGOS];

  return (
    <section
      ref={sectionRef}
      className="relative py-20 overflow-hidden border-b border-gray-100"
      style={{
        background:
          'linear-gradient(160deg, #ffffff 0%, #f0fdf4 45%, #dcfce7 100%)',
      }}
      aria-label="Trusted partners"
    >
      {/* ── Decorative blurred circles ─────────────────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full opacity-[0.12]"
        style={{
          background: 'radial-gradient(circle, #16a34a, transparent 70%)',
          filter: 'blur(48px)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 -right-32 w-96 h-96 rounded-full opacity-[0.09]"
        style={{
          background: 'radial-gradient(circle, #15803d, transparent 70%)',
          filter: 'blur(64px)',
          transform: 'translateY(-50%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 left-1/3 w-64 h-64 rounded-full opacity-[0.08]"
        style={{
          background: 'radial-gradient(circle, #4ade80, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* ── Heading block ──────────────────────────────────────────── */}
      <div className="container mx-auto px-6 text-center mb-12">
        <motion.h2
          {...(fadeUpProps(reduced, inView, 0) as React.ComponentProps<typeof motion.h2>)}
          className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight"
        >
          Trusted by Governments, NGOs and
          <br className="hidden sm:block" /> Enterprises Across Africa
        </motion.h2>

        {/* Animated green divider */}
        <motion.div
          {...dividerProps(reduced, inView)}
          className="mx-auto mt-5 mb-6 h-[3px] w-20 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 origin-center"
        />

        <motion.p
          {...(fadeUpProps(reduced, inView, 0.45) as React.ComponentProps<typeof motion.p>)}
          className="mx-auto max-w-2xl text-base md:text-lg text-gray-500 leading-relaxed"
        >
          For more than 18 years, Esoko has partnered with governments, development
          agencies, NGOs, financial institutions, and private enterprises to digitally
          transform agriculture and improve the livelihoods of millions of farmers
          across Africa.
        </motion.p>
      </div>

      {/* ── Logo showcase ──────────────────────────────────────────── */}
      {reduced ? (
        /* Static grid for reduced-motion users — no animation at all */
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {LOGOS.map((logo, i) => (
              <LogoCard key={i} logo={logo} index={i} inView={inView} reduced={true} />
            ))}
          </div>
        </div>
      ) : (
        /* Infinite CSS marquee */
        <div
          className="relative w-full overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          role="region"
          aria-label="Partner logo carousel"
        >
          {/* Edge fade masks */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-28 z-10"
            style={{ background: 'linear-gradient(to right, #f0fdf4, transparent)' }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-28 z-10"
            style={{ background: 'linear-gradient(to left, #dcfce7, transparent)' }}
          />

          {/* Track: width = max-content so translateX(-50%) = exactly one loop */}
          <div
            className={`flex items-center ${paused ? 'animate-marquee animate-marquee-paused' : 'animate-marquee'}`}
            style={{ width: 'max-content' }}
          >
            {track.map((logo, i) => (
              <div key={i} aria-hidden={i >= LOGOS.length ? true : undefined}>
                <LogoCard
                  logo={logo}
                  index={i % LOGOS.length}
                  inView={inView}
                  reduced={false}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
