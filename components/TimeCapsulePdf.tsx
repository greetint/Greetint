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
  sender = 'Подателя',
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

  // Различни ъгли и позиции за разпръснат "кинематографски" ефект като от референцията ти
  const filmStyles = [
    { top: '18%', left: '4%', rotate: '-6deg', width: '160px' },
    { top: '48%', right: '6%', rotate: '4deg', width: '170px' },
    { top: '72%', left: '6%', rotate: '-4deg', width: '165px' },
  ];

  return (
    <div id="pdf-print-area" className="hidden print:block fixed inset-0 z-[9999] overflow-hidden bg-[#EAE2D6]">
      {/* Зареждане на автентични шрифтове с пълна кирилица */}
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
            width: 210mm !important;
            height: 297mm !important;
            background-color: #EAE2D6 !important;
            background-image: url('/images/pdf-background.jpg') !important;
            background-size: cover !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>

      {/* ФОНОВ ПЕРГАТЕМОВ СЛОЙ */}
      <div className="absolute inset-0 bg-[#F4EBE1] bg-cover bg-center opacity-95 p-12 flex flex-col justify-between">
        
        {/* ГОРНА ЧАСТ: Заглавие като на истинско писмо */}
        <div className="text-center pt-2 relative z-10">
          <h1 style={{ fontFamily: "'Caveat', cursive" }} className="text-5xl font-bold text-[#3A322D] tracking-wide">
            Капсула на времето
          </h1>
          <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-sm italic text-[#7A6C5E] mt-1">
            Създадено с любов и надежда, за да се отвори в бъдещето за {recipient}
          </p>
          <div className="w-16 h-[1px] bg-[#D4AF37] mx-auto mt-2" />
        </div>

        {/* ЦЕНТРАЛНА ЗОНА С ТЕКСТОВЕТЕ И РАЗПРЪСНАТИ ФИЛМОВИ ЛЕНТИ */}
        <div className="relative my-auto py-4 px-8 space-y-6 z-10 max-w-xl mx-auto w-full">
          
          {/* Снимка 1 (Ако има качена) - разпръсната отляво */}
          {displayPhotos[0] && (
            <div 
              className="absolute -left-12 top-6 bg-[#141210] p-1.5 shadow-2xl rounded-sm border border-[#2A2421]"
              style={{ transform: 'rotate(-7deg)', width: '150px' }}
            >
              <div className="flex justify-between px-1 mb-1">
                {[...Array(5)].map((_, idx) => <div key={idx} className="w-1.5 h-1 bg-[#FEFEFD]" />)}
              </div>
              <img src={displayPhotos[0]} alt="Memory" className="w-full h-24 object-cover" />
              <div className="flex justify-between px-1 mt-1">
                {[...Array(5)].map((_, idx) => <div key={idx} className="w-1.5 h-1 bg-[#FEFEFD]" />)}
              </div>
            </div>
          )}

          {/* Снимка 2 - разпръсната отдясно */}
          {displayPhotos[1] && (
            <div 
              className="absolute -right-10 top-40 bg-[#141210] p-1.5 shadow-2xl rounded-sm border border-[#2A2421]"
              style={{ transform: 'rotate(6deg)', width: '155px' }}
            >
              <div className="flex justify-between px-1 mb-1">
                {[...Array(5)].map((_, idx) => <div key={idx} className="w-1.5 h-1 bg-[#FEFEFD]" />)}
              </div>
              <img src={displayPhotos[1]} alt="Memory" className="w-full h-24 object-cover" />
              <div className="flex justify-between px-1 mt-1">
                {[...Array(5)].map((_, idx) => <div key={idx} className="w-1.5 h-1 bg-[#FEFEFD]" />)}
              </div>
            </div>
          )}

          {/* ОСНОВНИ ТЕКСТОВЕ С РЪКОПИСЕН ШРИФТ */}
          {statusText && (
            <p style={{ fontFamily: "'Caveat', cursive" }} className="text-2xl text-[#2C2421] leading-snug text-center">
              {statusText}
            </p>
          )}

          {mainWish && (
            <p style={{ fontFamily: "'Caveat', cursive" }} className="text-2xl text-[#2C2421] leading-snug text-center">
              {mainWish}
            </p>
          )}

          {wishFromCandle && (
            <div className="text-center bg-white/30 p-3 rounded-lg backdrop-blur-xs border border-[#DBCEB3]">
              <span className="text-[10px] uppercase font-sans tracking-widest text-[#958679] block mb-1">Намислено желание при свещта</span>
              <p style={{ fontFamily: "'Caveat', cursive" }} className="text-2xl text-[#1F1A17]">
                "{wishFromCandle}"
              </p>
            </div>
          )}

          {/* ДНЕВНИК / ВЪПРОСИ И ОТГОВОРИ */}
          {capsuleAnswers.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xs uppercase tracking-widest text-center text-[#8A7C6E] border-b border-[#DBCEB3] pb-1">
                Поглед към бъдещето
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {capsuleAnswers.map((item, idx) => (
                  <div key={idx} className="bg-white/20 p-2 rounded">
                    <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-[10px] italic text-[#635E57]">
                      {item.question}
                    </p>
                    <p style={{ fontFamily: "'Caveat', cursive" }} className="text-xl text-[#1F1A17] font-bold">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {secretJoke && (
            <p style={{ fontFamily: "'Caveat', cursive" }} className="text-xl text-[#4A3F35] text-center italic">
              ✦ {secretJoke}
            </p>
          )}

        </div>

        {/* ДОЛНА ЧАСТ: Подпис и златен печат точно като на твоя модел */}
        <div className="flex justify-between items-end pt-6 border-t border-[#DBCEB3] relative z-10">
          <div>
            <p style={{ fontFamily: "'Caveat', cursive" }} className="text-3xl text-[#1F1A17]">
              С любов,<br />{sender}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-xs italic text-[#7A6C5E]">
              Запечатано за спомен
            </span>
            <img src="/images/gold-seal.png" alt="Gold Seal" className="w-16 h-16 drop-shadow-lg" />
          </div>
        </div>

      </div>
    </div>
  );
}

export default TimeCapsulePdf;