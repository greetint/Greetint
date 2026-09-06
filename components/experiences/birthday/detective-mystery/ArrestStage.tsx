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

      {/* Central Panel: Police Mugshot ID Board Style */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-40 max-w-xl w-full bg-[#e3ded1] text-black border-4 border-black p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] text-center space-y-6 font-mono relative overflow-hidden"
      >
        {/* Vintage Paper Texture Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] opacity-5 pointer-events-none" />

        {/* Top Mugshot Header */}
        <div className="bg-black text-[#e3ded1] py-2 px-4 flex items-center justify-between text-xs font-black tracking-[0.25em] uppercase border-b-2 border-black">
          <span>POLICE DEPT. // MUGSHOT ID</span>
          <span>CASE #{age}</span>
        </div>

        {/* Serial Number & Status Bar */}
        <div className="flex items-center justify-between text-[11px] font-bold border-b border-black/30 pb-3">
          <span className="bg-black text-white px-2 py-0.5 uppercase">ID: {recipient}</span>
          <span className="tracking-widest">DATE: 2026.03.09</span>
          <span className="bg-black text-white px-2 py-0.5">STATUS: WANTED</span>
        </div>

        {/* Main Mugshot Text Box */}
        <div className="bg-[#f2efe9] border-2 border-black p-5 text-left shadow-inner">
          <p className="text-xs sm:text-sm leading-relaxed text-black font-mono font-black tracking-wide uppercase">
            {recipient.toUpperCase()} Е ОФИЦИАЛНО ОБЯВЕН ЗА ИЗДИРВАНЕ ПО ОБВИНЕНИЕ В ПОДОЗРИТЕЛНО ДОБРО НАСТРОЕНИЕ И ПРЕКАЛЕНО МНОГО ЧАР! РАЗСЛЕДВАНЕТО ЗАПОЧВА СЕГА. НАТИСНИ ЧЕРВЕНИЯ БУТОН ЗА ДА РАЗСЕКРЕТИШ ФАЙЛОВЕТЕ!
          </p>
        </div>

        {/* Subject Info footer */}
        <div className="text-xs font-bold tracking-widest text-black/80 uppercase">
          SUSPECT: <strong className="underline">{recipient}</strong> // CHARGE: MAXIMUM CHARM
        </div>

        {/* Red Vintage Mugshot Action Button */}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleUnlock}
          className="w-full bg-red-700 hover:bg-red-800 text-white py-4 sm:py-5 uppercase tracking-[0.25em] font-black shadow-[0_4px_0_#000] transition border-2 border-black cursor-pointer flex items-center justify-center gap-3 relative overflow-hidden group"
        >
          <span>[ 🔓 РАЗКРИЙ ДОСИЕТО И ВЛЕЗ В ИГРИТЕ ]</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
