'use client';
import React, { useState } from 'react';

interface BalloonsProps { isMuted: boolean; onComplete: () => void; }

export function BalloonsSubScene({ isMuted, onComplete }: BalloonsProps) {
  const [balls, setBalls] = useState([0, 0, 0, 0, 0]);
  const [angles, setAngles] = useState([0, 0, 0, 0, 0]);
  const [last, setLast] = useState<{ x: number; y: number } | null>(null);

  const balloonPositions = [
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
        <div
          key={i}
          id={`b-${i}`}
          onMouseMove={(e) => moveB(i, e.clientX, e.clientY)}
          onTouchMove={(e) => e.touches.length > 0 && moveB(i, e.touches[0].clientX, e.touches[0].clientY)}
          onMouseLeave={() => setLast(null)}
          onTouchEnd={() => setLast(null)}
          className="absolute w-20 h-28 md:w-32 md:h-44 rounded-full border-4 border-amber-300/80 bg-amber-400/10 backdrop-blur-[2px] flex items-center justify-center cursor-pointer shadow-[0_0_25px_rgba(251,191,36,0.4)] transition-transform hover:scale-105 touch-none"
          style={{
            ...pos,
            boxShadow: balls[i] === 100 ? '0 0 45px #fbbf24' : '0 0 20px rgba(251,191,36,0.4)',
          }}
        >
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-t from-amber-500 via-yellow-400 to-amber-200 opacity-90 transition-all duration-300 pointer-events-none"
            style={{ clipPath: `inset(${100 - balls[i]}% 0 0 0)` }}
          />
          <div className="absolute inset-0 rounded-full border-2 border-white/60 animate-pulse pointer-events-none" />
        </div>
      ))}
    </div>
  );
}
