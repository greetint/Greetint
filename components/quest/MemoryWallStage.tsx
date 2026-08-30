'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface MemoryPhotoItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  questionOrCaption: string;
  correctAnswer: string;
}

interface MemoryWallStageProps {
  recipient?: string;
  memories?: MemoryPhotoItem[];
  onComplete?: () => void;
}

const DEFAULT_MEMORIES: MemoryPhotoItem[] = [
  {
    id: '1',
    url: '/images/assets/envelope_paper.jpeg',
    type: 'image',
    questionOrCaption: 'Къде беше направена тази незабравима снимка?',
    correctAnswer: 'море'
  },
  {
    id: '2',
    url: '/videos/envelope-open-desktop.mp4', 
    type: 'video',
    questionOrCaption: 'Какво си казвахме в този точно момент?',
    correctAnswer: 'щастие'
  },
  {
    id: '3',
    url: '/images/assets/envelope_paper.jpeg',
    type: 'image',
    questionOrCaption: 'Коя песен слушахме непрекъснато тогава?',
    correctAnswer: 'любима'
  }
];

const getXOffset = (idx: number, activeIdx: number) => {
  const offset = idx - activeIdx;
  if (offset === 0) return "0%";
  const sign = Math.sign(offset);
  const absOffset = Math.abs(offset);
  const val = 92.5 + (absOffset - 1) * 85;
  return `${sign * val}%`;
};

export function MemoryWallStage({ 
  recipient = "ВИКТОРИЯ", 
  memories = DEFAULT_MEMORIES,
  onComplete 
}: MemoryWallStageProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [unlockedFrames, setUnlockedFrames] = useState<number[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const currentMemory = memories[activeIdx];
  const isCurrentUnlocked = unlockedFrames.includes(activeIdx);

  const allFrameIndices = Array.from(
    { length: memories.length + 4 }, 
    (_, i) => i - 2
  );

  const handleAnswerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMemory) return;
    
    const isMatch = userAnswer.trim().toLowerCase() === currentMemory.correctAnswer.trim().toLowerCase();

    if (isMatch) {
      setUnlockedFrames(prev => [...prev, activeIdx]);
      setFeedbackMessage('✦ Позна! Прекрасен кадър! ✦');
    } else {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);

      if (nextAttempts >= 3) {
        setUnlockedFrames(prev => [...prev, activeIdx]);
        setFeedbackMessage('Ето ти кадъра, заслужаваш го! ❤️');
      } else {
        setFeedbackMessage(`Не съвсем... Опит ${nextAttempts} от 3.`);
      }
    }
  };

  const handleNextMemory = () => {
    setUserAnswer('');
    setAttempts(0);
    setFeedbackMessage('');
    if (activeIdx < memories.length - 1) {
      setActiveIdx(prev => prev + 1);
    } else if (onComplete) {
      onComplete();
    }
  };

  const handlePrevMemory = () => {
    if (activeIdx > 0) {
      setUserAnswer('');
      setAttempts(0);
      setFeedbackMessage('');
      setActiveIdx(prev => prev - 1);
    }
  };

  const jumpToFrame = (idx: number) => {
    if (idx >= 0 && idx < memories.length && isCurrentUnlocked && idx !== activeIdx) {
      setUserAnswer('');
      setAttempts(0);
      setFeedbackMessage('');
      setActiveIdx(idx);
    }
  };

  return (
    <div className="relative w-screen h-[100dvh] bg-[#ECE8E0] flex flex-col justify-between overflow-hidden select-none px-2 sm:px-6 pt-12 pb-3 sm:py-3">
      
      {/* СВЕТЪЛ ФОНОВ ПРЕЛИВНИК */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,1)_0%,_rgba(236,232,224,0.7)_100%)] pointer-events-none z-0" />

      {/* МАГИЧЕСКИ ЗВЕЗДИЧКИ ПРИ ОТКЛЮЧВАНЕ */}
      <AnimatePresence>
        {isCurrentUnlocked && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0, x: "50%", y: "50%" }}
                animate={{ opacity: [0, 1, 0], scale: [0.5, 2, 0.8], x: `${Math.random() * 90 - 45}vw`, y: `${Math.random() * 90 - 45}vh`, rotate: Math.random() * 360 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.8, ease: "easeOut" }}
                className="absolute top-1/2 left-1/2 text-3xl sm:text-5xl text-[#B8A386] drop-shadow-xl"
              >
                ✦
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* 🎞️ ЦЕНТРАЛНА КИНОЛЕНТА (КОМПАКТНА ЗА ТЕЛЕФОН С ВИДИМИ СЪСЕДНИ КАДРИ) */}
      <div className="relative z-10 w-full h-[70vh] sm:h-[78vh] flex items-center justify-center overflow-hidden my-auto">
        {allFrameIndices.map((frameIdx) => {
          const isActive = frameIdx === activeIdx;
          const isUnlocked = unlockedFrames.includes(frameIdx);
          const isEmpty = frameIdx < 0 || frameIdx >= memories.length;
          const memory = !isEmpty ? memories[frameIdx] : null;

          return (
            <motion.div
              key={`frame-${frameIdx}`}
              onClick={() => !isEmpty && jumpToFrame(frameIdx)}
              initial={false}
              animate={{ 
                x: getXOffset(frameIdx, activeIdx),
                scale: isActive ? 1 : 0.85,
                opacity: isActive ? 1 : 0.35,
                zIndex: isActive ? 30 : 10
              }}
              transition={{ type: "spring", stiffness: 220, damping: 28 }}
              className={`absolute m-auto top-0 bottom-0 left-0 right-0 w-[82vw] sm:w-[74vw] max-w-[1050px] h-[62vh] sm:h-full bg-[#141210] flex flex-col justify-between p-2 sm:p-3 shadow-[0_25px_60px_rgba(0,0,0,0.7)] border-x-2 border-[#2A2421] ${!isEmpty && !isActive && isUnlocked ? 'cursor-pointer hover:opacity-60' : ''}`}
            >
              {/* Горна перфорация */}
              <div className="h-2.5 sm:h-4 w-full flex items-center justify-around px-2 opacity-90 flex-shrink-0">
                {[...Array(24)].map((_, i) => <div key={i} className="w-2.5 sm:w-4 h-1.5 sm:h-2.5 bg-[#ECE8E0] rounded-[2px] shadow-inner" />)}
              </div>

              {/* МЕДИЯ И ОВЪРЛЕИ */}
              <div className="relative flex-1 w-full bg-black my-1 rounded-md sm:rounded-lg overflow-hidden flex items-center justify-center border border-white/5">
                {!isEmpty && memory && (
                  <>
                    {/* Същинският кадър */}
                    {memory.type === 'video' ? (
                      <video 
                        src={memory.url} 
                        controls={isUnlocked && isActive} 
                        autoPlay={isUnlocked && isActive} 
                        muted={!isUnlocked} 
                        playsInline 
                        className={`relative z-10 w-full h-full object-contain transition-all duration-1000 ${isUnlocked ? 'filter-none opacity-100' : 'filter blur-[10px] brightness-110 opacity-70'}`} 
                      />
                    ) : (
                      <img 
                        src={memory.url} 
                        className={`relative z-10 w-full h-full object-contain transition-all duration-1000 ${isUnlocked ? 'filter-none opacity-100' : 'filter blur-[10px] brightness-110 opacity-70'}`} 
                        alt="Memory Frame" 
                      />
                    )}
                    
                    {/* 🔒 ЗАКЛЮЧЕН СТЕЙТ - ПОЛЕ ЗА ВЪПРОС */}
                    {!isUnlocked && isActive && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 z-20 flex flex-col items-center justify-center p-4 sm:p-12 text-center bg-black/35 backdrop-blur-[2px]"
                      >
                        <div className="w-full max-w-xl space-y-3 sm:space-y-5">
                          <span className="text-[8px] sm:text-[10px] uppercase tracking-[0.5em] text-[#DBCEB3] font-bold drop-shadow-md">
                            ✦ Кадър {frameIdx + 1} ✦
                          </span>
                          
                          <p className="font-serif italic text-xs sm:text-2xl text-[#FEFEFD] leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] px-1">
                            "{memory.questionOrCaption}"
                          </p>
                          
                          <form onSubmit={handleAnswerSubmit} className="w-full max-w-md mx-auto flex flex-col sm:flex-row gap-2 pt-1">
                            <input
                              type="text"
                              value={userAnswer}
                              onChange={(e) => setUserAnswer(e.target.value)}
                              placeholder="Въведи отговора тук..."
                              className="flex-1 bg-black/50 backdrop-blur-md text-[#FEFEFD] placeholder-[#FEFEFD]/60 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl text-xs sm:text-sm tracking-wide text-center sm:text-left border border-white/20 focus:outline-none focus:border-[#DBCEB3] shadow-lg"
                            />
                            <button
                              type="submit"
                              className="bg-[#DBCEB3] text-[#141210] px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-[9px] sm:text-xs uppercase tracking-[0.3em] font-bold hover:bg-[#FEFEFD] transition duration-300 shadow-lg whitespace-nowrap"
                            >
                              Завърти ➔
                            </button>
                          </form>
                          
                          {feedbackMessage && (
                            <span className="text-[10px] sm:text-xs text-[#DBCEB3] italic block animate-pulse pt-0.5 drop-shadow-md">
                              {feedbackMessage}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* 🔓 ОТКЛЮЧЕН СТЕЙТ - ТЕКСТ ОТГОРЕ СЪС СВЕТЪЛ И ПРОЗРАЧЕН СТЪКЛЕН ФОН */}
                    {isUnlocked && isActive && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className="absolute top-3 left-3 right-3 sm:left-8 sm:right-8 py-2.5 px-4 sm:px-6 bg-[#FEFEFD]/25 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/30 text-center z-20 shadow-2xl"
                      >
                        {feedbackMessage && <p className="text-[9px] sm:text-[10px] text-[#FEFEFD] font-semibold italic pb-0.5 drop-shadow-md">{feedbackMessage}</p>}
                        <p className="font-serif italic text-xs sm:text-lg text-[#FEFEFD] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">"{memory.questionOrCaption}"</p>
                      </motion.div>
                    )}
                  </>
                )}
                {isEmpty && (
                  <div className="absolute inset-0 bg-[#0A0908] opacity-50 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay" />
                )}
              </div>

              {/* Долна перфорация */}
              <div className="h-2.5 sm:h-4 w-full flex items-center justify-around px-2 opacity-90 flex-shrink-0">
                {[...Array(24)].map((_, i) => <div key={i} className="w-2.5 sm:w-4 h-1.5 sm:h-2.5 bg-[#ECE8E0] rounded-[2px] shadow-inner" />)}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ДОЛНА СИНЕМАТИЧНА НАВИГАЦИЯ */}
      <div className="relative z-10 w-full max-w-5xl h-[7vh] sm:h-[8vh] flex items-center justify-between px-4 sm:px-10 mx-auto">
        <button
          onClick={handlePrevMemory}
          disabled={activeIdx === 0}
          className={`group flex items-center space-x-2 sm:space-x-3 text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-bold transition-all ${activeIdx === 0 ? 'opacity-30 cursor-not-allowed text-[#958679]' : 'text-[#635E57] hover:text-[#1F1A17]'}`}
        >
          <span className="w-6 sm:w-10 h-[2px] bg-current transition-all group-hover:w-10 sm:group-hover:w-16"></span>
          <span>Предишен</span>
        </button>

        {isCurrentUnlocked ? (
          <button
            onClick={handleNextMemory}
            className="bg-[#1F1A17] text-[#FEFEFD] px-7 sm:px-9 py-2.5 sm:py-3 rounded-full text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-bold shadow-[0_10px_20px_rgba(31,26,23,0.2)] hover:bg-[#635E57] hover:shadow-[0_15px_25px_rgba(31,26,23,0.3)] transition-all duration-300 flex items-center space-x-2"
          >
            <span>{activeIdx < memories.length - 1 ? 'Следващ' : 'Към Финала'}</span>
            <span className="text-[14px]">➔</span>
          </button>
        ) : (
           <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.4em] text-[#958679] opacity-70 italic font-medium">Очаква се отговор</span>
        )}
      </div>

    </div>
  );
}

export default MemoryWallStage;