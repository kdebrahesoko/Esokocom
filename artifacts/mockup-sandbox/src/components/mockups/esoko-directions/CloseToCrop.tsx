import { approvedPhotos, farmerVoice, logo } from "./_content";
import "./_group.css";
import "./_CloseToCrop.css";

export function CloseToCrop() {
  return (
    <main className="esoko-direction close-crop">
      <header className="cc-header">
        <a className="cc-brand" href="#top" aria-label="Esoko home">
          <img src={logo} alt="Esoko" width="1866" height="270" />
        </a>
        <nav aria-label="Main navigation" className="cc-nav">
          <a href="#information">What Esoko does</a>
          <a href="/esoko-next/">Learn more</a>
        </nav>
      </header>

      <section className="cc-hero" id="top" aria-labelledby="cc-title">
        <div className="cc-hero-copy">
          <p className="cc-intro">Agricultural information, close to the decision</p>
          <h1 id="cc-title">
            Start with
            <br />
            what’s in hand.
          </h1>
          <p className="cc-deck">
            A handful of maize. A choice about what comes next. Esoko connects
            farmers and the people who work alongside them with practical
            agricultural information and services.
          </p>
          <a className="cc-primary" href="#farmer-voice">
            Hear a farmer’s words
          </a>
        </div>
        <figure className="cc-crop-figure">
          <div className="cc-crop-image">
            <img
              src={approvedPhotos.maize}
              alt="A close view of hands holding maize kernels"
              width="969"
              height="645"
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <figcaption>
            A crop, not a portrait. A set of decisions.
          </figcaption>
        </figure>
      </section>

      <section className="cc-voice" id="farmer-voice" aria-labelledby="cc-voice-title">
        <div className="cc-voice-context">
          <h2 id="cc-voice-title">A choice, in her own words.</h2>
          <p>
            Useful market information can help make the next step easier to
            weigh.
          </p>
          <a className="cc-text-link" href={farmerVoice.href}>
            Read the Marketplace story
          </a>
        </div>
        <figure className="cc-quote">
          <blockquote>“{farmerVoice.quote}”</blockquote>
          <figcaption>
            <strong>{farmerVoice.name}</strong>
            <span>{farmerVoice.role}</span>
            <span>{farmerVoice.location}</span>
            <a href={farmerVoice.href}>{farmerVoice.sourceLabel}</a>
          </figcaption>
          <p className="cc-quote-future">
            <span className="cc-people-marker">people photo planned</span>
            <span>A portrait may accompany this story with specific consent.</span>
          </p>
        </figure>
      </section>

      <section className="cc-information" id="information" aria-labelledby="cc-info-title">
        <div className="cc-info-heading">
          <h2 id="cc-info-title">Good information meets a real decision.</h2>
          <p>
            Esoko brings practical agricultural information and services to
            farmers, agribusinesses, NGOs and governments.
          </p>
        </div>
        <div className="cc-service-list">
          <article className="cc-service cc-service-market">
            <h3>Market choices</h3>
            <p>
              Market information can help farmers compare buyers and consider
              where to sell.
            </p>
            <a href={farmerVoice.href}>Explore the Marketplace</a>
          </article>
          <article className="cc-service cc-service-advice">
            <h3>Practical advice</h3>
            <p>
              Agricultural information supports the questions that come up
              through a growing season.
            </p>
          </article>
          <article className="cc-service cc-service-field">
            <h3>Field understanding</h3>
            <p>
              Organizations can gather information and connect their work to
              the people it serves.
            </p>
          </article>
        </div>
        <figure className="cc-input-figure">
          <img
            src={approvedPhotos.inputs}
            alt="Agricultural input bottles arranged on shop shelves"
            width="1440"
            height="960"
            loading="lazy"
            decoding="async"
          />
          <figcaption>Information is most useful when it has a place in daily work.</figcaption>
        </figure>
      </section>

    </main>
  );
}

export default CloseToCrop;
