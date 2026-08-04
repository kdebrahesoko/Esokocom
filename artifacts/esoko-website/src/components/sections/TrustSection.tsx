import { motion } from 'framer-motion';

const LOGOS = [
  { src: '/partners/partner-01.png', alt: 'Partner 1' },
  { src: '/partners/partner-02.png', alt: 'Partner 2' },
  { src: '/partners/partner-03.png', alt: 'Partner 3' },
  { src: '/partners/partner-04.png', alt: 'Partner 4' },
  { src: '/partners/partner-05.png', alt: 'Partner 5' },
  { src: '/partners/partner-06.png', alt: 'Partner 6' },
  { src: '/partners/partner-07.png', alt: 'Partner 7' },
  { src: '/partners/partner-08.png', alt: 'Partner 8' },
  { src: '/partners/partner-09.png', alt: 'Partner 9' },
  { src: '/partners/partner-10.png', alt: 'Partner 10' },
  { src: '/partners/partner-11.png', alt: 'Partner 11' },
  { src: '/partners/partner-12.png', alt: 'Partner 12' },
];

// Each slot: 160 px image area + 40 px gap = 200 px per item
const ITEM_W = 200;
const LOOP_W = LOGOS.length * ITEM_W; // 2400 px

export function TrustSection() {
  const track = [...LOGOS, ...LOGOS]; // duplicate for seamless loop

  return (
    <section className="py-12 bg-white overflow-hidden border-b border-gray-100">
      {/* Heading */}
      <div className="container mx-auto px-4 mb-8">
        <p className="text-center text-sm font-semibold tracking-wider text-muted-foreground uppercase">
          Trusted by governments, NGOs and enterprises across Africa
        </p>
      </div>

      {/* Marquee */}
      <div className="relative w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-white to-transparent" />

        <motion.div
          className="flex items-center"
          style={{ width: LOOP_W * 2 }}
          animate={{ x: [0, -LOOP_W] }}
          transition={{
            x: { repeat: Infinity, repeatType: 'loop', duration: 38, ease: 'linear' },
          }}
        >
          {track.map((logo, i) => (
            <div
              key={i}
              aria-hidden={i >= LOGOS.length ? true : undefined}
              className="flex-shrink-0 flex items-center justify-center"
              style={{ width: ITEM_W }}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-9 w-auto max-w-[130px] object-contain grayscale opacity-55 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
