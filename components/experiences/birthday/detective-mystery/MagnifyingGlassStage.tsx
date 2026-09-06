'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speakBulgarian, playSoundEffect } from './utils/speech';

interface MagnifyingGlassProps {
  secretMemory: string;
  secretPassword?: string;
  isMuted?: boolean;
  onComplete: () => void;
}

export function MagnifyingGlassStage({ secretMemory, secretPassword = 'кафе', isMuted = false, onComplete }: MagnifyingGlassProps) {
  const [inputCode, setInputCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const text = `Въведете секретната парола или дума, открита в досието с лазерния фенер, за да дешифрирате личното послание на инспектора.`;
    speakBulgarian(text, isMuted, 0.92, 1.0);

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isMuted]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = inputCode.trim().toLowerCase();
    const cleanTarget = (secretPassword || 'кафе').trim().toLowerCase();

    if (cleanInput === cleanTarget) {
      playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.85);
      setIsUnlocked(true);
      setHasError(false);
      speakBulgarian("Кодът е верен! Тайното послание е разсекретено.", isMuted, 0.92, 1.0);
    } else {
      setHasError(true);
      playSoundEffect('/audio/detective/stamp.mp3', isMuted, 0.9);
      speakBulgarian("Грешен секретен код. Проверете досието отново.", isMuted, 0.92, 1.0);
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try { navigator.vibrate([100, 50, 100]); } catch (e) {}
      }
    }
  };

  return (
    <div className="relative w-full h-full bg-[#0D0B0A] text-[#F7F4EF] font-mono flex flex-col items-center justify-center p-6 select-none overflow-y-auto">
      
      {!isUnlocked ? (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-[#1A1816] p-8 sm:p-10 rounded-3xl border-2 border-red-700/60 shadow-[0_0_50px_rgba(0,0,0,0.9)] text-center space-y-6"
        >
          <div className="inline-block p-3.5 rounded-2xl bg-red-950 text-red-500 text-2xl font-bold border border-red-600/30">
            🔍
          </div>
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-red-500 font-bold block">СЕКРЕТЕН ТЕРМИНАЛ НА УЛИКИТЕ</span>
            <h2 className="text-xl font-serif font-bold text-white uppercase">Разшифриране на послание</h2>
            <p className="text-xs text-[#958679] leading-relaxed">
              Въведете ключовата дума или парола, която научихте при прегледа на досието в Стейдж 2 с лазерния фенер:
            </p>
            
            {/* Тук добавяме видима подсказка за шифъра */}
            <div className="bg-black/40 border border-red-900/40 rounded-xl p-3 mt-3">
              <span className="text-[10px] text-red-400 font-bold block mb-1">💡 ПОДСКАЗКА ОТ ИНСПЕКТОРА:</span>
              <p className="text-xs text-white italic">
                &quot;Търси секретната дума от досието в Стейдж 2 (паролата, зададена от подателя).&quot;
              </p>
            </div>
          </div>

          <form onSubmit={handleVerify} className="space-y-4 pt-2">
            <input 
              type="text" 
              value={inputCode} 
              onChange={e => setInputCode(e.target.value)} 
              placeholder="Въведи секретен код/парола..." 
              className="w-full bg-black/70 border border-white/20 rounded-xl p-4 text-xs text-white text-center tracking-widest uppercase focus:outline-none focus:border-red-600 font-mono"
            />
            {hasError && (
              <p className="text-[11px] text-red-500 font-bold tracking-wider animate-bounce">
                [ ГРЕШЕН КОД // ПРОВЕРЕТЕ ДОСИЕТО В СТЕЙДЖ 2 ]
              </p>
            )}
            <button 
              type="submit" 
              className="w-full bg-red-700 hover:bg-red-600 text-white py-4 rounded-xl text-xs uppercase tracking-[0.25em] font-black shadow-xl transition cursor-pointer border border-red-500/50"
            >
              [ ДЕШИФРИРАЙ ПОСЛАНИЕТО 🔓 ]
            </button>
          </form>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-xl w-full bg-[#1A1816] p-8 sm:p-12 rounded-3xl border-4 border-green-600/60 shadow-[0_0_70px_rgba(34,197,94,0.2)] text-center space-y-8 my-auto relative"
        >
          <div className="absolute top-6 right-6 border-4 border-green-500 text-green-400 px-3 py-1 font-black text-xs uppercase tracking-[0.25em] transform rotate-12">
            [ DECLASSIFIED // ИСТИНА ]
          </div>

          <div className="space-y-3 pt-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-green-400 font-bold block">ЛИЧНО ПОСЛАНИЕ ОТ ИНСПЕКТОРА</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-relaxed">
              &quot;{secretMemory || 'Честит рожден ден! Бъди все така неуловим и успешен!'}&quot;
            </h2>
          </div>

          <div className="pt-4">
            <button 
              onClick={onComplete}
              className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-500 hover:to-emerald-500 text-black py-4 rounded-2xl text-xs uppercase tracking-[0.25em] font-black shadow-xl transition cursor-pointer border-2 border-green-400"
            >
              [ ПРЕМИН КЪМ ДЕТЕКТИВСКОТО ТАБЛО → ]
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
}