'use client';

import React, { useEffect, useState } from 'react';

interface FairyDustProps {
  count?: number;
  className?: string;
  burst?: boolean;
}

interface Particle {
  id: number;
  left: number;
  top: number;
  size: number;
  dur: number;
  delay: number;
  drift: number;
  hue: string;
}

function makeParticles(count: number, burst: boolean): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: 20 + Math.random() * 70,
    size: 2 + Math.random() * 4,
    dur: 3 + Math.random() * 4,
    delay: Math.random() * (burst ? 0.6 : 5),
    drift: (Math.random() - 0.5) * 80,
    hue: Math.random() > 0.5 ? '#f7d774' : '#e6c9ff',
  }));
}

/** Ambient floating sparkle particles. Used both as a background layer that
 * stays mounted across every stage (so the scene never reads as "empty"
 * between stages) and, with `burst`, as a denser one-shot transition wash.
 * Particle positions are randomized client-side after mount (an effect,
 * not render) to keep the render function pure. */
export function FairyDust({ count = 24, className = '', burst = false }: FairyDustProps) {
  const [particles, setParticles] = useState<Particle[] | null>(null);

  useEffect(() => {
    setParticles(makeParticles(count, burst));
  }, [count, burst]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      {particles?.map((p) => (
        <span
          key={p.id}
          className="mv2-sparkle-particle absolute rounded-full"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: p.hue,
            boxShadow: `0 0 ${p.size * 2.5}px ${p.hue}`,
            '--mv2-dur': `${p.dur}s`,
            '--mv2-delay': `${p.delay}s`,
            '--mv2-drift': `${p.drift}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
