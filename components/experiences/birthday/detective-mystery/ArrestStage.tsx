'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  const voiceAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = voiceAudioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.pause();
      audio.currentTime = 0;
    } else {
      audio.currentTime = 0;
      audio.play().catch((e) => console.log("Voice audio play blocked:", e));
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [isMuted]);

  const handleUnlock = () => {
    playSoundEffect('/audio/detective/door-creak.mp3', isMuted, 0.85);
    setIsFlashing(true);
    setTimeout(() => onComplete(), 900);
  };

  return (
    <div className="relative w-full h-full bg-[#0b0b0b] text-[#F7F4EF] font-mono flex flex-col items-center justify-center p-4 sm:p-6 select-none overflow-hidden">
      {/* Voice Audio Element strictly from /audio/detective/voice_stage_1.mp3 */}
      <audio ref={voiceAudioRef} src="/audio/detective/voice_stage_1.mp3" preload="auto" />

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

      {/* Central Panel: Black Prison Mugshot Board Style */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-40 max-w-xl w-full bg-[#121212] text-white border-4 border-black p-6 sm:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.95)] text-center space-y-6 font-mono relative overflow-hidden"
      >
        {/* Top Header: Realistic Police Dept Mugshot Header */}
        <div className="bg-black border-2 border-white p-3 text-left relative shadow">
          <div className="flex items-center justify-between border-b-2 border-white pb-2 mb-2">
            <span className="text-lg sm:text-xl font-black tracking-[0.25em] uppercase text-white">
              POLICE DEPT. // CITY OF MYSTERY
            </span>
            <span className="text-[10px] bg-white text-black font-extrabold px-2 py-0.5 uppercase tracking-widest">
              BOOKING #{age}026
            </span>
          </div>
          <div className="text-xs font-mono tracking-widest text-neutral-300 uppercase">
            SUSPECT NAME: <span className="text-white font-extrabold">{recipient.toUpperCase()}</span>
          </div>
        </div>

        {/* Middle Text Section (Exact neutral text without extra names) */}
        <div className="bg-neutral-900 border-2 border-neutral-700 p-5 text-left shadow-inner">
          <p className="text-xs sm:text-sm leading-relaxed text-[#F7F4EF] font-mono font-bold tracking-wide">
            Класифицирано досие. Обектът е под наблюдение. Всички улики са събрани, но делото остава неразкрито. Натиснете червения бутон, за да отворите архива и да започнете разследването.
          </p>
        </div>

        {/* Bottom Section: Two White Boxes (ID NO. and DATE) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white text-black p-3 text-center border-2 border-black font-black uppercase text-xs sm:text-sm tracking-widest shadow">
            <div className="text-[9px] text-neutral-600 font-bold">ID NO.</div>
            <div>[ {age} ] {recipient.toUpperCase()}</div>
          </div>
          <div className="bg-white text-black p-3 text-center border-2 border-black font-black uppercase text-xs sm:text-sm tracking-widest shadow">
            <div className="text-[9px] text-neutral-600 font-bold">DATE</div>
            <div>2026.03.09</div>
          </div>
        </div>

        {/* Action Button embedded in board (Dynamic name from data.recipient) */}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleUnlock}
          className="w-full max-w-sm mx-auto bg-red-700 hover:bg-red-800 text-white py-2.5 sm:py-3 px-4 uppercase tracking-[0.15em] text-[10px] sm:text-xs font-black shadow-[0_3px_0_#000] transition border-2 border-black cursor-pointer flex items-center justify-center gap-2 relative overflow-hidden group"
        >
          <span>[ 🔓 РАЗКРИЙ ДОСИЕТО НА {recipient.toUpperCase()} ]</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
