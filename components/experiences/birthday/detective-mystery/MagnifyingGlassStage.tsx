'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { speakBulgarian, playSoundEffect } from './utils/speech';

interface MagnifyingGlassProps {
  secretMemory: string;
  secretPassword?: string;
  isMuted?: boolean;
  onComplete: () => void;
}

export function MagnifyingGlassStage({ secretMemory, secretPassword = 'кафе', isMuted = false, onComplete }: MagnifyingGlassProps) {
  const [mousePos, setMousePos] = useState({ x: 200, y: 200 });
  const [isInside, setIsInside] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    speakBulgarian("Използвайте дигиталната лупа, за да откриете скритата улика, и въведете секретния код.", isMuted, 0.92, 1.0);
    return () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
  }, [isMuted]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim().toLowerCase() === (secretPassword || 'кафе').trim().toLowerCase()) {
      playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.85);
      setIsUnlocked(true); setHasError(false);
      speakBulgarian("Кодът е верен! Личното послание е разсекретено.", isMuted, 0.92, 1.0);
    } else {
      setHasError(true);
      playSoundEffect('/audio/detective/stamp.mp3', isMuted, 0.9);
      if (navigator.vibrate) try { navigator.vibrate([100, 50, 100]); } catch (e) {}
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={e => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        setIsInside(true);
      }}
      onMouseLeave={() => setIsInside(false)}
      className="relative w-full h-full bg-[#0D0B0A] text-[#F7F4EF] font-mono flex flex-col items-center justify-between p-6 select-none overflow-hidden"
    >
      <div className="relative z-20 text-center space-y-1 pt-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-red-500 font-bold block">СЕКРЕТЕН ТЕРМИНАЛ С ДИГИТАЛНА ЛУПА</span>
        <h2 className="text-xl font-serif font-bold text-white uppercase">Разшифриране на архива</h2>
        <p className="text-xs text-[#958679]">🔍 Плъзни лупата по екрана, за да откриеш скритата улика</p>
      </div>

      {!isUnlocked ? (
        <div className="relative z-20 max-w-md w-full space-y-6 my-auto">
          <div className="bg-[#1A1816]/80 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-center space-y-3">
            <div className="text-xs text-amber-400 font-bold">💡 Улика под лупата: Върни се към досието (Стейдж 2) и въведи секретната дума.</div>
          </div>
          <form onSubmit={handleVerify} className="bg-[#1A1816] p-6 rounded-3xl border-2 border-red-700/60 shadow-2xl space-y-4 text-center">
            <input type="text" value={inputCode} onChange={e => setInputCode(e.target.value)} placeholder="Въведи секретен код..." className="w-full bg-black/70 border border-white/20 rounded-xl p-3.5 text-xs text-white text-center tracking-widest uppercase focus:outline-none focus:border-red-600 font-mono" />
            {hasError && <p className="text-[11px] text-red-500 font-bold">[ ГРЕШЕН КОД // ПРОВЕРЕТЕ ДОСИЕТО ]</p>}
            <button type="submit" className="w-full bg-red-700 hover:bg-red-600 text-white py-3.5 rounded-xl text-xs uppercase tracking-widest font-black cursor-pointer">[ ДЕШИФРИРАЙ ПОСЛАНИЕТО 🔓 ]</button>
          </form>
        </div>
      ) : (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-20 max-w-xl w-full bg-[#1A1816] p-8 sm:p-12 rounded-3xl border-4 border-green-600 shadow-2xl text-center space-y-8 my-auto">
          <div className="absolute top-6 right-6 border-4 border-green-500 text-green-400 px-3 py-1 font-black text-xs uppercase tracking-widest transform rotate-12 bg-green-950/50">[ DECLASSIFIED // ИСТИНА ]</div>
          <div className="space-y-3 pt-4">
            <span className="text-[10px] uppercase tracking-widest text-green-400 font-bold block">ЛИЧНО ПОСЛАНИЕ ОТ ИНСПЕКТОРА</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">&quot;{secretMemory}&quot;</h2>
          </div>
          <button onClick={onComplete} className="w-full bg-green-600 hover:bg-green-500 text-black py-4 rounded-2xl text-xs uppercase tracking-widest font-black cursor-pointer border-2 border-green-400">[ ПРЕМИН КЪМ ДЕТЕКТИВСКОТО ТАБЛО → ]</button>
        </motion.div>
      )}

      {isInside && !isUnlocked && (
        <div className="absolute pointer-events-none rounded-full border-4 border-amber-500/90 shadow-2xl overflow-hidden bg-[#1A1816]/95 z-40 flex items-center justify-center p-6 text-center" style={{ width: '200px', height: '200px', left: `${mousePos.x - 100}px`, top: `${mousePos.y - 100}px` }}>
          <div className="text-amber-300 text-xs font-mono font-bold">🔍 УЛИКА ПОД ЛУПАТА:<br /><span className="text-white text-[11px] font-normal">„Търси кодовата парола от Стейдж 2!“</span></div>
        </div>
      )}
      <div className="relative z-20 pb-2 text-[10px] text-neutral-500 uppercase tracking-widest">ФЕДЕРАЛЕН АРХИВ // СТЕЙДЖ 4</div>
    </div>
  );
}