'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { PDFDownloadLink } from '@react-pdf/renderer';

import { SealStage } from '@/components/quest/SealStage';
import { ScratchStage } from '@/components/quest/ScratchStage';
import { QuizStage, QuizItem } from '@/components/quest/QuizStage';
import { MemoryWallStage, MemoryPhotoItem } from '@/components/quest/MemoryWallStage';
import { CakeStage } from '@/components/quest/CakeStage';
import { CapsuleStage } from '@/components/quest/CapsuleStage';
import { TimeCapsulePdf } from '@/components/TimeCapsulePdf';

export default function CinematicQuestPage() {
  const [scene, setScene] = useState<number>(1);

  // Данни за рожденика
  const recipient = "Виктория";
  const sender = "Алекс";
  const statusText = "Човекът, който пие 3 кафета на ден и пак намира енергия за щури идеи.";
  const secretJoke = "Спомняш ли си, когато си изпусна телефона в басейна и викаше, че е водоустойчив?";
  const mainWish = "Скъпа Виктория, честит рожден ден! Пожелавам ти никога да не губиш тази луда енергия и винаги да превръщаш всеки ден в ново приключение...";

  // Данни за въпросите и снимките
  const [quizList] = useState<QuizItem[]>([
    {
      question: 'Ако закъснеем за полета, рожденикът първо...',
      optionA: 'Ще се кара с персонала',
      optionB: 'Ще си купи кафе и спокойно ще чака',
      optionC: 'Изпада в тотална паника',
      correct: 'B',
    },
    {
      question: 'Кое е любимото му/ѝ среднощно изкушение?',
      optionA: 'Пица с много кашкавал',
      optionB: 'Нещо сладичко',
      optionC: 'Чаша студена вода',
      correct: 'A',
    },
  ]);

  const [photos] = useState<MemoryPhotoItem[]>([
    { url: '/images/cards/card-1.png', question: 'Коя дата беше партито?', answer: '15', unlocked: false },
    { url: '/images/cards/card-2.png', question: 'Кой е любимият ни град?', answer: 'ПЛОВДИВ', unlocked: false },
  ]);

  // Запазени отговори от рожденика
  const [personalWish, setPersonalWish] = useState('');
  const [capsuleAnswers, setCapsuleAnswers] = useState<string[]>(Array(7).fill(''));
  const [showPdfModal, setShowPdfModal] = useState(false);

  return (
    <div
      className="relative w-screen h-screen overflow-hidden select-none font-serif text-[#1F1A17] flex items-center justify-center bg-[#F7F4EF]"
      style={{ backgroundImage: `url('/images/assets/bg-light-paper.jpeg')`, backgroundSize: 'cover' }}
    >
      <main className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 text-center">
        <AnimatePresence mode="wait">

          {/* СЦЕНА 1: UNBOXING С ЗЛАТЕН ПЕЧАТ */}
          {scene === 1 && (
            <SealStage 
              key="s1"
              recipient={recipient} 
              onComplete={() => setScene(2)} 
            />
          )}

          {/* СЦЕНА 2: СТАТУТ 2026 */}
          {scene === 2 && (
            <div key="s2" className="max-w-md w-full space-y-6 bg-[#FEFEFD] p-8 rounded-2xl border border-[#958679]/30 shadow-2xl mx-auto">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#958679] font-sans font-bold block">
                Профил за новата година
              </span>
              <h1 className="text-3xl font-serif uppercase text-[#1F1A17]">{recipient} // 2026</h1>
              <div className="border-y border-[#958679]/20 py-6">
                <p className="text-base text-[#635E57] italic leading-relaxed font-serif">
                  "{statusText}"
                </p>
              </div>
              <button
                onClick={() => setScene(3)}
                className="w-full bg-[#1F1A17] text-[#FEFEFD] py-4 text-xs uppercase tracking-[0.2em] font-bold rounded-xl shadow-xl hover:bg-[#958679] transition"
              >
                Към Златното Скрач Фолио →
              </button>
            </div>
          )}

          {/* СЦЕНА 3: ЗЛАТНО СКРАЧ ФОЛИО */}
          {scene === 3 && (
            <ScratchStage 
              key="s3"
              secretJoke={secretJoke} 
              onComplete={() => setScene(4)} 
            />
          )}

          {/* СЦЕНА 4: ШОУ-ВИКТОРИНА */}
          {scene === 4 && (
            <QuizStage 
              key="s4"
              quizList={quizList} 
              onComplete={() => setScene(5)} 
            />
          )}

          {/* СЦЕНА 5: POLAROID МЕМОРИ СТЕНА */}
          {scene === 5 && (
            <MemoryWallStage 
              key="s5"
              photos={photos} 
              onComplete={() => setScene(6)} 
            />
          )}

          {/* СЦЕНА 6: ТОРТА & ЛИЧНО ПИСМО */}
          {scene === 6 && (
            <CakeStage 
              key="s6"
              sender={sender}
              mainWish={mainWish}
              onWishSaved={(wish) => setPersonalWish(wish)}
              onNext={() => setScene(7)}
            />
          )}

          {/* СЦЕНА 7: КАПСУЛА ЗА БЪДЕЩЕТО */}
          {scene === 7 && (
            <CapsuleStage 
              key="s7"
              onGeneratePdf={(answers) => {
                setCapsuleAnswers(answers);
                setShowPdfModal(true);
              }}
            />
          )}

        </AnimatePresence>

        {/* МОДАЛ ЗА СВАЛЯНЕ НА PDF АРХИВА */}
        {showPdfModal && (
          <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-[#F7F4EF] w-full max-w-md p-6 rounded-2xl shadow-2xl border border-[#958679] text-center space-y-6">
              <h3 className="font-serif text-lg text-[#1F1A17] uppercase tracking-wide">
                Твоята Капсула е Запечатана! ✨
              </h3>
              <p className="text-xs text-[#635E57] font-sans">
                Официалният двустранен A4 документ с всички отключени спомени и отговори е готов.
              </p>

              <PDFDownloadLink
                document={
                  <TimeCapsulePdf
                    recipient={recipient}
                    sender={sender}
                    statusText={statusText}
                    secretJoke={secretJoke}
                    mainWish={mainWish}
                    wishFromCandle={personalWish}
                    capsuleAnswers={capsuleAnswers}
                    photos={photos.map((p) => p.url)}
                  />
                }
                fileName={`TimeCapsule_${recipient}_2026.pdf`}
                className="inline-block w-full bg-[#1F1A17] text-[#FEFEFD] py-4 text-xs uppercase tracking-[0.2em] font-bold rounded-xl shadow-xl hover:bg-[#958679] transition"
              >
                {/* @ts-ignore */}
                {({ loading }) => (loading ? 'Генериране на PDF...' : 'Свали Официалния PDF Архив 🖨️')}
              </PDFDownloadLink>

              <button
                onClick={() => setShowPdfModal(false)}
                className="text-xs uppercase font-bold text-[#958679] block mx-auto"
              >
                Затвори [X]
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}