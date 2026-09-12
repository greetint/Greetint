'use client';
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function MagicCursor() {
  const [pos, setPos] = useState({ x: -200, y: -200 });
  const [trails, setTrails] = useState<{ id: number; x: number; y: number }[]>([]);
  const mouseRef = useRef({ x: -200, y: -200 });
  const posRef = useRef({ x: -200, y: -200 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (Math.random() < 0.35) {
        setTrails(prev => [...prev.slice(-12), { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY }]);
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        mouseRef.current = { x: touch.clientX, y: touch.clientY };
        if (Math.random() < 0.35) {
          setTrails(prev => [...prev.slice(-12), { id: Date.now() + Math.random(), x: touch.clientX, y: touch.clientY }]);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchstart', handleTouchMove);

    let animationFrameId: number;
    const animate = () => {
      posRef.current.x += (mouseRef.current.x - posRef.current.x) * 0.18;
      posRef.current.y += (mouseRef.current.y - posRef.current.y) * 0.18;
      setPos({ x: posRef.current.x, y: posRef.current.y });
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Cinematic Pixar-style smooth damp tracking golden light */}
      <div
        className="absolute w-4 h-4 rounded-full bg-gradient-to-tr from-yellow-300 via-amber-200 to-amber-400 shadow-[0_0_20px_rgba(255,215,0,0.95),0_0_8px_rgba(255,255,255,0.8)] blur-[1px] pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{ left: pos.x, top: pos.y }}
      />
      <div
        className="absolute w-12 h-12 rounded-full bg-[radial-gradient(circle,_rgba(255,215,0,0.45)_0%,_rgba(255,165,0,0.1)_60%,_transparent_100%)] blur-md pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{ left: pos.x, top: pos.y }}
      />

      <AnimatePresence>
        {trails.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0.85, scale: 0.9, x: t.x - 3, y: t.y - 3 }}
            animate={{ opacity: 0, scale: 0.1, y: t.y - 25, x: t.x + (Math.random() * 16 - 8) }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute w-2 h-2 rounded-full bg-amber-200 shadow-[0_0_10px_rgba(255,215,0,0.9)] pointer-events-none"
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default MagicCursor;
