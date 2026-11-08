import { ExternalLink } from "lucide-react";
import { SectorOpening } from "./_Context";
import { SIKAFIELDS_URL } from "./_project";
import "./_group.css";
import "./_feature.css";

export function Proposed() {
  return (
    <SectorOpening>
      <section className="sf-feature" aria-labelledby="sf-feature-title">
        <div className="sf-feature__inner">
          <div className="sf-feature__copy">
            <p className="sf-feature__name">SikaFields</p>
            <h2 id="sf-feature-title">Transform farming into climate action.</h2>
            <p className="sf-feature__description">
              Built on Esoko’s field experience, SikaFields helps smallholder farmers
              take part in carbon projects through farm mapping, field monitoring
              and digital tools—connecting climate action with farmer livelihoods.
            </p>
            <a
              href={SIKAFIELDS_URL}
              className="sf-feature__link"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Explore SikaFields (opens in a new tab)"
            >
              Explore SikaFields
              <ExternalLink size={18} aria-hidden="true" />
            </a>
            <span className="sf-feature__destination">sikafields.net · opens in a new tab</span>
          </div>
          <figure className="sf-feature__figure">
            <div className="sf-feature__image">
              <img
                src="/__mockup/images/esoko-approved/hands-holding-maize-kernels.webp"
                alt="Cupped hands holding maize kernels."
                width={969}
                height={645}
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption>Agricultural detail from Esoko’s image library.</figcaption>
          </figure>
        </div>
      </section>
    </SectorOpening>
  );
}
