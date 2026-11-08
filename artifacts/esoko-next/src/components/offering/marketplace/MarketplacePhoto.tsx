'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { MarketplacePhotoData } from './marketplace-content';

/** The only client behavior needed for content photography is its error state. */
export function MarketplacePhoto({
  photo, priority = false, sizes = '(max-width: 767px) 100vw, 50vw',
}: {
  photo: MarketplacePhotoData; priority?: boolean; sizes?: string;
}) {
  const [failed, setFailed] = useState(false);
  return <div className={`mp-photo${failed ? ' mp-photo-failed' : ''}`}>
    {failed ? <div className="mp-image-error" role="img" aria-label={`Image unavailable: ${photo.alt}`}>
      <span>Image unavailable</span><small>{photo.caption}</small>
    </div> : <Image
      src={photo.src} alt={photo.alt} fill sizes={sizes}
      priority={priority} fetchPriority={priority ? 'high' : undefined}
      loading={priority ? undefined : 'lazy'}
      placeholder="blur" blurDataURL={photo.blurDataURL}
      onError={() => setFailed(true)}
    />}
  </div>;
}
