'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export interface CertificateData {
  childName: string;
  childAge: string | number;
  senderName: string;
  personalMessage: string;
  spokenWish: string;
}

const CORNER_STYLE: React.CSSProperties = {
  width: 46,
  height: 46,
  borderColor: '#c79a3f',
};

function Corner({ position }: { position: 'tl' | 'tr' | 'bl' | 'br' }) {
  const base: Record<string, React.CSSProperties> = {
    tl: { top: 18, left: 18, borderTop: '3px solid', borderLeft: '3px solid' },
    tr: { top: 18, right: 18, borderTop: '3px solid', borderRight: '3px solid' },
    bl: { bottom: 18, left: 18, borderBottom: '3px solid', borderLeft: '3px solid' },
    br: { bottom: 18, right: 18, borderBottom: '3px solid', borderRight: '3px solid' },
  };
  return <div style={{ position: 'absolute', ...CORNER_STYLE, ...base[position] }} />;
}

/** Offscreen, non-animated print target rasterized via html2canvas.
 * Fixed pixel size (A4 @ ~96dpi x2 for crispness) so the captured image
 * maps predictably onto the PDF page. */
export function CertificateTemplate({ data }: { data: CertificateData }) {
  const { t } = useLanguage();
  return (
    <div
      id="mv2-certificate"
      style={{
        width: 1240,
        height: 1754,
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Playfair Display', serif",
        background: 'radial-gradient(circle at 50% 0%, #fdf6e3 0%, #f6ead0 45%, #eeddb3 100%)',
        color: '#4a3418',
        boxSizing: 'border-box',
        padding: 60,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 30,
          border: '2px solid #c79a3f',
          borderRadius: 4,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 42,
          border: '1px solid #c79a3f',
          borderRadius: 4,
          opacity: 0.6,
        }}
      />
      <Corner position="tl" />
      <Corner position="tr" />
      <Corner position="bl" />
      <Corner position="br" />

      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', textAlign: 'center', padding: '70px 90px' }}>
        <div style={{ fontSize: 15, letterSpacing: 8, textTransform: 'uppercase', color: '#a97e2f', marginBottom: 18 }}>
          {t('magicV2.certificate.keepsakeLabel')}
        </div>

        <h1
          style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: 56,
            fontWeight: 700,
            color: '#8a5a1f',
            lineHeight: 1.25,
            margin: 0,
            marginBottom: 10,
          }}
        >
          {t('magicV2.certificate.heading')}
          <br />
          {data.childName}!
        </h1>

        <div
          style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: 20,
            color: '#fff',
            background: 'linear-gradient(135deg, #f7d774, #c79a3f)',
            borderRadius: 999,
            padding: '10px 34px',
            marginTop: 8,
            marginBottom: 34,
            boxShadow: '0 4px 14px rgba(199,154,63,0.4)',
          }}
        >
          {t('magicV2.certificate.turningToday', { age: data.childAge })}
        </div>

        <p style={{ fontSize: 21, lineHeight: 1.7, fontStyle: 'italic', color: '#5a4526', maxWidth: 820, margin: '0 0 34px' }}>
          {t('magicV2.certificate.story', { name: data.childName, age: data.childAge })}
        </p>

        <div
          style={{
            width: '100%',
            maxWidth: 820,
            background: 'rgba(199,154,63,0.1)',
            border: '1px solid rgba(199,154,63,0.4)',
            borderRadius: 18,
            padding: '22px 30px',
            marginBottom: 34,
          }}
        >
          <div style={{ fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', color: '#a97e2f', marginBottom: 8 }}>
            {t('magicV2.certificate.messageFrom', { sender: data.senderName })}
          </div>
          <p style={{ fontSize: 20, lineHeight: 1.6, margin: 0, color: '#4a3418' }}>{data.personalMessage}</p>
        </div>

        {data.spokenWish && (
          <div style={{ maxWidth: 780, marginBottom: 20 }}>
            <div style={{ fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', color: '#a97e2f', marginBottom: 10 }}>
              {t('magicV2.certificate.wishLabel', { name: data.childName })}
            </div>
            <p
              style={{
                fontFamily: "'Great Vibes', cursive",
                fontSize: 46,
                lineHeight: 1.3,
                color: '#8a5a1f',
                margin: 0,
              }}
            >
              &ldquo;{data.spokenWish}&rdquo;
            </p>
          </div>
        )}

        <div style={{ marginTop: 'auto', paddingTop: 30, fontSize: 13, letterSpacing: 3, textTransform: 'uppercase', color: '#a97e2f' }}>
          {t('magicV2.certificate.footer', { date: new Date().toLocaleDateString() })}
        </div>
      </div>
    </div>
  );
}
