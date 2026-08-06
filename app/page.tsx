import React from 'react';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* 1. ШАПКА / HEADER */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold tracking-wider text-amber-400">
            GREETINT
          </div>
          <nav className="hidden md:flex space-x-8 text-sm text-slate-300">
            <a href="#about" className="hover:text-amber-400 transition">За нас</a>
            <a href="#how-it-works" className="hover:text-amber-400 transition">Как работи</a>
            <a href="#features" className="hover:text-amber-400 transition">Възможности</a>
          </nav>
          <button className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-5 py-2 rounded-full transition text-sm">
            Създай картичка
          </button>
        </div>
      </header>

      {/* 2. ГЛАВНА СЕКЦИЯ / HERO */}
      <section className="max-w-4xl mx-auto text-center px-6 py-20">
        <span className="text-amber-400 font-medium text-sm tracking-widest uppercase bg-amber-400/10 px-4 py-1.5 rounded-full border border-amber-400/20">
          Персонални дигитални & Printable картички
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold mt-6 leading-tight">
          Подари емоция, която остава <span className="text-amber-400">завинаги</span>.
        </h1>
        <p className="text-slate-400 text-lg md:text-xl mt-6 max-w-2xl mx-auto">
          Greetint ти позволява да създаваш уникални интерактивни пожелания. Изпрати ги дигитално или разпечатай физическа картичка с генериран QR код!
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <button className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 py-4 rounded-xl shadow-lg transition text-lg">
            🎉 Създай за Рожден Ден
          </button>
        </div>
      </section>

      {/* 3. СТЪПКИ / HOW IT WORKS */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-16 border-t border-slate-800">
        <h2 className="text-3xl font-bold text-center mb-12">Как работи Greetint?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
            <div className="text-amber-400 text-2xl font-bold mb-3">01</div>
            <h3 className="text-xl font-semibold mb-2">Избери Повод & Име</h3>
            <p className="text-slate-400">Въведи името на получателя и избери настроение или тема за специалния ден.</p>
          </div>
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
            <div className="text-amber-400 text-2xl font-bold mb-3">02</div>
            <h3 className="text-xl font-semibold mb-2">Персонализирай</h3>
            <p className="text-slate-400">Напиши лично послание или използвай нашия асистент за красиви пожелания.</p>
          </div>
          <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
            <div className="text-amber-400 text-2xl font-bold mb-3">03</div>
            <h3 className="text-xl font-semibold mb-2">Дигитално или QR Печат</h3>
            <p className="text-slate-400">Вземи готов линк за изпращане или свали printable версия с QR код за принтиране.</p>
          </div>
        </div>
      </section>

      {/* 4. ФУТЪР / FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 py-10">
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