'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speakBulgarian, playSoundEffect } from './utils/speech';

interface ArrestStageProps {
  recipient: string;
  age: string;
  isMuted?: boolean;
  onComplete: () => void;
}

export function ArrestStage({ recipient, age, isMuted = false, onComplete }: ArrestStageProps) {
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    if (isMuted) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    const warningText = `Внимание. Затворническата клетка е затворена за субект ${recipient}. Започнете федерално разследване.`;
    const cleanedText = warningText
      .replace(/FBI/g, 'Еф Би Ай')
      .replace(/TOP SECRET/g, 'Топ сикрет')
      .replace(/\/\//g, ', ')
      .replace(/\./g, '. ')
      .replace(/!/g, '! ');

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.lang = 'bg-BG';
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    const playVoice = () => {
      if (isMuted) return;
      const voices = window.speechSynthesis.getVoices();
      const bgVoice = voices.find(v => 
        v.lang.toLowerCase().includes('bg') || 
        v.lang.toLowerCase().includes('bulgarian') || 
        v.name.toLowerCase().includes('bg') || 
        v.name.toLowerCase().includes('bulgarian') || 
        v.name.toLowerCase().includes('български')
      );
      if (bgVoice) {
        utterance.voice = bgVoice;
      }
      window.speechSynthesis.speak(utterance);
    };

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      playVoice();
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        playVoice();
      };
      setTimeout(() => {
        if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending && !isMuted) {
          playVoice();
        }
      }, 250);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [recipient, isMuted]);

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
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/15 rounded-full blur-3xl pointer-events-none animate-pulse z-10" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-red-600/15 rounded-full blur-3xl pointer-events-none animate-pulse z-10" style={{ animationDelay: '1.5s' }} />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.95),transparent_60%),radial-gradient(circle_at_top_right,rgba(0,0,0,0.95),transparent_60%),radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.95),transparent_60%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.95),transparent_60%)] pointer-events-none z-15" />

      <div className="absolute inset-0 pointer-events-none z-20 flex justify-between px-2 sm:px-8 opacity-45">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="w-2 sm:w-4 h-full bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-950 shadow-[0_0_15px_rgba(0,0,0,0.9)] border-x border-neutral-600/30" />
        ))}
      </div>

      <div className="absolute top-4 left-0 right-0 h-8 sm:h-10 bg-amber-500 text-black font-extrabold uppercase text-xs sm:text-sm tracking-[0.25em] flex items-center justify-center shadow-2xl z-30 transform -rotate-1 border-y-2 border-black">
        ⚠️ FBI CAUTION // DO NOT CROSS // CLASSIFIED CELL ⚠️
      </div>

      <div className="absolute bottom-4 left-0 right-0 h-8 sm:h-10 bg-amber-500 text-black font-extrabold uppercase text-xs sm:text-sm tracking-[0.25em] flex items-center justify-center shadow-2xl z-30 transform rotate-1 border-y-2 border-black">
        🔒 RESTRICTED ZONE // PRISONER CONTAINMENT UNIT 🔒
      </div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl w-full bg-[#121110] border-2 border-red-700/80 p-6 sm:p-10 rounded-3xl shadow-[0_0_50px_rgba(185,28,28,0.3)] text-center space-y-6 sm:space-y-8 relative z-40 backdrop-blur-md"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 text-red-400 border border-red-500/40 text-[10px] sm:text-xs uppercase tracking-[0.3em] font-bold">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          ЗАТВОРНИЧЕСКА КЛЕТКА // СИСТЕМЕН АРЕСТ
        </div>

        <div className="space-y-4 text-left bg-black/60 p-5 sm:p-6 rounded-2xl border border-neutral-800 shadow-inner">
          <div className="text-[10px] text-red-500 font-bold uppercase tracking-widest">
            [ ДИСКРЕТЕН ФЕДЕРАЛЕН ДОКУМЕНТ ]
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-[#D4C5B9] font-mono tracking-wide">
            ЗАПОВЕД ЗА АРЕСТ // СУБЕКТЪТ Е ЗАТВОРЕН В КЛЕТКА №{age}. ПРИЧИНА: Прекалено голямо ниво на харизма и неразрешени празненства.
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 text-xs text-neutral-400">
          <span>СУБЕКТ: <strong className="text-white font-bold">{recipient}</strong></span>
          <span>•</span>
          <span>КЛЕТКА №: <strong className="text-red-400 font-bold">{age}</strong></span>
        </div>

        <motion.button 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleUnlock}
          className="w-full bg-gradient-to-r from-red-800 via-red-700 to-red-900 hover:from-red-700 hover:to-red-800 text-white py-4 sm:py-5 rounded-2xl text-xs sm:text-sm uppercase tracking-[0.25em] font-extrabold shadow-[0_10px_25px_rgba(185,28,28,0.5)] transition border-2 border-red-500/60 cursor-pointer flex items-center justify-center gap-3 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span>[ 🔓 РАЗБИЙ КЛЕТКАТА И ВЛЕЗ В ДОСИЕТО ]</span>
        </motion.button>
      </motion.div>
    </div>
  );
}



