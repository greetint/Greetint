'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageContext';

const RECEIVER_ROUTE_PREFIXES = ['/card', '/magic-v2', '/kids-fairytale'];

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();
  const pathname = usePathname();

  const isReceiverRoute = RECEIVER_ROUTE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname?.startsWith(`${prefix}/`)
  );
  if (isReceiverRoute) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex items-center bg-[#11100F]/95 backdrop-blur-md rounded-full p-1 shadow-xl border border-white/10">
      {(['bg', 'en'] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLang(option)}
          className={`px-3.5 py-2 rounded-full text-[11px] font-sans font-bold uppercase tracking-widest transition ${
            lang === option ? 'bg-[#FAF6EE] text-[#11100F]' : 'text-white/60 hover:text-white'
          }`}
          aria-pressed={lang === option}
        >
          {t(`common.switcher.${option}`)}
        </button>
      ))}
    </div>
  );
}
