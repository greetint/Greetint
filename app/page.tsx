'use client';

import React, { useState } from 'react';
import Logo from '@/components/Logo';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'giver' | 'receiver'>('receiver');
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#F7F4EF] text-[#1F1A17] font-sans overflow-x-hidden">

      {/* 1. HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#F7F4EF]/85 border-b border-[#958679]/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition">
            <Logo variant="horizontal" height={52} />
          </Link>

          <nav className="hidden md:flex gap-10 text-[11px] tracking-[0.25em] uppercase text-[#958679] font-medium">
            <a href="#concept" className="hover:text-[#1F1A17] transition duration-200">{t('common.landing.nav.concept')}</a>
            <a href="#process" className="hover:text-[#1F1A17] transition duration-200">{t('common.landing.nav.process')}</a>
          </nav>

          <Link
            href="/create"
            className="text-[11px] uppercase tracking-[0.2em] bg-[#1F1A17] text-[#F7F4EF] px-7 py-3.5 font-semibold hover:bg-[#958679] transition duration-300 shadow-md transform hover:-translate-y-0.5"
          >
            {t('common.landing.cta.createCapsule')}
          </Link>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="relative max-w-5xl mx-auto px-6 pt-16 pb-24 text-center flex flex-col items-center">
        <div className="relative mb-10 group cursor-pointer">
          <Logo variant="icon-only" height={150} />
        </div>

        <span className="inline-block text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-[#958679] mb-6 font-semibold px-6 py-2 border border-[#958679]/30 rounded-full bg-[#EFECE6]/80 shadow-inner">
          {t('common.landing.hero.badge')}
        </span>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif text-[#1F1A17] mb-8 uppercase leading-[1.12] tracking-tight max-w-4xl">
          {t('common.landing.hero.titleLine1')} <br />
          <span className="italic font-normal text-[#958679]">{t('common.landing.hero.titleLine2')}</span>
        </h1>

        <p className="max-w-2xl text-[#1F1A17]/80 text-base md:text-lg leading-relaxed mb-12 font-light">
          {t('common.landing.hero.description')}
        </p>

        <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
          <Link
            href="/create"
            className="bg-[#1F1A17] text-[#F7F4EF] hover:bg-[#958679] px-11 py-4.5 text-sm uppercase tracking-[0.25em] font-bold transition duration-300 shadow-xl text-center transform hover:-translate-y-1"
          >
            {t('common.landing.hero.ctaCreate')}
          </Link>
          <a
            href="#concept"
            className="border border-[#1F1A17]/30 text-[#1F1A17] hover:border-[#1F1A17] hover:bg-[#EFECE6] px-9 py-4.5 text-sm uppercase tracking-[0.25em] font-medium transition duration-300 text-center"
          >
            {t('common.landing.hero.ctaView')}
          </a>
        </div>
      </section>

      {/* 3. ТАБОВЕ ЗА ПРЕГЛЕД */}
      <section id="concept" className="max-w-5xl mx-auto px-6 py-20 border-t border-[#958679]/20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#958679] font-bold">{t('common.landing.tabs.sectionLabel')}</span>
          <h2 className="text-2xl md:text-4xl font-serif uppercase text-[#1F1A17] mt-2">
            {t('common.landing.tabs.sectionTitle')}
          </h2>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setActiveTab('receiver')}
              className={`px-6 py-3 text-xs uppercase tracking-[0.2em] font-bold transition duration-300 ${
                activeTab === 'receiver'
                  ? 'bg-[#1F1A17] text-[#F7F4EF]'
                  : 'bg-[#EFECE6] text-[#958679] hover:text-[#1F1A17]'
              }`}
            >
              {t('common.landing.tabs.receiver')}
            </button>
            <button
              onClick={() => setActiveTab('giver')}
              className={`px-6 py-3 text-xs uppercase tracking-[0.2em] font-bold transition duration-300 ${
                activeTab === 'giver'
                  ? 'bg-[#1F1A17] text-[#F7F4EF]'
                  : 'bg-[#EFECE6] text-[#958679] hover:text-[#1F1A17]'
              }`}
            >
              {t('common.landing.tabs.giver')}
            </button>
          </div>
        </div>

        <div className="bg-[#EFECE6] p-8 md:p-12 border border-[#958679]/20 max-w-3xl mx-auto shadow-sm">
          {activeTab === 'receiver' ? (
            <div className="space-y-4 text-center md:text-left">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#958679] font-bold block">{t('common.landing.tabs.receiverLabel')}</span>
              <h3 className="text-xl font-serif text-[#1F1A17]">{t('common.landing.tabs.receiverTitle')}</h3>
              <p className="text-xs md:text-sm text-[#1F1A17]/80 leading-relaxed">
                {t('common.landing.tabs.receiverText')}
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-center md:text-left">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#958679] font-bold block">{t('common.landing.tabs.giverLabel')}</span>
              <h3 className="text-xl font-serif text-[#1F1A17]">{t('common.landing.tabs.giverTitle')}</h3>
              <p className="text-xs md:text-sm text-[#1F1A17]/80 leading-relaxed">
                {t('common.landing.tabs.giverText')}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#958679]/20 py-10 px-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[#958679] text-[11px]">
        <Logo variant="horizontal" height={26} />
        <p>{t('common.landing.footer.rights')}</p>
      </footer>

    </div>
  );
}
