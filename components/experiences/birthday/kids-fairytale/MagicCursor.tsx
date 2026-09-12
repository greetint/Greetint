'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function MagicCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trails, setTrails] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (Math.random() < 0.4) {
        setTrails(prev => [...prev.slice(-10), { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY }]);
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        setPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        if (Math.random() < 0.4) {
          setTrails(prev => [...prev.slice(-10), { id: Date.now() + Math.random(), x: e.touches[0].clientX, y: e.touches[0].clientY }]);
        }
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
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <motion.div
        className="absolute w-5 h-5 rounded-full bg-amber-300/90 backdrop-blur-md shadow-[0_0_15px_#ffd700] border border-white/60 pointer-events-none"
        style={{ left: pos.x - 10, top: pos.y - 10 }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      />

      <AnimatePresence>
        {trails.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0.8, scale: 0.8, x: t.x - 4, y: t.y - 4 }}
            animate={{ opacity: 0, scale: 0.2, y: t.y - 20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute w-2.5 h-2.5 rounded-full bg-yellow-200 shadow-[0_0_10px_#ffd700] pointer-events-none"
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default MagicCursor;
