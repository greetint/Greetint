'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, Wand2 } from 'lucide-react';

interface IntroSceneProps {
  childName: string;
  onComplete: () => void;
}

export function IntroScene({ childName, onComplete }: IntroSceneProps) {
  const [isExploded, setIsExploded] = useState(false);

  const handleMagicTouch = () => {
    if (isExploded) return;
    setIsExploded(true);
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-2xl bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-900 p-8 sm:p-14 rounded-[2.5rem] shadow-2xl border-4 border-amber-300/80 text-center flex flex-col items-center justify-center space-y-8 relative overflow-hidden text-white min-h-[520px]"
    >
      {/* Floating cheerful background stars and glowing orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              x: [0, (i % 2 === 0 ? 25 : -25), 0],
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + (i % 4),
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute rounded-full"
            style={{
              width: `${6 + (i * 4) % 16}px`,
              height: `${6 + (i * 4) % 16}px`,
              background: i % 4 === 0 ? '#FBBF24' : i % 4 === 1 ? '#60A5FA' : i % 4 === 2 ? '#F472B6' : '#C084FC',
              top: `${(i * 17) % 90}%`,
              left: `${(i * 13) % 90}%`,
              boxShadow: '0 0 12px rgba(251, 191, 36, 0.8)',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 space-y-6 max-w-lg w-full flex flex-col items-center">
        {/* Top magical icon */}
        <motion.div
          animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.15, 1] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="inline-flex p-5 bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-500 rounded-3xl text-white shadow-xl mb-2 border border-white/30"
        >
          <Wand2 className="w-12 h-12" />
        </motion.div>

        {/* Narrator text with smooth animation */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-3xl sm:text-4xl font-serif font-black text-amber-200 leading-tight drop-shadow-md"
        >
          Имало едно време едно много специално дете...
        </motion.h1>

        {/* Child name highlight */}
        <div className="py-2 space-y-2">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-base sm:text-lg text-pink-300 font-bold tracking-wide"
          >
            Днес празнува нашият прекрасен герой:
          </motion.p>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.6 }}
            className="text-4xl sm:text-6xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-300 py-2 drop-shadow-lg"
          >
            {childName} ✨
          </motion.div>
        </div>

        {/* Instruction */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-sm sm:text-base text-white/90 leading-relaxed font-sans bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-inner"
        >
          Докосни светещата вълшебна звезда, за да отвориш приказката! 🌟
        </motion.p>

        {/* Big, beautiful, glowing magic star / button */}
        <div className="relative py-6 flex items-center justify-center">
          {!isExploded ? (
            <motion.button
              animate={{
                scale: [1, 1.12, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.25 }}
              whileTap={{ scale: 0.85 }}
              onClick={handleMagicTouch}
              className="relative p-6 sm:p-8 bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 text-purple-950 rounded-full shadow-[0_0_40px_rgba(251,191,36,0.8)] cursor-pointer border-4 border-white/80 group flex items-center justify-center"
            >
              <Star className="w-16 h-16 sm:w-20 sm:h-20 fill-white text-yellow-100 group-hover:rotate-12 transition-transform duration-300" />
              <Sparkles className="w-8 h-8 text-white absolute -top-1 -right-1 animate-ping" />
            </motion.button>
          ) : (
            <div className="relative w-24 h-24 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 rounded-full blur-xl"
              />
              {/* Confetti particles */}
              {[...Array(24)].map((_, i) => {
                const angle = (i / 24) * 360;
                const distance = 80 + (i % 3) * 35;
                const rad = (angle * Math.PI) / 180;
                const destX = Math.cos(rad) * distance;
                const destY = Math.sin(rad) * distance;
                const colors = ['#FBBF24', '#F472B6', '#60A5FA', '#34D399', '#C084FC'];
                return (
                  <motion.div
                    key={i}
                    initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                    animate={{
                      x: destX,
                      y: destY,
                      scale: [1, 1.5, 0.3],
                      opacity: [1, 1, 0],
                      rotate: Math.random() * 360,
                    }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="absolute w-4 h-4 rounded-full"
                    style={{
                      background: colors[i % colors.length],
                      boxShadow: `0 0 8px ${colors[i % colors.length]}`,
                    }}
                  />
                );
              })}
              <span className="text-3xl z-10 animate-bounce">✨🎉</span>
            </div>
          )}
        </div>

        {isExploded && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-yellow-300 font-bold text-base uppercase tracking-wider animate-pulse"
          >
            ✨ Магията започва! Пренасяме се към поляната... 🎈
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

