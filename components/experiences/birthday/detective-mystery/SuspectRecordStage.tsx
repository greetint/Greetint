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

  const answers = evidenceAnswers?.length === 5 ? evidenceAnswers : (evidenceItems?.length === 5 ? evidenceItems.map(item => item.answer) : defaultAnswers);
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

  const page3Fields = [
    { key: 'ev0', label: '[ ДОКАЗАТЕЛСТВО №1 ]', value: answers[0], note: 'Факт за корковото табло (Стейдж 5)' },
    { key: 'ev1', label: '[ ДОКАЗАТЕЛСТВО №2 ]', value: answers[1], note: 'Факт за корковото табло (Стейдж 5)' },
    { key: 'ev2', label: '[ ДОКАЗАТЕЛСТВО №3 ]', value: answers[2], note: 'Факт за корковото табло (Стейдж 5)' },
    { key: 'ev3', label: '[ ДОКАЗАТЕЛСТВО №4 ]', value: answers[3], note: 'Факт за корковото табло (Стейдж 5)' },
    { key: 'ev4', label: '[ ДОКАЗАТЕЛСТВО №5 ]', value: answers[4], note: 'Факт за корковото табло (Стейдж 5)' },
  ];

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
        if (distance < 100) {
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
    <div className="space-y-3">
      {fields.map((field) => {
        const isRevealed = revealedItems[field.key];
        return (
          <div 
            key={field.key}
            className="bg-[#F5F1E8] border-2 border-black/40 px-4 py-3 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner relative"
          >
            <div>
              <div className="text-xs font-black text-red-900 tracking-wider">
                {field.label}
              </div>
              <div className="text-[10px] text-neutral-600 italic">
                {field.note}
              </div>
            </div>

            <div 
              ref={el => { redactedRefs.current[field.key] = el; }}
              className="relative px-3 py-2 rounded-lg overflow-hidden min-w-[180px] sm:min-w-[220px] text-center bg-[#2B2723] shadow-inner self-stretch sm:self-auto flex items-center justify-center"
            >
              <span className={`text-xs sm:text-sm font-black font-mono tracking-wider uppercase transition-all duration-200 ${isRevealed ? 'text-amber-200' : 'text-transparent select-none'}`}>
                {field.value}
              </span>

              <div 
                className={`absolute inset-0 bg-black transition-all duration-200 rounded flex items-center justify-center ${isRevealed ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100 scale-100'}`}
              >
                <span className="text-[11px] text-neutral-400 font-mono tracking-[0.2em] select-none font-black">
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
      className="relative w-screen h-screen bg-[#0b0a09] text-[#1F1A17] font-mono flex flex-col items-center justify-center p-3 sm:p-6 select-none overflow-hidden cursor-crosshair"
    >
      {/* Laser Pointer Spotlight Effects */}
      {isInside && (
        <>
          <div 
            className="pointer-events-none w-72 h-72 rounded-full blur-3xl bg-red-600/35 z-50 fixed -translate-x-1/2 -translate-y-1/2 transition-all duration-75 ease-out mix-blend-screen"
            style={{ left: mouseScreen.x, top: mouseScreen.y }}
          />
          <div 
            className="pointer-events-none w-5 h-5 rounded-full bg-red-500 shadow-[0_0_25px_rgba(239,68,68,1)] z-55 fixed -translate-x-1/2 -translate-y-1/2 border-2 border-white"
            style={{ left: mouseScreen.x, top: mouseScreen.y }}
          />
        </>
      )}

      {/* Large Classified Manila Folder Container */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 max-w-3xl w-full h-[88vh] max-h-[740px] bg-[#E8E1D1] border-4 border-[#C2B59B] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] p-5 sm:p-8 flex flex-col justify-between overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(#d6ccb4 0.9px, transparent 0.9px)',
          backgroundSize: '16px 16px'
        }}
      >
        {/* Manila Folder Tab */}
        <div className="absolute -top-3.5 left-8 bg-[#C2B59B] text-[#1F1A17] px-6 py-1.5 rounded-t-lg text-[10px] font-black uppercase tracking-[0.25em] border-t-2 border-x-2 border-[#A89A80] shadow-md flex items-center gap-3">
          <span>📁 ФЕДЕРАЛНО ДОСИЕ // СУБЕКТ: {recipient}</span>
          <span className="text-red-800">[ TOP SECRET ]</span>
        </div>

        {/* Red Classified Stamp */}
        <div className="absolute top-4 right-6 border-2 border-red-700 text-red-700 px-3 py-1 rounded font-black text-xs uppercase tracking-[0.25em] transform rotate-3 bg-red-950/10 shadow-md pointer-events-none">
          TOP SECRET // EYES ONLY
        </div>

        {/* Header & Page Navigation Tabs */}
        <div className="border-b-2 border-black/20 pb-4 pt-2 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-red-700 font-extrabold block">ЦЕНТРАЛЕН АРХИВ НА РАЗСЛЕДВАНЕТО</span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wide text-black">{recipient}</h2>
            </div>

            {/* Folder Page Navigation Buttons */}
            <div className="flex items-center gap-1.5 bg-[#D6CCB4] p-1.5 rounded-xl border border-black/20 shadow-inner">
              <button 
                onClick={() => { playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.85); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition cursor-pointer ${currentPage === 1 ? 'bg-black text-[#F7F4EF] shadow' : 'text-neutral-800 hover:bg-black/10'}`}
              >
                1. Идентичност
              </button>
              <button 
                onClick={() => { playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.85); setCurrentPage(2); }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition cursor-pointer ${currentPage === 2 ? 'bg-black text-[#F7F4EF] shadow' : 'text-neutral-800 hover:bg-black/10'}`}
              >
                2. Престъпления
              </button>
              <button 
                onClick={() => { playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.85); setCurrentPage(3); }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition cursor-pointer ${currentPage === 3 ? 'bg-black text-[#F7F4EF] shadow' : 'text-neutral-800 hover:bg-black/10'}`}
              >
                3. Доказателства
              </button>
            </div>
          </div>

          <p className="text-[11px] text-neutral-800 italic font-medium">
            Инструкция: Задръжте лазерния фенер върху черните цензурирани ленти <span className="text-red-700 font-bold">[ REDACTED ]</span>, за да разчетете класифицираната информация на всяка страница.
          </p>
        </div>

        {/* Folder Content Area with Page Flipping Animation */}
        <div className="flex-1 overflow-y-auto py-3 pr-1 my-2">
          <AnimatePresence mode="wait">
            {currentPage === 1 && (
              <motion.div 
                key="page1"
                initial={{ opacity: 0, x: -20, rotateY: -5 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: 20, rotateY: 5 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between text-[11px] uppercase font-extrabold text-black/80 px-1 border-b border-black/10 pb-1">
                  <span>СТРАНИЦА 1: ОСНОВНИ ДАННИ И ИДЕНТИЧНОСТ</span>
                  <span className="text-red-700 font-bold">[ ФЕДЕРАЛЕН РЕГИСТЪР ]</span>
                </div>
                {renderFields(page1Fields)}
              </motion.div>
            )}

            {currentPage === 2 && (
              <motion.div 
                key="page2"
                initial={{ opacity: 0, x: -20, rotateY: -5 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: 20, rotateY: 5 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between text-[11px] uppercase font-extrabold text-black/80 px-1 border-b border-black/10 pb-1">
                  <span>СТРАНИЦА 2: ПРЕСТЪПЛЕНИЯ И ОТЛИЧИТЕЛНИ БЕЛЕЗИ</span>
                  <span className="text-red-700 font-bold">[ ДОСИЕ НА СУБЕКТА ]</span>
                </div>
                {renderFields(page2Fields)}
              </motion.div>
            )}

            {currentPage === 3 && (
              <motion.div 
                key="page3"
                initial={{ opacity: 0, x: -20, rotateY: -5 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                exit={{ opacity: 0, x: 20, rotateY: 5 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between text-[11px] uppercase font-extrabold text-black/80 px-1 border-b border-black/10 pb-1">
                  <span>СТРАНИЦА 3: СЕКРЕТНИ ДОКАЗАТЕЛСТВА (ЗА КОРКОВОТО ТАБЛО)</span>
                  <span className="text-red-700 font-bold">[ УЛИКИ ЗА СТЕЙДЖ 5 ]</span>
                </div>
                {renderFields(page3Fields)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer & Navigation Button */}
        <div className="border-t-2 border-black/20 pt-4 space-y-3">
          <div className="bg-red-950/10 border-2 border-red-700/50 p-3 rounded-xl text-[11px] text-red-950 font-mono font-bold shadow-inner flex items-center justify-between">
            <span>⚖️ ПРИСЪДА: НАВЪРШВАНЕ НА {age} ГОДИНИ ПРИ СТРОГО ЗАТВОРНИЧЕСКИ РЕЖИМ НА КУПОН.</span>
            <span className="text-red-700 uppercase font-black">СТРАНИЦА {currentPage} / 3</span>
          </div>

          <div className="flex items-center gap-3">
            {currentPage > 1 && (
              <button 
                onClick={() => { playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.85); setCurrentPage(prev => Math.max(1, prev - 1) as any); }}
                className="bg-[#D6CCB4] hover:bg-[#c2b59b] text-black px-5 py-3.5 rounded-xl text-xs uppercase tracking-widest font-black transition cursor-pointer border border-black/30 shadow"
              >
                ← Предишна
              </button>
            )}

            {currentPage < 3 ? (
              <button 
                onClick={() => { playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.85); setCurrentPage(prev => Math.min(3, prev + 1) as any); }}
                className="flex-1 bg-[#2B2723] hover:bg-black text-[#F7F4EF] py-3.5 rounded-xl text-xs uppercase tracking-[0.2em] font-black transition cursor-pointer border border-neutral-700 shadow"
              >
                Следваща страница →
              </button>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onComplete}
                className="flex-1 bg-red-700 hover:bg-red-800 text-white py-3.5 rounded-xl text-xs uppercase tracking-[0.2em] font-black shadow-lg transition cursor-pointer border border-red-500 flex items-center justify-center gap-2 group"
              >
                <span>[ ПРЕМИН КЪМ ДЕТЕКТОРА НА ЛЪЖАТА → ]</span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
