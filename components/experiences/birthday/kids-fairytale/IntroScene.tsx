'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface IntroSceneProps {
  childName: string;
  onOpen: () => void;
}

export function IntroScene({ childName, onOpen }: IntroSceneProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenBook = () => {
    setIsOpen(true);
    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  return (
    <div className="relative w-screen h-screen fixed inset-0 overflow-hidden bg-gradient-to-b from-[#1a0b2e] via-[#0f051d] to-black flex flex-col items-center justify-center text-white select-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-transparent to-black pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10 text-center px-4 mb-8"
      >
        <h1 className="font-serif italic text-3xl md:text-5xl lg:text-6xl text-amber-200 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] tracking-wide">
          Вълшебната приказка за {childName} започва...
        </h1>
      </motion.div>

      <div className="z-10 perspective-[1200px] cursor-pointer" onClick={handleOpenBook}>
        <motion.div
          animate={isOpen ? { rotateY: -110, scale: 1.1 } : { rotateY: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="relative w-64 md:w-80 h-80 md:h-96 bg-amber-900/90 rounded-r-2xl rounded-l-md shadow-[0_20px_50px_rgba(251,191,36,0.3)] border-4 border-amber-500/60 flex items-center justify-center p-6 transform-style-3d group"
        >
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-amber-950 rounded-l-md border-r-2 border-amber-600/50" />
          
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center shadow-[0_0_25px_rgba(251,191,36,0.6)] group-hover:scale-110 transition duration-300">
              <span className="text-4xl">📖</span>
            </div>
            <p className="font-serif italic text-lg md:text-xl text-amber-100 font-bold drop-shadow-md animate-pulse">
              Докосни книгата, за да я отвориш ✨
            </p>
          </div>

          <div className="absolute inset-0 rounded-r-2xl bg-amber-400/10 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none" />
        </motion.div>
      </div>
    </div>
  );
}
