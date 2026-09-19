'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useLongPress } from './useLongPress';
import { FairyDust } from './FairyDust';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface CelebrationStageProps {
  childName: string;
  onComplete: () => void;
}

const CANDLE_COUNT = 5;
const CANDLE_X = [-48, -24, 0, 24, 48];

function Fairy({ radius, duration, delay, hue }: { radius: number; duration: number; delay: number; hue: string }) {
  return (
    <div
      className="absolute top-1/2 left-1/2 w-2.5 h-2.5 rounded-full pointer-events-none"
      style={{
        background: hue,
        boxShadow: `0 0 12px 4px ${hue}`,
        animation: `mv2-orbit ${duration}s linear infinite`,
        animationDelay: `${delay}s`,
        '--mv2-r': `${radius}px`,
      } as React.CSSProperties}
    />
  );
}

export function CelebrationStage({ childName, onComplete }: CelebrationStageProps) {
  const { t } = useLanguage();
  const [lit, setLit] = useState<boolean[]>(Array(CANDLE_COUNT).fill(false));
  const [blowProgress, setBlowProgress] = useState(0);
  const [blownOut, setBlownOut] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const allLit = lit.every(Boolean);

  const toggleCandle = (i: number) => {
    if (blownOut) return;
    setLit((prev) => {
      if (prev[i]) return prev;
      const next = [...prev];
      next[i] = true;
      return next;
    });
  };

  const triggerReveal = () => {
    setBlownOut(true);
    confetti({
      particleCount: 120,
      spread: 90,
      startVelocity: 38,
      origin: { y: 0.55 },
      colors: ['#f7d774', '#ff8fb1', '#c9a6ff', '#ffffff'],
    });
    setTimeout(() => {
      setRevealed(true);
      confetti({ particleCount: 60, spread: 120, origin: { y: 0.4 }, colors: ['#f7d774', '#fff8dd'] });
    }, 500);
    setTimeout(onComplete, 2400);
  };

  const { handlers } = useLongPress({
    durationMs: 900,
    onProgress: setBlowProgress,
    onComplete: triggerReveal,
    onCancel: () => setBlowProgress(0),
  });

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-4 overflow-hidden">
      <FairyDust count={20} />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Fairy radius={150} duration={9} delay={0} hue="#f7d774" />
        <Fairy radius={190} duration={13} delay={1.5} hue="#ff8fb1" />
        <Fairy radius={120} duration={7} delay={0.7} hue="#c9a6ff" />
        <Fairy radius={220} duration={16} delay={3} hue="#7ce0c6" />
      </div>

      <motion.h2
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mv2-heading mv2-shimmer-text text-2xl sm:text-4xl font-bold text-center mb-6 z-10"
      >
        {revealed
          ? t('magicV2.celebrationStage.revealedHeading', { name: childName })
          : allLit
            ? t('magicV2.celebrationStage.blowHeading')
            : t('magicV2.celebrationStage.lightHeading')}
      </motion.h2>

      {/* Cake */}
      <div className="relative z-10 mb-6" style={{ width: 260, height: 220 }}>
        <svg width="260" height="220" viewBox="0 0 260 220">
          <defs>
            <linearGradient id="mv2-tier1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff3d6" />
              <stop offset="100%" stopColor="#f4d9a0" />
            </linearGradient>
            <linearGradient id="mv2-tier2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffd9e6" />
              <stop offset="100%" stopColor="#f0a8c2" />
            </linearGradient>
            <linearGradient id="mv2-tier3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e6d0ff" />
              <stop offset="100%" stopColor="#c9a6ff" />
            </linearGradient>
          </defs>
          <ellipse cx="130" cy="205" rx="95" ry="14" fill="#000" opacity="0.15" />
          <rect x="35" y="150" width="190" height="55" rx="14" fill="url(#mv2-tier1)" stroke="#d9a441" strokeWidth="1.5" />
          <rect x="60" y="100" width="140" height="55" rx="14" fill="url(#mv2-tier2)" stroke="#d9769a" strokeWidth="1.5" />
          <rect x="85" y="55" width="90" height="50" rx="14" fill="url(#mv2-tier3)" stroke="#9a6fe0" strokeWidth="1.5" />
          {/* drips */}
          {[45, 80, 115, 150, 185].map((x, i) => (
            <path key={i} d={`M ${x} 150 q 8 20 0 34 q -8 -8 0 -34`} fill="#fff3d6" opacity="0.85" />
          ))}
        </svg>

        {/* candles */}
        <div className="absolute left-1/2 flex gap-3" style={{ top: 8, transform: 'translateX(-50%)' }}>
          {CANDLE_X.map((offset, i) => (
            <button
              key={i}
              onClick={() => toggleCandle(i)}
              disabled={blownOut}
              aria-label={t('magicV2.celebrationStage.candleAriaLabel', { n: i + 1 })}
              className="relative flex flex-col items-center cursor-pointer"
              style={{ transform: `translateY(${Math.abs(offset) * 0.15}px)` }}
            >
              <AnimatePresence>
                {lit[i] && !blownOut && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="mv2-flame absolute -top-3.5 w-2.5 h-4 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, #fff7cc 0%, #ffb347 55%, #ff6a00 100%)',
                      boxShadow: '0 0 10px 3px rgba(255,170,50,0.85)',
                    }}
                  />
                )}
                {blownOut && lit[i] && (
                  <motion.div
                    initial={{ opacity: 0.6, y: 0 }}
                    animate={{ opacity: 0, y: -20 }}
                    transition={{ duration: 1 }}
                    className="mv2-smoke absolute -top-4 w-2 h-3 rounded-full bg-white/40 blur-[2px]"
                  />
                )}
              </AnimatePresence>
              <div className="w-1.5 h-6 rounded-sm" style={{ background: i % 2 === 0 ? '#ff8fb1' : '#c9a6ff' }} />
            </button>
          ))}
        </div>
      </div>

      {allLit && !blownOut && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="z-10 flex flex-col items-center gap-2">
          <button
            {...handlers}
            className="mv2-no-select relative w-20 h-20 rounded-full bg-gradient-to-br from-[#3a1c5e] to-[#1b1036] border-2 border-[#f7d774]/70 flex items-center justify-center text-2xl cursor-pointer overflow-hidden"
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(247,215,116,0.9), transparent 70%)',
                transform: `scale(${1 + blowProgress * 1.4})`,
                opacity: blowProgress,
              }}
            />
            <span className="relative z-10">💨</span>
          </button>
          <p className="text-[#e6d9ff]/70 text-xs">{t('magicV2.celebrationStage.blowInstruction')}</p>
        </motion.div>
      )}

      <AnimatePresence>
        {revealed && (
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mv2-script text-4xl sm:text-5xl text-[#f7d774] mt-4 z-10"
          >
            {t('magicV2.celebrationStage.wishText')}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
