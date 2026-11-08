import type { ImgHTMLAttributes, AnchorHTMLAttributes } from "react";
import "./_group.css";
import "./_baseline.css";
function Image({fill: _fill, priority: _priority, ...props}: ImgHTMLAttributes<HTMLImageElement> & {fill?: boolean; priority?: boolean}) {return <img {...props} />;}
function Link(props: AnchorHTMLAttributes<HTMLAnchorElement>) {return <a {...props} onClick={e=>e.preventDefault()} />;}
export function Current(){return <div className="esoko-hero-study quiet-signal-opening photo-hero-opening">
      <section className="qsr-hero photo-hero" id="top" aria-labelledby="photo-hero-title">
        <Image
          className="photo-hero-image"
          src={"/__mockup/images/esoko-photo-hero/hero-field.webp"}
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

</div>;}
