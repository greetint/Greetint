'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, BookOpen } from 'lucide-react';

interface StarValleySceneProps {
  onComplete: () => void;
}

export function StarValleyScene({ onComplete }: StarValleySceneProps) {
  const [starsCollected, setStarsCollected] = useState<number>(0);
  const totalStars = 4;

  const handleCollect = (index: number) => {
    const next = starsCollected + 1;
    setStarsCollected(next);
    if (next >= totalStars) {
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-2xl bg-white/90 backdrop-blur-2xl p-8 sm:p-14 rounded-[2.5rem] shadow-2xl border-4 border-amber-300 text-center flex flex-col items-center justify-center space-y-6 relative overflow-hidden min-h-[480px]"
    >
      <div className="space-y-2 relative z-10">
        <span className="text-xs uppercase tracking-[0.25em] bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-bold">
          ⭐ Долината на светлината
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C241D]">
          Нуждаем се от светлина...
        </h2>
        <p className="text-xs sm:text-sm text-[#2C241D]/70 max-w-md mx-auto">
          Пътеката е потънала в мрак. Докосни изгубените звездици, за да ги събереш в магическата книжка! ({starsCollected} / {totalStars})
        </p>
      </div>

      <div className="relative w-full h-64 bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-900 rounded-3xl border border-amber-400/40 overflow-hidden shadow-inner flex items-center justify-center p-4">
        {starsCollected < totalStars ? (
          <div className="absolute inset-0 flex flex-wrap items-center justify-around p-8">
            {[...Array(totalStars - starsCollected)].map((_, i) => (
              <motion.button
                key={i}
                animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2 + i, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.7 }}
                onClick={() => handleCollect(i)}
                className="p-4 bg-amber-400/20 backdrop-blur-md rounded-full text-amber-300 hover:text-amber-200 cursor-pointer shadow-lg animate-pulse"
              >
                <Star className="w-9 h-9 fill-amber-300" />
              </motion.button>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center text-white space-y-2 z-20"
          >
            <BookOpen className="w-12 h-12 text-amber-400 mx-auto animate-bounce" />
            <h3 className="font-serif font-bold text-xl text-amber-300">Пътеката е озарена с дъга!</h3>
            <p className="text-xs text-white/80">Магическият път към замъка е отворен ✨</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
