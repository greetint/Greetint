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
  sender = 'Подаряващия',
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

  // Взимаме реалните снимки от Memory Wall (до 5 броя)
  const displayPhotos = (photos || []).filter(isImage).slice(0, 5);

  return (
    <div id="pdf-print-area" className="hidden print:block fixed inset-0 z-[9999] overflow-y-auto bg-[#E5DCC9]">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Playfair+Display:ital,wght@0,600;1,400&display=swap');

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
            width: 297mm !important;
            min-height: 210mm !important;
            background-image: url('/images/assets/envelope_paper.jpeg') !important;
            background-size: cover !important;
            background-position: center !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: A4 landscape;
            margin: 0;
          }
        }
      `}</style>

      {/* ЛИСТ В ЛАНДШАФТЕН ФОРМАТ (ПЕЙЗАЖ НА 90 ГРАДУСА) - БЕЗ ВЪНШНА РАМКА */}
      <div 
        className="w-[297mm] min-h-[210mm] mx-auto p-12 relative flex flex-col justify-between"
        style={{
          backgroundImage: `url('/images/assets/envelope_paper.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        
        {/* ГОРНА ЧАСТ: Заглавие */}
        <div className="text-center pb-4 border-b border-[#C8B89D] relative">
          <h1 style={{ fontFamily: "'Caveat', cursive" }} className="text-4xl font-bold text-[#3A322D]">
            Капсула на времето за {recipient}
          </h1>
          <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-xs italic text-[#7A6C5E] mt-0.5">
            Създадено с любов и надежда, за да се отвори в бъдещето
          </p>
        </div>

        {/* СРЕДНА ЧАСТ: Двуколонен дизайн (Ляво: Снимки като киноленти, Дясно: Текстове) */}
        <div className="grid grid-cols-12 gap-8 my-6 items-start">
          
          {/* ЛЯВА КОЛОНА: СНИМКИ ОТ MEMORY WALL */}
          <div className="col-span-4 flex flex-col gap-4 items-center">
            {displayPhotos.length > 0 ? (
              displayPhotos.map((url, i) => (
                <div 
                  key={i} 
                  className="bg-[#141210] p-1.5 shadow-xl rounded-sm border border-[#2A2421] w-48"
                  style={{ transform: `rotate(${i % 2 === 0 ? '-3deg' : '3deg'})` }}
                >
                  <div className="flex justify-between px-1 mb-1">
                    {[...Array(5)].map((_, idx) => <div key={idx} className="w-1.5 h-1 bg-[#FEFEFD] rounded-[1px]" />)}
                  </div>
                  <img src={url} alt="Memory" className="w-full h-24 object-cover rounded-xs" />
                  <div className="flex justify-between px-1 mt-1">
                    {[...Array(5)].map((_, idx) => <div key={idx} className="w-1.5 h-1 bg-[#FEFEFD] rounded-[1px]" />)}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-[10px] italic text-[#8A7C6E] text-center pt-8">
                Няма качени спомени
              </p>
            )}
          </div>

          {/* ДЯСНА КОЛОНА: ПОСЛАНИЯ И ДНЕВНИК */}
          <div className="col-span-8 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {statusText && (
                <div>
                  <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[9px] uppercase tracking-widest text-[#958679] font-bold block border-b border-[#C8B89D] pb-0.5">Начало</span>
                  <p style={{ fontFamily: "'Caveat', cursive" }} className="text-xl text-[#1F1A17] leading-snug">{statusText}</p>
                </div>
              )}

              {mainWish && (
                <div>
                  <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[9px] uppercase tracking-widest text-[#958679] font-bold block border-b border-[#C8B89D] pb-0.5">Послание</span>
                  <p style={{ fontFamily: "'Caveat', cursive" }} className="text-xl text-[#1F1A17] leading-snug">{mainWish}</p>
                </div>
              )}

              {wishFromCandle && (
                <div>
                  <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[9px] uppercase tracking-widest text-[#958679] font-bold block border-b border-[#C8B89D] pb-0.5">Намислено желание</span>
                  <p style={{ fontFamily: "'Caveat', cursive" }} className="text-xl text-[#1F1A17] leading-snug">"{wishFromCandle}"</p>
                </div>
              )}

              {secretJoke && (
                <div>
                  <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[9px] uppercase tracking-widest text-[#958679] font-bold block border-b border-[#C8B89D] pb-0.5">Скреч Тайна</span>
                  <p style={{ fontFamily: "'Caveat', cursive" }} className="text-xl text-[#1F1A17] leading-snug">{secretJoke}</p>
                </div>
              )}
            </div>

            {capsuleAnswers.length > 0 && (
              <div className="mt-4 pt-3 border-t border-[#C8B89D]/60 space-y-2">
                <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[10px] uppercase tracking-widest text-center text-[#8A7C6E]">
                  Поглед към бъдещето
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {capsuleAnswers.map((item, idx) => (
                    <div key={idx} className="bg-white/30 p-1.5 rounded border border-[#C8B89D]/40">
                      <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-[9px] italic text-[#635E57]">{item.question}</p>
                      <p style={{ fontFamily: "'Caveat', cursive" }} className="text-base text-[#1F1A17] font-bold">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ДОЛНА ЧАСТ: ПОДПИС И ЦЕНТРИРАН ПЕЧАТ */}
        <div className="flex justify-between items-center pt-4 border-t border-[#C8B89D] mt-auto">
          <div>
            <p style={{ fontFamily: "'Caveat', cursive" }} className="text-2xl text-[#1F1A17]">
              С любов, {sender}
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <img src="/images/gold-seal.png" alt="Gold Seal" className="w-14 h-14 object-contain drop-shadow-md mb-0.5" />
            <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[9px] italic text-[#7A6C5E] tracking-wider">
              Запечатано за спомен
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default TimeCapsulePdf;