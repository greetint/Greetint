'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function DetectiveMysteryCreatePage() {
  const [recipient, setRecipient] = useState('');
  const [age, setAge] = useState('');
  const [sender, setSender] = useState('');
  const [suspectProfile, setSuspectProfile] = useState({
    alias: '',
    mainCrime: '',
    distinguishingMark: '',
    lastSeen: '',
    specialSkill: ''
  });
  const [secretClue, setSecretClue] = useState('');
  const [secretAnswer, setSecretAnswer] = useState('');
  const [redactedWish, setRedactedWish] = useState('');
  const [photos, setPhotos] = useState<{fileUrl: string}[]>([]);
  const [createdLink, setCreatedLink] = useState<string | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).map(f => ({ fileUrl: URL.createObjectURL(f) }));
      setPhotos(p => [...p, ...files].slice(0, 5));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Math.random().toString(36).substring(2, 9);
    const link = `${window.location.origin}/card/${id}`;
    const payload = {
      occasion: 'birthday',
      styleId: 'detective-mystery',
      recipient,
      age: age || '30',
      sender: sender || 'Инспектор',
      suspectProfile: {
        alias: suspectProfile.alias || 'Шеф на купона',
        mainCrime: suspectProfile.mainCrime || 'Превишена скорост на празнуване',
        distinguishingMark: suspectProfile.distinguishingMark || 'Заразно добро настроение',
        lastSeen: suspectProfile.lastSeen || 'На дансинга в петък вечер',
        specialSkill: suspectProfile.specialSkill || 'Неоторизирано ядене на торта'
      },
      secretClue: secretClue || 'Любимо място?',
      secretAnswer: secretAnswer || 'кафе',
      redactedWish: redactedWish || 'Честит рожден ден!',
      photos: photos.map(p => ({ fileUrl: p.fileUrl }))
    };
    localStorage.setItem(`quest_${id}`, JSON.stringify(payload));
    if (recipient) localStorage.setItem(`quest_${encodeURIComponent(recipient.toLowerCase())}`, JSON.stringify(payload));
    setCreatedLink(link);
  };

  return (
    <main className="min-h-screen bg-[#11100F] text-[#F7F4EF] font-mono p-4 sm:p-6 flex items-center justify-center">
      <div className="max-w-xl w-full space-y-6">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <Link href="/create/birthday/select-style" className="text-xs text-[#958679]">← Назад</Link>
          <span className="text-red-500 text-[10px] font-bold uppercase tracking-widest">FBI // TOP SECRET DOSSIER</span>
        </div>
        <h1 className="text-2xl font-bold text-center tracking-wider">Detective Mystery: Създай Досие</h1>
        
        {!createdLink ? (
          <form onSubmit={handleSubmit} className="relative bg-[#E3D5C8] text-[#2C241D] p-8 sm:p-10 rounded-2xl shadow-2xl border border-[#b8a690] space-y-6 font-mono overflow-hidden">
            
            {/* Red Tilted Stamp */}
            <div className="absolute top-4 right-4 border-4 border-red-700 text-red-700 px-3 py-1 font-black text-xs uppercase tracking-[0.25em] transform rotate-12 pointer-events-none opacity-85 shadow-sm">
              [ CLASSIFIED // FILL DATA ]
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-red-800 border-b border-black/20 pb-2">
                1. Обща информация за субекта
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 block mb-1">Име на рожденика:</label>
                  <input type="text" required value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="напр. Александър" className="w-full bg-transparent border-b border-black/50 py-2 text-sm text-black placeholder:text-black/30 font-mono focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 block mb-1">Възраст:</label>
                  <input type="text" required value={age} onChange={e => setAge(e.target.value)} placeholder="напр. 30" className="w-full bg-transparent border-b border-black/50 py-2 text-sm text-black placeholder:text-black/30 font-mono focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 block mb-1">Подател (Инспектор):</label>
                <input type="text" required value={sender} onChange={e => setSender(e.target.value)} placeholder="напр. Инспектор Петров" className="w-full bg-transparent border-b border-black/50 py-2 text-sm text-black placeholder:text-black/30 font-mono focus:outline-none" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-red-800 border-b border-black/20 pb-2">
                2. Профил на престъпника (Секретни данни)
              </h3>
              
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 block mb-1">Кодово име / Прякор (Alias):</label>
                <input type="text" required value={suspectProfile.alias} onChange={e => setSuspectProfile(p => ({...p, alias: e.target.value}))} placeholder="напр. Шеф на купона" className="w-full bg-transparent border-b border-black/50 py-2 text-sm text-black placeholder:text-black/30 font-mono focus:outline-none" />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 block mb-1">Отличителен белег (Distinguishing Mark):</label>
                <input type="text" required value={suspectProfile.distinguishingMark} onChange={e => setSuspectProfile(p => ({...p, distinguishingMark: e.target.value}))} placeholder="напр. Заразно добро настроение" className="w-full bg-transparent border-b border-black/50 py-2 text-sm text-black placeholder:text-black/30 font-mono focus:outline-none" />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 block mb-1">Последно забелязан (Last Seen):</label>
                <input type="text" required value={suspectProfile.lastSeen} onChange={e => setSuspectProfile(p => ({...p, lastSeen: e.target.value}))} placeholder="напр. На дансинга в петък вечер" className="w-full bg-transparent border-b border-black/50 py-2 text-sm text-black placeholder:text-black/30 font-mono focus:outline-none" />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 block mb-1">Специално умение (Special Skill):</label>
                <input type="text" required value={suspectProfile.specialSkill} onChange={e => setSuspectProfile(p => ({...p, specialSkill: e.target.value}))} placeholder="напр. Неоторизирано ядене на торта" className="w-full bg-transparent border-b border-black/50 py-2 text-sm text-black placeholder:text-black/30 font-mono focus:outline-none" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-red-800 border-b border-black/20 pb-2">
                3. Допълнителни улики и послание
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 block mb-1">Секретна улика / Въпрос:</label>
                  <input type="text" required value={secretClue} onChange={e => setSecretClue(e.target.value)} placeholder="напр. Къде празнуваме?" className="w-full bg-transparent border-b border-black/50 py-2 text-sm text-black placeholder:text-black/30 font-mono focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 block mb-1">Отговор (Парола):</label>
                  <input type="text" required value={secretAnswer} onChange={e => setSecretAnswer(e.target.value)} placeholder="напр. кафе" className="w-full bg-transparent border-b border-black/50 py-2 text-sm text-black placeholder:text-black/30 font-mono focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 block mb-1">Послание под цензура (Redacted Wish):</label>
                <textarea rows={3} required value={redactedWish} onChange={e => setRedactedWish(e.target.value)} placeholder="Честит рожден ден! Бъди все така..." className="w-full bg-transparent border-b border-black/50 py-2 text-sm text-black placeholder:text-black/30 font-mono focus:outline-none resize-none" />
              </div>

              <div className="space-y-2 pt-2">
                <input type="file" multiple accept="image/*" onChange={handleUpload} id="p-up" className="hidden" />
                <label htmlFor="p-up" className="block text-center text-xs bg-black/10 hover:bg-black/20 text-black py-3 rounded-xl cursor-pointer font-bold border border-black/20 transition">Качи снимки за доказателства (до 5)</label>
                {photos.length > 0 && <div className="flex gap-2 pt-2">{photos.map((p, i) => <img key={i} src={p.fileUrl} className="w-12 h-12 object-cover rounded-xl border border-black/30" />)}</div>}
              </div>
            </div>

            <button type="submit" className="w-full bg-red-700 hover:bg-red-800 text-white py-4 rounded-xl text-xs uppercase tracking-[0.25em] font-black shadow-lg transition cursor-pointer">
              [ СЪЗДАЙ СЕКРЕТНО ДОСИЕ ]
            </button>
          </form>
        ) : (
          <div className="bg-[#E3D5C8] text-[#2C241D] p-8 rounded-2xl shadow-2xl border border-[#b8a690] text-center space-y-4">
            <h2 className="text-xl font-black uppercase tracking-wider">Досието е готово!</h2>
            <div className="bg-black/10 p-3 rounded-xl select-all text-xs text-red-800 font-bold border border-black/20">{createdLink}</div>
            <a href={createdLink} target="_blank" rel="noreferrer" className="inline-block bg-red-700 hover:bg-red-800 text-white px-6 py-4 rounded-xl text-xs uppercase tracking-[0.25em] font-black shadow-lg transition">Отвори секретното досие →</a>
          </div>
        )}
      </div>
    </main>
  );
}

