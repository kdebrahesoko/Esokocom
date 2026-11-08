import type { ReactNode } from 'react';

/** Quiet, photo-led Company opening. Background image and copy are server-rendered props. */
export function CompanyHero({ background, children }: { background: ReactNode; children: ReactNode }) {
  return (
    <section className="relative flex min-h-[min(88svh,56rem)] items-center justify-center overflow-hidden bg-primary">
      <div className="absolute inset-0">
        {background}
      </div>
      <div className="absolute inset-y-0 left-0 w-full bg-primary/85 lg:w-2/3" />

      {children}
    </section>
  );
}
