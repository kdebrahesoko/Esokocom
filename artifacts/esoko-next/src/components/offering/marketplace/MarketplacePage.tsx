import type { ReactNode } from 'react';
import { preconnect } from 'react-dom';
import { MARKETPLACE_URL } from '@/lib/site-links';
import { MarketplacePhoto } from './MarketplacePhoto';
import { MarketplaceGallery } from './MarketplaceGallery';
import { marketplacePhoto, MARKETPLACE_GALLERY, MARKETPLACE_TITLE, MARKETPLACE_DESCRIPTION } from './marketplace-content';
import './marketplace.css';

function MarketplaceLink({ children }: { children: ReactNode }) {
  return <a className="mp-primary" href={MARKETPLACE_URL} target="_blank" rel="noopener noreferrer">{children}<span className="mp-new-tab">Opens in a new tab</span></a>;
}

/** Approved Marketplace-only presentation; the shared header/footer remain in the root layout. */
export function MarketplacePage() {
  // Reuse the existing site fonts; avoid their connection setup blocking this photo-led page.
  preconnect('https://fonts.googleapis.com');
  preconnect('https://fonts.gstatic.com', { crossOrigin: 'anonymous' });
  return <main className="esoko-home esoko-marketplace">
      <section className="mp-hero" id="top" aria-labelledby="mp-title">
        <div className="mp-hero-image"><MarketplacePhoto photo={marketplacePhoto('094705')} priority sizes="100vw" /></div>
        <div className="mp-shade" />
        <div className="mp-hero-content">
          <p className="mp-kicker">Esoko Marketplace</p>
          <h1 id="mp-title">{MARKETPLACE_TITLE}</h1>
          <p className="mp-intro">{MARKETPLACE_DESCRIPTION}</p>
          <div className="mp-actions">
            <MarketplaceLink>Visit the Marketplace</MarketplaceLink>
            <a className="mp-secondary" href="#how-it-works">See how it works</a>
          </div>
        </div>
        <p className="mp-hero-caption">Inside the terminal</p>
      </section>

      <section className="mp-how" id="how-it-works" aria-labelledby="mp-how-title">
        <div className="mp-section-heading">
          <p className="mp-kicker mp-kicker-dark">Trade, made more direct</p>
          <h2 id="mp-how-title">A clearer connection from supply to demand.</h2>
          <p>Bring buyers and agricultural suppliers into direct contact, with the products and people that move the value chain.</p>
        </div>
        <article className="mp-feature mp-feature-one">
          <div className="mp-feature-copy">
            <span className="mp-feature-rule" aria-hidden="true" />
            <h3>Direct trading</h3>
            <p>Connect directly with farmers and wholesalers, without intermediaries.</p>
          </div>
          <figure>
            <MarketplacePhoto photo={marketplacePhoto('104114')} />
            <figcaption>People at an outdoor registration and demonstration table</figcaption>
          </figure>
        </article>
        <article className="mp-feature mp-feature-two">
          <figure>
            <MarketplacePhoto photo={marketplacePhoto('115630')} />
            <figcaption>Participants seated around a table during a discussion</figcaption>
          </figure>
          <div className="mp-feature-copy">
            <span className="mp-feature-rule" aria-hidden="true" />
            <h3>Agricultural products and commodities</h3>
            <p>Source verified fresh crops, livestock, seeds, fertilizers and farm equipment directly from registered suppliers.</p>
          </div>
        </article>
      </section>

      <MarketplaceGallery photos={MARKETPLACE_GALLERY} />

      <section className="mp-closing" aria-labelledby="mp-closing-title">
        <div className="mp-closing-photo"><MarketplacePhoto photo={marketplacePhoto('120906')} /></div>
        <div className="mp-closing-shade" />
        <div className="mp-closing-copy">
          <p className="mp-kicker">Esoko Marketplace</p>
          <h2 id="mp-closing-title">Make your next agricultural connection.</h2>
          <MarketplaceLink>Visit the Marketplace</MarketplaceLink>
        </div>
      </section>

  </main>;
}
