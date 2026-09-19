'use client';

import React, { useEffect, useState } from 'react';
import { MagicV2Experience, MagicV2Data } from '@/components/magic-v2/MagicV2Experience';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useReceiverLanguage } from '@/lib/i18n/useReceiverLanguage';

interface UrlOverrides {
  name: string | null;
  age: string | null;
  sender: string | null;
  message: string | null;
}

export default function MagicV2Page() {
  useReceiverLanguage();
  const { t } = useLanguage();
  const [overrides, setOverrides] = useState<UrlOverrides>({ name: null, age: null, sender: null, message: null });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setOverrides({
      name: params.get('name'),
      age: params.get('age'),
      sender: params.get('sender'),
      message: params.get('message'),
    });
  }, []);

  const data: MagicV2Data = {
    childName: overrides.name || t('magicV2.page.defaults.childName'),
    childAge: overrides.age || 7,
    senderName: overrides.sender || t('magicV2.page.defaults.senderName'),
    personalMessage: overrides.message || t('magicV2.page.defaults.personalMessage'),
  };

  return <MagicV2Experience data={data} />;
}
