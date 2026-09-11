'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface IntroSceneProps {
  childName: string;
  onComplete: () => void;
}

export function IntroScene({ childName, onComplete }: IntroSceneProps) {
  const [stage, setStage] = useState<'curtain' | 'revealed' | 'unlocking'>('curtain');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStage('revealed');
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyClick = () => {
    if (stage !== 'revealed') return;
    setStage('unlocking');
    setTimeout(() => {
      onComplete();
    }, 1300);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: stage === 'unlocking' ? [1, 1, 0.9, 0] : 1,
        scale: stage === 'unlocking' ? [1, 3.8] : 1,
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
        transformOrigin: '25% 25%'
      }}
      transition={{ duration: stage === 'unlocking' ? 1.4 : 0.8, ease: "easeInOut" }}
      className="flex flex-col items-center justify-center select-none"
    >
      {/* 1. Background Layer (z-0) */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: 'url(/images/birthday/kids_fairytale/stage1/background.jpeg)' }}
      >
        <div className="absolute inset-0 bg-indigo-950/40 backdrop-blur-[1px]" />
      </div>

      {/* 2. Castle Layer - Top Left (z-10) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute top-[8%] sm:top-[12%] left-[4%] sm:left-[8%] z-10 pointer-events-none"
      >
        <motion.div 
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="w-auto h-auto max-w-[220px] sm:max-w-[340px] md:max-w-[420px] opacity-95 drop-shadow-[0_15px_40px_rgba(0,0,0,0.8)]"
        >
          <img 
            src="/images/birthday/kids_fairytale/stage1/castle.png" 
            alt="Castle" 
            className="w-auto h-auto max-w-full object-contain"
          />
        </motion.div>
      </motion.div>

      {/* 3. Island Layer - Right / Waterfalls (z-20) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute bottom-0 right-[-5%] sm:right-[2%] z-20 pointer-events-none"
      >
        <img 
          src="/images/birthday/kids_fairytale/stage1/island.png" 
          alt="Island" 
          className="w-auto h-auto max-w-[70vw] sm:max-w-[45vw] lg:max-w-[500px] object-contain opacity-95 drop-shadow-[0_10px_30px_rgba(0,0,0,0.7)]"
        />
      </motion.div>

      {/* 4. Bottom Fluffy Clouds Layers (z-25) */}
      <div className="absolute bottom-0 inset-x-0 z-25 pointer-events-none overflow-hidden opacity-85 flex justify-between items-end">
        <img src="/images/birthday/kids_fairytale/stage1/cloude.png" alt="Cloud bottom" className="w-[60vw] sm:w-[40vw] h-auto object-contain filter hue-rotate-[290deg] saturate-150 -mb-10 -ml-10" />
        <img src="/images/birthday/kids_fairytale/stage1/cloude.png" alt="Cloud bottom" className="w-[60vw] sm:w-[40vw] h-auto object-contain filter hue-rotate-[290deg] saturate-150 -mb-10 -mr-10 scale-x-[-1]" />
      </div>

      {/* 5. Story Text & Child Name (z-30) */}
      <AnimatePresence>
        {stage !== 'curtain' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute top-[16%] sm:top-[18%] inset-x-4 z-30 mx-auto flex flex-col items-center space-y-1 sm:space-y-2 pointer-events-none text-center"
          >
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-serif font-bold text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] leading-tight">
              Имало едно време едно вълшебно царство...
            </h1>
            <div className="text-2xl sm:text-5xl lg:text-6xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-100 drop-shadow-[0_4px_20px_rgba(251,191,36,0.9)] py-1">
              ✦ {childName} ✦
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Golden Key in Center (z-35) */}
      <AnimatePresence>
        {stage !== 'curtain' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ 
              opacity: 1, 
              scale: stage === 'unlocking' ? [1, 1.2, 0.4] : 1,
              x: stage === 'unlocking' ? [0, -180, -320] : 0,
              y: stage === 'unlocking' ? [0, -120, -220] : 0,
              rotate: stage === 'unlocking' ? [0, 15, -15] : [0, 5, -5, 0],
            }}
            transition={
              stage === 'unlocking' 
                ? { duration: 1.2, ease: "easeInOut" }
                : { scale: { duration: 0.6, delay: 0.4 }, rotate: { repeat: Infinity, duration: 3, ease: "easeInOut" } }
            }
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[35] flex flex-col items-center cursor-pointer group"
            onClick={handleKeyClick}
          >
            {/* Glowing Aura / Sparkle Effect */}
            <div className="absolute inset-0 rounded-full bg-amber-400/40 blur-3xl animate-pulse group-hover:bg-amber-300/70 transition-all duration-500 scale-150" />

            <motion.img 
              src="/images/birthday/kids_fairytale/stage1/key.png" 
              alt="Golden Key" 
              whileHover={{ scale: 1.15, rotate: 10 }}
              whileTap={{ scale: 0.85 }}
              className="w-36 sm:w-48 lg:w-56 h-auto cursor-pointer drop-shadow-[0_0_35px_rgba(255,215,0,0.9)] object-contain relative z-10"
            />
            <motion.div
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-4 bg-black/70 backdrop-blur-md px-5 py-2 rounded-full border border-amber-300/50 text-amber-200 text-xs sm:text-sm font-bold tracking-wide pointer-events-none shadow-2xl relative z-10"
            >
              🗝️ Докосни ключа, за да отключиш празника!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* 7. Full-Screen Cloud Curtain Entrance (z-40) */}
      <AnimatePresence>
        {stage === 'curtain' && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-40 pointer-events-none overflow-hidden flex items-center justify-center bg-indigo-950/90"
          >
            {/* Grid of overlapping clouds covering the entire screen initially */}
            <motion.div 
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex flex-wrap items-center justify-around p-4"
            >
              <img src="/images/birthday/kids_fairytale/stage1/cloude.png" alt="Cloud" className="absolute -top-10 -left-10 w-[70vw] h-auto object-contain opacity-95 filter brightness-110 drop-shadow-2xl" />
              <img src="/images/birthday/kids_fairytale/stage1/cloude.png" alt="Cloud" className="absolute -top-10 -right-10 w-[70vw] h-auto object-contain opacity-95 filter brightness-110 drop-shadow-2xl scale-x-[-1]" />
              <img src="/images/birthday/kids_fairytale/stage1/cloude.png" alt="Cloud" className="absolute -bottom-10 -left-10 w-[70vw] h-auto object-contain opacity-95 filter brightness-110 drop-shadow-2xl scale-y-[-1]" />
              <img src="/images/birthday/kids_fairytale/stage1/cloude.png" alt="Cloud" className="absolute -bottom-10 -right-10 w-[70vw] h-auto object-contain opacity-95 filter brightness-110 drop-shadow-2xl scale-[-1]" />
              <img src="/images/birthday/kids_fairytale/stage1/cloude.png" alt="Cloud" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-auto object-contain opacity-90 filter brightness-110 drop-shadow-2xl" />
            </motion.div>

            {/* Theatre curtain opening left & right */}
            <motion.div
              initial={{ x: 0 }}
              animate={{ x: '-100%' }}
              transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 left-0 w-1/2 h-full flex items-center justify-end overflow-hidden"
            >
              <img 
                src="/images/birthday/kids_fairytale/stage1/cloude.png" 
                alt="Cloud curtain left" 
                className="w-auto h-auto max-w-none max-h-full object-contain opacity-95 filter brightness-105 drop-shadow-2xl"
              />
            </motion.div>

            <motion.div
              initial={{ x: 0 }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 right-0 w-1/2 h-full flex items-center justify-start overflow-hidden"
            >
              <img 
                src="/images/birthday/kids_fairytale/stage1/cloude.png" 
                alt="Cloud curtain right" 
                className="w-auto h-auto max-w-none max-h-full object-contain opacity-95 filter brightness-105 drop-shadow-2xl scale-x-[-1]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 8. Climax Golden Flash / Transition (z-50) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === 'unlocking' ? [0, 0.5, 1] : 0 }}
        transition={{ duration: 1.2, times: [0, 0.6, 1] }}
        className="absolute inset-0 z-50 bg-gradient-to-tr from-amber-200 via-white to-yellow-300 pointer-events-none"
      />
    </motion.div>
  );
}
