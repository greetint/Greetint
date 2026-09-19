'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface CaseFilePdfProps {
  recipient?: string;
  age?: string;
  sender?: string;
  suspectProfile?: {
    alias?: string;
    mainCrime?: string;
    distinguishingMark?: string;
    lastSeen?: string;
    specialSkill?: string;
  };
  redactedWish?: string;
  evidenceItems?: { fileUrl: string; clue: string; answer: string }[];
  evidenceClues?: string[];
  evidenceAnswers?: string[];
  photos?: { fileUrl: string }[] | string[];
}

export function CaseFilePDF({
  recipient,
  age = '30',
  sender,
  suspectProfile,
  redactedWish,
  evidenceItems = [],
  evidenceClues = [],
  evidenceAnswers = [],
  photos = []
}: CaseFilePdfProps) {
  const { t } = useLanguage();

  const resolvedRecipient = recipient || t('detectiveMystery.caseFilePDF.defaultRecipient');
  const resolvedSender = sender || t('detectiveMystery.caseFilePDF.defaultSender');
  const resolvedRedactedWish = redactedWish || t('detectiveMystery.caseFilePDF.defaultRedactedWish');
  const resolvedProfile = {
    alias: suspectProfile?.alias || t('detectiveMystery.caseFilePDF.defaultAlias'),
    mainCrime: suspectProfile?.mainCrime || t('detectiveMystery.caseFilePDF.defaultMainCrime'),
    distinguishingMark: suspectProfile?.distinguishingMark || t('detectiveMystery.caseFilePDF.defaultDistinguishingMark'),
    lastSeen: suspectProfile?.lastSeen || t('detectiveMystery.caseFilePDF.defaultLastSeen'),
    specialSkill: suspectProfile?.specialSkill || t('detectiveMystery.caseFilePDF.defaultSpecialSkill'),
  };

  const normalizedPhotos: string[] = (photos || []).map(p => typeof p === 'string' ? p : p.fileUrl).filter(Boolean);

  const defaultClues = [
    t('detectiveMystery.caseFilePDF.clue1'),
    t('detectiveMystery.caseFilePDF.clue2'),
    t('detectiveMystery.caseFilePDF.clue3'),
    t('detectiveMystery.caseFilePDF.clue4'),
    t('detectiveMystery.caseFilePDF.clue5'),
    t('detectiveMystery.caseFilePDF.clue6'),
    t('detectiveMystery.caseFilePDF.clue7'),
  ];
  const defaultAnswers = [
    resolvedProfile.mainCrime,
    resolvedProfile.distinguishingMark,
    resolvedProfile.lastSeen,
    resolvedProfile.specialSkill,
    t('detectiveMystery.caseFilePDF.extraAnswer1'),
    t('detectiveMystery.caseFilePDF.extraAnswer2'),
    resolvedRedactedWish
  ];

  const items = evidenceItems && evidenceItems.length > 0
    ? evidenceItems
    : defaultClues.map((clue, idx) => ({
        fileUrl: normalizedPhotos[idx] || `/images/cards/card-${(idx % 3) + 1}.png`,
        clue: evidenceClues[idx] || clue,
        answer: evidenceAnswers[idx] || defaultAnswers[idx] || t('detectiveMystery.caseFilePDF.defaultEvidenceFallback')
      }));

  const photoSources = normalizedPhotos.length > 0 
    ? normalizedPhotos 
    : items.map(i => i.fileUrl).filter(Boolean);

  return (
    <div id="detective-pdf-print-area" className="hidden print:block fixed inset-0 z-[9999] bg-[#f4ecd8] overflow-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,700;1,400&display=swap');

        @media print {
          body * { visibility: hidden !important; }
          #detective-pdf-print-area, #detective-pdf-print-area * { 
            visibility: visible !important; 
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          #detective-pdf-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            background-color: #f4ecd8 !important;
            overflow: visible !important;
          }
          .pdf-page {
            width: 210mm !important;
            height: 297mm !important;
            page-break-after: always !important;
            break-after: page !important;
            box-sizing: border-box !important;
            overflow: hidden !important;
            position: relative !important;
            background-color: #f4ecd8 !important;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}</style>

      {/* PAGE 1: COVER */}
      <div className="pdf-page w-[210mm] h-[297mm] bg-[#f4ecd8] text-[#1a1714] p-[15mm] flex flex-col justify-between relative box-border border-[3px] border-[#2b241d]">
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#1a1714_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="border-b-4 border-[#2b241d] pb-4 relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#615446] block font-bold">
                DEPARTMENT OF INVESTIGATIONS // FED. BUREAU
              </span>
              <h1 className="text-3xl font-black font-serif uppercase tracking-wider text-[#1a1714] mt-1">
                CASE FILE // EYES ONLY
              </h1>
            </div>
            <div className="border-4 border-red-700 text-red-700 px-4 py-1.5 font-black text-sm uppercase tracking-[0.3em] transform rotate-[-6deg] shadow-sm bg-[#f4ecd8]/90">
              [ TOP SECRET ]
            </div>
          </div>
          <div className="flex justify-between items-center text-xs font-mono uppercase tracking-widest text-[#4a3f33] mt-2 pt-2 border-t border-[#2b241d]/30">
            <span>CASE ID: #{age}026-FBI</span>
            <span>CLASSIFICATION: LEVEL-5 CONFIDENTIAL</span>
            <span>STATUS: ACTIVE INVESTIGATION</span>
          </div>
        </div>

        {/* Middle Content: Subject Data & Fingerprint */}
        <div className="space-y-4 relative z-10 my-auto py-2">
          {/* Main Subject Identification Box */}
          <div className="bg-[#e6dcc5] border-2 border-[#2b241d] p-5 shadow-inner relative space-y-3">
            <div className="absolute -top-3 right-8 border-2 border-red-800 text-red-800 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest transform rotate-3 bg-[#f4ecd8]">
              [ VERIFIED SUBJECT ]
            </div>
            <div className="border-b border-[#2b241d]/30 pb-2 flex justify-between items-center">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#615446] block font-bold">{t('detectiveMystery.caseFilePDF.subjectLabel')}</span>
                <div className="text-xl font-mono font-black uppercase text-[#1a1714]">{resolvedRecipient.toUpperCase()}</div>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#615446] block font-bold">{t('detectiveMystery.caseFilePDF.ageLabel')}</span>
                <div className="text-xl font-mono font-black text-[#1a1714]">{t('detectiveMystery.caseFilePDF.ageYears', { age })}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="bg-[#FAF6EE] border border-[#2b241d]/40 p-2.5 rounded">
                <span className="text-[9px] text-[#615446] font-bold uppercase tracking-wider block">{t('detectiveMystery.caseFilePDF.aliasLabel')}</span>
                <span className="font-black text-red-900">{resolvedProfile.alias}</span>
              </div>
              <div className="bg-[#FAF6EE] border border-[#2b241d]/40 p-2.5 rounded">
                <span className="text-[9px] text-[#615446] font-bold uppercase tracking-wider block">{t('detectiveMystery.caseFilePDF.mainCrimeLabel')}</span>
                <span className="font-bold text-[#1a1714]">{resolvedProfile.mainCrime}</span>
              </div>
              <div className="bg-[#FAF6EE] border border-[#2b241d]/40 p-2.5 rounded">
                <span className="text-[9px] text-[#615446] font-bold uppercase tracking-wider block">{t('detectiveMystery.caseFilePDF.distinguishingMarkLabel')}</span>
                <span className="font-bold text-[#1a1714]">{resolvedProfile.distinguishingMark}</span>
              </div>
              <div className="bg-[#FAF6EE] border border-[#2b241d]/40 p-2.5 rounded">
                <span className="text-[9px] text-[#615446] font-bold uppercase tracking-wider block">{t('detectiveMystery.caseFilePDF.lastSeenLabel')}</span>
                <span className="font-bold text-[#1a1714]">{resolvedProfile.lastSeen}</span>
              </div>
            </div>

            <div className="bg-[#FAF6EE] border border-[#2b241d]/40 p-2.5 rounded font-mono text-xs">
              <span className="text-[9px] text-[#615446] font-bold uppercase tracking-wider block">{t('detectiveMystery.caseFilePDF.specialSkillLabel')}</span>
              <span className="font-black text-[#1a1714]">{resolvedProfile.specialSkill}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 font-mono text-xs">
            <div className="bg-[#FAF6EE] border-2 border-[#2b241d] p-3 shadow-sm">
              <span className="text-[9px] text-[#615446] font-bold uppercase tracking-widest block">{t('detectiveMystery.caseFilePDF.inspectorLabel')}</span>
              <div className="font-black uppercase text-[#1a1714] text-sm mt-0.5">{resolvedSender}</div>
            </div>
            <div className="bg-[#FAF6EE] border-2 border-[#2b241d] p-3 shadow-sm">
              <span className="text-[9px] text-[#615446] font-bold uppercase tracking-widest block">{t('detectiveMystery.caseFilePDF.dateOpenedLabel')}</span>
              <div className="font-bold uppercase text-[#1a1714] text-sm mt-0.5">2026.03.09</div>
            </div>
          </div>

          <div className="bg-[#FAF6EE] border-2 border-[#2b241d] p-4 flex items-center gap-4 shadow-sm">
            <div className="w-16 h-16 bg-[#2b241d] text-amber-300 rounded-lg flex items-center justify-center font-mono font-black text-2xl shadow-inner shrink-0 border border-amber-500/40">
              <span>🫲</span>
            </div>
            <div className="space-y-1 font-mono text-xs">
              <div className="font-bold uppercase tracking-wider text-red-800">{t('detectiveMystery.caseFilePDF.biometricWarningTitle')}</div>
              <p className="text-[#3b3026] leading-relaxed">
                {t('detectiveMystery.caseFilePDF.biometricWarningText')}
              </p>
            </div>
          </div>

          {resolvedRedactedWish && (
            <div className="bg-red-950/5 border-l-4 border-red-700 p-3.5 font-mono text-xs text-[#2b241d]">
              <span className="font-bold uppercase tracking-wider text-red-800 block mb-1">{t('detectiveMystery.caseFilePDF.secretMessageLabel')}</span>
              <p className="italic font-serif text-sm">"{resolvedRedactedWish}"</p>
            </div>
          )}
        </div>

        {/* Footer Page 1 */}
        <div className="border-t-2 border-[#2b241d] pt-3 flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-[#615446]">
          <span>DEPARTMENT OF INVESTIGATIONS</span>
          <span>PAGE 1 OF 2 // CASE FILE #{age}</span>
          <span>CLASSIFIED EYES ONLY</span>
        </div>
      </div>

      {/* ================= PAGE 2: EVIDENCE LOG & POLAROID EVIDENCE GRID ================= */}
      <div className="pdf-page w-[210mm] h-[297mm] bg-[#f4ecd8] text-[#1a1714] p-[15mm] flex flex-col justify-between relative box-border border-[3px] border-[#2b241d]">
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#1a1714_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="border-b-4 border-[#2b241d] pb-3 relative z-10 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#615446] block font-bold">
              POLICE EVIDENCE LOG // STAGE 2 & 5
            </span>
            <h2 className="text-2xl font-black font-serif uppercase tracking-wider text-[#1a1714]">
              CRIME SCENE EVIDENCE & Q&A
            </h2>
          </div>
          <div className="border-4 border-red-700 text-red-700 px-3 py-1 font-black text-xs uppercase tracking-[0.25em] transform rotate-4 shadow-sm bg-[#f4ecd8]/90">
            [ CLASSIFIED ]
          </div>
        </div>

        <div className="space-y-4 relative z-10 my-auto py-2">
          <div className="bg-[#FAF6EE] border-2 border-[#2b241d] p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-mono font-black uppercase tracking-widest text-red-800 border-b border-[#2b241d]/30 pb-1.5 flex justify-between items-center">
              <span>{t('detectiveMystery.caseFilePDF.evidenceLogTitle')}</span>
              <span>{t('detectiveMystery.caseFilePDF.subjectBadge', { recipient: resolvedRecipient.toUpperCase() })}</span>
            </h3>

            <div className="space-y-2.5 max-h-[160px] overflow-hidden">
              {items.map((item, idx) => (
                <div key={idx} className="bg-[#f0e8d5] border border-[#2b241d]/30 p-2.5 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 font-mono text-xs">
                  <div className="font-bold text-[#2b241d] max-w-[65%]">
                    <span className="text-red-800 mr-1">#{idx + 1}</span> {item.clue}
                  </div>
                  <div className="bg-[#FAF6EE] px-3 py-1 rounded border border-[#2b241d]/40 font-black text-black shadow-inner">
                    {item.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#615446] block font-bold">
              {t('detectiveMystery.caseFilePDF.photoEvidenceLabel')}
            </span>

            <div className="grid grid-cols-3 gap-3">
              {photoSources.slice(0, 3).map((photoUrl, idx) => {
                const rotations = [-2, 3, -1];
                const itemMatch = items[idx];
                const caption = itemMatch?.answer || t('detectiveMystery.caseFilePDF.evidenceCaptionFallback', { number: idx + 1 });
                return (
                  <div
                    key={idx}
                    className="bg-[#FAF6EE] p-2.5 pt-2.5 pb-3 shadow-md border-2 border-[#2b241d] flex flex-col items-center"
                    style={{ transform: `rotate(${rotations[idx % rotations.length]}deg)` }}
                  >
                    <div className="w-full h-[105px] bg-neutral-900 border border-[#2b241d]/40 overflow-hidden mb-1.5">
                      <img src={photoUrl} alt={`Evidence photo #${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center font-mono w-full">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-red-800 block">{t('detectiveMystery.caseFilePDF.photoEvidenceBadge', { number: idx + 1 })}</span>
                      <p className="text-[9px] font-bold text-[#1a1714] truncate mt-0.5">"{caption}"</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t-2 border-[#2b241d] pt-3 flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-[#615446]">
          <span>GREETING ARCHIVE // DETECTIVE DIVISION</span>
          <span>PAGE 2 OF 2 // CASE FILE #{age}</span>
          <span>OFFICIAL FEDERAL RECORD</span>
        </div>
      </div>
    </div>
  );
}

export default CaseFilePDF;


