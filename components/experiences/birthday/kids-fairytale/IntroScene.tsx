'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

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
  const [hasStarted, setHasStarted] = useState(false);
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

  const handleStartMagic = () => {
    setHasStarted(true);
    if (audio.current) { audio.current.muted = isMuted; audio.current.currentTime = 0; audio.current.play().catch(() => {}); }
    if (v1.current) { v1.current.muted = isMuted; v1.current.currentTime = 0; v1.current.play().catch(() => {}); }
  };

  const v1Ended = () => {
    if (v1.current) { v1.current.pause(); v1.current.currentTime = v1.current.duration - 0.05; }
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
    }, 400);
  };

  const cancelHold = () => {
    if (unlocked) return;
    if (timer.current) { clearTimeout(timer.current); timer.current = null; }
    setHolding(false);
  };

  const v1Src = mobile ? '/images/birthday/kids_fairytale/stage_1/stage1_part1_phone.mp4' : '/images/birthday/kids_fairytale/stage_1/stage1_part1_desktop.mp4';
  const v2Src = mobile ? '/images/birthday/kids_fairytale/stage_1/stage1_part2_phone.mp4' : '/images/birthday/kids_fairytale/stage_1/stage1_part2_desktop.mp4';

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black z-50 flex items-center justify-center select-none">
      <audio ref={audio} src="/audio/kids_fairytale/stage_1/voice.mp3" preload="auto" onEnded={() => setAudioEnded(true)} />
      <video ref={v1} src={v1Src} playsInline muted={isMuted} preload="auto" onEnded={v1Ended} className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ${unlocked ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} />
      <video ref={v2} src={v2Src} playsInline muted={isMuted} preload="auto" onEnded={onComplete} className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-700 ${unlocked ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />

      <AnimatePresence>
        {!hasStarted && (
          <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }} className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <motion.button initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} onClick={handleStartMagic} className="px-8 py-5 rounded-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-bold text-xl md:text-2xl shadow-[0_0_35px_rgba(255,215,0,0.8)] border border-amber-200 cursor-pointer flex items-center gap-3 font-serif">
              <span>Влез в магията</span>
              <span className="text-2xl">✨</span>
            </motion.button>
            <p className="mt-4 text-amber-200/80 text-sm md:text-base font-serif drop-shadow">Докосни, за да започне вълшебната приказка</p>
          </motion.div>
        )}
      </AnimatePresence>

      {audioEnded && !unlocked && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-between py-12 px-4 pointer-events-auto">
          <div className="h-10" />
          <div className="relative flex items-center justify-center w-36 h-36 md:w-48 md:h-48 cursor-pointer rounded-full my-auto" onMouseDown={startHold} onMouseUp={cancelHold} onMouseLeave={cancelHold} onTouchStart={startHold} onTouchEnd={cancelHold}>
            {holding && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Sparkles className="absolute -top-6 -left-6 w-10 h-10 text-amber-300 animate-ping" />
                <Sparkles className="absolute -bottom-6 -right-6 w-10 h-10 text-yellow-300 animate-bounce" />
                <Sparkles className="absolute top-0 right-[-30px] w-8 h-8 text-amber-200 animate-pulse" />
                <Sparkles className="absolute bottom-0 left-[-30px] w-8 h-8 text-yellow-200 animate-spin" />
              </div>
            )}
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-12 text-center z-30 px-4">
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 drop-shadow-[0_0_20px_rgba(255,215,0,0.8)] font-serif text-3xl md:text-5xl font-bold tracking-wide">
              Вземи ключа, {childName}!
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
export default IntroScene;
