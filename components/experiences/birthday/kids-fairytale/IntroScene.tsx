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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: stage === 'unlocking' ? [1, 1, 0] : 1,
        scale: stage === 'unlocking' ? [1, 2.5] : 1,
      }}
      transition={{ duration: stage === 'unlocking' ? 1.2 : 0.8, ease: "easeInOut" }}
      className="w-full max-w-2xl sm:max-w-3xl h-[560px] sm:h-[620px] rounded-[2.5rem] shadow-[0_0_80px_rgba(168,85,247,0.5)] border-4 border-amber-300/90 text-center flex flex-col items-center justify-center relative overflow-hidden select-none"
    >
      {/* 1. Background Layer (z-0) */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: 'url(/images/birthday/kids_fairytale/stage1/background.jpeg)' }}
      >
        <div className="absolute inset-0 bg-indigo-950/40 backdrop-blur-[1px]" />
      </div>

      {/* 2. Island Layer (z-10) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: stage !== 'curtain' ? 1 : 0,
          scale: stage !== 'curtain' ? 1 : 0.9,
        }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute bottom-0 left-0 right-0 z-10 flex items-end justify-center pointer-events-none"
      >
        <img 
          src="/images/birthday/kids_fairytale/stage1/island.png" 
          alt="Island" 
          className="w-auto h-auto max-w-[95%] sm:max-w-[85%] object-contain"
        />
      </motion.div>

      {/* 3. Castle Layer (z-20) */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: stage !== 'curtain' ? 1 : 0,
          scale: stage !== 'curtain' ? 1 : 0.9,
        }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center pointer-events-none"
      >
        <motion.div 
          animate={stage === 'unlocking' ? { scale: [1, 1.4], y: [0, -20] } : { y: [0, -8, 0] }}
          transition={stage === 'unlocking' ? { duration: 1.2 } : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="w-auto h-auto max-w-[260px] sm:max-w-[340px] opacity-95 drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
        >
          <img 
            src="/images/birthday/kids_fairytale/stage1/castle.png" 
            alt="Castle" 
            className="w-auto h-auto max-w-full object-contain"
          />
        </motion.div>
      </motion.div>

      {/* 4. Story Text & Child Name (z-30) */}
      <AnimatePresence>
        {stage !== 'curtain' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute top-16 sm:top-20 left-0 right-0 z-30 px-6 max-w-lg mx-auto flex flex-col items-center space-y-1 sm:space-y-2 pointer-events-none"
          >
            <span className="text-xs sm:text-sm uppercase tracking-[0.25em] bg-amber-400/90 text-indigo-950 px-4 py-1 rounded-full font-black shadow-lg">
              ✨ Приказна магия ✨
            </span>
            <h1 className="text-xl sm:text-2xl font-serif font-black text-amber-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] leading-tight">
              Имало едно време едно вълшебно царство...
            </h1>
            <div className="text-2xl sm:text-4xl font-serif font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-amber-200 drop-shadow-[0_4px_16px_rgba(251,191,36,0.8)] py-1">
              ✦ {childName} ✦
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Golden Key Interaction (z-40) */}
      <AnimatePresence>
        {stage !== 'curtain' && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.5 }}
            animate={{ 
              opacity: 1, 
              y: stage === 'unlocking' ? -120 : 0, 
              scale: stage === 'unlocking' ? 0.35 : 1,
              rotate: stage === 'unlocking' ? 15 : [0, 5, -5, 0],
            }}
            transition={
              stage === 'unlocking' 
                ? { duration: 1.1, ease: "easeInOut" }
                : { y: { duration: 0.8, delay: 0.5 }, rotate: { repeat: Infinity, duration: 3, ease: "easeInOut" }, scale: { duration: 0.8, delay: 0.5 } }
            }
            className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center cursor-pointer group"
            onClick={handleKeyClick}
          >
            <div className="absolute inset-0 rounded-full bg-amber-400/55 blur-2xl group-hover:bg-amber-300/80 transition-all duration-300 animate-pulse" />

            <motion.div
              whileHover={{ scale: 1.18, rotate: 10 }}
              whileTap={{ scale: 0.85 }}
              className="relative p-4 sm:p-5 bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 rounded-full shadow-[0_0_40px_rgba(251,191,36,0.9)] border-4 border-white flex items-center justify-center cursor-pointer"
            >
              <img 
                src="/images/birthday/kids_fairytale/stage1/key.png" 
                alt="Golden Key" 
                className="w-auto h-auto max-w-[56px] sm:max-w-[72px] object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
              />
              <Sparkles className="w-5 h-5 text-white absolute -top-1 -right-1 animate-ping" />
            </motion.div>

            <motion.div
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mt-3 bg-indigo-950/80 backdrop-blur-md px-4 py-1.5 rounded-2xl border border-amber-300/60 shadow-xl text-amber-200 text-xs sm:text-sm font-bold tracking-wide pointer-events-none"
            >
              🗝️ Докосни ключа, за да отключиш празника!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. Cloud Curtain Layers (z-50) */}
      <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden flex items-center justify-between">
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: stage !== 'curtain' ? '-100%' : 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-1/2 h-full relative flex items-center justify-end overflow-hidden"
        >
          <img 
            src="/images/birthday/kids_fairytale/stage1/cloude.png" 
            alt="Cloud curtain left" 
            className="w-auto h-auto max-w-none max-h-full object-contain opacity-95 filter brightness-105 drop-shadow-2xl"
          />
        </motion.div>

        <motion.div
          initial={{ x: 0 }}
          animate={{ x: stage !== 'curtain' ? '100%' : 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-1/2 h-full relative flex items-center justify-start overflow-hidden"
        >
          <img 
            src="/images/birthday/kids_fairytale/stage1/cloude.png" 
            alt="Cloud curtain right" 
            className="w-auto h-auto max-w-none max-h-full object-contain opacity-95 filter brightness-105 drop-shadow-2xl scale-x-[-1]"
          />
        </motion.div>
      </div>

      {/* 7. Climax Flash / Fade to White Effect (z-[60]) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: stage === 'unlocking' ? [0, 0.3, 1] : 0 }}
        transition={{ duration: 1.2, times: [0, 0.6, 1] }}
        className="absolute inset-0 z-[60] bg-gradient-to-tr from-amber-100 via-white to-yellow-200 pointer-events-none"
      />
    </motion.div>
  );
}
