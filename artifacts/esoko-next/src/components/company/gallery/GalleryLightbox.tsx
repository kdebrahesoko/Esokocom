import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import type { GalleryImage } from "./gallery-data";

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return direction === "left" ? <ArrowLeft aria-hidden="true" /> : <ArrowRight aria-hidden="true" />;
}
function CloseIcon() { return <X aria-hidden="true" />; }

export function GalleryLightbox({
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
      className="site-chrome company-gallery__lightbox-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="company-gallery__lightbox"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Photo ${index + 1} of ${total}: ${image.caption}`}
        aria-describedby="company-gallery-lightbox-caption"
      >
        <div className="company-gallery__lightbox-top">
          <p aria-live="polite">{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</p>
          <button
            ref={closeRef}
            className="company-gallery__icon-button"
            type="button"
            onClick={onClose}
            aria-label="Close photo viewer"
            data-testid="gallery-lightbox-close"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="company-gallery__lightbox-stage">
          <button
            className="company-gallery__icon-button company-gallery__nav-button company-gallery__nav-button--previous"
            type="button"
            onClick={onPrevious}
            aria-label="Previous photo"
            data-testid="gallery-lightbox-prev"
          >
            <ArrowIcon direction="left" />
          </button>
          {failed ? (
            <div className="company-gallery__lightbox-failure" role="img" aria-label={image.alt}>
              This image could not be displayed.
            </div>
          ) : (
            <div className="company-gallery__lightbox-image-wrap">
            <Image
              fill
              sizes="100vw"
              className="company-gallery__lightbox-image"
              src={image.src}
              alt={image.alt}
              onError={() => setFailed(true)}
            />
            </div>
          )}
          <button
            className="company-gallery__icon-button company-gallery__nav-button company-gallery__nav-button--next"
            type="button"
            onClick={onNext}
            aria-label="Next photo"
            data-testid="gallery-lightbox-next"
          >
            <ArrowIcon direction="right" />
          </button>
        </div>
        <div className="company-gallery__lightbox-caption">
          <p id="company-gallery-lightbox-caption">{image.caption}</p>
          <span>{image.category}{image.id === "phone" ? " · SMS example product graphic" : ""}</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}

