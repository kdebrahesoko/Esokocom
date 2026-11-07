'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/** Source scrollTo(id) button; optional bouncing scroll indicator variant. */
export function ScrollButton({ target, className, children, ariaLabel, bounce = false, ease, testId }: {
  target: string; className?: string; children: ReactNode; ariaLabel?: string; bounce?: boolean; ease?: 'easeInOut'; testId?: string;
}) {
  const reduced = useReducedMotion() ?? false;
  const onClick = () => document.getElementById(target)?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  const anim = bounce && !reduced
    ? { animate: { y: [0, 8, 0] }, transition: { repeat: Infinity, duration: 2, ...(ease ? { ease } : {}) } }
    : {};
  return (
    <motion.button type="button" onClick={onClick} aria-label={ariaLabel} data-testid={testId} className={className} {...anim}>
      {children}
    </motion.button>
  );
}
