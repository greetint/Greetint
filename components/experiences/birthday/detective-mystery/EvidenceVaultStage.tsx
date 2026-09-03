'use client';

import React, { useState, useEffect } from 'react';

interface EvidenceVaultProps {
  secretClue: string;
  secretAnswer: string;
  photos: { fileUrl: string }[];
  onComplete: () => void;
}

export function EvidenceVaultStage({ secretClue, secretAnswer, photos, onComplete }: EvidenceVaultProps) {
  const [userInput, setUserInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `Доказателственият материал е заключен. Въведете верния отговор на секретната улика, за да разшифровате архива.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'bg-BG';
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleUnlockCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim().toLowerCase() === (secretAnswer || 'кафе').trim().toLowerCase()) {
      // Play lock click sfx
      const audio = new Audio('/audio/detective/lock-click.mp3');
      audio.volume = 0.8;
      audio.play().catch(() => {});
      setIsUnlocked(true);
      setErrorMsg(false);
    } else {
      setErrorMsg(true);
    }
  };

  return (
    <div className="relative w-full h-full bg-[#11100F] text-[#F7F4EF] font-mono flex flex-col items-center justify-center p-6 select-none overflow-y-auto">
      
      {!isUnlocked ? (
        <div className="max-w-md w-full bg-[#1A1816] p-8 sm:p-10 rounded-3xl border-2 border-yellow-600/50 shadow-2xl text-center space-y-6">
          <div className="inline-block p-3 rounded-full bg-yellow-950 text-yellow-500 text-xl font-bold border border-yellow-600/30">
            🔐
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-serif font-bold text-white uppercase">Сейф с Доказателства</h2>
            <p className="text-xs text-[#958679] leading-relaxed">
              Загадка: <strong className="text-yellow-400">{secretClue || 'Коя е любимата ни напитка?'}</strong>
            </p>
          </div>

          <form onSubmit={handleUnlockCheck} className="space-y-4">
            <input 
              type="text" 
              value={userInput} 
              onChange={e => setUserInput(e.target.value)} 
              placeholder="Въведи парола / отговор..." 
              className="w-full bg-black/60 border border-white/20 rounded-xl p-3.5 text-xs text-white text-center focus:outline-none focus:border-yellow-500"
            />
            {errorMsg && <p className="text-[11px] text-red-500">Грешен отговор! Опитайте отново.</p>}
            <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-500 text-black py-3.5 rounded-xl text-xs uppercase tracking-[0.25em] font-bold shadow-lg transition cursor-pointer">
              Отвори сейфа 🔓
            </button>
          </form>
        </div>
      ) : (
        <div className="max-w-3xl w-full space-y-8 text-center animate-fade-in py-10">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-red-500 font-bold block">Сейфът е отворен</span>
            <h2 className="text-3xl font-serif font-bold text-white">Веществени Доказателства (Снимки)</h2>
            <p className="text-xs text-[#958679]">Кликни върху снимка за детайлен преглед</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            {photos.length > 0 ? photos.map((p, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedImage(p.fileUrl)}
                className="bg-[#EFECE6] p-4 pb-8 rounded-xl shadow-2xl border border-black/20 transform hover:-translate-y-2 transition cursor-pointer group relative"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-4 bg-slate-400 rounded-t-full border border-slate-600 shadow" />
                <img src={p.fileUrl} alt="Evidence" className="w-full aspect-square object-cover rounded shadow-inner" />
                <span className="text-[10px] font-mono text-black/60 mt-3 block uppercase tracking-widest">Доказателство №{idx + 1}</span>
              </div>
            )) : (
              <p className="col-span-3 text-xs text-[#958679]">Няма качени снимки от инспектора.</p>
            )}
          </div>

          <div className="pt-6">
            <button 
              onClick={onComplete}
              className="bg-red-700 hover:bg-red-600 text-white px-10 py-4 rounded-2xl text-xs uppercase tracking-[0.25em] font-bold shadow-xl transition border border-red-500/50 cursor-pointer"
            >
              Към секретното писмо (Redacted) →
            </button>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedImage && (
        <div onClick={() => setSelectedImage(null)} className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-[#EFECE6] p-4 pb-10 rounded-2xl shadow-2xl border-4 border-black">
            <img src={selectedImage} alt="Enlarged" className="w-full h-auto max-h-[75vh] object-contain rounded" />
            <span className="text-xs font-mono text-black mt-4 block text-center uppercase tracking-widest font-bold">ФЕДЕРАЛНО ДОКАЗАТЕЛСТВО // ЕВИДЕНЦИЯ</span>
          </div>
        </div>
      )}

    </div>
  );
}
