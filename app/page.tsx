'use client';
import React, { useState } from 'react';

export default function Home() {
  const [occasion, setOccasion] = useState('Рожден ден');
  const [recipient, setRecipient] = useState('Мария');
  const [sender, setSender] = useState('Алекс');
  const [message, setMessage] = useState('Пожелавам ти много здраве, щастие и сбъднати мечти! Нека всеки ден ти носи усмивки.');

  const sampleMessages = [
    'Пожелавам ти много здраве, щастие и сбъднати мечти! Нека всеки ден ти носи усмивки.',
    'Честит празник! Бъди все така вдъхновяваща, слънчева и невероятна личност.',
    'Нека животът ти бъде изпълнен с любов, приключения и прекрасни спомени!'
  ];

  const handleRandomizeMessage = () => {
    const randomMsg = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
    setMessage(randomMsg);
  };

  const scrollToGenerator = () => {
    document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      {/* 1. ШАПКА / HEADER */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-wider text-amber-400">
            GREETINT
          </div>
          <nav className="hidden md:flex space-x-8 text-sm text-slate-300">
            <a href="#about" className="hover:text-amber-400 transition">За нас</a>
            <a href="#how-it-works" className="hover:text-amber-400 transition">Как работи</a>
            <a href="#generator" className="hover:text-amber-400 transition">Демо Генератор</a>
          </nav>
          <button 
            onClick={scrollToGenerator}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-5 py-2 rounded-full transition text-sm cursor-pointer"
          >
            Създай картичка
          </button>
        </div>
      </header>

      {/* 2. ГЛАВНА СЕКЦИЯ / HERO */}
      <section className="max-w-4xl mx-auto text-center px-6 py-16">
        <span className="text-amber-400 font-medium text-sm tracking-widest uppercase bg-amber-400/10 px-4 py-1.5 rounded-full border border-amber-400/20">
          Персонални дигитални & Printable картички
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold mt-6 leading-tight">
          Подари емоция, която остава <span className="text-amber-400">завинаги</span>.
        </h1>
        <p className="text-slate-400 text-lg md:text-xl mt-6 max-w-2xl mx-auto">
          Greetint ти позволява да създаваш уникални интерактивни пожелания. Изпрати ги дигитално или разпечатай физическа картичка с генериран QR код!
        </p>
        <div className="mt-8 flex justify-center">
          <button 
            onClick={scrollToGenerator}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-4 rounded-xl shadow-lg transition text-lg cursor-pointer"
          >
            🎉 Изпробвай Генератора
          </button>
        </div>
      </section>

      {/* 3. ИНТЕРАКТИВЕН ГЕНЕРАТОР (ДЕМО ИНТЕРФЕЙС) */}
      <section id="generator" className="max-w-6xl mx-auto px-6 py-12 border-t border-slate-800">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Създай своята картичка</h2>
          <p className="text-slate-400 mt-2">Попълни данните вляво и виж как картичката се променя в реално време вдясно!</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* ФОРМА ЗА ВЪВЕЖДАНЕ */}
          <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">1. Избери повод</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['Рожден ден', 'Сватба', 'Любов', 'Юбилей'].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setOccasion(item)}
                    className={`py-2 px-3 text-xs rounded-lg border transition ${
                      occasion === item 
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-500' 
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-500'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">За кого е? (Име)</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">От кого е? (Име)</label>
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium text-slate-300">Твоето пожелание</label>
                <button
                  type="button"
                  onClick={handleRandomizeMessage}
                  className="text-xs text-amber-400 hover:underline"
                >
                  🎲 Друго пожелание
                </button>
              </div>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="pt-2 border-t border-slate-800 flex gap-3">
              <button 
                onClick={() => alert('В бъдеще тук ще се генерира уникален линк за пращане!')}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl transition text-sm text-center"
              >
                🔗 Вземи Дигитален Линк
              </button>
              <button 
                onClick={() => alert('В бъдеще тук ще се сваля готово PDF за печат!')}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-3 rounded-xl border border-slate-700 transition text-sm text-center"
              >
                🟨 Свали за Печат (QR)
              </button>
            </div>
          </div>

          {/* ПРЕГЛЕД НА КАРТИЧКАТА (LIVE PREVIEW) */}
          <div className="bg-gradient-to-br from-amber-100 to-amber-50 text-slate-900 p-8 rounded-2xl shadow-2xl border-4 border-amber-300/40 relative min-h-[380px] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-200/60 px-3 py-1 rounded-full">
                  {occasion}
                </span>
                <span className="text-xs font-serif italic text-slate-500">Greetint Special</span>
              </div>

              <div className="mt-8 text-center">
                <h3 className="text-2xl font-serif font-bold text-slate-800">
                  За {recipient || '...'}!
                </h3>
                <p className="mt-4 text-slate-700 font-sans italic leading-relaxed px-4">
                  "{message || 'Напиши своето пожелание...'}"
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-amber-200 flex justify-between items-end">
              <div>
                <p className="text-xs text-slate-500">С много обич,</p>
                <p className="font-bold text-slate-800">{sender || '...'}</p>
              </div>

              {/* Симулация на QR код */}
              <div className="text-center">
                <div className="w-14 h-14 bg-slate-900 rounded-lg p-1.5 flex flex-col justify-between items-center shadow-inner">
                  <div className="w-full h-full border border-dashed border-amber-400 flex items-center justify-center text-[8px] text-amber-400 font-mono">
                    QR CODE
                  </div>
                </div>
                <span className="text-[9px] text-slate-500 mt-1 block">Сканирай ме</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ФУТЪР / FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-sm">
          <div>© {new Date().getFullYear()} Greetint. Всички права запазени.</div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-300">Общи условия</a>
            <a href="#" className="hover:text-slate-300">Политика за поверителност</a>
          </div>
        </div>
      </footer>
    </main>
  );
}