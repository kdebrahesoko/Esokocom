import type { ImgHTMLAttributes, AnchorHTMLAttributes } from "react";
function Image({ priority: _priority, ...props }: ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) { return <img {...props} />; }
function Link(props: AnchorHTMLAttributes<HTMLAnchorElement>) { return <a {...props} onClick={event => event.preventDefault()} />; }
function HeroLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) { return <a {...props} />; }
const NEXT_BASE_PATH = "/__mockup";
import "./_group.css";
import "./_Current.css";
import "./_PhotoHero.css";

/**
 * Photo-led homepage hero study. The shared site navigation remains outside
 * this isolated preview. Lower sections are retained verbatim as context.
 */
const farmerVoice = {
  quote: "Now I compare prices from four buyers and choose the best deal.",
  name: "Mariama Diallo",
  role: "Smallholder Maize Farmer",
  location: "Northern Region, Ghana",
};

export function PhotoHero() {
  return (
    <div className="esoko-hero-study quiet-signal-opening photo-hero-opening">
      <section className="qsr-hero photo-hero" id="top" aria-labelledby="photo-hero-title">
        <Image
          className="photo-hero-image"
          src={`${NEXT_BASE_PATH}/images/esoko-photo-hero/hero-field.webp`}
          width={2400}
          height={1655}
          sizes="100vw"
          alt="Three people looking at a handheld device in a maize field."
          priority
        />
        <div className="photo-hero-shade" aria-hidden="true" />
        <div className="qsr-hero-inner photo-hero-inner">
          <div className="photo-hero-message">
            <p className="qsr-kicker">Sustainability, quality and efficiency</p>
            <h1 id="photo-hero-title">
              Connecting last-mile communities with services through digital innovation
            </h1>
            <p className="qsr-hero-copy">
              We help organizations improve the quality and efficiency of surveys and last-mile service delivery, and manage development projects seamlessly on one tech-enabled platform.
            </p>
            <div className="qsr-hero-actions">
              <HeroLink className="qsr-primary-action" href="/esoko-next/demo/">
                Request a demo
              </HeroLink>
              <HeroLink className="qsr-secondary-action" href="/esoko-next/products-services/">
                Explore our solutions
              </HeroLink>
            </div>
          </div>
        </div>
      </section>

      <section className="qsr-about" id="about" aria-labelledby="qsr-about-title">
        <div className="qsr-about-inner">
          <div className="qsr-about-intro">
            <p className="qsr-kicker">Local knowledge matters</p>
            <h2 id="qsr-about-title">
              The decision is local. Information should meet it there.
            </h2>
            <p>
              Esoko connects farmers, agribusinesses, NGOs and governments with
              practical agricultural information and services—from field data
              and advisory to communication and market access.
            </p>
            <Link className="qsr-text-link" href="/company/">
              Learn about Esoko
            </Link>
          </div>
          <figure className="qsr-voice" id="farmer-voice">
            <blockquote>“{farmerVoice.quote}”</blockquote>
            <figcaption>
              <span className="qsr-voice-name">{farmerVoice.name}</span>
              <span>{farmerVoice.role}</span>
              <span>{farmerVoice.location}</span>
              <span className="qsr-planned-photo">people photo planned</span>
              <Link href="/solutions/marketplace/">From Esoko’s Marketplace story</Link>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="qsr-services" id="services" aria-labelledby="qsr-services-title">
        <div className="qsr-services-inner">
          <div className="qsr-services-heading">
            <p className="qsr-kicker">Practical services</p>
            <h2 id="qsr-services-title">Support for the work around a farm decision.</h2>
            <Link className="qsr-text-link" href="/products-services/">
              See products &amp; services
            </Link>
          </div>
          <ul className="qsr-service-list">
            <li>
              <h3>Understand what is happening in the field</h3>
              <p>Data collection and field operations for agricultural programmes.</p>
            </li>
            <li>
              <h3>Share guidance in useful ways</h3>
              <p>Advisory and mobile communication, including SMS.</p>
            </li>
            <li>
              <h3>Bring market information within reach</h3>
              <p>Marketplace services and information for farmers and organisations.</p>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
