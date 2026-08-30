'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SealStageProps {
  recipient?: string;
  onComplete?: () => void;
  onUnlock?: () => void;
}

export function SealStage({ recipient = "Виктория", onComplete, onUnlock }: SealStageProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isActionPlaying, setIsActionPlaying] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const desktopIdleRef = useRef<HTMLVideoElement>(null);
  const desktopActionRef = useRef<HTMLVideoElement>(null);
  const mobileIdleRef = useRef<HTMLVideoElement>(null);
  const mobileActionRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (desktopIdleRef.current) desktopIdleRef.current.load();
    if (desktopActionRef.current) desktopActionRef.current.load();
    if (mobileIdleRef.current) mobileIdleRef.current.load();
    if (mobileActionRef.current) mobileActionRef.current.load();
  }, []);

  const handleStartInteraction = () => {
    setHasStarted(true);

    if (desktopIdleRef.current) {
      desktopIdleRef.current.currentTime = 0;
      desktopIdleRef.current.play().catch(() => {});
    }
    if (mobileIdleRef.current) {
      mobileIdleRef.current.currentTime = 0;
      mobileIdleRef.current.play().catch(() => {});
    }

    if (audioRef.current) {
      audioRef.current.volume = 1.0;
      audioRef.current.play().catch(() => {});
    }
  };

  const startHolding = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (!hasStarted) return;
    setIsHolding(true);
    let currentProgress = 0;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const bgAudio = document.getElementById('bg-music-player') as HTMLAudioElement;
    if (bgAudio && bgAudio.paused) {
      bgAudio.volume = 0.35;
      bgAudio.play().catch(() => {});
    }

    timerRef.current = setInterval(() => {
      currentProgress += 1.4;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        if (timerRef.current) clearInterval(timerRef.current);
        triggerUnlock();
      }
    }, 25);
  };

  const stopHolding = () => {
    if (!hasStarted) return;
    setIsHolding(false);
    setProgress(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const triggerUnlock = () => {
    setIsActionPlaying(true);
    
    if (desktopIdleRef.current) desktopIdleRef.current.pause();
    if (mobileIdleRef.current) mobileIdleRef.current.pause();
    
    if (desktopActionRef.current) {
      desktopActionRef.current.currentTime = 0;
      desktopActionRef.current.playbackRate = 0.85;
      desktopActionRef.current.play().catch(() => {});
    }

    if (mobileActionRef.current) {
      mobileActionRef.current.currentTime = 0;
      mobileActionRef.current.playbackRate = 0.85;
      mobileActionRef.current.play().catch(() => {});
    }

    setTimeout(() => {
      setIsUnlocked(true);
    }, 4200);
  };

  const handleProceedToQuest = () => {
    if (onUnlock) onUnlock();
    if (onComplete) onComplete();
  };

  return (
    <div className="relative w-screen h-[100dvh] bg-[#1F1A17] flex flex-col items-center justify-between overflow-hidden select-none">
      <audio ref={audioRef} src="/audio/narrator-intro.mp3" preload="auto" />

      {/* 1. НАЧАЛЕН OVERLAY */}
      <AnimatePresence>
        {!hasStarted && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={handleStartInteraction}
            onTouchEnd={handleStartInteraction}
            className="fixed inset-0 z-50 bg-[#1F1A17] flex flex-col items-center justify-center p-6 cursor-pointer touch-none"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(45,39,35,0.95)_0%,_rgba(31,26,23,0.98)_80%)] pointer-events-none" />
            
            <motion.div
              animate={{ scale: [1, 1.015, 1], opacity: [0.95, 1, 0.95] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              className="text-center space-y-6 z-10 max-w-xl px-4"
            >
              <span className="text-xs uppercase tracking-[0.6em] text-[#958679] font-sans font-bold block leading-relaxed">
                ГРИЙТИНТ КИНЕМАТОГРАФИЯ
              </span>
              <h2 className="font-serif italic text-3xl sm:text-6xl text-[#FEFEFD] tracking-wide leading-tight">
                Имате неочаквано писмо...
              </h2>
              <div className="pt-4">
                <button
                  onClick={handleStartInteraction}
                  className="bg-[#DBCEB3] text-[#1F1A17] px-10 py-4 text-xs uppercase tracking-[0.3em] font-bold rounded-2xl shadow-[0_15px_30px_rgba(0,0,0,0.4)] font-sans hover:bg-[#FEFEFD] transition duration-300"
                >
                  Отвори Екрана 🎬
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 bg-[#1F1A17] pointer-events-none z-0" />

      {/* ================================================================= */}
      {/* А. ДЕСКТОП ВАРИАНТ (КОМПЮТЪР / ЛАПТОП)                              */}
      {/* ================================================================= */}
      <motion.div 
        animate={{ 
          scale: isUnlocked ? 1.05 : 1,
          opacity: isUnlocked ? 0 : 1
        }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex absolute inset-0 w-full h-full items-center justify-center z-10 overflow-hidden"
      >
        <div className="relative w-full h-full flex items-center justify-center bg-[#1F1A17]">
          <video
            ref={desktopIdleRef}
            src="/videos/envelope-idle-desktop.mp4"
            muted
            playsInline
            autoPlay
            preload="auto"
            className={`absolute inset-0 w-full h-full object-contain z-0 select-none pointer-events-none transition-opacity duration-700 ${isActionPlaying ? 'opacity-0' : 'opacity-100'}`}
          />

          <video
            ref={desktopActionRef}
            src="/videos/envelope-open-desktop.mp4"
            muted
            playsInline
            preload="auto"
            className={`absolute inset-0 w-full h-full object-contain z-10 select-none pointer-events-none transition-opacity duration-700 ${isActionPlaying ? 'opacity-100' : 'opacity-0'}`}
          />

          {!isActionPlaying && !isUnlocked && hasStarted && (
            <div
              className="absolute z-30 cursor-pointer touch-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full"
              style={{
                top: '66%',      
                left: '50.5%',   
                width: '120px',  
                height: '120px', 
              }}
              onMouseDown={startHolding}
              onMouseUp={stopHolding}
              onMouseLeave={stopHolding}
              onTouchStart={startHolding}
              onTouchEnd={stopHolding}
            >
              <AnimatePresence>
                {isHolding && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1.2 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute inset-2 rounded-full bg-[radial-gradient(circle,_rgba(219,206,179,0.85)_0%,_rgba(219,206,179,0)_75%)] blur-2xl pointer-events-none"
                  />
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>


      {/* ================================================================= */}
      {/* Б. МОБИЛЕН ВАРИАНТ (ТЕЛЕФОН) — ПОДОБРЕН И ЦЕНТРИРАН                 */}
      {/* ================================================================= */}
      <motion.div 
        animate={{ 
          scale: isUnlocked ? 1.05 : 1,
          opacity: isUnlocked ? 0 : 1
        }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex md:hidden absolute inset-0 w-full h-full items-center justify-center z-10 overflow-hidden"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <video
            ref={mobileIdleRef}
            src="/videos/envelope-idle-mobile.mp4"
            muted
            playsInline
            autoPlay
            preload="auto"
            className={`absolute inset-0 w-full h-full object-contain p-4 z-0 select-none pointer-events-none transition-opacity duration-700 ${isActionPlaying ? 'opacity-0' : 'opacity-100'}`}
          />

          <video
            ref={mobileActionRef}
            src="/videos/envelope-open-mobile.mp4"
            muted
            playsInline
            preload="auto"
            className={`absolute inset-0 w-full h-full object-contain p-4 z-10 select-none pointer-events-none transition-opacity duration-700 ${isActionPlaying ? 'opacity-100' : 'opacity-0'}`}
          />

          {!isActionPlaying && !isUnlocked && hasStarted && (
            <div
              className="absolute z-30 cursor-pointer touch-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center rounded-full"
              style={{
                top: '59%',      
                left: '50%',     
                width: '100px',  
                height: '100px', 
              }}
              onMouseDown={startHolding}
              onMouseUp={stopHolding}
              onMouseLeave={stopHolding}
              onTouchStart={startHolding}
              onTouchEnd={stopHolding}
            >
              <AnimatePresence>
                {isHolding && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1.2 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="absolute inset-2 rounded-full bg-[radial-gradient(circle,_rgba(219,206,179,0.85)_0%,_rgba(219,206,179,0)_75%)] blur-2xl pointer-events-none"
                  />
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </motion.div>

      {/* ИНСТРУКЦИЯ ОТДОЛУ (С ДОБРО ОТСТОЯНИЕ) */}
      <AnimatePresence>
        {!isUnlocked && !isActionPlaying && hasStarted && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4 }}
            className="relative z-20 text-center pb-8 pt-4 pointer-events-none"
          >
            <p className="font-serif italic text-base sm:text-2xl text-[#DBCEB3] tracking-wide drop-shadow-sm">
              Натисни и задръж златния печат
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. ОТКЛЮЧЕН ЛИСТ НА ЦЯЛ ЕКРАН */}
      <AnimatePresence>
        {isUnlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center p-0"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-screen h-screen flex flex-col items-center justify-between p-6 sm:p-20 text-center overflow-hidden"
            >
              <div 
                className="absolute inset-0 z-0 transform rotate-90 scale-[2.5]"
                style={{
                  backgroundImage: `url('/images/assets/envelope_paper.jpeg')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              />

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.6, delay: 0.4 }}
                className="w-full h-full max-w-2xl flex flex-col justify-between items-center z-10 py-10"
              >
                <div className="space-y-2">
                  <span className="text-[10px] sm:text-xs uppercase tracking-[0.5em] text-[#958679] font-sans font-bold block">
                    СПЕЦИАЛНО ПРЕЖИВЯВАНЕ
                  </span>
                  <h2 className="font-serif italic text-xl sm:text-4xl text-[#635E57] tracking-wide">
                    Честит Рожден Ден,
                  </h2>
                </div>

                <div className="py-2">
                  <h1 className="font-serif text-4xl sm:text-8xl text-[#1F1A17] uppercase tracking-wider font-light drop-shadow-sm">
                    {recipient}
                  </h1>
                  <div className="w-24 sm:w-28 h-[1px] bg-[#958679]/40 mx-auto mt-3" />
                </div>

                <div className="space-y-4 sm:space-y-6 w-full max-w-md">
                  <p className="font-serif italic text-sm sm:text-xl text-[#635E57] leading-relaxed">
                    "Подготвили сме ти неща, които да отключиш..."
                  </p>

                  <div>
                    <button
                      onClick={handleProceedToQuest}
                      className="bg-[#1F1A17] text-[#FEFEFD] px-8 py-3.5 sm:px-10 sm:py-4 text-xs uppercase tracking-[0.3em] font-bold rounded-xl shadow-[0_15px_30px_rgba(31,26,23,0.25)] font-sans hover:bg-[#958679] transition duration-300"
                    >
                      Започни Приключението ➔
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default SealStage;