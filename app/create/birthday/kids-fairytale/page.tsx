'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { Sparkles, ArrowLeft, Copy, Check } from 'lucide-react';

export default function KidsFairytaleCreatePage() {
  const [fd, setFd] = useState({ childName: 'Габи', childAge: '6', senderName: 'Мама', personalMessage: 'Ти правиш света по-красив!', favoriteAnimal: 'единорог' });
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Math.random().toString(36).substring(2, 9);
    const link = `${window.location.origin}/kids-fairytale?id=${id}`;
    localStorage.setItem(`quest_${id}`, JSON.stringify({ occasion: 'birthday', styleId: 'kids-fairytale', ...fd }));
    setCreatedLink(link);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFF0F5] to-[#FCE4EC] text-[#2C241D] font-sans p-4 sm:p-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-pink-200 space-y-6">
        <div className="flex justify-between items-center border-b border-pink-100 pb-4">
          <Link href="/create/birthday/select-style" className="text-xs font-bold uppercase tracking-widest text-[#958679] hover:text-[#2C241D] transition flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Избери стил
          </Link>
          <Logo variant="icon-only" height={40} />
        </div>

        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.25em] bg-pink-100 text-pink-700 px-3 py-1 rounded-full font-bold">✨ Sandbox рут</span>
          <h1 className="text-2xl font-serif font-bold text-[#2C241D]">Kids Fairytale: Създай Магията</h1>
        </div>

        {!createdLink ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-[#2C241D]/70 block mb-1">Име:</label>
                <input type="text" required value={fd.childName} onChange={e => setFd({...fd, childName: e.target.value})} className="w-full bg-pink-50/50 border border-pink-200 p-3 rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-[#2C241D]/70 block mb-1">Възраст:</label>
                <input type="number" required value={fd.childAge} onChange={e => setFd({...fd, childAge: e.target.value})} className="w-full bg-pink-50/50 border border-pink-200 p-3 rounded-xl text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-[#2C241D]/70 block mb-1">Подарител:</label>
              <input type="text" required value={fd.senderName} onChange={e => setFd({...fd, senderName: e.target.value})} className="w-full bg-pink-50/50 border border-pink-200 p-3 rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-[#2C241D]/70 block mb-1">Послание:</label>
              <textarea rows={3} required value={fd.personalMessage} onChange={e => setFd({...fd, personalMessage: e.target.value})} className="w-full bg-pink-50/50 border border-pink-200 p-3 rounded-xl text-sm resize-none" />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-2xl text-xs font-bold uppercase tracking-[0.25em] shadow-lg hover:opacity-90 transition flex items-center justify-center gap-2 cursor-pointer">
              <Sparkles className="w-4 h-4" /> Генерирай приказката ✨
            </button>
          </form>
        ) : (
          <div className="space-y-6 text-center py-6">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-medium">
              🎉 Приказката е успешно създадена!
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest text-[#2C241D]/60 font-bold block">Линк:</label>
              <div className="flex gap-2">
                <input type="text" readOnly value={createdLink} className="w-full bg-pink-50 border border-pink-200 px-4 py-3 rounded-xl text-xs font-mono text-[#2C241D]" />
                <button onClick={() => { navigator.clipboard.writeText(createdLink); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="bg-[#2C241D] text-white px-5 py-3 rounded-xl hover:bg-[#4A3D34] transition flex items-center justify-center">
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex gap-4">
              <a href={createdLink} target="_blank" rel="noopener noreferrer" className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest shadow-md text-center block">
                Отвори приказката 🚀
              </a>
              <button onClick={() => setCreatedLink(null)} className="px-5 bg-gray-200 text-[#2C241D] py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-gray-300 transition">
                Нова
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
