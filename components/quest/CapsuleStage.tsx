'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface CapsuleStageProps {
  onGeneratePdf: (answers: { question: string; answer: string }[]) => void;
  customQuestions?: string[];
  recipient?: string; //
}

const DEFAULT_QUESTIONS = [
  'Главна цел за новата година?',
  'Мечтано място за пътуване?',
  'Най-ценният урок от изминалата година?',
  'Нов навик, който искаш да започнеш?',
  'Кое те кара да се смееш от сърце?',
  'Твоето лично обещание днес?',
  'Послание към бъдещето ти "Аз":'
];

const MAX_CHARS = 130;

export const CapsuleStage: React.FC<CapsuleStageProps> = ({ 
  onGeneratePdf,
  customQuestions = DEFAULT_QUESTIONS 
}) => {
  const questions = customQuestions.length > 0 ? customQuestions : DEFAULT_QUESTIONS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(''));
  const [direction, setDirection] = useState(1);

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentIndex];
  const charCount = currentAnswer.length;

  const handleChange = (val: string) => {
    if (val.length > MAX_CHARS) return;
    const updated = [...answers];
    updated[currentIndex] = val;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setDirection(1);
      setCurrentIndex(prev => prev + 1);
    } else {
      const formattedData = questions.map((q, idx) => ({
        question: q,
        answer: answers[idx].trim() || 'Без отговор'
      }));
      onGeneratePdf(formattedData);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none font-sans flex flex-col items-center justify-between px-4 sm:px-6 py-6">
      
      {/* ФОН НА ДНЕВНИК */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FEFEFD] via-[#F9F6F0] to-[#EAE2D6] z-0" />

      {/* ПЛАВАЩИ ПРАШИНКИ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-[#D4AF37] rounded-full blur-[1px]"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -130, 0],
              opacity: [0.1, 0.6, 0.1],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* ГОРЕН ИНДИКАТОР ЗА СТРАНИЦА */}
      <div className="relative z-10 pt-2 flex flex-col items-center space-y-1">
        <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.45em] text-[#958679] font-bold">
          ЛИЧЕН ДНЕВНИК // СТРАНИЦА {currentIndex + 1} от {questions.length}
        </span>
        <div className="w-32 h-[2px] bg-[#EAE2D6] rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[#D4AF37]"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* СТРАНИЦА НА ДНЕВНИКА */}
      <div className="relative z-10 w-full max-w-xl mx-auto my-auto flex flex-col items-center justify-center px-2">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction * 50, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: direction * -50, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full space-y-6 text-center relative px-2"
          >
            {/* Въпрос с номер */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#8A7C6E] font-bold block">
                Въпрос {currentIndex + 1}
              </span>
              <h2 className="font-serif italic text-2xl sm:text-3xl text-[#1F1A17] leading-relaxed drop-shadow-sm">
                "{currentQuestion}"
              </h2>
            </div>

            {/* Поле за писане с редове като в тетрадка */}
            <div className="relative max-w-lg mx-auto w-full">
              <div 
                className="absolute inset-0 pointer-events-none flex flex-col justify-around py-2 opacity-30"
                style={{
                  backgroundImage: 'repeating-linear-gradient(transparent, transparent 35px, #958679 35px, #958679 36px)'
                }}
              />
              <textarea
                rows={4}
                value={currentAnswer}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Пиши тук... (Натисни Enter за следващ въпрос)"
                autoFocus
                className="w-full bg-transparent px-4 py-1 text-lg sm:text-xl font-serif italic text-[#1F1A17] placeholder-[#958679]/40 focus:outline-none transition-all resize-none relative z-10 leading-[36px]"
              />
              <span className={`absolute right-3 bottom-1 text-[10px] font-mono z-20 ${charCount >= MAX_CHARS ? 'text-amber-700 font-bold' : 'text-[#958679]/70'}`}>
                {charCount}/{MAX_CHARS}
              </span>
            </div>

            {/* Навигационни бутони */}
            <div className="flex items-center justify-between pt-4 max-w-lg mx-auto w-full">
              {currentIndex > 0 ? (
                <button
                  onClick={handlePrev}
                  className="px-6 py-3 rounded-xl border border-[#958679]/30 text-xs uppercase tracking-[0.2em] font-bold text-[#7A6C5E] hover:bg-white/40 transition shadow-sm"
                >
                  ← Предишна
                </button>
              ) : <div />}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleNext}
                className="bg-[#1F1A17] text-[#DBCEB3] px-8 py-3.5 text-xs uppercase tracking-[0.25em] font-bold rounded-xl shadow-lg hover:bg-[#3A332E] transition"
              >
                {currentIndex < questions.length - 1 ? 'Следваща ➔' : 'Запечатай & PDF 📄✨'}
              </motion.button>
            </div>

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Копирайт най-долу */}
      <div className="relative z-10 pb-1 text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-[#958679] text-center w-full pointer-events-none">
        GREETING ARCHIVE © 2026
      </div>
    </div>
  );
};

export default CapsuleStage;