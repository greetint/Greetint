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
    if (lower.match(/\.(mp4|webm|ogg)$/)) return false;
    if (lower.startsWith('data:video')) return false;
    return true; 
  };
  
  const displayPhotos = (photos || []).filter(isImage).slice(0, 5);

  // СТРИКТНА КИНЕМАТОГРАФСКА РАМКА С ПЕРФОРАЦИИ (Гарантирано черна лента)
  const FilmStrip = ({ url, rotation }: { url: string, rotation: number }) => (
    <div 
      className="bg-[#141210] p-1.5 shadow-xl rounded-sm border border-[#2A2421] w-[130px] flex-shrink-0 mx-auto"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="flex justify-between px-1 mb-1 opacity-90">
        {[...Array(5)].map((_, idx) => <div key={`top-${idx}`} className="w-1.5 h-[3px] bg-[#FEFEFD] rounded-[1px]" />)}
      </div>
      <img src={url} alt="Memory" className="w-full h-[85px] object-cover border border-white/10 rounded-[1px]" />
      <div className="flex justify-between px-1 mt-1 opacity-90">
        {[...Array(5)].map((_, idx) => <div key={`bot-${idx}`} className="w-1.5 h-[3px] bg-[#FEFEFD] rounded-[1px]" />)}
      </div>
    </div>
  );

  return (
    <div id="pdf-print-area" className="hidden print:block fixed inset-0 z-[9999] bg-white overflow-hidden">
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
            overflow: hidden !important;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}</style>

      {/* A4 КОНТЕЙНЕР БЕЗ ПРЕЛИВАНЕ */}
      <div className="w-[210mm] h-[297mm] mx-auto relative overflow-hidden bg-[#FAF6EE] box-border">
        
        {/* ФОНОВО ИЗОБРАЖЕНИЕ */}
        <img 
          src="/images/birthday_pdf_basic.jpg" 
          alt="Background" 
          className="absolute inset-0 w-[210mm] h-[297mm] object-cover z-0" 
        />

        {/* БЕЗОПАСНА ЗОНА (Изтеглена нагоре, за да не се застъпва с долното поле) */}
        <div className="relative z-10 w-full h-full pt-[42mm] pb-[32mm] px-[18mm] flex flex-col justify-between box-border">
          
          {/* ЗАГЛАВИЕ */}
          <div className="text-center mb-2 flex-shrink-0 border-b border-[#C8B89D]/50 pb-1">
            <h1 style={{ fontFamily: "'Caveat', cursive" }} className="text-3xl font-bold text-[#3A322D] leading-tight">
              Капсула на времето за {recipient}
            </h1>
            <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-[9px] italic text-[#7A6C5E]">
              Създадено с любов и надежда, за да се отвори в бъдещето
            </p>
          </div>

          {/* СЪДЪРЖАНИЕ (ЗИГ-ЗАГ СТРУКТУРА С УВЕЛИЧЕН БАЗОВ ШРИФТ) */}
          <div className="flex flex-col gap-2 flex-1 justify-around my-1">
            
            {/* БЛОК 1 */}
            {(statusText || mainWish || displayPhotos[0]) && (
              <div className="flex w-full items-center gap-5">
                <div className="w-[32%] flex justify-center">
                  {displayPhotos[0] ? (
                    <FilmStrip url={displayPhotos[0]} rotation={-3} />
                  ) : (
                    <FilmStrip url="/images/birthday_pdf_basic.jpg" rotation={-3} />
                  )}
                </div>
                <div className="w-[68%] flex flex-col gap-1.5">
                  {statusText && (
                    <div>
                      <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[8px] uppercase tracking-widest text-[#958679] font-bold block mb-0.5">Начало</span>
                      <p style={{ fontFamily: "'Caveat', cursive" }} className="text-2xl text-[#1F1A17] leading-tight break-all">{statusText}</p>
                    </div>
                  )}
                  {mainWish && (
                    <div>
                      <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[8px] uppercase tracking-widest text-[#958679] font-bold block mb-0.5">Послание</span>
                      <p style={{ fontFamily: "'Caveat', cursive" }} className="text-2xl text-[#1F1A17] leading-tight break-all">{mainWish}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* БЛОК 2 */}
            {(wishFromCandle || secretJoke || displayPhotos[1]) && (
              <div className="flex w-full items-center gap-5 flex-row-reverse">
                <div className="w-[32%] flex justify-center">
                  {displayPhotos[1] ? (
                    <FilmStrip url={displayPhotos[1]} rotation={3} />
                  ) : (
                    <FilmStrip url="/images/birthday_pdf_basic.jpg" rotation={3} />
                  )}
                </div>
                <div className="w-[68%] flex flex-col gap-1.5 text-right">
                  {wishFromCandle && (
                    <div>
                      <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[8px] uppercase tracking-widest text-[#958679] font-bold block mb-0.5">Намислено желание</span>
                      <p style={{ fontFamily: "'Caveat', cursive" }} className="text-2xl text-[#1F1A17] leading-tight break-all">"{wishFromCandle}"</p>
                    </div>
                  )}
                  {secretJoke && (
                    <div>
                      <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[8px] uppercase tracking-widest text-[#958679] font-bold block mb-0.5">Скреч Тайна</span>
                      <p style={{ fontFamily: "'Caveat', cursive" }} className="text-2xl text-[#1F1A17] leading-tight break-all">{secretJoke}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* БЛОК 3: ОТГОВОРИ */}
            {(capsuleAnswers.length > 0 || displayPhotos[2]) && (
              <div className="flex w-full items-center gap-4">
                <div className="w-[32%] flex justify-center">
                  {displayPhotos[2] ? (
                    <FilmStrip url={displayPhotos[2]} rotation={-2} />
                  ) : (
                    <FilmStrip url="/images/birthday_pdf_basic.jpg" rotation={-2} />
                  )}
                </div>
                <div className="w-[68%] px-1">
                  <h3 style={{ fontFamily: "'Playfair Display', serif" }} className="text-[9px] uppercase tracking-widest text-center text-[#8A7C6E] border-b border-[#C8B89D]/50 pb-0.5 mb-1.5">
                    Отговори от капсулата
                  </h3>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    {capsuleAnswers.map((item, idx) => (
                      <div key={idx} className="mb-0.5">
                        <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-[7px] italic text-[#635E57] mb-0.5 leading-none break-all">{item.question}</p>
                        <p style={{ fontFamily: "'Caveat', cursive" }} className="text-lg text-[#1F1A17] font-bold leading-tight break-all">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* ПОДПИС (Вдигнат нагоре, за да не се застъпва с кафявото поле) */}
          <div className="flex-shrink-0 pt-2 pb-1 border-t border-[#C8B89D]/50 text-right">
            <p style={{ fontFamily: "'Caveat', cursive" }} className="text-3xl text-[#1F1A17] pr-4 leading-none">
              С любов, {sender}
            </p>
          </div>

        </div>

        {/* АВТОРСКО ПРАВО */}
        <div 
          className="absolute bottom-[10mm] left-0 right-0 text-center z-20"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <span className="text-[7px] uppercase tracking-[0.4em] text-[#EAE2D6] opacity-70">
            GREETING ARCHIVE © 2026
          </span>
        </div>

      </div>
    </div>
  );
}

export default TimeCapsulePdf;