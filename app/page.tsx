'use client';

import React, { useState } from 'react';
import Logo from '@/components/Logo';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'giver' | 'receiver'>('receiver');
  const [isScratched, setIsScratched] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#1F1A17] font-sans selection:bg-[#DBCEB3] selection:text-[#1F1A17] overflow-x-hidden">
      
      {/* 1. HEADER (НАВИГАЦИЯ) */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="sticky top-0 z-50 backdrop-blur-md bg-[#F7F4EF]/85 border-b border-[#958679]/20 px-6 py-4"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition">
            <Logo variant="horizontal" height={60} />
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
      </motion.header>

      {/* 2. HERO SECTION (ГЛАВНА АНИМИРАНА ПРЕЗЕНТАЦИЯ) */}
      <section className="relative max-w-5xl mx-auto px-6 pt-20 pb-24 text-center flex flex-col items-center">
        
        {/* Анимиран монограм с въртящ се пръстен */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative mb-10 group cursor-pointer"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-4 rounded-full border border-dashed border-[#958679]/40"
          />
          <Logo variant="icon-only" height={120} />
        </motion.div>

        {/* Етикет */}
        <motion.span 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-block text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-[#958679] mb-6 font-semibold px-6 py-2 border border-[#958679]/30 rounded-full bg-[#EFECE6]/80 shadow-inner"
        > Греетинт
        </motion.span>

        {/* Главно Заглавие */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="text-2xl sm:text-4xl md:text-5xl font-serif text-[#1F1A17] mb-8 uppercase leading-[1.08] tracking-tight max-w-4xl"
        >
          Подари повече от картичка. <br />
          <span className="italic font-normal text-[#958679]">Запечатай интерактивен спомен.</span>
        </motion.h1>

        {/* Подзаглавие */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="max-w-2xl text-[#1F1A17]/80 text-sm md:text-base leading-relaxed mb-12 font-light"
        >
          GREETINT превръща рождения ден в премиум дигитално преживяване — персонален куест със скрити тайни, отключване на спомени, духване на свещ и финална капсула за бъдещето.
        </motion.p>

        {/* Бутони */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto"
        >
          <Link 
            href="/create" 
            className="bg-[#1F1A17] text-[#F7F4EF] hover:bg-[#958679] px-11 py-4.5 text-xs uppercase tracking-[0.25em] font-bold transition duration-300 shadow-xl text-center transform hover:-translate-y-1"
          >
            Създай Интерактивна Картичка
          </Link>
          
        </motion.div>
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

        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-[#EFECE6] p-8 md:p-12 border border-[#958679]/20 max-w-3xl mx-auto shadow-sm"
        >
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
        </motion.div>
      </section>

      {/* 5. СТЪПКИТЕ (КАК РАБОТИ) */}
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
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="border-t border-[#1F1A17]/20 pt-6"
              >
                <span className="text-3xl font-serif text-[#958679] font-light">{step.num}</span>
                <h4 className="text-xs uppercase tracking-widest font-bold mt-2 mb-2 text-[#1F1A17]">{step.title}</h4>
                <p className="text-xs text-[#1F1A17]/70 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
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