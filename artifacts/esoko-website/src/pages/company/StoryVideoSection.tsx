import { useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Play, X } from 'lucide-react';

// Official Esoko Limited video, also featured on https://www.esoko.com/.
// YouTube title: "Transforming Agriculture with Technology – The ESOKO Story".
const STORY_VIDEO_ID = '5TRjt4fyrU0';
const watchUrl = `https://www.youtube.com/watch?v=${STORY_VIDEO_ID}`;

export function StoryVideoSection() {
  const closeRef = useRef<HTMLButtonElement>(null);

  return (
    <section id="story-video" aria-labelledby="story-video-heading" className="scroll-mt-28 bg-gray-50 py-16 md:py-24">
      <div className="container mx-auto max-w-5xl px-4 md:px-6 text-center">
        <h2 id="story-video-heading" className="mb-4 text-3xl font-heading font-bold text-gray-900 md:text-4xl">
          Watch Our Story
        </h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
          See how Esoko connects technology and people to support farming communities.
        </p>
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button
              type="button"
              aria-label="Play Watch Our Story video"
              className="group relative block aspect-video w-full overflow-hidden rounded-2xl bg-[#042B10] shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-600 focus-visible:ring-offset-4"
            >
              <img src={`${import.meta.env.BASE_URL}about-hero.jpg`} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <span className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/25" />
              <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-emerald-800 shadow-lg transition-transform group-hover:scale-110 md:h-20 md:w-20">
                <Play aria-hidden="true" className="ml-1 h-7 w-7 fill-current md:h-9 md:w-9" />
              </span>
              <span className="absolute inset-x-0 bottom-4 text-sm font-semibold text-white md:bottom-8 md:text-lg">The Esoko Story</span>
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay data-testid="story-video-overlay" className="fixed inset-0 z-[998] bg-black/85" />
            <Dialog.Content
              className="fixed left-1/2 top-1/2 z-[999] w-[calc(100%-2rem)] max-w-5xl max-h-[calc(100dvh-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-[#042B10] p-4 text-white shadow-2xl outline-none sm:p-6"
              onOpenAutoFocus={event => {
                event.preventDefault();
                closeRef.current?.focus();
              }}
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <Dialog.Title className="font-heading text-lg font-semibold">Watch Our Story</Dialog.Title>
                <Dialog.Close ref={closeRef} aria-label="Close video" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                  <X aria-hidden="true" className="h-6 w-6" />
                </Dialog.Close>
              </div>
              <Dialog.Description className="sr-only">
                Transforming Agriculture with Technology – The ESOKO Story. Video by Esoko Limited.
              </Dialog.Description>
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
              <p className="mt-4 text-sm text-white/80">
                Player not loading?{' '}
                <a href={watchUrl} target="_blank" rel="noopener noreferrer" className="rounded underline underline-offset-4 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                  Watch on YouTube <span className="sr-only">(opens in a new tab)</span>
                </a>
              </p>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </section>
  );
}
