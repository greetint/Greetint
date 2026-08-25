'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface QuizItem {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  correct: 'A' | 'B' | 'C';
}

interface QuizStageProps {
  quizList: QuizItem[];
  onComplete: () => void;
}

export const QuizStage: React.FC<QuizStageProps> = ({ quizList, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | null>(null);
  const [shake, setShake] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const currentQuiz = quizList[currentIdx];

  const handleSelect = (option: 'A' | 'B' | 'C') => {
    setSelectedOption(option);

    if (option === currentQuiz.correct) {
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        setSelectedOption(null);
        if (currentIdx < quizList.length - 1) {
          setCurrentIdx(currentIdx + 1);
        } else {
          onComplete();
        }
      }, 1000);
    } else {
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setSelectedOption(null);
      }, 600);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.6 }}
      className="max-w-md w-full mx-auto space-y-6 text-center"
    >
      <div className="flex justify-between items-center px-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#958679] font-sans font-bold">
          Шоу-Викторина 🎬
        </span>
        <span className="text-[10px] uppercase tracking-widest text-[#1F1A17] font-sans font-bold bg-[#DBCEB3]/30 px-2.5 py-1 rounded-full">
          Въпрос {currentIdx + 1} / {quizList.length}
        </span>
      </div>

      <motion.div
        animate={shake ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.5 }}
        className="bg-[#FEFEFD] p-6 rounded-2xl border border-[#958679]/30 shadow-2xl space-y-6 relative overflow-hidden"
      >
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 bg-green-900/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-white space-y-2"
          >
            <span className="text-3xl">🎉</span>
            <h4 className="font-serif text-lg uppercase tracking-wider font-bold">Браво! Верен Отговор!</h4>
          </motion.div>
        )}

        <h3 className="text-lg font-serif text-[#1F1A17] leading-snug">
          {currentQuiz.question}
        </h3>

        <div className="space-y-3">
          {(['A', 'B', 'C'] as const).map((letter) => {
            const labelMap = {
              A: currentQuiz.optionA,
              B: currentQuiz.optionB,
              C: currentQuiz.optionC,
            };
            const isSelected = selectedOption === letter;

            return (
              <button
                key={letter}
                onClick={() => handleSelect(letter)}
                className={`w-full p-4 text-xs font-sans text-left rounded-xl border transition-all ${
                  isSelected
                    ? letter === currentQuiz.correct
                      ? 'bg-green-100 border-green-500 text-green-900 font-bold scale-[1.02]'
                      : 'bg-red-100 border-red-500 text-red-900 font-bold'
                    : 'bg-[#F7F4EF] border-[#958679]/30 text-[#1F1A17] hover:bg-[#DBCEB3]/30 active:scale-[0.98]'
                }`}
              >
                <span className="font-bold mr-2 text-[#958679]">{letter})</span> {labelMap[letter]}
              </button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
};