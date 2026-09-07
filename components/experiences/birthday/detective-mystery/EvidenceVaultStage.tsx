'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { speakBulgarian, playSoundEffect } from './utils/speech';

interface EvidenceVaultProps {
  photos: { fileUrl: string }[];
  evidenceClues?: string[];
  suspectProfile?: { alias: string; mainCrime: string; distinguishingMark: string; lastSeen: string; specialSkill: string };
  isMuted?: boolean;
  onComplete: () => void;
}

export function EvidenceVaultStage({ photos, evidenceClues, suspectProfile, isMuted = false, onComplete }: EvidenceVaultProps) {
  const profile = suspectProfile || { alias: 'Шеф на купона', mainCrime: 'Превишена скорост', distinguishingMark: 'Усмивка', lastSeen: 'Дансинга', specialSkill: 'Ядене на торта' };
  const facts = [
    { id: 0, label: 'Кодово име', value: profile.alias },
    { id: 1, label: 'Престъпление', value: profile.mainCrime },
    { id: 2, label: 'Белег', value: profile.distinguishingMark },
    { id: 3, label: 'Последно', value: profile.lastSeen },
    { id: 4, label: 'Умение', value: profile.specialSkill }
  ];
  const clues = evidenceClues?.length ? evidenceClues : ["Кой е псевдонимът?", "Какво е престъплението?", "Кой е белегът?", "Къде е забелязан?", "Какво е умението?"];
  const evPhotos = photos.length ? photos : [{ fileUrl: '/images/cards/card-1.png' }, { fileUrl: '/images/cards/card-2.png' }, { fileUrl: '/images/cards/card-3.png' }];

  const [selectedFactId, setSelectedFactId] = useState<number | null>(null);
  const [connections, setConnections] = useState<{ [photoIdx: number]: number }>({});
  const [unlocked, setUnlocked] = useState<boolean[]>(Array(evPhotos.length).fill(false));
  const [errorIdx, setErrorIdx] = useState<number | null>(null);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  useEffect(() => {
    speakBulgarian("Вестникарски изрезки и червени конци. Изберете улика от пресата и я свържете със замаглената снимка.", isMuted, 0.92, 1.0);
    return () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
  }, [isMuted]);

  const handleConnect = (photoIdx: number) => {
    if (selectedFactId === null) {
      speakBulgarian("Първо изберете вестникарска изрезка!", isMuted, 0.95, 1.0);
      return;
    }
    if (unlocked[photoIdx]) return;

    if (selectedFactId === (photoIdx % facts.length)) {
      playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.8);
      setConnections({ ...connections, [photoIdx]: selectedFactId });
      const u = [...unlocked]; u[photoIdx] = true; setUnlocked(u);
      setSelectedFactId(null); setErrorIdx(null);
      speakBulgarian("Правилна връзка! Снимката е разсекретена.", isMuted, 0.95, 1.0);
    } else {
      playSoundEffect('/audio/detective/stamp.mp3', isMuted, 0.9);
      setErrorIdx(photoIdx);
      if (navigator.vibrate) try { navigator.vibrate([120, 60, 120]); } catch (e) {}
      setTimeout(() => setErrorIdx(null), 1500);
      speakBulgarian("Грешна връзка! Конецът се къса.", isMuted, 0.95, 1.0);
    }
  };

  const allUnlocked = unlocked.every(Boolean) || unlocked.filter(Boolean).length >= evPhotos.length;
  return (
    <div className="relative w-full h-full bg-[#2b1d11] text-[#2b1d0c] font-mono flex flex-col items-center justify-start p-4 sm:p-6 select-none overflow-y-auto">
      {/* Cork board subtle texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-50 bg-[radial-gradient(#4a2e18_1.8px,transparent_1.8px)] [background-size:22px_22px]" />
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Header Note */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-20 text-center mb-6 bg-[#f4ebd0] px-6 py-3 rounded-xl border-2 border-[#5c3317] shadow-2xl max-w-xl w-full transform -rotate-1"
      >
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 bg-red-700 rounded-full shadow-md flex items-center justify-center text-white text-[10px]">📌</div>
        <span className="text-[10px] text-red-700 font-black uppercase tracking-widest">[ ВЕСТНИКАРСКИ ИЗРЕЗКИ И УЛИКИ ]</span>
        <h2 className="text-lg font-serif font-bold text-black uppercase">Детективско корково табло</h2>
        <p className="text-xs text-[#5c3317] mt-1">
          {selectedFactId !== null 
            ? "📌 Избрана е изрезка! Кликнете на съответната снимка за опъване на конец." 
            : "1. Кликнете на вестникарска изрезка (долу/встрани) ➔ 2. Свържете я с правилната снимка!"}
        </p>
      </motion.div>

      {/* Main Board Container */}
      <div className="relative z-20 max-w-7xl w-full space-y-8 pb-16">
        
        {/* Newspaper Clippings (Answers) Section scattered like clippings on corkboard */}
        <div className="bg-[#1c120a]/80 backdrop-blur-sm p-4 rounded-2xl border-2 border-amber-900/60 shadow-2xl">
          <div className="text-center mb-3">
            <span className="text-[10px] uppercase tracking-widest text-amber-300 font-bold bg-black/40 px-3 py-1 rounded-full border border-amber-700/50">
              📰 Вестникарски изрезки с отговори (Кликнете за избор)
            </span>
          </div>
          <div className="flex flex-wrap gap-3 justify-center items-center">
            {facts.map((fact) => {
              const isSelected = selectedFactId === fact.id;
              const used = Object.values(connections).includes(fact.id);
              return (
                <motion.div 
                  key={fact.id} 
                  whileHover={{ scale: 1.05, rotate: (fact.id % 2 === 0 ? 1 : -1) }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => !used && setSelectedFactId(fact.id)} 
                  className={`relative p-3 rounded-lg shadow-xl border-2 cursor-pointer transition-all duration-300 transform ${
                    used 
                      ? 'bg-neutral-800 text-neutral-500 line-through opacity-40 border-neutral-700 rotate-0' 
                      : isSelected 
                      ? 'bg-amber-100 text-red-950 border-red-600 ring-4 ring-red-600/50 scale-105 rotate-1 shadow-2xl' 
                      : 'bg-[#f4ebd0] text-black border-[#5c3317] hover:bg-[#fff9e6]'
                  }`}
                  style={{ transform: `rotate(${(fact.id * 2 - 4)}deg)` }}
                >
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-700 rounded-full shadow flex items-center justify-center text-white text-[9px]">📌</div>
                  <div className="text-[8px] font-extrabold text-red-800 uppercase tracking-wider">[{fact.label}]</div>
                  <div className="text-xs sm:text-sm font-black uppercase font-serif tracking-tight mt-0.5">„{fact.value}“</div>
                  {used && <div className="absolute inset-0 bg-black/20 flex items-center justify-center rounded-lg pointer-events-none"><span className="text-[9px] font-black text-green-400 bg-black/80 px-2 py-0.5 rounded uppercase">[ СВЪРЗАНО ✓ ]</span></div>}
                </motion.div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
          {evPhotos.map((photo, idx) => {
            const isUnl = unlocked[idx];
            const isErr = errorIdx === idx;
            const connectedFact = connections[idx] !== undefined ? facts.find(f => f.id === connections[idx]) : null;

            return (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => handleConnect(idx)}
                className={`relative bg-[#f7f4ee] p-4 rounded-xl shadow-2xl border-2 cursor-pointer flex flex-col justify-between transform transition-all duration-300 hover:scale-[1.02] ${
                  isErr ? 'border-red-600 bg-red-50' : isUnl ? 'border-green-600 shadow-[0_0_25px_rgba(34,197,94,0.3)]' : 'border-[#5c3317] hover:border-red-700'
                }`}
                style={{ transform: `rotate(${(idx % 2 === 0 ? 1 : -1) * 1.5}deg)` }}
              >
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 bg-red-700 rounded-full flex items-center justify-center text-white text-xs shadow-lg border-2 border-red-900 z-20">📌</div>

                {isUnl && (
                  <svg className="absolute -top-16 left-1/2 w-32 h-20 pointer-events-none z-30 overflow-visible" style={{ transform: 'translateX(-50%)' }}>
                    <motion.path 
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      d="M 16 60 Q 64 0 112 65" 
                      fill="none" stroke="#dc2626" strokeWidth="4" strokeLinecap="round"
                      className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" 
                    />
                    <circle cx="16" cy="60" r="4" fill="#991b1b" />
                    <circle cx="112" cy="65" r="4" fill="#991b1b" />
                  </svg>
                )}

                <div 
                  className="relative mt-2 overflow-hidden rounded-lg bg-black aspect-square group shadow-inner border border-black/20" 
                  onClick={e => { if (isUnl) { e.stopPropagation(); setSelectedImg(photo.fileUrl); } }}
                >
                  <img 
                    src={photo.fileUrl} alt="Evidence" 
                    className={`w-full h-full object-cover transition-all duration-700 ${isUnl ? 'filter-none scale-100' : 'filter blur-[16px] grayscale brightness-75 scale-105'}`} 
                  />
                  {isUnl && (
                    <div className="absolute inset-0 bg-green-950/30 backdrop-blur-[2px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-green-700 text-white font-black px-3 py-1.5 rounded-lg text-xs uppercase shadow-lg border border-green-500">[ УВЕЛИЧИ КАДЪРА 🔍 ]</div>
                    </div>
                  )}
                  {!isUnl && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white p-3 text-center">
                      <span className="text-2xl mb-1">🔒</span>
                      <span className="text-[10px] font-black uppercase tracking-widest bg-red-950/90 px-3 py-1 rounded border border-red-700 shadow">ЗАСЕКРЕТЕНО КАДЪР №{idx + 1}</span>
                      <span className="text-[9px] text-amber-300 mt-2">Свържете с вестникарска изрезка</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2.5 pt-3 text-left">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-extrabold text-red-900 uppercase tracking-wider">📌 Улика / Въпрос #{idx + 1}:</div>
                    {isUnl && connectedFact && (
                      <span className="text-[9px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded border border-green-300 uppercase">✓ {connectedFact.label}</span>
                    )}
                  </div>
                  
                  <div className="text-xs sm:text-sm font-bold text-neutral-900 bg-amber-100/90 p-2.5 rounded-lg border border-amber-300 shadow-sm leading-snug">
                    „{clues[idx % clues.length]}“
                  </div>

                  {isErr && (
                    <motion.p initial={{ scale: 0.8 }} animate={{ scale: [1, 1.1, 1] }} className="text-[11px] text-red-700 font-black uppercase text-center bg-red-100 py-1 rounded border border-red-300">
                      ❌ Грешна връзка! Конецът се къса!
                    </motion.p>
                  )}

                  {!isUnl && selectedFactId !== null && (
                    <div className="text-center pt-1">
                      <span className="text-[10px] text-red-700 font-bold animate-pulse uppercase tracking-wide block bg-red-50 p-1.5 rounded border border-red-200">
                        👉 Кликнете тук, за да опънете конец!
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Completion action button */}
        <div className="pt-6 text-center space-y-4 max-w-lg mx-auto">
          {!allUnlocked ? (
            <div className="bg-[#3b220f] border-2 border-amber-700/70 p-3.5 rounded-xl shadow-xl flex items-center justify-center space-x-2">
              <span className="text-amber-400 text-sm">⚠️</span>
              <p className="text-xs text-amber-200 font-bold uppercase tracking-wider">
                Свържете всички вестникарски изрезки с правилните снимки на таблото!
              </p>
            </div>
          ) : (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-green-950/90 border-2 border-green-500 p-4 rounded-2xl shadow-2xl text-center space-y-2"
            >
              <span className="text-xs text-green-400 font-black uppercase tracking-widest block">🎉 Всички улики са разсекретени!</span>
              <p className="text-xs text-neutral-200">Корковото табло е напълно свързано. Готови сте за разпита на свидетеля.</p>
            </motion.div>
          )}

          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }} 
            onClick={onComplete} 
            className={`w-full py-4 rounded-2xl text-xs sm:text-sm uppercase tracking-[0.2em] font-black shadow-2xl cursor-pointer transition-all duration-300 ${
              allUnlocked 
                ? 'bg-gradient-to-r from-red-700 via-red-600 to-amber-700 hover:from-red-600 hover:to-amber-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.5)] border-2 border-red-400' 
                : 'bg-[#3b220f] hover:bg-[#4a2e18] text-amber-200/70 border-2 border-amber-900'
            }`}
          >
            <span>[ ПРЕМИН КЪМ РАЗПИТА НА СВИДЕТЕЛЯ → ]</span>
          </motion.button>
        </div>
      </div>

      {/* Enlarged Photo Modal */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImg(null)} 
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-3xl w-full bg-[#EFECE6] p-6 rounded-2xl shadow-2xl border-4 border-black text-center"
              onClick={e => e.stopPropagation()}
            >
              <img src={selectedImg} alt="Enlarged Evidence" className="w-full h-auto max-h-[70vh] object-contain rounded-lg shadow-lg border border-neutral-400" />
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-black font-black uppercase tracking-widest">[ РАЗСЕКРЕТЕН ФЕДЕРАЛЕН КАДЪР ]</span>
                <button 
                  onClick={() => setSelectedImg(null)}
                  className="bg-black text-white px-4 py-2 rounded-lg text-xs font-bold uppercase hover:bg-neutral-800 cursor-pointer"
                >
                  [ ЗАТВОРИ ✕ ]
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

