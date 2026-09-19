'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GarlandTrace } from './GarlandTrace';
import { BalloonRow } from './BalloonRow';
import { FairyDust } from './FairyDust';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface PrepStageProps {
  onComplete: () => void;
}

export function PrepStage({ onComplete }: PrepStageProps) {
  const { t } = useLanguage();
  const [garlandDone, setGarlandDone] = useState(false);
  const [balloonsDone, setBalloonsDone] = useState(false);

  React.useEffect(() => {
    if (garlandDone && balloonsDone) {
      const t = setTimeout(onComplete, 700);
      return () => clearTimeout(t);
    }
  }, [garlandDone, balloonsDone, onComplete]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between px-4 sm:px-10 py-8 sm:py-12 overflow-hidden">
      <FairyDust count={14} />

      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="text-center z-10">
        <h2 className="mv2-heading mv2-shimmer-text text-2xl sm:text-4xl font-bold">{t('magicV2.prepStage.title')}</h2>
        <p className="text-[#e6d9ff]/70 text-xs sm:text-sm mt-2">{t('magicV2.prepStage.subtitle')}</p>
      </motion.div>

      <div className="z-10 w-full max-w-3xl">
        <GarlandTrace onComplete={() => setGarlandDone(true)} />
      </div>

      <div className="z-10 w-full max-w-3xl">
        <BalloonRow onComplete={() => setBalloonsDone(true)} />
      </div>

      {/* soft floor glow for depth */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(247,215,116,0.12), transparent)' }}
      />
    </div>
  );
}
