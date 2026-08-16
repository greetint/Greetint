'use client';

import React, { useState } from 'react';
import Logo from '@/components/Logo';
import Link from 'next/link';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'giver' | 'receiver'>('receiver');
  const [isScratched, setIsScratched] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#1F1A17] font-sans selection:bg-[#DBCEB3] selection:text-[#1F1A17] overflow-x-hidden">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#F7F4EF]/85 border-b border-[#958679]/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition">
            <Logo variant="horizontal" height={34} />
          </Link>

          <nav className="hidden md:flex gap-10 text-[11px] tracking-[0.25em] uppercase text-[#958679] font-medium">
            <a href="#concept" className="hover:text-[#1F1A17] transition duration-200">Идеята</a>
            <a href="#experience" className="hover:text-[#1F1A17] transition duration-200">Преживяването</a>
            <a href="#process" className="hover:text-[#1F1A17] transition duration-200">Как работи</a>
          </nav>

          <Link 
            href="/create" 
            className="text-[11px] uppercase tracking-[0.2em] bg-[#1F1A17] text-[#F7F4EF] px-7 py-3.5 font-semibold hover:bg-[#958679] transition duration-300 shadow-md transform hover:-translate-y-0.5"
          >
            Създай Капсула
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative max-w-5xl mx-auto px-6 pt-20 pb-24 text-center flex flex-col items-center">
        <div className="relative mb-10 group cursor-pointer">
          <div className="absolute -inset-4 rounded-full border border-dashed border-[#958679]/30 group-hover:rotate-180 transition duration-1000 ease-out" />
          <Logo variant="icon-only" height={84} />
        </div>

        <span className="inline-block text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-[#958679] mb-6 font-semibold px-6 py-2 border border-[#958679]/30 rounded-full bg-[#EFECE6]/80 shadow-inner">
          Editorial Digital Capsules & Print Archives
        </span>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-[#1F1A17] mb-8 uppercase leading-[1.08] tracking-tight max-w-4xl">
          Подари повече от картичка. <br />
          <span className="italic font-normal text-[#958679]">Запечатай интерактивен спомен.</span>
        </h1>

        <p className="max-w-2xl text-[#1F1A17]/80 text-sm md:text-base leading-relaxed mb-12 font-light">
          GREETINT превръща рождения ден в премиум дигитално преживяване — персонален куест със скрити тайни, отключване на спомени, духване на свещ и финална капсула за бъдещето.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
          <Link 
            href="/create" 
            className="bg-[#1F1A17] text-[#F7F4EF] hover:bg-[#958679] px-11 py-4.5 text-xs uppercase tracking-[0.25em] font-bold transition duration-300 shadow-xl text-center"
          >
            Създай Интерактивна Картичка
          </Link>
          <a 
            href="#experience" 
            className="border border-[#1F1A17]/30 text-[#1F1A17] hover:border-[#1F1A17] hover:bg-[#EFECE6] px-9 py-4.5 text-xs uppercase tracking-[0.25em] font-medium transition duration-300 text-center"
          >
            Виж Преживяването ↓
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#958679]/20 py-10 px-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[#958679] text-[11px]">
        <Logo variant="horizontal" height={26} />
        <p>© 2026 GREETINT. All rights reserved. Editorial Time Capsules.</p>
      </footer>

    </div>
  );
}