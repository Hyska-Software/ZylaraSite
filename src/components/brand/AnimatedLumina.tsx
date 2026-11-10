'use client';

import { motion, useReducedMotion } from 'motion/react';
import { LUMINA_PARTS, LUMINA_VIEWBOX } from './LuminaGlyph';

type AnimatedLuminaProps = {
  size?: number;
  className?: string;
};

const TONE_FILL: Record<string, string> = {
  brand: 'var(--brand)',
  'brand-alt': 'var(--brand)',
  muzzle: 'var(--brand-muzzle)',
  eye: '#0f0f0f',
};

/**
 * O logo oficial do Lumina com uma única animação: flutuação lenta.
 * A arte nunca é alterada (mesmos paths, mesmas cores) e não há efeito
 * passando por cima da marca. Com `prefers-reduced-motion` fica estático.
 */
export function AnimatedLumina({ size = 280, className }: AnimatedLuminaProps) {
  const reduced = useReducedMotion();

  return (
    <div
      className={className}
      style={{ width: size, height: size }}
      aria-hidden="true"
      data-reduced={reduced ? 'true' : undefined}
    >
      <motion.svg
        viewBox={LUMINA_VIEWBOX}
        width="100%"
        height="100%"
        focusable="false"
        style={{ fillRule: 'evenodd', clipRule: 'evenodd', overflow: 'visible' }}
        animate={reduced ? undefined : { y: [0, -9, 0] }}
        transition={
          reduced
            ? undefined
            : {
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
      >
        {LUMINA_PARTS.map((part, index) => (
          <path key={index} d={part.d} fill={TONE_FILL[part.tone]} />
        ))}
      </motion.svg>
    </div>
  );
}
