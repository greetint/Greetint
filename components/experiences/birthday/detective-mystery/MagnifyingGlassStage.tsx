'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { speakBulgarian, playSoundEffect } from './utils/speech';

interface MagnifyingGlassProps {
  secretMemory: string;
  secretPassword?: string;
  age?: string;
  isMuted?: boolean;
  onComplete: () => void;
}

export function MagnifyingGlassStage({
  secretMemory,
  secretPassword = 'кафе',
  age = '30',
  isMuted = false,
  onComplete
}: MagnifyingGlassProps) {
  const targetAge = parseInt(age, 10) || 30;
  const [subStage, setSubStage] = useState<1 | 2 | 3>(1);
  const [frequency, setFrequency] = useState<number>(10);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [inputCode, setInputCode] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);
  const [mousePos, setMousePos] = useState({ x: 200, y: 200 });
  const [isInside, setIsInside] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const msgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (subStage === 1) speakBulgarian(`Етап 1: Радиостанция. Настройте честотата на ${targetAge} MHz.`, isMuted, 0.92, 1.0);
    else if (subStage === 2) speakBulgarian("Етап 2: Верификационен терминал. Въведете секретната дума от досието.", isMuted, 0.92, 1.0);
    else if (subStage === 3) speakBulgarian("Етап 3: Химическа лупа. Плъзнете лупата, за да разчетете посланието.", isMuted, 0.92, 1.0);
    return () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
  }, [subStage, targetAge, isMuted]);

  const handleFreq = (val: number) => {
    setFrequency(val);
    if (val === targetAge && !isLocked) {
      setIsLocked(true);
      playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.9);
      speakBulgarian("Честотата е засечена!", isMuted, 0.92, 1.0);
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim().toLowerCase() === (secretPassword || 'кафе').trim().toLowerCase()) {
      playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.9);
      setHasError(false);
      speakBulgarian("Кодът е верен!", isMuted, 0.92, 1.0);
      setTimeout(() => setSubStage(3), 800);
    } else {
      setHasError(true);
      playSoundEffect('/audio/detective/stamp.mp3', isMuted, 0.9);
      if (navigator.vibrate) try { navigator.vibrate([100, 50, 100]); } catch (e) {}
    }
  };

  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const cy = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const x = cx - rect.left;
    const y = cy - rect.top;
    setMousePos({ x, y });
    setIsInside(true);

    if (msgRef.current) {
      const mrect = msgRef.current.getBoundingClientRect();
      const mx = mrect.left + mrect.width / 2 - rect.left;
      const my = mrect.top + mrect.height / 2 - rect.top;
      if (Math.hypot(x - mx, y - my) < 160 && !revealed) {
        setRevealed(true);
        playSoundEffect('/audio/detective/typewriter.mp3', isMuted, 0.4);
      }
    }
  }, [revealed, isMuted]);

  const finalMemory = secretMemory || 'Честит рожден ден! Бъди все така неуловим и успешен.';

  return (
    <div ref={containerRef} onMouseMove={handleMove} onTouchMove={handleMove} onMouseEnter={() => setIsInside(true)} onMouseLeave={() => setIsInside(false)} className="relative w-full h-full bg-[#0D0B0A] text-[#F7F4EF] font-mono flex flex-col items-center justify-between p-6 select-none overflow-hidden cursor-crosshair">
      <div className="relative z-20 text-center space-y-1 pt-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-red-500 font-bold block">ФЕДЕРАЛЕН АРХИВ // СТЕЙДЖ 4</span>
        <h2 className="text-xl font-serif font-bold text-white uppercase">
          {subStage === 1 && 'Етап 1: Радиостанция'}
          {subStage === 2 && 'Етап 2: Верификация'}
          {subStage === 3 && 'Етап 3: Химическа Лупа'}
        </h2>
        <div className="flex justify-center gap-2 pt-1">
          <span className={`w-2.5 h-2.5 rounded-full ${subStage >= 1 ? 'bg-green-500' : 'bg-neutral-700'}`} />
          <span className={`w-2.5 h-2.5 rounded-full ${subStage >= 2 ? 'bg-green-500' : 'bg-neutral-700'}`} />
          <span className={`w-2.5 h-2.5 rounded-full ${subStage >= 3 ? 'bg-green-500' : 'bg-neutral-700'}`} />
        </div>
      </div>

      <div className="relative z-20 max-w-xl w-full my-auto">
        {subStage === 1 && (
          <div className="bg-[#161412] p-6 rounded-3xl border-2 border-amber-500/40 shadow-2xl space-y-6 text-center">
            <div className="space-y-2">
              <span className="text-xs text-amber-300 font-bold uppercase">📡 Радиочестотен Тунер</span>
              <p className="text-xs text-[#958679]">Настройте честотата до възрастта: <span className="text-amber-400 font-bold">{targetAge} MHz</span></p>
            </div>
            <div className="space-y-4 py-2">
              <div className="text-3xl font-mono font-black text-amber-400">{frequency} MHz</div>
              <input type="range" min="1" max="99" value={frequency} onChange={(e) => handleFreq(parseInt(e.target.value, 10))} className="w-full accent-amber-500 cursor-pointer h-2 bg-neutral-800 rounded-lg" />
            </div>
            {isLocked ? (
              <div className="space-y-3">
                <div className="text-green-400 text-xs font-bold uppercase bg-green-950/60 py-2 rounded-xl border border-green-500/40">✔ ЗАКЛЮЧЕНО!</div>
                <button onClick={() => { playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.85); setSubStage(2); }} className="w-full bg-green-600 hover:bg-green-500 text-black py-3.5 rounded-xl text-xs uppercase tracking-widest font-black cursor-pointer shadow">[ КЪМ ВЕРИФИКАЦИЯ → ]</button>
              </div>
            ) : (
              <div className="text-xs text-neutral-400 italic">Цел: {targetAge} MHz</div>
            )}
          </div>
        )}

        {subStage === 2 && (
          <form onSubmit={handleVerify} className="bg-[#161412] p-6 rounded-3xl border-2 border-red-700/60 shadow-2xl space-y-6 text-center">
            <div className="space-y-2">
              <span className="text-xs text-red-400 font-bold uppercase">🔐 Верификационен Терминал</span>
              <p className="text-xs text-[#958679]">Въведете секретната улика от Досието:</p>
            </div>
            <input type="text" value={inputCode} onChange={(e) => setInputCode(e.target.value)} placeholder="Секретен код..." className="w-full bg-black/80 border border-white/20 rounded-xl p-4 text-xs text-white text-center tracking-widest uppercase focus:outline-none focus:border-red-600 font-mono" />
            {hasError && <p className="text-[11px] text-red-500 font-bold">[ ❌ ГРЕШЕН КОД ]</p>}
            <button type="submit" className="w-full bg-red-700 hover:bg-red-600 text-white py-3.5 rounded-xl text-xs uppercase tracking-widest font-black cursor-pointer shadow">[ ДЕШИФРИРАЙ 🔓 ]</button>
          </form>
        )}

        {subStage === 3 && (
          <div className="flex flex-col items-center justify-center space-y-8 my-auto text-center py-6">
            <div className="space-y-2">
              <span className="text-xs text-amber-400 font-bold uppercase tracking-widest">🔍 Химическа Лупа</span>
              <p className="text-xs text-[#958679]">Минете с лупата над посланието за разкриване.</p>
            </div>
            
            <div ref={msgRef} className="py-8 px-4 max-w-lg mx-auto select-none">
              <p className="text-base sm:text-lg font-serif italic text-[#131110] leading-relaxed select-none">
                &quot;{finalMemory}&quot;
              </p>
            </div>

            <button 
              onClick={() => { playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.85); onComplete(); }} 
              className="max-w-xs w-full bg-amber-600 hover:bg-amber-500 text-black py-4 rounded-2xl text-xs uppercase tracking-widest font-black cursor-pointer border-2 border-amber-400 shadow-xl transition"
            >
              [ КЪМ ТАБЛОТО (СТЕЙДЖ 5) → ]
            </button>
          </div>
        )}
      </div>

      {subStage === 3 && isInside && (
        <div className="absolute pointer-events-none rounded-full border-4 border-amber-400/95 shadow-2xl overflow-hidden bg-[#161210] backdrop-blur-md z-50 flex items-center justify-center p-4 text-center" style={{ width: '180px', height: '180px', left: `${mousePos.x - 90}px`, top: `${mousePos.y - 90}px` }}>
          <div className="absolute inset-0 flex items-center justify-center p-3">
            <p className="text-amber-100 text-xs sm:text-sm font-serif font-bold leading-snug">&quot;{finalMemory}&quot;</p>
          </div>
        </div>
      )}

      <div className="relative z-20 pb-2 text-[10px] text-neutral-500 uppercase tracking-widest">ФЕДЕРАЛЕН АРХИВ // СТЕЙДЖ 4</div>
    </div>
  );
}
