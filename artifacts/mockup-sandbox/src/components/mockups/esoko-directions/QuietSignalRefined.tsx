import { useRef, useState } from "react";
import "./_group.css";
import "./_QuietSignalRefined.css";
import { approvedPhotos, farmerVoice, logo } from "./_content";

export function QuietSignalRefined() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openMenu = () => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    setMenuOpen(true);
  };

  const closeMenu = () => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
    setMenuOpen(false);
    window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  };

  return (
    <main className="esoko-direction quiet-signal-refined">
      <header className="qsr-header">
        <div className="qsr-header-inner">
          <a className="qsr-brand" href="#top" aria-label="Esoko home">
            <img src={logo} width="1866" height="270" alt="Esoko" />
          </a>
          <nav className="qsr-desktop-nav" aria-label="Main navigation">
            <a href="#about">Who we are</a>
            <a href="/esoko-next/products-services/">Products &amp; Services</a>
            <a href="/esoko-next/company/">Company</a>
          </nav>
          <button
            className="qsr-menu-trigger"
            type="button"
            ref={menuButtonRef}
            aria-haspopup="dialog"
            aria-controls="qsr-mobile-menu"
            aria-expanded={menuOpen}
            onClick={openMenu}
          >
            <span>Menu</span>
            <span className="qsr-menu-glyph" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          </button>
        </div>
      </header>

      <dialog
        className="qsr-drawer"
        id="qsr-mobile-menu"
        ref={dialogRef}
        aria-labelledby="qsr-drawer-title"
        onClose={() => setMenuOpen(false)}
      >
        <div className="qsr-drawer-head">
          <img src={logo} width="1866" height="270" alt="Esoko" />
          <button
            type="button"
            className="qsr-drawer-close"
            onClick={closeMenu}
            autoFocus
          >
            Close
          </button>
        </div>
        <h2 id="qsr-drawer-title">Where would you like to go?</h2>
        <nav className="qsr-drawer-nav" aria-label="Mobile navigation">
          <a href="#about" onClick={closeMenu}>Who we are</a>
          <a href="/esoko-next/products-services/" onClick={closeMenu}>
            Products &amp; Services
          </a>
          <a href="/esoko-next/company/" onClick={closeMenu}>Company</a>
        </nav>
      </dialog>

      <section className="qsr-hero" id="top" aria-labelledby="qsr-title">
        <div className="qsr-hero-inner">
          <p className="qsr-kicker">Agricultural information and services</p>
          <h1 id="qsr-title">A useful message can make the next step clearer.</h1>
          <p className="qsr-hero-copy">
            Esoko brings practical agricultural information and services closer
            to farmers and the organisations alongside them.
          </p>
          <div className="qsr-hero-actions">
            <a
              className="qsr-primary-action"
              href="/esoko-next/products-services/"
            >
              Explore services
            </a>
            <a className="qsr-secondary-action" href="#about">
              How Esoko works
            </a>
          </div>

          <figure className="qsr-message-example">
            <img
              src={approvedPhotos.phone}
              width="590"
              height="1286"
              alt="Feature phone displaying an example Esoko weather message"
              fetchPriority="high"
              loading="eager"
              decoding="async"
            />
            <figcaption>
              <span className="qsr-example-title">An example SMS</span>
              <span>This photographed message is an example, not a live alert.</span>
            </figcaption>
          </figure>
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
            <a className="qsr-text-link" href="/esoko-next/company/">
              Learn about Esoko
            </a>
          </div>

          <figure className="qsr-voice" id="farmer-voice">
            <blockquote>“{farmerVoice.quote}”</blockquote>
            <figcaption>
              <span className="qsr-voice-name">{farmerVoice.name}</span>
              <span>{farmerVoice.role}</span>
              <span>{farmerVoice.location}</span>
              <span className="qsr-planned-photo">people photo planned</span>
              <a href={farmerVoice.href}>{farmerVoice.sourceLabel}</a>
            </figcaption>
          </figure>
        </div>
      </section>

      <section
        className="qsr-services"
        id="services"
        aria-labelledby="qsr-services-title"
      >
        <div className="qsr-services-inner">
          <div className="qsr-services-heading">
            <p className="qsr-kicker">Practical services</p>
            <h2 id="qsr-services-title">Support for the work around a farm decision.</h2>
            <a
              className="qsr-text-link"
              href="/esoko-next/products-services/"
            >
              See products &amp; services
            </a>
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
    </main>
  );
}

export default QuietSignalRefined;
