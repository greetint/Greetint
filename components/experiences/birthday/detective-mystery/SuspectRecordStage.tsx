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
  isModal?: boolean;
  onClose?: () => void;
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
  isModal = false,
  onClose,
  onComplete 
}: SuspectRecordProps) {
  const [currentPage, setCurrentPage] = useState<1 | 2 | 3>(1);
  const [mouseScreen, setMouseScreen] = useState({ x: -1000, y: -1000 });
  const [activeLaserKey, setActiveLaserKey] = useState<string | null>(null);
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

    let foundKey: string | null = null;

    Object.entries(redactedRefs.current).forEach(([key, el]) => {
      if (el) {
        const rect = el.getBoundingClientRect();

        // Reveal instantly and cleanly ONLY when the precise laser dot falls on the redacted bar
        if (
          clientX >= rect.left && clientX <= rect.right && 
          clientY >= rect.top && clientY <= rect.bottom
        ) {
          foundKey = key;
        }
      }
    });

    if (foundKey !== activeLaserKey && foundKey !== null) {
      playSoundEffect('/audio/detective/typewriter.mp3', isMuted, 0.2);
    }

    setActiveLaserKey(foundKey);
  }, [isMuted, activeLaserKey]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    handlePointerMove(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) {
      handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
  const renderFields = (fields: typeof page1Fields) => (
    <div className="space-y-2 sm:space-y-2.5">
      {fields.map((field) => {
        const isRevealed = activeLaserKey === field.key;
        return (
          <div 
            key={field.key}
            className="bg-[#F5F1E8] border border-black/20 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs relative transition-colors duration-200 hover:border-black/40"
          >
            <div className="leading-tight">
              <div className="text-xs font-black text-red-900 tracking-wider uppercase">
                {field.label}
              </div>
              <div className="text-[10px] text-neutral-600 italic mt-0.5">
                {field.note}
              </div>
            </div>

            <div 
              ref={el => { redactedRefs.current[field.key] = el; }}
              className={`relative px-3 py-1.5 rounded-md overflow-hidden min-w-[150px] sm:min-w-[190px] text-center bg-[#24201D] shadow-inner self-stretch sm:self-auto flex items-center justify-center h-8 sm:h-9 ${isRevealed ? 'ring-2 ring-red-500 shadow-[0_0_10px_rgba(255,0,0,0.8)]' : ''}`}
            >
              <span className={`text-xs sm:text-sm font-black font-mono tracking-wider uppercase transition-none ${isRevealed ? 'text-amber-200 opacity-100' : 'text-transparent opacity-0 select-none'}`}>
                {field.value}
              </span>

              <div 
                className={`absolute inset-0 bg-[#24201D] transition-none rounded flex items-center justify-center z-10 ${isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              >
                <span className="text-[10px] text-neutral-400 font-mono tracking-[0.2em] select-none font-black">
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
      onTouchStart={handleTouchMove}
      onTouchEnd={() => setActiveLaserKey(null)}
      onMouseLeave={() => setActiveLaserKey(null)}
      className={`relative ${isModal ? 'w-full h-auto bg-transparent p-0' : 'w-screen h-screen bg-[#0b0a09]'} text-[#1F1A17] font-mono flex flex-col items-center justify-center p-2 sm:p-6 select-none overflow-hidden sm:overflow-y-auto cursor-default`}
    >
      {/* Realistic Spreading Red Laser Light Effect */}
      {mouseScreen.x > -500 && (
        <>
          <div 
            className="pointer-events-none fixed z-55 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-75 pointer-events-none"
            style={{
              left: mouseScreen.x,
              top: mouseScreen.y,
              width: '120px',
              height: '120px',
              background: 'radial-gradient(circle, rgba(255, 30, 30, 0.4) 0%, rgba(220, 20, 20, 0.18) 35%, rgba(180, 0, 0, 0.05) 70%, transparent 100%)',
              boxShadow: '0 0 30px 10px rgba(255, 0, 0, 0.25)',
            }}
          />
          <div 
            className="pointer-events-none fixed z-56 w-2 h-2 rounded-full bg-[#ff1a1a] shadow-[0_0_10px_3px_rgba(255,0,0,1)] -translate-x-1/2 -translate-y-1/2"
            style={{ left: mouseScreen.x, top: mouseScreen.y }}
          />
          <div 
            className="pointer-events-none fixed z-57 w-1 h-1 rounded-full bg-white -translate-x-1/2 -translate-y-1/2"
            style={{ left: mouseScreen.x, top: mouseScreen.y }}
          />
        </>
      )}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm sm:max-w-3xl my-auto pt-5 sm:pt-8 relative"
      >
        {/* Folder Tab */}
        <div className="absolute top-0 left-4 sm:left-10 w-40 sm:w-60 h-6 sm:h-8 bg-[#d2b48c] rounded-t-xl flex items-center justify-center text-[8px] sm:text-[10px] uppercase font-extrabold tracking-wider text-black/75 shadow-sm border-t-2 border-x-2 border-black/15 z-0">
          CLASSIFIED FILE // EYES ONLY
        </div>

        {isModal && onClose && (
          <button 
            onClick={() => {
              playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.85);
              onClose();
            }}
            className="absolute top-0 right-2 z-30 bg-red-700 hover:bg-red-800 text-white px-2.5 py-1 rounded-lg text-[9px] sm:text-xs font-black uppercase tracking-wider shadow-md border border-red-500 cursor-pointer transition"
          >
            [ ЗАТВОРИ ДОСИЕТО ✕ ]
          </button>
        )}

        <div className="relative bg-[#d2b48c] rounded-r-2xl rounded-bl-sm p-2.5 sm:p-5 lg:p-6 shadow-[20px_20px_45px_rgba(0,0,0,0.6)] border-l-4 sm:border-l-8 border-l-black/20 flex flex-col">
          {/* Vertical Crease Line */}
          <div className="absolute top-0 bottom-0 left-4 sm:left-6 w-px bg-black/15 pointer-events-none" />

          {/* Inner Paper Area */}
          <div className="bg-[#F9F7F1] rounded-xl p-2.5 sm:p-5 lg:p-6 shadow-inner border border-black/10 flex flex-col">

            {/* Header & Page Navigation Tabs */}
            <div className="border-b border-black/15 pb-3 pt-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="leading-tight">
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-red-700 font-extrabold block">ЦЕНТРАЛЕН АРХИВ НА РАЗСЛЕДВАНЕТО</span>
                  <h2 className="text-lg sm:text-xl font-black uppercase tracking-wide text-black">{recipient}</h2>
                </div>

                {/* Folder Page Navigation Buttons */}
                <div className="grid grid-cols-3 gap-1 bg-[#D6CCB4] p-1 rounded-xl border border-black/15 shadow-inner w-full sm:w-auto">
                  <button 
                    onClick={() => { playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.85); setCurrentPage(1); }}
                    className={`px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-tighter sm:tracking-wider transition cursor-pointer text-center truncate ${currentPage === 1 ? 'bg-black text-[#F7F4EF] shadow' : 'text-neutral-800 hover:bg-black/10'}`}
                  >
                    1. Идентичност
                  </button>
                  <button 
                    onClick={() => { playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.85); setCurrentPage(2); }}
                    className={`px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-tighter sm:tracking-wider transition cursor-pointer text-center truncate ${currentPage === 2 ? 'bg-black text-[#F7F4EF] shadow' : 'text-neutral-800 hover:bg-black/10'}`}
                  >
                    2. Престъпления
                  </button>
                  <button 
                    onClick={() => { playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.85); setCurrentPage(3); }}
                    className={`px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-tighter sm:tracking-wider transition cursor-pointer text-center truncate ${currentPage === 3 ? 'bg-black text-[#F7F4EF] shadow' : 'text-neutral-800 hover:bg-black/10'}`}
                  >
                    3. Доказателства
                  </button>
                </div>
              </div>
            </div>

            {/* Folder Content Area with Page Flipping Animation */}
            <div className="flex-1 overflow-visible py-3 sm:py-3.5">
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
            <div className="border-t border-black/15 pt-3 sm:pt-4 space-y-2.5">
              <div className="bg-red-950/10 border-2 border-red-700/40 p-2.5 sm:p-3 rounded-xl text-[11px] sm:text-xs text-red-950 font-mono font-bold shadow-inner flex items-center justify-between gap-2">
                <span className="hidden sm:inline text-red-950">⚖️ ПРИСЪДА: НАВЪРШВАНЕ НА {age} ГОДИНИ ПРИ СТРОГО ЗАТВОРНИЧЕСКИ РЕЖИМ НА КУПОН.</span>
                <span className="sm:hidden text-red-950">⚖️ ПРИСЪДА: {age} ГОДИНИ КУПОН.</span>
                <span className="text-red-700 uppercase font-black tracking-tight shrink-0">СТРАНИЦА {currentPage} / 3</span>
              </div>

              <div className="flex items-center gap-2.5">
                {currentPage > 1 && (
                  <button 
                    onClick={() => { playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.85); setCurrentPage(prev => Math.max(1, prev - 1) as any); }}
                    className="bg-[#D6CCB4] hover:bg-[#c2b59b] text-black px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider font-black transition cursor-pointer border border-black/20 shadow-sm"
                  >
                    ← Предишна
                  </button>
                )}

                {currentPage < 3 ? (
                  <button 
                    onClick={() => { playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.85); setCurrentPage(prev => Math.min(3, prev + 1) as any); }}
                    className="flex-1 bg-[#2B2723] hover:bg-black text-[#F7F4EF] py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm uppercase tracking-[0.12em] font-black transition cursor-pointer border border-neutral-700 shadow"
                  >
                    Следваща страница →
                  </button>
                ) : (
                  <motion.button 
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.85);
                      if (isModal && onClose) onClose();
                      else onComplete();
                    }}
                    className="flex-1 bg-red-700 hover:bg-red-800 text-white py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm uppercase tracking-[0.12em] font-black shadow-lg transition cursor-pointer border border-red-500 flex items-center justify-center gap-2 group"
                  >
                    <span>{isModal ? '[ ЗАТВОРИ ДОСИЕТО ✕ ]' : '[ ПРЕМИН КЪМ ДЕТЕКТОРА НА ЛЪЖАТА → ]'}</span>
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
