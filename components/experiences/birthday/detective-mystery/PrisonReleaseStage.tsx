'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { playSoundEffect } from './utils/speech';
import { CaseFilePDF } from './CaseFilePDF';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface PrisonReleaseProps {
  recipient: string;
  age: string;
  sender: string;
  charges: string[];
  photos: { fileUrl: string }[];
  redactedWish: string;
  suspectProfile?: { alias: string; mainCrime?: string; distinguishingMark?: string; lastSeen?: string; specialSkill?: string };
  evidenceItems?: { fileUrl: string; clue: string; answer: string }[];
  evidenceClues?: string[];
  evidenceAnswers?: string[];
  isMuted?: boolean;
}

export function PrisonReleaseStage({ 
  recipient, 
  age, 
  sender, 
  charges, 
  photos, 
  redactedWish, 
  suspectProfile, 
  evidenceItems,
  evidenceClues,
  evidenceAnswers,
  isMuted = false 
}: PrisonReleaseProps) {
  const { t } = useLanguage();
  const [verified, setVerified] = useState(false);
  const [aliasInput, setAliasInput] = useState('');
  const [error, setError] = useState(false);
  const [answers, setAnswers] = useState<string[]>(Array(7).fill(''));
  const [completed, setCompleted] = useState(false);
  const target = (suspectProfile?.alias || recipient || t('detectiveMystery.experience.defaultRecipient')).trim().toLowerCase();

  const questions = [
    t('detectiveMystery.prisonReleaseStage.q1'),
    t('detectiveMystery.prisonReleaseStage.q2'),
    t('detectiveMystery.prisonReleaseStage.q3'),
    t('detectiveMystery.prisonReleaseStage.q4'),
    t('detectiveMystery.prisonReleaseStage.q5'),
    t('detectiveMystery.prisonReleaseStage.q6'),
    t('detectiveMystery.prisonReleaseStage.q7'),
  ];

  useEffect(() => {
    // No speech
  }, [isMuted]);

  const verify = (e: React.FormEvent) => {
    e.preventDefault();
    if (aliasInput.trim().toLowerCase() === target || aliasInput.trim().toLowerCase() === recipient.trim().toLowerCase()) {
      playSoundEffect('/audio/detective/lock-click.mp3', isMuted, 0.85);
      setVerified(true); setError(false);
    } else {
      setError(true);
      playSoundEffect('/audio/detective/stamp.mp3', isMuted, 0.9);
      if (navigator.vibrate) try { navigator.vibrate([100, 50, 100]); } catch (e) {}
    }
  };

  const handleDownloadPdf = () => {
    playSoundEffect('/audio/detective/stamp.mp3', isMuted, 0.9);
    window.print();
  };

  return (
    <div className="relative w-full h-full bg-[#11100F] text-[#F7F4EF] font-mono flex flex-col items-center justify-center p-4 sm:p-6 select-none overflow-y-auto">
      {!verified ? (
        <div className="max-w-md w-full bg-[#1A1816] p-8 rounded-3xl border-2 border-red-700/60 shadow-2xl text-center space-y-6">
          <div className="text-2xl">👮‍♂️</div>
          <h2 className="text-xl font-serif font-bold text-white uppercase">{t('detectiveMystery.prisonReleaseStage.interrogationTitle')}</h2>
          <p className="text-xs text-[#958679]">{t('detectiveMystery.prisonReleaseStage.interrogationInstruction')}</p>
          <form onSubmit={verify} className="space-y-4">
            <input type="text" value={aliasInput} onChange={e => setAliasInput(e.target.value)} placeholder={t('detectiveMystery.prisonReleaseStage.aliasPlaceholder')} className="w-full bg-black/70 border border-white/20 rounded-xl p-3 text-xs text-white text-center uppercase focus:outline-none" />
            {error && <p className="text-[11px] text-red-500 font-bold">{t('detectiveMystery.prisonReleaseStage.wrongIdentity')}</p>}
            <button type="submit" className="w-full bg-red-700 hover:bg-red-600 text-white py-3 rounded-xl text-xs uppercase tracking-widest font-black cursor-pointer">{t('detectiveMystery.prisonReleaseStage.confirmButton')}</button>
          </form>
        </div>
      ) : !completed ? (
        <div className="max-w-2xl w-full bg-[#EFECE6] text-[#1F1A17] p-8 rounded-2xl shadow-2xl border space-y-6 my-auto relative">
          <h2 className="text-2xl font-serif font-bold uppercase text-black">{t('detectiveMystery.prisonReleaseStage.subjectHeading', { recipient })}</h2>
          <form onSubmit={(e) => { e.preventDefault(); setCompleted(true); playSoundEffect('/audio/detective/stamp.mp3', isMuted, 0.9); }} className="space-y-4">
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
              {questions.map((q, i) => (
                <div key={i} className="bg-white p-3 rounded-xl border space-y-1">
                  <label className="text-xs font-bold text-black block">{q}</label>
                  <input type="text" required value={answers[i]} onChange={e => { const u = [...answers]; u[i] = e.target.value; setAnswers(u); }} placeholder={t('detectiveMystery.prisonReleaseStage.answerPlaceholder')} className="w-full bg-[#F7F4EF] border p-2 rounded text-xs text-black focus:outline-none" />
                </div>
              ))}
            </div>
            <button type="submit" className="w-full bg-red-700 hover:bg-red-600 text-white py-3 rounded-xl text-xs uppercase tracking-widest font-black cursor-pointer">{t('detectiveMystery.prisonReleaseStage.closeProtocolButton')}</button>
          </form>
        </div>
      ) : (
        <div className="max-w-xl w-full bg-[#EFECE6] text-[#1F1A17] p-8 rounded-3xl border-4 border-red-700 shadow-2xl text-center space-y-6 my-auto">
          <div className="w-16 h-16 bg-green-950 text-green-400 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto text-2xl">✓</div>
          <h2 className="text-2xl font-serif font-bold uppercase text-black">{t('detectiveMystery.prisonReleaseStage.freeHeading', { recipient })}</h2>
          <button
            onClick={handleDownloadPdf}
            className="w-full bg-red-700 hover:bg-red-800 text-white py-4 rounded-xl text-xs uppercase tracking-[0.2em] font-black shadow-lg transition cursor-pointer border-2 border-black flex items-center justify-center gap-2"
          >
            <span>{t('detectiveMystery.prisonReleaseStage.downloadPdfButton')}</span>
          </button>
        </div>
      )}

      <CaseFilePDF
        recipient={recipient}
        age={age}
        sender={sender}
        suspectProfile={suspectProfile}
        redactedWish={redactedWish}
        evidenceItems={evidenceItems}
        evidenceClues={evidenceClues}
        evidenceAnswers={evidenceAnswers}
        photos={photos}
      />
    </div>
  );
}


