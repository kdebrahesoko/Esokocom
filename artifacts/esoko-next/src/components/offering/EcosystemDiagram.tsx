'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { ECOSYSTEM_NODES } from '@/data/products-services';

/** Source EcosystemDiagram (animated SVG). */
export function EcosystemDiagram() {
  const reduced = useReducedMotion() ?? false;
  const R = 130;
  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="-200 -200 400 400" className="w-full max-w-[420px] mx-auto" aria-hidden="true">
        {ECOSYSTEM_NODES.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const x = R * Math.cos(rad);
          const y = R * Math.sin(rad);
          return (
            <motion.line
              key={i}
              x1={0} y1={0} x2={x} y2={y}
              stroke={node.color}
              strokeWidth="1.5"
              strokeDasharray="6 4"
              opacity={0.5}
              {...(reduced ? {} : {
                initial: { pathLength: 0 },
                animate: { pathLength: 1 },
                transition: { duration: 0.8, delay: 0.3 + i * 0.1 },
              })}
            />
          );
        })}

        {ECOSYSTEM_NODES.map((node, i) => {
          const rad = (node.angle * Math.PI) / 180;
          const x = R * Math.cos(rad);
          const y = R * Math.sin(rad);
          const Icon = node.icon;
          return (
            <motion.g
              key={i}
              {...(reduced ? {} : {
                initial: { opacity: 0, scale: 0.5 },
                animate: { opacity: 1, scale: 1 },
                transition: { duration: 0.4, delay: 0.5 + i * 0.1 },
              })}
            >
              <circle cx={x} cy={y} r={28} fill="white" stroke={node.color} strokeWidth={2} filter="url(#shadow)" />
              <foreignObject x={x - 12} y={y - 12} width={24} height={24}>
                <div className="w-6 h-6 flex items-center justify-center">
                  <Icon className="w-4 h-4" style={{ color: node.color }} />
                </div>
              </foreignObject>
              <text x={x} y={y + 42} textAnchor="middle" fontSize={8} fill={node.color} fontWeight={600} fontFamily="Plus Jakarta Sans, sans-serif">
                {node.label}
              </text>
            </motion.g>
          );
        })}

        <motion.g
          {...(reduced ? {} : {
            initial: { opacity: 0, scale: 0 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.5, delay: 0.2 },
          })}
        >
          <circle cx={0} cy={0} r={46} fill="#0B4D2E" />
          <circle cx={0} cy={0} r={38} fill="white" opacity={0.15} />
          <text x={0} y={-6} textAnchor="middle" fontSize={9} fill="white" fontWeight={700} fontFamily="Plus Jakarta Sans, sans-serif">
            Farmer /
          </text>
          <text x={0} y={8} textAnchor="middle" fontSize={9} fill="white" fontWeight={700} fontFamily="Plus Jakarta Sans, sans-serif">
            Organisation
          </text>
        </motion.g>

        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.12" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
