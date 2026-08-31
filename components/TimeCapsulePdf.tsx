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

  // ЗА ТЕСТ: Ако няма качени снимки, слагаме примерни изображения, за да видиш дизайна на лентите!
  const validPhotos = (photos || []).filter(isImage);
  const displayPhotos = validPhotos.length > 0 ? validPhotos : [
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&auto=format&fit=crop&q=80'
  ];

  return (
    <div id="pdf-print-area" className="hidden print:block fixed inset-0 z-[9999] overflow-y-auto bg-[#F4EBE1]">
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
            min-height: 297mm !important;
            background-color: #F4EBE1 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: A4;
            margin: 10mm;
          }
        }
      `}</style>

      {/* ОСНОВЕН КОНТЕЙНЕР НА ПИСМОТО */}
      <div className="max-w-2xl mx-auto bg-[#FDFBF7] p-8 my-8 shadow-2xl rounded-sm relative border border-[#DBCEB3]">
        
        {/* ГОРНА ЧАСТ: Заглавие */}
        <div className="text-center pb-6 border-b border-[#DBCEB3] relative">
          <h1 style={{ fontFamily: "'Caveat', cursive" }} className="text-4xl font-bold text-[#3A322D]">
            Капсула на времето за {recipient}
          </h1>
          <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-xs italic text-[#7A6C5E] mt-1">
            Създадено с любов и надежда, за да се отвори в бъдещето
          </p>
        </div>

        {/* СРЕДНА ЧАСТ: Двуколонен изглед (Снимки в киноленти отляво, Текстове отдясно) */}
        <div className="grid grid-cols-12 gap-6 my-6 items-center">
          
          {/* ЛЯВА КОЛОНА: ФИЛМОВИ ЛЕНТИ */}
          <div className="col-span-4 flex flex-col gap-6 items-center">
            {displayPhotos.slice(0, 3).map((url, i) => (
              <div 
                key={i} 
                className="bg-[#141210] p-1.5 shadow-xl rounded-sm border border-[#2A2421] w-full"
                style={{ transform: `rotate(${i % 2 === 0 ? '-3deg' : '3deg'})` }}
              >
                <div className="flex justify-between px-1 mb-1">
                  {[...Array(5)].map((_, idx) => <div key={idx} className="w-1.5 h-1 bg-[#FEFEFD] rounded-[1px]" />)}
                </div>
                <img src={url} alt="Memory" className="w-full h-28 object-cover rounded-xs" />
                <div className="flex justify-between px-1 mt-1">
                  {[...Array(5)].map((_, idx) => <div key={idx} className="w-1.5 h-1 bg-[#FEFEFD] rounded-[1px]" />)}
                </div>
              </div>
            ))}
          </div>

          {/* ДЯСНА КОЛОНА: ТЕКСТОВЕ И ПОСЛАНИЯ */}
          <div className="col-span-8 space-y-4">
            {statusText && (
              <div>
                <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[9px] uppercase tracking-widest text-[#958679] font-bold block border-b border-[#DBCEB3] pb-0.5">Начало</span>
                <p style={{ fontFamily: "'Caveat', cursive" }} className="text-2xl text-[#1F1A17] leading-snug">{statusText}</p>
              </div>
            )}

            {mainWish && (
              <div>
                <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[9px] uppercase tracking-widest text-[#958679] font-bold block border-b border-[#DBCEB3] pb-0.5">Послание</span>
                <p style={{ fontFamily: "'Caveat', cursive" }} className="text-2xl text-[#1F1A17] leading-snug">{mainWish}</p>
              </div>
            )}

            {wishFromCandle && (
              <div>
                <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[9px] uppercase tracking-widest text-[#958679] font-bold block border-b border-[#DBCEB3] pb-0.5">Намислено желание</span>
                <p style={{ fontFamily: "'Caveat', cursive" }} className="text-2xl text-[#1F1A17] leading-snug">"{wishFromCandle}"</p>
              </div>
            )}

            {secretJoke && (
              <div>
                <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[9px] uppercase tracking-widest text-[#958679] font-bold block border-b border-[#DBCEB3] pb-0.5">Скреч Тайна</span>
                <p style={{ fontFamily: "'Caveat', cursive" }} className="text-2xl text-[#1F1A17] leading-snug">{secretJoke}</p>
              </div>
            )}
          </div>

        </div>

        {/* ДОЛНА ЧАСТ: ДНЕВНИК И ПОДПИС */}
        {capsuleAnswers.length > 0 && (
          <div className="mt-6 pt-4 border-t border-[#DBCEB3] space-y-3">
            <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-xs uppercase tracking-widest text-center text-[#8A7C6E]">
              Поглед към бъдещето
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {capsuleAnswers.map((item, idx) => (
                <div key={idx} className="bg-white/40 p-2 rounded border border-[#EAE2D6]">
                  <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-[10px] italic text-[#635E57]">{item.question}</p>
                  <p style={{ fontFamily: "'Caveat', cursive" }} className="text-lg text-[#1F1A17] font-bold">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ПОДПИС И ЗЛАТЕН ПЕЧАТ */}
        <div className="flex justify-between items-end mt-8 pt-4 border-t border-[#DBCEB3]">
          <div>
            <p style={{ fontFamily: "'Caveat', cursive" }} className="text-3xl text-[#1F1A17]">
              С любов,<br />{sender}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-xs italic text-[#7A6C5E]">Запечатано за спомен</span>
            <img src="/images/gold-seal.png" alt="Gold Seal" className="w-16 h-16 drop-shadow-md" />
          </div>
        </div>

      </div>
    </div>
  );
}

export default TimeCapsulePdf;