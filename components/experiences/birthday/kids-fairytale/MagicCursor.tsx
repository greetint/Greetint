'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2 } from 'lucide-react';

export function MagicCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (Math.random() < 0.35) {
        setSparkles(prev => [...prev.slice(-12), { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY }]);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <motion.div
        className="absolute w-8 h-8 text-amber-300 flex items-center justify-center drop-shadow-[0_0_12px_rgba(255,215,0,0.9)]"
        style={{ left: pos.x - 6, top: pos.y - 6 }}
        animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
      >
        <Wand2 className="w-7 h-7 text-amber-300 fill-yellow-200" />
      </motion.div>

      <AnimatePresence>
        {sparkles.map(s => (
          <motion.div
            key={s.id}
            initial={{ opacity: 1, scale: 0.4, x: s.x, y: s.y }}
            animate={{ opacity: 0, scale: 1.6, y: s.y - 30, x: s.x + (Math.random() * 24 - 12) }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute pointer-events-none"
          >
            <Sparkles className="w-4 h-4 text-amber-300 fill-yellow-200 drop-shadow-[0_0_10px_rgba(255,215,0,0.95)]" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default MagicCursor;
