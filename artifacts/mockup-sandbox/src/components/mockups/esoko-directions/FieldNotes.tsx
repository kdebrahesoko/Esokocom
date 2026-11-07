import "./_group.css";
import "./_FieldNotes.css";
import { approvedPhotos, farmerVoice, logo } from "./_content";

export function FieldNotes() {
  return (
    <main className="esoko-direction field-notes" id="top">
      <header className="fn-header">
        <a className="fn-brand" href="#top" aria-label="Esoko home">
          <img src={logo} width="1866" height="270" alt="Esoko" />
        </a>
        <nav className="fn-nav" aria-label="Main navigation">
          <a href="#voice">A farmer’s perspective</a>
          <a href="#information">Services</a>
          <a className="fn-nav-cta" href="/esoko-next/company/">
            Learn more
          </a>
        </nav>
      </header>

      <section className="fn-hero" aria-labelledby="fn-hero-title">
        <div className="fn-hero-copy">
          <p className="fn-lead-in">Information for agriculture</p>
          <h1 id="fn-hero-title">Better information for the choices a season asks.</h1>
          <p className="fn-hero-description">
            Esoko connects farmers, agribusinesses, NGOs and governments with
            practical agricultural information and services.
          </p>
          <a className="fn-primary-link" href="#information">
            See how Esoko works
          </a>
        </div>
        <figure className="fn-hero-figure">
          <img
            src={approvedPhotos.tablet}
            alt="A person reviews information on a tablet inside an agricultural input shop."
            width="2400"
            height="1600"
            loading="eager"
            fetchPriority="high"
          />
          <figcaption>
            A practical moment in an agricultural input shop. This anonymous
            field photograph is not the speaker in the Marketplace story below.
          </figcaption>
        </figure>
      </section>

      <section className="fn-voice" id="voice" aria-labelledby="fn-voice-title">
        <div className="fn-voice-heading">
          <p className="fn-lead-in">A farmer’s perspective</p>
          <h2 id="fn-voice-title">A clearer view of the choices ahead.</h2>
          <p>
            Market information can help make options easier to compare. Here,
            one farmer describes what that means to her.
          </p>
        </div>
        <div className="fn-voice-content">
          <blockquote>
            <p>“{farmerVoice.quote}”</p>
            <footer>
              <cite>
                <strong>{farmerVoice.name}</strong>
                <span>{farmerVoice.role}</span>
                <span>{farmerVoice.location}</span>
              </cite>
              <a href={farmerVoice.href}>{farmerVoice.sourceLabel}</a>
            </footer>
          </blockquote>
          <div className="fn-voice-detail">
            <img
              src={approvedPhotos.maize}
              alt="Close view of hands holding maize kernels."
              width="969"
              height="645"
              loading="lazy"
            />
            <p className="fn-image-caption">
              Maize kernels in an anonymous detail photograph.
            </p>
            <p className="fn-photo-plan">people photo planned</p>
            <p className="fn-photo-note">
              No portrait is shown. The pictured hands are not attributed to
              Mariama Diallo.
            </p>
          </div>
        </div>
      </section>

      <section className="fn-information" id="information" aria-labelledby="fn-information-title">
        <div className="fn-information-intro">
          <p className="fn-lead-in">Information, in practical forms</p>
          <h2 id="fn-information-title">
            Useful decisions draw on more than one kind of information.
          </h2>
          <p>
            Esoko brings together services that help people share agricultural
            information, understand field realities and connect with markets.
          </p>
          <a className="fn-text-link" href="/esoko-next/company/">
            Learn more about Esoko
          </a>
        </div>
        <div className="fn-information-detail">
          <figure className="fn-inputs-figure">
            <img
              src={approvedPhotos.inputs}
              alt="Agricultural input bottles arranged on shop shelves."
              width="1440"
              height="960"
              loading="lazy"
            />
            <figcaption>Tools and information belong in the same conversation.</figcaption>
          </figure>
          <ul className="fn-pathways">
            <li>
              <h3>Market information</h3>
              <p>Compare options and connect farmers with buyers.</p>
            </li>
            <li>
              <h3>Agricultural advice</h3>
              <p>Share practical guidance through accessible channels.</p>
            </li>
            <li>
              <h3>Field data</h3>
              <p>Collect information that helps programmes understand local needs.</p>
            </li>
          </ul>
        </div>
      </section>

      <footer className="fn-footer">
        <a className="fn-brand" href="#top" aria-label="Back to Esoko home">
          <img src={logo} width="1866" height="270" alt="Esoko" loading="lazy" />
        </a>
        <a href="/esoko-next/company/">Get to know Esoko</a>
      </footer>
    </main>
  );
}
