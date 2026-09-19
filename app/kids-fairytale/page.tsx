'use client';

import React, { useState, useEffect } from 'react';
import { KidsFairytaleExperience } from '@/components/experiences/birthday/kids-fairytale/KidsFairytaleExperience';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useReceiverLanguage } from '@/lib/i18n/useReceiverLanguage';

interface SavedQuestData {
  recipient?: string;
  childName?: string;
  age?: number | string;
  childAge?: number | string;
  sender?: string;
  senderName?: string;
  personalMessage?: string;
  redactedWish?: string;
  favoriteColor?: string;
  favoriteAnimal?: string;
}

export default function KidsFairytaleSandboxPage() {
  useReceiverLanguage();
  const { t } = useLanguage();
  const [savedData, setSavedData] = useState<SavedQuestData | null>(null);

  useEffect(() => {
    // Check if there is data in localStorage from the create form
    const params = new URLSearchParams(window.location.search);
    const cardId = params.get('id');
    if (cardId) {
      const saved = localStorage.getItem(`quest_${cardId}`);
      if (saved) {
        try {
          setSavedData(JSON.parse(saved));
        } catch {}
      }
    }
  }, []);

  // Derived (not stored) so the default copy stays in sync if the language
  // changes after mount, e.g. once `useReceiverLanguage` reads `?lang=`.
  const fairytaleData = {
    childName: savedData?.recipient || savedData?.childName || t('kidsFairytale.sandboxPage.defaultChildName'),
    childAge: savedData?.age || savedData?.childAge || 6,
    senderName: savedData?.sender || savedData?.senderName || t('kidsFairytale.sandboxPage.defaultSenderName'),
    personalMessage:
      savedData?.personalMessage ||
      savedData?.redactedWish ||
      (savedData ? t('kidsFairytale.sandboxPage.defaultPersonalMessageFallback') : t('kidsFairytale.sandboxPage.defaultPersonalMessage')),
    favoriteColor: savedData?.favoriteColor || '#FFB6C1',
    favoriteAnimal: savedData?.favoriteAnimal || t('kidsFairytale.sandboxPage.defaultFavoriteAnimal'),
  };

  return <KidsFairytaleExperience data={fairytaleData} />;
}
