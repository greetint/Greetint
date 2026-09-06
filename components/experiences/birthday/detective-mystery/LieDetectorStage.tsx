'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speakBulgarian, playSoundEffect } from './utils/speech';

interface QuestionItem {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface LieDetectorProps {
  recipient: string;
  questions?: QuestionItem[];
  isMuted?: boolean;
  onComplete: () => void;
}

export function LieDetectorStage({ recipient, questions, isMuted = false, onComplete }: LieDetectorProps) {
  const defaultQuestions: QuestionItem[] = [
    {
      question: `Въпрос 1: Колко силен е купонът тази вечер за субект ${recipient}?`,
      options: [
        "А) Обикновен семеен събор",
        "Б) Максимално федерално ниво на шума",
        "В) Легендарен рожден ден без право на алиби"
      ],
      correctAnswer: 2
    },
    {
      question: "Въпрос 2: Кой носи основната вина за прекаленото забавление?",
      options: [
        "А) Рожденикът с неограничена харизма",
        "Б) Инспекторът по купона",
        "В) Всички присъстващи съучастници"
      ],
      correctAnswer: 0
    },
    {
      question: "Въпрос 3: Каква е присъдата за следващите 12 месеца?",
      options: [
        "А) Строг арест на щастие и успехи",
        "Б) Неограничени пътувания и приключения",
        "В) Пълно помилване с много подаръци и торта"
      ],
      correctAnswer: 2
    }
  ];

  const testQuestions = (questions && questions.length > 0) ? questions : defaultQuestions;

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [typedQuestion, setTypedQuestion] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answerStatus, setAnswerStatus] = useState<'idle' | 'truth' | 'lie'>('idle');
  const [isScreenFlashing, setIsScreenFlashing] = useState(false);
  const [isTestFinished, setIsTestFinished] = useState(false);

  const currentQ = testQuestions[currentQIndex] || testQuestions[0];

  useEffect(() => {
    setTypedQuestion('');
    setSelectedOption(null);
    setAnswerStatus('idle');

    const fullText = currentQ.question;
    let charIndex = 0;
    let timer: NodeJS.Timeout;

    const typeNextChar = () => {
      if (charIndex < fullText.length) {
        setTypedQuestion(fullText.substring(0, charIndex + 1));
        if (charIndex % 3 === 0) {
          playSoundEffect('/audio/detective/typewriter.mp3', isMuted, 0.3);
        }
        charIndex++;
        timer = setTimeout(typeNextChar, 25);
      }
    };

    timer = setTimeout(typeNextChar, 100);

    if (currentQIndex === 0) {
      speakBulgarian(`Включен е полиграфският детектор на лъжата за субект ${recipient}. Отговорете на въпросите честно.`, isMuted, 0.92, 1.0);
    }

    return () => clearTimeout(timer);
  }, [currentQIndex, recipient, isMuted]);

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null || answerStatus !== 'idle') return;

    setSelectedOption(idx);
    const isCorrect = idx === currentQ.correctAnswer;

    if (isCorrect) {
      setAnswerStatus('truth');
      playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.7);
      speakBulgarian("Истина. Полиграфът отчита абсолютна искреност.", isMuted, 0.92, 1.0);
    } else {
      setAnswerStatus('lie');
      setIsScreenFlashing(true);
      playSoundEffect('/audio/detective/stamp.mp3', isMuted, 0.85);
      speakBulgarian("Засечена е лъжа!", isMuted, 0.92, 1.0);

      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([100, 50, 100]);
        } catch (e) {
          // ignore
        }
      }

      setTimeout(() => setIsScreenFlashing(false), 800);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < testQuestions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setIsTestFinished(true);
      playSoundEffect('/audio/detective/stamp.mp3', isMuted, 0.9);
      speakBulgarian(`Полиграфският тест приключи успешно за субект ${recipient}.`, isMuted, 0.92, 1.0);
    }
  };

  const ekgColor = answerStatus === 'lie' ? '#ef4444' : answerStatus === 'truth' ? '#22c55e' : '#22c55e';

  return (
    <div className="relative w-full h-full bg-[#080808] text-[#F7F4EF] font-mono flex flex-col items-center justify-center p-4 sm:p-6 select-none overflow-y-auto">
      
      <AnimatePresence>
        {isScreenFlashing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.75, 0, 0.75, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 bg-red-600 z-50 pointer-events-none mix-blend-screen"
          />
        )}
      </AnimatePresence>

      <div className="absolute top-0 left-0 right-0 h-16 bg-black/90 border-b-2 border-green-500/40 flex flex-col items-center justify-center px-4 overflow-hidden z-20 shadow-lg">
        <div className="flex items-center justify-between w-full max-w-4xl text-xs font-mono uppercase tracking-[0.25em]">
          <div className="flex items-center gap-2 text-green-400 font-bold">
            <span className={`w-3 h-3 rounded-full ${answerStatus === 'lie' ? 'bg-red-500 animate-ping' : 'bg-green-500 animate-pulse'}`} />
            <span>POLYGRAPH EKG // ТЕСТ НА ЛЪЖАТА</span>
          </div>
          <div className="text-neutral-400 text-[10px]">
            ВЪПРОС {currentQIndex + 1} / {testQuestions.length}
          </div>
        </div>

        <div className="w-full max-w-4xl h-6 overflow-hidden relative mt-1">
          <svg className="w-full h-full" viewBox="0 0 600 30" preserveAspectRatio="none">
            <motion.path
              d="M0,15 L100,15 L115,5 L130,25 L145,2 L160,28 L175,15 L300,15 L315,5 L330,25 L345,2 L360,28 L375,15 L500,15 L515,5 L530,25 L545,2 L560,28 L575,15 L600,15"
              fill="none"
              stroke={ekgColor}
              strokeWidth={answerStatus === 'lie' ? '3' : '2'}
              initial={{ pathLength: 0, opacity: 0.6 }}
              animate={{ 
                pathLength: [0, 1], 
                opacity: [0.6, 1, 0.6],
                scaleY: answerStatus === 'lie' ? [1, 2.5, 0.8, 2, 1] : 1
              }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
            />
          </svg>
        </div>
      </div>

      <div className="max-w-xl w-full bg-[#11100F] border-2 border-neutral-800 p-6 sm:p-10 rounded-3xl shadow-[0_0_60px_rgba(0,0,0,0.9)] text-center space-y-6 sm:space-y-8 relative z-30 mt-20 mb-8">
        
        {!isTestFinished ? (
          <div className="space-y-6">
            
            <div className="flex justify-between items-center text-xs text-neutral-400 border-b border-neutral-800 pb-3">
              <span className="text-green-400 font-bold uppercase tracking-widest">[ СУБЕКТ: {recipient.toUpperCase()} ]</span>
              <span className="text-neutral-500">ПОЛИГРАФ v2.6</span>
            </div>

            <div className="min-h-[80px] flex items-center justify-center">
              <h2 className="text-base sm:text-lg font-mono text-white font-bold leading-relaxed tracking-wide">
                {typedQuestion}
                <span className="animate-pulse text-green-500 ml-1">_</span>
              </h2>
            </div>

            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                let btnStyle = "bg-black/75 hover:bg-neutral-900 border-neutral-700 text-neutral-200";

                if (selectedOption !== null) {
                  if (idx === currentQ.correctAnswer) {
                    btnStyle = "bg-green-950/80 border-green-500 text-green-200 shadow-[0_0_20px_rgba(34,197,94,0.3)]";
                  } else if (isSelected) {
                    btnStyle = "bg-red-950/80 border-red-500 text-red-200 shadow-[0_0_20px_rgba(239,68,68,0.3)]";
                  } else {
                    btnStyle = "opacity-40 bg-black border-neutral-800 text-neutral-500";
                  }
                }

                return (
                  <motion.button
                    key={idx}
                    whileHover={selectedOption === null ? { scale: 1.02 } : {}}
                    whileTap={selectedOption === null ? { scale: 0.98 } : {}}
                    onClick={() => handleSelectOption(idx)}
                    disabled={selectedOption !== null}
                    className={`w-full text-left border p-4 rounded-2xl text-xs sm:text-sm font-mono transition cursor-pointer shadow-md flex items-center justify-between group ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    <span className="text-xs font-bold">
                      {selectedOption !== null && idx === currentQ.correctAnswer && "✓ ВЕРЕН"}
                      {isSelected && idx !== currentQ.correctAnswer && "✗ ГРЕШЕН"}
                      {selectedOption === null && <span className="opacity-0 group-hover:opacity-100 text-green-400">►</span>}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {answerStatus === 'truth' && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                  animate={{ scale: 1, opacity: 1, rotate: -4 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="pt-2"
                >
                  <div className="border-4 border-green-500 text-green-400 py-2.5 px-4 rounded-xl font-black uppercase text-sm tracking-[0.3em] bg-green-950/40 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                    TRUTH // ИСТИНА
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNextQuestion}
                    className="mt-4 w-full bg-green-600 hover:bg-green-500 text-black py-3.5 rounded-xl text-xs uppercase tracking-[0.25em] font-extrabold shadow-lg transition cursor-pointer"
                  >
                    [ СЛЕДВАЩ ВЪПРОС → ]
                  </motion.button>
                </motion.div>
              )}

              {answerStatus === 'lie' && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0, rotate: 10 }}
                  animate={{ scale: 1, opacity: 1, rotate: 4 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  className="pt-2 space-y-3"
                >
                  <div className="border-4 border-red-600 text-red-500 py-2.5 px-4 rounded-xl font-black uppercase text-sm tracking-[0.3em] bg-red-950/50 shadow-[0_0_30px_rgba(239,68,68,0.5)]">
                    DECEPTION DETECTED // ЛЪЖА
                  </div>
                  <p className="text-[11px] text-red-400 font-mono">
                    Полиграфът засече отклонение в сърдечния ритъм! Опитайте отново или продължете напред.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNextQuestion}
                    className="w-full bg-red-700 hover:bg-red-600 text-white py-3.5 rounded-xl text-xs uppercase tracking-[0.25em] font-extrabold shadow-lg transition cursor-pointer"
                  >
                    [ ПРОДЪЛЖИ ВЪПРЕКИ ТОВА → ]
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

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
                className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-500 hover:to-emerald-500 text-black py-4 rounded-2xl text-xs uppercase tracking-[0.25em] font-black shadow-xl transition border-2 border-green-400/60 cursor-pointer"
              >
                [ ПРЕДИМИ КЪМ ДИГИТАЛНАТА ЛУПА → ]
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
