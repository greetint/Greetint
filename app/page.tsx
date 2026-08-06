'use client';
import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-between selection:bg-[#e5cfc6]">
      {/* 1. ПРЕМИУМ МЕНЮ (HEADER) */}
      <header className="sticky top-0 z-50 glass-panel px-8 py-5 transition-all">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold tracking-[0.25em] text-[#2c2825] brand-font flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#dbceb3] inline-block shadow-sm"></span>
            GREETINT
          </Link>
          
          <nav className="hidden md:flex space-x-10 text-xs uppercase tracking-widest font-medium text-[#635e57]">
            <a href="#about" className="hover:text-[#2c2825] transition-colors">За нас</a>
            <a href="#how" class="hover:text-[#2c2825] transition-colors">Как работи</a>
            <a href="#occasions" className="hover:text-[#2c2825] transition-colors">Поводи</a>
          </nav>

          <Link 
            href="/create" 
            className="bg-[#2c2825] hover:bg-[#635e57] text-[#fefefd] px-6 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 transform hover:-translate-y-0.5 shadow-sm"
          >
            Създай картичка
          </Link>
        </div>
      </header>

      {/* 2. ТЕМАТИЧНА HERO СЕКЦИЯ */}
      <section className="max-w-4xl mx-auto text-center px-6 pt-24 pb-20 relative">
        {/* Нежен цветен акцент във фона */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#e5cfc6]/30 rounded-full blur-3xl -z-10"></div>

        <span className="inline-block text-[11px] font-semibold tracking-[0.25em] uppercase text-[#958679] bg-[#e5cfc6]/40 px-4 py-2 rounded-full border border-[#e5cfc6]/60 backdrop-blur-sm">
          Warm Minimalist Digital & Printable Cards
        </span>

        <h1 className="text-4xl md:text-6xl font-light text-[#2c2825] mt-8 leading-[1.15] tracking-tight">
          Подари емоция, която остава <span className="font-normal italic text-[#958679]">завинаги</span>.
        </h1>

        <p className="text-[#635e57] text-base md:text-lg mt-8 max-w-2xl mx-auto font-light leading-relaxed">
          Издигни стандартните пожелания до луксозно интерактивно преживяване. Персонални куестове, спомени и елегантен QR код за печат.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-5">
          <Link 
            href="/create" 
            className="w-full sm:w-auto bg-[#2c2825] hover:bg-[#635e57] text-[#fefefd] px-9 py-4 rounded-full font-medium text-sm tracking-wide transition-all duration-300 transform hover:-translate-y-0.5 shadow-md"
          >
            🎉 Създай за Рожден Ден — €4.99
          </Link>
        </div>
      </section>

      {/* 3. КРАТКА СЕКЦИЯ С ПРЕДИМСТВА */}
      <section id="how" className="max-w-5xl mx-auto px-6 py-16 border-t border-[#d9d1cc]/60">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 rounded-3xl space-y-3">
            <span class="text-2xl">✨</span>
            <h3 className="text-lg font-medium text-[#2c2825]">1. Персонализирай</h3>
            <p className="text-xs text-[#635e57] font-light leading-relaxed">Задай тайни въпроси, качи общи снимки и добави специален ваучер/подарък.</p>
          </div>

          <div className="glass-panel p-8 rounded-3xl space-y-3">
            <span className="text-2xl">📱</span>
            <h3 className="text-lg font-medium text-[#2c2825]">2. Интерактивен Куест</h3>
            <p className="text-xs text-[#635e57] font-light leading-relaxed">Получателят отваря виртуален плик, решава загадката и духва свещичката.</p>
          </div>

          <div className="glass-panel p-8 rounded-3xl space-y-3">
            <span className="text-2xl">📄</span>
            <h3 className="text-lg font-medium text-[#2c2825]">3. Готов за Печат</h3>
            <p className="text-xs text-[#635e57] font-light leading-relaxed">Вземи както дигитален линк, така и стилен PDF с QR код за физическа картичка.</p>
          </div>
        </div>
      </section>

      {/* 4. ФУТЪР */}
      <footer className="border-t border-[#d9d1cc]/60 bg-[#fefefd] py-10 text-center text-xs text-[#958679]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="brand-font tracking-widest text-[#2c2825] font-bold">GREETINT</div>
          <p>© 2026 Greetint. Всички права запазени.</p>
        </div>
      </footer>
    </main>
  );
}