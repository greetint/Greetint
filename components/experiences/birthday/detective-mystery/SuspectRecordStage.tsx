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
    <div className="space-y-2.5 sm:space-y-3.5">
      {fields.map((field) => {
        const isRevealed = revealedItems[field.key];
        return (
          <div 
            key={field.key}
            className="bg-[#F5F1E8] border border-black/20 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-lg sm:rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs relative"
          >
            <div className="leading-tight">
              <div className="text-xs sm:text-sm font-black text-red-900 tracking-wider uppercase">
                {field.label}
              </div>
              <div className="text-[10px] sm:text-xs text-neutral-600 italic mt-0.5">
                {field.note}
              </div>
            </div>

            <div 
              ref={el => { redactedRefs.current[field.key] = el; }}
              className="relative px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg overflow-hidden min-w-[160px] sm:min-w-[220px] text-center bg-[#2B2723] shadow-inner self-stretch sm:self-auto flex items-center justify-center h-8 sm:h-10"
            >
              <span className={`text-xs sm:text-sm md:text-base font-black font-mono tracking-wider uppercase transition-all duration-200 ${isRevealed ? 'text-amber-200' : 'text-transparent select-none'}`}>
                {field.value}
              </span>

              <div 
                className={`absolute inset-0 bg-black transition-all duration-200 rounded flex items-center justify-center ${isRevealed ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100'}`}
              >
                <span className="text-[10px] sm:text-xs text-neutral-400 font-mono tracking-[0.2em] select-none font-black">
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
      className="relative w-screen h-screen bg-[#0b0a09] text-[#1F1A17] font-mono flex flex-col items-center justify-center p-3 sm:p-6 select-none overflow-y-auto cursor-crosshair"
    >
      {/* Laser Pointer Spotlight Effects */}
      {isInside && (
        <div 
          className="pointer-events-none w-2.5 h-2.5 rounded-full bg-red-600 z-55 fixed -translate-x-1/2 -translate-y-1/2 border border-white/60 shadow-sm"
          style={{ left: mouseScreen.x, top: mouseScreen.y }}
        />
      )}

      {/* Large Classified Manila Folder Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl lg:max-w-5xl xl:max-w-6xl my-auto pt-7 sm:pt-8 relative"
      >
        {/* Folder Tab */}
        <div className="absolute top-0 left-6 sm:left-12 w-64 sm:w-72 h-8 sm:h-9 bg-[#d2b48c] rounded-t-xl flex items-center justify-center text-[10px] sm:text-xs uppercase font-extrabold tracking-wider text-black/75 shadow-sm border-t-2 border-x-2 border-black/15 z-0">
          CLASSIFIED FILE // EYES ONLY
        </div>

        <div className="relative bg-[#d2b48c] rounded-r-2xl sm:rounded-r-3xl rounded-bl-sm p-4 sm:p-6 lg:p-8 shadow-[25px_25px_60px_rgba(0,0,0,0.65)] border-l-6 sm:border-l-8 border-l-black/20 flex flex-col">
          {/* Vertical Crease Line */}
          <div className="absolute top-0 bottom-0 left-5 sm:left-7 w-px bg-black/15 pointer-events-none" />

          {/* Inner Paper Area */}
          <div className="bg-[#F9F7F1] rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-inner border border-black/10 flex flex-col min-h-[420px] sm:min-h-[500px]">

            {/* Header & Page Navigation Tabs */}
            <div className="border-b-2 border-black/15 pb-4 pt-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="leading-tight">
                  <span className="text-[10px] sm:text-xs uppercase tracking-widest text-red-700 font-extrabold block">ЦЕНТРАЛЕН АРХИВ НА РАЗСЛЕДВАНЕТО</span>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-wide text-black">{recipient}</h2>
                </div>

                {/* Folder Page Navigation Buttons */}
                <div className="flex items-center gap-1.5 bg-[#D6CCB4] p-1.5 rounded-xl border border-black/15 shadow-inner">
                  <button 
                    onClick={() => { playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.85); setCurrentPage(1); }}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-black uppercase tracking-wider transition cursor-pointer ${currentPage === 1 ? 'bg-black text-[#F7F4EF] shadow' : 'text-neutral-800 hover:bg-black/10'}`}
                  >
                    1. Идентичност
                  </button>
                  <button 
                    onClick={() => { playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.85); setCurrentPage(2); }}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-black uppercase tracking-wider transition cursor-pointer ${currentPage === 2 ? 'bg-black text-[#F7F4EF] shadow' : 'text-neutral-800 hover:bg-black/10'}`}
                  >
                    2. Престъпления
                  </button>
                  <button 
                    onClick={() => { playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.85); setCurrentPage(3); }}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-black uppercase tracking-wider transition cursor-pointer ${currentPage === 3 ? 'bg-black text-[#F7F4EF] shadow' : 'text-neutral-800 hover:bg-black/10'}`}
                  >
                    3. Доказателства
                  </button>
                </div>
              </div>
            </div>

            {/* Folder Content Area with Page Flipping Animation */}
            <div className="flex-1 overflow-visible py-4 sm:py-5">
              <AnimatePresence mode="wait">
                {currentPage === 1 && (
                  <motion.div 
                    key="page1"
                    initial={{ opacity: 0, x: -10, rotateY: -3 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    exit={{ opacity: 0, x: 10, rotateY: 3 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2 sm:space-y-3"
                  >
                    <div className="flex items-center justify-between text-[10px] sm:text-xs uppercase font-black text-black/80 px-1 border-b border-black/10 pb-1">
                      <span>СТРАНИЦА 1: ОСНОВНИ ДАННИ И ИДЕНТИЧНОСТ</span>
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
                    className="space-y-2 sm:space-y-3"
                  >
                    <div className="flex items-center justify-between text-[10px] sm:text-xs uppercase font-black text-black/80 px-1 border-b border-black/10 pb-1">
                      <span>СТРАНИЦА 2: ПРЕСТЪПЛЕНИЯ И ОТЛИЧИТЕЛНИ БЕЛЕЗИ</span>
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
                    className="space-y-2 sm:space-y-3"
                  >
                    <div className="flex items-center justify-between text-[10px] sm:text-xs uppercase font-black text-black/80 px-1 border-b border-black/10 pb-1">
                      <span>СТРАНИЦА 3: СЕКРЕТНИ ДОКАЗАТЕЛСТВА</span>
                      <span className="text-red-700 font-bold">[ УЛИКИ ЗА СТЕЙДЖ 5 ]</span>
                    </div>
                    {renderFields(page3Fields)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer & Navigation Button */}
            <div className="border-t-2 border-black/15 pt-4 sm:pt-5 space-y-3">
              <div className="bg-red-950/10 border-2 border-red-700/40 p-3 sm:p-3.5 rounded-xl text-xs sm:text-sm text-red-950 font-mono font-bold shadow-inner flex items-center justify-between gap-3">
                <span className="hidden sm:inline text-red-950">⚖️ ПРИСЪДА: НАВЪРШВАНЕ НА {age} ГОДИНИ ПРИ СТРОГО ЗАТВОРНИЧЕСКИ РЕЖИМ НА КУПОН.</span>
                <span className="sm:hidden text-red-950">⚖️ ПРИСЪДА: {age} ГОДИНИ КУПОН.</span>
                <span className="text-red-700 uppercase font-black tracking-tight shrink-0">СТРАНИЦА {currentPage} / 3</span>
              </div>

              <div className="flex items-center gap-3">
                {currentPage > 1 && (
                  <button 
                    onClick={() => { playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.85); setCurrentPage(prev => Math.max(1, prev - 1) as any); }}
                    className="bg-[#D6CCB4] hover:bg-[#c2b59b] text-black px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider font-black transition cursor-pointer border border-black/20 shadow-sm"
                  >
                    ← Предишна
                  </button>
                )}

                {currentPage < 3 ? (
                  <button 
                    onClick={() => { playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.85); setCurrentPage(prev => Math.min(3, prev + 1) as any); }}
                    className="flex-1 bg-[#2B2723] hover:bg-black text-[#F7F4EF] py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-[0.15em] font-black transition cursor-pointer border border-neutral-700 shadow"
                  >
                    Следваща страница →
                  </button>
                ) : (
                  <motion.button 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={onComplete}
                    className="flex-1 bg-red-700 hover:bg-red-800 text-white py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-[0.15em] font-black shadow-lg transition cursor-pointer border border-red-500 flex items-center justify-center gap-2 group"
                  >
                    <span>[ ПРЕМИН КЪМ ДЕТЕКТОРА НА ЛЪЖАТА → ]</span>
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
