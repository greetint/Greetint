'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

// ИМПОРТ НА РЕАЛНИТЕ СТЕЙДЖОВЕ ОТ КУЕСТА
import SealStage from '@/components/quest/SealStage';
import CakeStage from '@/components/quest/CakeStage';
import ScratchStage from '@/components/quest/ScratchStage';
import MemoryWallStage from '@/components/quest/MemoryWallStage';
import QuizStage from '@/components/quest/QuizStage';
import CapsuleStage from '@/components/quest/CapsuleStage';

const CARD_TEMPLATES = [
  { id: '1', name: 'Signature Luxe', img: '/images/cards/card-1.png' },
  { id: '2', name: 'Playful Celebration', img: '/images/cards/card-2.png' },
  { id: '3', name: 'Chic Pink Stripe', img: '/images/cards/card-3.png' },
  { id: '4', name: 'Modern Blue Stripe', img: '/images/cards/card-4.png' },
];

const BULGARIAN_FONTS = [
  { name: 'Cormorant Garamond (Класика)', family: 'font-serif' },
  { name: 'Montserrat (Модерен)', family: 'font-sans' },
  { name: 'Caveat (Ръкописен)', family: 'font-mono' },
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

  // 1. Основни данни
  const [recipient, setRecipient] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [sender, setSender] = useState('');

  // 2. Основно пожелание (при духване на свещта)
  const [candleWish, setCandleWish] = useState('');

  // 3. Статут & Скрити послания
  const [statusText, setStatusText] = useState('');
  const [secretMessages, setSecretMessages] = useState<string[]>(['']);

  // 4. Снимки с въпроси и отговори
  const [photos, setPhotos] = useState<MemoryPhoto[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // 5. А, Б, В игри (с избор на верен отговор)
  const [quizList, setQuizList] = useState<QuizQuestion[]>([
    { question: '', optionA: '', optionB: '', optionC: '', correct: 'A' }
  ]);

  // 6. Капсула на времето (Само въпроси)
  const [capsuleQuestions, setCapsuleQuestions] = useState<string[]>([CAPSULE_QUESTION_OPTIONS[0]]);

  // 7. Редактор на картичка
  const [includeCard, setIncludeCard] = useState(true);
  const [cardOrientation, setCardOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [selectedCardImg, setSelectedCardImg] = useState(CARD_TEMPLATES[0].img);
  const [customCardBg, setCustomCardBg] = useState<string | null>(null);
  const [cardText, setCardText] = useState('');
  const [selectedFont, setSelectedFont] = useState(BULGARIAN_FONTS[0].family);
  const [qrColor, setQrColor] = useState('#1F1A17');
  const [textColor, setTextColor] = useState('#1F1A17');
  const [customNotes, setCustomNotes] = useState('');

  // ДИНАМИЧНО ГЕНЕРИРАН ЛИНК И СИМУЛАТОР
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentSimulatorStage, setCurrentSimulatorStage] = useState(0);

  const activePreviewUrl = createdLink || 'https://greetint.com/preview-live';

  // Drag & Drop снимки
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
    
    // Взима актуалния домейн (напр. твоя Vercel линк) вместо твърдо кодиран .com
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const generatedUrl = `${baseUrl}/card/${uniqueId}`;
    
    const questPayload = {
      recipient,
      birthDate,
      sender,
      candleWish,
      statusText,
      secretMessages,
      photos,
      quizList,
      capsuleQuestions,
      includeCard,
      cardOrientation,
      selectedCardImg,
      customCardBg,
      cardText,
      selectedFont,
      qrColor,
      textColor,
      customNotes,
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(`quest_${uniqueId}`, JSON.stringify(questPayload));
      if (recipient) {
        localStorage.setItem(`quest_${encodeURIComponent(recipient.toLowerCase())}`, JSON.stringify(questPayload));
      }
    }

    setCreatedLink(generatedUrl);
  };

  // Списък със стейджовете за реалния симулатор на преживяването (с подадени реални данни от формата)
  const simulatorStages = [
    <SealStage 
      key="seal" 
      recipient={recipient || 'Получател'} 
      onComplete={() => setCurrentSimulatorStage(1)} 
      onUnlock={() => {}} 
    />,
    <ScratchStage 
      key="scratch" 
      recipient={recipient || 'Получател'}
      scratchCards={secretMessages.filter(Boolean).length > 0 ? secretMessages.map((msg, idx) => ({ id: String(idx + 1), title: `Скрито послание #${idx + 1}`, secretText: msg })) : undefined}
      onComplete={() => setCurrentSimulatorStage(2)} 
    />,
    <QuizStage 
      key="quiz" 
      recipient={recipient || 'Получател'}
      quizzes={quizList.filter(q => q.question).length > 0 ? quizList.filter(q => q.question).map((q, idx) => ({ id: String(idx + 1), question: q.question, options: [q.optionA, q.optionB, q.optionC].filter(Boolean), correctAnswer: q.correct === 'A' ? 0 : q.correct === 'B' ? 1 : 2 })) : undefined}
      onComplete={() => setCurrentSimulatorStage(3)} 
    />,
    <MemoryWallStage 
      key="memory" 
      recipient={recipient || 'Получател'}
      memories={photos.length > 0 ? photos.map((p, idx) => ({ id: String(idx + 1), url: p.fileUrl, type: 'image' as const, questionOrCaption: p.question || 'Спомен', correctAnswer: p.answer || 'отговор' })) : undefined}
      onComplete={() => setCurrentSimulatorStage(4)} 
    />,
    <CakeStage 
      key="cake" 
      recipient={recipient || 'Получател'}
      senderWish={candleWish || 'Честит празник!'}
      onComplete={() => setCurrentSimulatorStage(5)} 
    />,
    <CapsuleStage 
      key="capsule" 
      customQuestions={capsuleQuestions.filter(Boolean).length > 0 ? capsuleQuestions.filter(Boolean) : undefined}
      onGeneratePdf={async () => {}} 
    />
  ];

  return (
    <div className="min-h-screen bg-[#11100F] text-[#FAF6EE] py-12 px-4 sm:px-6 font-serif flex justify-center selection:bg-[#958679]/30">
      <div className="max-w-4xl w-full bg-[#1A1816] p-8 sm:p-14 rounded-[40px] shadow-2xl border border-white/10 space-y-12 relative overflow-hidden">
        
        {/* ЛОГО И ЗАГЛАВИЕ */}
        <div className="relative z-10 text-center space-y-4 border-b border-white/10 pb-8">
          <div className="flex justify-center mb-2">
            <img src="/images/logo/logo-horizontal.png" alt="Greetint Logo" className="h-10 object-contain filter invert opacity-90" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-light tracking-wide">Режисирай Преживяването</h1>
          <p className="text-xs text-[#958679] font-sans tracking-widest uppercase">Студио за създаване на интерактивен куест</p>
        </div>

        {!createdLink ? (
          <form onSubmit={handleSubmit} className="relative z-10 space-y-12">
            
            {/* 1. ОСНОВНИ ДАННИ */}
            <div className="space-y-4 bg-white/[0.02] p-6 rounded-3xl border border-white/5">
              <h2 className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#958679]">1. За кого е изненадата?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[11px] uppercase font-sans text-white/60 mb-2">Име на получателя</label>
                  <input 
                    type="text" required value={recipient} 
                    onChange={e => {
                      setRecipient(e.target.value);
                      if (!cardText) setCardText(`За ${e.target.value}`);
                    }} 
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-3.5 text-xs font-sans text-white focus:outline-none focus:border-[#958679] transition" 
                    placeholder="напр. Виктория" 
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase font-sans text-white/60 mb-2">Дата на събитието</label>
                  <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl p-3.5 text-xs font-sans text-white focus:outline-none focus:border-[#958679] transition" />
                </div>
                <div>
                  <label className="block text-[11px] uppercase font-sans text-white/60 mb-2">Име на подателя</label>
                  <input type="text" required value={sender} onChange={e => setSender(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl p-3.5 text-xs font-sans text-white focus:outline-none focus:border-[#958679] transition" placeholder="напр. от Алекс" />
                </div>
              </div>
            </div>

            {/* 2. ПОЖЕЛАНИЕ ПРИ ДУХВАНЕ НА СВЕЩТА */}
            <div className="space-y-3 bg-white/[0.02] p-6 rounded-3xl border border-white/5">
              <div>
                <h2 className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#958679]">2. Основно Пожелание (При духване на свещта) *</h2>
                <p className="text-[11px] text-white/50 font-sans mt-0.5">Емоционалният връх, който получателят ще види, когато духне свещта.</p>
              </div>
              <textarea 
                rows={4} required value={candleWish} 
                onChange={e => setCandleWish(e.target.value)} 
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm font-serif text-white focus:outline-none focus:border-[#958679] transition resize-none" 
                placeholder="Напиши своето сърдечно пожелание тук..." 
              />
            </div>

            {/* 3. СТАТУТ & СКРИТИ ПОСЛАНИЯ */}
            <div className="space-y-4 bg-white/[0.02] p-6 rounded-3xl border border-white/5">
              <div className="flex justify-between items-center">
                <h2 className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#958679]">3. Профил & Скрити Послания</h2>
                {secretMessages.length < 10 && (
                  <button type="button" onClick={() => setSecretMessages([...secretMessages, ''])} className="text-xs font-sans text-[#958679] hover:text-white underline">
                    + Добави послание
                  </button>
                )}
              </div>
              <input type="text" value={statusText} onChange={e => setStatusText(e.target.value)} placeholder="Забавен етикет / статус (напр. Човекът с 3 кафета...)" className="w-full bg-black/40 border border-white/10 rounded-2xl p-3.5 text-xs font-sans text-white focus:outline-none focus:border-[#958679]" />
              
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
                      className="flex-1 bg-black/40 border border-white/10 rounded-2xl p-3 text-xs font-sans text-white focus:outline-none focus:border-[#958679]"
                    />
                    {secretMessages.length > 1 && (
                      <button type="button" onClick={() => setSecretMessages(secretMessages.filter((_, i) => i !== idx))} className="text-xs text-red-400">Изтрий</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 4. DRAG & DROP СНИМКИ */}
            <div className="space-y-4 bg-white/[0.02] p-6 rounded-3xl border border-white/5">
              <div className="flex justify-between items-center">
                <h2 className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#958679]">4. Спомени & Снимки (До 5 броя)</h2>
                <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} id="photo-input" className="hidden" />
                <label htmlFor="photo-input" className="text-xs font-sans font-semibold bg-[#FAF6EE] text-[#11100F] px-4 py-2.5 rounded-xl cursor-pointer hover:bg-white transition">Избери файлове</label>
              </div>

              <div 
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-3xl p-8 text-center transition ${isDragging ? 'border-[#958679] bg-white/5' : 'border-white/10 bg-black/20'}`}
              >
                <p className="text-xs text-white/60 font-sans">Плъсни и пусни снимките си тук (Drag & Drop)</p>
              </div>

              <div className="space-y-3">
                {photos.map((photo, idx) => (
                  <div key={idx} className="bg-black/40 p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-4 items-center">
                    <img src={photo.fileUrl} alt="Memory" className="w-16 h-16 object-cover rounded-xl flex-shrink-0 border border-white/10" />
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
                        className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-xs font-sans text-white focus:outline-none"
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
                        className="w-full bg-white/5 border border-white/10 p-2.5 rounded-xl text-xs font-sans text-white focus:outline-none"
                      />
                    </div>
                    <button type="button" onClick={() => setPhotos(photos.filter((_, i) => i !== idx))} className="text-xs text-red-400">Премахни</button>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. А, Б, В ИГРИ С ИЗБОР НА ВЕРЕН ОТГОВОР */}
            <div className="space-y-4 bg-white/[0.02] p-6 rounded-3xl border border-white/5">
              <div className="flex justify-between items-center">
                <h2 className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#958679]">5. Забавни Въпроси (А, Б, В - До 10)</h2>
                {quizList.length < 10 && (
                  <button type="button" onClick={() => setQuizList([...quizList, { question: '', optionA: '', optionB: '', optionC: '', correct: 'A' }])} className="text-xs font-sans text-[#958679] hover:text-white underline">
                    + Добави въпрос
                  </button>
                )}
              </div>

              {quizList.map((q, idx) => (
                <div key={idx} className="bg-black/40 p-5 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-sans font-semibold text-[#958679]">Въпрос #{idx + 1}</span>
                    {quizList.length > 1 && (
                      <button type="button" onClick={() => setQuizList(quizList.filter((_, i) => i !== idx))} className="text-xs text-red-400">Изтрий</button>
                    )}
                  </div>
                  <input type="text" value={q.question} onChange={e => { const u = [...quizList]; u[idx].question = e.target.value; setQuizList(u); }} placeholder="Въведи въпрос..." className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-xs font-sans text-white focus:outline-none" />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input type="text" value={q.optionA} onChange={e => { const u = [...quizList]; u[idx].optionA = e.target.value; setQuizList(u); }} placeholder="Опция А" className="bg-white/5 border border-white/10 p-3 rounded-xl text-xs font-sans text-white" />
                    <input type="text" value={q.optionB} onChange={e => { const u = [...quizList]; u[idx].optionB = e.target.value; setQuizList(u); }} placeholder="Опция Б" className="bg-white/5 border border-white/10 p-3 rounded-xl text-xs font-sans text-white" />
                    <input type="text" value={q.optionC} onChange={e => { const u = [...quizList]; u[idx].optionC = e.target.value; setQuizList(u); }} placeholder="Опция В" className="bg-white/5 border border-white/10 p-3 rounded-xl text-xs font-sans text-white" />
                  </div>

                  {/* ИЗБОР НА ВЕРЕН ОТГОВОР */}
                  <div className="flex items-center gap-4 pt-2 border-t border-white/10">
                    <span className="text-[11px] uppercase font-sans text-white/60 font-semibold">Верен отговор:</span>
                    {(['A', 'B', 'C'] as const).map(letter => (
                      <label key={letter} className="flex items-center gap-1.5 cursor-pointer font-sans text-xs text-white">
                        <input 
                          type="radio" 
                          name={`correct-ans-${idx}`} 
                          checked={q.correct === letter} 
                          onChange={() => {
                            const u = [...quizList];
                            u[idx].correct = letter;
                            setQuizList(u);
                          }}
                          className="accent-[#FAF6EE]"
                        />
                        <span className="font-bold">{letter}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 6. КАПСУЛА НА ВРЕМЕТО (САМО ВЪПРОСИ) */}
            <div className="space-y-4 bg-white/[0.02] p-6 rounded-3xl border border-white/5">
              <div className="flex justify-between items-center">
                <h2 className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#958679]">6. Въпроси за Капсулата на Времето</h2>
                <button type="button" onClick={() => setCapsuleQuestions([...capsuleQuestions, ''])} className="text-xs font-sans text-[#958679] hover:text-white underline">
                  + Добави въпрос
                </button>
              </div>

              {capsuleQuestions.map((q, idx) => (
                <div key={idx} className="space-y-3 bg-black/40 p-4 rounded-2xl border border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-sans font-semibold text-[#958679]">Въпрос #{idx + 1}</span>
                    {capsuleQuestions.length > 1 && (
                      <button type="button" onClick={() => setCapsuleQuestions(capsuleQuestions.filter((_, i) => i !== idx))} className="text-xs text-red-400">Изтрий</button>
                    )}
                  </div>
                  <select 
                    value={CAPSULE_QUESTION_OPTIONS.includes(q) ? q : "Напиши свой собствен въпрос..."} 
                    onChange={e => {
                      const updated = [...capsuleQuestions];
                      updated[idx] = e.target.value === "Напиши свой собствен въпрос..." ? "" : e.target.value;
                      setCapsuleQuestions(updated);
                    }}
                    className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-xs font-sans text-white"
                  >
                    {CAPSULE_QUESTION_OPTIONS.map((opt, i) => <option key={i} value={opt} className="bg-[#1A1816]">{opt}</option>)}
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
                      className="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-xs font-sans text-white focus:outline-none"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* 7. РЕДАКТОР НА КАРТИЧКА С ДИНАМИЧЕН QR КОД */}
            <div className="space-y-6 pt-6 border-t border-white/10">
              <div className="flex justify-between items-center">
                <h2 className="text-xs uppercase tracking-[0.2em] font-sans font-semibold text-[#958679]">7. Редактор на Printable Картичка</h2>
                <input type="checkbox" checked={includeCard} onChange={e => setIncludeCard(e.target.checked)} className="w-5 h-5 accent-[#FAF6EE]" />
              </div>

              {includeCard && (
                <div className="space-y-6 bg-white/[0.02] p-6 sm:p-8 rounded-3xl border border-white/5">
                  
                  {/* ОРИЕНТАЦИЯ */}
                  <div className="space-y-2">
                    <label className="block text-[11px] uppercase font-sans text-white/60">Формат / Ориентация</label>
                    <div className="flex gap-4">
                      <button 
                        type="button" 
                        onClick={() => setCardOrientation('portrait')} 
                        className={`px-4 py-2.5 rounded-xl text-xs font-sans font-semibold transition ${cardOrientation === 'portrait' ? 'bg-[#FAF6EE] text-[#11100F]' : 'bg-black/40 text-white border border-white/10'}`}
                      >
                        Вертикална (Portrait)
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setCardOrientation('landscape')} 
                        className={`px-4 py-2.5 rounded-xl text-xs font-sans font-semibold transition ${cardOrientation === 'landscape' ? 'bg-[#FAF6EE] text-[#11100F]' : 'bg-black/40 text-white border border-white/10'}`}
                      >
                        Хоризонтална (Landscape)
                      </button>
                    </div>
                  </div>

                  {/* ШАБЛОНИ ИЛИ КАЧВАНЕ */}
                  <div className="space-y-3">
                    <label className="block text-[11px] uppercase font-sans text-white/60">Избери дизайн или качи своя картинка</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {CARD_TEMPLATES.map(card => (
                        <button key={card.id} type="button" onClick={() => { setSelectedCardImg(card.img); setCustomCardBg(null); }} className={`border-2 p-1 rounded-2xl transition ${selectedCardImg === card.img && !customCardBg ? 'border-[#FAF6EE]' : 'border-transparent'}`}>
                          <img src={card.img} alt={card.name} className="w-full h-auto rounded-xl" />
                        </button>
                      ))}
                    </div>
                    <div className="pt-2">
                      <input type="file" accept="image/*" onChange={handleCustomCardUpload} id="custom-card-file" className="hidden" />
                      <label htmlFor="custom-card-file" className="inline-block bg-black/40 border border-white/10 text-white px-4 py-3 rounded-xl text-xs font-sans font-semibold cursor-pointer hover:bg-white/5 transition">
                        + Качи твоя снимка за картичка
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase font-sans text-white/60 mb-1">Надпис</label>
                      <input type="text" value={cardText} onChange={e => setCardText(e.target.value)} className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-xs font-sans text-white focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase font-sans text-white/60 mb-1">Шрифт</label>
                      <select value={selectedFont} onChange={e => setSelectedFont(e.target.value)} className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-xs font-sans text-white focus:outline-none">
                        {BULGARIAN_FONTS.map((f, i) => <option key={i} value={f.family} className="bg-[#1A1816]">{f.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase font-sans text-white/60 mb-1">Цвят на текста</label>
                      <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer bg-black/40 border border-white/10 p-1" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase font-sans text-white/60 mb-1">Цвят на QR кода</label>
                      <input type="color" value={qrColor} onChange={e => setQrColor(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer bg-black/40 border border-white/10 p-1" />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase font-sans text-white/60 mb-1">Лични бележки</label>
                      <input type="text" value={customNotes} onChange={e => setCustomNotes(e.target.value)} placeholder="Допълнителен текст..." className="w-full bg-black/40 border border-white/10 p-3 rounded-xl text-xs font-sans text-white focus:outline-none" />
                    </div>
                  </div>

                  {/* ИНТЕРАКТИВНО ПРЕВЮ С ДРАГ & ДРОП И ДИНАМИЧЕН QR КОД */}
                  <div className="pt-4 text-center">
                    <p className="text-[11px] uppercase font-sans font-semibold text-[#958679] mb-3">Хвани и плъзни елементите свободно върху картичката ↓</p>
                    <div 
                      ref={previewRef} 
                      className={`relative mx-auto overflow-hidden bg-white rounded-3xl shadow-2xl border border-white/10 ${cardOrientation === 'portrait' ? 'w-full max-w-xs' : 'w-full max-w-md'}`}
                      style={{ aspectRatio: cardOrientation === 'portrait' ? '1/1.4' : '1.4/1' }}
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

                      {/* МЕСТЕЩ СЕ И ДИНАМИЧНО ГЕНЕРИРАН QR КОД */}
                      <motion.div
                        drag
                        dragConstraints={previewRef}
                        dragMomentum={false}
                        className="absolute cursor-grab active:cursor-grabbing p-2 bg-white/95 rounded-2xl shadow-xl border border-black/5"
                        style={{ top: '55%', left: '55%', width: '30%' }}
                      >
                        <QRCodeSVG value={activePreviewUrl} size={70} fgColor={qrColor} className="w-full h-auto pointer-events-none" />
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
                onClick={() => { setCurrentSimulatorStage(0); setIsSimulating(true); }} 
                className="flex-1 bg-white/5 border border-white/10 text-[#FAF6EE] py-4 text-xs uppercase tracking-[0.2em] font-sans font-semibold rounded-2xl hover:bg-white/10 transition"
              >
                Симулатор на преживяването 👀
              </button>
              <button 
                type="submit" 
                className="flex-1 bg-[#FAF6EE] text-[#11100F] py-4 text-xs uppercase tracking-[0.2em] font-sans font-semibold rounded-2xl shadow-lg hover:bg-white transition"
              >
                Запечатай & Вземи Линк ✨
              </button>
            </div>

          </form>
        ) : (
          <div className="text-center space-y-6 py-10">
            <h2 className="text-3xl font-serif">Готово е!</h2>
            <p className="text-xs text-[#958679] uppercase font-sans tracking-widest">Линк за споделяне:</p>
            <div className="bg-black/40 p-4 rounded-2xl border border-white/10 select-all font-sans text-xs font-bold text-white">
              {createdLink}
            </div>
            <a href={createdLink} target="_blank" rel="noreferrer" className="inline-block bg-[#FAF6EE] text-[#11100F] px-8 py-4 text-xs uppercase tracking-[0.2em] font-sans font-semibold rounded-2xl shadow-md">
              Отвори дигиталния линк →
            </a>
          </div>
        )}

      </div>

      {/* РЕАЛЕН СИМУЛАТОР НА ПРЕЖИВЯВАНЕТО (ИЗГРАЖДА СТЕЙДЖОВЕТЕ ЕДИН СЛЕД ДРУГ) */}
      {isSimulating && (
        <div className="fixed inset-0 z-50 bg-[#11100F] flex flex-col justify-between overflow-y-auto">
          {/* Горна лента за управление на симулатора */}
          <div className="bg-[#1A1816] border-b border-white/10 px-6 py-4 flex justify-between items-center z-50">
            <span className="text-xs font-sans uppercase tracking-widest text-[#958679]">
              Симулатор на куеста (Стъпка {currentSimulatorStage + 1} от {simulatorStages.length})
            </span>
            <button 
              onClick={() => setIsSimulating(false)} 
              className="bg-white/10 text-white px-4 py-2 rounded-xl text-xs font-sans font-semibold hover:bg-white/20 transition"
            >
              Изход от симулатора ✕
            </button>
          </div>

          {/* РЕАЛНИЯТ СТЕЙДЖ */}
          <div className="flex-1 relative flex items-center justify-center">
            {simulatorStages[currentSimulatorStage]}
          </div>

          {/* Долна лента за навигация */}
          <div className="bg-[#1A1816] border-t border-white/10 px-6 py-4 flex justify-between items-center z-50">
            <button 
              disabled={currentSimulatorStage === 0} 
              onClick={() => setCurrentSimulatorStage(prev => prev - 1)} 
              className="text-xs font-sans text-white/60 disabled:opacity-30 hover:text-white"
            >
              ← Предишна стъпка
            </button>
            <span className="text-xs font-sans text-white/40">Навигирай и тествай стейджовете</span>
            <button 
              disabled={currentSimulatorStage === simulatorStages.length - 1} 
              onClick={() => setCurrentSimulatorStage(prev => prev + 1)} 
              className="text-xs font-sans text-white bg-white/10 px-5 py-2 rounded-xl hover:bg-white/20 disabled:opacity-30"
            >
              Следваща стъпка →
            </button>
          </div>
        </div>
      )}

    </div>
  );
}