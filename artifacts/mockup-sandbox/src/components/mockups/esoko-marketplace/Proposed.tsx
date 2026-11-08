import './_group.css';
import './_proposed.css';
import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, ReactNode } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import photos from './_photos.json';

type Photo = {
  id: string;
  desktop: { src: string; width: number; height: number };
  mobile: { src: string; width: number; height: number };
  blurDataURL: string;
};

const assets = photos as Photo[];
const byId = (id: string) => assets.find((photo) => photo.id === id)!;
const descriptions: Record<string, { alt: string; caption: string }> = {
  '094705': { alt: 'A person stands in the terminal doorway beside displays of crops and agricultural supplies.', caption: 'Inside the Esoko terminal' },
  '104114': { alt: 'People at an outdoor table during a registration and demonstration activity.', caption: 'An outdoor registration and demonstration table' },
  '113335': { alt: 'Audience members seated with notebooks during a presentation.', caption: 'Participants follow a presentation' },
  '113358': { alt: 'Participants seated together during a community event.', caption: 'A shared conversation' },
  '114744': { alt: 'Wide view of an audience gathered for a presentation.', caption: 'An audience gathered for a presentation' },
  '115613': { alt: 'A speaker addressing participants with a microphone.', caption: 'A speaker addresses the gathering' },
  '115630': { alt: 'Participants seated around a table during a discussion.', caption: 'Participants around the table' },
  '120906': { alt: 'Exterior view of a community terminal building.', caption: 'The terminal, viewed from outside' },
};

function PhotoImage({ photo, hero = false, className = '' }: { photo: Photo; hero?: boolean; className?: string }) {
  const copy = descriptions[photo.id];
  const [failed, setFailed] = useState(false);
  return (
    <div className={`mp-photo ${failed ? 'mp-photo-failed' : ''} ${className}`}>
      {!failed ? (
        <picture>
          <source media="(max-width: 767px)" srcSet={photo.mobile.src} />
          <img
            src={photo.desktop.src}
            width={photo.desktop.width}
            height={photo.desktop.height}
            alt={copy.alt}
            loading={hero ? 'eager' : 'lazy'}
            fetchPriority={hero ? 'high' : 'auto'}
            decoding="async"
            sizes={hero ? '100vw' : '(max-width: 767px) 100vw, 50vw'}
            style={{ backgroundImage: `url("${photo.blurDataURL}")` }}
            onError={() => setFailed(true)}
          />
        </picture>
      ) : (
        <div className="mp-image-error" role="img" aria-label={`Image unavailable: ${copy.alt}`}>
          <span>Image unavailable</span>
          <small>{copy.caption}</small>
        </div>
      )}
    </div>
  );
}

function MarketplaceLink({ children }: { children: ReactNode }) {
  return (
    <a className="mp-primary" href="https://marketplace.esoko.com/" target="_blank" rel="noopener noreferrer">
      {children}<span className="mp-new-tab">Opens in a new tab</span>
    </a>
  );
}

export function Proposed() {
  const gallery = ['104114', '114744', '115613', '113358', '115630', '120906'];
  const [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active !== null && !dialog.open) {
      dialog.showModal();
      closeRef.current?.focus();
    } else if (active === null && dialog.open) {
      dialog.close();
      openerRef.current?.focus();
    }
  }, [active]);

  const move = (direction: number) => setActive((index) => index === null ? null : (index + direction + gallery.length) % gallery.length);
  const onDialogKey = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    if (event.key === 'Tab') {
      const controls = dialogRef.current?.querySelectorAll<HTMLButtonElement>('button');
      if (!controls?.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <main className="marketplace-preview esoko-home proposed-marketplace">
      <header className="mp-header">
        <a className="mp-wordmark" href="#top" aria-label="Esoko Marketplace, back to top">
          <img src="/__mockup/images/esoko-approved/esoko-logo.png" alt="Esoko" width="106" height="44" /><i>Marketplace</i>
        </a>
        <a className="mp-header-link" href="#how-it-works">How it works</a>
      </header>

      <section className="mp-hero" id="top" aria-labelledby="mp-title">
        <div className="mp-hero-image"><PhotoImage photo={byId('094705')} hero /></div>
        <div className="mp-shade" />
        <div className="mp-hero-content">
          <p className="mp-kicker">Esoko Marketplace</p>
          <h1 id="mp-title">Empowering agricultural trade with innovative solutions</h1>
          <p className="mp-intro">Buy and sell agricultural products directly, with verified suppliers across the value chain.</p>
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
            <PhotoImage photo={byId('104114')} />
            <figcaption>People at an outdoor registration and demonstration table</figcaption>
          </figure>
        </article>
        <article className="mp-feature mp-feature-two">
          <figure>
            <PhotoImage photo={byId('115630')} />
            <figcaption>Participants seated around a table during a discussion</figcaption>
          </figure>
          <div className="mp-feature-copy">
            <span className="mp-feature-rule" aria-hidden="true" />
            <h3>Agricultural products and commodities</h3>
            <p>Source verified fresh crops, livestock, seeds, fertilizers and farm equipment directly from registered suppliers.</p>
          </div>
        </article>
      </section>

      <section className="mp-gallery-section" aria-labelledby="mp-gallery-title">
        <div className="mp-gallery-heading">
          <div><p className="mp-kicker mp-kicker-dark">People and place</p><h2 id="mp-gallery-title">Around the marketplace</h2></div>
          <p>Scenes from gatherings, presentations and conversations at the terminal.</p>
        </div>
        <div className="mp-gallery">
          {gallery.map((id, index) => {
            const photo = byId(id);
            const copy = descriptions[id];
            return (
              <button
                key={id}
                className={`mp-gallery-item mp-gallery-${index + 1}`}
                type="button"
                aria-label={`View larger: ${copy.caption}`}
                onClick={(event) => { openerRef.current = event.currentTarget; setActive(index); }}
              >
                <PhotoImage photo={photo} />
                <span className="mp-gallery-caption">{copy.caption}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mp-closing" aria-labelledby="mp-closing-title">
        <div className="mp-closing-photo"><PhotoImage photo={byId('120906')} /></div>
        <div className="mp-closing-shade" />
        <div className="mp-closing-copy">
          <p className="mp-kicker">Esoko Marketplace</p>
          <h2 id="mp-closing-title">Make your next agricultural connection.</h2>
          <MarketplaceLink>Visit the Marketplace</MarketplaceLink>
        </div>
      </section>

      <footer className="mp-footer">
        <a className="mp-wordmark" href="#top" aria-label="Esoko, back to top"><img src="/__mockup/images/esoko-approved/esoko-logo.png" alt="Esoko" width="106" height="44" /></a>
        <a href="#top">Back to top <ArrowRight aria-hidden="true" size={16} /></a>
      </footer>

      <dialog className="mp-viewer" ref={dialogRef} aria-label="Marketplace photo viewer" onKeyDown={onDialogKey}
        onCancel={(event) => { event.preventDefault(); setActive(null); }}
        onClick={(event) => { if (event.target === dialogRef.current) setActive(null); }}>
        {active !== null && (() => {
          const photo = byId(gallery[active]);
          const copy = descriptions[photo.id];
          return (
            <div className="mp-viewer-inner">
              <button ref={closeRef} className="mp-viewer-control mp-viewer-close" onClick={() => setActive(null)} aria-label="Close photo viewer"><X /></button>
              <button className="mp-viewer-control mp-viewer-prev" onClick={() => move(-1)} aria-label="Previous photo"><ArrowLeft /></button>
              <figure>
                <img src={photo.desktop.src} width={photo.desktop.width} height={photo.desktop.height} alt={copy.alt} />
                <figcaption>{copy.caption} <span>{active + 1} of {gallery.length}</span></figcaption>
              </figure>
              <button className="mp-viewer-control mp-viewer-next" onClick={() => move(1)} aria-label="Next photo"><ArrowRight /></button>
            </div>
          );
        })()}
      </dialog>
    </main>
  );
}
