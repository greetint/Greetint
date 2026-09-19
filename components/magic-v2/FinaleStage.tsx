'use client';

import React, { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Mic, Download, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { FairyDust } from './FairyDust';
import { CertificateTemplate, CertificateData } from './CertificateTemplate';
import { generateKeepsakePdf } from './generateKeepsakePdf';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface FinaleStageProps {
  childName: string;
  childAge: string | number;
  senderName: string;
  personalMessage: string;
}

type Phase = 'prompt' | 'listening' | 'transcribing' | 'review' | 'generating' | 'done';

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: { results: { [i: number]: { [j: number]: { transcript: string } } } }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export function FinaleStage({ childName, childAge, senderName, personalMessage }: FinaleStageProps) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<Phase>('prompt');
  const [wish, setWish] = useState('');
  const [supportsSpeech] = useState(() => !!getSpeechRecognition());
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const certRef = useRef<HTMLDivElement>(null);

  const bars = useMemo(() => Array.from({ length: 9 }, (_, i) => 0.4 + ((i * 37) % 60) / 100), []);

  React.useEffect(() => {
    return () => {
      try { recognitionRef.current?.stop(); } catch {}
    };
  }, []);

  const startListening = () => {
    setPhase('listening');
    const SR = getSpeechRecognition();
    if (SR) {
      const recognition = new SR();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = (e) => {
        const text = e.results?.[0]?.[0]?.transcript ?? '';
        setPhase('transcribing');
        setTimeout(() => {
          setWish(text || '');
          setPhase('review');
        }, 700);
      };
      recognition.onerror = () => {
        setPhase('review');
      };
      recognition.onend = () => {
        setPhase((p) => (p === 'listening' ? 'review' : p));
      };
      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch {
        setPhase('review');
      }
      setTimeout(() => {
        try { recognition.stop(); } catch {}
      }, 6000);
    } else {
      setTimeout(() => setPhase('review'), 1800);
    }
  };

  const handleGenerate = async () => {
    setPhase('generating');
    try {
      if (certRef.current) {
        await generateKeepsakePdf(certRef.current, `${childName}-birthday-keepsake.pdf`);
      }
      setPhase('done');
      confetti({ particleCount: 90, spread: 100, origin: { y: 0.5 }, colors: ['#f7d774', '#ff8fb1', '#c9a6ff'] });
    } catch {
      setPhase('review');
    }
  };

  const certData: CertificateData = {
    childName,
    childAge,
    senderName,
    personalMessage,
    spokenWish: wish,
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center overflow-hidden">
      <FairyDust count={22} />

      {/* offscreen render target for the PDF capture */}
      <div style={{ position: 'fixed', top: 0, left: -10000, pointerEvents: 'none' }} aria-hidden="true">
        <div ref={certRef}>
          <CertificateTemplate data={certData} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'prompt' && (
          <motion.div key="prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="z-10 flex flex-col items-center gap-6">
            <h2 className="mv2-heading mv2-shimmer-text text-2xl sm:text-4xl font-bold">{t('magicV2.finaleStage.promptHeading', { name: childName })}</h2>
            <p className="text-[#e6d9ff]/70 text-sm max-w-sm">
              {supportsSpeech ? t('magicV2.finaleStage.promptInstructionSpeech') : t('magicV2.finaleStage.promptInstructionType')}
            </p>
            <button
              onClick={startListening}
              className="mv2-glow-ring w-24 h-24 rounded-full bg-gradient-to-br from-[#3a1c5e] to-[#1b1036] border-2 border-[#f7d774]/70 flex items-center justify-center cursor-pointer"
              style={{ '--mv2-dur': '2.4s' } as React.CSSProperties}
              aria-label={t('magicV2.finaleStage.recordAriaLabel')}
            >
              <Mic className="w-9 h-9 text-[#f7d774]" />
            </button>
          </motion.div>
        )}

        {phase === 'listening' && (
          <motion.div key="listening" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="z-10 flex flex-col items-center gap-6">
            <h2 className="mv2-heading text-xl sm:text-2xl text-[#f7d774] font-bold">{t('magicV2.finaleStage.listeningHeading')}</h2>
            <div className="flex items-end gap-1.5 h-16">
              {bars.map((h, i) => (
                <motion.span
                  key={i}
                  className="w-2 rounded-full bg-gradient-to-t from-[#f7d774] to-[#ff8fb1]"
                  animate={{ height: [`${h * 20}%`, '100%', `${h * 40}%`] }}
                  transition={{ duration: 0.7 + (i % 3) * 0.15, repeat: Infinity, ease: 'easeInOut' }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {phase === 'transcribing' && (
          <motion.div key="transcribing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="z-10 flex flex-col items-center gap-4 text-[#f7d774]">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm uppercase tracking-[0.3em]">{t('magicV2.finaleStage.transcribingText')}</p>
          </motion.div>
        )}

        {phase === 'review' && (
          <motion.div key="review" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="z-10 flex flex-col items-center gap-5 w-full max-w-md">
            <h2 className="mv2-heading text-xl sm:text-2xl text-[#f7d774] font-bold">{t('magicV2.finaleStage.reviewHeading')}</h2>
            <textarea
              value={wish}
              onChange={(e) => setWish(e.target.value)}
              placeholder={t('magicV2.finaleStage.wishPlaceholder')}
              rows={3}
              className="w-full bg-white/10 border border-[#f7d774]/40 rounded-2xl px-4 py-3 text-[#fdf6e3] placeholder-[#e6d9ff]/40 text-center mv2-script text-2xl focus:outline-none focus:border-[#f7d774] resize-none"
              autoFocus
            />
            <button
              onClick={handleGenerate}
              disabled={!wish.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-[#f7d774] to-[#ff8fb1] text-[#2a1b3d] font-bold text-xs uppercase tracking-[0.25em] px-8 py-4 rounded-2xl shadow-lg disabled:opacity-40 cursor-pointer"
            >
              <Wand2 className="w-4 h-4" /> {t('magicV2.finaleStage.createButton')}
            </button>
          </motion.div>
        )}

        {phase === 'generating' && (
          <motion.div key="generating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="z-10 flex flex-col items-center gap-4 text-[#f7d774]">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm uppercase tracking-[0.3em]">{t('magicV2.finaleStage.generatingText')}</p>
          </motion.div>
        )}

        {phase === 'done' && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="z-10 flex flex-col items-center gap-5">
            <Sparkles className="w-10 h-10 text-[#f7d774]" />
            <h2 className="mv2-heading mv2-shimmer-text text-2xl sm:text-3xl font-bold">{t('magicV2.finaleStage.doneHeading')}</h2>
            <p className="text-[#e6d9ff]/70 text-sm max-w-sm">{t('magicV2.finaleStage.doneText', { name: childName })}</p>
            <button
              onClick={handleGenerate}
              className="flex items-center gap-2 bg-white/10 border border-[#f7d774]/50 text-[#f7d774] font-bold text-xs uppercase tracking-[0.25em] px-6 py-3 rounded-2xl cursor-pointer hover:bg-white/15 transition"
            >
              <Download className="w-4 h-4" /> {t('magicV2.finaleStage.downloadAgainButton')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
