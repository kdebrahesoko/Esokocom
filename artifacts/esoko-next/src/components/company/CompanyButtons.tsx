'use client';

import type { ReactNode } from 'react';
import { useBookDemo } from '@/components/home/BookDemoContext';

/** Smooth-scrolls to an in-page section (source onClick scrollIntoView). */
export function ScrollToButton({ target, className, children, testId }: { target: string; className?: string; children: ReactNode; testId?: string }) {
  return (
    <button type="button" data-testid={testId} className={className}
      onClick={() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })}>
      {children}
    </button>
  );
}

/** Source openBookDemo button; adapter hands off to the existing site's contact flow. */
export function WorkWithEsokoButton({ className, children, testId }: { className?: string; children: ReactNode; testId?: string }) {
  const { open } = useBookDemo();
  return <button type="button" onClick={open} data-testid={testId} className={className}>{children}</button>;
}
