'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { playSoundEffect } from './utils/speech';

interface PrisonReleaseProps {
  recipient: string;
  age: string;
  sender: string;
  charges: string[];
  photos: { fileUrl: string }[];
  redactedWish: string;
  suspectProfile?: { alias: string };
  isMuted?: boolean;
}

export function PrisonReleaseStage({ recipient, age, sender, charges, photos, redactedWish, suspectProfile, isMuted = false }: PrisonReleaseProps) {
  const [verified, setVerified] = useState(false);
  const [aliasInput, setAliasInput] = useState('');
  const [error, setError] = useState(false);
  const [answers, setAnswers] = useState<string[]>(Array(7).fill(''));
  const [completed, setCompleted] = useState(false);
  const target = (suspectProfile?.alias || recipient || 'Заподозрян').trim().toLowerCase();

  const questions = [
    "1. Най-голямото ти престъпление (изцепка) през годината?",
    "2. Кой приятел ти помогна най-много през последните 12 месеца?",
    "3. Най-ценният трофей / спомен, който отнасяш със себе си?",
    "4. Каква е голямата цел за следващата година на свобода?",
    "5. Коя държава/град подготвяш за следващия си голям обир?",
    "6. Какъв специален план имаш за следващия рожден ден?",
    "7. Какво е твоето лично послание към теб самия / инспекторите?"
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

  return (
    <div className="relative w-full h-full bg-[#11100F] text-[#F7F4EF] font-mono flex flex-col items-center justify-center p-4 sm:p-6 select-none overflow-y-auto">
      {!verified ? (
        <div className="max-w-md w-full bg-[#1A1816] p-8 rounded-3xl border-2 border-red-700/60 shadow-2xl text-center space-y-6">
          <div className="text-2xl">👮‍♂️</div>
          <h2 className="text-xl font-serif font-bold text-white uppercase">Разпит на заподозрян</h2>
          <p className="text-xs text-[#958679]">Въведете името или alias на рожденика:</p>
          <form onSubmit={verify} className="space-y-4">
            <input type="text" value={aliasInput} onChange={e => setAliasInput(e.target.value)} placeholder="Име или alias..." className="w-full bg-black/70 border border-white/20 rounded-xl p-3 text-xs text-white text-center uppercase focus:outline-none" />
            {error && <p className="text-[11px] text-red-500 font-bold">[ ГРЕШНА САМОЛИЧНОСТ ]</p>}
            <button type="submit" className="w-full bg-red-700 hover:bg-red-600 text-white py-3 rounded-xl text-xs uppercase tracking-widest font-black cursor-pointer">Потвърди</button>
          </form>
        </div>
      ) : !completed ? (
        <div className="max-w-2xl w-full bg-[#EFECE6] text-[#1F1A17] p-8 rounded-2xl shadow-2xl border space-y-6 my-auto relative">
          <h2 className="text-2xl font-serif font-bold uppercase text-black">Субект: {recipient}</h2>
          <form onSubmit={(e) => { e.preventDefault(); setCompleted(true); playSoundEffect('/audio/detective/stamp.mp3', isMuted, 0.9); }} className="space-y-4">
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
              {questions.map((q, i) => (
                <div key={i} className="bg-white p-3 rounded-xl border space-y-1">
                  <label className="text-xs font-bold text-black block">{q}</label>
                  <input type="text" required value={answers[i]} onChange={e => { const u = [...answers]; u[i] = e.target.value; setAnswers(u); }} placeholder="Вашият отговор..." className="w-full bg-[#F7F4EF] border p-2 rounded text-xs text-black focus:outline-none" />
                </div>
              ))}
            </div>
            <button type="submit" className="w-full bg-red-700 hover:bg-red-600 text-white py-3 rounded-xl text-xs uppercase tracking-widest font-black cursor-pointer">Затвори протокола ✓</button>
          </form>
        </div>
      ) : (
        <div className="max-w-xl w-full bg-[#EFECE6] text-[#1F1A17] p-8 rounded-3xl border-4 border-red-700 shadow-2xl text-center space-y-6 my-auto">
          <div className="w-16 h-16 bg-green-950 text-green-400 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto text-2xl">✓</div>
          <h2 className="text-2xl font-serif font-bold uppercase text-black">Субектът {recipient} е на свобода!</h2>
          <button onClick={() => window.print()} className="w-full bg-red-700 hover:bg-red-600 text-white py-4 rounded-xl text-xs uppercase tracking-widest font-black cursor-pointer">🖨️ Принтирай Федералното Досие</button>
        </div>
      )}
    </div>
  );
}


