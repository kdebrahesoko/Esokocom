'use client';

import type { CSSProperties, ReactNode } from 'react';
import { motion, type TargetAndTransition, type Transition } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

const TAGS = {
  div: motion.div, p: motion.p, h1: motion.h1, h2: motion.h2, ul: motion.ul, tr: motion.tr, span: motion.span,
};

type Vals = TargetAndTransition;

/**
 * Client motion boundary mirroring the source framer-motion props. Children stay server-rendered.
 * When `respectReduced` (default) and the user prefers reduced motion, no animation props apply —
 * matching the source `reduced ? {} : {...}` pattern.
 */
export function Motion({
  as = 'div', initial, animate, whileInView, whileHover, viewport, transition,
  respectReduced = true, className, style, id, children,
}: {
  as?: keyof typeof TAGS; initial?: Vals; animate?: Vals; whileInView?: Vals; whileHover?: Vals;
  viewport?: { once?: boolean; margin?: string }; transition?: Transition; respectReduced?: boolean;
  className?: string; style?: CSSProperties; id?: string; children?: ReactNode;
}) {
  const reduced = useReducedMotion() ?? false;
  const Tag = TAGS[as];
  const props = reduced && respectReduced ? {} : { initial, animate, whileInView, whileHover, viewport, transition };
  return <Tag {...props} id={id} className={className} style={style}>{children}</Tag>;
}

/** Source fadeUp(delay) helper. */
export function FadeUp({ delay = 0, duration = 0.55, ease, as, className, children }: {
  delay?: number; duration?: number; ease?: [number, number, number, number]; as?: keyof typeof TAGS; className?: string; children?: ReactNode;
}) {
  return (
    <Motion as={as} className={className}
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration, delay, ...(ease ? { ease } : {}) }}>
      {children}
    </Motion>
  );
}

/** Source revealUp(delay) helper. */
export function RevealUp({ delay = 0, duration = 0.45, y = 20, ease, as, id, className, children }: {
  delay?: number; duration?: number; y?: number; ease?: [number, number, number, number]; as?: keyof typeof TAGS; id?: string; className?: string; children?: ReactNode;
}) {
  return (
    <Motion as={as} id={id} className={className}
      initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
      transition={{ duration, delay, ...(ease ? { ease } : {}) }}>
      {children}
    </Motion>
  );
}
