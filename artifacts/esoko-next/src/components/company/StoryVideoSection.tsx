'use client';

import { useEffect, useRef, useState, useId } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Play, X } from 'lucide-react';
import { ASSET_BASE } from './CompanyData';

// Official Esoko Limited video, also featured on https://www.esoko.com/.
// YouTube title: "Transforming Agriculture with Technology – The ESOKO Story".
const STORY_VIDEO_ID = '5TRjt4fyrU0';
const watchUrl = `https://www.youtube.com/watch?v=${STORY_VIDEO_ID}`;

/** Source used @radix-ui/react-dialog (not a dependency here); same markup/behaviour via a portal dialog. */
export function StoryVideoSection() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const descId = useId();

  const close = () => { setOpen(false); requestAnimationFrame(() => triggerRef.current?.focus()); };

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); requestAnimationFrame(() => triggerRef.current?.focus()); return; }
      if (e.key === 'Tab' && contentRef.current) {
        const f = contentRef.current.querySelectorAll<HTMLElement>('button, [href], iframe, [tabindex]:not([tabindex="-1"])');
        const first = f[0]; const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open]);

  return (
    <section id="story-video" aria-labelledby="story-video-heading" className="scroll-mt-28 bg-muted py-16 md:py-24">
      <div className="container mx-auto max-w-5xl px-4 md:px-6 text-center">
        <h2 id="story-video-heading" className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
          Watch Our Story
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
          See how Esoko connects technology and people to support farming communities.
        </p>
        <button
          ref={triggerRef}
          type="button"
          aria-label="Play Watch Our Story video"
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-primary shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary focus-visible:ring-offset-4"
        >
          <Image src={`${ASSET_BASE}/about-hero.jpg`} alt="" fill sizes="(min-width: 1024px) 976px, 100vw" className="object-cover" />
          <span className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/25" />
          <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-background text-primary shadow-md transition-transform group-hover:scale-105 md:h-20 md:w-20">
            <Play aria-hidden="true" className="ml-1 h-7 w-7 fill-current md:h-9 md:w-9" />
          </span>
          <span className="absolute inset-x-0 bottom-4 text-base font-semibold text-white md:bottom-8 md:text-lg">The Esoko Story</span>
        </button>
      </div>
      {open && createPortal(
        <>
          <div data-testid="story-video-overlay" className="fixed inset-0 z-[998] bg-black/85" onClick={close} />
          <div
            ref={contentRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
            className="fixed left-1/2 top-1/2 z-[999] w-[calc(100%-2rem)] max-w-5xl max-h-[calc(100dvh-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-primary p-4 text-white shadow-2xl outline-none sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 id={titleId} className="font-heading text-lg font-semibold">Watch Our Story</h2>
              <button ref={closeRef} type="button" onClick={close} aria-label="Close video" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                <X aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <p id={descId} className="sr-only">
              Transforming Agriculture with Technology – The ESOKO Story. Video by Esoko Limited.
            </p>
            <div className="aspect-video overflow-hidden rounded-lg bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${STORY_VIDEO_ID}?autoplay=1&rel=0&playsinline=1`}
                title="Transforming Agriculture with Technology – The ESOKO Story"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="h-full w-full border-0"
              />
            </div>
            <p className="mt-4 text-base text-white">
              Player not loading?{' '}
              <a href={watchUrl} target="_blank" rel="noopener noreferrer" className="rounded underline underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                Watch on YouTube <span className="sr-only">(opens in a new tab)</span>
              </a>
            </p>
          </div>
        </>,
        document.body,
      )}
    </section>
  );
}
