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

      {/* Yellow Police Tapes */}
      <div className="absolute -top-4 -left-20 right-[-100px] h-10 bg-[#FACC15] text-black font-black uppercase tracking-[0.3em] flex items-center justify-around shadow-lg z-30 transform -rotate-6 border-y-2 border-black overflow-hidden pointer-events-none">
        <span className="whitespace-nowrap px-6">CRIME SCENE // DO NOT CROSS</span>
      </div>

      {/* Central "Manila Folder" Panel */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full bg-[#2a2723] border-2 border-neutral-700 p-8 rounded-tr-3xl rounded-br-3xl rounded-bl-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center space-y-6 relative z-40"
      >
        {/* Folder Tab */}
        <div className="absolute -top-7 left-0 bg-[#3a3733] border-t border-l border-r border-neutral-700 px-6 py-2 rounded-t-lg text-red-500 text-xs font-bold tracking-[0.2em] uppercase shadow-md">
          [ CLASSIFIED FILE ]
        </div>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-red-900/50 pb-4">
          <div className="text-red-500 font-bold uppercase tracking-widest text-xs">TERMINAL: SECURE_NODE_01</div>
          <div className="text-red-500 font-bold uppercase tracking-widest text-xs border border-red-500/50 px-2 py-0.5">TOP SECRET</div>
        </div>

        {/* Content */}
        <div className="bg-[#1f1d1a] p-6 rounded border border-red-900/30">
          <p className="text-sm leading-relaxed text-[#F7F4EF] font-bold tracking-wide text-left uppercase">
            {recipient.toUpperCase()} Е ОФИЦИАЛНО ОБЯВЕН ЗА ИЗДИРВАНЕ ПО ОБВИНЕНИЕ В ПОДОЗРИТЕЛНО ДОБРО НАСТРОЕНИЕ И ПРЕКАЛЕНО МНОГО ЧАР! РАЗСЛЕДВАНЕТО ЗАПОЧВА СЕГА! НАТИСНИ ЧЕРВЕНИЯ БУТОН ЗА ДА РАЗСЕКРЕТИШ ФАЙЛОВЕТЕ!
          </p>
        </div>

        {/* Info */}
        <div className="flex items-center justify-center gap-4 text-xs text-red-500 font-bold uppercase">
          <span>СУБЕКТ: {recipient.toUpperCase()}</span>
          <span>•</span>
          <span>КЛАСИФИКАЦИЯ: RESTRICTED</span>
        </div>

        {/* Action Button */}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleUnlock}
          className="w-full bg-red-800 hover:bg-red-700 text-white py-4 rounded-none uppercase tracking-[0.2em] font-black shadow-lg transition border-2 border-red-500"
        >
          [ РАЗКРИЙ ДОСИЕТО ]
        </motion.button>
      </motion.div>
    </div>
  );
}
