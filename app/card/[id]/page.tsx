'use client';

import React, { useState, useEffect } from 'react';
import Logo from '@/components/Logo';

export default function BirthdayCardPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [answerInput, setAnswerInput] = useState('');
  const [isBlownOut, setIsBlownOut] = useState(false);
  const [futureAnswers, setFutureAnswers] = useState<string[]>(Array(7).fill(''));
  const [savedAnswers, setSavedAnswers] = useState(false);

  const defaultQuestions = [
    '1. Коя е следващата дестинация, която искаш да посетиш?',
    '2. Кое е най-лудото нещо, което ще направиш тази година?',
    '3. Коя песен ще бъде химнът на новата ти година?',
    '4. Коя мечта си обещаваш да сбъднеш до следващия рожден ден?',
    '5. Кой навик искаш да започнеш от днес?',
    '6. Какво ще си купиш, за да се възнаградиш?',
    '7. Опиши новата си година само с една дума:'
  ];

  const [cardData, setCardData] = useState({
    recipientName: 'Рожденик',
    senderName: 'Твоят приятел',
    secretJoke: 'Тайната шега тук...',
    unlockQuestion: 'Въпрос за отключване...',
    unlockAnswer: 'отговор',
    mainWish: 'Пожеланието тук...',
    images: [] as string[],
  });

  useEffect(() => {
    const savedData = localStorage.getItem('greetint_card_data');
    if (savedData) {
      try { setCardData(JSON.parse(savedData)); } catch (e) {}
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (answerInput.trim().toLowerCase() === (cardData.unlockAnswer || '').trim().toLowerCase()) {
      setUnlocked(true);
    } else {
      alert(`Грешен отговор! (За тест: верният отговор е "${cardData.unlockAnswer}")`);
    }
  };

  const handleAnswerChange = (index: number, val: string) => {
    const updated = [...futureAnswers];
    updated[index] = val;
    setFutureAnswers(updated);
  };

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#1F1A17] font-sans pb-20 px-6">
      <header className="py-8 text-center border-b border-[#958679]/20 max-w-2xl mx-auto">
        <Logo variant="horizontal" height={40} />
      </header>

      <main className="max-w-xl mx-auto pt-10 text-center">
        
        <span className="text-[10px] uppercase tracking-[0.4em] text-[#958679] font-bold block mb-3">
          Персонална Дигитална Капсула
        </span>
        <h1 className="text-3xl md:text-5xl font-serif uppercase mb-2">
          Честит Рожден Ден, {cardData.recipientName}!
        </h1>
        <p className="text-xs uppercase tracking-[0.2em] text-[#958679] mb-10">
          Специална изненада от: <span className="text-[#1F1A17] font-semibold">{cardData.senderName}</span>
        </p>

        {/* 1. СКРИТА ТАЙНОСТ */}
        <div className="bg-[#EFECE6] p-8 border border-[#958679]/20 shadow-sm mb-8 text-center">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#958679] font-bold block mb-2">
            🔒 Скрита Тайна Шега
          </span>
          <p className="text-sm font-serif italic text-[#1F1A17] my-4">
            "{cardData.secretJoke}"
          </p>
        </div>

        {/* 2. КУЕСТ ЗА ОТКЛЮЧВАНЕ НА СНИМКИТЕ */}
        {!unlocked ? (
          <div className="bg-[#1F1A17] text-[#F7F4EF] p-8 shadow-xl mb-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#958679] font-bold block mb-2">
              Заключен Спомен
            </span>
            <h3 className="text-lg font-serif mb-4">
              Отговори на въпроса, за да отключиш снимките:
            </h3>
            <p className="text-xs text-[#F7F4EF]/70 mb-6 italic">
              "{cardData.unlockQuestion}"
            </p>

            <form onSubmit={handleUnlock} className="flex flex-col gap-3">
              <input
                type="text"
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                placeholder="Въведи отговора тук..."
                className="bg-[#F7F4EF] text-[#1F1A17] p-3 text-sm text-center border-none focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#958679] text-[#F7F4EF] py-3 text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#EFECE6] hover:text-[#1F1A17] transition"
              >
                Отключи Спомените ✨
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-[#EFECE6] p-8 border border-[#958679]/30 mb-8 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#958679] font-bold block text-emerald-800">
              🔓 Спомените са отключени!
            </span>
            {cardData.images && cardData.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 pt-2">
                {cardData.images.map((img, i) => (
                  <img key={i} src={img} alt="memory" className="w-full h-36 object-cover border border-[#958679]/30 shadow-sm" />
                ))}
              </div>
            ) : (
              <p className="text-xs italic text-[#958679]">Подаряващият не е качил снимки, но споменът остава!</p>
            )}
          </div>
        )}

        {/* 3. ДУХВАНЕ НА СВЕЩ */}
        <div className="border border-[#958679]/20 p-8 bg-[#F7F4EF] mb-8">
          <div className="text-5xl mb-4">{isBlownOut ? '💨' : '🕯️'}</div>
          {!isBlownOut ? (
            <button
              onClick={() => setIsBlownOut(true)}
              className="border border-[#1F1A17] text-[#1F1A17] px-6 py-3 text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#1F1A17] hover:text-[#F7F4EF] transition"
            >
              Духни свещта 🎂
            </button>
          ) : (
            <p className="text-xs uppercase tracking-widest text-[#958679] font-bold">
              Пожеланието е изпратено към вселената! ✨
            </p>
          )}
        </div>

        {/* 4. ОСНОВНО ПОЖЕЛАНИЕ */}
        <div className="pt-6 border-t border-[#958679]/20 mb-10">
          <p className="text-base font-serif leading-relaxed text-[#1F1A17]/90 italic">
            "{cardData.mainWish}"
          </p>
        </div>

        {/* 5. КАПСУЛА НА БЪДЕЩЕТО (7-ТЕ ВЪПРОСА) */}
        <div className="bg-[#1F1A17] text-[#F7F4EF] p-8 text-left space-y-6 shadow-2xl">
          <div>
            <span className="text-[9px] uppercase tracking-[0.3em] text-[#958679] font-bold block mb-1">
              Твоята Капсула за Бъдещето
            </span>
            <h3 className="text-xl font-serif uppercase">7-те обещания за новата ти година</h3>
            <p className="text-xs text-[#F7F4EF]/60 italic mt-1">Попълни отговорите си, за да ги запечатаме в печатния архив!</p>
          </div>

          {!savedAnswers ? (
            <div className="space-y-4 pt-2">
              {defaultQuestions.map((q, idx) => (
                <div key={idx} className="space-y-1">
                  <label className="block text-xs font-serif text-[#F7F4EF]/80">{q}</label>
                  <input
                    type="text"
                    value={futureAnswers[idx]}
                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                    placeholder="Твоят отговор..."
                    className="w-full bg-[#F7F4EF] text-[#1F1A17] p-2.5 text-xs focus:outline-none"
                  />
                </div>
              ))}
              <button
                onClick={() => {
                  setSavedAnswers(true);
                  alert('Твоята капсула на бъдещето е запечатана успешно! 🎉');
                }}
                className="w-full bg-[#958679] text-[#F7F4EF] py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#EFECE6] hover:text-[#1F1A17] transition mt-4"
              >
                Запечатай 7-те Отговора ✨
              </button>
            </div>
          ) : (
            <div className="bg-[#F7F4EF]/10 p-4 text-center border border-[#958679]/30 space-y-2">
              <span className="text-xs text-[#dbceb3] font-bold block">🔒 Капсулата ти е запечатана!</span>
              <p className="text-[11px] text-[#F7F4EF]/70 italic">Всички 7 отговора са запазени за твоя финална архив.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}