'use client';

import React, { useState, useEffect } from 'react';

interface RedactedLetterProps {
  redactedWish: string;
  onComplete: () => void;
}

export function RedactedLetterStage({ redactedWish, onComplete }: RedactedLetterProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `Разсекретяване на личния доклад. Премахнете цензурата, за да прочетете официалното послание.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'bg-BG';
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleReveal = () => {
    const audio = new Audio('/audio/detective/typewriter.mp3');
    audio.volume = 0.7;
    audio.play().catch(() => {});
    setIsRevealed(true);
  };

  return (
    <div className="relative w-full h-full bg-[#11100F] text-[#F7F4EF] font-mono flex flex-col items-center justify-center p-6 select-none overflow-y-auto">
      <div className="max-w-xl w-full bg-[#EFECE6] text-[#1F1A17] p-8 sm:p-12 rounded-2xl shadow-2xl border border-[#958679]/40 space-y-8 relative">
        
        <div className="flex justify-between items-center border-b border-black/20 pb-4">
          <span className="text-[10px] uppercase tracking-[0.3em] text-red-700 font-bold">TOP SECRET // ЛИЧЕН ДОКЛАД</span>
          <span className="bg-black text-white px-2 py-0.5 rounded text-[10px] font-bold">REDACTED</span>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-serif font-bold text-black uppercase tracking-wide">Официално заключение на инспектора:</h2>
          
          <div className="relative p-6 bg-white rounded-xl border border-black/10 shadow-inner min-h-[140px] flex items-center justify-center">
            {!isRevealed ? (
              <div onClick={handleReveal} className="absolute inset-2 bg-black rounded-lg cursor-pointer flex flex-col items-center justify-center p-6 text-center shadow-lg transition hover:bg-black/90 group">
                <span className="text-xs text-yellow-400 font-bold uppercase tracking-[0.2em] mb-1 group-hover:scale-105 transition">
                  █ █ █ ЦЕНЗУРИРАНО ПОСЛАНИЕ █ █ █
                </span>
                <span className="text-[10px] text-white/60 tracking-widest">[ Кликни тук или плъзни, за да разсекретиш ]</span>
              </div>
            ) : (
              <p className="text-base font-serif text-black leading-relaxed italic animate-fade-in">
                &quot;{redactedWish || 'Честит рожден ден! Бъди все така неуловим, успешен и верен на себе си!'}&quot;
              </p>
            )}
          </div>
        </div>

        <div className="pt-2 text-center">
          <button 
            onClick={onComplete}
            className="w-full bg-[#1F1A17] hover:bg-black text-[#F7F4EF] py-4 rounded-xl text-xs uppercase tracking-[0.25em] font-bold shadow-lg transition cursor-pointer"
          >
            Към финалния протокол за освобождаване →
          </button>
        </div>

      </div>
    </div>
  );
}
