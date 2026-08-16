'use client';

import React, { useState } from 'react';
import Logo from '@/components/Logo';
import Link from 'next/link';

export default function CreateCardPage() {
  const [step, setStep] = useState(1);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [showPhonePreview, setShowPhonePreview] = useState(false);
  
  const [formData, setFormData] = useState({
    recipientName: '',
    senderName: '',
    secretJoke: '',
    unlockQuestion: '',
    unlockAnswer: '',
    mainWish: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFinish = () => {
    if (!formData.recipientName) {
      alert('Моля, въведете име на рожденика!');
      return;
    }
    // Запазваме въведените данни в браузъра
    localStorage.setItem('greetint_card_data', JSON.stringify(formData));
    
    // Пренасочваме към валиден рут за рожденика
    window.location.href = '/card/123';
  };

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#1F1A17] font-sans pb-24 selection:bg-[#958679] selection:text-[#F7F4EF]">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#F7F4EF]/80 border-b border-[#958679]/15 px-6 py-4 transition-all duration-300">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="hover:opacity-70 transition duration-300 transform hover:scale-95">
            <Logo variant="horizontal" height={42} />
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#958679] font-semibold bg-[#EFECE6] px-4 py-1.5 rounded-full border border-[#958679]/20 shadow-inner">
              Стъпка {step} от 3
            </span>
          </div>
        </div>
      </header>

      {/* ОСНОВЕН СТРУКТУРЕН КОНТЕЙНЪР */}
      <main className="max-w-2xl mx-auto px-6 pt-10">
        
        {/* PROGRESS BAR */}
        <div className="w-full bg-[#EFECE6] h-1.5 rounded-full mb-10 overflow-hidden border border-[#958679]/10">
          <div 
            className="bg-[#1F1A17] h-full transition-all duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        {/* КАРТА ЗА ФОРМАТА */}
        <div className="bg-[#EFECE6]/90 backdrop-blur-sm p-8 sm:p-12 border border-[#958679]/25 shadow-xl rounded-none relative transition-all duration-300">
          
          {/* СТЪПКА 1 */}
          {step === 1 && (
            <div className="space-y-7">
              <div>
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#958679] font-bold block mb-1">
                  Фаза 01 — Персонализация
                </span>
                <h2 className="text-3xl font-serif uppercase tracking-tight text-[#1F1A17]">За кого е капсулата?</h2>
                <p className="text-xs text-[#958679] mt-1 font-light">Въведете имената, които ще украсят първия дигитален екран.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-[#1F1A17] font-semibold mb-2">
                    Име на рожденика
                  </label>
                  <input
                    type="text"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleChange}
                    placeholder="напр. Калоян"
                    className="w-full bg-[#F7F4EF] border border-[#958679]/30 p-4 text-sm text-[#1F1A17] focus:outline-none focus:border-[#1F1A17] focus:ring-1 focus:ring-[#1F1A17] transition shadow-inner placeholder-[#958679]/50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-[#1F1A17] font-semibold mb-2">
                    От кого е подаръкът?
                  </label>
                  <input
                    type="text"
                    name="senderName"
                    value={formData.senderName}
                    onChange={handleChange}
                    placeholder="напр. От тайния ти отбор"
                    className="w-full bg-[#F7F4EF] border border-[#958679]/30 p-4 text-sm text-[#1F1A17] focus:outline-none focus:border-[#1F1A17] focus:ring-1 focus:ring-[#1F1A17] transition shadow-inner placeholder-[#958679]/50"
                  />
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!formData.recipientName}
                className="w-full bg-[#1F1A17] text-[#F7F4EF] py-4.5 text-xs uppercase tracking-[0.25em] font-bold hover:bg-[#958679] transition duration-300 shadow-md disabled:opacity-30 transform hover:-translate-y-0.5"
              >
                Продължи към Тайната Шега →
              </button>
            </div>
          )}

          {/* СТЪПКА 2 */}
          {step === 2 && (
            <div className="space-y-7">
              <div>
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#958679] font-bold block mb-1">
                  Фаза 02 — Интерактивен Куест
                </span>
                <h2 className="text-3xl font-serif uppercase tracking-tight text-[#1F1A17]">Закачки и Тайни</h2>
                <p className="text-xs text-[#958679] mt-1 font-light">Скрийте загадки, които рожденикът ще отключва стъпка по стъпка.</p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-[#1F1A17] font-semibold mb-2">
                    Тайната шега <span className="text-[#958679] font-normal">(скрита под скрач фолиото)</span>
                  </label>
                  <input
                    type="text"
                    name="secretJoke"
                    value={formData.secretJoke}
                    onChange={handleChange}
                    placeholder="напр. Още пазим тайната от морето през 2022..."
                    className="w-full bg-[#F7F4EF] border border-[#958679]/30 p-4 text-sm text-[#1F1A17] focus:outline-none focus:border-[#1F1A17] transition shadow-inner placeholder-[#958679]/50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-[#1F1A17] font-semibold mb-2">
                      Въпрос за отключване
                    </label>
                    <input
                      type="text"
                      name="unlockQuestion"
                      value={formData.unlockQuestion}
                      onChange={handleChange}
                      placeholder="Коя беше любимата ни песен?"
                      className="w-full bg-[#F7F4EF] border border-[#958679]/30 p-4 text-sm text-[#1F1A17] focus:outline-none focus:border-[#1F1A17] transition shadow-inner placeholder-[#958679]/50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-[0.2em] text-[#1F1A17] font-semibold mb-2">
                      Верният отговор
                    </label>
                    <input
                      type="text"
                      name="unlockAnswer"
                      value={formData.unlockAnswer}
                      onChange={handleChange}
                      placeholder="напр. Wonderwall"
                      className="w-full bg-[#F7F4EF] border border-[#958679]/30 p-4 text-sm text-[#1F1A17] focus:outline-none focus:border-[#1F1A17] transition shadow-inner placeholder-[#958679]/50"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 border border-[#1F1A17]/30 text-[#1F1A17] py-4 text-xs uppercase tracking-[0.2em] font-semibold hover:border-[#1F1A17] hover:bg-[#F7F4EF] transition duration-300"
                >
                  ← Назад
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="w-2/3 bg-[#1F1A17] text-[#F7F4EF] py-4 text-xs uppercase tracking-[0.25em] font-bold hover:bg-[#958679] transition duration-300 shadow-md transform hover:-translate-y-0.5"
                >
                  Към Пожеланието →
                </button>
              </div>
            </div>
          )}

          {/* СТЪПКА 3 */}
          {step === 3 && (
            <div className="space-y-7">
              <div>
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#958679] font-bold block mb-1">
                  Фаза 03 — Финална Послание
                </span>
                <h2 className="text-3xl font-serif uppercase tracking-tight text-[#1F1A17]">Запечатай Капсулата</h2>
                <p className="text-xs text-[#958679] mt-1 font-light">Напишете вашето основно пожелание и прегледайте крайния резултат.</p>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.2em] text-[#1F1A17] font-semibold mb-2">
                  Твоето официално пожелание
                </label>
                <textarea
                  name="mainWish"
                  rows={4}
                  value={formData.mainWish}
                  onChange={handleChange}
                  placeholder="Пожелай нещо специално за новата му/ѝ година..."
                  className="w-full bg-[#F7F4EF] border border-[#958679]/30 p-4 text-sm text-[#1F1A17] focus:outline-none focus:border-[#1F1A17] transition shadow-inner placeholder-[#958679]/50"
                />
              </div>

              {/* БУТОНИ ЗА PREVIEW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPhonePreview(true)}
                  className="group border border-[#1F1A17] bg-[#F7F4EF] text-[#1F1A17] py-3.5 px-4 text-[11px] uppercase tracking-[0.18em] font-bold hover:bg-[#1F1A17] hover:text-[#F7F4EF] transition duration-300 flex items-center justify-center gap-2 shadow-sm"
                >
                  <span className="group-hover:scale-110 transition duration-200">📱</span> Мобилен Куест
                </button>

                <button
                  type="button"
                  onClick={() => setShowPdfPreview(true)}
                  className="group border border-[#958679]/50 bg-[#F7F4EF] text-[#958679] py-3.5 px-4 text-[11px] uppercase tracking-[0.18em] font-bold hover:border-[#1F1A17] hover:text-[#1F1A17] transition duration-300 flex items-center justify-center gap-2 shadow-sm"
                >
                  <span className="group-hover:scale-110 transition duration-200">📄</span> А5 Печатен Архив
                </button>
              </div>

              <div className="flex gap-4 pt-4 border-t border-[#958679]/20">
                <button
                  onClick={() => setStep(2)}
                  className="w-1/3 border border-[#1F1A17]/30 text-[#1F1A17] py-4 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#F7F4EF] transition duration-300"
                >
                  ← Назад
                </button>
                <button
                  onClick={handleFinish}
                  className="w-2/3 bg-[#1F1A17] text-[#F7F4EF] py-4 text-xs uppercase tracking-[0.25em] font-bold hover:bg-[#958679] transition duration-300 shadow-xl transform hover:-translate-y-0.5"
                >
                  Завърши Капсулата ✨
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* 1. MODAL ЗА ДИГИТАЛНИЯ КУЕСТ (ТЕЛЕФОН) */}
      {showPhonePreview && (
        <div className="fixed inset-0 z-50 bg-[#1F1A17]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative">
            <button
              onClick={() => setShowPhonePreview(false)}
              className="absolute -top-11 right-0 text-xs uppercase tracking-[0.2em] text-[#F7F4EF] font-semibold hover:text-[#dbceb3] transition"
            >
              [ Затвори ✕ ]
            </button>

            <div className="w-[340px] sm:w-[370px] bg-[#F7F4EF] border-[10px] border-[#1F1A17] rounded-[42px] p-6 shadow-2xl text-center space-y-5 text-[#1F1A17] relative overflow-hidden">
              <div className="w-24 h-4 bg-[#1F1A17] mx-auto rounded-full mb-1"></div>
              
              <Logo variant="horizontal" height={28} />

              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-[0.35em] text-[#958679] font-bold block">
                  Дигитално преживяване
                </span>
                <h3 className="text-xl font-serif uppercase text-[#1F1A17] leading-tight">
                  Честит Рожден Ден, <br />
                  <span className="italic font-normal text-[#958679]">{formData.recipientName || 'Калоян'}</span>
                </h3>
              </div>

              <div className="bg-[#EFECE6] p-4 border border-[#958679]/25 shadow-inner">
                <span className="text-[8px] uppercase tracking-[0.2em] text-[#958679] font-bold block mb-1">
                  🔒 Скрач фолио ефект:
                </span>
                <p className="text-xs font-serif italic text-[#1F1A17]">
                  "{formData.secretJoke || 'Твоята тайна шега ще се покаже тук...'}"
                </p>
              </div>

              <div className="bg-[#1F1A17] text-[#F7F4EF] p-4 text-left space-y-2 shadow-md">
                <span className="text-[8px] uppercase tracking-[0.2em] text-[#958679] block font-bold">
                  Отключване на спомени:
                </span>
                <p className="text-xs italic text-[#F7F4EF]/90">"{formData.unlockQuestion || 'Коя е любимата ни песен?'}"</p>
                <div className="bg-[#F7F4EF]/15 text-[10px] p-2 text-[#F7F4EF]/50 text-center uppercase tracking-widest border border-[#F7F4EF]/10">
                  Отговор на рожденика...
                </div>
              </div>

              <div className="border-t border-[#958679]/20 pt-3">
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#958679]">
                  Капсула на бъдещето (7-те отговора)
                </p>
              </div>

              <button
                onClick={() => setShowPhonePreview(false)}
                className="w-full bg-[#1F1A17] text-[#F7F4EF] py-3 text-[10px] uppercase tracking-[0.25em] font-bold hover:bg-[#958679] transition"
              >
                Обратно към редакцията
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL ЗА PREVIEW НА PRINTABLE PDF */}
      {showPdfPreview && (
        <div className="fixed inset-0 z-50 bg-[#1F1A17]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#F7F4EF] max-w-xl w-full p-8 border border-[#958679]/40 shadow-2xl relative my-8">
            <button
              onClick={() => setShowPdfPreview(false)}
              className="absolute top-4 right-4 text-xs uppercase tracking-widest text-[#958679] font-bold hover:text-[#1F1A17] transition"
            >
              [ Затвори ✕ ]
            </button>

            <span className="text-[9px] uppercase tracking-[0.4em] text-[#958679] font-bold block mb-4 text-center">
              A5 Printable Format Preview
            </span>

            <div className="border-2 border-dashed border-[#958679]/40 p-8 bg-[#FEFEFD] text-center space-y-6 shadow-sm">
              <Logo variant="horizontal" height={36} />

              <div className="border-y border-[#958679]/20 py-4 space-y-1">
                <span className="text-[9px] uppercase tracking-[0.3em] text-[#958679] block font-bold">Официален Печатен Архив</span>
                <h3 className="text-2xl font-serif uppercase text-[#1F1A17]">
                  {formData.recipientName || 'Име на Рожденика'}
                </h3>
                <p className="text-xs text-[#958679] italic">
                  Подарък от: {formData.senderName || 'Подаряващ'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 bg-[#EFECE6]/60 p-4 border border-[#958679]/15">
                <div className="text-center">
                  <div className="w-20 h-20 bg-[#1F1A17] text-[#F7F4EF] flex items-center justify-center text-[9px] font-mono tracking-tighter mx-auto mb-1.5 shadow">
                    [ QR CODE ]
                  </div>
                  <span className="text-[8px] uppercase tracking-wider text-[#958679] font-semibold">Сканирай за куест</span>
                </div>

                <div className="text-center flex flex-col justify-center items-center">
                  <div className="w-16 h-16 rounded-full bg-[#958679] text-[#F7F4EF] flex items-center justify-center text-xl font-serif border-2 border-[#dbceb3] shadow-md mb-1.5">
                    G
                  </div>
                  <span className="text-[8px] uppercase tracking-wider text-[#958679] font-semibold">Восъчен печат</span>
                </div>
              </div>

              <div className="border border-[#958679]/30 p-3.5 bg-[#EFECE6]">
                <span className="text-[8px] uppercase tracking-widest text-[#958679] font-bold block mb-1">
                  Зона за скрач фолио:
                </span>
                <p className="text-xs font-serif text-[#1F1A17] italic">
                  "{formData.secretJoke || 'Твоята тайна шега...'}"
                </p>
              </div>

              <p className="text-[9px] uppercase tracking-widest text-[#958679] pt-2">
                Разпечатайте този листинг на А5 хартия за физическото връчване.
              </p>
            </div>

            <button
              onClick={() => setShowPdfPreview(false)}
              className="w-full mt-6 bg-[#1F1A17] text-[#F7F4EF] py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#958679] transition duration-300 shadow-md"
            >
              Продължи с попълването
            </button>
          </div>
        </div>
      )}

    </div>
  );
}