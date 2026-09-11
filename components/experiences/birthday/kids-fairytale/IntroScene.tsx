'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroSceneProps {
  childName: string;
  onComplete: () => void;
}

export function IntroScene({ childName, onComplete }: IntroSceneProps) {
  const [stage, setStage] = useState<'curtain' | 'revealed' | 'unlocking'>('curtain');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStage('revealed');
    }, 1300);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyClick = () => {
    if (stage !== 'revealed') return;
    setStage('unlocking');
    setTimeout(() => {
      onComplete();
    }, 1800);
  };

  // Generate an array of 14 cloud curtain elements for the initial misty reveal
  const curtainClouds = Array.from({ length: 14 }).map((_, i) => {
    const randomX = (i % 2 === 0 ? -1 : 1) * (40 + (i * 15) % 50);
    const randomY = ((i * 7) % 100) - 50;
    const randomScale = 1.2 + (i % 4) * 0.15;
    const randomRotate = (i % 2 === 0 ? -1 : 1) * (10 + (i * 5));
    return { id: i, randomX, randomY, randomScale, randomRotate };
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: stage === 'unlocking' ? [1, 1, 0.95, 0] : 1,
        scale: stage === 'unlocking' ? [1, 2.6] : 1,
      }}
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        zIndex: 50, 
        overflow: 'hidden', 
        background: '#05021a',
        transformOrigin: '18% 28%' // Zoom directly towards the castle top-left
      }}
      transition={{ 
        duration: stage === 'unlocking' ? 1.8 : 0.8, 
        ease: stage === 'unlocking' ? [0.7, 0, 0.84, 0] : "easeInOut" 
      }}
      className="flex flex-col items-center justify-center select-none transform-gpu"
    >
      {/* 1. Background Layer - Magical Night Sky (z-0) */}
      <img 
        src="/images/birthday/kids_fairytale/stage1/background.jpeg" 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      />
      <div className="absolute inset-0 bg-indigo-950/20 backdrop-blur-[0.3px] z-[1] pointer-events-none" />

      {/* 2. Rich Bottom Cloud Floor (z-10) */}
      <div className="absolute bottom-0 left-0 right-0 h-48 md:h-72 z-10 pointer-events-none overflow-hidden flex items-end justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 via-pink-600/30 to-transparent z-10 pointer-events-none" />
        <img 
          src="/images/birthday/kids_fairytale/stage1/cloude.png" 
          alt="Cloud Floor Left" 
          className="absolute -bottom-10 -left-10 w-[60%] md:w-[45%] h-auto object-contain opacity-95 filter brightness-110 drop-shadow-[0_-10px_30px_rgba(236,72,153,0.4)] z-0"
        />
        <img 
          src="/images/birthday/kids_fairytale/stage1/cloude.png" 
          alt="Cloud Floor Right" 
          className="absolute -bottom-10 -right-10 w-[60%] md:w-[45%] h-auto object-contain opacity-95 filter brightness-110 drop-shadow-[0_-10px_30px_rgba(168,85,247,0.4)] z-0 scale-x-[-1]"
        />
        <img 
          src="/images/birthday/kids_fairytale/stage1/cloude.png" 
          alt="Cloud Floor Center" 
          className="absolute -bottom-16 left-1/4 w-[60%] md:w-[50%] h-auto object-contain opacity-90 filter brightness-105 z-0"
        />
      </div>

      {/* 3. Castle Layer - Top Left (z-20) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        className="absolute left-[3%] top-[12%] md:left-[5%] md:top-[10%] z-20 pointer-events-none"
      >
        <motion.div 
          animate={{ y: [-6, 6, -6] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-auto h-auto opacity-100 drop-shadow-[0_20px_45px_rgba(0,0,0,0.85)]"
        >
          <img 
            src="/images/birthday/kids_fairytale/stage1/castle.png" 
            alt="Castle" 
            className="w-[260px] md:w-[425px] h-auto object-contain filter brightness-105"
          />
        </motion.div>
      </motion.div>

      {/* 4. Island Layer - Bottom Right (z-20) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
        className="absolute right-[2%] bottom-[8%] md:right-[4%] md:bottom-[6%] z-20 pointer-events-none"
      >
        <motion.div 
          animate={{ y: [-6, 6, -6] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="w-auto h-auto opacity-100 drop-shadow-[0_20px_45px_rgba(0,0,0,0.85)]"
        >
          <img 
            src="/images/birthday/kids_fairytale/stage1/island.png" 
            alt="Island" 
            className="w-[280px] md:w-[460px] h-auto object-contain filter brightness-105"
          />
        </motion.div>
      </motion.div>

      {/* 5. Story Text & Child Name (z-30) */}
      <AnimatePresence>
        {stage !== 'curtain' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="absolute top-10 md:top-14 left-1/2 -translate-x-1/2 z-30 text-center pointer-events-none px-4 space-y-1"
          >
            <h1 className="text-lg md:text-2xl font-serif font-semibold text-amber-100/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] tracking-wide">
              Имало едно време едно вълшебно царство...
            </h1>
            <div className="text-3xl md:text-5xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-100 drop-shadow-[0_4px_20px_rgba(251,191,36,0.9)] py-1">
              ✦ {childName} ✦
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Golden Key in Center (z-35) */}
      <AnimatePresence>
        {stage !== 'curtain' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ 
              opacity: 1, 
              scale: stage === 'unlocking' ? [1, 1.25, 0.4] : [1, 1.05, 1],
              y: stage === 'unlocking' ? [0, -220] : [-12, 12, -12],
              x: stage === 'unlocking' ? [0, -380] : 0,
              rotate: stage === 'unlocking' ? [0, -15, -30] : [0, 6, -6, 0],
            }}
            transition={
              stage === 'unlocking' 
                ? { type: 'spring', stiffness: 280, damping: 22, duration: 1.3 }
                : { y: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' }, scale: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' } }
            }
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[35] flex flex-col items-center cursor-pointer group"
            onClick={handleKeyClick}
          >
            {/* Magical Fairy Glow Effect */}
            <div className="absolute inset-0 rounded-full bg-amber-400/40 blur-3xl animate-pulse group-hover:bg-amber-300/70 transition-all duration-500 scale-150 pointer-events-none" />

            <img 
              src="/images/birthday/kids_fairytale/stage1/key.png" 
              alt="Golden Key" 
              className="w-32 md:w-44 h-auto cursor-pointer drop-shadow-[0_0_35px_rgba(255,215,0,0.85)] object-contain relative z-10 transition-transform duration-300 group-hover:scale-110"
            />
            <motion.div
              animate={{ opacity: [0.85, 1, 0.85] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-4 bg-black/60 backdrop-blur-md px-5 py-2 rounded-full border border-amber-300/50 text-amber-200 text-xs md:text-sm font-bold tracking-wide pointer-events-none shadow-2xl relative z-10"
            >
              🗝️ Докосни ключа, за да отключиш празника!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. Intro Cloud Curtain (Dynamic 14 Small Clouds Opening) (z-40) */}
      <AnimatePresence>
        {stage === 'curtain' && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 z-40 pointer-events-none overflow-hidden flex items-center justify-center"
          >
            {curtainClouds.map((cloud) => (
              <motion.div
                key={cloud.id}
                initial={{ x: 0, y: 0, scale: cloud.randomScale, opacity: 1, rotate: 0 }}
                animate={{ 
                  x: cloud.randomX * 18, 
                  y: cloud.randomY * 12 + (cloud.id % 2 === 0 ? 300 : -300), 
                  scale: cloud.randomScale * 1.3,
                  opacity: 0,
                  rotate: cloud.randomRotate * 2
                }}
                transition={{ 
                  duration: 1.4, 
                  delay: cloud.id * 0.03, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <img 
                  src="/images/birthday/kids_fairytale/stage1/cloude.png" 
                  alt="Curtain cloud" 
                  className="w-96 md:w-[600px] h-auto object-contain filter brightness-110 drop-shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 8. Climax Golden Flash Transition (z-50) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === 'unlocking' ? [0, 0.5, 1] : 0 }}
        transition={{ duration: 1.5, times: [0, 0.5, 1] }}
        className="absolute inset-0 z-50 bg-gradient-to-tr from-amber-200 via-white to-yellow-300 pointer-events-none"
      />
    </motion.div>
  );
}
