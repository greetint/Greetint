'use client';

import React, { useState, useEffect } from 'react';
import Logo from '@/components/Logo';

export default function BirthdayCardPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [answerInput, setAnswerInput] = useState('');
  const [isBlownOut, setIsBlownOut] = useState(false);

  // ДИНАМИЧНИ ДАННИ
  const [cardData, setCardData] = useState({
    recipientName: 'Рожденик',
    senderName: 'Твоят приятел',
    secretJoke: 'Тайната шега тук...',
    unlockQuestion: 'Въпрос за отключване...',
    unlockAnswer: 'отговор',
    mainWish: 'Пожеланието тук...',
  });

  // Зареждане на попълнените от формата данни
  useEffect(() => {
    const savedData = localStorage.getItem('greetint_card_data');
    if (savedData) {
      try {
        setCardData(JSON.parse(savedData));
      } catch (e) {
        console.error('Грешка при четене на данните', e);
      }
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUserAnswer = answerInput.trim().toLowerCase();
    const cleanCorrectAnswer = (cardData.unlockAnswer || '').trim().toLowerCase();

    if (cleanUserAnswer && cleanUserAnswer === cleanCorrectAnswer) {
      setUnlocked(true);
    } else {
      alert(`Грешен отговор! (За тест: верният отговор е "${cardData.unlockAnswer}")`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#1F1A17] font-sans pb-20 px-6">
      <header className="py-8 text-center border-b border-[#958679]/20 max-w-2xl mx-auto">
        <Logo variant="horizontal" height={40} />
      </header>

      <main className="max-w-xl mx-auto pt-10 text-center">
        
        {/* ИМЕНА И ЗАГЛАВИЕ */}
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

        {/* 2. КУЕСТ ЗА ОТКЛЮЧВАНЕ */}
        {!unlocked ? (
          <div className="bg-[#1F1A17] text-[#F7F4EF] p-8 shadow-xl mb-8">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#958679] font-bold block mb-2">
              Заключен Спомен
            </span>
            <h3 className="text-lg font-serif mb-4">
              Отговори на въпроса, за да отключиш съдържанието:
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
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#958679] font-bold block">
              🔓 Успешно отключено!
            </span>
            <p className="text-sm text-[#1F1A17]/80">
              Поздравления! Отключи главната капсула със снимки и пожеланието.
            </p>
          </div>
        )}

        {/* 3. ДУХВАНЕ НА СВЕЩ */}
        <div className="border border-[#958679]/20 p-8 bg-[#F7F4EF] mb-8">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#958679] font-bold block mb-4">
            Традицията
          </span>
          
          <div className="text-5xl mb-4 transition-transform duration-500">
            {isBlownOut ? '💨' : '🕯️'}
          </div>

          {!isBlownOut ? (
            <button
              onClick={() => setIsBlownOut(true)}
              className="border border-[#1F1A17] text-[#1F1A17] px-6 py-3 text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#1F1A17] hover:text-[#F7F4EF] transition duration-300"
            >
              Духни свещта 🎂
            </button>
          ) : (
            <p className="text-xs uppercase tracking-widest text-[#958679] font-bold">
              Пожеланието е изпратено! ✨
            </p>
          )}
        </div>

        {/* 4. ОСНОВНО ПОЖЕЛАНИЕ */}
        <div className="pt-8 border-t border-[#958679]/20">
          <p className="text-base font-serif leading-relaxed text-[#1F1A17]/90 italic">
            "{cardData.mainWish}"
          </p>
        </div>

      </main>
    </div>
  );
}