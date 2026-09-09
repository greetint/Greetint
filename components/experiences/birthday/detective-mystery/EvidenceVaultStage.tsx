'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSoundEffect } from './utils/speech';
import { SuspectRecordStage } from './SuspectRecordStage';

interface EvidenceVaultProps {
  photos: { fileUrl: string }[];
  evidenceClues?: string[];
  evidenceAnswers?: string[];
  evidenceItems?: { fileUrl: string; clue: string; answer: string }[];
  suspectProfile?: { alias: string; mainCrime: string; distinguishingMark: string; lastSeen: string; specialSkill: string };
  recipient?: string;
  age?: string;
  secretPassword?: string;
  charges?: string[];
  isMuted?: boolean;
  onComplete: () => void;
}

export function EvidenceVaultStage({ 
  photos, 
  evidenceClues, 
  evidenceAnswers, 
  evidenceItems, 
  suspectProfile, 
  recipient = 'Заподозрян',
  age = '30',
  secretPassword = 'кафе',
  charges,
  isMuted = false, 
  onComplete 
}: EvidenceVaultProps) {
  const profile = suspectProfile || { 
    alias: 'Шеф на купона', 
    mainCrime: charges?.[0] || 'Превишена скорост на празнуване', 
    distinguishingMark: charges?.[1] || 'Заразно добро настроение', 
    lastSeen: 'На дансинга в петък вечер', 
    specialSkill: charges?.[2] || 'Неоторизирано ядене на торта' 
  };

  const evPhotos = photos.length ? photos : [
    { fileUrl: '/images/cards/card-1.png' }, 
    { fileUrl: '/images/cards/card-2.png' }, 
    { fileUrl: '/images/cards/card-3.png' }
  ];
  const numItems = evPhotos.length;

  const defaultAnswers = [
    profile.alias || 'Шеф на купона',
    profile.mainCrime || 'Превишена скорост на празнуване',
    profile.distinguishingMark || 'Заразно добро настроение',
    profile.lastSeen || 'На дансинга в петък вечер',
    profile.specialSkill || 'Неоторизирано ядене на торта'
  ];

  const answers = evidenceAnswers?.length ? evidenceAnswers : (evidenceItems?.length ? evidenceItems.map(item => item.answer) : defaultAnswers.slice(0, numItems));

  const facts = answers.map((ans, idx) => ({
    id: idx,
    label: `Доказателство №${idx + 1}`,
    value: ans
  }));

  const defaultClues = [
    'Кой е псевдонимът на заподозрения?',
    'Какво е основното престъпление?',
    'Кой е отличителният белег?',
    'Къде е забележан за последно?',
    'Какво е специалното умение?'
  ];

  const clues = evidenceClues?.length ? evidenceClues : defaultClues.slice(0, numItems);

  const [selectedFactId, setSelectedFactId] = useState<number | null>(null);
  const [connections, setConnections] = useState<{ [photoIdx: number]: number }>({});
  const [errorPhotoIdx, setErrorPhotoIdx] = useState<number | null>(null);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  const boardRef = useRef<HTMLDivElement>(null);
  const cluePinRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const photoPinRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [lineCoords, setLineCoords] = useState<{ [photoIdx: number]: { x1: number; y1: number; x2: number; y2: number } }>({});
  const [unlocked, setUnlocked] = useState<boolean[]>(Array(numItems).fill(false));


  const updateLines = useCallback(() => {
    if (!boardRef.current) return;
    const boardRect = boardRef.current.getBoundingClientRect();
    const scrollTop = boardRef.current.scrollTop;
    const scrollLeft = boardRef.current.scrollLeft;
    const newCoords: { [photoIdx: number]: { x1: number; y1: number; x2: number; y2: number } } = {};

    Object.entries(connections).forEach(([pIdxStr, factId]) => {
      const pIdx = Number(pIdxStr);
      const pinA = cluePinRefs.current[factId];
      const pinB = photoPinRefs.current[pIdx];

      if (pinA && pinB) {
        const rectA = pinA.getBoundingClientRect();
        const rectB = pinB.getBoundingClientRect();

        newCoords[pIdx] = {
          x1: rectA.left + rectA.width / 2 - boardRect.left + scrollLeft,
          y1: rectA.top + rectA.height / 2 - boardRect.top + scrollTop,
          x2: rectB.left + rectB.width / 2 - boardRect.left + scrollLeft,
          y2: rectB.top + rectB.height / 2 - boardRect.top + scrollTop,
        };
      }
    });

    setLineCoords(newCoords);
  }, [connections]);

  useEffect(() => {
    updateLines();
    window.addEventListener('resize', updateLines);
    return () => window.removeEventListener('resize', updateLines);
  }, [connections, updateLines]);

  const handleSelectFact = (factId: number) => {
    const isAlreadyConnected = Object.values(connections).includes(factId);
    if (isAlreadyConnected) return;

    playSoundEffect('/audio/detective/typewriter.mp3', isMuted, 0.4);
    setSelectedFactId(factId);
  };

  const handleConnectPhoto = (photoIdx: number) => {
    if (unlocked[photoIdx]) {
      setSelectedImg(evPhotos[photoIdx].fileUrl);
      return;
    }

    if (selectedFactId === null) {
      return;
    }

    const expectedFactId = photoIdx;

    if (selectedFactId === expectedFactId) {
      playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.85);
      const newConn = { ...connections, [photoIdx]: selectedFactId };
      setConnections(newConn);
      const newUnlocked = [...unlocked];
      newUnlocked[photoIdx] = true;
      setUnlocked(newUnlocked);
      setSelectedFactId(null);
      setErrorPhotoIdx(null);
      setTimeout(updateLines, 50);
    } else {
      playSoundEffect('/audio/detective/stamp.mp3', isMuted, 0.9);
      setErrorPhotoIdx(photoIdx);
      if (navigator.vibrate) try { navigator.vibrate([120, 60, 120]); } catch (e) {}
      setTimeout(() => setErrorPhotoIdx(null), 1500);
    }
  };

  const allUnlocked = unlocked.every(Boolean) || unlocked.filter(Boolean).length >= evPhotos.length;

  // Curated chaotic scatter positions across the cork board
  // Mobile: Safe, non-overlapping vertical flow sequence (no mashing or overlapping)
  // Desktop (md+): Free, independent scattered layout with varied rotations
  const scatterConfigs = [
    { mobileLeft: 'left-[3%]', desktopLeft: 'md:left-[2%]', mobileTop: 'top-[6%]', desktopTop: 'md:top-[3%]', rotate: -5, width: 'w-[145px] max-w-[150px] md:w-[260px] md:max-w-none' },
    { mobileLeft: 'left-[52%]', desktopLeft: 'md:left-[32%]', mobileTop: 'top-[6%]', desktopTop: 'md:top-[5%]', rotate: 4, width: 'w-[140px] max-w-[145px] md:w-[230px] md:max-w-none' },
    { mobileLeft: 'left-[3%]', desktopLeft: 'md:left-[62%]', mobileTop: 'top-[38%]', desktopTop: 'md:top-[2%]', rotate: -6, width: 'w-[145px] max-w-[150px] md:w-[250px] md:max-w-none' },
    { mobileLeft: 'left-[52%]', desktopLeft: 'md:left-[15%]', mobileTop: 'top-[38%]', desktopTop: 'md:top-[30%]', rotate: 5, width: 'w-[140px] max-w-[145px] md:w-[230px] md:max-w-none' },
    { mobileLeft: 'left-[3%]', desktopLeft: 'md:left-[45%]', mobileTop: 'top-[70%]', desktopTop: 'md:top-[25%]', rotate: -4, width: 'w-[145px] max-w-[150px] md:w-[260px] md:max-w-none' },
    { mobileLeft: 'left-[52%]', desktopLeft: 'md:left-[72%]', mobileTop: 'top-[70%]', desktopTop: 'md:top-[35%]', rotate: 6, width: 'w-[140px] max-w-[145px] md:w-[230px] md:max-w-none' },
    { mobileLeft: 'left-[3%]', desktopLeft: 'md:left-[8%]', mobileTop: 'top-[74%]', desktopTop: 'md:top-[58%]', rotate: 4, width: 'w-[145px] max-w-[150px] md:w-[250px] md:max-w-none' },
    { mobileLeft: 'left-[52%]', desktopLeft: 'md:left-[38%]', mobileTop: 'top-[86%]', desktopTop: 'md:top-[60%]', rotate: -7, width: 'w-[140px] max-w-[145px] md:w-[230px] md:max-w-none' },
    { mobileLeft: 'left-[3%]', desktopLeft: 'md:left-[65%]', mobileTop: 'top-[98%]', desktopTop: 'md:top-[55%]', rotate: 8, width: 'w-[145px] max-w-[150px] md:w-[260px] md:max-w-none' },
    { mobileLeft: 'left-[52%]', desktopLeft: 'md:left-[25%]', mobileTop: 'top-[110%]', desktopTop: 'md:top-[80%]', rotate: -4, width: 'w-[140px] max-w-[145px] md:w-[230px] md:max-w-none' },
  ];

  return (
    <div 
      ref={boardRef}
      onScroll={updateLines}
      className="relative w-full h-full sm:min-h-[1500px] bg-[#2b1d11] text-[#2b1d0c] font-mono flex flex-col items-center justify-between sm:justify-start p-2 sm:p-6 select-none overflow-hidden sm:overflow-y-auto"
    >
      <div className="absolute inset-0 pointer-events-none opacity-60 bg-[radial-gradient(#4a2e18_2px,transparent_2px)] [background-size:24px_24px]" />
      <div className="absolute inset-0 pointer-events-none opacity-25 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:48px_48px]" />
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />

      <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
        {Object.entries(lineCoords).map(([pIdxStr, coords]) => {
          const pIdx = Number(pIdxStr);
          const midX = (coords.x1 + coords.x2) / 2 + 20;
          const midY = (coords.y1 + coords.y2) / 2 - 25;
          return (
            <g key={pIdx}>
              <path
                d={`M ${coords.x1} ${coords.y1} Q ${midX} ${midY} ${coords.x2} ${coords.y2}`}
                fill="none"
                stroke="rgba(0,0,0,0.5)"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d={`M ${coords.x1} ${coords.y1} Q ${midX} ${midY} ${coords.x2} ${coords.y2}`}
                fill="none"
                stroke="#dc2626"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="filter drop-shadow-[0_2px_4px_rgba(220,38,38,0.6)]"
              />
              <circle cx={coords.x1} cy={coords.y1} r="4" fill="#991b1b" stroke="#f87171" strokeWidth="1.5" />
              <circle cx={coords.x2} cy={coords.y2} r="4" fill="#991b1b" stroke="#f87171" strokeWidth="1.5" />
            </g>
          );
        })}
      </svg>

      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-30 text-center mb-6 bg-[#f4ebd0] px-6 py-3.5 rounded-xl border-2 border-[#5c3317] shadow-2xl max-w-2xl w-full transform -rotate-1"
      >
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 bg-red-700 rounded-full shadow-md flex items-center justify-center text-white text-[10px]">📌</div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-red-700 font-black uppercase tracking-widest">[ ДЕТЕКТИВСКО ТАБЛО С ПИНЧЕТА И КОНЦИ ]</span>
          <button 
            onClick={() => { playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.85); setIsDossierOpen(true); }}
            className="bg-[#2B2723] hover:bg-black text-amber-200 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border border-amber-500/40 shadow cursor-pointer transition flex items-center gap-1"
          >
            <span>📁 ПРЕГЛЕД НА ДОСИЕТО</span>
          </button>
        </div>
        <h2 className="text-lg sm:text-xl font-serif font-bold text-black uppercase tracking-wide">Стейдж 5: Разследване на уликите</h2>
        <p className="text-xs text-[#5c3317] mt-1 font-semibold">
          {selectedFactId !== null 
            ? "📌 Уликата е избрана! Кликнете на съответната Polaroid снимка на таблото, за да опънете червен конец." 
            : "Стъпка 1: Кликнете на жълта бележка-улика ➔ Стъпка 2: Кликнете на съответната снимка за свързване."}
        </p>
      </motion.div>

      {/* Large Scattered Detective Corkboard Canvas */}
      <div className="relative z-30 w-full max-w-7xl mx-auto min-h-[1100px] sm:min-h-[1300px] md:min-h-[1500px] pb-48 px-2 sm:px-6">
        {Array.from({ length: numItems }).flatMap((_, idx) => {
          const fact = facts[idx];
          const photo = evPhotos[idx];
          return [
            { type: 'fact' as const, id: fact.id, fact, idx },
            { type: 'photo' as const, id: idx, photo, idx }
          ];
        }).map((item, scatterIdx) => {
          const config = scatterConfigs[scatterIdx % scatterConfigs.length];
          const rot = config.rotate;

          if (item.type === 'fact') {
            const { fact, idx } = item;
            const isSelected = selectedFactId === fact.id;
            const used = Object.values(connections).includes(fact.id);
            return (
              <motion.div
                key={`fact-${fact.id}`}
                whileHover={{ scale: 1.04, rotate: 0 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => !used && handleSelectFact(fact.id)}
                className={`absolute p-4 sm:p-5 rounded-xl shadow-2xl border-2 cursor-pointer transition-all duration-300 ${config.mobileLeft} ${config.desktopLeft} ${config.mobileTop} ${config.desktopTop} ${config.width} ${
                  used 
                    ? 'bg-neutral-800/90 text-neutral-500 line-through opacity-50 border-neutral-700 rotate-0 z-10' 
                    : isSelected 
                    ? 'bg-amber-100 text-red-950 border-red-600 ring-4 ring-red-600/50 scale-105 shadow-[0_0_25px_rgba(220,38,38,0.5)] z-50' 
                    : 'bg-[#fef08a] hover:bg-[#fef9c3] text-neutral-900 border-[#ca8a04] z-30'
                }`}
                style={{ transform: `rotate(${rot}deg)` }}
              >
                <div 
                  ref={el => { cluePinRefs.current[fact.id] = el; }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 bg-red-700 rounded-full shadow-lg flex items-center justify-center text-white text-[10px] border border-red-400 z-30"
                >
                  📌
                </div>
                <div className="text-[10px] font-black uppercase text-red-800 mb-1.5 flex items-center justify-between">
                  <span>Улика #{fact.id + 1}</span>
                  {used && <span className="text-green-700 font-bold">[СВЪРЗАНО ✓]</span>}
                </div>
                <div className="text-xs sm:text-sm font-bold bg-white/60 p-2.5 rounded border border-amber-300/60 shadow-inner">
                  „{fact.value}“
                </div>
                <div className="text-[10px] text-neutral-600 mt-2 italic">
                  {clues[idx % clues.length]}
                </div>
              </motion.div>
            );
          } else {
            const { photo, idx } = item;
            const isUnl = unlocked[idx];
            const isErr = errorPhotoIdx === idx;
            const connectedFactId = connections[idx];
            const connectedFact = facts.find(f => f.id === connectedFactId);
            return (
              <motion.div
                key={`photo-${idx}`}
                initial={{ rotate: rot }}
                whileHover={{ scale: 1.02 }}
                className={`absolute bg-[#f4ebd0] p-3.5 pb-5 rounded-xl shadow-2xl border-2 transition-all duration-300 ${config.mobileLeft} ${config.desktopLeft} ${config.mobileTop} ${config.desktopTop} ${config.width} ${
                  isUnl 
                    ? 'border-green-600 shadow-[0_0_30px_rgba(34,197,94,0.3)] bg-[#fffefc] z-30' 
                    : isErr 
                    ? 'border-red-600 ring-4 ring-red-600 animate-shake bg-red-50 z-40' 
                    : 'border-[#78350f] hover:border-amber-600 z-30'
                }`}
                style={{ transform: `rotate(${rot}deg)` }}
              >
                <div 
                  ref={el => { photoPinRefs.current[idx] = el; }}
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 bg-red-700 rounded-full shadow-lg flex items-center justify-center text-white text-[10px] z-30 border border-red-400"
                >
                  📌
                </div>
                <div 
                  onClick={() => handleConnectPhoto(idx)}
                  className="relative w-full aspect-square bg-black rounded-lg overflow-hidden cursor-pointer group shadow-inner border border-neutral-400"
                >
                  <img 
                    src={photo.fileUrl} 
                    alt={`Evidence ${idx + 1}`}
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      isUnl 
                        ? 'filter-none scale-100 group-hover:scale-105' 
                        : 'filter blur-[16px] grayscale brightness-75 scale-105'
                    }`}
                  />
                  {!isUnl ? (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white p-3 text-center">
                      <span className="text-2xl mb-1 animate-pulse">🔒</span>
                      <span className="text-[10px] font-black uppercase tracking-widest bg-red-950/90 px-2.5 py-1 rounded border border-red-700 shadow">
                        КАДЪР №{idx + 1} ЗАСЕКРЕТЕН
                      </span>
                      {selectedFactId !== null ? (
                        <span className="text-[10px] text-amber-300 mt-2 font-bold animate-bounce bg-black/80 px-2 py-1 rounded border border-amber-500">
                          👉 Кликнете тук за свързване с конец!
                        </span>
                      ) : (
                        <span className="text-[9px] text-neutral-300 mt-2">
                          Изберете улика от таблото
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-green-950/20 backdrop-blur-[1px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-green-700 text-white font-black px-3 py-1.5 rounded-lg text-xs uppercase shadow-lg border border-green-400">
                        [ УВЕЛИЧИ КАДЪРА 🔍 ]
                      </div>
                    </div>
                  )}
                </div>
                <div className="pt-3 text-center space-y-1.5">
                  <div className="flex flex-col sm:flex-row items-center justify-between text-[10px] font-bold text-neutral-700 uppercase gap-1">
                    <span>ФЕДЕРАЛЕН АРХИВ #{idx + 1}</span>
                    {isUnl && connectedFact ? (
                      <span className="text-green-800 bg-green-100 px-2 py-0.5 rounded border border-green-300 font-extrabold text-[10px] truncate max-w-full">
                        ✓ {connectedFact.label}
                      </span>
                    ) : (
                      <span className="text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-300">
                        ОЧАКВА КОНЕЦ
                      </span>
                    )}
                  </div>
                  {isErr && (
                    <p className="text-[11px] text-red-700 font-black uppercase bg-red-200 py-1 rounded border border-red-400">
                      ❌ Грешна връзка! Конецът се скъса.
                    </p>
                  )}
                </div>
              </motion.div>
            );
          }
        })}
      </div>

      <div className="relative z-30 pt-6 pb-12 text-center space-y-4 max-w-lg mx-auto w-full">
        {!allUnlocked ? (
          <div className="bg-[#3b220f] border-2 border-amber-700/70 p-4 rounded-xl shadow-2xl flex items-center justify-center space-x-2.5">
            <span className="text-amber-400 text-base">⚠️</span>
            <p className="text-xs text-amber-200 font-bold uppercase tracking-wider">
              Свържете всички бележки с правилните снимки, за да разсекретите корковото табло!
            </p>
          </div>
        ) : (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-green-950/90 border-2 border-green-500 p-4 rounded-2xl shadow-2xl text-center space-y-2"
          >
            <span className="text-xs text-green-400 font-black uppercase tracking-widest block">🎉 Всички червени конци са опънати!</span>
            <p className="text-xs text-neutral-200">Корковото табло е напълно разсекретено. Готови сте за финалния разпит на свидетеля.</p>
          </motion.div>
        )}
        <motion.button 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }} 
          onClick={onComplete} 
          className={`w-full py-4 rounded-2xl text-xs sm:text-sm uppercase tracking-[0.2em] font-black shadow-2xl cursor-pointer transition-all duration-300 ${
            allUnlocked 
              ? 'bg-gradient-to-r from-red-700 via-red-600 to-amber-700 hover:from-red-600 hover:to-amber-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.6)] border-2 border-red-400' 
              : 'bg-[#3b220f] hover:bg-[#4a2e18] text-amber-200/70 border-2 border-amber-900'
          }`}
        >
          <span>[ ПРЕМИН КЪМ РАЗПИТА НА СВИДЕТЕЛЯ → ]</span>
        </motion.button>
      </div>

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

      <AnimatePresence>
        {isDossierOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-x-3 sm:inset-x-12 top-10 bottom-6 z-60 flex flex-col items-center justify-center pointer-events-none overflow-y-auto"
          >
            <div className="relative w-full max-w-2xl sm:max-w-3xl pointer-events-auto my-auto">
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
