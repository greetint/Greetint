'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface IntroProps { childName: string; isMuted?: boolean; onComplete: () => void; }

export function IntroScene({ childName, isMuted = false, onComplete }: IntroProps) {
  const v1 = useRef<HTMLVideoElement | null>(null);
  const v2 = useRef<HTMLVideoElement | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const req = useRef<number | null>(null);
  const startT = useRef<number>(0);

  useEffect(() => {
    if (audio.current) {
      if (isMuted) audio.current.pause();
      else if (started && !ended) audio.current.play().catch(() => {});
    }
  }, [isMuted, started, ended]);

  useEffect(() => {
    v1.current?.play().catch(() => {
      const fn = () => {
        if (v1.current?.paused) v1.current.play().catch(() => {});
        window.removeEventListener('click', fn);
        window.removeEventListener('touchstart', fn);
      };
      window.addEventListener('click', fn);
      window.addEventListener('touchstart', fn);
    });
  }, []);

  const timeUpdate = () => {
    if (!v1.current || started) return;
    if (v1.current.currentTime >= 2.0) {
      setStarted(true);
      if (!isMuted) audio.current?.play().catch(() => {});
    }
  };

  const v1Ended = () => {
    if (v1.current) {
      v1.current.pause();
      v1.current.currentTime = v1.current.duration - 0.05;
    }
  };

  const startHold = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!ended || unlocked) return;
    setHolding(true);
    startT.current = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startT.current;
      const p = Math.min((elapsed / 1500) * 100, 100);
      setProgress(p);
      if (p >= 100) {
        setUnlocked(true);
        setHolding(false);
        audio.current?.pause();
        v2.current?.play().catch(() => {});
      } else {
        req.current = requestAnimationFrame(animate);
      }
    };
    req.current = requestAnimationFrame(animate);
  };

  const cancelHold = () => {
    if (unlocked) return;
    if (req.current) cancelAnimationFrame(req.current);
    setHolding(false);
    setProgress(0);
  };
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black z-50 flex items-center justify-center select-none">
      <audio ref={audio} src="/audio/kids_fairytale/stage_1/voice.mp3" onEnded={() => setEnded(true)} />
      <video ref={v1} src="/images/birthday/kids_fairytale/stage_1/stage1_part1.mp4" playsInline muted onTimeUpdate={timeUpdate} onEnded={v1Ended} className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ${unlocked ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} />
      <video ref={v2} src="/images/birthday/kids_fairytale/stage_1/stage1_part2.mp4" playsInline muted onEnded={onComplete} className={`absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-700 ${unlocked ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />
      {!unlocked && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-between py-12 px-4 pointer-events-auto">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center z-30 mt-6">
            <p className="text-white/90 text-lg md:text-2xl font-serif drop-shadow-md">Имало едно време вълшебно царство...</p>
            <h1 className="text-amber-300 text-3xl md:text-5xl font-bold mt-2 drop-shadow-lg">✦ {childName} ✦</h1>
          </motion.div>
          <div className="relative flex flex-col items-center justify-center my-auto">
            <div className={`relative cursor-pointer flex items-center justify-center p-6 rounded-full select-none ${!ended ? 'cursor-not-allowed opacity-75' : 'hover:scale-105 active:scale-95'}`} onMouseDown={ended ? startHold : undefined} onMouseUp={ended ? cancelHold : undefined} onMouseLeave={ended ? cancelHold : undefined} onTouchStart={ended ? startHold : undefined} onTouchEnd={ended ? cancelHold : undefined}>
              {ended && (
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255, 215, 0, 0.2)" strokeWidth="8" />
                  <circle cx="70" cy="70" r="60" fill="none" stroke="#FFD700" strokeWidth="8" strokeDasharray="376.99" strokeDashoffset={376.99 - (376.99 * progress) / 100} strokeLinecap="round" />
                </svg>
              )}
              <motion.img src="/images/birthday/kids_fairytale/stage1/key.png" alt="Golden Key" animate={ended && !holding ? { y: [-6, 6, -6], rotate: [-2, 2, -2] } : {}} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} className="w-32 md:w-44 h-auto object-contain drop-shadow-[0_0_30px_rgba(255,215,0,0.9)] select-none pointer-events-none" />
              {holding && <div className="absolute inset-0 rounded-full bg-amber-400/30 blur-xl animate-pulse pointer-events-none" />}
            </div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center z-30">
              {!ended ? (
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/30 text-amber-200 text-sm md:text-base font-medium shadow-xl">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                  <span>Слушай разказвача...</span>
                </div>
              ) : (
                <div className="inline-flex flex-col items-center gap-1">
                  <span className="px-6 py-3 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/60 text-amber-300 text-sm md:text-base font-bold shadow-xl animate-bounce">🗝️ Задръж пръст върху ключа, за да отключиш портите!</span>
                  {holding && <span className="text-amber-200 text-xs mt-1 font-semibold">Отключване: {Math.round(progress)}%</span>}
                </div>
              )}
            </motion.div>
          </div>
          <div className="h-10" />
        </div>
      )}
    </div>
  );
}
export default IntroScene;
