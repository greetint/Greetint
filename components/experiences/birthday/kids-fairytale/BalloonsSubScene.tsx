'use client';
import React, { useState } from 'react';

interface BalloonsProps { isMuted: boolean; onComplete: () => void; }

export function BalloonsSubScene({ isMuted, onComplete }: BalloonsProps) {
  const [balls, setBalls] = useState([0, 0, 0, 0, 0]);
  const [angles, setAngles] = useState([0, 0, 0, 0, 0]);
  const [last, setLast] = useState<{ x: number; y: number } | null>(null);

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
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-between py-12 px-4">
      <div className="text-center"><p className="font-serif italic text-xl md:text-3xl text-amber-200 drop-shadow">🎈 Нарисувай кръг около всеки балон! ({balls.filter(v => v === 100).length}/5)</p></div>
      <div className="grid grid-cols-5 gap-3 md:gap-6 items-center justify-center w-full max-w-4xl px-2">
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} id={`b-${i}`} onMouseMove={(e) => moveB(i, e.clientX, e.clientY)} onTouchMove={(e) => e.touches.length > 0 && moveB(i, e.touches[0].clientX, e.touches[0].clientY)} onMouseLeave={() => setLast(null)} onTouchEnd={() => setLast(null)} className="relative w-16 h-24 md:w-28 md:h-40 rounded-full border-4 border-amber-300/80 bg-amber-400/15 backdrop-blur-sm flex items-center justify-center cursor-pointer shadow-xl touch-none" style={{ boxShadow: balls[i] === 100 ? '0 0 30px #fbbf24' : undefined }}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-t from-amber-500 to-yellow-300 opacity-85" style={{ clipPath: `inset(${100 - balls[i]}% 0 0 0)` }} />
            <span className="relative z-10 font-bold text-amber-950 text-sm md:text-lg">{balls[i]}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
