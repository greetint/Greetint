'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface QuizItem {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizStageProps {
  recipient?: string;
  quizzes?: QuizItem[];
  onComplete?: () => void;
}

const DEFAULT_QUIZZES: QuizItem[] = [
  {
    id: '1',
    question: "Къде беше най-лудото ни пътуване заедно?",
    options: ["На морето", "В планината", "В чужбина"],
    correctAnswer: 0
  },
  {
    id: '2',
    question: "Коя е любимата ни част от деня, в която прекарваме време заедно?",
    options: ["Сутрешното кафе", "ЗвездНАТА нощ", "Следобедната разходка"],
    correctAnswer: 0
  }
];

export function QuizStage({ 
  recipient = "ВИКТОРИЯ", 
  quizzes = DEFAULT_QUIZZES,
  onComplete 
}: QuizStageProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showWrongMessage, setShowWrongMessage] = useState(false);

  const currentQuiz = quizzes[currentIdx] || quizzes[0];

  const handleSelect = (idx: number) => {
    setSelectedOption(idx);
    const correct = idx === currentQuiz.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setShowWrongMessage(false);
    } else {
      setShowWrongMessage(true);
    }
  };

  const handleNextQuiz = () => {
    if (!isCorrect) return;
    setSelectedOption(null);
    setIsCorrect(null);
    setShowWrongMessage(false);

    if (currentIdx < quizzes.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="relative w-screen h-screen flex flex-col items-center justify-between overflow-hidden select-none p-6 sm:p-12">
      {/* ФОН НА ЦЯЛ ЕКРАН - ХАРТИЕНА ТЕКСТУРА */}
      <div 
        className="absolute inset-0 z-0 transform rotate-90 sm:rotate-0 scale-[2.5]"
        style={{
          backgroundImage: `url('/images/assets/envelope_paper.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(219,206,179,0.25)_0%,_rgba(58,50,45,0.2)_80%)] pointer-events-none z-0" />

      {/* ПЛАВАЩИ ЛУМИНИСЦЕНТНИ ПРАШИНКИ */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(18)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-[#DBCEB3] rounded-full blur-[1px]"
            style={{
              width: `${Math.random() * 5 + 2}px`,
              height: `${Math.random() * 5 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -140, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: Math.random() * 5 + 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      {/* МАГИЧЕСКИ ЗВЕЗДИЧКИ И ИСКРИЦИ ПРИ ВЕРЕН ОТГОВОР */}
      <AnimatePresence>
        {isCorrect && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, x: "50%", y: "50%" }}
                animate={{ 
                  opacity: [0, 1, 0], 
                  scale: [0.5, 1.6, 0.8],
                  x: `${Math.random() * 90 - 45}vw`,
                  y: `${Math.random() * 90 - 45}vh`,
                  rotate: Math.random() * 360
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.8, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 text-2xl sm:text-3xl text-[#DBCEB3] drop-shadow-[0_0_12px_rgba(219,206,179,0.9)]"
              >
                ✦
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* ОСНОВЕН КОНТЕЙНЕР НА ЦЯЛ ЕКРАН */}
      <motion.div
        key={currentIdx}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          x: showWrongMessage ? [0, -8, 8, -6, 6, 0] : 0 
        }}
        transition={{ duration: showWrongMessage ? 0.4 : 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full h-full max-w-4xl flex flex-col justify-between items-center z-10 py-4 sm:py-8 text-center"
      >
        {/* ГОРНА ЧАСТ - ЗАГЛАВИЕ */}
        <div className="space-y-2 pt-2">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.6em] text-[#958679] font-sans font-bold block">
            ВЪПРОС {currentIdx + 1} ОТ {quizzes.length}
          </span>
          <h2 className="font-serif italic text-xl sm:text-3xl text-[#635E57] tracking-wide">
            Помниш ли този момент?
          </h2>
          <div className="w-20 h-[1px] bg-[#958679]/50 mx-auto mt-1" />
        </div>

        {/* ЦЕНТРАЛНА ЗОНА - С НЕВИДИМИ ОГРАНИЧАВАЩИ РАМКИ ЗА ПЕРФЕКТЕН ТЕКСТ */}
        <div className="relative w-full max-w-2xl my-auto flex flex-col items-center justify-center space-y-5 px-4">
          <div className="w-full max-h-[160px] overflow-y-auto px-2">
            <p className="font-serif italic text-lg sm:text-2xl text-[#1F1A17] leading-relaxed text-center drop-shadow-sm break-words">
              "{currentQuiz.question}"
            </p>
          </div>

          {/* БУТОНИ ЗА ОТГОВОРИ С ДИНАМИЧНО ОРАЗМЕРЯВАНЕ И ЗАПАЗЕН РЕГИСТЪР */}
          <div className="space-y-3 w-full pt-1">
            {currentQuiz.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let btnStyle = 'bg-[#FEFEFD]/85 text-[#1F1A17] border-[#DBCEB3] hover:bg-[#FEFEFD] shadow-[0_10px_25px_rgba(31,26,23,0.08)]';

              if (isSelected) {
                if (isCorrect) {
                  btnStyle = 'bg-gradient-to-r from-[#DBCEB3] via-[#C4B495] to-[#DBCEB3] text-[#1F1A17] border-[#B8A386] shadow-[0_15px_35px_rgba(219,206,179,0.5)] scale-[1.01] font-bold'; 
                } else {
                  btnStyle = 'bg-[#E5DFDE] text-[#635E57] border-[#D1C9C7] shadow-md'; 
                }
              }

              return (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(idx)}
                  className={`w-full py-3.5 sm:py-4 px-6 rounded-2xl text-xs sm:text-sm font-medium tracking-wide transition duration-300 font-sans border backdrop-blur-sm break-words ${btnStyle}`}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>

          {/* СЪОБЩЕНИЕ ПРИ ГРЕШЕН ОТГОВОР */}
          <AnimatePresence>
            {showWrongMessage && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[11px] uppercase tracking-[0.2em] text-[#635E57] font-sans font-bold italic pt-1 drop-shadow-sm"
              >
                ✦ Не съвсем... Помисли отново и опитай пак ✦
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ДОЛНА ЧАСТ - КОМПАКТЕН БУТОН ЗА ПРОДЪЛЖЕНИЕ, ИЗМЕСТЕН ПО-НАДОЛУ */}
        <div className="w-full max-w-sm space-y-3 pb-2">
          <AnimatePresence>
            {isCorrect ? (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <button
                  onClick={handleNextQuiz}
                  className="bg-[#1F1A17] text-[#FEFEFD] px-8 py-3 text-[11px] uppercase tracking-[0.3em] font-bold rounded-xl shadow-[0_12px_25px_rgba(31,26,23,0.25)] font-sans hover:bg-[#958679] transition duration-300 w-full"
                >
                  {currentIdx < quizzes.length - 1 ? 'Следващ Въпрос ➔' : 'Към Спомените ➔'}
                </button>
              </motion.div>
            ) : (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[10px] uppercase tracking-[0.25em] text-[#635E57] font-sans font-bold italic block drop-shadow-sm pb-1"
              >
                ✦ Избери верния отговор за продължение ✦
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default QuizStage;