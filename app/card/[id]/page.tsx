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
import { KidsFairytaleExperience } from '@/components/experiences/birthday/kids-fairytale/KidsFairytaleExperience';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useReceiverLanguage } from '@/lib/i18n/useReceiverLanguage';

type QuestStage = 'seal' | 'scratch' | 'quiz' | 'memories' | 'cake' | 'capsule';

export default function CardPage() {
  const params = useParams();
  const rawId = params?.id ? String(params.id) : '';
  const decodedName = decodeURIComponent(rawId);
  const { t } = useLanguage();
  useReceiverLanguage();

  const [isLoading, setIsLoading] = useState(true);
  const [questData, setQuestData] = useState<any>(null);
  const [currentStage, setCurrentStage] = useState<QuestStage>('seal');
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Raw overrides from the saved quest; empty means "use the translated default" at render time.
  const [cardData, setCardData] = useState({
    sender: '',
    statusText: '',
    secretJoke: '',
    mainWish: '',
    wishFromCandle: '',
    photos: [] as string[]
  });

  const [capsuleAnswers, setCapsuleAnswers] = useState<{ question: string; answer: string }[]>([]);

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
            sender: parsed.sender || '',
            statusText: parsed.statusText || '',
            secretJoke: parsed.secretMessages?.[0] || '',
            mainWish: parsed.candleWish || '',
            photos: parsed.photos?.map((p: any) => p.fileUrl) || []
          }));
        } catch (e) {
          console.error(t('common.cardReceiver.questLoadError'), e);
        }
      }
    }
    setIsLoading(false);
  }, [rawId, t]);

  const sender = cardData.sender || t('common.cardReceiver.defaults.sender');
  const statusText = cardData.statusText || t('common.cardReceiver.defaults.statusText');
  const secretJoke = cardData.secretJoke || t('common.cardReceiver.defaults.secretJoke');
  const mainWish = cardData.mainWish || t('common.cardReceiver.defaults.mainWish');

  const recipientName = questData?.recipient || decodedName || t('common.cardReceiver.defaults.recipientFallback');
  const formattedName = recipientName ? recipientName.charAt(0).toUpperCase() + recipientName.slice(1) : t('common.cardReceiver.defaults.nameFallback');
  const uppercaseName = formattedName.toUpperCase();
  const occasion = questData?.occasion || 'birthday';
  const styleId = questData?.styleId || 'basic';

  useEffect(() => {
    if (styleId !== 'basic' || isLoading) return;
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.35;
      audio.loop = true;
      const playAudio = () => { if (!isMuted) audio.play().catch(() => {}); };
      playAudio();
      window.addEventListener('click', playAudio, { once: true });
      return () => window.removeEventListener('click', playAudio);
    }
  }, [isMuted, styleId, isLoading]);

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (audioRef.current) {
      audioRef.current.muted = newMutedState;
      if (newMutedState) audioRef.current.pause();
      else audioRef.current.play().catch(() => {});
    }
  };

  const handleGeneratePdf = async (answers: { question: string; answer: string }[]) => {
    setCapsuleAnswers(answers);
    setTimeout(() => window.print(), 300);
  };

  if (isLoading) {
    return (
      <main className="relative w-screen h-screen overflow-hidden bg-[#0b0b0b] flex items-center justify-center text-white font-mono select-none">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <div className="text-xs uppercase tracking-[0.25em] text-neutral-400">{t('common.cardReceiver.initializing')}</div>
        </div>
      </main>
    );
  }

  switch (styleId) {
    case 'kids-fairytale':
      return <KidsFairytaleExperience data={{
        childName: questData?.recipient || questData?.childName || decodedName || t('common.cardReceiver.defaults.kidsNameFallback'),
        childAge: questData?.age || questData?.childAge || 6,
        senderName: questData?.sender || questData?.senderName || t('common.cardReceiver.defaults.kidsSenderFallback'),
        personalMessage: questData?.personalMessage || questData?.redactedWish || t('common.cardReceiver.defaults.kidsMessageFallback'),
        favoriteAnimal: questData?.favoriteAnimal || t('common.cardReceiver.defaults.kidsAnimalFallback'),
      }} />;

    case 'detective-mystery':
      return <DetectiveMysteryExperience data={questData || { recipient: decodedName, age: '30', sender: t('common.cardReceiver.defaults.detectiveSender'), charges: [], secretClue: '', secretAnswer: '', redactedWish: '', photos: [] }} />;

    case 'basic':
    case 'original-signature':
    default:
      return (
        <main className="relative w-screen h-screen overflow-hidden bg-[#ECE8E0] select-none">
          <audio ref={audioRef} src="/audio/background-music.mp3" preload="auto" loop />
          <button
            onClick={toggleMute}
            className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/40 backdrop-blur-md text-[#1F1A17] rounded-full shadow-md hover:bg-white/70 transition flex items-center justify-center text-base cursor-pointer"
            title={isMuted ? t('common.cardReceiver.muteOn') : t('common.cardReceiver.muteOff')}
          >
            <span>{isMuted ? '🔇' : '🔊'}</span>
          </button>

          {currentStage === 'seal' && (
            <SealStage recipient={formattedName} onComplete={() => setCurrentStage('scratch')} />
          )}
          {currentStage === 'scratch' && (
            <ScratchStage recipient={uppercaseName} scratchCards={questData?.secretMessages?.filter(Boolean).length > 0 ? questData.secretMessages.map((msg: string, idx: number) => ({ id: String(idx + 1), title: t('common.cardReceiver.defaults.hiddenMessage', { n: idx + 1 }), secretText: msg })) : undefined} onComplete={() => setCurrentStage('quiz')} />
          )}
          {currentStage === 'quiz' && (
            <QuizStage recipient={uppercaseName} quizzes={questData?.quizList?.filter((q: any) => q.question).length > 0 ? questData.quizList.filter((q: any) => q.question).map((q: any, idx: number) => ({ id: String(idx + 1), question: q.question, options: [q.optionA, q.optionB, q.optionC].filter(Boolean), correctAnswer: q.correct === 'A' ? 0 : q.correct === 'B' ? 1 : 2 })) : undefined} onComplete={() => setCurrentStage('memories')} />
          )}
          {currentStage === 'memories' && (
            <MemoryWallStage recipient={uppercaseName} memories={questData?.photos?.length > 0 ? questData.photos.map((p: any, idx: number) => ({ id: String(idx + 1), url: p.fileUrl, type: 'image' as const, questionOrCaption: p.question || t('common.cardReceiver.defaults.memoryCaption'), correctAnswer: p.answer || t('common.cardReceiver.defaults.memoryAnswer') })) : undefined} onComplete={() => setCurrentStage('cake')} />
          )}
          {currentStage === 'cake' && (
            <CakeStage recipient={uppercaseName} senderWish={questData?.candleWish || mainWish} onComplete={(wish) => { setCardData(prev => ({ ...prev, wishFromCandle: wish })); setCurrentStage('capsule'); }} />
          )}
          {currentStage === 'capsule' && (
            <CapsuleStage customQuestions={questData?.capsuleQuestions?.filter(Boolean).length > 0 ? questData.capsuleQuestions.filter(Boolean) : undefined} onGeneratePdf={handleGeneratePdf} />
          )}

          <TimeCapsulePdf
            recipient={formattedName}
            sender={sender}
            statusText={statusText}
            mainWish={mainWish}
            wishFromCandle={cardData.wishFromCandle}
            secretJoke={secretJoke}
            capsuleAnswers={capsuleAnswers}
            photos={cardData.photos}
          />
        </main>
      );
  }
}
