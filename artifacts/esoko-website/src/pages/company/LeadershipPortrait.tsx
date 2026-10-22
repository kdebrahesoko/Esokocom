import { useState } from 'react';
import type { TEAM } from './CompanyData';

/** Shared card/dialog portrait; only a failed image falls back to initials. */
export function LeadershipPortrait({
  member,
  eager = false,
}: {
  member: (typeof TEAM)[number];
  eager?: boolean;
}) {
  const [failedSource, setFailedSource] = useState<string | null>(null);

  if (failedSource === member.portrait) {
    return (
      <span
        role="img"
        aria-label={`Portrait unavailable for ${member.name}`}
        className="relative z-10 text-5xl font-heading font-bold text-white/90 select-none"
      >
        {member.initials}
      </span>
    );
  }

  return (
    <img
      src={member.portrait}
      alt={`Portrait of ${member.name}`}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]"
      style={{ objectPosition: member.portraitPosition }}
      onError={() => setFailedSource(member.portrait)}
      data-testid={`leadership-portrait-${member.initials}`}
    />
  );
}
