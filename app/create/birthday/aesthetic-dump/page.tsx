'use client';

import React from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function AestheticDumpCreatePage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-[#F3E8FF] text-[#1F1A17] font-sans p-6 sm:p-12 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-[#958679]/20 text-center space-y-6">
        <Link href="/create/birthday/select-style" className="inline-block text-xs uppercase tracking-widest text-[#958679] hover:text-[#1F1A17] transition">
          {t('common.lockedStyle.backLink')}
        </Link>
        <Logo variant="icon-only" height={80} />
        <h1 className="text-2xl font-serif font-bold text-[#11100F]">Aesthetic Dump</h1>
        <p className="text-xs text-[#11100F]/70 leading-relaxed">
          {t('common.lockedStyle.locked')} {t('common.lockedStyle.aesthetic-dump.description')}
        </p>
        <Link
          href="/create/birthday/select-style"
          className="block w-full bg-[#11100F] text-[#FAF6EE] py-3.5 rounded-2xl text-xs uppercase tracking-[0.25em] font-bold hover:bg-[#958679] transition shadow-md"
        >
          {t('common.lockedStyle.cta')}
        </Link>
      </div>
    </div>
  );
}
