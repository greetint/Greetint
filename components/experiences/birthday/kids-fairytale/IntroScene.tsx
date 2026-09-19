'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VideoPreloader } from './VideoPreloader';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface IntroSceneProps {
  childName: string;
  deviceType: 'desktop' | 'phone';
  onOpen: () => void;
}

export function IntroScene({ childName, deviceType, onOpen }: IntroSceneProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const firstStageVideoSrc = `/videos/birthday/kids-fairytale/stage_1/stage1_part1_${deviceType}.mp4`;

  const handleOpenBook = () => {
    setIsOpen(true);
    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  return (
    <div className="relative w-screen h-screen fixed inset-0 overflow-hidden bg-gradient-to-br from-pink-100 via-amber-50 to-purple-100 flex flex-col items-center justify-center text-[#2c1810] select-none">
      {/* Warm the cache for stage 1's opening clip while the child reads the intro. */}
      <VideoPreloader src={firstStageVideoSrc} />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-amber-200/40 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10 text-center px-4 mb-8"
      >
        <h1 className="font-serif italic text-3xl md:text-5xl lg:text-6xl text-amber-900 drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)] tracking-wide">
          {t('kidsFairytale.intro.title', { childName })}
        </h1>
      </motion.div>

      <div className="z-10 perspective-[1400px] cursor-pointer" onClick={handleOpenBook}>
        <motion.div
          animate={isOpen ? { rotateY: -110, scale: 1.05 } : { rotateY: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="relative w-72 md:w-96 h-88 md:h-[420px] bg-[#fefae0] rounded-r-3xl rounded-l-md shadow-[0_25px_60px_rgba(180,83,9,0.25)] border-8 border-amber-400 flex items-center justify-center p-8 transform-style-3d group"
        >
          <div className="absolute left-0 top-0 bottom-0 w-10 bg-amber-700 rounded-l-md border-r-4 border-amber-500 shadow-inner flex items-center justify-center">
            <div className="w-2 h-full bg-amber-800/40" />
          </div>

          <div className="absolute -top-4 right-12 w-6 h-16 bg-amber-500 rounded-b-md shadow-md border border-amber-300" />

          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-amber-100 border-4 border-amber-400 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.6)] group-hover:scale-110 transition duration-300">
              <span className="text-5xl">👑</span>
            </div>
            <div className="space-y-2">
              <h2 className="font-serif italic text-2xl md:text-3xl text-amber-950 font-bold">
                {t('kidsFairytale.intro.bookTitle')}
              </h2>
              <p className="font-serif italic text-base md:text-lg text-amber-800 font-semibold animate-pulse">
                {t('kidsFairytale.intro.bookPrompt')}
              </p>
            </div>
          </div>

          <div className="absolute inset-0 rounded-r-3xl bg-amber-300/15 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />
        </motion.div>
      </div>
    </div>
  );
}
