'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

// ШАБЛОНИ КАРТИЧКИ
const CARD_TEMPLATES = [
  { id: '1', name: 'Signature Luxe', img: '/images/cards/card-1.png' },
  { id: '2', name: 'Playful Celebration', img: '/images/cards/card-2.png' },
  { id: '3', name: 'Chic Pink Stripe', img: '/images/cards/card-3.png' },
  { id: '4', name: 'Modern Blue Stripe', img: '/images/cards/card-4.png' },
];

const BULGARIAN_FONTS = [
  { name: 'Cormorant Garamond (Класика)', family: 'font-serif' },
  { name: 'Montserrat (Модерен & Изчистен)', family: 'font-sans' },
  { name: 'Caveat (Ръкописен Стил)', family: 'font-mono' },
  { name: 'Playfair Display (Елегантен)', family: 'font-serif' },
];

const CAPSULE_QUESTION_OPTIONS = [
  "Къде се виждаш след 5 години?",
  "Коя е най-щурата ти мечта?",
  "Кой е любимият ти спомен от тази година?",
  "Ако можеше да спечелиш световно по нещо, какво би било то?",
  "Напиши свой собствен въпрос..."
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

  // Основни данни
  const [recipient, setRecipient] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [sender, setSender] = useState('');
  const [candleWish, setCandleWish] = useState('');
  const [statusText, setStatusText] = useState('');
  const [secretMessages, setSecretMessages] = useState<string[]>(['']);

  // Игри и снимки (до 10 игри, до 5 снимки, до 10 скрити послания)
  const [quizList, setQuizList] = useState<QuizQuestion[]>([
    { question: '', optionA: '', optionB: '', optionC: '', correct: 'A' }
  ]);
  const [photos, setPhotos] = useState<MemoryPhoto[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Капсула на времето (Само въпроси)
  const [capsuleQuestions, setCapsuleQuestions] = useState<string[]>([CAPSULE_QUESTION_OPTIONS[0]]);

  // Картичка и персонализация
  const [includeCard, setIncludeCard] = useState(true);
  const [selectedCardImg, setSelectedCardImg] = useState(CARD_TEMPLATES[0].img);
  const [customCardBg, setCustomCardBg] = useState<string | null>(null);
  const [cardText, setCardText] = useState('');
  const [selectedFont, setSelectedFont] = useState(BULGARIAN_FONTS[0].family);
  const [qrColor, setQrColor] = useState('#1F1A17');
  const [textColor, setTextColor] = useState('#1F1A17');
  const [customNotes, setCustomNotes] = useState('');

  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Drag & Drop за снимки
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).map(file => ({
        fileUrl: URL.createObjectURL(file),
        question: '',
        answer: ''
      }));
      setPhotos(prev => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        fileUrl: URL.createObjectURL(file),
        question: '',
        answer: ''
      }));
      setPhotos(prev => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const handleCustomCardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCustomCardBg(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const uniqueId = Math.random().toString(36).substring(2, 9);
    setCreatedLink(`https://greetint.com/card/${uniqueId}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] py-12 px-4 sm:px-6 font-serif text-[#1F1A17] flex justify-center">
      <div className="max-w-3xl w-full bg-white p-6 sm:p-12 rounded-3xl shadow-sm border border-[#E5DFDE] space-y-12">
        
        {/* ЗАГЛАВИЕ */}
        <div className="text-center border-b border-[#E5DFDE] pb-6">
          <span className="text-[10px] uppercase tracking-[0.4em] text-[#958679] font-sans font-semibold">GREETINT STUDIO</span>
          <h1 className="text-3xl sm:text-4xl font-serif mt-2">Режисирай Преживяването</h1>
          <p className="text-xs text-[#635E57] font-sans mt-1">Изчистен дизайн без тежки рамки и каси.</p>
        </div>

        {!createdLink ? (
          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* 1. ОСНОВНИ ДАННИ */}
            <div className="space-y-4">
              <h2 className="text-xs uppercase tracking-widest font-sans font-semibold text-[#958679]">1. За кого е изненадата?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] uppercase font-sans text-[#635E57] mb-1">Име на получателя</label>
                  <input 
                    type="text" required value={recipient} 
                    onChange={e => {
                      setRecipient(e.target.value);
                      if (!cardText) setCardText(`За ${e.target.value}`);
                    }} 
                    className="w-full bg-[#FAF6EE] border-0 border-b-2 border-[#E5DFDE] p-3 text-xs font-sans focus:outline-none focus:border-[#1F1A17]" 
                    placeholder="напр. Виктория" 
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase font-sans text-[#635E57] mb-1">Дата на събитието</label>
                  <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="w-full bg-[#FAF6EE] border-0 border-b-2 border-[#E5DFDE] p-3 text-xs font-sans focus:outline-none focus:border-[#1F1A17]" />
                </div>
                <div>
                  <label className="block text-[11px] uppercase font-sans text-[#635E57] mb-1">Име на подателя</label>
                  <input type="text" required value={sender} onChange={e => setSender(e.target.value)} className="w-full bg-[#FAF6EE] border-0 border-b-2 border-[#E5DFDE] p-3 text-xs font-sans focus:outline-none focus:border-[#1F1A17]" placeholder="напр. от Алекс" />
                </div>
              </div>
            </div>

            {/* 2. НАЙ-ВАЖНОТО: ПОЖЕЛАНИЕ ПРИ ДУХВАНЕ НА СВЕЩТА */}
            <div className="space-y-3">
              <div>
                <h2 className="text-xs uppercase tracking-widest font-sans font-semibold text-[#958679]">2. Основно Пожелание (При духване на свещта) *</h2>
                <p className="text-[11px] text-[#635E57] font-sans">Това е най-важното емоционално послание, което получателят ще види на финала.</p>
              </div>
              <textarea 
                rows={4} required value={candleWish} 
                onChange={e => setCandleWish(e.target.value)} 
                className="w-full bg-[#FAF6EE] border-0 border-b-2 border-[#E5DFDE] p-4 text-sm font-serif focus:outline-none focus:border-[#1F1A17]" 
                placeholder="Напиши своето сърдечно пожелание тук..." 
              />
            </div>

            {/* 3. СТАТУТ & СКРИТИ ПОСЛАНИЯ / ШЕГИ (ДО 10) */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xs uppercase tracking-widest font-sans font-semibold text-[#958679]">3. Профил на годината & Скрити Послания</h2>
                {secretMessages.length < 10 && (
                  <button type="button" onClick={() => setSecretMessages([...secretMessages, ''])} className="text-xs font-sans text-[#1F1A17] font-semibold underline">
                    + Добави послание
                  </button>
                )}
              </div>
              <input type="text" value={statusText} onChange={e => setStatusText(e.target.value)} placeholder="Забавен етикет / статус (напр. Човекът с 3 кафета...)" className="w-full bg-[#FAF6EE] border-0 border-b-2 border-[#E5DFDE] p-3 text-xs font-sans focus:outline-none focus:border-[#1F1A17]" />
              
              <div className="space-y-2 pt-2">
                {secretMessages.map((msg, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input 
                      type="text" 
                      value={msg} 
                      onChange={e => {
                        const updated = [...secretMessages];
                        updated[idx] = e.target.value;
                        setSecretMessages(updated);
                      }} 
                      placeholder={`Скрито послание / шега #${idx + 1} (до 10)`} 
                      className="flex-1 bg-[#FAF6EE] border-0 border-b-2 border-[#E5DFDE] p-2.5 text-xs font-sans focus:outline-none focus:border-[#1F1A17]"
                    />
                    {secretMessages.length > 1 && (
                      <button type="button" onClick={() => setSecretMessages(secretMessages.filter((_, i) => i !== idx))} className="text-xs text-red-500 font-sans">Изтрий</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 4. DRAG & DROP СНИМКИ (ДО 5) */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xs uppercase tracking-widest font-sans font-semibold text-[#958679]">4. Спомени & Снимки (До 5 броя)</h2>
                <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} id="photo-input" className="hidden" />
                <label htmlFor="photo-input" className="text-xs font-sans font-semibold bg-[#1F1A17] text-white px-4 py-2 rounded-xl cursor-pointer">Избери файлове</label>
              </div>

              <div 
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition ${isDragging ? 'border-[#1F1A17] bg-[#FAF6EE]' : 'border-[#E5DFDE] bg-white'}`}
              >
                <p className="text-xs text-[#635E57] font-sans">Плъсни и пусни снимките си тук (Drag & Drop)</p>
              </div>

              <div className="space-y-3">
                {photos.map((photo, idx) => (
                  <div key={idx} className="bg-[#FAF6EE] p-4 rounded-2xl flex flex-col sm:flex-row gap-4 items-center">
                    <img src={photo.fileUrl} alt="Memory" className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
                    <div className="flex-1 w-full space-y-2">
                      <input 
                        type="text" 
                        value={photo.question} 
                        onChange={e => {
                          const updated = [...photos];
                          updated[idx].question = e.target.value;
                          setPhotos(updated);
                        }} 
                        placeholder="Въпрос към тази снимка..." 
                        className="w-full bg-white border-0 border-b border-[#E5DFDE] p-2 text-xs font-sans focus:outline-none"
                      />
                      <input 
                        type="text" 
                        value={photo.answer} 
                        onChange={e => {
                          const updated = [...photos];
                          updated[idx].answer = e.target.value;
                          setPhotos(updated);
                        }} 
                        placeholder="Очакван отговор..." 
                        className="w-full bg-white border-0 border-b border-[#E5DFDE] p-2 text-xs font-sans focus:outline-none"
                      />
                    </div>
                    <button type="button" onClick={() => setPhotos(photos.filter((_, i) => i !== idx))} className="text-xs text-red-500 font-sans">Премахни</button>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. А, Б, В ИГРИ (ДО 10 ВЪПРОСА) */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xs uppercase tracking-widest font-sans font-semibold text-[#958679]">5. Забавни Въпроси (А, Б, В - До 10)</h2>
                {quizList.length < 10 && (
                  <button type="button" onClick={() => setQuizList([...quizList, { question: '', optionA: '', optionB: '', optionC: '', correct: 'A' }])} className="text-xs font-sans text-[#1F1A17] font-semibold underline">
                    + Добави въпрос
                  </button>
                )}
              </div>

              {quizList.map((q, idx) => (
                <div key={idx} className="bg-[#FAF6EE] p-4 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-sans font-semibold text-[#958679]">Въпрос #{idx + 1}</span>
                    {quizList.length > 1 && (
                      <button type="button" onClick={() => setQuizList(quizList.filter((_, i) => i !== idx))} className="text-xs text-red-500 font-sans">Изтрий</button>
                    )}
                  </div>
                  <input type="text" value={q.question} onChange={e => { const u = [...quizList]; u[idx].question = e.target.value; setQuizList(u); }} placeholder="Въведи въпрос..." className="w-full bg-white border-0 border-b border-[#E5DFDE] p-2 text-xs font-sans font-semibold focus:outline-none" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input type="text" value={q.optionA} onChange={e => { const u = [...quizList]; u[idx].optionA = e.target.value; setQuizList(u); }} placeholder="Опция А" className="bg-white p-2 text-xs font-sans rounded-xl border border-[#E5DFDE]" />
                    <input type="text" value={q.optionB} onChange={e => { const u = [...quizList]; u[idx].optionB = e.target.value; setQuizList(u); }} placeholder="Опция Б" className="bg-white p-2 text-xs font-sans rounded-xl border border-[#E5DFDE]" />
                    <input type="text" value={q.optionC} onChange={e => { const u = [...quizList]; u[idx].optionC = e.target.value; setQuizList(u); }} placeholder="Опция В" className="bg-white p-2 text-xs font-sans rounded-xl border border-[#E5DFDE]" />
                  </div>
                </div>
              ))}
            </div>

            {/* 6. КАПСУЛА НА ВРЕМЕТО (САМО ВЪПРОСИ БЕЗ ОТГОВОРИ) */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xs uppercase tracking-widest font-sans font-semibold text-[#958679]">6. Въпроси за Капсулата на Времето</h2>
                <button type="button" onClick={() => setCapsuleQuestions([...capsuleQuestions, ''])} className="text-xs font-sans text-[#1F1A17] font-semibold underline">
                  + Добави въпрос
                </button>
              </div>

              {capsuleQuestions.map((q, idx) => (
                <div key={idx} className="space-y-2 bg-[#FAF6EE] p-4 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-sans font-semibold text-[#958679]">Въпрос #{idx + 1}</span>
                    {capsuleQuestions.length > 1 && (
                      <button type="button" onClick={() => setCapsuleQuestions(capsuleQuestions.filter((_, i) => i !== idx))} className="text-xs text-red-500 font-sans">Изтрий</button>
                    )}
                  </div>
                  <select 
                    value={CAPSULE_QUESTION_OPTIONS.includes(q) ? q : "Напиши свой собствен въпрос..."} 
                    onChange={e => {
                      const updated = [...capsuleQuestions];
                      updated[idx] = e.target.value === "Напиши свой собствен въпрос..." ? "" : e.target.value;
                      setCapsuleQuestions(updated);
                    }}
                    className="w-full bg-white border border-[#E5DFDE] p-2.5 rounded-xl text-xs font-sans"
                  >
                    {CAPSULE_QUESTION_OPTIONS.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                  </select>

                  {(!CAPSULE_QUESTION_OPTIONS.includes(q) || q === "") && (
                    <input 
                      type="text" 
                      value={q} 
                      onChange={e => {
                        const updated = [...capsuleQuestions];
                        updated[idx] = e.target.value;
                        setCapsuleQuestions(updated);
                      }}
                      placeholder="Въведи своя въпрос тук..." 
                      className="w-full bg-white border border-[#E5DFDE] p-2.5 rounded-xl text-xs font-sans"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* 7. ПЕРСОНАЛИЗИРАНЕ НА КАРТИЧКА С ДРАГ & ДРОП НА ЕЛЕМЕНТИТЕ */}
            <div className="space-y-6 pt-6 border-t border-[#E5DFDE]">
              <div className="flex justify-between items-center">
                <h2 className="text-xs uppercase tracking-widest font-sans font-semibold text-[#958679]">7. Персонализиране на Картичката</h2>
                <input type="checkbox" checked={includeCard} onChange={e => setIncludeCard(e.target.checked)} className="w-5 h-5 accent-[#1F1A17]" />
              </div>

              {includeCard && (
                <div className="space-y-6 bg-[#FAF6EE] p-6 rounded-3xl">
                  
                  {/* ИЗБОР НА ШАБЛОН ИЛИ КАЧВАНЕ НА СОБСТВЕНА СНИМКА */}
                  <div className="space-y-3">
                    <label className="block text-[11px] uppercase font-sans text-[#635E57]">Избери готов дизайн или качи своя картичка</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {CARD_TEMPLATES.map(card => (
                        <button key={card.id} type="button" onClick={() => { setSelectedCardImg(card.img); setCustomCardBg(null); }} className={`border-2 p-1 rounded-xl transition ${selectedCardImg === card.img && !customCardBg ? 'border-[#1F1A17]' : 'border-transparent'}`}>
                          <img src={card.img} alt={card.name} className="w-full h-auto rounded-lg" />
                        </button>
                      ))}
                    </div>
                    <div className="pt-2">
                      <input type="file" accept="image/*" onChange={handleCustomCardUpload} id="custom-card-file" className="hidden" />
                      <label htmlFor="custom-card-file" className="inline-block bg-white border border-[#E5DFDE] text-[#1F1A17] px-4 py-2 rounded-xl text-xs font-sans font-semibold cursor-pointer">
                        + Качи твоя снимка за картичка
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase font-sans text-[#635E57] mb-1">Надпис</label>
                      <input type="text" value={cardText} onChange={e => setCardText(e.target.value)} className="w-full bg-white border border-[#E5DFDE] p-3 rounded-xl text-xs font-sans" />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase font-sans text-[#635E57] mb-1">Шрифт</label>
                      <select value={selectedFont} onChange={e => setSelectedFont(e.target.value)} className="w-full bg-white border border-[#E5DFDE] p-3 rounded-xl text-xs font-sans">
                        {BULGARIAN_FONTS.map((f, i) => <option key={i} value={f.family}>{f.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase font-sans text-[#635E57] mb-1">Цвят на текста</label>
                      <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer bg-white border border-[#E5DFDE] p-1" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase font-sans text-[#635E57] mb-1">Цвят на QR кода</label>
                      <input type="color" value={qrColor} onChange={e => setQrColor(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer bg-white border border-[#E5DFDE] p-1" />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase font-sans text-[#635E57] mb-1">Лични бележки</label>
                      <input type="text" value={customNotes} onChange={e => setCustomNotes(e.target.value)} placeholder="Допълнителен текст..." className="w-full bg-white border border-[#E5DFDE] p-3 rounded-xl text-xs font-sans" />
                    </div>
                  </div>

                  {/* ИНТЕРАКТИВНО ПРЕВЮ С DRAG & DROP НА ТЕКСТА И QR КОДА */}
                  <div className="pt-4 text-center">
                    <p className="text-[11px] uppercase font-sans font-semibold text-[#958679] mb-3">Хвани и плъзни елементите свободно върху картичката ↓</p>
                    <div 
                      ref={previewRef} 
                      className="relative w-full max-w-xs mx-auto overflow-hidden bg-white rounded-2xl shadow-md border border-[#E5DFDE]"
                      style={{ aspectRatio: '1/1.4' }}
                    >
                      <img src={customCardBg || selectedCardImg} alt="Card Preview" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
                      
                      {/* МЕСТЕЩ СЕ ТЕКСТ */}
                      <motion.div
                        drag
                        dragConstraints={previewRef}
                        dragMomentum={false}
                        className={`absolute cursor-grab active:cursor-grabbing p-2 ${selectedFont}`}
                        style={{ top: '20%', left: '20%', color: textColor, fontSize: '18px', fontWeight: 'bold' }}
                      >
                        {cardText || 'За получателя'}
                      </motion.div>

                      {/* МЕСТЕЩ СЕ QR КОД */}
                      <motion.div
                        drag
                        dragConstraints={previewRef}
                        dragMomentum={false}
                        className="absolute cursor-grab active:cursor-grabbing p-2 bg-white/90 rounded-xl shadow-lg"
                        style={{ top: '55%', left: '55%', width: '30%' }}
                      >
                        <QRCodeSVG value="https://greetint.com/preview" size={70} fgColor={qrColor} className="w-full h-auto pointer-events-none" />
                      </motion.div>
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* БУТОНИ */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                type="button" 
                onClick={() => setShowPreviewModal(true)} 
                className="flex-1 bg-white border border-[#1F1A17] text-[#1F1A17] py-4 text-xs uppercase tracking-[0.2em] font-sans font-semibold rounded-2xl hover:bg-[#FAF6EE] transition"
              >
                Превю на преживяването 👀
              </button>
              <button 
                type="submit" 
                className="flex-1 bg-[#1F1A17] text-white py-4 text-xs uppercase tracking-[0.2em] font-sans font-semibold rounded-2xl shadow-lg hover:bg-[#958679] transition"
              >
                Запечатай & Вземи Линк ✨
              </button>
            </div>

          </form>
        ) : (
          <div className="text-center space-y-6 py-10">
            <h2 className="text-3xl font-serif">Готово е!</h2>
            <p className="text-xs text-[#635E57] uppercase font-sans tracking-widest">Линк за споделяне:</p>
            <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-[#E5DFDE] select-all font-sans text-xs font-bold">
              {createdLink}
            </div>
            <a href={createdLink} target="_blank" rel="noreferrer" className="inline-block bg-[#1F1A17] text-white px-8 py-4 text-xs uppercase tracking-[0.2em] font-sans font-semibold rounded-2xl shadow-md">
              Отвори дигиталния линк →
            </a>
          </div>
        )}

      </div>

      {/* МОДАЛ ЗА ПРЕВЮ НА ЦЯЛОТО ПРЕЖИВЯВАНЕ */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-8 rounded-3xl shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#E5DFDE] pb-4">
              <h3 className="text-lg font-serif font-bold">Превю на преживяването</h3>
              <button onClick={() => setShowPreviewModal(false)} className="text-xs font-sans font-semibold">Затвори ✕</button>
            </div>

            <div className="space-y-4 font-sans text-xs text-[#635E57]">
              <p><strong>Получател:</strong> {recipient || 'Не е въведено'}</p>
              <p><strong>Подател:</strong> {sender || 'Не е въведено'}</p>
              <p><strong>Основно пожелание:</strong> {candleWish || 'Няма въведено'}</p>
              <p><strong>Брой снимки:</strong> {photos.length}</p>
              <p><strong>Брой А,Б,В въпроси:</strong> {quizList.length}</p>
              <p><strong>Брой въпроси за капсулата:</strong> {capsuleQuestions.length}</p>
            </div>

            <button onClick={() => setShowPreviewModal(false)} className="w-full bg-[#1F1A17] text-white py-3 rounded-xl text-xs font-sans uppercase tracking-wider">
              Обратно към редакция
            </button>
          </div>
        </div>
      )}

    </div>
  );
}