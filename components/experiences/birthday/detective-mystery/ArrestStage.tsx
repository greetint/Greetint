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

      {/* Central Panel (Old Layout, now Red) */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full bg-[#0d0c0b] border-2 border-red-600/60 p-6 sm:p-10 rounded-3xl shadow-[0_0_70px_rgba(220,38,38,0.3)] text-center space-y-6 sm:space-y-8 relative z-40 backdrop-blur-md"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 text-red-400 border border-red-500/40 text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          [ СЕКРЕТНО ДОСИЕ // РАЗСЛЕДВАНЕ ]
        </div>

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-neutral-900 to-black border-2 border-red-500/60 flex items-center justify-center shadow-[inset_0_0_20px_rgba(220,38,38,0.3)] relative">
            <div className="absolute -top-2.5 w-8 h-5 rounded-t-full border-t-2 border-l-2 border-r-2 border-red-500/80" />
            <span className="text-3xl filter drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]">📁</span>
          </div>
          <div className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono">
            DIGITAL SECURE TERMINAL // ID: #{age}
          </div>
        </div>

        <div className="space-y-4 text-center bg-black/80 p-6 sm:p-8 rounded-2xl border border-red-900/40 shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.08),transparent_70%)] pointer-events-none" />
          <div className="text-[10px] text-red-500 font-bold uppercase tracking-widest mb-2">
            [ ФЕДЕРАЛНО УВЕДОМЛЕНИЕ ]
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-[#F7F4EF] font-mono tracking-wide">
            СУБЕКТЪТ Е ОФИЦИАЛНО ОБЯВЕН ЗА ИЗДИРВАНЕ ПО ОБВИНЕНИЕ В ПОДОЗРИТЕЛНО ДОБРО НАСТРОЕНИЕ И ПРЕКАЛЕНО МНОГО ЧАР! РАЗСЛЕДВАНЕТО ЗАПОЧВА СЕГА.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 text-xs text-neutral-400">
          <span>СУБЕКТ: <strong className="text-white font-bold">{recipient}</strong></span>
          <span>•</span>
          <span>НИВО: <strong className="text-red-400 font-bold">TOP SECRET</strong></span>
        </div>

        <motion.button 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleUnlock}
          className="w-full bg-gradient-to-r from-red-800 via-red-700 to-red-900 hover:from-red-700 hover:to-red-800 text-white py-4 sm:py-5 rounded-2xl text-xs sm:text-sm uppercase tracking-[0.25em] font-extrabold shadow-[0_10px_25px_rgba(185,28,28,0.5)] transition border-2 border-red-500/60 cursor-pointer flex items-center justify-center gap-3 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span>[ 🔓 РАЗКРИЙ ДОСИЕТО И ВЛЕЗ В ИГРИТЕ ]</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
