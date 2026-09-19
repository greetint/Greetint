'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './magic-v2.css';
import { LockStage } from './LockStage';
import { PrepStage } from './PrepStage';
import { CelebrationStage } from './CelebrationStage';
import { FinaleStage } from './FinaleStage';
import { FairyDust } from './FairyDust';

export interface MagicV2Data {
  childName: string;
  childAge: string | number;
  senderName: string;
  personalMessage: string;
}

type Stage = 'lock' | 'prep' | 'celebration' | 'finale';

const STAGE_ORDER: Stage[] = ['lock', 'prep', 'celebration', 'finale'];

export function MagicV2Experience({ data }: { data: MagicV2Data }) {
  const [stage, setStage] = useState<Stage>('lock');
  const [burst, setBurst] = useState(0);

  const goTo = (next: Stage) => {
    setBurst((b) => b + 1);
    setStage(next);
  };

  const [stars, setStars] = useState<
    { id: number; left: number; top: number; size: number; dur: number; delay: number }[]
  >([]);

  useEffect(() => {
    setStars(
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1 + Math.random() * 2,
        dur: 2 + Math.random() * 3,
        delay: Math.random() * 4,
      }))
    );
  }, []);

  return (
    <main className="mv2-root relative w-screen h-screen fixed inset-0 overflow-hidden select-none">
      {/* Persistent backdrop — never unmounts, so there is no black frame
          between stages no matter how the foreground content transitions. */}
      <div className="absolute inset-0 mv2-bg-nebula">
        <div className="absolute inset-0" aria-hidden="true">
          {stars.map((s) => (
            <span
              key={s.id}
              className="mv2-star absolute rounded-full bg-white"
              style={{
                left: `${s.left}%`,
                top: `${s.top}%`,
                width: s.size,
                height: s.size,
                '--mv2-dur': `${s.dur}s`,
                '--mv2-delay': `${s.delay}s`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>

      {/* Transition wash: a brief denser sparkle burst layered on top during
          every stage change, so the crossfade reads as "magic dust" rather
          than a plain fade. */}
      <AnimatePresence>
        {burst > 0 && (
          <motion.div
            key={burst}
            className="absolute inset-0 pointer-events-none z-40"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1 }}
          >
            <FairyDust count={36} burst />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="sync">
        {stage === 'lock' && (
          <motion.div
            key="lock"
            className="absolute inset-0 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.08, filter: 'blur(6px)' }}
            transition={{ duration: 0.8 }}
          >
            <LockStage childName={data.childName} onUnlocked={() => goTo('prep')} />
          </motion.div>
        )}

        {stage === 'prep' && (
          <motion.div
            key="prep"
            className="absolute inset-0 z-10"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(6px)' }}
            transition={{ duration: 0.8 }}
          >
            <PrepStage onComplete={() => goTo('celebration')} />
          </motion.div>
        )}

        {stage === 'celebration' && (
          <motion.div
            key="celebration"
            className="absolute inset-0 z-10"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(6px)' }}
            transition={{ duration: 0.8 }}
          >
            <CelebrationStage childName={data.childName} onComplete={() => goTo('finale')} />
          </motion.div>
        )}

        {stage === 'finale' && (
          <motion.div
            key="finale"
            className="absolute inset-0 z-10"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <FinaleStage
              childName={data.childName}
              childAge={data.childAge}
              senderName={data.senderName}
              personalMessage={data.personalMessage}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* progress dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50 flex gap-2">
        {STAGE_ORDER.map((s) => (
          <div
            key={s}
            className="w-1.5 h-1.5 rounded-full transition-all duration-500"
            style={{
              background: s === stage ? '#f7d774' : 'rgba(255,255,255,0.25)',
              width: s === stage ? 18 : 6,
            }}
          />
        ))}
      </div>
    </main>
  );
}
