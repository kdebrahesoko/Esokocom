import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { CONFIRMED_IMAGES } from "./_images";
import "./_group.css";
import "./_proposed.css";

type GalleryImage = (typeof CONFIRMED_IMAGES)[number];

const CATEGORIES = [
  "All",
  "Field work",
  "Technology",
  "Agriculture",
  "Team & communities",
] as const;

const INITIAL_COUNT = 6;

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return direction === "left" ? <ArrowLeft aria-hidden="true" /> : <ArrowRight aria-hidden="true" />;
}

function CloseIcon() {
  return <X aria-hidden="true" />;
}

function PhotoCard({
  image,
  index,
  onOpen,
  failed,
  onFail,
}: {
  image: GalleryImage;
  index: number;
  onOpen: (image: GalleryImage, trigger: HTMLButtonElement) => void;
  failed: boolean;
  onFail: (id: string) => void;
}) {
  const isSmsGraphic = image.id === "phone";

  return (
    <button
      className={`esoko-proposed__photo esoko-proposed__photo--${index}`}
      type="button"
      onClick={(event) => onOpen(image, event.currentTarget)}
      aria-label={`View photo: ${image.caption}${isSmsGraphic ? ", product graphic" : ""}`}
      data-testid={`proposed-gallery-image-${image.id}`}
      data-image-id={image.id}
    >
      <span className="esoko-proposed__image-wrap">
        {failed ? (
          <span className="esoko-proposed__image-fallback" role="img" aria-label={image.alt}>
            <span>Image unavailable</span>
            <span className="esoko-proposed__fallback-caption">{image.caption}</span>
          </span>
        ) : (
          <img
            src={image.src}
            alt={image.alt}
            style={{ objectPosition: image.position }}
            loading={index < 3 ? "eager" : "lazy"}
            decoding="async"
            onError={() => onFail(image.id)}
          />
        )}
        {isSmsGraphic && <span className="esoko-proposed__graphic-tag">SMS example · product graphic</span>}
      </span>
      <span className="esoko-proposed__caption">
        <span>{image.caption}</span>
        <span className="esoko-proposed__category">{image.category}</span>
      </span>
    </button>
  );
}

function Lightbox({
  image,
  index,
  total,
  onClose,
  onPrevious,
  onNext,
}: {
  image: GalleryImage;
  index: number;
  total: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const actionsRef = useRef({ onClose, onPrevious, onNext });
  actionsRef.current = { onClose, onPrevious, onNext };
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [image.id]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const originalOverflow = document.body.style.overflow;
    const isolated: Array<{ element: HTMLElement; inert: boolean; ariaHidden: string | null }> = [];
    for (const child of Array.from(document.body.children)) {
      if (child instanceof HTMLElement && !child.contains(dialog)) {
        isolated.push({
          element: child,
          inert: child.inert,
          ariaHidden: child.getAttribute("aria-hidden"),
        });
        child.inert = true;
        child.setAttribute("aria-hidden", "true");
      }
    }
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const handleKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        actionsRef.current.onClose();
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        actionsRef.current.onPrevious();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        actionsRef.current.onNext();
        return;
      }
      if (event.key === "Tab") {
        const focusable = Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((element) => element.getAttribute("aria-hidden") !== "true");
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) {
          event.preventDefault();
        } else if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKeys);
    return () => {
      document.removeEventListener("keydown", handleKeys);
      document.body.style.overflow = originalOverflow;
      isolated.forEach(({ element, inert, ariaHidden }) => {
        element.inert = inert;
        if (ariaHidden === null) element.removeAttribute("aria-hidden");
        else element.setAttribute("aria-hidden", ariaHidden);
      });
    };
  }, []);

  return createPortal(
    <div
      className="esoko-gallery-preview esoko-proposed__lightbox-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="esoko-proposed__lightbox"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Photo ${index + 1} of ${total}: ${image.caption}`}
        aria-describedby="esoko-lightbox-caption"
      >
        <div className="esoko-proposed__lightbox-top">
          <p aria-live="polite">{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</p>
          <button
            ref={closeRef}
            className="esoko-proposed__icon-button"
            type="button"
            onClick={onClose}
            aria-label="Close photo viewer"
            data-testid="proposed-lightbox-close"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="esoko-proposed__lightbox-stage">
          <button
            className="esoko-proposed__icon-button esoko-proposed__nav-button esoko-proposed__nav-button--previous"
            type="button"
            onClick={onPrevious}
            aria-label="Previous photo"
            data-testid="proposed-lightbox-prev"
          >
            <ArrowIcon direction="left" />
          </button>
          {failed ? (
            <div className="esoko-proposed__lightbox-failure" role="img" aria-label={image.alt}>
              This image could not be displayed.
            </div>
          ) : (
            <img
              className="esoko-proposed__lightbox-image"
              src={image.src}
              alt={image.alt}
              onError={() => setFailed(true)}
            />
          )}
          <button
            className="esoko-proposed__icon-button esoko-proposed__nav-button esoko-proposed__nav-button--next"
            type="button"
            onClick={onNext}
            aria-label="Next photo"
            data-testid="proposed-lightbox-next"
          >
            <ArrowIcon direction="right" />
          </button>
        </div>
        <div className="esoko-proposed__lightbox-caption">
          <p id="esoko-lightbox-caption">{image.caption}</p>
          <span>{image.category}{image.id === "phone" ? " · SMS example product graphic" : ""}</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function Proposed() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [expanded, setExpanded] = useState(false);
  const [lightboxId, setLightboxId] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const allImages = CONFIRMED_IMAGES as readonly GalleryImage[];

  const filteredImages = useMemo(
    () => allImages.filter((image) => category === "All" || image.category === category),
    [allImages, category],
  );
  const visibleImages = expanded ? filteredImages : filteredImages.slice(0, INITIAL_COUNT);
  const lightboxIndex = filteredImages.findIndex((image) => image.id === lightboxId);
  const lightboxImage = lightboxIndex >= 0 ? filteredImages[lightboxIndex] : null;

  const closeLightbox = () => setLightboxId(null);
  const previousImage = () => {
    if (lightboxIndex < 0 || filteredImages.length < 2) return;
    setLightboxId(filteredImages[(lightboxIndex - 1 + filteredImages.length) % filteredImages.length].id);
  };
  const nextImage = () => {
    if (lightboxIndex < 0 || filteredImages.length < 2) return;
    setLightboxId(filteredImages[(lightboxIndex + 1) % filteredImages.length].id);
  };

  useEffect(() => {
    if (lightboxId !== null) return;
    triggerRef.current?.focus();
    triggerRef.current = null;
  }, [lightboxId]);

  return (
    <section className="esoko-gallery-preview esoko-proposed" aria-labelledby="esoko-proposed-title">
      <div className="esoko-proposed__inner">
        <header className="esoko-proposed__intro">
          <p className="esoko-proposed__eyebrow">Esoko in the field</p>
          <h2 id="esoko-proposed-title">People. Places. Technology. Impact.</h2>
          <p className="esoko-proposed__description">
            A closer look at the field teams, farming communities, and technology
            that make Esoko’s work tangible.
          </p>
        </header>

        <div className="esoko-proposed__toolbar">
          <div className="esoko-proposed__filters" role="group" aria-label="Filter photos by category">
            {CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                className="esoko-proposed__filter"
                aria-pressed={category === item}
                onClick={() => {
                  setCategory(item);
                  setExpanded(false);
                  setLightboxId(null);
                }}
                data-testid={`proposed-filter-${item.toLowerCase().replaceAll(/[^a-z]+/g, "-").replace(/-$/, "")}`}
              >
                {item}
                {item === "All" && <span className="esoko-proposed__filter-count">{allImages.length}</span>}
              </button>
            ))}
          </div>
          <p className="esoko-proposed__count" aria-live="polite">
            {filteredImages.length} {filteredImages.length === 1 ? "image" : "images"}
          </p>
        </div>

        <div
          className="esoko-proposed__gallery"
          data-count={visibleImages.length}
          data-filter={category}
          data-testid="proposed-gallery-grid"
        >
          {visibleImages.map((image, index) => (
            <PhotoCard
              key={image.id}
              image={image}
              index={index}
              onOpen={(openedImage, trigger) => {
                triggerRef.current = trigger;
                setLightboxId(openedImage.id);
              }}
              failed={failedImages.has(image.id)}
              onFail={(id) => setFailedImages((previous) => new Set(previous).add(id))}
            />
          ))}
        </div>

        {!expanded && filteredImages.length > INITIAL_COUNT && (
          <div className="esoko-proposed__more-wrap">
            <button
              className="esoko-proposed__more"
              type="button"
              onClick={() => setExpanded(true)}
              data-testid="proposed-view-more"
            >
              View all {filteredImages.length} images
              <span aria-hidden="true">({filteredImages.length - visibleImages.length} more)</span>
            </button>
          </div>
        )}
      </div>
      {lightboxImage && (
        <Lightbox
          image={lightboxImage}
          index={lightboxIndex}
          total={filteredImages.length}
          onClose={closeLightbox}
          onPrevious={previousImage}
          onNext={nextImage}
        />
      )}
    </section>
  );
}

export default Proposed;
