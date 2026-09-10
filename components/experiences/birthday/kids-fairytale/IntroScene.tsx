'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, KeyRound, Wand2 } from 'lucide-react';

interface IntroSceneProps {
  childName: string;
  onComplete: () => void;
}

export function IntroScene({ childName, onComplete }: IntroSceneProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  const handleMagicTouch = () => {
    if (isUnlocked) return;
    setIsUnlocked(true);
    setTimeout(() => {
      onComplete();
    }, 1100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
      className="w-full max-w-2xl bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e] p-8 sm:p-14 rounded-[2.5rem] shadow-[0_0_60px_rgba(147,51,234,0.4)] border-4 border-amber-300/80 text-center flex flex-col items-center justify-center space-y-6 sm:space-y-8 relative overflow-hidden text-white min-h-[560px]"
    >
      {/* Magical Night Sky Background & Castle Silhouette */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Glowing Crescent Moon */}
        <div className="absolute top-6 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-yellow-200 to-amber-400 opacity-90 shadow-[0_0_30px_rgba(251,191,36,0.8)]" />

        {/* Distant Castle Silhouette */}
        <div className="absolute bottom-0 left-0 right-0 h-40 opacity-20 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-500 via-indigo-900 to-transparent flex items-end justify-start px-8">
          <svg viewBox="0 0 500 200" className="w-full h-32 fill-amber-200 opacity-60">
            <path d="M50 200 L50 120 L30 120 L30 100 L50 100 L50 80 L60 60 L70 80 L70 100 L90 100 L90 120 L70 120 L70 200 Z M150 200 L150 90 L135 70 L150 50 L165 70 L150 90 Z M220 200 L220 110 L200 110 L200 90 L220 90 L220 70 L235 45 L250 70 L250 90 L270 90 L270 110 L250 110 L250 200 Z M350 200 L350 100 L330 100 L330 80 L350 80 L350 60 L365 35 L380 60 L380 80 L400 80 L400 100 L380 100 L380 200 Z" />
          </svg>
        </div>

        {/* Fluffy Purple-Pink Clouds */}
        <div className="absolute -bottom-10 -left-10 w-72 h-36 bg-pink-500/20 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -right-10 w-80 h-40 bg-purple-500/20 rounded-full blur-2xl" />

        {/* Floating Background Stars */}
        {[...Array(16)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -25, 0],
              x: [0, (i % 2 === 0 ? 20 : -20), 0],
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.9, 0.3],
            }}
            transition={{
              duration: 3 + (i % 4),
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute rounded-full"
            style={{
              width: `${4 + (i * 3) % 12}px`,
              height: `${4 + (i * 3) % 12}px`,
              background: i % 3 === 0 ? '#FBBF24' : i % 3 === 1 ? '#F472B6' : '#93C5FD',
              top: `${(i * 19) % 85}%`,
              left: `${(i * 13) % 92}%`,
              boxShadow: '0 0 10px rgba(251, 191, 36, 0.8)',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 space-y-6 max-w-lg w-full flex flex-col items-center">
        {/* Top magical icon badge */}
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="inline-flex p-4 bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 rounded-3xl text-white shadow-xl border border-white/30"
        >
          <Wand2 className="w-10 h-10" />
        </motion.div>

        {/* Narrator title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-2xl sm:text-4xl font-serif font-black text-amber-200 leading-tight drop-shadow-lg"
        >
          Имало едно време едно много специално дете...
        </motion.h1>

        {/* Child name highlight */}
        <div className="py-1 space-y-1">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-sm sm:text-base text-pink-300 font-bold tracking-wide"
          >
            Днес празнува нашият прекрасен герой:
          </motion.p>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.6 }}
            className="text-3xl sm:text-5xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-amber-200 drop-shadow-[0_4px_12px_rgba(251,191,36,0.6)] py-1"
          >
            ✦ {childName} ✦
          </motion.div>
        </div>

        {/* Instruction pill */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-xs sm:text-sm text-white/95 leading-relaxed font-sans bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 shadow-inner max-w-md"
        >
          Докосни златния вълшебен ключ, за да отвориш вратите на приказката! 🗝️✨
        </motion.p>

        {/* Central Magical Golden Key Interaction */}
        <div className="relative py-4 flex items-center justify-center">
          {!isUnlocked ? (
            <motion.button
              animate={{
                y: [0, -10, 0],
                rotate: [0, 6, -6, 0],
                scale: [1, 1.08, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
              }}
              whileHover={{ scale: 1.2, rotate: 12 }}
              whileTap={{ scale: 0.85 }}
              onClick={handleMagicTouch}
              className="relative p-7 sm:p-9 bg-gradient-to-br from-yellow-200 via-amber-400 to-orange-500 text-indigo-950 rounded-full shadow-[0_0_50px_rgba(251,191,36,0.9)] cursor-pointer border-4 border-white/90 group flex items-center justify-center"
            >
              <KeyRound className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-950 fill-yellow-200 group-hover:scale-110 transition-transform duration-300" />
              <Sparkles className="w-8 h-8 text-white absolute -top-1 -right-1 animate-ping" />
              <Star className="w-6 h-6 text-yellow-100 absolute -bottom-1 -left-1 fill-yellow-200 animate-pulse" />
            </motion.button>
          ) : (
            <div className="relative w-28 h-28 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.4, opacity: 1 }}
                animate={{ scale: 3.5, opacity: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
                className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 rounded-full blur-2xl"
              />
              {/* Magic Golden Sparkles Burst */}
              {[...Array(24)].map((_, i) => {
                const angle = (i / 24) * 360;
                const distance = 90 + (i % 3) * 30;
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
                      scale: [1, 1.8, 0.2],
                      opacity: [1, 1, 0],
                      rotate: Math.random() * 360,
                    }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                    className="absolute w-4 h-4 rounded-full"
                    style={{
                      background: colors[i % colors.length],
                      boxShadow: `0 0 10px ${colors[i % colors.length]}`,
                    }}
                  />
                );
              })}
              <span className="text-4xl z-10 animate-bounce">🗝️✨</span>
            </div>
          )}
        </div>

        {isUnlocked && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-amber-300 font-bold text-sm sm:text-base uppercase tracking-wider animate-pulse"
          >
            ✨ Ключът завъртя ключалката! Пренасяме се към поляната... 🎈
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

