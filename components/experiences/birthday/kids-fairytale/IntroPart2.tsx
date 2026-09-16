'use client';
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STAGE_VIDEOS } from './VideoPlayerManager';
import { Sparkles, Key } from 'lucide-react';

interface IntroPart2Props {
  childName: string;
  isMuted?: boolean;
  onComplete: () => void;
}

export function IntroPart2({ childName, isMuted = false, onComplete }: IntroPart2Props) {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const src = mobile ? STAGE_VIDEOS.stage1.part2Phone : STAGE_VIDEOS.stage1.part2Desktop;

  const start = (e: any) => {
    e.preventDefault();
    if (done) return;
    setIsHolding(true);
    const t0 = Date.now();
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const p = Math.min(100, ((Date.now() - t0) / 1500) * 100);
      setProgress(p);
      if (p >= 100) {
        clearInterval(timerRef.current);
        setDone(true);
        setIsHolding(false);
        setTimeout(onComplete, 1200);
      }
    }, 30);
  };

  const stop = () => {
    if (done) return;
    setIsHolding(false);
    setProgress(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-black flex items-center justify-center select-none z-50">
      <div className="absolute inset-0 z-[1] w-full h-full">
        <video ref={videoRef} src={src} muted={true} playsInline={true} webkit-playsinline="true" autoPlay={true} preload="auto" loop controls={false} disablePictureInPicture={true} onContextMenu={e => e.preventDefault()} className="w-full h-full object-cover object-center" />
      </div>

      {!done && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="absolute top-8 inset-x-4 max-w-2xl mx-auto z-[40] pointer-events-none text-center">
          <div className="bg-amber-950/60 backdrop-blur-md border border-amber-400/80 rounded-2xl p-4 sm:p-6 text-amber-100 font-serif shadow-2xl">
            <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-300 to-amber-400 mb-1">Вълшебният ключ към замъка</h1>
            <p className="text-xs sm:text-sm text-amber-200/90 font-sans">Натисни и задръж златния ключ за 1.5 секунди, за да активираш магията ✨</p>
          </div>
        </motion.div>
      )}

      <div className="absolute inset-0 z-[40] flex items-center justify-center pointer-events-auto">
        <div className="relative cursor-pointer group p-12 sm:p-16 flex items-center justify-center select-none" onMouseDown={start} onMouseUp={stop} onMouseLeave={stop} onTouchStart={start} onTouchEnd={stop} onTouchCancel={stop}>
          <motion.div animate={{ scale: isHolding ? [1, 1.4, 1.7] : [1, 1.15, 1], opacity: isHolding ? [0.6, 0.9, 1] : [0.3, 0.6, 0.3] }} transition={{ duration: isHolding ? 0.6 : 2, repeat: Infinity, ease: 'easeInOut' }} className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/50 via-amber-300/70 to-yellow-500/50 blur-3xl pointer-events-none" />
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-amber-400/40 flex items-center justify-center bg-amber-950/40 backdrop-blur-sm shadow-[0_0_40px_rgba(255,215,0,0.6)] group-hover:border-amber-300 transition-all">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255, 215, 0, 0.2)" strokeWidth="6" />
              <circle cx="50" cy="50" r="44" fill="none" stroke="#FBBF24" strokeWidth="6" strokeDasharray={276.46} strokeDashoffset={276.46 - (276.46 * progress) / 100} strokeLinecap="round" className="transition-all duration-75" />
            </svg>
            <div className="relative flex flex-col items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
              <Key className="w-10 h-10 sm:w-12 sm:h-12 drop-shadow-[0_0_15px_rgba(255,215,0,0.9)] animate-pulse" />
              <span className="text-[10px] sm:text-xs font-serif font-bold text-amber-200 mt-1 tracking-wider uppercase">{isHolding ? `${Math.round(progress)}%` : 'Задръж ✨'}</span>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {done && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[60] flex items-center justify-center bg-yellow-500/85 backdrop-blur-xl pointer-events-none">
            <motion.div initial={{ scale: 0.5, rotate: -10 }} animate={{ scale: [1, 1.3, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="text-center p-8 text-amber-950 font-serif space-y-4">
              <Sparkles className="w-24 h-24 mx-auto text-yellow-100 drop-shadow-[0_0_50px_rgba(255,255,255,1)] animate-spin" />
              <h2 className="text-3xl sm:text-5xl font-black text-white drop-shadow-[0_4px_25px_rgba(0,0,0,0.6)]">Ключът отключи магията! ✨</h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default IntroPart2;
