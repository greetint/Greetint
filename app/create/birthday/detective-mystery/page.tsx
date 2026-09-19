'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function DetectiveMysteryCreatePage() {
  const { t, lang } = useLanguage();
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
    t('detectiveMystery.createForm.defaultClue1'),
    t('detectiveMystery.createForm.defaultClue2'),
    t('detectiveMystery.createForm.defaultClue3'),
    t('detectiveMystery.createForm.defaultClue4'),
    t('detectiveMystery.createForm.defaultClue5')
  ];

  const defaultAnswers = [
    t('detectiveMystery.createForm.defaultAnswer1'),
    t('detectiveMystery.createForm.defaultAnswer2'),
    t('detectiveMystery.createForm.defaultAnswer3'),
    t('detectiveMystery.createForm.defaultAnswer4'),
    t('detectiveMystery.createForm.defaultAnswer5')
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
      question: t('detectiveMystery.createForm.defaultLieQuestion1'),
      options: [
        t('detectiveMystery.createForm.defaultLieQuestion1OptionA'),
        t('detectiveMystery.createForm.defaultLieQuestion1OptionB'),
        t('detectiveMystery.createForm.defaultLieQuestion1OptionC')
      ],
      correctAnswer: 2
    },
    {
      question: t('detectiveMystery.createForm.defaultLieQuestion2'),
      options: [
        t('detectiveMystery.createForm.defaultLieQuestion2OptionA'),
        t('detectiveMystery.createForm.defaultLieQuestion2OptionB'),
        t('detectiveMystery.createForm.defaultLieQuestion2OptionC')
      ],
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
    const link = `${window.location.origin}/card/${id}?lang=${lang}`;
    const payload = {
      occasion: 'birthday',
      styleId: 'detective-mystery',
      recipient,
      age: age || '30',
      sender: sender || t('detectiveMystery.createForm.defaultSender'),
      suspectProfile: {
        alias: suspectProfile.alias || t('detectiveMystery.createForm.defaultAnswer1'),
        mainCrime: suspectProfile.mainCrime || t('detectiveMystery.createForm.defaultAnswer2'),
        distinguishingMark: suspectProfile.distinguishingMark || t('detectiveMystery.createForm.defaultAnswer3'),
        lastSeen: suspectProfile.lastSeen || t('detectiveMystery.createForm.defaultAnswer4'),
        specialSkill: suspectProfile.specialSkill || t('detectiveMystery.createForm.defaultAnswer5')
      },
      secretPassword: secretPassword || 'кафе',
      redactedWish: redactedWish || t('detectiveMystery.createForm.defaultRedactedWish'),
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

  const optionLetter = (idx: number) =>
    t(`detectiveMystery.createForm.optionLetter${idx === 0 ? 'A' : idx === 1 ? 'B' : 'C'}`);

  return (
    <main className="min-h-screen bg-[#11100F] text-[#F7F4EF] font-mono p-4 sm:p-6 flex items-center justify-center">
      <div className="max-w-xl w-full space-y-6">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <Link href="/create/birthday/select-style" className="text-xs text-[#958679]">{t('detectiveMystery.createForm.back')}</Link>
          <span className="text-red-500 text-[10px] font-bold uppercase tracking-widest">FBI // TOP SECRET DOSSIER</span>
        </div>
        <h1 className="text-2xl font-bold text-center tracking-wider">{t('detectiveMystery.createForm.pageTitle')}</h1>

        {!createdLink ? (
          <form onSubmit={handleSubmit} className="relative bg-[#E3D5C8] text-[#2C241D] p-8 sm:p-10 rounded-2xl shadow-2xl border border-[#b8a690] space-y-6 font-mono overflow-hidden">

            {/* Red Tilted Stamp */}
            <div className="absolute top-4 right-4 border-4 border-red-700 text-red-700 px-3 py-1 font-black text-xs uppercase tracking-[0.25em] transform rotate-12 pointer-events-none opacity-85 shadow-sm">
              [ CLASSIFIED // FILL DATA ]
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-red-800 border-b border-black/20 pb-2">
                {t('detectiveMystery.createForm.section1Title')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 block mb-1">{t('detectiveMystery.createForm.recipientLabel')}</label>
                  <input type="text" required value={recipient} onChange={e => setRecipient(e.target.value)} placeholder={t('detectiveMystery.createForm.recipientPlaceholder')} className="w-full bg-transparent border-b border-black/50 py-2 text-sm text-black placeholder:text-black/30 font-mono focus:outline-none" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 block mb-1">{t('detectiveMystery.createForm.ageLabel')}</label>
                  <input type="text" required value={age} onChange={e => setAge(e.target.value)} placeholder={t('detectiveMystery.createForm.agePlaceholder')} className="w-full bg-transparent border-b border-black/50 py-2 text-sm text-black placeholder:text-black/30 font-mono focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 block mb-1">{t('detectiveMystery.createForm.senderLabel')}</label>
                <input type="text" required value={sender} onChange={e => setSender(e.target.value)} placeholder={t('detectiveMystery.createForm.senderPlaceholder')} className="w-full bg-transparent border-b border-black/50 py-2 text-sm text-black placeholder:text-black/30 font-mono focus:outline-none" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-red-800 border-b border-black/20 pb-2">
                {t('detectiveMystery.createForm.section2Title')}
              </h3>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 block mb-1">{t('detectiveMystery.createForm.aliasLabel')}</label>
                <input type="text" required value={suspectProfile.alias} onChange={e => setSuspectProfile(p => ({...p, alias: e.target.value}))} placeholder={t('detectiveMystery.createForm.aliasPlaceholder')} className="w-full bg-transparent border-b border-black/50 py-2 text-sm text-black placeholder:text-black/30 font-mono focus:outline-none" />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 block mb-1">{t('detectiveMystery.createForm.mainCrimeLabel')}</label>
                <input type="text" required value={suspectProfile.mainCrime} onChange={e => setSuspectProfile(p => ({...p, mainCrime: e.target.value}))} placeholder={t('detectiveMystery.createForm.mainCrimePlaceholder')} className="w-full bg-transparent border-b border-black/50 py-2 text-sm text-black placeholder:text-black/30 font-mono focus:outline-none" />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 block mb-1">{t('detectiveMystery.createForm.distinguishingMarkLabel')}</label>
                <input type="text" required value={suspectProfile.distinguishingMark} onChange={e => setSuspectProfile(p => ({...p, distinguishingMark: e.target.value}))} placeholder={t('detectiveMystery.createForm.distinguishingMarkPlaceholder')} className="w-full bg-transparent border-b border-black/50 py-2 text-sm text-black placeholder:text-black/30 font-mono focus:outline-none" />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 block mb-1">{t('detectiveMystery.createForm.lastSeenLabel')}</label>
                <input type="text" required value={suspectProfile.lastSeen} onChange={e => setSuspectProfile(p => ({...p, lastSeen: e.target.value}))} placeholder={t('detectiveMystery.createForm.lastSeenPlaceholder')} className="w-full bg-transparent border-b border-black/50 py-2 text-sm text-black placeholder:text-black/30 font-mono focus:outline-none" />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 block mb-1">{t('detectiveMystery.createForm.specialSkillLabel')}</label>
                <input type="text" required value={suspectProfile.specialSkill} onChange={e => setSuspectProfile(p => ({...p, specialSkill: e.target.value}))} placeholder={t('detectiveMystery.createForm.specialSkillPlaceholder')} className="w-full bg-transparent border-b border-black/50 py-2 text-sm text-black placeholder:text-black/30 font-mono focus:outline-none" />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-red-700 block mb-1 font-bold">{t('detectiveMystery.createForm.secretPasswordLabel')}</label>
                <input type="text" required value={secretPassword} onChange={e => setSecretPassword(e.target.value)} placeholder={t('detectiveMystery.createForm.secretPasswordPlaceholder')} className="w-full bg-black/10 border-b border-black/50 py-2 text-sm text-black placeholder:text-black/30 font-mono focus:outline-none px-2 rounded" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-black/20 pb-2">
                <h3 className="text-xs font-black uppercase tracking-widest text-red-800">
                  {t('detectiveMystery.createForm.section3Title')}
                </h3>
                {lieDetectorQuestions.length < 10 && (
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="text-[10px] bg-black/10 hover:bg-black/20 text-black px-2.5 py-1 rounded font-bold uppercase transition cursor-pointer"
                  >
                    {t('detectiveMystery.createForm.addQuestion')}
                  </button>
                )}
              </div>

              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
                {lieDetectorQuestions.map((q, qIdx) => (
                  <div key={qIdx} className="bg-white/60 p-3 rounded-xl border border-black/20 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] uppercase font-bold text-red-700">{t('detectiveMystery.createForm.questionNumber', { number: qIdx + 1 })}</span>
                      {lieDetectorQuestions.length > 1 && (
                        <button type="button" onClick={() => handleRemoveQuestion(qIdx)} className="text-[10px] text-red-600 font-bold uppercase cursor-pointer">
                          {t('detectiveMystery.createForm.removeQuestion')}
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
                      placeholder={t('detectiveMystery.createForm.questionTextPlaceholder')}
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
                          placeholder={t('detectiveMystery.createForm.optionPlaceholder', { letter: optionLetter(optIdx) })}
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
                      <option value={0}>{t('detectiveMystery.createForm.correctOption', { letter: optionLetter(0) })}</option>
                      <option value={1}>{t('detectiveMystery.createForm.correctOption', { letter: optionLetter(1) })}</option>
                      <option value={2}>{t('detectiveMystery.createForm.correctOption', { letter: optionLetter(2) })}</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-red-800 border-b border-black/20 pb-2">
                {t('detectiveMystery.createForm.section5Title')}
              </h3>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-black/60 block mb-1">{t('detectiveMystery.createForm.redactedWishLabel')}</label>
                <textarea rows={3} required value={redactedWish} onChange={e => setRedactedWish(e.target.value)} placeholder={t('detectiveMystery.createForm.redactedWishPlaceholder')} className="w-full bg-transparent border-b border-black/50 py-2 text-sm text-black placeholder:text-black/30 font-mono focus:outline-none resize-none" />
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-red-700 block">
                  {t('detectiveMystery.createForm.evidencePairsLabel')}
                </label>
                <p className="text-[10px] text-black/70 italic">
                  {t('detectiveMystery.createForm.evidencePairsHint')}
                </p>

                <div className="space-y-3 pt-1">
                  {evidenceItems.map((item, i) => (
                    <div key={i} className="bg-white/70 border border-black/30 p-3 rounded-xl space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-bold uppercase text-red-800">
                        <span>{t('detectiveMystery.createForm.evidenceItemLabel', { number: i + 1 })}</span>
                        {item.fileUrl ? <span className="text-green-700">{t('detectiveMystery.createForm.photoUploaded')}</span> : <span className="text-neutral-500">{t('detectiveMystery.createForm.photoAwaiting')}</span>}
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
                        <label className="text-[10px] font-black uppercase text-black/70 block mb-1">{t('detectiveMystery.createForm.clueLabel')}</label>
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
                          <option value="" disabled>{t('detectiveMystery.createForm.clueTemplateDefault')}</option>
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
                          placeholder={t('detectiveMystery.createForm.cluePlaceholder', { number: i + 1 })}
                          className="w-full bg-transparent border-b border-black/40 py-1 text-xs text-black font-mono focus:outline-none mb-3"
                        />

                        <label className="text-[10px] font-black uppercase text-black/70 block mb-1">{t('detectiveMystery.createForm.answerLabel')}</label>
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
                          <option value="" disabled>{t('detectiveMystery.createForm.answerTemplateDefault')}</option>
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
                          placeholder={t('detectiveMystery.createForm.answerPlaceholder', { number: i + 1 })}
                          className="w-full bg-transparent border-b border-black/40 py-1 text-xs text-black font-mono focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-red-700 hover:bg-red-800 text-white py-4 rounded-xl text-xs uppercase tracking-[0.25em] font-black shadow-lg transition cursor-pointer">
              {t('detectiveMystery.createForm.submitButton')}
            </button>
          </form>
        ) : (
          <div className="bg-[#E3D5C8] text-[#2C241D] p-8 rounded-2xl shadow-2xl border border-[#b8a690] text-center space-y-4">
            <h2 className="text-xl font-black uppercase tracking-wider">{t('detectiveMystery.createForm.successTitle')}</h2>
            <div className="bg-black/10 p-3 rounded-xl select-all text-xs text-red-800 font-bold border border-black/20">{createdLink}</div>
            <a href={createdLink} target="_blank" rel="noreferrer" className="inline-block bg-red-700 hover:bg-red-800 text-white px-6 py-4 rounded-xl text-xs uppercase tracking-[0.25em] font-black shadow-lg transition">{t('detectiveMystery.createForm.openLink')}</a>
          </div>
        )}
      </div>
    </main>
  );
}
