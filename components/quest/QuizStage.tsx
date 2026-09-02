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
    question: "Kade beshe nai-ludoto ni putuvane zaedno?",
    options: ["Na moreto", "V planinata", "V chuzhbina"],
    correctAnswer: 0
  },
  {
    id: '2',
    question: "Koya e lyubimata ni chast ot denya?",
    options: ["Sutreshnoto kafe", "Zvezdnata nosht", "Sledobednata razhodka"],
    correctAnswer: 0
  }
];

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

export function QuizStage({ 
  recipient = "VIKTORIYA", 
  quizzes = DEFAULT_QUIZZES,
  onComplete 
}: QuizStageProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showWrongMessage, setShowWrongMessage] = useState(false);
  const [shakeIndex, setShakeIndex] = useState<number | null>(null);

  const currentQuiz = quizzes[currentIdx] || quizzes[0];
  const totalQuizzes = quizzes.length;
  const progressPercent = ((currentIdx + 1) / totalQuizzes) * 100;

  const handleSelect = (idx: number) => {
    setSelectedOption(idx);
    const correct = idx === currentQuiz.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      setShowWrongMessage(false);
      setShakeIndex(null);
    } else {
      setShowWrongMessage(true);
      setShakeIndex(idx);
      setTimeout(() => setShakeIndex(null), 500);
    }
  };

  const handleNextQuiz = () => {
    if (!isCorrect) return;
    setSelectedOption(null);
    setIsCorrect(null);
    setShowWrongMessage(false);
    setShakeIndex(null);

    if (currentIdx < totalQuizzes - 1) {
      setCurrentIdx(prev => prev + 1);
    } else if (onComplete) {
      onComplete();
    }
  };
  return (
    <div className="relative w-screen h-[100dvh] flex flex-col items-center justify-between overflow-hidden select-none px-4 pt-12 pb-6 sm:p-12">
      <div className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-110" style={{ backgroundImage: 'url(/images/assets/envelope_paper.jpeg)' }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(219,206,179,0.3)_0%,_rgba(40,33,28,0.3)_85%)] pointer-events-none z-0" />

      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-[#DBCEB3] rounded-full blur-[1px]"
            style={{ width: `${Math.random() * 4 + 2}px`, height: `${Math.random() * 4 + 2}px`, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -100, 0], opacity: [0.2, 0.8, 0.2], scale: [1, 1.3, 1] }}
            transition={{ duration: Math.random() * 5 + 4, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 3 }}
          />
        ))}
      </div>

      <AnimatePresence>
        {isCorrect && (
          <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center overflow-hidden">
            {[...Array(16)].map((_, i) => {
              const angle = (i / 16) * 360;
              const dist = Math.random() * 150 + 50;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 1, scale: 0.5, x: 0, y: 0 }}
                  animate={{ opacity: 0, scale: [0.5, 1.4, 0.8], x: Math.cos((angle * Math.PI) / 180) * dist, y: Math.sin((angle * Math.PI) / 180) * dist }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="absolute w-3 h-3 bg-[#D4AF37] rounded-full shadow-[0_0_10px_#D4AF37]"
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>

      <div className="relative z-20 w-full max-w-xl flex flex-col items-center space-y-2 pt-2">
        <div className="flex justify-between items-center w-full px-2">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-[#7A6C5E] font-bold">Vapros {currentIdx + 1} ot {totalQuizzes}</span>
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#7A6C5E] font-medium">{recipient}</span>
        </div>
        <div className="w-full h-1.5 bg-[#E2DACF] rounded-full overflow-hidden shadow-inner">
          <motion.div className="h-full bg-gradient-to-r from-[#C5A880] to-[#D4AF37]" initial={{ width: 0 }} animate={{ width: progressPercent + "%" }} transition={{ duration: 0.5 }} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 30, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -30, scale: 0.98 }}
          transition={{ duration: 0.4 }}
          className="relative z-20 w-full max-w-xl my-auto bg-white/80 backdrop-blur-xl border border-white/90 rounded-[32px] p-6 sm:p-10 shadow-2xl flex flex-col items-center justify-between text-center space-y-6"
        >
          <div className="space-y-2">
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#958679] font-bold block">✦ Interaktiven test ✦</span>
            <h2 className="font-serif italic text-xl sm:text-3xl text-[#1F1A17] leading-relaxed px-2">"{currentQuiz.question}"</h2>
            <div className="w-20 h-[1px] bg-[#958679]/30 mx-auto mt-2" />
          </div>

          <div className="space-y-3 w-full">
            {currentQuiz.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isShaking = shakeIndex === idx;

              let cardStyle = "bg-white/90 text-[#1F1A17] hover:bg-white hover:shadow-lg border border-[#E5DFDE]";
              let monogramStyle = "bg-[#FAF6EE] text-[#1F1A17] border border-[#DBCEB3]";

              if (isSelected) {
                if (isCorrect) {
                  cardStyle = "bg-[#DBCEB3]/90 text-[#1F1A17] shadow-xl border-[#D4AF37] font-bold";
                  monogramStyle = "bg-[#1F1A17] text-[#FEFEFD]";
                } else {
                  cardStyle = "bg-[#F2ECE9] text-[#7A6C5E] border-[#D8CFC4]";
                  monogramStyle = "bg-[#7A6C5E] text-[#FEFEFD]";
                }
              }

              return (
                <motion.div key={idx} animate={isShaking ? { x: [0, -10, 10, -8, 8, 0] } : { x: 0 }} transition={{ duration: 0.4 }}>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(idx)}
                    className={"w-full p-4 rounded-2xl flex items-center space-x-4 transition duration-300 backdrop-blur-md shadow-sm " + cardStyle}
                  >
                    <span className={"w-9 h-9 rounded-xl font-serif font-bold text-xs sm:text-sm flex items-center justify-center flex-shrink-0 shadow-inner " + monogramStyle}>
                      {OPTION_LETTERS[idx] || (idx + 1)}
                    </span>
                    <span className="font-sans text-xs sm:text-sm font-medium tracking-wide text-left flex-1">{opt}</span>
                  </motion.button>
                </motion.div>
              );
            })}
          </div>

          <AnimatePresence>
            {showWrongMessage && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#A35235] font-sans font-bold italic pt-1">
                ✦ Ne suvsem... Pomisli otnovo i opitay pak ✦
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-full pt-2">
            <AnimatePresence mode="wait">
              {isCorrect ? (
                <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.4 }} className="w-full">
                  <button onClick={handleNextQuiz} className="w-full bg-[#1F1A17] text-[#FEFEFD] py-4 text-xs uppercase tracking-[0.3em] font-bold rounded-xl font-sans hover:bg-[#635E57] transition shadow-lg">
                    {currentIdx < totalQuizzes - 1 ? "Sledvasht Vapros ➔" : "Kum Spomenite ➔"}
                  </button>
                </motion.div>
              ) : (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#958679] font-sans font-bold italic block">
                  ✦ Izberi verniya otgovor za prodalzhenie ✦
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 text-[8px] sm:text-[9px] uppercase tracking-[0.3em] text-[#958679] text-center pointer-events-none">
        GREETING ARCHIVE © 2026
      </div>
    </div>
  );
}

export default QuizStage;

