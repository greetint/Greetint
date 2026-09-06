'use client';

import React, { useState, useEffect } from 'react';
import { speakBulgarian } from './utils/speech';
import { motion } from 'framer-motion';

interface SuspectRecordProps {
  recipient: string;
  age: string;
  charges: string[];
  isMuted?: boolean;
  onComplete: () => void;
}

export function SuspectRecordStage({ recipient, age, charges, isMuted = false, onComplete }: SuspectRecordProps) {
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });
  const [isInside, setIsInside] = useState(false);
  const [revealedItems, setRevealedItems] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    const text = `Заподозрян разпознат. Преглед на официалните обвинения и престъпления за изминалата година. Започнете разследване.`;
    speakBulgarian(text, isMuted, 0.92, 1.0);

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isMuted]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsInside(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePos({
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      });
      setIsInside(true);
    }
  };

  const toggleReveal = (idx: number) => {
    setRevealedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseEnter={() => setIsInside(true)}
      onMouseLeave={() => setIsInside(false)}
      className="relative w-full h-full bg-[#0b0b0b] text-[#F7F4EF] font-mono flex flex-col items-center justify-center p-4 sm:p-6 select-none overflow-y-auto cursor-crosshair"
    >
      {/* Laser / Flashlight Spotlight beam */}
      {isInside && (
        <>
          <div 
            className="absolute pointer-events-none w-96 h-96 rounded-full blur-2xl bg-red-600/15 z-30 transition-all duration-75 ease-out mix-blend-screen"
            style={{
              left: mousePos.x - 192,
              top: mousePos.y - 192,
              boxShadow: '0 0 80px 30px rgba(220, 38, 38, 0.25)'
            }}
          />
          <div 
            className="absolute pointer-events-none w-3 h-3 rounded-full bg-red-500 shadow-[0_0_25px_12px_rgba(239,68,68,0.9)] z-40"
            style={{
              left: mousePos.x - 6,
              top: mousePos.y - 6,
            }}
          />
        </>
      )}

      {/* Dark Ambient Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.2),rgba(0,0,0,0.95)_85%)] pointer-events-none z-10" />

      {/* Classified Folder Container */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-20 max-w-xl w-full bg-[#d4c39f] text-[#1a1816] p-6 sm:p-10 shadow-[0_30px_70px_rgba(0,0,0,0.9)] rounded-r-2xl rounded-bl-2xl space-y-6 border-t-8 border-[#c3b087] font-mono"
      >
        {/* Folder Tab */}
        <div className="absolute -top-7 left-6 sm:left-10 bg-[#d4c39f] border-t border-l border-r border-[#c3b087] px-6 py-1.5 rounded-t-xl text-red-700 text-xs font-black tracking-[0.25em] uppercase shadow-md flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
          <span>[ CLASSIFIED FILE ]</span>
        </div>

        {/* Red Ink Stamps */}
        <div className="absolute top-6 right-6 border-4 border-red-700 text-red-700 px-3 py-1 font-black text-xs uppercase tracking-[0.25em] transform rotate-12 pointer-events-none opacity-80 shadow-sm">
          TOP SECRET
        </div>

        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-black/30 pb-4 pt-2">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-red-700 font-extrabold block">ФЕДЕРАЛНО ДОСИЕ НА СУБЕКТА</span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wide text-black mt-1">{recipient}</h2>
          </div>
          <div className="bg-red-700 text-white px-3 py-1.5 rounded text-xs font-black uppercase tracking-wider shadow">
            ВЪЗРАСТ: {age}
          </div>
        </div>

        {/* Charges List with Redaction / Laser reveal effect */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase font-extrabold tracking-widest text-black/80 flex items-center justify-between">
            <span>РЕГИСТРИРАНИ ПРЕСТЪПЛЕНИЯ:</span>
            <span className="text-[10px] text-red-700">(Мини с лазера / кликни за разсекретяване)</span>
          </h3>
          <ul className="space-y-2.5">
            {charges.map((charge, idx) => {
              const isRevealed = revealedItems[idx];
              return (
                <li 
                  key={idx} 
                  onClick={() => toggleReveal(idx)}
                  className="bg-[#c3b087]/60 hover:bg-[#c3b087] p-3.5 rounded-lg border border-black/20 text-xs text-black flex items-start gap-3 shadow-inner cursor-pointer transition group relative overflow-hidden"
                >
                  <span className="text-red-700 font-black">#{idx + 1}</span>
                  <div className="flex-1 font-mono font-bold">
                    <span className={`${isRevealed ? 'text-black' : 'text-black/90'}`}>
                      {charge}
                    </span>
                    {!isRevealed && (
                      <span className="ml-2 inline-block bg-black text-black px-1.5 py-0.5 rounded text-[10px] group-hover:bg-red-700 group-hover:text-white transition-colors">
                        [ЦЕНЗУРИРАНО]
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Verdict Box */}
        <div className="bg-red-950/10 border-2 border-red-700/40 p-4 rounded-xl text-xs text-red-900 font-mono font-bold italic shadow-inner">
          „ПРИСЪДА: НАВЪРШВАНЕ НА {age} ГОДИНИ ПРИ СТРОГО ЗАТВОРНИЧЕСКИ РЕЖИМ НА КУПОН И НЕОГРАНИЧЕНИ ПРАЗНЕНСТВА.“
        </div>

        {/* Action Button */}
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onComplete}
          className="w-full bg-[#1a1816] hover:bg-black text-[#F7F4EF] py-4 rounded-xl text-xs uppercase tracking-[0.25em] font-black shadow-lg transition cursor-pointer border border-neutral-700 flex items-center justify-center gap-2"
        >
          <span>[ ПРОДЪЛЖИ КЪМ ДИГИТАЛНАТА ЛУПА ]</span>
          <span>→</span>
        </motion.button>
      </motion.div>
    </div>
  );
}


