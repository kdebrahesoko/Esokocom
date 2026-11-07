import type { ImgHTMLAttributes } from 'react';

/** Extraction-only replacement for next/image; no application imports or requests. */
export function CurrentImage({
  fill, priority, ...props
}: ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) {
  return <img {...props} loading={priority ? 'eager' : 'lazy'}
    style={fill ? { position: 'absolute', width: '100%', height: '100%', ...props.style } : props.style} />;
}
