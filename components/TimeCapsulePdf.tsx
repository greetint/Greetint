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
  
  // Подобрен филтър: Хваща Blob URL-и от качени снимки и изключва само видеа
  const isImage = (url: string) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    if (lower.match(/\.(mp4|webm|ogg)$/)) return false;
    if (lower.startsWith('data:video')) return false;
    return true; // Всичко останало (вкл. blob:http...) се третира като снимка
  };
  
  const displayPhotos = (photos || []).filter(isImage).slice(0, 5);

  // Компонент за филмова лента (умален, за да събере до 5 броя вертикално)
  const FilmStrip = ({ url, rotation }: { url: string, rotation: number }) => (
    <div 
      className="bg-[#141210] p-1.5 shadow-xl rounded-sm border border-[#2A2421] w-full max-w-[130px] mx-auto mb-4"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="flex justify-between px-1 mb-1 opacity-90">
        {[...Array(5)].map((_, idx) => <div key={`top-${idx}`} className="w-1 h-[3px] bg-[#FEFEFD] rounded-[1px]" />)}
      </div>
      <img src={url} alt="Memory" className="w-full h-20 object-cover rounded-[1px] border border-white/10" />
      <div className="flex justify-between px-1 mt-1 opacity-90">
        {[...Array(5)].map((_, idx) => <div key={`bot-${idx}`} className="w-1 h-[3px] bg-[#FEFEFD] rounded-[1px]" />)}
      </div>
    </div>
  );

  return (
    <div id="pdf-print-area" className="hidden print:block fixed inset-0 z-[9999] overflow-hidden bg-white">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Playfair+Display:ital,wght@0,600;1,400&display=swap');

        @media print {
          body * { visibility: hidden !important; }
          #pdf-print-area, #pdf-print-area * { visibility: visible !important; }
          #pdf-print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            background-color: white !important;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}</style>

      {/* 
        ОСНОВЕН A4 КОНТЕЙНЕР
        Използваме истински <img> таг за фон, за да заобиколим настройките на браузъра 
      */}
      <div className="w-[210mm] h-[297mm] mx-auto relative overflow-hidden">
        
        {/* ИСТИНСКА КАРТИНКА ЗА ФОН - ГАРАНТИРА ОТПЕЧАТВАНЕ */}
        <img 
          src="/images/pdf_background.jpg" 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-fill z-0" 
        />

        {/* 
          БЕЗОПАСНА ЗОНА ЗА ТЕКСТ (Safe Area)
          pt-[45mm] пази текста от горния кафяв триъгълник
          pb-[35mm] пази текста от долния кафяв триъгълник
        */}
        <div className="relative z-10 w-full h-full pt-[45mm] pb-[35mm] px-[15mm] flex flex-col">
          
          {/* ЗАГЛАВИЕ */}
          <div className="text-center mb-4 flex-shrink-0">
            <h1 style={{ fontFamily: "'Caveat', cursive" }} className="text-4xl font-bold text-[#3A322D]">
              Капсула на времето за {recipient}
            </h1>
            <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-[10px] italic text-[#7A6C5E] mt-0.5">
              Създадено с любов и надежда, за да се отвори в бъдещето
            </p>
          </div>

          {/* ДВУКОЛОНЕН ДИЗАЙН: Ляво (Снимки) | Дясно (Текстове) */}
          <div className="flex flex-row w-full flex-1 gap-6">
            
            {/* ЛЯВА КОЛОНА: КИНОЛЕНТИ */}
            <div className="w-1/3 flex flex-col items-center justify-start pt-2">
              {displayPhotos.length > 0 ? (
                displayPhotos.map((url, i) => (
                  <FilmStrip key={i} url={url} rotation={i % 2 === 0 ? -3 : 4} />
                ))
              ) : (
                <div className="text-center opacity-60 pt-10">
                  <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[9px] italic text-[#7A6C5E]">Няма запечатани кадри</span>
                </div>
              )}
            </div>

            {/* ДЯСНА КОЛОНА: ТЕКСТОВЕ */}
            <div className="w-2/3 flex flex-col gap-3 pt-2">
              
              {statusText && (
                <div className="border-b border-[#C8B89D]/50 pb-1.5">
                  <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[8px] uppercase tracking-widest text-[#958679] font-bold block mb-0.5">Начало</span>
                  <p style={{ fontFamily: "'Caveat', cursive" }} className="text-[17px] text-[#1F1A17] leading-tight">{statusText}</p>
                </div>
              )}

              {mainWish && (
                <div className="border-b border-[#C8B89D]/50 pb-1.5">
                  <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[8px] uppercase tracking-widest text-[#958679] font-bold block mb-0.5">Послание</span>
                  <p style={{ fontFamily: "'Caveat', cursive" }} className="text-[17px] text-[#1F1A17] leading-tight">{mainWish}</p>
                </div>
              )}

              {wishFromCandle && (
                <div className="border-b border-[#C8B89D]/50 pb-1.5">
                  <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[8px] uppercase tracking-widest text-[#958679] font-bold block mb-0.5">Намислено желание</span>
                  <p style={{ fontFamily: "'Caveat', cursive" }} className="text-[17px] text-[#1F1A17] leading-tight">"{wishFromCandle}"</p>
                </div>
              )}

              {secretJoke && (
                <div className="border-b border-[#C8B89D]/50 pb-1.5">
                  <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[8px] uppercase tracking-widest text-[#958679] font-bold block mb-0.5">Скреч Тайна</span>
                  <p style={{ fontFamily: "'Caveat', cursive" }} className="text-[17px] text-[#1F1A17] leading-tight">{secretJoke}</p>
                </div>
              )}

              {/* ДНЕВНИК (Отговори) - Компактен списък, за да събере 130 символа на отговор */}
              {capsuleAnswers.length > 0 && (
                <div className="mt-1 space-y-1.5">
                  <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[9px] uppercase tracking-widest text-center text-[#8A7C6E] border-b border-[#C8B89D] pb-0.5 mb-2">
                    Поглед към бъдещето
                  </h3>
                  <div className="flex flex-col gap-1.5">
                    {capsuleAnswers.map((item, idx) => (
                      <div key={idx} className="bg-white/30 px-2 py-1.5 rounded-sm border border-[#C8B89D]/40">
                        <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-[8px] italic text-[#635E57] mb-0.5">{item.question}</p>
                        <p style={{ fontFamily: "'Caveat', cursive" }} className="text-[15px] text-[#1F1A17] font-bold leading-tight">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* ПОДПИС */}
          <div className="flex-shrink-0 mt-4 pt-3 border-t border-[#C8B89D] text-right">
            <p style={{ fontFamily: "'Caveat', cursive" }} className="text-2xl text-[#1F1A17]">
              С любов, {sender}
            </p>
          </div>

        </div>

        {/* АВТОРСКО ПРАВО - Абсолютно позиционирано в долната тъмна част */}
        <div 
          className="absolute bottom-6 left-0 right-0 text-center z-20"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <span className="text-[8px] uppercase tracking-[0.4em] text-[#C8B89D] opacity-70">
            GREETING ARCHIVE © 2026
          </span>
        </div>

      </div>
    </div>
  );
}

export default TimeCapsulePdf;