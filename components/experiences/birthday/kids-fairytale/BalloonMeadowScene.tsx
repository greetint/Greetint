'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface BalloonMeadowSceneProps {
  onComplete: () => void;
}

interface Balloon {
  id: number;
  color: string;
  x: number;
  y: number;
  popped: boolean;
}

export function BalloonMeadowScene({ onComplete }: BalloonMeadowSceneProps) {
  const initialBalloons: Balloon[] = [
    { id: 1, color: 'bg-rose-500', x: 15, y: 30, popped: false },
    { id: 2, color: 'bg-amber-400', x: 35, y: 20, popped: false },
    { id: 3, color: 'bg-emerald-500', x: 60, y: 35, popped: false },
    { id: 4, color: 'bg-sky-400', x: 80, y: 25, popped: false },
    { id: 5, color: 'bg-purple-500', x: 45, y: 60, popped: false },
  ];

  const [balloons, setBalloons] = useState<Balloon[]>(initialBalloons);
  const poppedCount = balloons.filter(b => b.popped).length;
  const totalBalloons = balloons.length;

  const handlePop = (id: number) => {
    setBalloons(prev => prev.map(b => b.id === id ? { ...b, popped: true } : b));
    
    // Check if all popped
    const nextPopped = poppedCount + 1;
    if (nextPopped >= totalBalloons) {
      setTimeout(() => {
        onComplete();
      }, 1200);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-2xl bg-white/90 backdrop-blur-2xl p-8 sm:p-14 rounded-[2.5rem] shadow-2xl border-4 border-emerald-300 text-center flex flex-col items-center justify-center space-y-6 relative overflow-hidden min-h-[480px]"
    >
      <div className="space-y-2 relative z-10">
        <span className="text-xs uppercase tracking-[0.25em] bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full font-bold">
          🎈 Поляната на заспалите балони
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C241D]">
          Помогни на балоните да се усмихнат!
        </h2>
        <p className="text-xs sm:text-sm text-[#2C241D]/70 max-w-md mx-auto">
          Докосни веселите цветни балони по поляната, за да ги пукнеш с вълшебни конфети! ({poppedCount} / {totalBalloons})
        </p>
      </div>

      {/* Floating balloons area */}
      <div className="relative w-full h-64 bg-gradient-to-b from-sky-100 to-emerald-100 rounded-3xl border border-emerald-200 overflow-hidden shadow-inner flex items-center justify-center">
        {balloons.map(b => (
          !b.popped ? (
            <motion.button
              key={b.id}
              animate={{
                y: [0, -15, 0],
                x: [0, (b.id % 2 === 0 ? 10 : -10), 0],
              }}
              transition={{
                duration: 2 + b.id,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.5, opacity: 0 }}
              onClick={() => handlePop(b.id)}
              className={`absolute w-16 h-20 sm:w-20 sm:h-24 rounded-full ${b.color} shadow-lg flex flex-col items-center justify-end pb-2 cursor-pointer`}
              style={{ left: `${b.x}%`, top: `${b.y}%` }}
            >
              <div className="w-1 h-6 bg-gray-400 mt-1"></div>
              <Sparkles className="w-4 h-4 text-white opacity-80 absolute top-2 right-2" />
            </motion.button>
          ) : (
            <motion.div
              key={b.id}
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              className="absolute text-2xl"
              style={{ left: `${b.x}%`, top: `${b.y}%` }}
            >
              🎉
            </motion.div>
          )
        ))}

        {poppedCount >= totalBalloons && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center space-y-2 z-20"
          >
            <span className="text-4xl">🌟</span>
            <h3 className="font-serif font-bold text-xl text-emerald-700">Чудесно! Поляната е озарена!</h3>
            <p className="text-xs text-[#2C241D]/70"> Продължаваме напред към следващото чудо...</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
