'use client';

import React, { useState } from 'react';
import Logo from '@/components/Logo';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';

export default function CreateCardPage() {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 5);
      const newImages = filesArray.map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...newImages].slice(0, 5));
    }
  };

  const handleStartCheckout = () => {
    if (!formData.recipientName) {
      alert('Моля, въведете име на рожденика!');
      return;
    }
    const fullData = { ...formData, images };
    localStorage.setItem('greetint_card_data', JSON.stringify(fullData));
    setShowCheckoutModal(true);
  };

  const handleSimulatePayment = () => {
    setIsPaid(true);
  };

  // ЛИНК ЗА СКАНИРАНЕ С ТЕЛЕФОН
  // В момента използва локалния адрес. Когато го качиш във Vercel, автоматично ще ползва реалния ти сайт!
  const targetCardUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/card/123` 
    : 'https://greetint.vercel.app/card/123';

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#1F1A17] font-sans pb-24">
      
      {/* HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-[#F7F4EF]/80 border-b border-[#958679]/15 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/">
            <Logo variant="horizontal" height={42} />
          </Link>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#958679] font-semibold bg-[#EFECE6] px-4 py-1.5 rounded-full border border-[#958679]/20">
            Стъпка {step} от 3
          </span>
        </div>
      </header>

      {/* FORM CONTAINER */}
      <main className="max-w-2xl mx-auto px-6 pt-10">
        <div className="bg-[#EFECE6]/90 p-8 sm:p-12 border border-[#958679]/25 shadow-xl">
          
          {step === 1 && (
            <div className="space-y-7">
              <h2 className="text-3xl font-serif uppercase text-[#1F1A17]">1. За кого е капсулата?</h2>
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
                    className="w-full bg-[#F7F4EF] border border-[#958679]/30 p-4 text-sm text-[#1F1A17] focus:outline-none"
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
                    className="w-full bg-[#F7F4EF] border border-[#958679]/30 p-4 text-sm text-[#1F1A17] focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-[#1F1A17] font-semibold mb-2">
                    Добави любими снимки (до 5 бр.)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full bg-[#F7F4EF] border border-[#958679]/30 p-3 text-xs text-[#958679]"
                  />
                  {images.length > 0 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                      {images.map((img, idx) => (
                        <img key={idx} src={img} alt="preview" className="w-16 h-16 object-cover border border-[#958679]/40" />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!formData.recipientName}
                className="w-full bg-[#1F1A17] text-[#F7F4EF] py-4.5 text-xs uppercase tracking-[0.25em] font-bold hover:bg-[#958679] transition disabled:opacity-30"
              >
                Продължи към Тайната Шега →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-7">
              <h2 className="text-3xl font-serif uppercase text-[#1F1A17]">2. Закачки и Тайни</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.2em] text-[#1F1A17] font-semibold mb-2">
                    Тайната шега
                  </label>
                  <input
                    type="text"
                    name="secretJoke"
                    value={formData.secretJoke}
                    onChange={handleChange}
                    placeholder="напр. Още пазим тайната от морето през 2022..."
                    className="w-full bg-[#F7F4EF] border border-[#958679]/30 p-4 text-sm text-[#1F1A17] focus:outline-none"
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
                      className="w-full bg-[#F7F4EF] border border-[#958679]/30 p-4 text-sm text-[#1F1A17] focus:outline-none"
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
                      className="w-full bg-[#F7F4EF] border border-[#958679]/30 p-4 text-sm text-[#1F1A17] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="w-1/3 border border-[#1F1A17]/30 text-[#1F1A17] py-4 text-xs uppercase font-semibold"
                >
                  ← Назад
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="w-2/3 bg-[#1F1A17] text-[#F7F4EF] py-4 text-xs uppercase font-bold hover:bg-[#958679] transition"
                >
                  Към Пожеланието →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-7">
              <h2 className="text-3xl font-serif uppercase text-[#1F1A17]">3. Запечатай Капсулата</h2>
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
                  className="w-full bg-[#F7F4EF] border border-[#958679]/30 p-4 text-sm text-[#1F1A17] focus:outline-none"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-[#958679]/20">
                <button
                  onClick={() => setStep(2)}
                  className="w-1/3 border border-[#1F1A17]/30 text-[#1F1A17] py-4 text-xs uppercase font-semibold"
                >
                  ← Назад
                </button>
                <button
                  onClick={handleStartCheckout}
                  className="w-2/3 bg-[#1F1A17] text-[#F7F4EF] py-4 text-xs uppercase font-bold hover:bg-[#958679] transition shadow-xl"
                >
                  Към Финализиране & ПЛАЩАНЕ ✨
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* MODAL ЗА СИМУЛАЦИЯ НА ПЛАЩАНЕ И QR КОД */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-[#1F1A17]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#F7F4EF] max-w-md w-full p-8 border border-[#958679]/40 shadow-2xl relative text-center space-y-6">
            <button
              onClick={() => {
                setShowCheckoutModal(false);
                setIsPaid(false);
              }}
              className="absolute top-4 right-4 text-xs uppercase tracking-widest text-[#958679] font-bold"
            >
              [ Затвори ✕ ]
            </button>

            {!isPaid ? (
              <div className="space-y-5 pt-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#958679] font-bold block">
                  Завършване на Поръчката
                </span>
                <h3 className="text-2xl font-serif uppercase text-[#1F1A17]">Дигитална Капсула GREETINT</h3>
                
                <div className="bg-[#EFECE6] p-4 border border-[#958679]/20 text-left space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span>1x Дигитална Капсула + Printable PDF</span>
                    <span>14.90 лв.</span>
                  </div>
                  <p className="text-[10px] text-[#958679]">Включва интерактивен куест, галерия и А5 печатен лист с QR код.</p>
                </div>

                <div className="p-4 border border-dashed border-[#958679]/40 text-xs text-[#958679] italic">
                  [ Тук ще бъде интегриран Stripe / ПОС терминал за плащане с карта ]
                </div>

                <button
                  onClick={handleSimulatePayment}
                  className="w-full bg-[#1F1A17] text-[#F7F4EF] py-4 text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#958679] transition shadow-lg"
                >
                  Плати Симулативно (14.90 лв.) 💳
                </button>
              </div>
            ) : (
              <div className="space-y-5 pt-2 animate-fadeIn">
                <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-800 font-bold block">
                  Успешно Плащане! 🎉
                </span>
                <h3 className="text-xl font-serif uppercase text-[#1F1A17]">Твоята Капсула е Готова</h3>
                
                {/* ГЕНЕРИРАН QR КОД */}
                <div className="bg-white p-4 inline-block border border-[#958679]/30 shadow-md my-2">
                  <QRCodeSVG value={targetCardUrl} size={160} />
                </div>

                <p className="text-xs text-[#958679] px-2">
                  Сканирай този QR код с камерата на телефона си, за да отвориш готовото преживяване за рожденика!
                </p>

                <div className="pt-2">
                  <a
                    href="/card/123"
                    className="block w-full bg-[#1F1A17] text-[#F7F4EF] py-3.5 text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#958679] transition"
                  >
                    Отвори Картичката Директно →
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}