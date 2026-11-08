'use client';

import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { MarketplacePhoto } from './MarketplacePhoto';
import type { MarketplacePhotoData } from './marketplace-content';

export function MarketplaceGallery({ photos }: { photos: readonly MarketplacePhotoData[] }) {
  const [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isOpen = active !== null;

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

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [isOpen]);

  const move = (direction: number) => setActive(index =>
    index === null ? null : (index + direction + photos.length) % photos.length);
  const onDialogKey = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
    if (event.key === 'Tab') {
      const controls = dialogRef.current?.querySelectorAll<HTMLButtonElement>('button');
      if (!controls?.length) return;
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
  };
  const selected = active === null ? null : photos[active];

  return <section className="mp-gallery-section" aria-labelledby="mp-gallery-title">
    <div className="mp-gallery-heading">
      <div><p className="mp-kicker mp-kicker-dark">People and place</p><h2 id="mp-gallery-title">Around the marketplace</h2></div>
      <p>Scenes from gatherings, presentations and conversations at the terminal.</p>
    </div>
    <div className="mp-gallery">
      {photos.map((photo, index) => <button
        key={photo.id} className={`mp-gallery-item mp-gallery-${index + 1}`}
        type="button" aria-label={`View larger: ${photo.caption}`}
        aria-haspopup="dialog" aria-controls="marketplace-photo-viewer"
        onClick={event => { openerRef.current = event.currentTarget; setActive(index); }}
      >
        <MarketplacePhoto photo={photo} sizes="(max-width: 767px) 50vw, (max-width: 1024px) 50vw, 60vw" />
        <span className="mp-gallery-caption">{photo.caption}</span>
      </button>)}
    </div>
    <dialog id="marketplace-photo-viewer" className="mp-viewer" ref={dialogRef}
      aria-label="Marketplace photo viewer" onKeyDown={onDialogKey}
      onCancel={event => { event.preventDefault(); setActive(null); }}
      onClick={event => { if (event.target === dialogRef.current) setActive(null); }}>
      {selected && <div className="mp-viewer-inner">
        <button type="button" ref={closeRef} className="mp-viewer-control mp-viewer-close" onClick={() => setActive(null)} aria-label="Close photo viewer"><X aria-hidden="true" /></button>
        <button type="button" className="mp-viewer-control mp-viewer-prev" onClick={() => move(-1)} aria-label="Previous photo"><ArrowLeft aria-hidden="true" /></button>
        <figure>
          <MarketplacePhoto key={selected.id} photo={selected} sizes="(max-width: 767px) 100vw, 1100px" />
          <figcaption aria-live="polite">{selected.caption}<span>{active! + 1} of {photos.length}</span></figcaption>
        </figure>
        <button type="button" className="mp-viewer-control mp-viewer-next" onClick={() => move(1)} aria-label="Next photo"><ArrowRight aria-hidden="true" /></button>
      </div>}
    </dialog>
  </section>;
}
