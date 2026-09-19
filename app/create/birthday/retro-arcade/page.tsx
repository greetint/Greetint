'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function RetroArcadeCreatePage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-[#1A1A2E] text-white font-sans p-6 sm:p-12 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-[#16213E] p-8 rounded-3xl shadow-2xl border border-white/10 text-center space-y-6">
        <Link href="/create/birthday/select-style" className="inline-block text-xs uppercase tracking-widest text-white/60 hover:text-white transition">
          {t('common.lockedStyle.backLink')}
        </Link>
        <Logo variant="icon-only" height={80} />
        <h1 className="text-2xl font-serif font-bold text-white">Retro Arcade</h1>
        <p className="text-xs text-white/70 leading-relaxed">
          {t('common.lockedStyle.locked')} {t('common.lockedStyle.retro-arcade.description')}
        </p>
        <Link
          href="/create/birthday/select-style"
          className="block w-full bg-white text-[#1A1A2E] py-3.5 rounded-2xl text-xs uppercase tracking-[0.25em] font-bold hover:bg-white/90 transition shadow-md"
        >
          {t('common.lockedStyle.cta')}
        </Link>
      </div>
    </div>
  );
}
