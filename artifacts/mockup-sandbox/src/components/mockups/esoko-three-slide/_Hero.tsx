import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";
import "./_group.css";
import "./_baseline.css";
import "./_carousel.css";

type Slide = {
  kicker: string;
  title: string;
  alt: string;
  desktop: string;
  mobile: string;
  copy?: string;
  highlights?: { label: string; detail: string }[];
  actions: { label: string; href: string; secondary?: boolean }[];
};

const slides: Slide[] = [
  {
    kicker: "Sustainability, quality and efficiency",
    title: "Connecting last-mile communities with services through digital innovation",
    alt: "Three people looking at a handheld device in a maize field.",
    desktop: "/__mockup/images/esoko-photo-hero/hero-field.webp",
    mobile: "/__mockup/images/esoko-photo-hero/hero-field.webp",
    copy: "We help organizations improve the quality and efficiency of surveys and last-mile service delivery, and manage development projects seamlessly on one tech-enabled platform.",
    actions: [
      { label: "Request a demo", href: "/esoko-next/demo/" },
      { label: "Explore our solutions", href: "/esoko-next/products-services/", secondary: true },
    ],
  },
  {
    kicker: "Esoko Marketplace",
    title: "Empowering agricultural trade with innovative solutions",
    alt: "Esoko team members standing together at the Esoko Farmer Terminal.",
    desktop: "/__mockup/images/esoko-three-slide/marketplace-desktop.webp",
    mobile: "/__mockup/images/esoko-three-slide/marketplace-mobile.webp",
    copy: "Trade directly with farmers and wholesalers, without intermediaries.",
    actions: [{ label: "See how it works", href: "/esoko-next/solutions/marketplace/" }],
  },
  {
    kicker: "Our core service pillars",
    title: "One platform, six integrated services",
    alt: "Esoko call centre staff supporting customers with headsets.",
    desktop: "/__mockup/images/esoko-three-slide/service-pillars-desktop.webp",
    mobile: "/__mockup/images/esoko-three-slide/service-pillars-mobile.webp",
    highlights: [
      {
        label: "Farmer registration",
        detail: "digital identity, profiling and traceability for over 800,000 smallholders in Ghana",
      },
      {
        label: "Agronomy and extension",
        detail:
          "expert advice, weather intelligence and market price alerts, delivered by SMS, voice and call centre",
      },
    ],
    actions: [{ label: "Explore all six pillars", href: "/esoko-next/products-services/" }],
  },
];

function Picture({ slide, index, active, onLoad }: {
  slide: Slide;
  index: number;
  active: boolean;
  onLoad: () => void;
}) {
  return (
    <picture className={`esoko-carousel-picture${active ? " is-active" : ""}`}>
      {slide.mobile !== slide.desktop && (
        <source media="(max-width: 767px)" srcSet={slide.mobile} />
      )}
      <img
        className={`photo-hero-image esoko-carousel-image esoko-carousel-image-${index + 1}`}
        src={slide.desktop}
        alt={slide.alt}
        loading="eager"
        decoding="async"
        onLoad={onLoad}
      />
    </picture>
  );
}

export function EsokoThreeSlideHero({ initialSlide = 0 }: { initialSlide?: number }) {
  const initial = Math.min(Math.max(initialSlide, 0), slides.length - 1);
  const [activeIndex, setActiveIndex] = useState(initial);
  const [loadedImages, setLoadedImages] = useState<number[]>([initial]);
  const [readyImages, setReadyImages] = useState<number[]>([]);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [autoplay, setAutoplay] = useState(false);
  const [stoppedByUser, setStoppedByUser] = useState(false);
  const [pausedByPresence, setPausedByPresence] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const startX = useRef<number | null>(null);
  const active = slides[activeIndex];

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const preload = () => {
      const schedule = window.requestIdleCallback ?? ((cb: IdleRequestCallback) => window.setTimeout(cb, 400));
      schedule(() => setLoadedImages([0, 1, 2]));
    };
    if (document.readyState === "complete") {
      preload();
    } else {
      window.addEventListener("load", preload, { once: true });
      return () => window.removeEventListener("load", preload);
    }
    return undefined;
  }, []);

  useEffect(() => {
    if (pendingIndex !== null && readyImages.includes(pendingIndex)) {
      setActiveIndex(pendingIndex);
      setPendingIndex(null);
    }
  }, [pendingIndex, readyImages]);

  useEffect(() => {
    if (!autoplay || pausedByPresence || reducedMotion || stoppedByUser) return;
    const timer = window.setInterval(() => {
      const nextIndex = (activeIndex + 1) % slides.length;
      setLoadedImages((loaded) => loaded.includes(nextIndex) ? loaded : [...loaded, nextIndex]);
      setPendingIndex(nextIndex);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [activeIndex, autoplay, pausedByPresence, reducedMotion, stoppedByUser]);

  const moveTo = (index: number) => {
    const nextIndex = (index + slides.length) % slides.length;
    setStoppedByUser(true);
    setAutoplay(false);
    setLoadedImages((loaded) => loaded.includes(nextIndex) ? loaded : [...loaded, nextIndex]);
    setPendingIndex(nextIndex);
  };

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    startX.current = event.clientX;
  };
  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    if (startX.current === null) return;
    const distance = event.clientX - startX.current;
    startX.current = null;
    if (Math.abs(distance) > 48) moveTo(activeIndex + (distance < 0 ? 1 : -1));
  };

  return (
    <div className="esoko-hero-study quiet-signal-opening photo-hero-opening esoko-carousel-study">
      <section
        className="qsr-hero photo-hero esoko-carousel"
        aria-label="Esoko services"
        aria-roledescription="carousel"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { startX.current = null; }}
        onMouseEnter={() => setPausedByPresence(true)}
        onMouseLeave={() => setPausedByPresence(false)}
        onFocusCapture={() => setPausedByPresence(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
            setPausedByPresence(false);
          }
        }}
      >
        <div className="esoko-carousel-images" aria-hidden="true">
          {loadedImages.map((index) => (
            <Picture
              key={index}
              slide={slides[index]}
              index={index}
              active={index === activeIndex}
              onLoad={() => {
                setReadyImages(ready => ready.includes(index) ? ready : [...ready, index]);
              }}
            />
          ))}
        </div>
        <div className="photo-hero-shade esoko-carousel-shade" aria-hidden="true" />

        <div className="esoko-carousel-controls" aria-label="Slide controls">
          <button className="esoko-carousel-step" type="button" aria-label="Previous slide" onClick={() => moveTo(activeIndex - 1)}>
            <span aria-hidden="true" className="esoko-chevron esoko-chevron-previous" />
          </button>
          <div className="esoko-carousel-dots" role="group" aria-label="Choose a slide">
            {slides.map((slide, index) => (
              <button
                className={`esoko-carousel-dot${index === activeIndex ? " is-active" : ""}`}
                key={slide.kicker}
                type="button"
                aria-label={`Slide ${index + 1} of 3: ${slide.kicker}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => moveTo(index)}
              >
                <span aria-hidden="true" />
              </button>
            ))}
          </div>
          <button className="esoko-carousel-step" type="button" aria-label="Next slide" onClick={() => moveTo(activeIndex + 1)}>
            <span aria-hidden="true" className="esoko-chevron esoko-chevron-next" />
          </button>
          <button
            className="esoko-carousel-toggle"
            type="button"
            aria-label={autoplay ? "Pause automatic slides" : "Play automatic slides"}
            aria-pressed={autoplay}
            disabled={reducedMotion || stoppedByUser}
            onClick={() => {
              if (autoplay) {
                setAutoplay(false);
              } else if (!stoppedByUser && !reducedMotion) {
                setAutoplay(true);
              }
            }}
          >
            <span className={autoplay ? "esoko-pause-mark" : "esoko-play-mark"} aria-hidden="true" />
          </button>
        </div>

        <div className="qsr-hero-inner photo-hero-inner esoko-carousel-inner">
          <div className="photo-hero-message esoko-carousel-message" aria-live="polite">
            <div className="esoko-carousel-copy" key={activeIndex}>
              <p className="qsr-kicker">{active.kicker}</p>
              {activeIndex === 0 ? (
                <h1 id="esoko-carousel-title">{active.title}</h1>
              ) : (
                <h2 id="esoko-carousel-title">{active.title}</h2>
              )}
              {active.copy && <p className="qsr-hero-copy">{active.copy}</p>}
              {active.highlights && (
                <ul className="esoko-carousel-highlights">
                  {active.highlights.map((item) => (
                    <li key={item.label}>
                      <span className="esoko-highlight-marker" aria-hidden="true" />
                      <p><strong>{item.label}:</strong> {item.detail}</p>
                    </li>
                  ))}
                </ul>
              )}
              <div className="qsr-hero-actions">
                {active.actions.map((action) => (
                  <a
                    className={action.secondary ? "qsr-secondary-action" : "qsr-primary-action"}
                    href={action.href}
                    key={action.label}
                  >
                    {action.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
