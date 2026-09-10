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
    'Кой е псевдонимът на заподозрения?',
    'Какво е основното престъпление?',
    'Кой е отличителният белег?',
    'Къде е забележан за последно?',
    'Какво е специалното умение?'
  ];
  const defaultAnswers = [
    suspectProfile.alias || 'Шеф на купона',
    suspectProfile.mainCrime || 'Превишена скорост на празнуване',
    suspectProfile.distinguishingMark || 'Заразно добро настроение',
    suspectProfile.lastSeen || 'На дансинга в петък вечер',
    suspectProfile.specialSkill || 'Неоторизирано ядене на торта'
  ];

  const items = evidenceItems && evidenceItems.length > 0
    ? evidenceItems
    : defaultClues.map((clue, idx) => ({
        fileUrl: normalizedPhotos[idx] || `/images/cards/card-${(idx % 3) + 1}.png`,
        clue: evidenceClues[idx] || clue,
        answer: evidenceAnswers[idx] || defaultAnswers[idx] || 'Фактическа улика'
      }));

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
        <div className="space-y-6 relative z-10 my-auto py-4">
          <div className="text-center space-y-2 bg-[#e6dcc5] border-2 border-[#2b241d] p-6 shadow-inner relative">
            <div className="absolute -top-3 right-8 border-2 border-red-800 text-red-800 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest transform rotate-3">
              [ CONFIDENTIAL ]
            </div>
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#615446] block font-bold">
              OFFICIAL INVESTIGATION DOSSIER
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-mono uppercase tracking-widest text-[#1a1714]">
              BIRTHDAY INVESTIGATION CASE FILE
            </h2>
            <p className="text-xs font-mono italic text-[#54483a]">
              Случаят е заведен във връзка с навършване на {age} години федерален празник.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#FAF6EE] border-2 border-[#2b241d] p-4 shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#615446] block font-bold mb-1">
                [ SUBJECT // ИМЕ НА СУБЕКТА ]
              </span>
              <div className="text-xl font-mono font-black uppercase text-[#1a1714]">
                {recipient}
              </div>
            </div>

            <div className="bg-[#FAF6EE] border-2 border-[#2b241d] p-4 shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#615446] block font-bold mb-1">
                [ ALIAS // КОДОВО ИМЕ ]
              </span>
              <div className="text-xl font-mono font-black uppercase text-[#1a1714]">
                {suspectProfile.alias || 'Шеф на купона'}
              </div>
            </div>

            <div className="bg-[#FAF6EE] border-2 border-[#2b241d] p-4 shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#615446] block font-bold mb-1">
                [ DATE OPENED // ДАТА НА ОТКРИВАНЕ ]
              </span>
              <div className="text-lg font-mono font-bold text-[#1a1714]">
                2026.03.09 ({age} години)
              </div>
            </div>

            <div className="bg-[#FAF6EE] border-2 border-[#2b241d] p-4 shadow-sm">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#615446] block font-bold mb-1">
                [ INVESTIGATION OFFICER // ИНСПЕКТОР ]
              </span>
              <div className="text-lg font-mono font-black uppercase text-[#1a1714]">
                {sender}
              </div>
            </div>
          </div>

          <div className="bg-[#FAF6EE] border-2 border-[#2b241d] p-5 flex items-center gap-6 shadow-sm">
            <div className="w-20 h-20 bg-[#2b241d] text-[#f4ecd8] rounded-xl flex items-center justify-center font-mono font-black text-3xl shadow-inner shrink-0 border border-amber-500/30">
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
            <div className="bg-red-950/5 border-l-4 border-red-700 p-4 font-mono text-xs text-[#2b241d]">
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

            <div className="grid grid-cols-3 gap-4">
              {items.slice(0, 3).map((item, idx) => {
                const photoSrc = item.fileUrl || normalizedPhotos[idx] || `/images/cards/card-${(idx % 3) + 1}.png`;
                const rotations = [-3, 2, -2];
                return (
                  <div 
                    key={idx}
                    className="bg-[#FAF6EE] p-3 pt-3 pb-4 shadow-md border-2 border-[#2b241d] flex flex-col items-center"
                    style={{ transform: `rotate(${rotations[idx % rotations.length]}deg)` }}
                  >
                    <div className="w-full h-[110px] bg-neutral-900 border border-[#2b241d]/40 overflow-hidden mb-2">
                      <img src={photoSrc} alt={`Evidence #${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center font-mono w-full">
                      <span className="text-[8px] font-bold uppercase tracking-widest text-red-800 block">ДОКАЗАТЕЛСТВО #{idx + 1}</span>
                      <p className="text-[10px] font-bold text-[#1a1714] truncate mt-0.5">"{item.answer}"</p>
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


