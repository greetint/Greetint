'use client';

import React, { useState, useEffect, useRef } from 'react';

interface MagnifyingGlassProps {
  secretMemory: string;
  onComplete: () => void;
}

export function MagnifyingGlassStage({ secretMemory, onComplete }: MagnifyingGlassProps) {
  const [mousePos, setMousePos] = useState({ x: 200, y: 200 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `Използвайте дигиталната лупа, за да разкриете скритите доказателства и тайните послания на инспекторите.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'bg-BG';
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    });
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className="relative w-full h-full bg-[#0D0B0A] text-[#F7F4EF] font-mono flex flex-col items-center justify-center p-6 select-none overflow-hidden cursor-none"
    >
      <div className="absolute top-6 left-6 text-xs uppercase tracking-widest text-[#958679] z-20">
        🔍 Плъзни лупата, за да прочетеш класифицирания текст
      </div>

      {/* Blurred background text layer */}
      <div className="max-w-xl text-center space-y-6 filter blur-[6px] select-none opacity-40 px-4">
        <p className="text-xl sm:text-2xl font-serif text-white/80 leading-relaxed">
          Тайният архив показва следното специално послание от подателя: &quot;{secretMemory || 'Тук се крие най-дълбоката федерална тайна на нашия приятел.'}&quot;
        </p>
        <p className="text-sm text-yellow-500/50">
          [CLASSIFIED DATA // CONFIDENTIAL MEMORY // NOAR ARCHIVE]
        </p>
      </div>

      {/* Magnifying glass lens layer */}
      <div 
        className="absolute pointer-events-none rounded-full border-4 border-yellow-600/80 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden bg-[#1A1816]"
        style={{
          width: '220px',
          height: '220px',
          left: `${mousePos.x - 110}px`,
          top: `${mousePos.y - 110}px`,
          zIndex: 30
        }}
      >
        <div 
          className="absolute flex items-center justify-center p-6 text-center"
          style={{
            width: '100vw',
            height: '100vh',
            left: `${-mousePos.x + 110}px`,
            top: `${-mousePos.y + 110}px`,
          }}
        >
          <div className="max-w-xl text-center space-y-6 px-4">
            <p className="text-xl sm:text-2xl font-serif text-yellow-300 font-bold leading-relaxed">
              Тайният архив показва следното специално послание от подателя: &quot;{secretMemory || 'Тук се крие най-дълбоката федерална тайна на нашия приятел.'}&quot;
            </p>
            <p className="text-sm text-yellow-400 font-bold">
              [CLASSIFIED DATA // CONFIDENTIAL MEMORY // NOAR ARCHIVE]
            </p>
          </div>
        </div>
      </div>

      {/* Proceed Button */}
      <div className="absolute bottom-8 z-40">
        <button 
          onClick={onComplete}
          className="bg-red-700 hover:bg-red-600 text-white px-8 py-3.5 rounded-xl text-xs uppercase tracking-[0.25em] font-bold shadow-xl transition border border-red-500/50 cursor-pointer"
        >
          Разкрих тайната! Към сейфа →
        </button>
      </div>
    </div>
  );
}
