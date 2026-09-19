'use client';

import { useEffect } from 'react';
import { useLanguage } from './LanguageContext';

/**
 * Receiver-side routes (the shareable card/quest links) get their language
 * from the `?lang=` URL param set by the creator, not from the switcher.
 * Defaults to Bulgarian when the param is missing or unrecognized.
 */
export function useReceiverLanguage() {
  const { setLang } = useLanguage();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setLang(params.get('lang') === 'en' ? 'en' : 'bg');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
