'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { speakBulgarian, playSoundEffect } from './utils/speech';
import { motion } from 'framer-motion';

interface SuspectRecordProps {
  recipient: string;
  age: string;
  suspectProfile?: {
    alias: string;
    mainCrime: string;
    distinguishingMark: string;
    lastSeen: string;
    specialSkill: string;
  };
  secretPassword?: string;
  charges?: string[];
  isMuted?: boolean;
  onComplete: () => void;
}

export function SuspectRecordStage({ 
  recipient, 
  age, 
  suspectProfile, 
  secretPassword = 'кафе', 
  charges, 
  isMuted = false, 
  onComplete 
}: SuspectRecordProps) {
  const [mouseScreen, setMouseScreen] = useState({ x: -1000, y: -1000 });
  const [isInside, setIsInside] = useState(false);
  const [revealedItems, setRevealedItems] = useState<{ [key: string]: boolean }>({});
  const redactedRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const profile = suspectProfile || {
    alias: 'Шеф на купона',
    mainCrime: charges?.[0] || 'Превишена скорост на празнуване',
    distinguishingMark: charges?.[1] || 'Заразно добро настроение',
    lastSeen: 'На дансинга в петък вечер',
    specialSkill: charges?.[2] || 'Неоторизирано ядене на торта'
  };

  const secretPassVal = secretPassword || 'кафе';

  const dossierFields = [
    { key: 'alias', label: '[ КОДОВО ИМЕ / АЛИАС ]', value: profile.alias, note: 'Важна улика за Стейдж 5' },
    { key: 'age', label: '[ ВЪЗРАСТ НА СУБЕКТА ]', value: age, note: 'Ключ за радио честотата в Стейдж 4' },
    { key: 'mainCrime', label: '[ ГЛАВНО ПРЕСТЪПЛЕНИЕ ]', value: profile.mainCrime, note: 'Улика за корковото табло' },
    { key: 'distinguishingMark', label: '[ ОТЛИЧИТЕЛЕН БЕЛЕГ ]', value: profile.distinguishingMark, note: 'Улика за корковото табло' },
    { key: 'lastSeen', label: '[ ПОСЛЕДНО ЗАБЕЛЯЗАН ]', value: profile.lastSeen, note: 'Улика за корковото табло' },
    { key: 'secretPassword', label: '[ СЕКРЕТНА ПАРОЛА ]', value: secretPassVal, note: 'Ключ за верификационния терминал в Стейдж 4' },
  ];

  useEffect(() => {
    const text = 'Заподозрян разпознат. Преглед на официалното секретно досие. Използвайте лазерния фенер, за да разсекретите цензурираните данни за следващите етапи.';
    speakBulgarian(text, isMuted, 0.92, 1.0);

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isMuted]);

  const handlePointerMove = useCallback((clientX: number, clientY: number) => {
    setMouseScreen({ x: clientX, y: clientY });
    setIsInside(true);

    const newRevealed: { [key: string]: boolean } = {};
    Object.entries(redactedRefs.current).forEach(([key, el]) => {
      if (el) {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const distance = Math.hypot(clientX - cx, clientY - cy);
        if (distance < 95) {
          newRevealed[key] = true;
          playSoundEffect('/audio/detective/typewriter.mp3', isMuted, 0.15);
        }
      }
    });

    if (Object.keys(newRevealed).length > 0) {
      setRevealedItems(prev => ({ ...prev, ...newRevealed }));
    }
  }, [isMuted]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    handlePointerMove(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseEnter={() => setIsInside(true)}
      onMouseLeave={() => setIsInside(false)}
      className="relative w-full h-full bg-[#0d0c0a] text-[#1F1A17] font-mono flex flex-col items-center justify-center p-4 sm:p-6 select-none overflow-y-auto cursor-crosshair"
    >
      {isInside && (
        <>
          <div 
            className="pointer-events-none w-56 h-56 rounded-full blur-2xl bg-red-600/35 z-50 fixed -translate-x-1/2 -translate-y-1/2 transition-all duration-75 ease-out mix-blend-screen"
            style={{ left: mouseScreen.x, top: mouseScreen.y }}
          />
          <div 
            className="pointer-events-none w-4 h-4 rounded-full bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.9)] z-55 fixed -translate-x-1/2 -translate-y-1/2 border border-white/80"
            style={{ left: mouseScreen.x, top: mouseScreen.y }}
          />
        </>
      )}

      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 max-w-2xl w-full bg-[#EAE3D2] border-4 border-[#C2B59B] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-6 sm:p-8 space-y-6 my-auto overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(#d6ccb4 0.75px, transparent 0.75px)',
          backgroundSize: '16px 16px'
        }}
      >
        <div className="absolute -top-3 left-8 bg-[#C2B59B] text-[#1F1A17] px-4 py-1 rounded-t-lg text-[10px] font-black uppercase tracking-[0.25em] border-t-2 border-x-2 border-[#A89A80] shadow-sm">
          MANILA FILE // TOP SECRET // EYES ONLY
        </div>

        <div className="absolute top-4 right-6 border-2 border-red-700/60 text-red-700 px-3 py-1 rounded font-black text-[11px] uppercase tracking-[0.3em] transform rotate-3 bg-red-950/10 shadow-sm pointer-events-none">
          TOP SECRET // CONFIDENTIAL
        </div>

        <div className="border-b-2 border-black/30 pb-4 pt-2">
          <span className="text-[10px] uppercase tracking-widest text-red-700 font-extrabold block">ФЕДЕРАЛНО ДОСИЕ НА СУБЕКТА</span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wide text-black mt-1">{recipient}</h2>
          <p className="text-[11px] text-neutral-600 mt-1 italic">
            Инструкция: Преминете с лазерния фенер върху черните цензурирани ленти, за да разкриете секретните ключови данни.
          </p>
        </div>

        <div className="space-y-3.5">
          <div className="flex justify-between items-center text-xs uppercase font-extrabold tracking-wider text-black/80 px-1">
            <span>ОФИЦИАЛНИ ДАННИ И УЛИКИ:</span>
            <span className="text-[10px] text-red-700 animate-pulse">[ 🔦 ОСВЕТЕТЕ С ФЕНЕРА ]</span>
          </div>

          <div className="space-y-3">
            {dossierFields.map((field) => {
              const isRevealed = revealedItems[field.key];
              return (
                <div 
                  key={field.key}
                  className="bg-[#F5F1E8] border-2 border-black/40 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-inner relative"
                >
                  <div className="text-xs font-black text-red-800 tracking-wider">
                    {field.label}:
                  </div>

                  <div className="flex items-center gap-3">
                    <div 
                      ref={el => { redactedRefs.current[field.key] = el; }}
                      className="relative px-3 py-1 rounded overflow-hidden min-w-[140px] text-center"
                    >
                      <span className={`text-xs font-black font-mono tracking-widest uppercase transition-colors duration-300 ${isRevealed ? 'text-red-600' : 'text-transparent select-none'}`}>
                        {field.value}
                      </span>

                      <div 
                        className={`absolute inset-0 bg-black transition-opacity duration-300 rounded flex items-center justify-center ${isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                      >
                        <span className="text-[10px] text-neutral-400 font-mono tracking-[0.15em] select-none font-bold">
                          [ REDACTED ]
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] text-neutral-500 hidden sm:inline-block max-w-[160px] truncate">
                      ({field.note})
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-red-950/10 border-2 border-red-700/50 p-4 rounded-xl text-xs text-red-900 font-mono font-bold shadow-inner">
          <span className="text-red-700 font-black">ПРИСЪДА:</span> НАВЪРШВАНЕ НА {age} ГОДИНИ ПРИ СТРОГО ЗАТВОРНИЧЕСКИ РЕЖИМ НА КУПОН, НЕОГРАНИЧЕНИ ПРАЗНЕНСТВА И ЗАДЪЛЖИТЕЛНИ УСМИВКИ.
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onComplete}
          className="w-full bg-[#1A1816] hover:bg-black text-[#F7F4EF] py-4 rounded-xl text-xs uppercase tracking-[0.25em] font-black shadow-lg transition cursor-pointer border border-neutral-700 flex items-center justify-center gap-3 group"
        >
          <span>[ ПРЕМИН КЪМ ДЕТЕКТОРА НА ЛЪЖАТА ]</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
