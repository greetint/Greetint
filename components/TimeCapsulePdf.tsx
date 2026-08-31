'use client';

import React from 'react';

interface PdfProps {
  recipient?: string;
  sender?: string;
  statusText?: string; 
  mainWish?: string;
  wishFromCandle?: string;
  secretJoke?: string;
  capsuleAnswers?: { question: string; answer: string }[];
  photos?: string[];
}

export function TimeCapsulePdf({
  recipient = 'Получател',
  sender = 'Подател',
  statusText = '',
  mainWish = '',
  wishFromCandle = '',
  secretJoke = '',
  capsuleAnswers = [],
  photos = []
}: PdfProps) {
  const isImage = (url: string) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.startsWith('data:image/');
  };

  const displayPhotos = (photos || []).filter(isImage).slice(0, 4);

  return (
    <div id="pdf-print-area" className="hidden print:block fixed inset-0 bg-[#FDFBF7] p-8 z-[9999] text-[#1F1A17] overflow-y-auto">
      {/* Зареждаме Google Fonts с пълна поддръжка на Кирилица */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Montserrat:ital,wght@0,400;0,600;1,400&display=swap');

        @media print {
          body * {
            visibility: hidden !important;
          }
          #pdf-print-area, #pdf-print-area * {
            visibility: visible !important;
          }
          #pdf-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            background-color: #FDFBF7 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: A4;
            margin: 15mm;
          }
        }
      `}</style>

      {/* ГОРЕН КАПАК СЪС ЗЛАТЕН ПЕЧАТ */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-full h-16 bg-[#EAE2D6] border-b-2 border-[#D4AF37] relative flex items-center justify-center rounded-t-lg">
          <img src="/images/gold-seal.png" alt="Seal" className="w-14 h-14 absolute -bottom-6 drop-shadow-md z-10" />
        </div>
      </div>

      {/* ЗАГЛАВИЕ */}
      <div className="text-center mt-6 mb-8">
        <h1 style={{ fontFamily: "'Caveat', cursive" }} className="text-4xl font-bold text-[#3A322D]">
          Честит рожден ден, {recipient}!
        </h1>
        <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[10px] uppercase tracking-[0.3em] text-[#958679] mt-1">
          Капсула на времето // GREETING ARCHIVE
        </p>
      </div>

      {/* ДВУКОЛОНЕН ДИЗАЙН (Снимки отляво, Текст отдясно) */}
      <div className="grid grid-cols-12 gap-8 items-start">
        
        {/* ЛЯВА КОЛОНА: КИНОЛЕНТИ СЪС СНИМКИ */}
        <div className="col-span-5 flex flex-col gap-6">
          {displayPhotos.map((url, i) => (
            <div 
              key={i} 
              className="bg-[#141210] p-2 rounded shadow-md border border-[#2A2421]"
              style={{ transform: `rotate(${i % 2 === 0 ? '-3deg' : '3deg'})` }}
            >
              {/* Горна перфорация */}
              <div className="flex justify-between items-center mb-1.5 px-1 opacity-90">
                {[...Array(6)].map((_, idx) => (
                  <div key={idx} className="w-2 h-1.5 bg-[#FEFEFD] rounded-[1px]" />
                ))}
              </div>
              
              <img src={url} alt="Memory" className="w-full h-32 object-cover border border-white/10 rounded-sm" />

              {/* Долна перфорация */}
              <div className="flex justify-between items-center mt-1.5 px-1 opacity-90">
                {[...Array(6)].map((_, idx) => (
                  <div key={idx} className="w-2 h-1.5 bg-[#FEFEFD] rounded-[1px]" />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ДЯСНА КОЛОНА: ПОСЛАНИЯ И ТЕКСТОВЕ */}
        <div className="col-span-7 space-y-5">
          {statusText && (
            <div className="space-y-1">
              <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[9px] uppercase tracking-widest text-[#958679] font-bold block border-b border-[#DBCEB3] pb-1">
                Начало
              </span>
              <p style={{ fontFamily: "'Caveat', cursive" }} className="text-xl text-[#1F1A17] leading-tight">
                {statusText}
              </p>
            </div>
          )}

          {mainWish && (
            <div className="space-y-1">
              <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[9px] uppercase tracking-widest text-[#958679] font-bold block border-b border-[#DBCEB3] pb-1">
                Послание от подаряващия
              </span>
              <p style={{ fontFamily: "'Caveat', cursive" }} className="text-xl text-[#1F1A17] leading-tight">
                {mainWish}
              </p>
            </div>
          )}

          {wishFromCandle && (
            <div className="space-y-1">
              <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[9px] uppercase tracking-widest text-[#958679] font-bold block border-b border-[#DBCEB3] pb-1">
                Намисленото желание
              </span>
              <p style={{ fontFamily: "'Caveat', cursive" }} className="text-xl text-[#1F1A17] leading-tight">
                "{wishFromCandle}"
              </p>
            </div>
          )}

          {secretJoke && (
            <div className="space-y-1">
              <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[9px] uppercase tracking-widest text-[#958679] font-bold block border-b border-[#DBCEB3] pb-1">
                Скреч Тайната
              </span>
              <p style={{ fontFamily: "'Caveat', cursive" }} className="text-xl text-[#1F1A17] leading-tight">
                {secretJoke}
              </p>
            </div>
          )}

          {capsuleAnswers.length > 0 && (
            <div className="space-y-3 pt-1">
              <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[9px] uppercase tracking-widest text-[#958679] font-bold block border-b border-[#DBCEB3] pb-1">
                Дневник на бъдещето
              </span>
              {capsuleAnswers.map((item, idx) => (
                <div key={idx} className="space-y-0.5">
                  <p style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[10px] italic text-[#635E57]">
                    {item.question}
                  </p>
                  <p style={{ fontFamily: "'Caveat', cursive" }} className="text-lg text-[#1F1A17] font-bold leading-tight">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="pt-6 text-right">
            <p style={{ fontFamily: "'Caveat', cursive" }} className="text-2xl text-[#1F1A17]">
              С любов,<br />{sender}
            </p>
          </div>
        </div>

      </div>

      {/* КОПИРАЙТ */}
      <div style={{ fontFamily: "'Montserrat', sans-serif" }} className="mt-12 text-center text-[8px] uppercase tracking-[0.3em] text-[#958679] border-t border-[#DBCEB3] pt-4">
        GREETING ARCHIVE © 2026
      </div>
    </div>
  );
}

export default TimeCapsulePdf;