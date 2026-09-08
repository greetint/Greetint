'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function DetectiveMysteryCreatePage() {
  const [recipient, setRecipient] = useState('');
  const [age, setAge] = useState('');
  const [sender, setSender] = useState('');
  const [suspectProfile, setSuspectProfile] = useState({
    alias: '',
    mainCrime: '',
    distinguishingMark: '',
    lastSeen: '',
    specialSkill: ''
  });
  const [secretPassword, setSecretPassword] = useState('');
  const [redactedWish, setRedactedWish] = useState('');
  
  const defaultClues = [
    'Кой пие най-много кафе по време на разследването?',
    'Къде бе засечен субектът на дълга разходка?',
    'Кой направи най-скандалното селфи в архива?',
    'Какво е работното престъпление на агента?',
    'Коя е следващата детективска дестинация?'
  ];

  const defaultAnswers = [
    'Шеф на купона',
    'Превишена скорост на празнуване',
    'Заразно добро настроение',
    'На дансинга в петък вечер',
    'Неоторизирано ядене на торта'
  ];

  const [evidenceItems, setEvidenceItems] = useState<Array<{ fileUrl: string; clue: string; answer: string }>>([
    { fileUrl: '', clue: defaultClues[0], answer: defaultAnswers[0] },
    { fileUrl: '', clue: defaultClues[1], answer: defaultAnswers[1] },
    { fileUrl: '', clue: defaultClues[2], answer: defaultAnswers[2] },
    { fileUrl: '', clue: defaultClues[3], answer: defaultAnswers[3] },
    { fileUrl: '', clue: defaultClues[4], answer: defaultAnswers[4] },
  ]);

  const [lieDetectorQuestions, setLieDetectorQuestions] = useState<
    { question: string; options: [string, string, string]; correctAnswer: number }[]
  >([
    {
      question: 'Колко силен е купонът тази вечер за субекта?',
      options: ['Обикновен семеен събор', 'Максимално федерално ниво на шума', 'Легендарен рожден ден без право на алиби'],
      correctAnswer: 2
    },
    {
      question: 'Кой носи основната вина за прекаленото забавление?',
      options: ['Рожденикът с неограничена харизма', 'Инспекторът по купона', 'Всички присъстващи съучастници'],
      correctAnswer: 0
    }
  ]);
  const [createdLink, setCreatedLink] = useState<string | null>(null);

  const handleAddQuestion = () => {
    if (lieDetectorQuestions.length < 10) {
      setLieDetectorQuestions([
        ...lieDetectorQuestions,
        { question: '', options: ['', '', ''], correctAnswer: 0 }
      ]);
    }
  };

  const handleRemoveQuestion = (index: number) => {
    if (lieDetectorQuestions.length > 1) {
      setLieDetectorQuestions(lieDetectorQuestions.filter((_, idx) => idx !== index));
    }
  };

  const handlePhotoUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      const updated = [...evidenceItems];
      updated[index].fileUrl = url;
      setEvidenceItems(updated);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Math.random().toString(36).substring(2, 9);
    const link = `${window.location.origin}/card/${id}`;
    const payload = {
      occasion: 'birthday',
      styleId: 'detective-mystery',
      recipient,
      age: age || '30',
      sender: sender || 'Инспектор',
      suspectProfile: {
        alias: suspectProfile.alias || 'Шеф на купона',
        mainCrime: suspectProfile.mainCrime || 'Превишена скорост на празнуване',
        distinguishingMark: suspectProfile.distinguishingMark || 'Заразно добро настроение',
        lastSeen: suspectProfile.lastSeen || 'На дансинга в петък вечер',
        specialSkill: suspectProfile.specialSkill || 'Неоторизирано ядене на торта'
      },
      secretPassword: secretPassword || 'кафе',
      redactedWish: redactedWish || 'Честит рожден ден! Бъди все така неуловим.',
      evidenceItems: evidenceItems.map((item, i) => ({
        fileUrl: item.fileUrl || `/images/cards/card-${(i % 3) + 1}.png`,
        clue: item.clue.trim() || defaultClues[i],
        answer: item.answer.trim() || defaultAnswers[i]
      })),
      evidenceClues: evidenceItems.map((item, i) => item.clue.trim() || defaultClues[i]),
      evidenceAnswers: evidenceItems.map((item, i) => item.answer.trim() || defaultAnswers[i]),
      photos: evidenceItems.map((item, i) => ({ 
        fileUrl: item.fileUrl || `/images/cards/card-${(i % 3) + 1}.png` 
      })),
      lieDetectorQuestions: lieDetectorQuestions.filter(q => q.question.trim() !== '')
    };
    localStorage.setItem(`quest_${id}`, JSON.stringify(payload));
    if (recipient) localStorage.setItem(`quest_${encodeURIComponent(recipient.toLowerCase())}`, JSON.stringify(payload));
    setCreatedLink(link);
  };

  return (
    <main className="min-h-screen bg-[#11100F] text-[#F7F4EF] font-mono p-4 sm:p-6 flex items-center justify-center">
      <div className="max-w-xl w-full space-y-6">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <Link href="/create/birthday/select-style" className="text-xs text-[#958679]">← Назад</Link>
          <span className="text-red-500 text-[10px] font-bold uppercase tracking-widest">FBI // TOP SECRET DOSSIER</span>
        </div>
        <h1 className="text-2xl font-bold text-center tracking-wider">Detective Mystery: Създай Досие</h1>
        
        {!createdLink ? (
          <form onSubmit={handleSubmit} className="relative bg-[#E3D5C8] text-[#2C241D] p-8 sm:p-10 rounded-2xl shadow-2xl border border-[#b8a690] space-y-6 font-mono overflow-hidden">
            
            {/* Red Tilted Stamp */}
            <div className="absolute top-4 right-4 border-4 border-red-700 text-red-700 px-3 py-1 font-black text-xs uppercase tracking-[0.25em] transform rotate-12 pointer-events-none opacity-85 shadow-sm">
              [ CLASSIFIED // FILL DATA ]
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-red-800 border-b border-black/20 pb-2">
                1. Обща информация за субекта
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 block mb-1">Име на рожденика:</label>
                  <input type="text" required value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="напр. Александър" className="w-full bg-transparent border-b border-black/50 py-2 text-sm text-black placeholder:text-black/30 font-mono focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 block mb-1">Възраст:</label>
                  <input type="text" required value={age} onChange={e => setAge(e.target.value)} placeholder="напр. 30" className="w-full bg-transparent border-b border-black/50 py-2 text-sm text-black placeholder:text-black/30 font-mono focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 block mb-1">Подател (Инспектор):</label>
                <input type="text" required value={sender} onChange={e => setSender(e.target.value)} placeholder="напр. Инспектор Петров" className="w-full bg-transparent border-b border-black/50 py-2 text-sm text-black placeholder:text-black/30 font-mono focus:outline-none" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-red-800 border-b border-black/20 pb-2">
                2. Профил на престъпника и парола (Секретни данни за Стейдж 2 & 4)
              </h3>
              
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 block mb-1">Кодово име / Прякор (Alias):</label>
                <input type="text" required value={suspectProfile.alias} onChange={e => setSuspectProfile(p => ({...p, alias: e.target.value}))} placeholder="напр. Шеф на купона" className="w-full bg-transparent border-b border-black/50 py-2 text-sm text-black placeholder:text-black/30 font-mono focus:outline-none" />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 block mb-1">Главно престъпление (Main Crime):</label>
                <input type="text" required value={suspectProfile.mainCrime} onChange={e => setSuspectProfile(p => ({...p, mainCrime: e.target.value}))} placeholder="напр. Превишена скорост на празнуване" className="w-full bg-transparent border-b border-black/50 py-2 text-sm text-black placeholder:text-black/30 font-mono focus:outline-none" />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 block mb-1">Отличителен белег (Distinguishing Mark):</label>
                <input type="text" required value={suspectProfile.distinguishingMark} onChange={e => setSuspectProfile(p => ({...p, distinguishingMark: e.target.value}))} placeholder="напр. Заразно добро настроение" className="w-full bg-transparent border-b border-black/50 py-2 text-sm text-black placeholder:text-black/30 font-mono focus:outline-none" />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 block mb-1">Последно забелязан (Last Seen):</label>
                <input type="text" required value={suspectProfile.lastSeen} onChange={e => setSuspectProfile(p => ({...p, lastSeen: e.target.value}))} placeholder="напр. На дансинга в петък вечер" className="w-full bg-transparent border-b border-black/50 py-2 text-sm text-black placeholder:text-black/30 font-mono focus:outline-none" />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 block mb-1">Специално умение (Special Skill):</label>
                <input type="text" required value={suspectProfile.specialSkill} onChange={e => setSuspectProfile(p => ({...p, specialSkill: e.target.value}))} placeholder="напр. Неоторизирано ядене на торта" className="w-full bg-transparent border-b border-black/50 py-2 text-sm text-black placeholder:text-black/30 font-mono focus:outline-none" />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-red-700 block mb-1 font-bold">Секретна парола / Ключова дума (за Верификационния терминал в Стейдж 4):</label>
                <input type="text" required value={secretPassword} onChange={e => setSecretPassword(e.target.value)} placeholder="напр. кафе" className="w-full bg-black/10 border-b border-black/50 py-2 text-sm text-black placeholder:text-black/30 font-mono focus:outline-none px-2 rounded" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-black/20 pb-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-red-800">
                  3. Детектор на лъжата (до 10 въпроса)
                </h3>
                {lieDetectorQuestions.length < 10 && (
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="text-[10px] bg-black/10 hover:bg-black/20 text-black px-2.5 py-1 rounded font-bold uppercase transition cursor-pointer"
                  >
                    + Добави
                  </button>
                )}
              </div>

              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                {lieDetectorQuestions.map((q, qIdx) => (
                  <div key={qIdx} className="bg-white/60 p-3 rounded-xl border border-black/20 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold text-red-700">Въпрос #{qIdx + 1}</span>
                      {lieDetectorQuestions.length > 1 && (
                        <button type="button" onClick={() => handleRemoveQuestion(qIdx)} className="text-[10px] text-red-600 font-bold uppercase cursor-pointer">
                          Премахни
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      required
                      value={q.question}
                      onChange={e => {
                        const u = [...lieDetectorQuestions];
                        u[qIdx].question = e.target.value;
                        setLieDetectorQuestions(u);
                      }}
                      placeholder="Текст на въпроса..."
                      className="w-full bg-transparent border-b border-black/40 py-1 text-xs text-black font-mono focus:outline-none"
                    />
                    <div className="grid grid-cols-3 gap-2">
                      {[0, 1, 2].map(optIdx => (
                        <input
                          key={optIdx}
                          type="text"
                          required
                          value={q.options[optIdx]}
                          onChange={e => {
                            const u = [...lieDetectorQuestions];
                            u[qIdx].options[optIdx] = e.target.value;
                            setLieDetectorQuestions(u);
                          }}
                          placeholder={`Вариант ${optIdx === 0 ? 'А' : optIdx === 1 ? 'Б' : 'В'}`}
                          className="bg-transparent border-b border-black/40 py-1 text-[11px] text-black font-mono focus:outline-none"
                        />
                      ))}
                    </div>
                    <select
                      value={q.correctAnswer}
                      onChange={e => {
                        const u = [...lieDetectorQuestions];
                        u[qIdx].correctAnswer = Number(e.target.value);
                        setLieDetectorQuestions(u);
                      }}
                      className="w-full bg-white border border-black/30 rounded p-1 text-[11px] text-black font-mono focus:outline-none"
                    >
                      <option value={0}>Верен: Вариант А</option>
                      <option value={1}>Верен: Вариант Б</option>
                      <option value={2}>Верен: Вариант В</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-red-800 border-b border-black/20 pb-2">
                5. Финално послание и 5 доказателства (за Стейдж 4 и 5)
              </h3>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 block mb-1">Послание под цензура (Redacted Wish - разкрива се под лупата в Стейдж 4):</label>
                <textarea rows={3} required value={redactedWish} onChange={e => setRedactedWish(e.target.value)} placeholder="Честит рожден ден! Бъди все така..." className="w-full bg-transparent border-b border-black/50 py-2 text-sm text-black placeholder:text-black/30 font-mono focus:outline-none resize-none" />
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-red-700 block">
                  📌 5 Двойки (Снимка + Въпрос/Улика) за Корковото табло в Стейдж 5:
                </label>
                <p className="text-[10px] text-black/70 italic">
                  За всяка от 5-те бележки качете снимка И изберете готов въпрос от шаблоните ИЛИ напишете собствен уникален текст.
                </p>

                <div className="space-y-3 pt-1">
                  {evidenceItems.map((item, i) => (
                    <div key={i} className="bg-white/70 border border-black/30 p-3 rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase text-red-800">
                        <span>Доказателство / Снимка №{i + 1}</span>
                        {item.fileUrl ? <span className="text-green-700">✓ Снимка качена</span> : <span className="text-neutral-500">Очаква снимка</span>}
                      </div>

                      <div className="flex items-center gap-3">
                        {item.fileUrl && (
                          <img src={item.fileUrl} alt={`Preview ${i+1}`} className="w-12 h-12 object-cover rounded-lg border border-black/40 shadow-sm" />
                        )}
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={e => handlePhotoUpload(i, e)} 
                          className="text-[11px] text-black file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-black/10 file:text-black hover:file:bg-black/20 cursor-pointer"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black uppercase text-black/70 block mb-1">❓ Въпрос / Улика към снимката:</label>
                        <select
                          onChange={e => {
                            if (e.target.value) {
                              const updated = [...evidenceItems];
                              updated[i].clue = e.target.value;
                              setEvidenceItems(updated);
                            }
                          }}
                          className="w-full bg-white border border-black/30 rounded p-1 text-[11px] text-black font-mono focus:outline-none mb-1.5"
                          defaultValue=""
                        >
                          <option value="" disabled>-- Изберете готов забавен въпрос (шаблон) --</option>
                          {defaultClues.map((tmpl, tIdx) => (
                            <option key={tIdx} value={tmpl}>{tmpl}</option>
                          ))}
                        </select>

                        <input 
                          type="text" 
                          required
                          value={item.clue} 
                          onChange={e => {
                            const updated = [...evidenceItems];
                            updated[i].clue = e.target.value;
                            setEvidenceItems(updated);
                          }}
                          placeholder={`Въпрос или улика за снимка №${i + 1}...`}
                          className="w-full bg-transparent border-b border-black/40 py-1 text-xs text-black font-mono focus:outline-none mb-3"
                        />

                        <label className="text-[10px] font-black uppercase text-black/70 block mb-1">💡 Очакван отговор / Факт (на жълтата бележка):</label>
                        <select
                          onChange={e => {
                            if (e.target.value) {
                              const updated = [...evidenceItems];
                              updated[i].answer = e.target.value;
                              setEvidenceItems(updated);
                            }
                          }}
                          className="w-full bg-white border border-black/30 rounded p-1 text-[11px] text-black font-mono focus:outline-none mb-1.5"
                          defaultValue=""
                        >
                          <option value="" disabled>-- Изберете готов отговор (шаблон) --</option>
                          {defaultAnswers.map((tmpl, tIdx) => (
                            <option key={tIdx} value={tmpl}>{tmpl}</option>
                          ))}
                        </select>

                        <input 
                          type="text" 
                          required
                          value={item.answer} 
                          onChange={e => {
                            const updated = [...evidenceItems];
                            updated[i].answer = e.target.value;
                            setEvidenceItems(updated);
                          }}
                          placeholder={`Факт / отговор за бележка №${i + 1}...`}
                          className="w-full bg-transparent border-b border-black/40 py-1 text-xs text-black font-mono focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-red-700 hover:bg-red-800 text-white py-4 rounded-xl text-xs uppercase tracking-[0.25em] font-black shadow-lg transition cursor-pointer">
              [ СЪЗДАЙ СЕКРЕТНО ДОСИЕ ]
            </button>
          </form>
        ) : (
          <div className="bg-[#E3D5C8] text-[#2C241D] p-8 rounded-2xl shadow-2xl border border-[#b8a690] text-center space-y-4">
            <h2 className="text-xl font-black uppercase tracking-wider">Досието е готово!</h2>
            <div className="bg-black/10 p-3 rounded-xl select-all text-xs text-red-800 font-bold border border-black/20">{createdLink}</div>
            <a href={createdLink} target="_blank" rel="noreferrer" className="inline-block bg-red-700 hover:bg-red-800 text-white px-6 py-4 rounded-xl text-xs uppercase tracking-[0.25em] font-black shadow-lg transition">Отвори секретното досие →</a>
          </div>
        )}
      </div>
    </main>
  );
}

