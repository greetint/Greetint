'use client';

import React, { useState } from 'react';
import Logo from '@/components/Logo';
import Link from 'next/link';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'giver' | 'receiver'>('receiver');

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#1F1A17] font-sans overflow-x-hidden">
      
      {/* 1. HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#F7F4EF]/85 border-b border-[#958679]/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition">
            <Logo variant="horizontal" height={52} />
          </Link>

          <nav className="hidden md:flex gap-10 text-[11px] tracking-[0.25em] uppercase text-[#958679] font-medium">
            <a href="#concept" className="hover:text-[#1F1A17] transition duration-200">Идеята</a>
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

      {/* 2. HERO SECTION */}
      <section className="relative max-w-5xl mx-auto px-6 pt-16 pb-24 text-center flex flex-col items-center">
        <div className="relative mb-10 group cursor-pointer">
          <Logo variant="icon-only" height={150} />
        </div>

        <span className="inline-block text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-[#958679] mb-6 font-semibold px-6 py-2 border border-[#958679]/30 rounded-full bg-[#EFECE6]/80 shadow-inner">
          Editorial Digital Capsules & Print Archives
        </span>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-[#1F1A17] mb-8 uppercase leading-[1.12] tracking-tight max-w-4xl">
          Подари повече от картичка. <br />
          <span className="italic font-normal text-[#958679]">Запечатай интерактивен спомен.</span>
        </h1>

        <p className="max-w-2xl text-[#1F1A17]/80 text-base md:text-lg leading-relaxed mb-12 font-light">
          GREETINT превръща рождения ден в премиум дигитално преживяване — персонален куест със скрити тайни, отключване на спомени, духване на свещ и финална капсула за бъдещето.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
          <Link 
            href="/create" 
            className="bg-[#1F1A17] text-[#F7F4EF] hover:bg-[#958679] px-11 py-4.5 text-sm uppercase tracking-[0.25em] font-bold transition duration-300 shadow-xl text-center transform hover:-translate-y-1"
          >
            Създай Интерактивна Картичка
          </Link>
          <a 
            href="#concept" 
            className="border border-[#1F1A17]/30 text-[#1F1A17] hover:border-[#1F1A17] hover:bg-[#EFECE6] px-9 py-4.5 text-sm uppercase tracking-[0.25em] font-medium transition duration-300 text-center"
          >
            Виж Преживяването ↓
          </a>
        </div>
      </section>

      {/* 3. ТАБОВЕ ЗА ПРЕГЛЕД */}
      <section id="concept" className="max-w-5xl mx-auto px-6 py-20 border-t border-[#958679]/20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#958679] font-bold">Идеята зад GREETINT</span>
          <h2 className="text-2xl md:text-4xl font-serif uppercase text-[#1F1A17] mt-2">
            Две страни на един спомен
          </h2>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setActiveTab('receiver')}
              className={`px-6 py-3 text-xs uppercase tracking-[0.2em] font-bold transition duration-300 ${
                activeTab === 'receiver' 
                  ? 'bg-[#1F1A17] text-[#F7F4EF]' 
                  : 'bg-[#EFECE6] text-[#958679] hover:text-[#1F1A17]'
              }`}
            >
              За Рожденика
            </button>
            <button
              onClick={() => setActiveTab('giver')}
              className={`px-6 py-3 text-xs uppercase tracking-[0.2em] font-bold transition duration-300 ${
                activeTab === 'giver' 
                  ? 'bg-[#1F1A17] text-[#F7F4EF]' 
                  : 'bg-[#EFECE6] text-[#958679] hover:text-[#1F1A17]'
              }`}
            >
              За Подаряващия
            </button>
          </div>
        </div>

        <div className="bg-[#EFECE6] p-8 md:p-12 border border-[#958679]/20 max-w-3xl mx-auto shadow-sm">
          {activeTab === 'receiver' ? (
            <div className="space-y-4 text-center md:text-left">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#958679] font-bold block">Интерактивен Куест</span>
              <h3 className="text-xl font-serif text-[#1F1A17]">Преживяване, а не обикновено пожелание</h3>
              <p className="text-xs md:text-sm text-[#1F1A17]/80 leading-relaxed">
                Рожденикът сканира QR кода, разпечатва восъчния печат, изтрива фолиото на тайната шега, отговаря на въпроса за отключване на снимките, духва свещта на екрана си и попълва своите 7 отговора за бъдещето.
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-center md:text-left">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#958679] font-bold block">Бързо и Лесно</span>
              <h3 className="text-xl font-serif text-[#1F1A17]">Сглоби персонализиран подарък за минути</h3>
              <p className="text-xs md:text-sm text-[#1F1A17]/80 leading-relaxed">
                Попълваш 3 бързи закачки, избираш от нашите готови забавни реплики (или пишеш свои), качваш любимите снимки и пишеш пожеланието. Всичко останало се подрежда автоматично.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 4. СТЪПКИТЕ */}
      <section id="process" className="bg-[#EFECE6]/60 py-20 border-y border-[#958679]/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#958679] font-bold">Процесът</span>
            <h2 className="text-2xl md:text-3xl font-serif uppercase text-[#1F1A17] mt-2">
              4 стъпки до незабравим подарък
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { num: '01', title: 'Персонализиране', desc: 'Попълваш забавни шаблони или пишеш вашите лични вътрешни шеги.' },
              { num: '02', title: 'Генериране', desc: 'Получаваш уникален онлайн линк + готов А5 дигитален печат за връчване.' },
              { num: '03', title: 'Куест', desc: 'Рожденикът сканира кода, трие фолиото, отключва снимките и духва свещта.' },
              { num: '04', title: 'Хартиен Архив', desc: 'Автоматично се генерира финалният 2-страничен Printable PDF с отговорите.' },
            ].map((step, idx) => (
              <div key={idx} className="border-t border-[#1F1A17]/20 pt-6">
                <span className="text-3xl font-serif text-[#958679] font-light">{step.num}</span>
                <h4 className="text-xs uppercase tracking-widest font-bold mt-2 mb-2 text-[#1F1A17]">{step.title}</h4>
                <p className="text-xs text-[#1F1A17]/70 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
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