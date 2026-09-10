'use client';

import React from 'react';

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
  recipient = 'Заподозрян',
  age = '30',
  sender = 'Инспектор',
  suspectProfile = {
    alias: 'Шеф на купона',
    mainCrime: 'Превишена скорост на празнуване',
    distinguishingMark: 'Заразно добро настроение',
    lastSeen: 'На дансинга в петък вечер',
    specialSkill: 'Неоторизирано ядене на торта'
  },
  redactedWish = 'Честит рожден ден! Бъди все така неуловим.',
  evidenceItems = [],
  evidenceClues = [],
  evidenceAnswers = [],
  photos = []
}: CaseFilePdfProps) {

  const normalizedPhotos: string[] = (photos || []).map(p => typeof p === 'string' ? p : p.fileUrl).filter(Boolean);
  
  const defaultClues = [
    '1. Най-голямото ти престъпление (изцепка) през годината?',
    '2. Кой приятел ти помогна най-много през последните 12 месеца?',
    '3. Най-ценният трофей / спомен, който отнасяш със себе си?',
    '4. Каква е голямата цел за следващата година на свобода?',
    '5. Коя държава/град подготвяш за следващия си голям обир?',
    '6. Какъв специален план имаш за следващия рожден ден?',
    '7. Какво е твоето лично послание към теб самия / инспекторите?'
  ];
  const defaultAnswers = [
    suspectProfile.mainCrime || 'Превишена скорост на празнуване',
    suspectProfile.distinguishingMark || 'Заразно добро настроение',
    suspectProfile.lastSeen || 'На дансинга в петък вечер',
    suspectProfile.specialSkill || 'Неоторизирано ядене на торта',
    'Пълно съдействие на купона',
    'Завладяване на нови дансинги',
    redactedWish
  ];

  const items = evidenceItems && evidenceItems.length > 0
    ? evidenceItems
    : defaultClues.map((clue, idx) => ({
        fileUrl: normalizedPhotos[idx] || `/images/cards/card-${(idx % 3) + 1}.png`,
        clue: evidenceClues[idx] || clue,
        answer: evidenceAnswers[idx] || defaultAnswers[idx] || 'Фактическа улика'
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
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#615446] block font-bold">СУБЕКТ (FULL NAME)</span>
                <div className="text-xl font-mono font-black uppercase text-[#1a1714]">{recipient.toUpperCase()}</div>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#615446] block font-bold">ВЪЗРАСТ (AGE)</span>
                <div className="text-xl font-mono font-black text-[#1a1714]">{age} ГОДИНИ</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="bg-[#FAF6EE] border border-[#2b241d]/40 p-2.5 rounded">
                <span className="text-[9px] text-[#615446] font-bold uppercase tracking-wider block">ПСЕВДОНИМ (ALIAS):</span>
                <span className="font-black text-red-900">{suspectProfile.alias || 'Шеф на купона'}</span>
              </div>
              <div className="bg-[#FAF6EE] border border-[#2b241d]/40 p-2.5 rounded">
                <span className="text-[9px] text-[#615446] font-bold uppercase tracking-wider block">ГЛАВНО ПРЕСТЪПЛЕНИЕ:</span>
                <span className="font-bold text-[#1a1714]">{suspectProfile.mainCrime || 'Превишена скорост на празнуване'}</span>
              </div>
              <div className="bg-[#FAF6EE] border border-[#2b241d]/40 p-2.5 rounded">
                <span className="text-[9px] text-[#615446] font-bold uppercase tracking-wider block">ОТЛИЧИТЕЛЕН БЕЛЕГ:</span>
                <span className="font-bold text-[#1a1714]">{suspectProfile.distinguishingMark || 'Заразно добро настроение'}</span>
              </div>
              <div className="bg-[#FAF6EE] border border-[#2b241d]/40 p-2.5 rounded">
                <span className="text-[9px] text-[#615446] font-bold uppercase tracking-wider block">ПОСЛЕДНО ЗАБЕЛЯЗАН:</span>
                <span className="font-bold text-[#1a1714]">{suspectProfile.lastSeen || 'На дансинга в петък вечер'}</span>
              </div>
            </div>

            <div className="bg-[#FAF6EE] border border-[#2b241d]/40 p-2.5 rounded font-mono text-xs">
              <span className="text-[9px] text-[#615446] font-bold uppercase tracking-wider block">СПЕЦИАЛНО УМЕНИЕ:</span>
              <span className="font-black text-[#1a1714]">{suspectProfile.specialSkill || 'Неоторизирано ядене на торта'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 font-mono text-xs">
            <div className="bg-[#FAF6EE] border-2 border-[#2b241d] p-3 shadow-sm">
              <span className="text-[9px] text-[#615446] font-bold uppercase tracking-widest block">ИНСПЕКТОР НА ДЕЛОТО:</span>
              <div className="font-black uppercase text-[#1a1714] text-sm mt-0.5">{sender}</div>
            </div>
            <div className="bg-[#FAF6EE] border-2 border-[#2b241d] p-3 shadow-sm">
              <span className="text-[9px] text-[#615446] font-bold uppercase tracking-widest block">ДАТА НА ОТКРИВАНЕ:</span>
              <div className="font-bold uppercase text-[#1a1714] text-sm mt-0.5">2026.03.09</div>
            </div>
          </div>

          <div className="bg-[#FAF6EE] border-2 border-[#2b241d] p-4 flex items-center gap-4 shadow-sm">
            <div className="w-16 h-16 bg-[#2b241d] text-amber-300 rounded-lg flex items-center justify-center font-mono font-black text-2xl shadow-inner shrink-0 border border-amber-500/40">
              <span>🫲</span>
            </div>
            <div className="space-y-1 font-mono text-xs">
              <div className="font-bold uppercase tracking-wider text-red-800">[ БИОМЕТРИЧЕН ПРЕДУПРЕДИТЕЛЕН ЗНАК ]</div>
              <p className="text-[#3b3026] leading-relaxed">
                Субектът демонстрира изключително високо ниво на харизма, неоторизирано ядене на торта и неизбежно добро настроение. Всякакви опити за изолация са неуспешни.
              </p>
            </div>
          </div>

          {redactedWish && (
            <div className="bg-red-950/5 border-l-4 border-red-700 p-3.5 font-mono text-xs text-[#2b241d]">
              <span className="font-bold uppercase tracking-wider text-red-800 block mb-1">СЕКРЕТНО ПОСЛАНИЕ НА ИНСПЕКТОРА:</span>
              <p className="italic font-serif text-sm">"{redactedWish}"</p>
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
              <span>📋 ОФИЦИАЛЕН ПРОТОКОЛ НА УЛИКИТЕ И ОТГОВОРИТЕ</span>
              <span>СУБЕКТ: {recipient.toUpperCase()}</span>
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
              📸 ПОЛАРОИДНИ РАЗСЕКРЕТЕНИ ДОКАЗАТЕЛСТВА (POLICE PHOTO EVIDENCE)
            </span>

            <div className="grid grid-cols-3 gap-3">
              {photoSources.slice(0, 3).map((photoUrl, idx) => {
                const rotations = [-2, 3, -1];
                const itemMatch = items[idx];
                const caption = itemMatch?.answer || `Доказателство #${idx + 1}`;
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
                      <span className="text-[8px] font-bold uppercase tracking-widest text-red-800 block">ФОТО ДОКАЗАТЕЛСТВО #{idx + 1}</span>
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


