'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speakBulgarian, playSoundEffect } from './utils/speech';

interface EvidenceVaultProps {
  photos: { fileUrl: string }[];
  evidenceClues?: string[];
  suspectProfile?: { 
    alias: string; 
    mainCrime: string; 
    distinguishingMark: string; 
    lastSeen: string; 
    specialSkill: string 
  };
  isMuted?: boolean;
  onComplete: () => void;
}

export function EvidenceVaultStage({ photos, evidenceClues, suspectProfile, isMuted = false, onComplete }: EvidenceVaultProps) {
  const profile = suspectProfile || { 
    alias: 'Шеф на купона', 
    mainCrime: 'Превишена скорост', 
    distinguishingMark: 'Усмивка', 
    lastSeen: 'Дансинга', 
    specialSkill: 'Ядене на торта' 
  };
  
  const facts = [
    { label: 'Кодово име', value: profile.alias },
    { label: 'Главно престъпление', value: profile.mainCrime },
    { label: 'Отличителен белег', value: profile.distinguishingMark },
    { label: 'Последно забелязан', value: profile.lastSeen },
    { label: 'Специално умение', value: profile.specialSkill }
  ];

  const defaultClues = [
    "Кой е основният псевдоним на субекта?",
    "Какво е регистрираното престъпление?",
    "Кой е отличителният белег от досието?",
    "Къде беше забелязан за последно?",
    "Какво е специалното умение?"
  ];

  const clues = evidenceClues?.length ? evidenceClues : defaultClues;
  const evPhotos = photos.length ? photos : [
    { fileUrl: '/images/cards/card-1.png' },
    { fileUrl: '/images/cards/card-2.png' },
    { fileUrl: '/images/cards/card-3.png' }
  ];

  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(Array(evPhotos.length).fill(''));
  const [unlocked, setUnlocked] = useState<boolean[]>(Array(evPhotos.length).fill(false));
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [errorIndex, setErrorIndex] = useState<number | null>(null);

  useEffect(() => {
    speakBulgarian("Детективско табло с пинчета и червени конци. Свържете всяка улика с правилния факт от досието.", isMuted, 0.92, 1.0);
    return () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
  }, [isMuted]);

  const handleMatch = (idx: number, val: string) => {
    const u = [...selectedAnswers]; 
    u[idx] = val; 
    setSelectedAnswers(u);

    const correctFact = facts[idx % facts.length].value;
    
    if (val.toLowerCase() === correctFact.toLowerCase()) {
      playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.7);
      const unl = [...unlocked]; 
      unl[idx] = true; 
      setUnlocked(unl);
      setErrorIndex(null);
      speakBulgarian("Правилна връзка! Снимката е разсекретена.", isMuted, 0.95, 1.0);
    } else if (val !== '') {
      playSoundEffect('/audio/detective/stamp.mp3', isMuted, 0.8);
      setErrorIndex(idx);
      if (navigator.vibrate) try { navigator.vibrate([120, 60, 120]); } catch (e) {}
      setTimeout(() => setErrorIndex(null), 1500);
      speakBulgarian("Грешна връзка! Конецът се къса. Опитайте отново.", isMuted, 0.95, 1.0);
    }
  };

  const allUnlocked = unlocked.every(Boolean) || unlocked.filter(Boolean).length >= evPhotos.length;
  return (
    <div className="relative w-full h-full bg-[#1c120a] text-[#F7F4EF] font-mono flex flex-col items-center justify-start p-4 sm:p-8 select-none overflow-y-auto">
      <div className="absolute inset-0 bg-[#241710] opacity-95 pointer-events-none bg-[radial-gradient(#3d291e_1.5px,transparent_1.5px)] [background-size:20px_20px] shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
      <div className="absolute top-0 left-0 right-0 h-3 bg-red-700/80 border-b border-red-900 z-30 pointer-events-none shadow-md" />

      <div className="relative z-20 max-w-5xl w-full space-y-8 my-auto py-8">
        <div className="text-center space-y-2 bg-[#18100b]/80 backdrop-blur-md p-6 rounded-2xl border-2 border-red-800/40 shadow-2xl">
          <span className="text-[10px] uppercase tracking-[0.3em] text-red-500 font-extrabold block">ФЕДЕРАЛНО ДЕТЕКТИВСКО ТАБЛО С ПИНЧЕТА И КОНЦИ</span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white uppercase tracking-wide">Доказателствен архив</h2>
          <p className="text-xs text-[#a8988a] max-w-xl mx-auto">
            Свържете всяка улика под снимката с правилния факт от Досието (Стейдж 2). При грешка конецът се къса!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {evPhotos.map((p, idx) => {
            const isUnlockedPhoto = unlocked[idx];
            const isErrorPhoto = errorIndex === idx;

            return (
              <div 
                key={idx} 
                className={`bg-[#EFECE6] text-black p-4 pb-5 rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.7)] border-3 relative flex flex-col justify-between transition-all duration-300 ${
                  isErrorPhoto ? 'border-red-600 ring-4 ring-red-600/50' : isUnlockedPhoto ? 'border-green-600' : 'border-black/50'
                }`}
              >

                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-red-600 border-2 border-red-900 shadow-[0_3px_5px_rgba(0,0,0,0.8)] z-30 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-300" />
                </div>
                <div className={`absolute -top-6 left-1/2 w-0.5 h-6 z-20 pointer-events-none transition-colors duration-300 ${isUnlockedPhoto ? 'bg-red-600 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-red-800/60'}`} />

                <div 
                  onClick={() => setSelectedImg(p.fileUrl)} 
                  className="cursor-pointer overflow-hidden rounded-lg border-2 border-black/30 relative bg-black aspect-square group shadow-inner"
                >
                  <img 
                    src={p.fileUrl} 
                    alt={`Evidence ${idx + 1}`} 
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      isUnlockedPhoto ? 'filter-none blur-0 scale-100' : 'filter blur-[18px] grayscale-[50%] scale-105'
                    }`} 
                  />

                  {!isUnlockedPhoto && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-3 text-center">
                      <span className="text-red-500 text-lg mb-1">🔒</span>
                      <span className="text-[10px] text-white font-black uppercase tracking-widest bg-black/80 px-2.5 py-1 rounded border border-red-600/60">
                        ЗАСЕКРЕТЕНО
                      </span>
                    </div>
                  )}

                  {isUnlockedPhoto && (
                    <div className="absolute inset-0 bg-green-950/70 backdrop-blur-[2px] flex items-center justify-center p-3 text-center">
                      <div className="border-2 border-green-500 text-green-300 font-black px-3 py-1.5 rounded text-xs uppercase tracking-widest bg-green-900/80 shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                        [ РАЗСЕКРЕТЕНО ✓ ]
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-3 text-left">
                  <div className="text-[11px] font-bold text-red-800 uppercase tracking-wide leading-snug">
                    📌 Улика #{idx + 1}: <span className="text-black font-normal">{clues[idx % clues.length] || 'Свържете с факт'}</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-neutral-600 block">
                      Изберете съответстващ факт:
                    </label>
                    <select 
                      value={selectedAnswers[idx] || ''} 
                      onChange={e => handleMatch(idx, e.target.value)} 
                      className={`w-full bg-white border rounded p-2 text-xs font-mono text-black focus:outline-none transition-colors ${
                        isUnlockedPhoto ? 'border-green-600 font-bold bg-green-50' : isErrorPhoto ? 'border-red-600 bg-red-50' : 'border-black/40'
                      }`}
                    >
                      <option value="">-- Избери факт от досието --</option>
                      {facts.map((f, fIdx) => (
                        <option key={fIdx} value={f.value}>
                          {f.label}: {f.value}
                        </option>
                      ))}
                    </select>
                  </div>

                  {isErrorPhoto && (
                    <p className="text-[10px] text-red-700 font-bold uppercase tracking-wider text-center">
                      ❌ Грешен конец! Къса се...
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-6 text-center space-y-3">
          {!allUnlocked && (
            <p className="text-xs text-amber-400 font-bold uppercase tracking-widest">
              ⚠️ Разсекретете всички снимки с верни червени конци, за да продължите!
            </p>
          )}

          <motion.button 
            whileHover={{ scale: 1.03 }} 
            whileTap={{ scale: 0.97 }} 
            onClick={onComplete} 
            className={`w-full max-w-md mx-auto py-4 rounded-2xl text-xs uppercase tracking-[0.25em] font-black shadow-2xl transition cursor-pointer flex items-center justify-center gap-2 ${
              allUnlocked 
                ? 'bg-red-700 hover:bg-red-600 text-white shadow-red-900/50' 
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-600'
            }`}
          >
            <span>[ ПРЕМИН КЪМ РАЗПИТА НА СВИДЕТЕЛЯ → ]</span>
          </motion.button>
        </div>
      </div>

      {selectedImg && (
        <div onClick={() => setSelectedImg(null)} className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer">
          <div className="relative max-w-3xl w-full bg-[#EFECE6] p-4 pb-8 rounded-2xl shadow-2xl border-4 border-black">
            <img src={selectedImg} alt="Enlarged" className="w-full h-auto max-h-[75vh] object-contain rounded border" />
            <div className="text-center mt-3 text-xs text-black font-bold uppercase tracking-widest">
              [ ФЕДЕРАЛНО ДОКАЗАТЕЛСТВО // УВЕЛИЧЕН КАДЪР ]
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

