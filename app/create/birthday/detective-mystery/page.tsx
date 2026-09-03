'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function DetectiveMysteryCreatePage() {
  const [recipient, setRecipient] = useState('');
  const [age, setAge] = useState('');
  const [sender, setSender] = useState('');
  const [charges, setCharges] = useState(['', '', '']);
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
      charges: charges.filter(Boolean),
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
    <main className="min-h-screen bg-[#11100F] text-[#F7F4EF] font-mono p-6">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <Link href="/create/birthday/select-style" className="text-xs text-[#958679]">← Назад</Link>
          <span className="text-red-500 text-[10px] font-bold">FBI // TOP SECRET</span>
        </div>
        <h1 className="text-2xl font-bold text-center">Detective Mystery: Досие</h1>
        {!createdLink ? (
          <form onSubmit={handleSubmit} className="bg-[#1A1816] p-6 rounded-3xl border border-white/10 space-y-4">
            <input type="text" required value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="Име на получател" className="w-full bg-black/50 border border-white/20 rounded-xl p-3 text-xs text-white" />
            <input type="text" required value={age} onChange={e => setAge(e.target.value)} placeholder="Възраст" className="w-full bg-black/50 border border-white/20 rounded-xl p-3 text-xs text-white" />
            <input type="text" required value={sender} onChange={e => setSender(e.target.value)} placeholder="Подател" className="w-full bg-black/50 border border-white/20 rounded-xl p-3 text-xs text-white" />
            
            <div className="space-y-2">
              <label className="text-[10px] text-red-500 uppercase font-bold">Обвинения (3 броя)</label>
              {charges.map((c, i) => (
                <input key={i} type="text" required value={c} onChange={e => { const u = [...charges]; u[i] = e.target.value; setCharges(u); }} placeholder={`Обвинение #${i+1}`} className="w-full bg-black/50 border border-white/20 rounded-xl p-3 text-xs text-white" />
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input type="text" required value={secretClue} onChange={e => setSecretClue(e.target.value)} placeholder="Секретна улика / въпрос" className="bg-black/50 border border-white/20 rounded-xl p-3 text-xs text-white" />
              <input type="text" required value={secretAnswer} onChange={e => setSecretAnswer(e.target.value)} placeholder="Отговор (парола)" className="bg-black/50 border border-white/20 rounded-xl p-3 text-xs text-white" />
            </div>

            <textarea rows={3} required value={redactedWish} onChange={e => setRedactedWish(e.target.value)} placeholder="Послание под цензура..." className="w-full bg-black/50 border border-white/20 rounded-xl p-3 text-xs text-white font-serif resize-none" />

            <div className="space-y-2">
              <input type="file" multiple accept="image/*" onChange={handleUpload} id="p-up" className="hidden" />
              <label htmlFor="p-up" className="block text-center text-xs bg-white/10 text-white py-2.5 rounded-xl cursor-pointer">Качи снимки (до 5)</label>
              {photos.length > 0 && <div className="flex gap-2">{photos.map((p, i) => <img key={i} src={p.fileUrl} className="w-12 h-12 object-cover rounded-xl" />)}</div>}
            </div>

            <button type="submit" className="w-full bg-red-700 text-white py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold">Създай Разследване</button>
          </form>
        ) : (
          <div className="bg-[#1A1816] p-6 rounded-3xl border text-center space-y-4">
            <h2 className="text-xl font-bold text-white">Готово!</h2>
            <div className="bg-black/60 p-3 rounded-xl select-all text-xs text-red-400 font-bold">{createdLink}</div>
            <a href={createdLink} target="_blank" rel="noreferrer" className="inline-block bg-red-700 text-white px-6 py-3 rounded-xl text-xs uppercase tracking-widest font-bold">Отвори досието →</a>
          </div>
        )}
      </div>
    </main>
  );
}

