'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';

interface IntroSceneProps {
  childName: string;
  onComplete: () => void;
}

export function IntroScene({ childName, onComplete }: IntroSceneProps) {
  const [starsTouched, setStarsTouched] = useState<number>(0);
  const neededStars = 3;

  const handleTouchStar = () => {
    const next = starsTouched + 1;
    setStarsTouched(next);
    if (next >= neededStars) {
      setTimeout(() => {
        onComplete();
      }, 800);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-2xl bg-white/90 backdrop-blur-2xl p-8 sm:p-14 rounded-[2.5rem] shadow-2xl border-4 border-amber-300 text-center flex flex-col items-center justify-center space-y-8 relative overflow-hidden"
    >
      {/* Floating rainbow background lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -40, 0],
              x: [0, (i % 2 === 0 ? 30 : -30), 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute rounded-full opacity-30"
            style={{
              width: `${40 + i * 15}px`,
              height: `${40 + i * 15}px`,
              background: i % 4 === 0 ? '#FBBF24' : i % 4 === 1 ? '#34D399' : i % 4 === 2 ? '#60A5FA' : '#F472B6',
              top: `${10 + (i * 12) % 80}%`,
              left: `${5 + (i * 14) % 85}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 space-y-6 max-w-lg">
        <motion.div
          animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="inline-flex p-5 bg-gradient-to-tr from-amber-400 to-orange-400 rounded-3xl text-white shadow-lg mb-2"
        >
          <Sparkles className="w-12 h-12" />
        </motion.div>

        <h1 className="text-3xl sm:text-4xl font-serif font-black text-[#2C241D] leading-tight">
          Имало едно време едно много специално дете...
        </h1>

        <div className="py-2 space-y-2">
          <p className="text-base sm:text-lg text-emerald-700 font-bold tracking-wide">
            Днес празнува нашият прекрасен герой:
          </p>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.4 }}
            className="text-4xl sm:text-6xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-600 to-indigo-600 py-2 drop-shadow-sm"
          >
            {childName} ✨
          </motion.div>
        </div>

        <p className="text-sm sm:text-base text-[#2C241D]/80 leading-relaxed font-sans bg-amber-50/80 p-4 rounded-2xl border border-amber-200 shadow-inner">
          За да отворим вратата към вълшебното пътешествие, докосни съзвездието от светлинки по екрана! ({starsTouched} / {neededStars})
        </p>

        {/* Interactive glowing touch stars */}
        <div className="flex justify-center gap-6 py-4">
          {[...Array(neededStars)].map((_, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.3 }}
              whileTap={{ scale: 0.8 }}
              onClick={handleTouchStar}
              disabled={i < starsTouched}
              className={`p-4 rounded-full shadow-xl transition cursor-pointer ${
                i < starsTouched 
                  ? 'bg-emerald-400 text-white opacity-50 cursor-default' 
                  : 'bg-gradient-to-r from-amber-400 to-orange-400 text-white animate-bounce'
              }`}
            >
              <Star className="w-8 h-8 fill-white" />
            </motion.button>
          ))}
        </div>

        {starsTouched >= neededStars && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-emerald-600 font-bold text-base uppercase tracking-wider animate-pulse"
          >
            ✨ Порталът се отваря! Добре дошъл в приказката! 🚪
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

