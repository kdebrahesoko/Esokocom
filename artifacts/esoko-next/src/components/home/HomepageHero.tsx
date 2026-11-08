import { SiteLink as Link } from "@/components/site/SiteLink";
import { HeroCarouselClient } from "./HeroCarouselClient";
import { heroImages } from "./hero-images";

/** All editorial content stays in the server-rendered HTML, even on inactive slides. */
export function HomepageHero() {
  return (
    <HeroCarouselClient images={heroImages}>
      <article className="esoko-carousel-copy" aria-label="Slide 1 of 3: Sustainability, quality and efficiency">
        <p className="qsr-kicker">Sustainability, quality and efficiency</p>
        <h1 id="photo-hero-title">
          Connecting last-mile communities with services through digital innovation
        </h1>
        <p className="qsr-hero-copy">
          We help organizations improve the quality and efficiency of surveys and last-mile service delivery, and manage development projects seamlessly on one tech-enabled platform.
        </p>
        <div className="qsr-hero-actions">
          <Link className="qsr-primary-action" href="/demo/">Request a demo</Link>
          <Link className="qsr-secondary-action" href="/products-services/">Explore our solutions</Link>
        </div>
      </article>
      <article className="esoko-carousel-copy" aria-label="Slide 2 of 3: Esoko Marketplace">
        <p className="qsr-kicker">Esoko Marketplace</p>
        <h2>Empowering agricultural trade with innovative solutions</h2>
        <p className="qsr-hero-copy">Trade directly with farmers and wholesalers, without intermediaries.</p>
        <div className="qsr-hero-actions">
          <Link className="qsr-primary-action" href="/solutions/marketplace/">See how it works</Link>
        </div>
      </article>
      <article className="esoko-carousel-copy" aria-label="Slide 3 of 3: Our core service pillars">
        <p className="qsr-kicker">Our core service pillars</p>
        <h2>One platform, six integrated services</h2>
        <ul className="esoko-carousel-highlights">
          <li><span className="esoko-highlight-marker" aria-hidden="true" /><p><strong>Farmer registration:</strong> digital identity, profiling and traceability for over 800,000 smallholders in Ghana</p></li>
          <li><span className="esoko-highlight-marker" aria-hidden="true" /><p><strong>Agronomy and extension:</strong> expert advice, weather intelligence and market price alerts, delivered by SMS, voice and call centre</p></li>
        </ul>
        <div className="qsr-hero-actions">
          <Link className="qsr-primary-action" href="/products-services/">Explore all six pillars</Link>
        </div>
      </article>
    </HeroCarouselClient>
  );
}
