'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function KidsFairytaleCreatePage() {
  return (
    <div className="min-h-screen bg-[#FFF0F5] text-[#1F1A17] font-sans p-6 sm:p-12 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white/85 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-[#958679]/20 text-center space-y-6">
        <Link href="/create/birthday/select-style" className="inline-block text-xs uppercase tracking-widest text-[#958679] hover:text-[#1F1A17] transition">
          ← Избери друг стил
        </Link>
        <Logo variant="icon-only" height={80} />
        <h1 className="text-2xl font-serif font-bold text-[#11100F]">Kids Magic (Fairytale)</h1>
        <p className="text-xs text-[#11100F]/70 leading-relaxed">
          Тази форма за детски приказен стил е подготвена като независим шаблон и очаква следващия етап на развитие.
        </p>
        <Link 
          href="/create/birthday/select-style"
          className="block w-full bg-[#11100F] text-[#FAF6EE] py-3.5 rounded-2xl text-xs uppercase tracking-[0.25em] font-bold hover:bg-[#958679] transition shadow-md"
        >
          Към избор на стилове
        </Link>
      </div>
    </div>
  );
}
