'use client';

import React, { useState, useEffect } from 'react';
import { KidsFairytaleExperience } from '@/components/experiences/birthday/kids-fairytale/KidsFairytaleExperience';

export default function KidsFairytaleSandboxPage() {
  const [fairytaleData, setFairytaleData] = useState({
    childName: 'Габи',
    childAge: 6,
    senderName: 'Мама и Тато',
    personalMessage: 'Ти правиш всеки наш ден изпълнен с усмивки и вълшебство. Никога не спирай да мечтаеш!',
    favoriteColor: '#FFB6C1',
    favoriteAnimal: 'единорог',
  });

  useEffect(() => {
    // Check if there is data in localStorage from the create form
    const params = new URLSearchParams(window.location.search);
    const cardId = params.get('id');
    if (cardId) {
      const saved = localStorage.getItem(`quest_${cardId}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setFairytaleData({
            childName: parsed.recipient || parsed.childName || 'Габи',
            childAge: parsed.age || parsed.childAge || 6,
            senderName: parsed.sender || parsed.senderName || 'Мама и Тато',
            personalMessage: parsed.personalMessage || parsed.redactedWish || 'Ти правиш света по-красив само защото си в него!',
            favoriteColor: parsed.favoriteColor || '#FFB6C1',
            favoriteAnimal: parsed.favoriteAnimal || 'единорог',
          });
        } catch {}
      }
    }
  }, []);

  return <KidsFairytaleExperience data={fairytaleData} />;
}
