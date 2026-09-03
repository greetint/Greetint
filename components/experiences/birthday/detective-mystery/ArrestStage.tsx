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
    <div 
      className="relative w-full h-full bg-[#0b0b0b] text-[#F7F4EF] font-mono flex flex-col items-center justify-center p-4 sm:p-6 select-none overflow-hidden"
      style={{ backgroundColor: '#0b0b0b' }}
    >
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

      <div className="absolute top-0 left-0 w-48 h-48 bg-red-600/15 rounded-full blur-3xl pointer-events-none animate-pulse z-10" />
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse z-10" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse z-10" style={{ animationDelay: '2s' }} />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.95),transparent_60%),radial-gradient(circle_at_top_right,rgba(0,0,0,0.95),transparent_60%),radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.95),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.95),transparent_60%)] pointer-events-none z-15" />

      {/* Authentic Yellow Police Tapes ("CRIME SCENE // DO NOT CROSS") */}
      {/* Tape 1: Diagonal top */}
      <div className="absolute -top-4 -left-20 right-[-100px] h-10 sm:h-12 bg-[#FACC15] text-black font-black uppercase text-xs sm:text-sm tracking-[0.3em] flex items-center justify-around shadow-[0_5px_25px_rgba(0,0,0,0.9)] z-30 transform -rotate-6 border-y-2 border-black overflow-hidden select-none pointer-events-none">
        <span className="whitespace-nowrap px-6">CRIME SCENE // DO NOT CROSS</span>
        <span className="whitespace-nowrap px-6">POLICE LINE // DO NOT CROSS</span>
        <span className="whitespace-nowrap px-6">CRIME SCENE // DO NOT CROSS</span>
        <span className="whitespace-nowrap px-6">POLICE LINE // DO NOT CROSS</span>
      </div>

      {/* Tape 2: Diagonal bottom */}
      <div className="absolute bottom-12 -left-20 right-[-100px] h-10 sm:h-12 bg-[#FACC15] text-black font-black uppercase text-xs sm:text-sm tracking-[0.3em] flex items-center justify-around shadow-[0_5px_25px_rgba(0,0,0,0.9)] z-30 transform rotate-6 border-y-2 border-black overflow-hidden select-none pointer-events-none">
        <span className="whitespace-nowrap px-6">RESTRICTED AREA // DO NOT CROSS</span>
        <span className="whitespace-nowrap px-6">CRIME SCENE // DO NOT CROSS</span>
        <span className="whitespace-nowrap px-6">RESTRICTED AREA // DO NOT CROSS</span>
        <span className="whitespace-nowrap px-6">CRIME SCENE // DO NOT CROSS</span>
      </div>

      {/* Tape 3: Top-right corner diagonal */}
      <div className="absolute -top-12 -right-32 w-[550px] bg-[#FACC15] text-black font-black uppercase text-xs tracking-[0.3em] py-2 transform rotate-45 z-30 shadow-[0_5px_25px_rgba(0,0,0,0.9)] border-y-2 border-black text-center pointer-events-none opacity-95 flex items-center justify-center gap-4">
        <span>CRIME SCENE</span>
        <span>//</span>
        <span>DO NOT CROSS</span>
      </div>

      {/* Tape 4: Bottom-left corner diagonal */}
      <div className="absolute -bottom-12 -left-32 w-[550px] bg-[#FACC15] text-black font-black uppercase text-xs tracking-[0.3em] py-2 transform rotate-45 z-30 shadow-[0_5px_25px_rgba(0,0,0,0.9)] border-y-2 border-black text-center pointer-events-none opacity-95 flex items-center justify-center gap-4">
        <span>RESTRICTED ZONE</span>
        <span>//</span>
        <span>DO NOT CROSS</span>
      </div>

      {/* Central Panel: "Secret File" / Dossier Style */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full bg-[#141311] border border-neutral-700/80 p-6 sm:p-10 rounded-2xl sm:rounded-r-2xl sm:rounded-bl-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(245,158,11,0.12)] text-center space-y-6 sm:space-y-8 relative z-40 backdrop-blur-md"
      >
        {/* Official Secret Folder Tab protruding from the top */}
        <div className="absolute -top-7 left-6 sm:left-10 bg-[#1c1a17] border-t border-l border-r border-neutral-700 px-5 py-1.5 rounded-t-xl text-amber-400 text-xs font-mono tracking-[0.25em] uppercase shadow-md flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>СЕКРЕТНО ДОСИЕ // REF #{age}</span>
        </div>

        {/* Top Minimalist Digital Status Marker (No Padlock!) */}
        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-neutral-400 uppercase tracking-widest font-mono">
            <span className="text-amber-500 font-bold">TERMINAL:</span> SECURE_NODE_01
          </div>
          <div className="text-[10px] sm:text-xs px-3 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold uppercase tracking-[0.2em]">
            TOP SECRET
          </div>
        </div>

        {/* Investigation Report / Message Box */}
        <div className="space-y-4 text-center bg-[#0d0c0b] p-6 sm:p-8 rounded-xl border border-neutral-800 shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(202, 42, 2, 0.05),transparent_70%)] pointer-events-none" />
          <div className="text-[10px] text-amber-500 font-bold uppercase tracking-[0.25em] mb-2">
            [ ФЕДЕРАЛНО УВЕДОМЛЕНИЕ ЗА РАЗСЛЕДВАНЕ ]
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-[#F7F4EF] font-mono tracking-wide">
            Рожденик е официално обявен за издирване по обвинение в подозрително добро настроение и прекалено много чар! Разследването започва сега! Натисни червения бутон за да разсекретиш файловете!
          </p>
        </div>

        {/* Subject Info */}
        <div className="flex items-center justify-center gap-4 text-xs text-neutral-400 font-mono">
          <span>СУБЕКТ: <strong className="text-white font-bold">{recipient}</strong></span>
          <span className="text-neutral-600">•</span>
          <span>КЛАСИФИКАЦИЯ: <strong className="text-amber-400 font-bold">RESTRICTED</strong></span>
        </div>

        {/* Action Button */}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleUnlock}
          className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-black py-4 sm:py-5 rounded-xl text-xs sm:text-sm uppercase tracking-[0.25em] font-black shadow-[0_10px_25px_rgba(245,158,11,0.3)] transition border-2 border-amber-400/80 cursor-pointer flex items-center justify-center gap-3 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span>[ РАЗКРИЙ ДОСИЕТО И ВЛЕЗ В ИГРИТЕ ]</span>
        </motion.button>
      </motion.div>
    </div>
  );
}

