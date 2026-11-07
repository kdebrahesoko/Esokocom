'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const E: [number, number, number, number] = [0.22, 1, 0.36, 1];
const TAGS = { div: motion.div, span: motion.span, h1: motion.h1, h2: motion.h2, p: motion.p };

type Vals = Record<string, number | string>;

/** Client motion boundary reproducing the source fp() helper; children stay server-rendered. */
export function Reveal({
  as = 'div', hidden, visible, delay = 0, duration = 0.65, className, children, ...rest
}: {
  as?: keyof typeof TAGS; hidden: Vals; visible: Vals; delay?: number; duration?: number;
  className?: string; children?: ReactNode; [key: `data-${string}`]: string | undefined;
}) {
  const reduced = useReducedMotion() ?? false;
  const Tag = TAGS[as];
  const props = reduced
    ? { initial: visible, animate: visible }
    : { initial: hidden, whileInView: visible, viewport: { once: true, margin: '-60px' }, transition: { duration, ease: E, delay } };
  return <Tag {...props} {...rest} className={className}>{children}</Tag>;
}
