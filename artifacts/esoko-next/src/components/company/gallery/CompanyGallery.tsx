"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { COMPANY_GALLERY_IMAGES, type GalleryImage } from "./gallery-data";
import { GalleryPhoto } from "./GalleryPhoto";
import { GalleryLightbox } from "./GalleryLightbox";
import "./gallery.css";

const CATEGORIES = ["All", "Field work", "Technology", "Agriculture", "Team & communities"] as const;
const INITIAL_COUNT = 6;

export function CompanyGallery() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [expanded, setExpanded] = useState(false);
  const [lightboxId, setLightboxId] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const allImages = COMPANY_GALLERY_IMAGES as readonly GalleryImage[];

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
    <section id="gallery" className="company-gallery scroll-mt-24" aria-labelledby="company-gallery-title">
      <div className="company-gallery__inner">
        <header className="company-gallery__intro">
          <p className="company-gallery__eyebrow">Esoko in the field</p>
          <h2 id="company-gallery-title">People. Places. Technology. Impact.</h2>
          <p className="company-gallery__description">
            A closer look at the field teams, farming communities, and technology
            that make Esoko’s work tangible.
          </p>
        </header>

        <div className="company-gallery__toolbar">
          <div className="company-gallery__filters" role="group" aria-label="Filter photos by category">
            {CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                className="company-gallery__filter"
                aria-pressed={category === item}
                onClick={() => {
                  setCategory(item);
                  setExpanded(false);
                  setLightboxId(null);
                }}
                data-testid={`gallery-filter-${item.toLowerCase().replaceAll(/[^a-z]+/g, "-").replace(/-$/, "")}`}
              >
                {item}
                {item === "All" && <span className="company-gallery__filter-count">{allImages.length}</span>}
              </button>
            ))}
          </div>
          <p className="company-gallery__count" aria-live="polite">
            {filteredImages.length} {filteredImages.length === 1 ? "image" : "images"}
          </p>
        </div>

        <div
          className="company-gallery__gallery"
          data-count={visibleImages.length}
          data-filter={category}
          data-testid="company-gallery-grid"
        >
          {visibleImages.map((image, index) => (
            <GalleryPhoto
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
          <div className="company-gallery__more-wrap">
            <button
              className="company-gallery__more"
              type="button"
              onClick={() => setExpanded(true)}
              data-testid="gallery-view-more"
            >
              View all {filteredImages.length} images
              <span aria-hidden="true">({filteredImages.length - visibleImages.length} more)</span>
            </button>
          </div>
        )}
      </div>
      {lightboxImage && (
        <GalleryLightbox
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
