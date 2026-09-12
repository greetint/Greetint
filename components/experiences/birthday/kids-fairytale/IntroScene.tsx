'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroSceneProps {
  childName: string;
  isMuted?: boolean;
  onComplete: () => void;
}

export function IntroScene({ childName, isMuted = false, onComplete }: IntroSceneProps) {
  const v1 = useRef<HTMLVideoElement | null>(null);
  const v2 = useRef<HTMLVideoElement | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const [mobile, setMobile] = useState(false);
  const [bookOpened, setBookOpened] = useState(false);
  const [audioEnded, setAudioEnded] = useState(false);
  const [holding, setHolding] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (audio.current) audio.current.muted = isMuted;
    if (v1.current) v1.current.muted = isMuted;
    if (v2.current) v2.current.muted = isMuted;
  }, [isMuted]);

  const handleOpenBook = () => {
    if (bookOpened) return;
    setBookOpened(true);
    if (audio.current) { audio.current.muted = isMuted; audio.current.currentTime = 0; audio.current.play().catch(() => {}); }
    if (v1.current) { v1.current.muted = isMuted; v1.current.currentTime = 0; v1.current.play().catch(() => {}); }
  };

  const startHold = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!audioEnded || unlocked) return;
    setHolding(true);
    timer.current = setTimeout(() => {
      setUnlocked(true);
      setHolding(false);
      audio.current?.pause();
      if (v2.current) { v2.current.currentTime = 0; v2.current.muted = isMuted; v2.current.play().catch(() => {}); }
    }, 900);
  };

  const cancelHold = () => {
    if (unlocked) return;
    if (timer.current) { clearTimeout(timer.current); timer.current = null; }
    setHolding(false);
  };

  const v1Src = mobile ? '/images/birthday/kids_fairytale/stage_1/stage1_part1_phone.mp4' : '/images/birthday/kids_fairytale/stage_1/stage1_part1_desktop.mp4';
  const v2Src = mobile ? '/images/birthday/kids_fairytale/stage_1/stage1_part2_phone.mp4' : '/images/birthday/kids_fairytale/stage_1/stage1_part2_desktop.mp4';

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-gradient-to-br from-amber-950 via-slate-950 to-indigo-950 z-50 flex items-center justify-center select-none cursor-none">
      <audio ref={audio} src="/audio/kids_fairytale/stage_1/voice.mp3" preload="auto" onEnded={() => setAudioEnded(true)} />
      
      <video ref={v1} src={v1Src} playsInline muted={isMuted} preload="auto" onContextMenu={(e) => e.preventDefault()} className={`absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none transition-opacity duration-700 ${bookOpened && !unlocked ? 'opacity-100' : 'opacity-0'}`} />
      <video ref={v2} src={v2Src} playsInline muted={isMuted} preload="auto" onEnded={onComplete} onContextMenu={(e) => e.preventDefault()} className={`absolute inset-0 w-full h-full object-cover z-10 pointer-events-none select-none transition-opacity duration-700 ${unlocked ? 'opacity-100' : 'opacity-0'}`} />

      <AnimatePresence>
        {!bookOpened && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center p-4 cursor-none pointer-events-auto" onClick={handleOpenBook} onTouchStart={handleOpenBook}>
            <div style={{ perspective: 1600 }} className="relative flex flex-col items-center justify-center cursor-none">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 1.1, opacity: 0, rotateY: -120 }}
                transition={{ duration: 0.7 }}
                className="relative w-[300px] h-[420px] sm:w-[380px] sm:h-[520px] rounded-r-3xl rounded-l-md shadow-[0_30px_70px_rgba(180,130,20,0.7)] border-4 border-amber-400 bg-gradient-to-br from-amber-100 via-yellow-100 to-amber-200 p-8 flex flex-col items-center justify-between text-center overflow-hidden cursor-none group"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-600 shadow-inner" />
                <div className="absolute inset-4 border-2 border-dashed border-amber-500/40 rounded-2xl pointer-events-none" />

                <div className="relative z-10 pt-4">
                  <span className="font-cinzel text-xs uppercase tracking-[0.3em] font-bold text-amber-800">
                    Вълшебна Книга
                  </span>
                </div>

                <div className="relative z-10 my-auto px-4 space-y-4">
                  <h1 className="font-cinzel text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-amber-800 via-yellow-700 to-amber-950 drop-shadow-[0_2px_8px_rgba(255,215,0,0.5)] leading-tight">
                    Вълшебната приказка за {childName}
                  </h1>
                  <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full" />
                </div>

                <div className="relative z-10 pb-4">
                  <motion.span 
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="inline-block font-cinzel text-xs sm:text-sm font-bold text-amber-950 bg-amber-300/80 px-6 py-2.5 rounded-full shadow-md border border-white"
                  >
                    Докосни книгата, за да я отвориш
                  </motion.span>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: -25 }} animate={{ opacity: bookOpened && !unlocked ? 1 : 0, y: bookOpened && !unlocked ? 0 : -25 }} transition={{ duration: 1.2 }} className="absolute top-10 inset-x-0 z-30 text-center px-4 pointer-events-none">
        <h1 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-300 to-amber-600 drop-shadow-[0_4px_16px_rgba(255,215,0,0.7)]">
          Вълшебната приказка за {childName} започва сега...
        </h1>
      </motion.div>

      {audioEnded && !unlocked && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-between py-16 px-4 pointer-events-auto cursor-none" onClick={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}>
          <div className="h-10" />
          <div className="relative flex items-center justify-center w-40 h-40 md:w-56 md:h-56 cursor-none rounded-full my-auto group" onMouseDown={startHold} onMouseUp={cancelHold} onMouseLeave={cancelHold} onTouchStart={startHold} onTouchEnd={cancelHold}>
            <motion.div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 opacity-40 blur-2xl" animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} />
            {holding && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1.8, opacity: [0.8, 0] }} transition={{ repeat: Infinity, duration: 0.8 }} className="absolute inset-0 rounded-full border-4 border-amber-300 bg-amber-300/30 blur-sm pointer-events-none shadow-[0_0_50px_rgba(255,215,0,0.9)]" />
            )}
            <div className="relative z-10 w-28 h-28 rounded-full bg-gradient-to-br from-amber-400 via-yellow-400 to-amber-600 p-1 shadow-[0_0_35px_rgba(255,215,0,0.8)] flex items-center justify-center border-2 border-white">
              <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center text-amber-300 font-bold text-xs shadow-inner">КЛЮЧ</div>
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-12 text-center z-30 px-4 pointer-events-none">
            <p className="font-cinzel text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-amber-100 via-yellow-300 to-amber-600 drop-shadow-[0_2px_10px_rgba(255,215,0,0.8)]">
              Задръж и вземи ключа, {childName}!
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
export default IntroScene;
