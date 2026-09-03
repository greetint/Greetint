'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function EscapeRoomCreatePage() {
  return (
    <div className="min-h-screen bg-[#3A3532] text-[#F7F4EF] font-sans p-6 sm:p-12 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-[#1A1816] p-8 rounded-3xl shadow-2xl border border-[#958679]/30 text-center space-y-6">
        <Link href="/create/birthday/select-style" className="inline-block text-xs uppercase tracking-widest text-[#958679] hover:text-[#F7F4EF] transition">
          ← Избери друг стил
        </Link>
        <Logo variant="icon-only" height={80} />
        <h1 className="text-2xl font-serif font-bold text-[#F7F4EF]">Escape Room</h1>
        <p className="text-xs text-[#F7F4EF]/70 leading-relaxed">
          Този стил е заключен (Очаквайте скоро). Интерактивно приключение с кодове и таймери.
        </p>
        <Link 
          href="/create/birthday/select-style"
          className="block w-full bg-[#FAF6EE] text-[#11100F] py-3.5 rounded-2xl text-xs uppercase tracking-[0.25em] font-bold hover:bg-white transition shadow-md"
        >
          Към избор на стилове
        </Link>
      </div>
    </div>
  );
}
