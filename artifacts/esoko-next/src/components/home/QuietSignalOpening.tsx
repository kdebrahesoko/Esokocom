import Image from "next/image";
import type { ReactNode } from "react";
import { SiteLink as Link } from "@/components/site/SiteLink";
import { NEXT_BASE_PATH } from "@/lib/site-links";
import "./quiet-signal.css";
import "./photo-hero.css";

/**
 * Approved photo hero; the existing Quiet Signal sections below it are retained.
 * The layout's navigation remains the only header. Static content is server rendered.
 *
 * Quote provenance: existing website src/data/solutions.ts Marketplace story.
 * Reusing that attribution is not independent testimonial verification.
 * No photograph identifies the speaker; portrait consent is still pending.
 */
const farmerVoice = {
  quote: "Now I compare prices from four buyers and choose the best deal.",
  name: "Mariama Diallo",
  role: "Smallholder Maize Farmer",
  location: "Northern Region, Ghana",
};

export function QuietSignalOpening({ afterHero }: { afterHero?: ReactNode }) {
  return (
    <div className="quiet-signal-opening photo-hero-opening">
      <section className="qsr-hero photo-hero" id="top" aria-labelledby="photo-hero-title">
        <Image
          className="photo-hero-image"
          src={`${NEXT_BASE_PATH}/site-assets/home/hero-field.webp`}
          fill
          sizes="(max-width: 767px) 1600px, (max-width: 1299px) 1300px, 100vw"
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
              <Link className="qsr-primary-action" href="/demo/">
                Request a demo
              </Link>
              <Link className="qsr-secondary-action" href="/products-services/">
                Explore our solutions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {afterHero}

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
