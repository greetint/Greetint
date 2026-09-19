'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useLongPress } from './useLongPress';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface BalloonRowProps {
  onComplete: () => void;
}

const BALLOON_COLORS = [
  { body: '#ff8fb1', dark: '#d95f89' },
  { body: '#f7d774', dark: '#d9a441' },
  { body: '#c9a6ff', dark: '#9a6fe0' },
  { body: '#7ce0c6', dark: '#4fbfa0' },
  { body: '#ffb37c', dark: '#e0854f' },
];

function Balloon({ color, index, onDone }: { color: { body: string; dark: string }; index: number; onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [inflated, setInflated] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const { handlers } = useLongPress({
    durationMs: 1300,
    onProgress: setProgress,
    onComplete: () => {
      setInflated(true);
      onDone();
    },
    onCancel: () => setProgress(0),
  });

  const scale = inflated ? 1.18 : 0.4 + progress * 0.72;

  return (
    <div ref={rootRef} className="mv2-no-select flex flex-col items-center select-none" style={{ touchAction: 'none' }}>
      <motion.div
        {...handlers}
        animate={{ scale, y: inflated ? [0, -6, 0] : 0 }}
        transition={inflated ? { y: { duration: 2.4 + index * 0.2, repeat: Infinity, ease: 'easeInOut' }, scale: { type: 'spring', stiffness: 260, damping: 14 } } : { scale: { type: 'spring', stiffness: 300, damping: 22 } }}
        className="cursor-pointer"
        style={{ touchAction: 'none' }}
      >
        <svg width="90" height="120" viewBox="0 0 90 120">
          <defs>
            <radialGradient id={`mv2-balloon-${index}`} cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
              <stop offset="30%" stopColor={color.body} stopOpacity="1" />
              <stop offset="100%" stopColor={color.dark} stopOpacity="1" />
            </radialGradient>
          </defs>
          <path
            d="M45 5 C15 5 8 38 12 58 C15 78 30 92 40 96 L36 104 L54 104 L50 96 C60 92 75 78 78 58 C82 38 75 5 45 5 Z"
            fill={`url(#mv2-balloon-${index})`}
            stroke={color.dark}
            strokeWidth="1.5"
          />
          <ellipse cx="30" cy="28" rx="9" ry="14" fill="#ffffff" opacity="0.55" />
          <polygon points="40,96 50,96 45,104" fill={color.dark} />
          <path
            d="M45 106 C 50 112, 40 116, 45 120"
            stroke={color.dark}
            strokeWidth="1.5"
            fill="none"
            opacity="0.7"
          />
          {!inflated && progress < 0.05 && (
            <g stroke={color.dark} strokeWidth="1" opacity="0.5" fill="none">
              <path d="M30 40 Q35 45 30 52" />
              <path d="M55 42 Q50 48 56 55" />
            </g>
          )}
        </svg>
      </motion.div>
      {!inflated && (
        <div className="w-14 h-1.5 bg-white/15 rounded-full mt-1 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#f7d774] to-[#ff8fb1] rounded-full" style={{ width: `${progress * 100}%`, transition: 'width 60ms linear' }} />
        </div>
      )}
    </div>
  );
}

export function BalloonRow({ onComplete }: BalloonRowProps) {
  const { t } = useLanguage();
  const [doneCount, setDoneCount] = useState(0);
  const total = BALLOON_COLORS.length;

  const handleDone = () => {
    setDoneCount((prev) => {
      const next = prev + 1;
      if (next >= total) setTimeout(onComplete, 500);
      return next;
    });
  };

  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div className="flex items-end justify-center gap-3 sm:gap-6 flex-wrap px-2">
        {BALLOON_COLORS.map((color, i) => (
          <Balloon key={i} color={color} index={i} onDone={handleDone} />
        ))}
      </div>
      <p className="text-center text-[#e6d9ff]/70 text-xs sm:text-sm">
        {doneCount >= total ? t('magicV2.balloonRow.done') : t('magicV2.balloonRow.instruction')}
      </p>
    </div>
  );
}
