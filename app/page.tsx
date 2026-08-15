'use client';

import React, { useState } from 'react';
import Logo from '@/components/Logo';
import Link from 'next/link';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'giver' | 'receiver'>('receiver');
  const [isScratched, setIsScratched] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#1F1A17] font-sans selection:bg-[#DBCEB3] selection:text-[#1F1A17] overflow-x-hidden">
      
      {/* 1. ГЛАВНО МЕНЮ (ПОДГОТВЕНО ЗА БЪДЕЩИ ПОВОДИ) */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#F7F4EF]/85 border-b border-[#958679]/20 px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* ЛОГО */}
          <Link href="/" className="hover:opacity-80 transition">
            <Logo variant="horizontal" height={34} />
          </Link>

          {/* ЦЕНТРАЛНА НАВИГАЦИЯ */}
          <nav className="hidden md:flex gap-10 text-[11px] tracking-[0.25em] uppercase text-[#958679] font-medium">
            <a href="#concept" className="hover:text-[#1F1A17] transition duration-200">Идеята</a>
            <a href="#experience" className="hover:text-[#1F1A17] transition duration-200">Преживяването</a>
            <a href="#process" className="hover:text-[#1F1A17] transition duration-200">Как работи</a>
            
            {/* Падащо меню (Готово за бъдещи поводи) */}
            <div className="relative group cursor-pointer">
              <span className="hover:text-[#1F1A17] transition duration-200 flex items-center gap-1">
                Поводи <span className="text-[9px]">▼</span>
              </span>
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#EFECE6] border border-[#958679]/20 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto shadow-xl">
                <span className="block text-[10px] text-[#1F1A17] font-bold uppercase tracking-wider mb-2 border-b border-[#958679]/20 pb-1">
                  Рожден Ден
                </span>
                <span className="block text-[10px] text-[#958679] uppercase tracking-wider italic">
                  Юбилей (Очаквайте)
                </span>
                <span className="block text-[10px] text-[#958679] uppercase tracking-wider italic mt-1">
                  Сватба (Очаквайте)
                </span>
              </div>
            </div>
          </nav>

          {/* БУТОН КЪМ ФОРМАТА */}
          <Link 
            href="/create" 
            className="text-[11px] uppercase tracking-[0.2em] bg-[#1F1A17] text-[#F7F4EF] px-7 py-3.5 font-semibold hover:bg-[#958679] transition duration-300 shadow-md transform hover:-translate-y-0.5"
          >
            Създай Капсула
          </Link>
        </div>
      </header>

      {/* 2. HERO SECTION (ГЛАВНА ПРЕЗЕНТАЦИЯ) */}
      <section className="relative max-w-5xl mx-auto px-6 pt-20 pb-24 text-center flex flex-col items-center">
        
        {/* Анимиран монограм */}
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

      {/* 3. ИНТЕРАКТИВЕН ДЕМО МОДУЛ (SCRATCH REVEAL) */}
      <section id="experience" className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-[#EFECE6] border border-[#958679]/30 p-8 md:p-12 shadow-2xl relative overflow-hidden text-center space-y-6">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#958679] block">
            Интерактивен Елемент от Преживяването
          </span>
          <h3 className="text-2xl font-serif uppercase text-[#1F1A17]">
            Тайно Фолио за Изтриване
          </h3>
          <p className="text-xs text-[#958679] max-w-md mx-auto leading-relaxed">
            Всеки получател трие златната текстура на своя екран, за да разкрие вашите вътрешни шеги и скрити спомени. Докосни тук за тест:
          </p>

          <div 
            onClick={() => setIsScratched(true)}
            className="max-w-md mx-auto h-28 bg-[#DBCEB3] border border-[#958679]/40 flex items-center justify-center p-6 cursor-pointer transition duration-500 hover:scale-[1.01] shadow-inner"
          >
            {!isScratched ? (
              <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#1F1A17]">
                ✨ Кликни за разкриване
              </span>
            ) : (
              <p className="text-xs font-serif italic text-[#1F1A17] animate-fade-in leading-relaxed">
                "Спомняш ли си, когато си изпусна телефона и викаше, че е водоустойчив? Пазим го в пълна тайна!" 🤫
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 4. ТАБОВЕ ЗА ПРЕГЛЕД (ДВЕТЕ СТРАНИ НА ПРЕЖИВЯВАНЕТО) */}
      <section id="concept" className="max-w-5xl mx-auto px-6 py-20 border-t border-[#958679]/20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#958679] font-bold">Идеята зад GREETINT</span>
          <h2 className="text-2xl md:text-4xl font-serif uppercase text-[#1F1A17] mt-2">
            Две страни на един спомен
          </h2>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setActiveTab('receiver')}
              className={`px-6 py-3 text-xs uppercase tracking-[0.2em] font-bold transition ${
                activeTab === 'receiver' 
                  ? 'bg-[#1F1A17] text-[#F7F4EF]' 
                  : 'bg-[#EFECE6] text-[#958679] hover:text-[#1F1A17]'
              }`}
            >
              За Рожденика
            </button>
            <button
              onClick={() => setActiveTab('giver')}
              className={`px-6 py-3 text-xs uppercase tracking-[0.2em] font-bold transition ${
                activeTab === 'giver' 
                  ? 'bg-[#1F1A17] text-[#F7F4EF]' 
                  : 'bg-[#EFECE6] text-[#958679] hover:text-[#1F1A17]'
              }`}
            >
              За Подаряващия
            </button>
          </div>
        </div>

        <div className="bg-[#EFECE6] p-8 md:p-12 border border-[#958679]/20 max-w-3xl mx-auto transition-all shadow-sm">
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

      {/* 5. СТҮПКИТЕ (КАК РАБОТИ) */}
      <section id="process" className="bg-[#EFECE6]/60 py-20 border-y border-[#958679]/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#958679] font-bold">Процесът</span>
            <h2 className="text-2xl md:text-3xl font-serif uppercase text-[#1F1A17] mt-2">
              4 стъпки до незабравим подарък
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="border-t border-[#1F1A17]/20 pt-6">
              <span className="text-3xl font-serif text-[#958679] font-light">01</span>
              <h4 className="text-xs uppercase tracking-widest font-bold mt-2 mb-2 text-[#1F1A17]">Персонализиране</h4>
              <p className="text-xs text-[#1F1A17]/70 leading-relaxed">Попълваш забавни шаблони или пишеш вашите лични вътрешни шеги.</p>
            </div>

            <div className="border-t border-[#1F1A17]/20 pt-6">
              <span className="text-3xl font-serif text-[#958679] font-light">02</span>
              <h4 className="text-xs uppercase tracking-widest font-bold mt-2 mb-2 text-[#1F1A17]">Генериране</h4>
              <p className="text-xs text-[#1F1A17]/70 leading-relaxed">Получаваш уникален онлайн линк + готов А5 дигитален печат за връчване.</p>
            </div>

            <div className="border-t border-[#1F1A17]/20 pt-6">
              <span className="text-3xl font-serif text-[#958679] font-light">03</span>
              <h4 className="text-xs uppercase tracking-widest font-bold mt-2 mb-2 text-[#1F1A17]">Куест</h4>
              <p className="text-xs text-[#1F1A17]/70 leading-relaxed">Рожденикът сканира кода, трие фолиото, отключва снимките и духва свещта.</p>
            </div>

            <div className="border-t border-[#1F1A17]/20 pt-6">
              <span className="text-3xl font-serif text-[#958679] font-light">04</span>
              <h4 className="text-xs uppercase tracking-widest font-bold mt-2 mb-2 text-[#1F1A17]">Хартиен Архив</h4>
              <p className="text-xs text-[#1F1A17]/70 leading-relaxed">Автоматично се генерира финалният 2-страничен Printable PDF с отговорите.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ФИНАЛЕН CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <Logo variant="icon-only" height={56} className="mb-6 opacity-90" />
        <h2 className="text-3xl md:text-5xl font-serif uppercase text-[#1F1A17] mb-6 tracking-tight">
          Готови ли сте да запечатате първия си спомен?
        </h2>
        <Link 
          href="/create" 
          className="inline-block bg-[#1F1A17] text-[#F7F4EF] hover:bg-[#958679] px-12 py-5 text-xs uppercase tracking-[0.3em] font-bold transition duration-300 shadow-xl transform hover:-translate-y-1"
        >
          Създай Интерактивна Картичка
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