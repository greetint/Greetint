'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { SealStage } from '@/components/experiences/birthday/basic/SealStage';
import { ScratchStage } from '@/components/experiences/birthday/basic/ScratchStage';
import { MemoryWallStage } from '@/components/experiences/birthday/basic/MemoryWallStage';
import { QuizStage } from '@/components/experiences/birthday/basic/QuizStage';
import { CakeStage } from '@/components/experiences/birthday/basic/CakeStage';
import { CapsuleStage } from '@/components/experiences/birthday/basic/CapsuleStage';
import { TimeCapsulePdf } from '@/components/experiences/birthday/basic/TimeCapsulePdf'; 
import { DetectiveMysteryExperience } from '@/components/experiences/birthday/detective-mystery/DetectiveMysteryExperience';

type QuestStage = 'seal' | 'scratch' | 'quiz' | 'memories' | 'cake' | 'capsule';

export default function CardPage() {
  const params = useParams();
  const [currentStage, setCurrentStage] = useState<QuestStage>('seal');
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const rawId = params?.id ? String(params.id) : 'виктория';
  const decodedName = decodeURIComponent(rawId);
  
  // Динамични данни от подателя
  const [cardData, setCardData] = useState({
    sender: 'Подаряващия',
    statusText: 'Посрещаме 2026 с нови мечти!',
    secretJoke: 'Скрито послание...',
    mainWish: 'Нека тази година ти донесе здраве и вдъхновение!',
    wishFromCandle: '',
    photos: [] as string[]
  });
  const [questData, setQuestData] = useState<any>(null);

  const recipientName = questData?.recipient || decodedName;
  const formattedName = recipientName.charAt(0).toUpperCase() + recipientName.slice(1);
  const uppercaseName = formattedName.toUpperCase();
  const occasion = questData?.occasion || 'birthday';
  const styleId = questData?.styleId || 'basic';

  // Зареждане на реалните данни, записани от подателя в localStorage
  useEffect(() => {
    if (rawId) {
      const possibleKeys = [
        `quest_${rawId}`,
        `quest_${decodeURIComponent(rawId).toLowerCase()}`
      ];
      let savedQuest = null;
      for (const key of possibleKeys) {
        savedQuest = localStorage.getItem(key);
        if (savedQuest) break;
      }

      if (savedQuest) {
        try {
          const parsed = JSON.parse(savedQuest);
          setQuestData(parsed);
          setCardData(prev => ({
            ...prev,
            sender: parsed.sender || 'Подаряващия',
            statusText: parsed.statusText || prev.statusText,
            secretJoke: parsed.secretMessages?.[0] || prev.secretJoke,
            mainWish: parsed.candleWish || prev.mainWish,
            photos: parsed.photos?.map((p: any) => p.fileUrl) || []
          }));
        } catch (e) {
          console.error("Грешка при зареждане на данните за куеста:", e);
        }
      }
    }
  }, [rawId]);

  // Състояние за съхранение на отговорите от дневника/капсулата
  const [capsuleAnswers, setCapsuleAnswers] = useState<{ question: string; answer: string }[]>([]);

  // Управление на фоновата музика с непрекъснат loop
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.35;
      audio.loop = true;
      
      const playAudio = () => {
        if (!isMuted) {
          audio.play().catch(() => {});
        }
      };

      playAudio();
      window.addEventListener('click', playAudio, { once: true });
      return () => window.removeEventListener('click', playAudio);
    }
  }, [isMuted]);

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    if (audioRef.current) {
      audioRef.current.muted = newMutedState;
      if (newMutedState) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const handleGeneratePdf = async (answers: { question: string; answer: string }[]) => {
    setCapsuleAnswers(answers);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  if (styleId === 'detective-mystery') {
    return <DetectiveMysteryExperience data={questData || { recipient: decodedName, age: '30', sender: 'Инспектор', charges: [], secretClue: '', secretAnswer: '', redactedWish: '', photos: [] }} />;
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#ECE8E0] select-none">
      
      {/* ФОНОВ АУДИО ПЛЕЙЪР С LOOP */}
      <audio ref={audioRef} src="/audio/background-music.mp3" preload="auto" loop />

      {/* МИНИМАЛИСТИЧНА КРЪГЛА ИКОНКА ЗА МУЗИКА */}
      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/40 backdrop-blur-md text-[#1F1A17] rounded-full shadow-md hover:bg-white/70 transition flex items-center justify-center text-base"
        title={isMuted ? 'Включи музиката' : 'Спри музиката'}
      >
        <span>{isMuted ? '🔇' : '🔊'}</span>
      </button>

      {currentStage === 'seal' && (
        <SealStage
          recipient={formattedName}
          onComplete={() => setCurrentStage('scratch')}
        />
      )}

      {currentStage === 'scratch' && (
        <ScratchStage
          recipient={uppercaseName}
          scratchCards={questData?.secretMessages?.filter(Boolean).length > 0 ? questData.secretMessages.map((msg: string, idx: number) => ({ id: String(idx + 1), title: `Скрито послание #${idx + 1}`, secretText: msg })) : undefined}
          onComplete={() => setCurrentStage('quiz')}
        />
      )}

      {currentStage === 'quiz' && (
        <QuizStage
          recipient={uppercaseName}
          quizzes={questData?.quizList?.filter((q: any) => q.question).length > 0 ? questData.quizList.filter((q: any) => q.question).map((q: any, idx: number) => ({ id: String(idx + 1), question: q.question, options: [q.optionA, q.optionB, q.optionC].filter(Boolean), correctAnswer: q.correct === 'A' ? 0 : q.correct === 'B' ? 1 : 2 })) : undefined}
          onComplete={() => setCurrentStage('memories')}
        />
      )}

      {currentStage === 'memories' && (
        <MemoryWallStage
          recipient={uppercaseName}
          memories={questData?.photos?.length > 0 ? questData.photos.map((p: any, idx: number) => ({ id: String(idx + 1), url: p.fileUrl, type: 'image' as const, questionOrCaption: p.question || 'Спомен', correctAnswer: p.answer || 'отговор' })) : undefined}
          onComplete={() => {
            setCurrentStage('cake');
          }}
        />
      )}

      {currentStage === 'cake' && (
        <CakeStage
          recipient={uppercaseName}
          senderWish={questData?.candleWish || cardData.mainWish}
          onComplete={(wish) => {
            setCardData(prev => ({ ...prev, wishFromCandle: wish }));
            setCurrentStage('capsule');
          }}
        />
      )}

      {currentStage === 'capsule' && (
        <CapsuleStage
          customQuestions={questData?.capsuleQuestions?.filter(Boolean).length > 0 ? questData.capsuleQuestions.filter(Boolean) : undefined}
          onGeneratePdf={handleGeneratePdf}
        />
      )}

      {/* СКРИТ КОНТЕЙНЕР ЗА ПРИНТ / PDF ИЗГЛЕД */}
      <TimeCapsulePdf
        recipient={formattedName}
        sender={cardData.sender}
        statusText={cardData.statusText}
        mainWish={cardData.mainWish}
        wishFromCandle={cardData.wishFromCandle}
        secretJoke={cardData.secretJoke}
        capsuleAnswers={capsuleAnswers}
        photos={cardData.photos}
      />

    </main>
  );
}