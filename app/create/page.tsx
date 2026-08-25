'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

// ШАБЛОНИ КАРТИЧКИ (Чисти дизайни)
const CARD_TEMPLATES = [
  { id: '1', name: 'Signature Luxe', img: '/images/cards/card-1.png' },
  { id: '2', name: 'Playful Celebration', img: '/images/cards/card-2.png' },
  { id: '3', name: 'Chic Pink Stripe', img: '/images/cards/card-3.png' },
  { id: '4', name: 'Modern Blue Stripe', img: '/images/cards/card-4.png' },
];

// КИРИЛСКИ ШРИФТОВЕ (Напълно съвместими с български език)
const BULGARIAN_FONTS = [
  { name: 'Cormorant Garamond (Класика & Лукс)', family: 'font-serif' },
  { name: 'Montserrat (Модерен & Изчистен)', family: 'font-sans' },
  { name: 'Caveat (Ръкописен Стил)', family: 'font-mono' },
];

// ПАДАЩИ МЕНЮТА С ГОТОВИ ИДЕИ
const STATUS_OPTIONS = [
  "✍️ Напиши свой собствен вариант...",
  "☕ Човекът, който пие 3 кафета на ден и пак намира енергия за щури идеи.",
  "👑 Кралят/Кралицата на закъсненията (но винаги с абсолютно валидно оправдание).",
  "🤫 Тихият луд – отстрани изглежда мирен, но зад кулисите прави най-яките бели.",
  "🔋 Организаторът на групата – човекът, без когото никой нямаше да знае къде се намира."
];

const SECRET_OPTIONS = [
  "✍️ Напиши свой собствен вариант...",
  "📱 Спомняш ли си, когато си изпусна телефона и викаше, че е водоустойчив?",
  "🚗 Пазим в пълна тайна онази 'бърза' разходка, която завърши на 200 км от плана.",
  "🍹 Официално крием от всички какво точно се случи след втория коктейл!"
];

interface MemoryPhoto {
  fileUrl: string;
  question: string;
  answer: string;
}

interface QuizQuestion {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  correct: 'A' | 'B' | 'C';
}

export default function CreateCardPage() {
  const previewRef = useRef<HTMLDivElement | null>(null);

  // 1. Основни данни
  const [recipient, setRecipient] = useState('');
  const [age, setAge] = useState('');
  const [sender, setSender] = useState('');

  // 2. Статут & Шега
  const [statusText, setStatusText] = useState('');
  const [secretJoke, setSecretJoke] = useState('');

  // 3. А, Б, В Игра (с маркиране на верен отговор)
  const [quizList, setQuizList] = useState<QuizQuestion[]>([
    { 
      question: 'Ако закъснеем за полета, рожденикът първо...', 
      optionA: 'Ще се кара с персонала', 
      optionB: 'Ще си купи кафе и спокойно ще чака', 
      optionC: 'Изпада в паника', 
      correct: 'B' 
    },
    { 
      question: 'Кое е любимото му/ѝ среднощно изкушение?', 
      optionA: 'Пица с много кашкавал', 
      optionB: 'Нещо сладичко', 
      optionC: 'Чаша студена вода', 
      correct: 'A' 
    }
  ]);

  // 4. Снимки с индивидуален въпрос/отговор
  const [photos, setPhotos] = useState<MemoryPhoto[]>([]);

  // 5. Пожелание, Printable Картичка & Настройки
  const [mainWish, setMainWish] = useState('');
  const [includePrintableCard, setIncludePrintableCard] = useState(true);
  const [selectedCard, setSelectedCard] = useState(CARD_TEMPLATES[0]);
  const [customCardText, setCustomCardText] = useState('');
  const [selectedFont, setSelectedFont] = useState(BULGARIAN_FONTS[0].family);

  const [createdLink, setCreatedLink] = useState<string | null>(null);

  const handleSelectDropdown = (val: string, setter: (v: string) => void) => {
    if (val.startsWith("✍️")) {
      setter('');
    } else {
      setter(val);
    }
  };

  const handlePhotoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos: MemoryPhoto[] = Array.from(files).map(file => ({
        fileUrl: URL.createObjectURL(file),
        question: 'Къде бяхме тук / Кой е този спомен?',
        answer: ''
      }));
      setPhotos([...photos, ...newPhotos].slice(0, 5));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const uniqueId = Math.random().toString(36).substring(2, 9);
    setCreatedLink(`https://greetint.com/card/${uniqueId}`);
  };

  return (
    <div className="min-h-screen bg-[#F7F4EF] p-4 sm:p-8 font-serif text-[#1F1A17] flex justify-center">
      <div className="max-w-2xl w-full bg-[#FEFEFD] p-6 sm:p-10 rounded-2xl shadow-xl border border-[#958679]/20 space-y-8">
        
        <div className="text-center border-b border-[#958679]/20 pb-4">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#958679] font-sans font-bold">GREETINT // DIRECTOR STUDIO</span>
          <h1 className="text-3xl font-serif mt-1">Режисирай Дигиталния Филм</h1>
        </div>

        {!createdLink ? (
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. ОСНОВНИ ДАННИ */}
            <div className="space-y-3">
              <h2 className="text-xs uppercase tracking-widest font-sans font-bold text-[#958679]">1. Основни данни</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-sans text-[#635E57] mb-1">Име на рожденика</label>
                  <input 
                    type="text" required value={recipient} 
                    onChange={e => {
                      setRecipient(e.target.value);
                      if (!customCardText) setCustomCardText(`За ${e.target.value}`);
                    }} 
                    className="w-full bg-[#F7F4EF] border border-[#958679]/30 p-2.5 rounded-lg text-xs font-sans" 
                    placeholder="Виктория" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-sans text-[#635E57] mb-1">Възраст</label>
                  <input type="text" required value={age} onChange={e => setAge(e.target.value)} className="w-full bg-[#F7F4EF] border border-[#958679]/30 p-2.5 rounded-lg text-xs font-sans" placeholder="28" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-sans text-[#635E57] mb-1">От кого е</label>
                  <input type="text" required value={sender} onChange={e => setSender(e.target.value)} className="w-full bg-[#F7F4EF] border border-[#958679]/30 p-2.5 rounded-lg text-xs font-sans" placeholder="от Алекс" />
                </div>
              </div>
            </div>

            {/* 2. СТАТУТ И ТАЙНА ШЕГА */}
            <div className="space-y-4 pt-4 border-t border-[#958679]/20">
              <h2 className="text-xs uppercase tracking-widest font-sans font-bold text-[#958679]">2. Статут & Скрита Тайна</h2>
              
              <div>
                <label className="block text-[10px] uppercase font-sans text-[#635E57] mb-1">Статут / Профил за годината</label>
                <select onChange={(e) => handleSelectDropdown(e.target.value, setStatusText)} className="w-full bg-[#F7F4EF] border border-[#958679]/30 p-2 rounded-lg text-xs font-sans mb-1.5">
                  {STATUS_OPTIONS.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                </select>
                <textarea rows={2} value={statusText} onChange={e => setStatusText(e.target.value)} placeholder="Напиши свой вариант тук..." className="w-full bg-white border border-[#958679]/30 p-2.5 rounded-lg text-xs font-sans" />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-sans text-[#635E57] mb-1">Скритата тайна (За скрач изтриване)</label>
                <select onChange={(e) => handleSelectDropdown(e.target.value, setSecretJoke)} className="w-full bg-[#F7F4EF] border border-[#958679]/30 p-2 rounded-lg text-xs font-sans mb-1.5">
                  {SECRET_OPTIONS.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                </select>
                <textarea rows={2} value={secretJoke} onChange={e => setSecretJoke(e.target.value)} placeholder="Напиши свой вариант тук..." className="w-full bg-white border border-[#958679]/30 p-2.5 rounded-lg text-xs font-sans" />
              </div>
            </div>

            {/* 3. А, Б, В ИГРА С МАРКИРАНЕ НА ВЕРЕН ОТГОВОР */}
            <div className="space-y-4 pt-4 border-t border-[#958679]/20">
              <h2 className="text-xs uppercase tracking-widest font-sans font-bold text-[#958679]">3. А, Б, В Игра (2 Забавни Въпроса)</h2>
              {quizList.map((q, idx) => (
                <div key={idx} className="bg-[#F7F4EF] p-4 rounded-xl border border-[#958679]/20 space-y-3">
                  <p className="text-[10px] uppercase font-sans font-bold text-[#958679]">Въпрос #{idx + 1}</p>
                  <input type="text" value={q.question} onChange={e => { const u = [...quizList]; u[idx].question = e.target.value; setQuizList(u); }} className="w-full bg-white border border-[#958679]/30 p-2 rounded-lg text-xs font-sans font-bold" />
                  
                  <div className="grid grid-cols-3 gap-2">
                    <input type="text" value={q.optionA} onChange={e => { const u = [...quizList]; u[idx].optionA = e.target.value; setQuizList(u); }} placeholder="А) Отговор" className="bg-white border border-[#958679]/30 p-2 rounded-lg text-xs font-sans" />
                    <input type="text" value={q.optionB} onChange={e => { const u = [...quizList]; u[idx].optionB = e.target.value; setQuizList(u); }} placeholder="Б) Отговор" className="bg-white border border-[#958679]/30 p-2 rounded-lg text-xs font-sans" />
                    <input type="text" value={q.optionC} onChange={e => { const u = [...quizList]; u[idx].optionC = e.target.value; setQuizList(u); }} placeholder="В) Отговор" className="bg-white border border-[#958679]/30 p-2 rounded-lg text-xs font-sans" />
                  </div>

                  {/* ИЗБОР НА ВЕРЕН ОТГОВОР ОТ ПОДАРЯВАЩИЯ */}
                  <div className="flex items-center gap-3 pt-1 border-t border-[#958679]/10">
                    <span className="text-[10px] uppercase font-sans text-[#635E57] font-bold">Верният отговор е:</span>
                    {(['A', 'B', 'C'] as const).map((letter) => (
                      <label key={letter} className="flex items-center gap-1 cursor-pointer font-sans text-xs">
                        <input 
                          type="radio" 
                          name={`correct-ans-${idx}`} 
                          checked={q.correct === letter} 
                          onChange={() => {
                            const u = [...quizList];
                            u[idx].correct = letter;
                            setQuizList(u);
                          }}
                          className="accent-[#1F1A17]"
                        />
                        <span className={`font-bold ${q.correct === letter ? 'text-[#1F1A17]' : 'text-[#635E57]'}`}>
                          {letter}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 4. СНИМКИ И ЗАГАДКИ С ИНДИВИДУАЛЕН ВЪПРОС ЗА ВСЯКА */}
            <div className="space-y-4 pt-4 border-t border-[#958679]/20">
              <div className="flex justify-between items-center">
                <h2 className="text-xs uppercase tracking-widest font-sans font-bold text-[#958679]">4. Снимки & Загадки за всяка</h2>
                <input type="file" multiple accept="image/*" onChange={handlePhotoAdd} id="photo-input" className="hidden" />
                <label htmlFor="photo-input" className="text-[10px] uppercase font-sans font-bold bg-[#1F1A17] text-[#FEFEFD] px-3 py-1.5 rounded-lg cursor-pointer">+ Добави снимки</label>
              </div>

              {photos.map((photo, idx) => (
                <div key={idx} className="bg-[#F7F4EF] p-3 rounded-xl border border-[#958679]/20 flex gap-3 items-center">
                  <img src={photo.fileUrl} alt="Memory" className="w-14 h-14 object-cover rounded-lg border border-[#958679]/30 flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <input type="text" value={photo.question} onChange={e => { const u = [...photos]; u[idx].question = e.target.value; setPhotos(u); }} placeholder="Въпрос/Загадка за тази снимка..." className="w-full bg-white border border-[#958679]/30 p-1.5 rounded text-xs font-sans" />
                    <input type="text" value={photo.answer} onChange={e => { const u = [...photos]; u[idx].answer = e.target.value; setPhotos(u); }} placeholder="Тайният отговор (Остави празно за 1 клик)..." className="w-full bg-white border border-[#958679]/30 p-1.5 rounded text-xs font-sans" />
                  </div>
                </div>
              ))}
            </div>

            {/* 5. ПОЖЕЛАНИЕ & PRINTABLE КАРТИЧКА С ДИРЕКТНО ВЛАЧЕНЕ (DRAG & DROP) */}
            <div className="space-y-4 pt-4 border-t border-[#958679]/20">
              <h2 className="text-xs uppercase tracking-widest font-sans font-bold text-[#958679]">5. Лично Писмо & Персонална Картичка</h2>
              
              <textarea rows={4} required value={mainWish} onChange={e => setMainWish(e.target.value)} className="w-full bg-[#F7F4EF] border border-[#958679]/30 p-3 rounded-xl text-xs font-sans" placeholder="Твоето емоционално пожелание..." />

              {/* ПРЕМИУМ ЧЕКБОКС */}
              <div className="bg-[#F7F4EF] p-4 rounded-xl border border-[#958679]/30 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase font-sans text-[#1F1A17]">Добави Printable PDF Картичка за подарък</h4>
                  <p className="text-[10px] text-[#635E57] font-sans font-normal">Персонализиран текст, избор на шрифт и местеща се QR рамка.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold font-sans text-[#958679]">+4.99 лв.</span>
                  <input type="checkbox" checked={includePrintableCard} onChange={e => setIncludePrintableCard(e.target.checked)} className="w-5 h-5 accent-[#1F1A17] cursor-pointer" />
                </div>
              </div>

              {/* КОНТРОЛЕРИ И ДИРЕКТНО ПЛЪЗГАНЕ С ПРЪСТ/МИШКА */}
              {includePrintableCard && (
                <div className="bg-[#F7F4EF] p-5 rounded-2xl border border-[#958679]/30 space-y-4">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-sans font-bold text-[#635E57] mb-1">Надпис върху картичката</label>
                      <input 
                        type="text" 
                        value={customCardText} 
                        onChange={e => setCustomCardText(e.target.value)} 
                        placeholder="За Виктория" 
                        className="w-full bg-white border border-[#958679]/30 p-2 rounded-lg text-xs font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-sans font-bold text-[#635E57] mb-1">Шрифт (За Кирилица)</label>
                      <select 
                        value={selectedFont} 
                        onChange={e => setSelectedFont(e.target.value)} 
                        className="w-full bg-white border border-[#958679]/30 p-2 rounded-lg text-xs font-sans"
                      >
                        {BULGARIAN_FONTS.map((f, i) => (
                          <option key={i} value={f.family}>{f.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* ИЗБОР НА ШАБЛОН КАРТИЧКА */}
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {CARD_TEMPLATES.map(card => (
                      <button key={card.id} type="button" onClick={() => setSelectedCard(card)} className={`border p-1 rounded-xl transition ${selectedCard.id === card.id ? 'border-[#1F1A17] ring-2 ring-[#958679]/40 scale-102' : 'border-gray-200 opacity-60'}`}>
                        <img src={card.img} alt={card.name} className="w-full h-auto rounded-lg" />
                      </button>
                    ))}
                  </div>

                  <p className="text-[10px] text-center font-sans font-bold text-[#958679] tracking-wider uppercase pt-2">
                    👆 Хвани и плъзни с пръст/мишка текста или QR рамката върху картичката!
                  </p>

                  {/* ИНТЕРАКТИВЕН ПРЕГЛЕД С DRAG & DROP ВЛАЧЕНЕ */}
                  <div 
                    ref={previewRef}
                    className="relative border border-[#958679]/30 shadow-2xl max-w-xs w-full h-auto overflow-hidden bg-white mx-auto rounded-2xl select-none"
                  >
                    <img src={selectedCard.img} alt="Preview" className="w-full h-auto block pointer-events-none" />
                    
                    {/* 1. МЕСТЕЩ СЕ ТЕКСТ С ПРЪСТ/МИШКА */}
                    <motion.div
                      drag
                      dragConstraints={previewRef}
                      dragElastic={0.05}
                      dragMomentum={false}
                      className={`absolute cursor-grab active:cursor-grabbing tracking-wider text-[#1F1A17] font-bold text-center p-2 rounded border border-dashed border-[#1F1A17]/30 hover:bg-white/40 ${selectedFont}`}
                      style={{ top: '25%', left: '25%', fontSize: '15px' }}
                    >
                      {customCardText || 'За Виктория'}
                    </motion.div>

                    {/* 2. МЕСТЕЩА СЕ "SCAN ME" QR РАМКА С ПРЪСТ/МИШКА */}
                    <motion.div
                      drag
                      dragConstraints={previewRef}
                      dragElastic={0.05}
                      dragMomentum={false}
                      className="absolute cursor-grab active:cursor-grabbing flex flex-col items-center justify-center bg-white/95 border border-[#1F1A17]/20 p-1.5 rounded-xl shadow-2xl"
                      style={{ top: '60%', left: '60%', width: '26%' }}
                    >
                      <span className="text-[7px] font-sans font-bold text-[#1F1A17] tracking-widest uppercase mb-0.5 pointer-events-none">SCAN ME</span>
                      <div className="w-full aspect-square pointer-events-none">
                        <QRCodeSVG value="https://greetint.com/preview" size={60} className="w-full h-full" />
                      </div>
                    </motion.div>
                  </div>

                </div>
              )}
            </div>

            <button type="submit" className="w-full bg-[#1F1A17] text-[#FEFEFD] py-4 text-xs uppercase tracking-[0.25em] font-bold rounded-xl shadow-2xl hover:bg-[#958679] transition">
              Запечатай & Вземи Линк {includePrintableCard ? '+ Printable PDF' : ''} ✨
            </button>
          </form>
        ) : (
          <div className="text-center space-y-6 py-8">
            <h2 className="text-2xl font-serif">Запечатано успешно!</h2>
            <p className="text-xs text-[#635E57] uppercase font-sans">Линк за рожденика:</p>
            <div className="bg-[#F7F4EF] p-4 rounded-xl border border-[#958679]/30 select-all font-sans text-xs font-bold">
              {createdLink}
            </div>
            <a href={createdLink} target="_blank" rel="noreferrer" className="inline-block bg-[#1F1A17] text-[#FEFEFD] px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-bold rounded-xl shadow-xl">
              Отвори дигиталния куест →
            </a>
          </div>
        )}

      </div>
    </div>
  );
}