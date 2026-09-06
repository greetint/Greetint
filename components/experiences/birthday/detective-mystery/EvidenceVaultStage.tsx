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
  const facts = [profile.alias, profile.mainCrime, profile.distinguishingMark, profile.lastSeen, profile.specialSkill];
  const clues = evidenceClues?.length ? evidenceClues : ["Улика 1", "Улика 2", "Улика 3", "Улика 4", "Улика 5"];
  const evPhotos = photos.length ? photos : [{ fileUrl: '/images/cards/card-1.png' }];

  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(Array(evPhotos.length).fill(''));
  const [unlocked, setUnlocked] = useState<boolean[]>(Array(evPhotos.length).fill(false));
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  useEffect(() => {
    speakBulgarian("Детективско табло с доказателства. Свържете всяка снимка с правилния факт от досието.", isMuted, 0.92, 1.0);
    return () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
  }, [isMuted]);

  const handleMatch = (idx: number, val: string) => {
    const u = [...selectedAnswers]; u[idx] = val; setSelectedAnswers(u);
    if (facts.some(f => f.toLowerCase() === val.toLowerCase())) {
      playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.7);
      const unl = [...unlocked]; unl[idx] = true; setUnlocked(unl);
    } else if (val !== '') {
      playSoundEffect('/audio/detective/stamp.mp3', isMuted, 0.8);
      if (navigator.vibrate) try { navigator.vibrate([100, 50, 100]); } catch (e) {}
    }
  };

  return (
    <div className="relative w-full h-full bg-[#161311] text-[#F7F4EF] font-mono flex flex-col items-center justify-center p-4 sm:p-6 select-none overflow-y-auto">
      <div className="absolute inset-0 bg-[#241c17] opacity-90 pointer-events-none bg-[radial-gradient(#3a2e25_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="relative z-20 max-w-4xl w-full space-y-6 my-auto text-center py-6">
        <div className="space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-red-500 font-bold block">ФЕДЕРАЛНО ДЕТЕКТИВСКО ТАБЛО</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white uppercase">Доказателства с конци</h2>
          <p className="text-xs text-[#958679]">Свържете уликите под снимките с фактите от досието</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          {evPhotos.map((p, idx) => (
            <div key={idx} className="bg-[#EFECE6] text-black p-4 pb-6 rounded-xl shadow-2xl border-2 border-black/30 relative flex flex-col justify-between group">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-600 border border-red-900 shadow-md z-30" />
              <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-red-700 z-20 pointer-events-none" />
              <div onClick={() => setSelectedImg(p.fileUrl)} className="cursor-pointer overflow-hidden rounded border border-black/20 relative">
                <img src={p.fileUrl} alt="Evidence" className="w-full aspect-square object-cover" />
                {unlocked[idx] && (
                  <div className="absolute inset-0 bg-green-950/70 flex items-center justify-center">
                    <span className="border-2 border-green-500 text-green-300 font-black px-3 py-1 rounded text-xs uppercase tracking-widest">[ РАЗСЕКРЕТЕНО ✓ ]</span>
                  </div>
                )}
              </div>
              <div className="space-y-3 pt-3 text-left">
                <div className="text-[11px] font-bold text-red-800 uppercase">📌 {clues[idx % clues.length] || 'Улика'}</div>
                <select value={selectedAnswers[idx] || ''} onChange={e => handleMatch(idx, e.target.value)} className="w-full bg-white border border-black/40 rounded p-2 text-xs font-mono text-black focus:outline-none">
                  <option value="">-- Избери факт --</option>
                  {facts.map((f, fIdx) => <option key={fIdx} value={f}>{f}</option>)}
                </select>
              </div>
            </div>
          ))}
        </div>
        <div className="pt-6">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onComplete} className="w-full max-w-md mx-auto bg-red-700 hover:bg-red-600 text-white py-4 rounded-2xl text-xs uppercase tracking-[0.25em] font-black shadow-xl transition cursor-pointer">
            [ ПРЕМИН КЪМ РАЗПИТА НА СВИДЕТЕЛЯ → ]
          </motion.button>
        </div>
      </div>
      {selectedImg && (
        <div onClick={() => setSelectedImg(null)} className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-[#EFECE6] p-4 pb-10 rounded-2xl shadow-2xl border-4 border-black">
            <img src={selectedImg} alt="Enlarged" className="w-full h-auto max-h-[75vh] object-contain rounded" />
          </div>
        </div>
      )}
    </div>
  );
}


