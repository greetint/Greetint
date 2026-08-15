'use client';

import React, { useState } from 'react';
import Logo from '@/components/Logo';
import Link from 'next/link';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'giver' | 'receiver'>('receiver');
  const [isScratched, setIsScratched] = useState(false);

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#1F1A17] font-sans selection:bg-[#DBCEB3] selection:text-[#1F1A17] overflow-x-hidden">
      
      {/* 1. HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#F7F4EF]/80 border-b border-[#958679]/20 px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition">
            <Logo variant="horizontal" height={34} />
          </Link>
          
          <nav className="hidden md:flex gap-10 text-[11px] tracking-[0.25em] uppercase text-[#958679] font-medium">
            <a href="#demo" className="hover:text-[#1F1A17] transition duration-200">Демо Интерактив</a>
            <a href="#concept" className="hover:text-[#1F1A17] transition duration-200">Концепция</a>
            <a href="#how-it-works" className="hover:text-[#1F1A17] transition duration-200">Процес</a>
          </nav>

          <Link 
            href="/create" 
            className="text-[11px] uppercase tracking-[0.2em] bg-[#1F1A17] text-[#F7F4EF] px-6 py-3 font-semibold hover:bg-[#958679] transition duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Създай Капсула
          </Link>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative max-w-6xl mx-auto px-6 pt-16 pb-20 text-center flex flex-col items-center">
        {/* Анимиран монограм с фин ротиращ пръстен */}
        <div className="relative mb-8 group cursor-pointer">
          <div className="absolute -inset-3 rounded-full border border-dashed border-[#958679]/40 group-hover:rotate-180 transition duration-1000 ease-out" />
          <Logo variant="icon-only" height={72} />
        </div>

        <span className="inline-block text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-[#958679] mb-6 font-semibold px-5 py-2 border border-[#958679]/30 rounded-full bg-[#EFECE6]/70 shadow-inner">
          Editorial Time Capsules & Print Archives
        </span>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-[#1F1A17] mb-6 uppercase leading-[1.08] tracking-tight max-w-4xl">
          Не просто картичка. <br />
          <span className="italic font-normal text-[#958679]">Персонален дигитален ритуал.</span>
        </h1>

        <p className="max-w-2xl text-[#1F1A17]/80 text-sm md:text-base leading-relaxed mb-10 font-light">
          GREETINT превръща рождения ден в интерактивна капсула на времето — с онлайн куест за рожденика, триене на тайни спомени и генериране на луксозен архив за печат.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/create" 
            className="bg-[#1F1A17] text-[#F7F4EF] hover:bg-[#958679] px-10 py-4 text-xs uppercase tracking-[0.25em] font-bold transition duration-300 shadow-lg text-center"
          >
            Започни Капсула ( Basic )
          </Link>
          <a 
            href="#demo" 
            className="border border-[#1F1A17]/30 text-[#1F1A17] hover:border-[#1F1A17] hover:bg-[#EFECE6] px-8 py-4 text-xs uppercase tracking-[0.25em] font-medium transition duration-300 text-center"
          >
            Тествай Демото ↓
          </a>
        </div>
      </section>

      {/* 3. INTERACTIVE DEMO PREVIEW (ХВАЩАЩ ВНИМАНИЕТО МОДУЛ) */}
      <section id="demo" className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-[#EFECE6] border border-[#958679]/30 p-8 md:p-12 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-center mb-8 border-b border-[#958679]/20 pb-4">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#958679]">
              Interactive Preview // Basic Style
            </span>
            <div className="flex gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1F1A17]/20" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#1F1A17]/20" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#DBCEB3]" />
            </div>
          </div>

          <div className="text-center space-y-6">
            <h3 className="text-2xl font-serif uppercase text-[#1F1A17]">
              Закачка за изтриване (Scratch Reveal)
            </h3>
            <p className="text-xs text-[#958679] max-w-md mx-auto">
              Кликни върху златното покритие по-долу, за да разкриеш как рожденикът изтрива тайната шега:
            </p>

            {/* ИНТЕРАКТИВЕН SCRATCH БЛОК */}
            <div 
              onClick={() => setIsScratched(true)}
              className="max-w-md mx-auto h-28 bg-[#DBCEB3] border border-[#958679]/40 flex items-center justify-center p-6 cursor-pointer relative transition duration-500 hover:scale-[1.02] shadow-inner"
            >
              {!isScratched ? (
                <div className="text-center">
                  <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#1F1A17]">
                    ✨ Кликни за изтриване
                  </span>
                  <span className="block text-[10px] text-[#1F1A17]/60 mt-1">
                    (Скрит спомен за рожденика)
                  </span>
                </div>
              ) : (
                <p className="text-xs font-serif italic text-[#1F1A17] animate-fade-in">
                  "Спомняш ли си, когато изпусна телефона и твърдеше, че е водоустойчив? Пазим го в пълна тайна!" 🤫
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. ТАБОВЕ ЗА ПРЕГЛЕД (ЗА ПОДАРЯВАЩИЯ / ЗА РОЖДЕНИКА) */}
      <section id="concept" className="max-w-6xl mx-auto px-6 py-20 border-t border-[#958679]/20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#958679] font-bold">Двете страни</span>
          <h2 className="text-2xl md:text-4xl font-serif uppercase text-[#1F1A17] mt-2">
            Каква е разликата?
          </h2>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setActiveTab('receiver')}
              className={`px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-bold transition ${
                activeTab === 'receiver' 
                  ? 'bg-[#1F1A17] text-[#F7F4EF]' 
                  : 'bg-[#EFECE6] text-[#958679] hover:text-[#1F1A17]'
              }`}
            >
              За Рожденика
            </button>
            <button
              onClick={() => setActiveTab('giver')}
              className={`px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-bold transition ${
                activeTab === 'giver' 
                  ? 'bg-[#1F1A17] text-[#F7F4EF]' 
                  : 'bg-[#EFECE6] text-[#958679] hover:text-[#1F1A17]'
              }`}
            >
              За Подаряващия
            </button>
          </div>
        </div>

        <div className="bg-[#EFECE6]/80 p-8 md:p-12 border border-[#958679]/20 max-w-3xl mx-auto transition-all">
          {activeTab === 'receiver' ? (
            <div className="space-y-4 text-center md:text-left">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#958679] font-bold">Изживяването</span>
              <h3 className="text-xl font-serif text-[#1F1A17]">Дигитален куест + Спомен завинаги</h3>
              <p className="text-xs md:text-sm text-[#1F1A17]/80 leading-relaxed">
                Рожденикът сканира QR кода, разпечатва восъчния печат, изтрива фолиото на тайната шега, отговаря на загадката за галерията, духва свещта на екрана и попълва своите 7 отговора за бъдещето.
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-center md:text-left">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#958679] font-bold">Бързина & Улеснение</span>
              <h3 className="text-xl font-serif text-[#1F1A17]">Сглоби за 3 минути</h3>
              <p className="text-xs md:text-sm text-[#1F1A17]/80 leading-relaxed">
                Без нужда да мислиш дълги текстове. Избираш от нашите забавни готови реплики, качваш няколко любими снимки и пишеш пожеланието. Всичко останало се генерира автоматично.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 5. CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <Logo variant="icon-only" height={54} className="mb-6 opacity-90" />
        <h2 className="text-3xl md:text-5xl font-serif uppercase text-[#1F1A17] mb-6 tracking-tight">
          Готови ли сте да създадете първата си Капсула?
        </h2>
        <Link 
          href="/create" 
          className="inline-block bg-[#1F1A17] text-[#F7F4EF] hover:bg-[#958679] px-12 py-5 text-xs uppercase tracking-[0.3em] font-bold transition duration-300 shadow-xl transform hover:-translate-y-1"
        >
          Започни с Basic Стил
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#958679]/20 py-10 px-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[#958679] text-[11px]">
        <Logo variant="horizontal" height={26} />
        <p>© 2026 GREETINT. All rights reserved. Editorial Time Capsules.</p>
      </footer>

    </div>
  );
}