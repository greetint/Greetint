'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';

// ШИРОКА ГАМА КИРИЛСКИ ШРИФТОВЕ
const BULGARIAN_FONTS = [
  { name: 'Cormorant Garamond (Класика)', family: 'font-serif' },
  { name: 'Montserrat (Модерен & Изчистен)', family: 'font-sans' },
  { name: 'Caveat (Ръкописен)', family: 'font-mono' },
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

interface CapsuleQuestionItem {
  question: string;
  answer: string;
}

export default function CreateCardPage() {
  const previewRef = useRef<HTMLDivElement | null>(null);

  // 1. Основни данни
  const [recipient, setRecipient] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [sender, setSender] = useState('');

  // 2. Най-важното: Пожелание при духване на свещта
  const [candleWish, setCandleWish] = useState('');

  // 3. Статут & Множество Скрити Послания/Шеги (до 10)
  const [statusText, setStatusText] = useState('');
  const [secretMessages, setSecretMessages] = useState<string[]>(['']);

  // 4. Множество А, Б, В игри (до 10)
  const [quizList, setQuizList] = useState<QuizQuestion[]>([
    { 
      question: '', 
      optionA: '', 
      optionB: '', 
      optionC: '', 
      correct: 'A' 
    }
  ]);

  // 5. Снимки с Drag & Drop (до 5)
  const [photos, setPhotos] = useState<MemoryPhoto[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // 6. Въпроси за капсулата на времето (с падащо меню + собствени)
  const [capsuleItems, setCapsuleItems] = useState<CapsuleQuestionItem[]>([
    { question: CAPSULE_QUESTION_OPTIONS[0], answer: '' }
  ]);

  // 7. Картичка & QR настройки
  const [includeCard, setIncludeCard] = useState(true);
  const [cardText, setCardText] = useState('');
  const [selectedFont, setSelectedFont] = useState(BULGARIAN_FONTS[0].family);
  const [qrColor, setQrColor] = useState('#1F1A17');
  const [textColor, setTextColor] = useState('#1F1A17');
  const [customNotes, setCustomNotes] = useState('');

  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Drag & Drop за снимки
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map(file => ({
        fileUrl: URL.createObjectURL(file),
        question: '',
        answer: ''
      }));
      setPhotos(prev => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(file => ({
        fileUrl: URL.createObjectURL(file),
        question: '',
        answer: ''
      }));
      setPhotos(prev => [...prev, ...newFiles].slice(0, 5));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const uniqueId = Math.random().toString(36).substring(2, 9);
    setCreatedLink(`https://greetint.com/card/${uniqueId}`);
  };

  return (
    <div className="min-h-screen bg-[#FAF6EE] py-12 px-4 sm:px-6 font-serif text-[#1F1A17] flex justify-center">
      <div className="max-w-3xl w-full bg-white p-8 sm:p-12 rounded-3xl shadow-sm border border-[#E5DFDE] space-y-10">
        
        {/* ЗАГЛАВИЕ */}
        <div className="text-center border-b border-[#E5DFDE] pb-6">
          <span className="text-[11px] uppercase tracking-[0.4em] text-[#958679] font-sans font-semibold">GREETINT STUDIO</span>
          <h1 className="text-4xl font-serif mt-2 text-[#1F1A17]">Създай Своето Преживяване</h1>
          <p className="text-xs text-[#635E57] font-sans mt-1">Изчистен, елегантен дизайн без излишни рамки.</p>
        </div>

        {!createdLink ? (
          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* 1. ОСНОВНИ ДАННИ */}
            <div className="space-y-4">
              <h2 className="text-xs uppercase tracking-widest font-sans font-semibold text-[#958679]">1. За кого е изненадата?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] uppercase font-sans text-[#635E57] mb-1.5">Име на получателя</label>
                  <input 
                    type="text" required value={recipient} 
                    onChange={e => {
                      setRecipient(e.target.value);
                      if (!cardText) setCardText(`За ${e.target.value}`);
                    }} 
                    className="w-full bg-[#FAF6EE] border border-[#E5DFDE] p-3 rounded-xl text-xs font-sans focus:outline-none focus:border-[#958679]" 
                    placeholder="напр. Виктория" 
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase font-sans text-[#635E57] mb-1.5">Дата на раждане / събитие</label>
                  <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="w-full bg-[#FAF6EE] border border-[#E5DFDE] p-3 rounded-xl text-xs font-sans focus:outline-none focus:border-[#958679]" />
                </div>
                <div>
                  <label className="block text-[11px] uppercase font-sans text-[#635E57] mb-1.5">Име на подателя</label>
                  <input type="text" required value={sender} onChange={e => setSender(e.target.value)} className="w-full bg-[#FAF6EE] border border-[#E5DFDE] p-3 rounded-xl text-xs font-sans focus:outline-none focus:border-[#958679]" placeholder="напр. от Алекс" />
                </div>
              </div>
            </div>

            {/* 2. НАЙ-ВАЖНОТО: ПОЖЕЛАНИЕ ПРИ ДУХВАНЕ НА СВЕЩТА */}
            <div className="space-y-4 pt-6 border-t border-[#E5DFDE]">
              <div>
                <h2 className="text-xs uppercase tracking-widest font-sans font-semibold text-[#958679]">2. Основно Пожелание (При духване на свещта) *</h2>
                <p className="text-[11px] text-[#635E57] font-sans mt-0.5">Това е най-важното емоционално послание, което получателят ще види на финала.</p>
              </div>
              <textarea 
                rows={4} required value={candleWish} 
                onChange={e => setCandleWish(e.target.value)} 
                className="w-full bg-[#FAF6EE] border border-[#E5DFDE] p-4 rounded-2xl text-sm font-serif focus:outline-none focus:border-[#958679]" 
                placeholder="Напиши своето сърдечно пожелание тук..." 
              />
            </div>

            {/* 3. СТАТУТ & СКРИТИ ПОСЛАНИЯ / ШЕГИ (ДО 10) */}
            <div className="space-y-4 pt-6 border-t border-[#E5DFDE]">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xs uppercase tracking-widest font-sans font-semibold text-[#958679]">3. Профил на годината & Скрити Послания</h2>
                  <p className="text-[11px] text-[#635E57] font-sans mt-0.5">Добави забавни факти или скрити послания (до 10 броя).</p>
                </div>
                {secretMessages.length < 10 && (
                  <button type="button" onClick={() => setSecretMessages([...secretMessages, ''])} className="text-xs font-sans text-[#1F1A17] font-semibold underline">
                    + Добави послание
                  </button>
                )}
              </div>

              <div>
                <label className="block text-[11px] uppercase font-sans text-[#635E57] mb-1.5">Статут / Забавен етикет</label>
                <input type="text" value={statusText} onChange={e => setStatusText(e.target.value)} placeholder="напр. Човекът с 3 кафета на ден..." className="w-full bg-[#FAF6EE] border border-[#E5DFDE] p-3 rounded-xl text-xs font-sans" />
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-[11px] uppercase font-sans text-[#635E57]">Скрити послания / Шеги</label>
                {secretMessages.map((msg, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      type="text" 
                      value={msg} 
                      onChange={e => {
                        const updated = [...secretMessages];
                        updated[idx] = e.target.value;
                        setSecretMessages(updated);
                      }} 
                      placeholder={`Послание #${idx + 1}`} 
                      className="flex-1 bg-[#FAF6EE] border border-[#E5DFDE] p-2.5 rounded-xl text-xs font-sans"
                    />
                    {secretMessages.length > 1 && (
                      <button type="button" onClick={() => setSecretMessages(secretMessages.filter((_, i) => i !== idx))} className="text-red-500 px-2 text-xs font-sans">Изтрий</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 4. DRAG & DROP СНИМКИ (MEMORY WALL STAGE - ДО 5) */}
            <div className="space-y-4 pt-6 border-t border-[#E5DFDE]">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xs uppercase tracking-widest font-sans font-semibold text-[#958679]">4. Спомени & Снимки (До 5 броя)</h2>
                  <p className="text-[11px] text-[#635E57] font-sans mt-0.5">Вкарай снимки чрез Drag & Drop и задай въпрос към тях.</p>
                </div>
                <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} id="hidden-photo-input" className="hidden" />
                <label htmlFor="hidden-photo-input" className="text-xs font-sans font-semibold bg-[#1F1A17] text-white px-4 py-2 rounded-xl cursor-pointer">Качи файлове</label>
              </div>

              {/* DRAG & DROP ЗОНА */}
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition ${isDragging ? 'border-[#1F1A17] bg-[#FAF6EE]' : 'border-[#E5DFDE] bg-white'}`}
              >
                <p className="text-xs text-[#635E57] font-sans">Плъсни и пусни снимките си тук</p>
                <span className="text-[10px] text-[#958679] font-sans block mt-1">поддържа се мултиселект</span>
              </div>

              {/* СПИСЪК С КАЧЕНИ СНИМКИ И ВЪПРОСИ */}
              <div className="space-y-3 pt-2">
                {photos.map((photo, idx) => (
                  <div key={idx} className="bg-[#FAF6EE] p-4 rounded-2xl border border-[#E5DFDE] flex flex-col sm:flex-row gap-4 items-center">
                    <img src={photo.fileUrl} alt="Memory" className="w-20 h-20 object-cover rounded-xl border border-[#E5DFDE] flex-shrink-0" />
                    <div className="flex-1 w-full space-y-2">
                      <input 
                        type="text" 
                        value={photo.question} 
                        onChange={e => {
                          const updated = [...photos];
                          updated[idx].question = e.target.value;
                          setPhotos(updated);
                        }} 
                        placeholder="Напиши въпрос за този спомен..." 
                        className="w-full bg-white border border-[#E5DFDE] p-2.5 rounded-xl text-xs font-sans"
                      />
                      <input 
                        type="text" 
                        value={photo.answer} 
                        onChange={e => {
                          const updated = [...photos];
                          updated[idx].answer = e.target.value;
                          setPhotos(updated);
                        }} 
                        placeholder="Очакван отговор (по избор)..." 
                        className="w-full bg-white border border-[#E5DFDE] p-2.5 rounded-xl text-xs font-sans"
                      />
                    </div>
                    <button type="button" onClick={() => setPhotos(photos.filter((_, i) => i !== idx))} className="text-xs text-red-500 font-sans">Премахни</button>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. А, Б, В ИГРИ (ДО 10 ВЪПРОСА) */}
            <div className="space-y-4 pt-6 border-t border-[#E5DFDE]">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xs uppercase tracking-widest font-sans font-semibold text-[#958679]">5. Забавни Въпроси (А, Б, В Игра - До 10)</h2>
                  <p className="text-[11px] text-[#635E57] font-sans mt-0.5">Създай въпроси с избор на отговор.</p>
                </div>
                {quizList.length < 10 && (
                  <button 
                    type="button" 
                    onClick={() => setQuizList([...quizList, { question: '', optionA: '', optionB: '', optionC: '', correct: 'A' }])} 
                    className="text-xs font-sans text-[#1F1A17] font-semibold underline"
                  >
                    + Добави въпрос
                  </button>
                )}
              </div>

              {quizList.map((q, idx) => (
                <div key={idx} className="bg-[#FAF6EE] p-5 rounded-2xl border border-[#E5DFDE] space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] uppercase font-sans font-semibold text-[#958679]">Въпрос #{idx + 1}</span>
                    {quizList.length > 1 && (
                      <button type="button" onClick={() => setQuizList(quizList.filter((_, i) => i !== idx))} className="text-xs text-red-500 font-sans">Изтрий</button>
                    )}
                  </div>
                  <input 
                    type="text" 
                    value={q.question} 
                    onChange={e => { const u = [...quizList]; u[idx].question = e.target.value; setQuizList(u); }} 
                    placeholder="Въведи въпрос..." 
                    className="w-full bg-white border border-[#E5DFDE] p-2.5 rounded-xl text-xs font-sans font-semibold" 
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input type="text" value={q.optionA} onChange={e => { const u = [...quizList]; u[idx].optionA = e.target.value; setQuizList(u); }} placeholder="Опция А" className="bg-white border border-[#E5DFDE] p-2.5 rounded-xl text-xs font-sans" />
                    <input type="text" value={q.optionB} onChange={e => { const u = [...quizList]; u[idx].optionB = e.target.value; setQuizList(u); }} placeholder="Опция Б" className="bg-white border border-[#E5DFDE] p-2.5 rounded-xl text-xs font-sans" />
                    <input type="text" value={q.optionC} onChange={e => { const u = [...quizList]; u[idx].optionC = e.target.value; setQuizList(u); }} placeholder="Опция В" className="bg-white border border-[#E5DFDE] p-2.5 rounded-xl text-xs font-sans" />
                  </div>

                  <div className="flex items-center gap-4 pt-2 border-t border-[#E5DFDE]/60">
                    <span className="text-[11px] uppercase font-sans text-[#635E57] font-semibold">Верен отговор:</span>
                    {(['A', 'B', 'C'] as const).map(letter => (
                      <label key={letter} className="flex items-center gap-1 cursor-pointer font-sans text-xs">
                        <input 
                          type="radio" 
                          name={`quiz-${idx}`} 
                          checked={q.correct === letter} 
                          onChange={() => { const u = [...quizList]; u[idx].correct = letter; setQuizList(u); }} 
                          className="accent-[#1F1A17]"
                        />
                        <span className="font-bold">{letter}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 6. КАПСУЛА НА ВРЕМЕТО (ПАДАЩО МЕНЮ + СОБСТВЕНИ) */}
            <div className="space-y-4 pt-6 border-t border-[#E5DFDE]">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xs uppercase tracking-widest font-sans font-semibold text-[#958679]">6. Въпроси за Капсулата на Времето</h2>
                  <p className="text-[11px] text-[#635E57] font-sans mt-0.5">Избери от готовите въпроси или добави свой собствен.</p>
                </div>
                <button type="button" onClick={() => setCapsuleItems([...capsuleItems, { question: '', answer: '' }])} className="text-xs font-sans text-[#1F1A17] font-semibold underline">
                  + Добави въпрос
                </button>
              </div>

              {capsuleItems.map((item, idx) => (
                <div key={idx} className="bg-[#FAF6EE] p-4 rounded-2xl border border-[#E5DFDE] space-y-3">
                  <select 
                    value={item.question} 
                    onChange={e => {
                      const updated = [...capsuleItems];
                      updated[idx].question = e.target.value;
                      setCapsuleItems(updated);
                    }}
                    className="w-full bg-white border border-[#E5DFDE] p-2.5 rounded-xl text-xs font-sans"
                  >
                    {CAPSULE_QUESTION_OPTIONS.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>

                  {item.question.includes("Напиши свой") && (
                    <input 
                      type="text" 
                      placeholder="Напиши твоя въпрос тук..." 
                      onChange={e => {
                        const updated = [...capsuleItems];
                        updated[idx].question = e.target.value;
                        setCapsuleItems(updated);
                      }}
                      className="w-full bg-white border border-[#E5DFDE] p-2.5 rounded-xl text-xs font-sans"
                    />
                  )}

                  <input 
                    type="text" 
                    value={item.answer} 
                    onChange={e => {
                      const updated = [...capsuleItems];
                      updated[idx].answer = e.target.value;
                      setCapsuleItems(updated);
                    }}
                    placeholder="Очакван отговор..." 
                    className="w-full bg-white border border-[#E5DFDE] p-2.5 rounded-xl text-xs font-sans"
                  />
                </div>
              ))}
            </div>

            {/* 7. КАРТИЧКА, ЦВЕТОВЕ НА QR И СВОБОДНИ ПОЛЕTA */}
            <div className="space-y-6 pt-6 border-t border-[#E5DFDE]">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xs uppercase tracking-widest font-sans font-semibold text-[#958679]">7. Персонализиране на Картичката & QR Код</h2>
                  <p className="text-[11px] text-[#635E57] font-sans mt-0.5">Избери шрифтове, цветове и добави лични бележки.</p>
                </div>
                <input type="checkbox" checked={includeCard} onChange={e => setIncludeCard(e.target.checked)} className="w-5 h-5 accent-[#1F1A17]" />
              </div>

              {includeCard && (
                <div className="space-y-4 bg-[#FAF6EE] p-6 rounded-3xl border border-[#E5DFDE]">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase font-sans text-[#635E57] mb-1">Надпис върху картичката</label>
                      <input type="text" value={cardText} onChange={e => setCardText(e.target.value)} className="w-full bg-white border border-[#E5DFDE] p-3 rounded-xl text-xs font-sans" />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase font-sans text-[#635E57] mb-1">Шрифт</label>
                      <select value={selectedFont} onChange={e => setSelectedFont(e.target.value)} className="w-full bg-white border border-[#E5DFDE] p-3 rounded-xl text-xs font-sans">
                        {BULGARIAN_FONTS.map((f, i) => <option key={i} value={f.family}>{f.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase font-sans text-[#635E57] mb-1">Цвят на текста</label>
                      <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer bg-white border border-[#E5DFDE] p-1" />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase font-sans text-[#635E57] mb-1">Цвят на QR кода</label>
                      <input type="color" value={qrColor} onChange={e => setQrColor(e.target.value)} className="w-full h-10 rounded-xl cursor-pointer bg-white border border-[#E5DFDE] p-1" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase font-sans text-[#635E57] mb-1">Допълнителни свободни полета / бележки</label>
                    <textarea rows={2} value={customNotes} onChange={e => setCustomNotes(e.target.value)} placeholder="Добави друго съобщение или бележка..." className="w-full bg-white border border-[#E5DFDE] p-3 rounded-xl text-xs font-sans" />
                  </div>

                  {/* ПРЕВЮ НА КАРТИЧКАТА */}
                  <div className="pt-2 text-center">
                    <p className="text-[11px] uppercase font-sans font-semibold text-[#958679] mb-3">Интерактивно Превю на Картичката</p>
                    <div ref={previewRef} className="relative w-full max-w-xs mx-auto bg-white p-6 rounded-2xl shadow-sm border border-[#E5DFDE] flex flex-col items-center space-y-4">
                      <p className={`text-lg font-bold ${selectedFont}`} style={{ color: textColor }}>
                        {cardText || 'За получателя'}
                      </p>
                      <div className="p-3 bg-white rounded-xl shadow-inner border border-[#E5DFDE]">
                        <QRCodeSVG value="https://greetint.com/preview" size={90} fgColor={qrColor} />
                      </div>
                      {customNotes && <p className="text-[11px] font-sans text-[#635E57] text-center">{customNotes}</p>}
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* БУТОНИ ЗА ПРЕВЮ И ФИНАЛИЗИРАНЕ */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                type="button" 
                onClick={() => setShowPreviewModal(true)} 
                className="flex-1 bg-white border border-[#1F1A17] text-[#1F1A17] py-4 text-xs uppercase tracking-[0.2em] font-sans font-semibold rounded-2xl hover:bg-[#FAF6EE] transition"
              >
                Виж Превю на Цялото Преживяване 👀
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
            <h2 className="text-3xl font-serif text-[#1F1A17]">Преживяването е създадено!</h2>
            <p className="text-xs text-[#635E57] uppercase font-sans tracking-widest">Линк за споделяне:</p>
            <div className="bg-[#FAF6EE] p-4 rounded-2xl border border-[#E5DFDE] select-all font-sans text-xs font-bold text-[#1F1A17]">
              {createdLink}
            </div>
            <a href={createdLink} target="_blank" rel="noreferrer" className="inline-block bg-[#1F1A17] text-white px-8 py-4 text-xs uppercase tracking-[0.2em] font-sans font-semibold rounded-2xl shadow-md">
              Отвори дигиталния линк →
            </a>
          </div>
        )}

      </div>

      {/* МОДАЛЕН ПРОЗОРЕЦ ЗА ПРЕВЮ НА ЦЯЛОТО ПРЕЖИВЯВАНЕ */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full p-8 rounded-3xl shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#E5DFDE] pb-4">
              <h3 className="text-lg font-serif font-bold text-[#1F1A17]">Превю на преживяването</h3>
              <button onClick={() => setShowPreviewModal(false)} className="text-xs font-sans font-semibold text-[#635E57]">Затвори ✕</button>
            </div>

            <div className="space-y-4 font-sans text-xs text-[#635E57]">
              <p><strong>Получател:</strong> {recipient || 'Не е въведено'}</p>
              <p><strong>Подател:</strong> {sender || 'Не е въведено'}</p>
              <p><strong>Основно пожелание (Свещ):</strong> {candleWish || 'Няма въведено пожелание'}</p>
              <p><strong>Брой снимки (Drag & Drop):</strong> {photos.length}</p>
              <p><strong>Брой А,Б,В въпроси:</strong> {quizList.length}</p>
              <p><strong>Брой скрити послания:</strong> {secretMessages.filter(Boolean).length || 0}</p>
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