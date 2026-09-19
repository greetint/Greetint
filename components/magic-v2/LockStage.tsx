'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, LockOpen, Sparkles } from 'lucide-react';
import { useLongPress } from './useLongPress';
import { FairyDust } from './FairyDust';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface LockStageProps {
  childName: string;
  onUnlocked: () => void;
}

const HOLD_MS = 1600;

export function LockStage({ childName, onUnlocked }: LockStageProps) {
  const { t } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [unlocked, setUnlocked] = useState(false);

  const { handlers } = useLongPress({
    durationMs: HOLD_MS,
    onProgress: setProgress,
    onComplete: () => {
      setUnlocked(true);
      setTimeout(onUnlocked, 950);
    },
  });

  const glowScale = 1 + progress * 1.6;
  const glowOpacity = 0.25 + progress * 0.75;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
      <FairyDust count={18} />

      <motion.h1
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="mv2-heading mv2-shimmer-text text-3xl sm:text-5xl font-bold mb-3 tracking-wide"
      >
        {t('magicV2.lockStage.heading', { name: childName })}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.9 }}
        className="text-[#e6d9ff]/80 text-sm sm:text-base mb-14 max-w-md"
      >
        {t('magicV2.lockStage.subtitle')}
      </motion.p>

      <div className="relative w-56 h-56 sm:w-72 sm:h-72 flex items-center justify-center">
        {/* Outer radiant glow that grows with hold progress */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(247,215,116,0.9) 0%, rgba(201,166,255,0.55) 35%, rgba(106,48,147,0) 70%)',
            transform: `scale(${glowScale})`,
            opacity: unlocked ? 1 : glowOpacity,
            transition: 'transform 60ms linear, opacity 200ms ease',
            filter: 'blur(4px)',
          }}
        />

        {/* Pulsing ambient rings, always alive so the lock never feels static */}
        <div className="mv2-glow-ring absolute w-40 h-40 sm:w-52 sm:h-52 rounded-full border border-[#f7d774]/30" style={{ '--mv2-dur': '2.6s' } as React.CSSProperties} />
        <div className="mv2-glow-ring absolute w-32 h-32 sm:w-44 sm:h-44 rounded-full border border-[#c9a6ff]/30" style={{ '--mv2-dur': '3.4s' } as React.CSSProperties} />

        {/* Radial "charge" ring that fills as progress advances */}
        <svg className="absolute w-44 h-44 sm:w-56 sm:h-56 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="url(#mv2-gold-grad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 45}
            strokeDashoffset={2 * Math.PI * 45 * (1 - progress)}
            style={{ transition: 'stroke-dashoffset 60ms linear' }}
          />
          <defs>
            <linearGradient id="mv2-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f7d774" />
              <stop offset="100%" stopColor="#ff8fb1" />
            </linearGradient>
          </defs>
        </svg>

        <button
          {...handlers}
          disabled={unlocked}
          aria-label={t('magicV2.lockStage.unlockAriaLabel')}
          className="mv2-no-select relative z-10 w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-[#3a1c5e] to-[#1b1036] border-2 border-[#f7d774]/70 shadow-[0_0_40px_rgba(247,215,116,0.35)] flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
        >
          <AnimatePresence mode="wait">
            {unlocked ? (
              <motion.div
                key="open"
                initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
                animate={{ scale: 1.3, opacity: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                <LockOpen className="w-12 h-12 sm:w-14 sm:h-14 text-[#f7d774]" strokeWidth={1.75} />
              </motion.div>
            ) : (
              <motion.div key="closed" initial={{ scale: 1 }} animate={{ scale: 1 + progress * 0.15 }}>
                <Lock className="w-12 h-12 sm:w-14 sm:h-14 text-[#f7d774]" strokeWidth={1.75} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {unlocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: [0, 1, 0], scale: 3.2 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(247,215,116,0.6) 40%, transparent 72%)' }}
          />
        )}
      </div>

      <motion.div
        animate={{ opacity: progress > 0 && !unlocked ? 1 : 0 }}
        className="mt-10 flex items-center gap-2 text-[#f7d774] text-xs uppercase tracking-[0.3em]"
      >
        <Sparkles className="w-3.5 h-3.5" />
        {t('magicV2.lockStage.unlockingStatus')}
      </motion.div>
    </div>
  );
}
