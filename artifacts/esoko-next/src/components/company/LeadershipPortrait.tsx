'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { TEAM } from './CompanyData';

/** Shared card/dialog portrait; only a failed image falls back to initials. Never priority. */
export function LeadershipPortrait({ member, sizes }: { member: (typeof TEAM)[number]; sizes: string }) {
  const [failedSource, setFailedSource] = useState<string | null>(null);

  if (failedSource === member.portrait) {
    return (
      <span role="img" aria-label={`Portrait unavailable for ${member.name}`}
        className="relative z-10 text-5xl font-heading font-bold text-white/90 select-none">
        {member.initials}
      </span>
    );
  }

  return (
    <Image
      src={member.portrait}
      alt={`Portrait of ${member.name}, ${member.role}`}
      fill
      sizes={sizes}
      className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
      style={{ objectPosition: member.portraitPosition }}
      onError={() => setFailedSource(member.portrait)}
      data-testid={`leadership-portrait-${member.initials}`}
    />
  );
}
