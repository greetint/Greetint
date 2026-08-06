'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function CreateCard(): React.JSX.Element {
  // Данни от формата
  const [recipientName, setRecipientName] = useState('Виктория');
  const [ageCategory, setAgeCategory] = useState('13-35');
  const [questQuestion, setQuestQuestion] = useState('Кое е любимото ни място за кафе?');
  const [questAnswer, setQuestAnswer] = useState('София');
  const [couponText, setCouponText] = useState('🎫 Ваучер за 1 любима вечеря!');
  const [cardMessage, setCardMessage] = useState('Пожелавам ти година, изпълнена с незабравими приключения и сбъднати мечти!');
  
  // Масив със качени снимки (Base64)
  const [images, setImages] = useState<string[]>([]);

  // Функция за качване на снимки (до 5 броя)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      alert('Можеш да качиш максимум 5 снимки!');
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setImages((prev) => [...prev, uploadEvent.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Функция за премахване на снимка
  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <main className="min-h-screen bg-[#fefefd] text-[#2c2825] pb-20 selection:bg-[#e5cfc6]">
      {/* МЕНЮ */}
      <header className="sticky top-0 z-50 bg-[#f7f4f0]/80 backdrop-blur-md border-b border-[#d9d1cc] px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-xl font-bold tracking-[0.2em] text-[#2c2825] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#dbceb3]"></span>
            GREETINT
          </Link>
          <span className="text-xs uppercase tracking-widest text-[#958679] font-medium">
            Създай за Рожден Ден
          </span>
        </div>
      </header>

      {/* ОСНОВНО СЪДЪРЖАНИЕ */}
      <div className="max-w-6xl mx-auto px-6 pt-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-light tracking-tight">Персонализирай твоята картичка</h1>
          <p className="text-xs text-[#958679] uppercase tracking-widest mt-2">Попълни данните и виж прегледа в реално време</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          
          {/* ЛЯВА КОЛОНА: ФОРМА ЗА ПОПЪЛВАНЕ */}
          <div className="bg-[#f7f4f0] border border-[#d9d1cc] p-6 md:p-8 rounded-3xl space-y-6 shadow-sm">
            
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#635e57] mb-2">
                1. Име на рожденика
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="w-full bg-[#fefefd] border border-[#d9d1cc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#dbceb3]"
                placeholder="напр. Виктория"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#635e57] mb-2">
                2. Стил според възрастта
              </label>
              <select
                value={ageCategory}
                onChange={(e) => setAgeCategory(e.target.value)}
                className="w-full bg-[#fefefd] border border-[#d9d1cc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#dbceb3]"
              >
                <option value="13-35">Модерен & Динамичен (13–35 г.)</option>
                <option value="kids">Детски & Весел (0–12 г.)</option>
                <option value="36+">Елегантен & Класен (36+ г.)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#635e57] mb-2">
                3. Забавен въпрос / Загадка
              </label>
              <input
                type="text"
                value={questQuestion}
                onChange={(e) => setQuestQuestion(e.target.value)}
                className="w-full bg-[#fefefd] border border-[#d9d1cc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#dbceb3]"
                placeholder="Задай въпрос, на който само той знае отговора..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#635e57] mb-2">
                4. Верен отговор на въпроса
              </label>
              <input
                type="text"
                value={questAnswer}
                onChange={(e) => setQuestAnswer(e.target.value)}
                className="w-full bg-[#fefefd] border border-[#d9d1cc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#dbceb3]"
                placeholder="напр. София"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#635e57] mb-2">
                5. Подаръчен Ваучер / Купон
              </label>
              <input
                type="text"
                value={couponText}
                onChange={(e) => setCouponText(e.target.value)}
                className="w-full bg-[#fefefd] border border-[#d9d1cc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#dbceb3]"
                placeholder="напр. Купон за 1 кафе от мен"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#635e57] mb-2">
                6. Лично Пожелание
              </label>
              <textarea
                rows={3}
                value={cardMessage}
                onChange={(e) => setCardMessage(e.target.value)}
                className="w-full bg-[#fefefd] border border-[#d9d1cc] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#dbceb3]"
              />
            </div>

            {/* СЕКЦИЯ ЗА СНИМКИ */}
            <div className="pt-2 border-t border-[#d9d1cc]">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#635e57] mb-3">
                7. Галерия със снимки (до 5 броя)
              </label>
              
              <input
                type="file"
                id="fileUpload"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />

              <label
                htmlFor="fileUpload"
                className="block text-center cursor-pointer py-3 bg-[#e5cfc6]/30 border border-dashed border-[#958679] rounded-xl text-xs font-semibold text-[#2c2825] hover:bg-[#e5cfc6]/60 transition"
              >
                + Избери снимки от устройството
              </label>

              {images.length > 0 && (
                <div className="grid grid-cols-5 gap-2 mt-4">
                  {images.map((imgSrc, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={imgSrc}
                        alt="Uploaded"
                        className="w-full h-16 object-cover rounded-lg border border-[#d9d1cc]"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center shadow-sm"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* ДЯСНА КОЛОНА: PREVIEW (ПРЕГЛЕД НА ЖИВО) */}
          <div className="sticky top-28 space-y-6">
            <div className="text-xs uppercase tracking-widest text-[#958679] font-medium text-center">
              Преглед на дигиталната картичка
            </div>

            <div className="bg-[#fefefd] border border-[#d9d1cc] p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#e5cfc6]/30 rounded-full blur-2xl -z-0"></div>

              <div className="relative z-10 flex justify-between items-center text-[10px] uppercase tracking-widest text-[#958679]">
                <span>Birthday Card</span>
                <span>Greetint</span>
              </div>

              <div className="relative z-10 space-y-2">
                <h3 className="text-2xl font-light">За {recipientName || '...'}</h3>
                <p className="text-xs text-[#958679] italic">
                  Загадка: &quot;{questQuestion || '...'}&quot;
                </p>
              </div>

              <div className="relative z-10 bg-[#f7f4f0] p-4 rounded-2xl border border-[#d9d1cc] text-xs space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#958679] block font-semibold">Награда при отключване:</span>
                <p className="font-medium">{couponText || '...'}</p>
              </div>

              <div className="relative z-10 pt-2">
                <p className="text-xs text-[#635e57] italic leading-relaxed">
                  &quot;{cardMessage || '...'}&quot;
                </p>
              </div>

              {images.length > 0 && (
                <div className="relative z-10 pt-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#958679] block mb-2 font-semibold">Качени спомени:</span>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((imgSrc, idx) => (
                      <img
                        key={idx}
                        src={imgSrc}
                        alt="Preview memory"
                        className="w-14 h-14 object-cover rounded-lg border border-[#d9d1cc] flex-shrink-0"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="relative z-10 pt-6 border-t border-[#d9d1cc] flex justify-between items-end">
                <div>
                  <span className="text-[9px] uppercase tracking-widest text-[#958679] block">Формат</span>
                  <span className="text-xs font-semibold">Дигитален + PDF QR</span>
                </div>
                <div className="w-10 h-10 bg-[#2c2825] text-[#dbceb3] rounded-lg flex items-center justify-center text-[8px] font-mono">
                  QR
                </div>
              </div>

            </div>

            <button
              onClick={() => alert('Формата е готова! Утре ще я свържем с интерактивния куест.')}
              className="w-full bg-[#2c2825] hover:bg-[#635e57] text-[#fefefd] py-4 rounded-2xl text-xs font-semibold uppercase tracking-wider transition shadow-md"
            >
              Продължи към прегледа на куеста →
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}