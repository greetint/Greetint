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
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyClick = () => {
    if (stage !== 'revealed') return;
    setStage('unlocking');
    setTimeout(() => {
      onComplete();
    }, 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: stage === 'unlocking' ? [1, 1, 0.95, 0] : 1,
        scale: stage === 'unlocking' ? [1, 2.8] : 1,
      }}
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        zIndex: 50, 
        overflow: 'hidden', 
        background: 'black',
        transformOrigin: '15% 15%'
      }}
      transition={{ 
        duration: stage === 'unlocking' ? 1.8 : 0.8, 
        ease: stage === 'unlocking' ? [0.7, 0, 0.84, 0] : "easeInOut" 
      }}
      className="flex flex-col items-center justify-center select-none transform-gpu"
    >
      {/* 1. Background Layer (z-0) */}
      <img 
        src="/images/birthday/kids_fairytale/stage1/background.jpeg" 
        alt="Background" 
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      />
      <div className="absolute inset-0 bg-indigo-950/30 backdrop-blur-[0.5px] z-[1] pointer-events-none" />

      {/* 2. Castle Layer - Top Left (z-10) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute top-12 left-12 z-10 pointer-events-none"
      >
        <motion.div 
          animate={{ y: [-6, 6, -6] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-auto h-auto opacity-95 drop-shadow-[0_15px_35px_rgba(0,0,0,0.8)]"
        >
          <img 
            src="/images/birthday/kids_fairytale/stage1/castle.png" 
            alt="Castle" 
            className="w-64 md:w-80 h-auto object-contain"
          />
        </motion.div>
      </motion.div>

      {/* 3. Island Layer - Bottom Right (z-20) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute bottom-8 right-12 z-20 pointer-events-none"
      >
        <motion.div 
          animate={{ y: [-6, 6, -6] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="w-auto h-auto opacity-95 drop-shadow-[0_15px_35px_rgba(0,0,0,0.8)]"
        >
          <img 
            src="/images/birthday/kids_fairytale/stage1/island.png" 
            alt="Island" 
            className="w-72 md:w-96 h-auto object-contain"
          />
        </motion.div>
      </motion.div>

      {/* 4. Story Text & Child Name (z-30) */}
      <AnimatePresence>
        {stage !== 'curtain' && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-30 text-center pointer-events-none px-4 space-y-1.5"
          >
            <h1 className="text-xl md:text-3xl font-serif font-bold text-white drop-shadow-lg leading-tight">
              Имало едно време едно вълшебно царство...
            </h1>
            <div className="text-3xl md:text-5xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-100 drop-shadow-[0_4px_16px_rgba(251,191,36,0.9)] py-1">
              ✦ {childName} ✦
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Golden Key in Center (z-35) */}
      <AnimatePresence>
        {stage !== 'curtain' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ 
              opacity: 1, 
              scale: stage === 'unlocking' ? [1, 1.2, 0.3] : [1, 1.03, 1],
              y: stage === 'unlocking' ? [0, -200] : [-10, 10, -10],
              x: stage === 'unlocking' ? [0, -350] : 0,
              rotate: stage === 'unlocking' ? [0, -15, -25] : [0, 5, -5, 0],
            }}
            transition={
              stage === 'unlocking' 
                ? { type: 'spring', stiffness: 300, damping: 20, duration: 1.2 }
                : { y: { repeat: Infinity, duration: 3, ease: 'easeInOut' }, scale: { repeat: Infinity, duration: 3, ease: 'easeInOut' } }
            }
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[35] flex flex-col items-center cursor-pointer group"
            onClick={handleKeyClick}
          >
            {/* Fairy Glow Effect */}
            <div className="absolute inset-0 rounded-full bg-amber-400/30 blur-2xl animate-pulse group-hover:bg-amber-300/60 transition-all duration-500 scale-125 pointer-events-none" />

            <img 
              src="/images/birthday/kids_fairytale/stage1/key.png" 
              alt="Golden Key" 
              className="w-28 md:w-36 h-auto cursor-pointer drop-shadow-[0_0_25px_rgba(255,215,0,0.6)] object-contain relative z-10 transition-transform duration-300 group-hover:scale-110"
            />
            <motion.div
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-3 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-amber-300/40 text-amber-200 text-xs md:text-sm font-bold tracking-wide pointer-events-none shadow-xl relative z-10"
            >
              🗝️ Докосни ключа, за да отключиш празника!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Cloud Curtains (z-40) */}
      <AnimatePresence>
        {stage === 'curtain' && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-40 pointer-events-none overflow-hidden flex items-center justify-between"
          >
            {/* Left Cloud Curtain */}
            <motion.div
              initial={{ x: 0, rotate: 0 }}
              animate={{ x: '-120%', rotate: -5 }}
              transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -left-20 inset-y-0 w-1/2 flex items-center justify-start overflow-hidden opacity-85"
            >
              <img 
                src="/images/birthday/kids_fairytale/stage1/cloude.png" 
                alt="Cloud curtain left" 
                className="w-full h-auto object-contain filter brightness-105 drop-shadow-2xl scale-125"
              />
            </motion.div>

            {/* Right Cloud Curtain */}
            <motion.div
              initial={{ x: 0, rotate: 0 }}
              animate={{ x: '120%', rotate: 5 }}
              transition={{ duration: 2.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -right-20 inset-y-0 w-1/2 flex items-center justify-end overflow-hidden opacity-85"
            >
              <img 
                src="/images/birthday/kids_fairytale/stage1/cloude.png" 
                alt="Cloud curtain right" 
                className="w-full h-auto object-contain filter brightness-105 drop-shadow-2xl scale-125 scale-x-[-1]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 7. Climax Golden Flash Transition (z-50) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === 'unlocking' ? [0, 0.4, 1] : 0 }}
        transition={{ duration: 1.5, times: [0, 0.6, 1] }}
        className="absolute inset-0 z-50 bg-gradient-to-tr from-amber-200 via-white to-yellow-300 pointer-events-none"
      />
    </motion.div>
  );
}
