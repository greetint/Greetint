'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSoundEffect } from './utils/speech';

interface ArrestStageProps {
  recipient: string;
  age: string;
  isMuted?: boolean;
  onComplete: () => void;
}

export function ArrestStage({ recipient, age, isMuted = false, onComplete }: ArrestStageProps) {
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    playSoundEffect('/audio/detective/stage1-arrest.mp3', isMuted, 0.85);
  }, [isMuted]);

  const handleUnlock = () => {
    playSoundEffect('/audio/detective/door-creak.mp3', isMuted, 0.85);
    setIsFlashing(true);
    setTimeout(() => onComplete(), 900);
  };

  return (
    <div className="relative w-full h-full bg-[#0b0b0b] text-[#F7F4EF] font-mono flex flex-col items-center justify-center p-4 sm:p-6 select-none overflow-hidden">
      <AnimatePresence>
        {isFlashing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0, 0.8, 0] }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 z-50 pointer-events-none bg-gradient-to-r from-red-600/70 via-blue-600/70 to-red-600/70 mix-blend-screen"
          />
        )}
      </AnimatePresence>

      {/* Prison Bars Overlay */}
      <div className="absolute inset-0 z-20 flex justify-between px-2 sm:px-8 opacity-40 pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="w-3 h-full bg-gradient-to-r from-black via-neutral-700 to-black shadow-[0_0_15px_rgba(0,0,0,0.9)]" />
        ))}
      </div>

      {/* Multiple Yellow Police Tapes */}
      <div className="absolute -top-4 -left-20 right-[-100px] h-10 bg-[#FACC15] text-black font-black uppercase tracking-[0.3em] flex items-center justify-around shadow-lg z-30 transform -rotate-6 border-y-2 border-black overflow-hidden pointer-events-none">
        <span className="whitespace-nowrap px-6">CRIME SCENE // DO NOT CROSS</span>
        <span className="whitespace-nowrap px-6">POLICE LINE // DO NOT CROSS</span>
      </div>

      <div className="absolute bottom-12 -left-20 right-[-100px] h-10 bg-[#FACC15] text-black font-black uppercase tracking-[0.3em] flex items-center justify-around shadow-lg z-30 transform rotate-6 border-y-2 border-black overflow-hidden pointer-events-none">
        <span className="whitespace-nowrap px-6">RESTRICTED AREA // DO NOT CROSS</span>
        <span className="whitespace-nowrap px-6">CRIME SCENE // DO NOT CROSS</span>
      </div>

      <div className="absolute -top-12 -right-32 w-[550px] bg-[#FACC15] text-black font-black uppercase tracking-[0.3em] py-2 transform rotate-45 z-30 shadow-lg border-y-2 border-black text-center pointer-events-none opacity-95 flex items-center justify-center gap-4">
        <span>CRIME SCENE</span>
        <span>//</span>
        <span>DO NOT CROSS</span>
      </div>

      <div className="absolute -bottom-12 -left-32 w-[550px] bg-[#FACC15] text-black font-black uppercase tracking-[0.3em] py-2 transform rotate-45 z-30 shadow-lg border-y-2 border-black text-center pointer-events-none opacity-95 flex items-center justify-center gap-4">
        <span>RESTRICTED ZONE</span>
        <span>//</span>
        <span>DO NOT CROSS</span>
      </div>

      {/* Central Panel: Manila Folder with Classified Tab */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-40 max-w-xl w-full bg-[#d4c39f] p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center space-y-6 sm:space-y-8 border-t-8 border-[#c3b087]"
      >
        {/* Tab */}
        <div className="absolute -top-7 left-6 w-32 h-7 bg-[#d4c39f] rounded-t-lg flex items-center justify-center border-t border-l border-r border-[#c3b087]">
            <span className="text-[10px] text-red-700 font-black uppercase tracking-widest">[ CLASSIFIED ]</span>
        </div>
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/20 text-red-700 border border-red-500/40 text-[10px] sm:text-xs uppercase tracking-[0.3em] font-black">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          [ СЕКРЕТНО ДОСИЕ // РАЗСЛЕДВАНЕ ]
        </div>

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-20 h-20 rounded-lg bg-[#c3b087] border-2 border-red-700 flex items-center justify-center shadow-inner relative">
            <span className="text-3xl text-red-900">📁</span>
          </div>
          <div className="text-[10px] text-red-900 uppercase tracking-widest font-mono font-bold">
            DIGITAL SECURE TERMINAL // ID: #{age}
          </div>
        </div>

        <div className="space-y-4 text-center bg-[#c3b087]/50 p-6 sm:p-8 rounded border border-red-900/30 shadow-inner relative overflow-hidden">
          <div className="text-[10px] text-red-700 font-bold uppercase tracking-widest mb-2">
            [ ФЕДЕРАЛНО УВЕДОМЛЕНИЕ ]
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-black font-mono font-bold tracking-wide">
            СУБЕКТЪТ Е ОФИЦИАЛНО ОБЯВЕН ЗА ИЗДИРВАНЕ ПО ОБВИНЕНИЕ В ПОДОЗРИТЕЛНО ДОБРО НАСТРОЕНИЕ И ПРЕКАЛЕНО МНОГО ЧАР! РАЗСЛЕДВАНЕТО ЗАПОЧВА СЕГА.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 text-xs text-red-900 font-bold uppercase">
          <span>СУБЕКТ: {recipient}</span>
          <span>•</span>
          <span>КЛАСИФИКАЦИЯ: TOP SECRET</span>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleUnlock}
          className="w-full bg-red-700 hover:bg-red-800 text-white py-4 sm:py-5 rounded-none text-xs sm:text-sm uppercase tracking-[0.25em] font-black shadow-lg transition border-2 border-red-900 cursor-pointer flex items-center justify-center gap-3 relative overflow-hidden group"
        >
          <span>[ 🔓 РАЗКРИЙ ДОСИЕТО ]</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
