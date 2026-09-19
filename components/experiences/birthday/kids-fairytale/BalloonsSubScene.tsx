'use client';
import React, { useState } from 'react';
import { motion, animate, useMotionValue, useSpring, useTransform, useAnimationFrame } from 'framer-motion';

interface BalloonsProps { isMuted: boolean; onComplete: () => void; }

interface BalloonPos { top?: string; left?: string; right?: string }

interface BalloonItemProps {
  index: number;
  pos: BalloonPos;
  fill: number;
  onMove: (clientX: number, clientY: number) => void;
  onRelease: () => void;
}

function BalloonItem({ index, pos, fill, onMove, onRelease }: BalloonItemProps) {
  // Each balloon bobs/sways at its own frequency and phase so the row never
  // looks synchronized.
  const freqY = 0.7 + index * 0.13;
  const phaseY = index * 1.3;
  const ampY = 8 + (index % 3) * 3;
  const freqX = 0.45 + index * 0.1;
  const phaseX = index * 0.9;
  const ampX = 5 + (index % 2) * 3;

  const floatX = useMotionValue(0);
  const floatY = useMotionValue(0);
  const balloonRotate = useTransform(floatX, [-ampX, ampX], [-4, 4]);

  // The string's sway spring-lags the balloon's own sway, so it trails the
  // balloon like a pendulum instead of snapping to it instantly.
  const laggedX = useSpring(floatX, { stiffness: 55, damping: 9, mass: 1 });
  const stringRotate = useTransform(laggedX, [-ampX, ampX], [3, -3]);

  const bumpRotate = useMotionValue(0);

  useAnimationFrame((t) => {
    const s = t / 1000;
    floatY.set(Math.sin(s * freqY + phaseY) * ampY);
    floatX.set(Math.sin(s * freqX + phaseX) * ampX);
  });

  const handleRelease = () => {
    // A brief decaying wobble instead of stopping dead on release.
    animate(bumpRotate, [7, -5, 3, -1.5, 0], { duration: 0.6, ease: 'easeOut' });
    onRelease();
  };

  return (
    <motion.div
      id={`b-${index}`}
      onMouseMove={(e) => onMove(e.clientX, e.clientY)}
      onTouchMove={(e) => e.touches.length > 0 && onMove(e.touches[0].clientX, e.touches[0].clientY)}
      onMouseUp={handleRelease}
      onMouseLeave={handleRelease}
      onTouchEnd={handleRelease}
      whileTap={{ scaleX: 1.18, scaleY: 0.82, transition: { type: 'spring', stiffness: 300, damping: 10 } }}
      style={{ ...pos, x: floatX, y: floatY, rotate: bumpRotate }}
      className="absolute w-20 h-28 md:w-32 md:h-44 rounded-full border-4 border-amber-300/80 bg-amber-400/10 backdrop-blur-[2px] flex items-center justify-center cursor-pointer shadow-[0_0_25px_rgba(251,191,36,0.4)] touch-none"
    >
      <motion.div style={{ rotate: balloonRotate }} className="absolute inset-0">
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-t from-amber-500 via-yellow-400 to-amber-200 opacity-90 transition-all duration-300 pointer-events-none"
          style={{ clipPath: `inset(${100 - fill}% 0 0 0)` }}
        />
        <div
          className="absolute inset-0 rounded-full border-2 border-white/60 animate-pulse pointer-events-none"
          style={{ boxShadow: fill === 100 ? '0 0 45px #fbbf24' : undefined }}
        />
      </motion.div>

      {/* String — sways with a spring-lag behind the balloon, like a pendulum. */}
      <motion.div
        className="absolute left-1/2 top-full pointer-events-none"
        style={{ rotate: stringRotate, transformOrigin: 'top center', marginLeft: '-1px' }}
      >
        <div
          className="rounded-full"
          style={{
            width: '2px',
            height: '52px',
            background: 'linear-gradient(to bottom, rgba(180,140,60,0.75), rgba(180,140,60,0.25))',
          }}
        />
        <div className="w-1.5 h-1.5 rounded-full bg-amber-700/70 -translate-x-[1.5px]" />
      </motion.div>
    </motion.div>
  );
}

export function BalloonsSubScene({ isMuted, onComplete }: BalloonsProps) {
  const [balls, setBalls] = useState([0, 0, 0, 0, 0]);
  const [angles, setAngles] = useState([0, 0, 0, 0, 0]);
  const [last, setLast] = useState<{ x: number; y: number } | null>(null);

  const balloonPositions: BalloonPos[] = [
    { top: '28%', left: '22%' },
    { top: '24%', right: '22%' },
    { top: '48%', left: '38%' },
    { top: '42%', left: '15%' },
    { top: '42%', right: '15%' },
  ];

  const moveB = (i: number, clientX: number, clientY: number) => {
    if (balls[i] === 100) return;
    const el = document.getElementById(`b-${i}`); if (!el) return;
    const rect = el.getBoundingClientRect();
    const bcX = rect.left + rect.width / 2, bcY = rect.top + rect.height / 2;
    const angle = Math.atan2(clientY - bcY, clientX - bcX);
    if (last) {
      const prev = Math.atan2(last.y - bcY, last.x - bcX);
      let diff = angle - prev;
      if (diff > Math.PI) diff -= Math.PI * 2; if (diff < -Math.PI) diff += Math.PI * 2;
      setAngles(prevA => {
        const nextA = [...prevA]; nextA[i] += Math.abs(diff);
        const f = Math.min(Math.round((nextA[i] / (Math.PI * 2)) * 100), 100);
        setBalls(b => {
          const nb = [...b]; nb[i] = f;
          if (nb.every(v => v === 100)) setTimeout(onComplete, 800);
          return nb;
        });
        return nextA;
      });
    }
    setLast({ x: clientX, y: clientY });
  };

  return (
    <div className="absolute inset-0 z-20 pointer-events-auto select-none">
      <div className="absolute top-8 left-0 right-0 text-center pointer-events-none z-30">
        <p className="font-serif italic text-xl md:text-3xl text-amber-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          🎈 Нарисувай кръг около всеки балон, за да го напълниш! ({balls.filter(v => v === 100).length}/5)
        </p>
      </div>

      {balloonPositions.map((pos, i) => (
        <BalloonItem
          key={i}
          index={i}
          pos={pos}
          fill={balls[i]}
          onMove={(clientX, clientY) => moveB(i, clientX, clientY)}
          onRelease={() => setLast(null)}
        />
      ))}
    </div>
  );
}
