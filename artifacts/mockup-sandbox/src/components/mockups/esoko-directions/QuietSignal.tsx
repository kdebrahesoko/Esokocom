import "./_group.css";
import "./_QuietSignal.css";
import { approvedPhotos, farmerVoice, logo } from "./_content";

export function QuietSignal() {
  return (
    <main className="esoko-direction quiet-signal">
      <header className="qs-header">
        <div className="qs-header-inner">
          <a className="qs-brand" href="#top" aria-label="Esoko home">
            <img src={logo} width="1866" height="270" alt="Esoko" />
          </a>
          <nav className="qs-nav" aria-label="Main navigation">
            <a href="#esoko">Who we are</a>
            <a href="#services">What we do</a>
            <a className="qs-nav-cta" href="/esoko-next/company/">Learn about Esoko</a>
          </nav>
        </div>
      </header>

      <section className="qs-hero" id="top" aria-labelledby="qs-hero-title">
        <div className="qs-hero-inner">
          <div className="qs-hero-copy">
            <p className="qs-kicker">Agricultural information and services</p>
            <h1 id="qs-hero-title">
              A useful message can make the next step clearer.
            </h1>
            <p className="qs-hero-description">
              Esoko helps connect farmers and the organisations that work
              alongside them with practical agricultural information.
            </p>
            <div className="qs-hero-actions">
              <a className="qs-button qs-button-primary" href="#esoko">
                See how Esoko works
              </a>
              <a className="qs-button qs-button-quiet" href={farmerVoice.href}>
                Explore the marketplace
              </a>
            </div>
          </div>

          <figure className="qs-phone">
            <div className="qs-phone-image">
              <img
                src={approvedPhotos.phone}
                width="590"
                height="1286"
                alt="Feature phone showing an example Esoko weather message"
                fetchPriority="high"
                loading="eager"
                decoding="async"
              />
            </div>
            <figcaption>
              <span className="qs-caption-mark" aria-hidden="true" />
              Example SMS message, not a live alert
            </figcaption>
          </figure>
        </div>
        <a className="qs-scroll-cue" href="#esoko">
          <span aria-hidden="true">↓</span>
          A little more about Esoko
        </a>
      </section>

      <section className="qs-about" id="esoko" aria-labelledby="qs-about-title">
        <div className="qs-section-inner qs-about-layout">
          <div className="qs-about-copy">
            <p className="qs-kicker">Information belongs in the conversation</p>
            <h2 id="qs-about-title">
              Agriculture is local. Useful information should be, too.
            </h2>
            <p>
              Esoko connects farmers, agribusinesses, NGOs and governments with
              practical agricultural information and services. The work spans
              field data, advisory, communication and access to market
              information.
            </p>
            <a className="qs-text-link" href="/esoko-next/company/">
              Learn more about Esoko
            </a>
          </div>

          <figure className="qs-voice" id="voice">
            <blockquote>“{farmerVoice.quote}”</blockquote>
            <figcaption>
              <span className="qs-voice-name">{farmerVoice.name}</span>
              <span>{farmerVoice.role}</span>
              <span>{farmerVoice.location}</span>
              <span className="qs-planned-photo">people photo planned</span>
              <a href={farmerVoice.href}>{farmerVoice.sourceLabel}</a>
            </figcaption>
          </figure>
        </div>
      </section>

      <section
        className="qs-services"
        id="services"
        aria-labelledby="qs-services-title"
      >
        <div className="qs-section-inner qs-services-layout">
          <div className="qs-services-intro">
            <p className="qs-kicker">Useful, at each point along the way</p>
            <h2 id="qs-services-title">Information has to travel both ways.</h2>
            <p>
              Esoko brings together the tools to listen, share guidance and
              make market information easier to reach.
            </p>
            <a className="qs-button qs-button-primary" href="/esoko-next/company/">
              Explore Esoko’s services
            </a>
          </div>

          <div className="qs-service-list">
            <article className="qs-service-row">
              <span className="qs-service-word">Understand</span>
              <div>
                <h3>Start with what is happening in the field</h3>
                <p>
                  Collect agricultural data and make field work easier to
                  understand.
                </p>
              </div>
            </article>
            <article className="qs-service-row">
              <span className="qs-service-word">Share</span>
              <div>
                <h3>Put practical information within reach</h3>
                <p>
                  Deliver advisory and updates through mobile communication,
                  including SMS.
                </p>
              </div>
            </article>
            <article className="qs-service-row">
              <span className="qs-service-word">Connect</span>
              <div>
                <h3>Bring market information into view</h3>
                <p>
                  Help farmers and organisations access marketplace services
                  and market information.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

export default QuietSignal;
