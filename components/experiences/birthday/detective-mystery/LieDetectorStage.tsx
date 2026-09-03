'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speakBulgarian, playSoundEffect } from './utils/speech';

interface LieDetectorProps {
  recipient: string;
  isMuted?: boolean;
  onComplete: () => void;
}

export function LieDetectorStage({ recipient, isMuted = false, onComplete }: LieDetectorProps) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isTestPassed, setIsTestPassed] = useState(false);

  const questions = [
    {
      question: `Въпрос 1: Колко силен е купонът тази вечер за субект ${recipient}?`,
      options: [
        "А) Обикновен семеен събор",
        "Б) Максимално федерално ниво на шума",
        "В) Легендарен рожден ден без право на алиби"
      ]
    },
    {
      question: "Въпрос 2: Кой носи основната вина за прекаленото забавление?",
      options: [
        "А) Рожденикът с неограничена харизма",
        "Б) Инспекторът по купона",
        "В) Всички присъстващи съучастници"
      ]
    },
    {
      question: "Въпрос 3: Каква е присъдата за следващите 12 месеца?",
      options: [
        "А) Строг арест на щастие и успехи",
        "Б) Неограничени пътувания и приключения",
        "В) Пълно помилване с много подаръци и торта"
      ]
    }
  ];

  useEffect(() => {
    speakBulgarian(`Включен е полиграфският детектор на лъжата за субект ${recipient}. Отговорете на въпросите честно.`, isMuted, 0.92, 1.0);
    return () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
  }, [recipient, isMuted]);

  const handleSelectOption = (idx: number) => {
    playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.6);
    setSelectedAnswers([...selectedAnswers, idx]);
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setIsTestPassed(true);
      playSoundEffect('/audio/detective/stamp.mp3', isMuted, 0.8);
      speakBulgarian("Полиграфът потвърди. Субектът е искрен.", isMuted, 0.92, 1.0);
    }
  };

  return (
    <div className="relative w-full h-full bg-[#0a0a0a] text-[#F7F4EF] font-mono flex flex-col items-center justify-center p-4 sm:p-6 select-none overflow-y-auto">
      <div className="absolute top-4 left-0 right-0 h-12 bg-black/80 border-y border-green-500/40 flex items-center justify-center px-4 overflow-hidden z-20">
        <div className="flex items-center gap-3 text-green-400 text-xs font-mono uppercase tracking-[0.3em]">
          <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <span>POLYGRAPH ACTIVE // ДЕТЕКТОР НА ЛЪЖАТА</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse" />
      </div>

      <div className="max-w-xl w-full bg-[#121110] border-2 border-green-600/60 p-6 sm:p-10 rounded-3xl shadow-[0_0_50px_rgba(34,197,94,0.15)] text-center space-y-6 sm:space-y-8 relative z-30 mt-16 mb-8">
        {!isTestPassed ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center text-xs text-neutral-400 border-b border-neutral-800 pb-3">
              <span className="text-green-400 font-bold uppercase tracking-widest">Тест №{currentQIndex + 1} от {questions.length}</span>
              <span>Субект: {recipient}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-serif text-white font-bold leading-relaxed">
              {questions[currentQIndex].question}
            </h2>
            <div className="space-y-3 pt-2">
              {questions[currentQIndex].options.map((opt, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelectOption(idx)}
                  className="w-full text-left bg-black/75 hover:bg-green-950/40 border border-green-600/30 hover:border-green-500 text-neutral-200 p-4 rounded-2xl text-xs sm:text-sm font-mono transition cursor-pointer shadow-md flex items-center justify-between group"
                >
                  <span>{opt}</span>
                  <span className="text-green-500 opacity-0 group-hover:opacity-100 transition-opacity">►</span>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4 animate-fade-in">
            <div className="w-16 h-16 bg-green-950 text-green-400 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto text-2xl shadow-lg">
              ✓
            </div>
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-green-500 font-bold block">ТЕСТЪТ Е УСПЕШНО ПРЕМИНАТ</span>
              <h2 className="text-2xl font-serif font-bold text-white uppercase">Полиграфът потвърждава</h2>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Субектът <strong className="text-white">{recipient}</strong> показа 100% искреност и максимално ниво на празнуване!
              </p>
            </div>
            <div className="pt-4">
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onComplete}
                className="w-full bg-gradient-to-r from-green-700 via-green-600 to-emerald-700 hover:from-green-600 hover:to-emerald-600 text-black py-4 rounded-2xl text-xs uppercase tracking-[0.25em] font-extrabold shadow-xl transition border-2 border-green-400/50 cursor-pointer"
              >
                [ ПРИЕМИ И КЪМ ЛУПАТА НА ЖЕЛАНИЯТА → ]
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
