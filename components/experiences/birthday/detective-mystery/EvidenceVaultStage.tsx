'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#4a2e18_1.5px,transparent_1.5px)] [background-size:18px_18px]" />
      <div className="relative z-20 text-center mb-4 bg-[#f4ebd0] px-6 py-3 rounded-xl border-2 border-[#5c3317] shadow-xl max-w-xl w-full">
        <span className="text-[10px] text-red-700 font-black uppercase">📌 ВЕСТНИКАРСКИ ИЗРЕЗКИ И КОНЦИ</span>
        <h2 className="text-lg font-serif font-bold text-black uppercase">Детективско табло</h2>
        <p className="text-xs text-[#5c3317]">{selectedFactId !== null ? "📌 Избрана улика. Кликнете на замаглената снимка!" : "1. Кликнете улика долу ➔ 2. Кликнете снимка"}</p>
      </div>

      <div className="relative z-20 max-w-6xl w-full space-y-6 pb-12">
        <div className="bg-[#1c120a]/90 p-4 rounded-xl border-2 border-amber-900/50 shadow-xl flex flex-wrap gap-2.5 justify-center">
          {facts.map(fact => {
            const isSelected = selectedFactId === fact.id;
            const used = Object.values(connections).includes(fact.id);
            return (
              <motion.div key={fact.id} whileHover={{ scale: 1.05 }} onClick={() => !used && setSelectedFactId(fact.id)} className={`relative p-2.5 rounded shadow border-2 cursor-pointer ${used ? 'bg-neutral-800 text-neutral-500 line-through opacity-50' : isSelected ? 'bg-amber-100 text-red-900 border-red-600 ring-2 ring-red-600' : 'bg-[#f4ebd0] text-black border-[#5c3317]'}`}>
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-700 rounded-full" />
                <div className="text-[8px] font-extrabold text-red-800 uppercase">[{fact.label}]</div>
                <div className="text-xs font-black uppercase">{fact.value}</div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {evPhotos.map((photo, idx) => {
            const isUnl = unlocked[idx];
            const isErr = errorIdx === idx;
            return (
              <div key={idx} onClick={() => handleConnect(idx)} className={`relative bg-[#f7f4ee] p-3 rounded-lg shadow-2xl border-2 cursor-pointer flex flex-col justify-between transform rotate-1 ${isErr ? 'border-red-600 bg-red-50' : isUnl ? 'border-green-600' : 'border-[#5c3317]'}`}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-700 rounded-full flex items-center justify-center text-white text-xs shadow">📌</div>
                
                <svg className="absolute -top-10 left-1/2 w-20 h-12 pointer-events-none z-10 overflow-visible" style={{ transform: 'translateX(-50%)' }}>
                  <path d={isUnl ? "M 10 40 Q 40 0 70 45" : "M 10 40 Q 30 15 70 45"} fill="none" stroke={isUnl ? "#dc2626" : "#b91c1c"} strokeWidth={isUnl ? "3.5" : "2"} strokeDasharray={isUnl ? "none" : "4 2"} className="transition-all duration-500 drop-shadow-md" />
                </svg>

                <div className="relative mt-2 overflow-hidden rounded bg-black aspect-square group" onClick={e => { if (isUnl) { e.stopPropagation(); setSelectedImg(photo.fileUrl); } }}>
                  <img src={photo.fileUrl} alt="Evidence" className={`w-full h-full object-cover transition duration-500 ${isUnl ? 'filter-none' : 'filter blur-[16px] grayscale brightness-75'}`} />
                  {isUnl && <div className="absolute inset-0 bg-green-950/40 flex items-center justify-center"><div className="bg-green-700 text-white font-black px-3 py-1 rounded text-xs uppercase">[ РАЗСЕКРЕТЕНО ✓ ]</div></div>}
                  {!isUnl && <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white"><span className="text-lg">🔒</span><span className="text-[10px] font-black uppercase tracking-widest bg-red-950 px-2 py-1 rounded">ЗАСЕКРЕТЕНО</span></div>}
                </div>
                <div className="space-y-2 pt-2 text-left">
                  <div className="text-[10px] font-bold text-red-900 uppercase">📌 Въпрос #{idx + 1}:</div>
                  <div className="text-xs text-black bg-amber-100 p-2 rounded">„{clues[idx % clues.length]}“</div>
                  {isErr && <p className="text-[10px] text-red-700 font-bold uppercase text-center animate-bounce">❌ Къса се конецът!</p>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 text-center space-y-3 max-w-md mx-auto">
          {!allUnlocked && <p className="text-xs text-amber-200 font-bold uppercase bg-[#3b220f] p-2 rounded">⚠️ Свържете всички вестникарски изрезки с червени конци!</p>}
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={onComplete} className={`w-full py-3.5 rounded-xl text-xs uppercase tracking-widest font-black shadow-xl cursor-pointer ${allUnlocked ? 'bg-red-700 hover:bg-red-600 text-white' : 'bg-[#3b220f] text-amber-200'}`}>
            <span>[ ПРЕМИН КЪМ РАЗПИТА НА СВИДЕТЕЛЯ → ]</span>
          </motion.button>
        </div>
      </div>

      {selectedImg && (
        <div onClick={() => setSelectedImg(null)} className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer">
          <div className="relative max-w-3xl w-full bg-[#EFECE6] p-4 rounded-xl shadow-2xl border-4 border-black">
            <img src={selectedImg} alt="Enlarged" className="w-full h-auto max-h-[75vh] object-contain rounded" />
            <div className="text-center mt-2 text-xs text-black font-bold uppercase">[ УВЕЛИЧЕН КАДЪР ]</div>
          </div>
        </div>
      )}
    </div>
  );
}

