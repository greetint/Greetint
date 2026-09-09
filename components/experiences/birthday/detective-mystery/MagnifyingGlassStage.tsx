'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { playSoundEffect } from './utils/speech';
import { motion, AnimatePresence } from 'framer-motion';
import { SuspectRecordStage } from './SuspectRecordStage';

interface MagnifyingGlassProps {
  secretMemory: string;
  secretPassword?: string;
  age?: string;
  recipient?: string;
  suspectProfile?: {
    alias: string;
    mainCrime: string;
    distinguishingMark: string;
    lastSeen: string;
    specialSkill: string;
  };
  evidenceAnswers?: string[];
  evidenceItems?: { fileUrl: string; clue: string; answer: string }[];
  charges?: string[];
  isMuted?: boolean;
  onComplete: () => void;
}

export function MagnifyingGlassStage({
  secretMemory,
  secretPassword = 'кафе',
  age = '30',
  recipient = 'Заподозрян',
  suspectProfile,
  evidenceAnswers,
  evidenceItems,
  charges,
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
  const [msgCoords, setMsgCoords] = useState({ x: 0, y: 0 });
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const msgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // No speech
  }, [subStage, targetAge, isMuted]);

  const handleFreq = (val: number) => {
    setFrequency(val);
    if (val === targetAge && !isLocked) {
      setIsLocked(true);
      playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.9);
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = inputCode.trim().toLowerCase().replace(/[^\wа-яѓѕјљњќџабвгдежзийклмнопрстуфхцчшщъьюя]/g, '');
    const cleanSecret = (secretPassword || 'кафе').trim().toLowerCase().replace(/[^\wа-яѓѕјљњќџабвгдежзийклмнопрстуфхцчшщъьюя]/g, '');

    const isMatch = 
      cleanInput === cleanSecret ||
      cleanInput.includes(cleanSecret) ||
      cleanSecret.includes(cleanInput) ||
      (cleanSecret === 'кафе' && ['кафе', 'coffee', 'espresso', 'кафенце', 'caffee'].some(s => cleanInput.includes(s)));

    if (isMatch) {
      playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.9);
      setHasError(false);
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
      setMsgCoords({ x: mx, y: my });

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
        <div className="flex items-center justify-between max-w-xl mx-auto w-full px-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-red-500 font-bold">ФЕДЕРАЛЕН АРХИВ // СТЕЙДЖ 4</span>
          <button 
            onClick={() => { playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.85); setIsDossierOpen(true); }}
            className="bg-[#2B2723] hover:bg-black text-amber-200 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border border-amber-500/40 shadow cursor-pointer transition flex items-center gap-1.5"
          >
            <span>📁 ПРЕГЛЕД НА ДОСИЕТО</span>
          </button>
        </div>
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
              <p className="text-lg sm:text-xl font-serif italic text-[#0D0B0A] leading-relaxed select-none">
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
        <div 
          className="absolute pointer-events-none rounded-full border-4 border-amber-400/95 shadow-2xl overflow-hidden bg-[#161210]/90 backdrop-blur-sm z-50 flex items-center justify-center text-center" 
          style={{ width: '180px', height: '180px', left: `${mousePos.x - 90}px`, top: `${mousePos.y - 90}px` }}
        >
          <div 
            className="absolute flex items-center justify-center p-4 text-center max-w-sm"
            style={{
              transform: `translate(${msgCoords.x - mousePos.x}px, ${msgCoords.y - mousePos.y}px)`,
              width: '100%',
            }}
          >
            <p className="text-amber-100 text-sm sm:text-base font-serif font-bold italic leading-snug drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              &quot;{finalMemory}&quot;
            </p>
          </div>
        </div>
      )}

      <div className="relative z-20 pb-2 text-[10px] text-neutral-500 uppercase tracking-widest">ФЕДЕРАЛЕН АРХИВ // СТЕЙДЖ 4</div>

      <AnimatePresence>
        {isDossierOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-transparent flex items-center justify-center p-2 sm:p-6 cursor-default"
            onClick={() => setIsDossierOpen(false)}
          >
            <div 
              className="relative w-full h-full max-w-4xl max-h-[90vh] flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setIsDossierOpen(false)}
                className="absolute top-2 right-2 z-70 bg-red-700 hover:bg-red-800 text-white px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg border border-red-500 cursor-pointer"
              >
                [ ЗАТВОРИ ДОСИЕТО ✕ ]
              </button>
              <SuspectRecordStage 
                recipient={recipient || 'Заподозрян'}
                age={age || '30'}
                suspectProfile={suspectProfile}
                secretPassword={secretPassword}
                evidenceAnswers={evidenceAnswers}
                evidenceItems={evidenceItems}
                charges={charges}
                isMuted={isMuted}
                isModal={true}
                onClose={() => setIsDossierOpen(false)}
                onComplete={() => setIsDossierOpen(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
