'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { playSoundEffect } from './utils/speech';
import { motion, AnimatePresence } from 'framer-motion';

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
  evidenceAnswers?: string[];
  evidenceItems?: { fileUrl: string; clue: string; answer: string }[];
  charges?: string[];
  isMuted?: boolean;
  onComplete: () => void;
}

export function SuspectRecordStage({ 
  recipient, 
  age, 
  suspectProfile, 
  secretPassword = 'кафе', 
  evidenceAnswers,
  evidenceItems,
  charges, 
  isMuted = false, 
  onComplete 
}: SuspectRecordProps) {
  const [currentPage, setCurrentPage] = useState<1 | 2 | 3>(1);
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

  const defaultAnswers = [
    profile.alias || 'Шеф на купона',
    profile.mainCrime || 'Превишена скорост на празнуване',
    profile.distinguishingMark || 'Заразно добро настроение',
    profile.lastSeen || 'На дансинга в петък вечер',
    profile.specialSkill || 'Неоторизирано ядене на торта'
  ];

  const answers = evidenceAnswers?.length ? evidenceAnswers : (evidenceItems?.length ? evidenceItems.map(item => item.answer) : defaultAnswers);
  const secretPassVal = secretPassword || 'кафе';

  const page1Fields = [
    { key: 'alias', label: '[ КОДОВО ИМЕ / АЛИАС ]', value: profile.alias, note: 'Важна улика за Стейдж 5' },
    { key: 'age', label: '[ ВЪЗРАСТ НА СУБЕКТА ]', value: age, note: 'Ключ за радио честотата в Стейдж 4' },
    { key: 'secretPassword', label: '[ СЕКРЕТНА ПАРОЛА ]', value: secretPassVal, note: 'Ключ за верификационния терминал в Стейдж 4' },
  ];

  const page2Fields = [
    { key: 'mainCrime', label: '[ ГЛАВНО ПРЕСТЪПЛЕНИЕ ]', value: profile.mainCrime, note: 'Улика за корковото табло' },
    { key: 'distinguishingMark', label: '[ ОТЛИЧИТЕЛЕН БЕЛЕГ ]', value: profile.distinguishingMark, note: 'Улика за корковото табло' },
    { key: 'lastSeen', label: '[ ПОСЛЕДНО ЗАБЕЛЯЗАН ]', value: profile.lastSeen, note: 'Улика за корковото табло' },
    { key: 'specialSkill', label: '[ СПЕЦИАЛНО УМЕНИЕ ]', value: profile.specialSkill, note: 'Улика за корковото табло' },
  ];

  const page3Fields = answers.map((ans, idx) => ({
    key: `ev${idx}`,
    label: `[ ДОКАЗАТЕЛСТВО №${idx + 1} ]`,
    value: ans,
    note: 'Факт за корковото табло (Стейдж 5)'
  }));

  useEffect(() => {
    // No speech
  }, [isMuted]);

  const handlePointerMove = useCallback((clientX: number, clientY: number) => {
    setMouseScreen({ x: clientX, y: clientY });
    setIsInside(true);

    const newRevealed: { [key: string]: boolean } = {};
    let newlyRevealedCount = 0;

    Object.entries(redactedRefs.current).forEach(([key, el]) => {
      if (el) {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const distance = Math.hypot(clientX - cx, clientY - cy);
        if (distance < 70) {
          newRevealed[key] = true;
          if (!revealedItems[key]) {
            newlyRevealedCount++;
          }
        }
      }
    });

    if (newlyRevealedCount > 0) {
      playSoundEffect('/audio/detective/typewriter.mp3', isMuted, 0.2);
    }

    setRevealedItems(newRevealed);
  }, [isMuted, revealedItems]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    handlePointerMove(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
  const renderFields = (fields: typeof page1Fields) => (
    <div className="space-y-1 sm:space-y-1.5">
      {fields.map((field) => {
        const isRevealed = revealedItems[field.key];
        return (
          <div 
            key={field.key}
            className="bg-[#F5F1E8] border border-black/10 px-2 py-1 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 shadow-sm relative"
          >
            <div className="leading-tight">
              <div className="text-[9px] font-black text-red-900 tracking-wider uppercase">
                {field.label}
              </div>
              <div className="text-[8px] text-neutral-600 italic">
                {field.note}
              </div>
            </div>

            <div 
              ref={el => { redactedRefs.current[field.key] = el; }}
              className="relative px-2 py-1 rounded-md overflow-hidden min-w-[140px] sm:min-w-[180px] text-center bg-[#2B2723] shadow-inner self-stretch sm:self-auto flex items-center justify-center h-7"
            >
              <span className={`text-[11px] font-black font-mono tracking-wider uppercase transition-all duration-200 ${isRevealed ? 'text-amber-200' : 'text-transparent select-none'}`}>
                {field.value}
              </span>

              <div 
                className={`absolute inset-0 bg-black transition-all duration-200 rounded flex items-center justify-center ${isRevealed ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100'}`}
              >
                <span className="text-[9px] text-neutral-400 font-mono tracking-[0.2em] select-none font-black">
                  [ REDACTED ]
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div 
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onMouseEnter={() => setIsInside(true)}
      onMouseLeave={() => {
        setIsInside(false);
        setRevealedItems({});
      }}
      className="relative w-screen h-screen bg-[#0b0a09] text-[#1F1A17] font-mono flex flex-col items-center justify-center p-2 sm:p-4 select-none overflow-hidden cursor-crosshair"
    >
      {/* Laser Pointer Spotlight Effects */}
      {isInside && (
        <div 
          className="pointer-events-none w-2 h-2 rounded-full bg-red-600 z-55 fixed -translate-x-1/2 -translate-y-1/2 border border-white/40 shadow-sm"
          style={{ left: mouseScreen.x, top: mouseScreen.y }}
        />
      )}

      {/* Large Classified Manila Folder Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl max-h-[98vh] flex flex-col my-auto overflow-visible relative"
      >
        {/* Folder Tab */}
        <div className="absolute -top-4 left-8 w-32 h-5 bg-[#d2b48c] rounded-t-lg flex items-center justify-center text-[7px] uppercase font-bold tracking-wider text-black/60 shadow-sm border-t border-x border-black/10 z-0">
          CLASSIFIED FILE // EYES ONLY
        </div>

        <div className="relative bg-[#d2b48c] rounded-r-lg rounded-bl-sm p-1.5 sm:p-2 shadow-[10px_10px_20px_rgba(0,0,0,0.5)] border-l-4 sm:border-l-6 border-l-black/10 flex flex-col overflow-hidden">
          {/* Vertical Crease Line */}
          <div className="absolute top-0 bottom-0 left-4 sm:left-5 w-px bg-black/10" />

          {/* Inner Paper Area */}
          <div className="bg-[#f7f4ef] rounded-md p-2 sm:p-3 shadow-inner border border-black/5 flex flex-col overflow-hidden">

            {/* Header & Page Navigation Tabs */}
            <div className="border-b border-black/10 pb-1 pt-0">
              <div className="flex items-center justify-between gap-2">
                <div className="leading-tight">
                  <span className="text-[7px] uppercase tracking-widest text-red-700 font-extrabold block">ЦЕНТРАЛЕН АРХИВ</span>
                  <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-black">{recipient}</h2>
                </div>

                {/* Folder Page Navigation Buttons */}
                <div className="flex items-center gap-0.5 bg-[#D6CCB4] p-0.5 rounded-md border border-black/5 shadow-inner">
                  <button 
                    onClick={() => { playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.85); setCurrentPage(1); }}
                    className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider transition cursor-pointer ${currentPage === 1 ? 'bg-black text-[#F7F4EF] shadow' : 'text-neutral-800 hover:bg-black/10'}`}
                  >
                    1. Идентичност
                  </button>
                  <button 
                    onClick={() => { playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.85); setCurrentPage(2); }}
                    className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider transition cursor-pointer ${currentPage === 2 ? 'bg-black text-[#F7F4EF] shadow' : 'text-neutral-800 hover:bg-black/10'}`}
                  >
                    2. Престъпления
                  </button>
                  <button 
                    onClick={() => { playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.85); setCurrentPage(3); }}
                    className={`px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider transition cursor-pointer ${currentPage === 3 ? 'bg-black text-[#F7F4EF] shadow' : 'text-neutral-800 hover:bg-black/10'}`}
                  >
                    3. Доказателства
                  </button>
                </div>
              </div>
            </div>

            {/* Folder Content Area with Page Flipping Animation */}
            <div className="flex-1 overflow-visible py-1 sm:py-1.5">
              <AnimatePresence mode="wait">
                {currentPage === 1 && (
                  <motion.div 
                    key="page1"
                    initial={{ opacity: 0, x: -10, rotateY: -3 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    exit={{ opacity: 0, x: 10, rotateY: 3 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1"
                  >
                    <div className="flex items-center justify-between text-[8px] uppercase font-extrabold text-black/80 px-1 border-b border-black/5 pb-0.5">
                      <span>СТРАНИЦА 1: ОСНОВНИ ДАННИ</span>
                      <span className="text-red-700 font-bold">[ ИДЕНТИЧНОСТ ]</span>
                    </div>
                    {renderFields(page1Fields)}
                  </motion.div>
                )}

                {currentPage === 2 && (
                  <motion.div 
                    key="page2"
                    initial={{ opacity: 0, x: -10, rotateY: -3 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    exit={{ opacity: 0, x: 10, rotateY: 3 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1"
                  >
                    <div className="flex items-center justify-between text-[8px] uppercase font-extrabold text-black/80 px-1 border-b border-black/5 pb-0.5">
                      <span>СТРАНИЦА 2: ПРЕСТЪПЛЕНИЯ</span>
                      <span className="text-red-700 font-bold">[ ДОСИЕ ]</span>
                    </div>
                    {renderFields(page2Fields)}
                  </motion.div>
                )}

                {currentPage === 3 && (
                  <motion.div 
                    key="page3"
                    initial={{ opacity: 0, x: -10, rotateY: -3 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    exit={{ opacity: 0, x: 10, rotateY: 3 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1"
                  >
                    <div className="flex items-center justify-between text-[8px] uppercase font-extrabold text-black/80 px-1 border-b border-black/5 pb-0.5">
                      <span>СТРАНИЦА 3: СЕКРЕТНИ ДОКАЗАТЕЛСТВА</span>
                      <span className="text-red-700 font-bold">[ УЛИКИ ]</span>
                    </div>
                    {renderFields(page3Fields)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer & Navigation Button */}
            <div className="border-t border-black/10 pt-1 space-y-1">
              <div className="bg-red-950/5 border border-red-700/20 p-1.5 rounded-md text-[8px] text-red-950 font-mono font-bold shadow-inner flex items-center justify-between">
                <span className="hidden sm:inline text-neutral-800">⚖️ ПРИСЪДА: НАВЪРШВАНЕ НА {age} ГОДИНИ.</span>
                <span className="sm:hidden text-neutral-800">⚖️ ПРИСЪДА: {age} ГОДИНИ.</span>
                <span className="text-red-700 uppercase font-black tracking-tighter">СТРАНИЦА {currentPage} / 3</span>
              </div>

              <div className="flex items-center gap-1.5">
                {currentPage > 1 && (
                  <button 
                    onClick={() => { playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.85); setCurrentPage(prev => Math.max(1, prev - 1) as any); }}
                    className="bg-[#D6CCB4] hover:bg-[#c2b59b] text-black px-2.5 py-1 rounded-md text-[8px] uppercase font-black transition cursor-pointer border border-black/10 shadow-sm"
                  >
                    ←
                  </button>
                )}

                {currentPage < 3 ? (
                  <button 
                    onClick={() => { playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.85); setCurrentPage(prev => Math.min(3, prev + 1) as any); }}
                    className="flex-1 bg-[#2B2723] hover:bg-black text-[#F7F4EF] py-1 rounded-md text-[8px] uppercase tracking-[0.05em] font-black transition cursor-pointer border border-neutral-700 shadow-sm"
                  >
                    Следваща страница →
                  </button>
                ) : (
                  <motion.button 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={onComplete}
                    className="flex-1 bg-red-700 hover:bg-red-800 text-white py-1 rounded-md text-[8px] uppercase tracking-[0.05em] font-black shadow-md transition cursor-pointer border border-red-500 flex items-center justify-center gap-1 group"
                  >
                    <span>[ ПРЕМИН КЪМ ДЕТЕКТОРА ]</span>
                  </motion.button>
                )}
              </div>
            </div>
      </div>
    </div>
  </motion.div>
</div>
  );
}
