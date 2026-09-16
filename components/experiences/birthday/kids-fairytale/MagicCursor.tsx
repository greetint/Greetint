'use client';

import React, { useEffect, useState } from 'react';

export function MagicCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trails, setTrails] = useState<{ x: number; y: number; id: number }[]>([]);

  useEffect(() => {
    let idCounter = 0;
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      setTrails(prev => [
        ...prev.slice(-15),
        { x: e.clientX, y: e.clientY, id: idCounter++ }
      ]);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        setPos({ x: t.clientX, y: t.clientY });
        setTrails(prev => [
          ...prev.slice(-15),
          { x: t.clientX, y: t.clientY, id: idCounter++ }
        ]);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {trails.map((t, index) => (
        <div
          key={t.id}
          className="absolute w-2.5 h-2.5 rounded-full bg-amber-300 shadow-[0_0_12px_#fbbf24] animate-ping opacity-75"
          style={{
            left: `${t.x}px`,
            top: `${t.y}px`,
            transform: 'translate(-50%, -50px)',
            transition: 'all 0.2s ease-out',
            opacity: index / trails.length,
          }}
        />
      ))}
      <div
        className="absolute w-8 h-8 rounded-full bg-gradient-to-r from-amber-300 to-yellow-100 shadow-[0_0_20px_#f59e0b] blur-[1px]"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          transform: 'translate(-50%, -50%)',
        }}
      />
    </div>
  );
}
