import Image from "next/image";
import type { GalleryImage } from "./gallery-data";

export function GalleryPhoto({
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
      className={`company-gallery__photo company-gallery__photo--${index}`}
      type="button"
      onClick={(event) => onOpen(image, event.currentTarget)}
      aria-label={`View photo: ${image.caption}${isSmsGraphic ? ", product graphic" : ""}`}
      data-testid={`company-gallery-image-${image.id}`}
      data-image-id={image.id}
    >
      <span className="company-gallery__image-wrap">
        {failed ? (
          <span className="company-gallery__image-fallback" role="img" aria-label={image.alt}>
            <span>Image unavailable</span>
            <span className="company-gallery__fallback-caption">{image.caption}</span>
          </span>
        ) : (
          <Image
            src={image.src}
            alt={image.alt}
            style={{ objectPosition: image.position }}
            fill
            sizes={index === 0 ? "(max-width: 767px) calc(100vw - 32px), (max-width: 1195px) 58vw, 672px" : "(max-width: 767px) calc(100vw - 32px), (max-width: 1195px) 42vw, 484px"}
            onError={() => onFail(image.id)}
          />
        )}
        {isSmsGraphic && <span className="company-gallery__graphic-tag">SMS example · product graphic</span>}
      </span>
      <span className="company-gallery__caption">
        <span>{image.caption}</span>
        <span className="company-gallery__category">{image.category}</span>
      </span>
    </button>
  );
}

