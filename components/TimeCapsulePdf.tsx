'use client';

import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 40,
    backgroundColor: '#FDFBF7', // Пергаментов цвят на хартията
  },
  // Заглавна част (Плик / Печат)
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#DBCEB3',
    paddingBottom: 15,
  },
  seal: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 24,
    color: '#3A322D',
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 10,
    color: '#958679',
    textAlign: 'center',
    marginTop: 4,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  // Основен двуколонен布局 (Ляво: Снимки, Дясно: Текстове)
  mainLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  leftColumn: {
    width: '42%',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 15,
  },
  rightColumn: {
    width: '54%',
    flexDirection: 'column',
    gap: 12,
  },
  // Стил за кинолентите със снимки
  filmFrame: {
    width: '100%',
    backgroundColor: '#141210',
    padding: 5,
    borderRadius: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
  },
  filmHolesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  filmHolesRowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 3,
  },
  hole: {
    width: 5,
    height: 3,
    backgroundColor: '#FEFEFD',
    borderRadius: 1,
  },
  filmImage: {
    width: '100%',
    height: 110,
    objectFit: 'cover',
    borderWidth: 1,
    borderColor: '#3A322D',
  },
  // Текстови блокове
  textBlock: {
    marginBottom: 8,
  },
  blockTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#958679',
    marginBottom: 2,
  },
  textBody: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 12,
    color: '#1F1A17',
    lineHeight: 1.4,
  },
  journalQ: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 9,
    color: '#635E57',
  },
  journalA: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: '#1F1A17',
    lineHeight: 1.25,
    marginBottom: 6,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: 'Helvetica',
    fontSize: 7,
    letterSpacing: 3,
    color: '#958679',
  }
});

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

const FilmStrip = ({ src, rotation }: { src: string, rotation: number }) => {
  if (!src) return null; 
  return (
    <View style={[styles.filmFrame, { transform: `rotate(${rotation}deg)` }]}>
      <View style={styles.filmHolesRow}>
        {[...Array(6)].map((_, i) => <View key={`top-${i}`} style={styles.hole} />)}
      </View>
      <Image src={src} style={styles.filmImage} />
      <View style={styles.filmHolesRowBottom}>
        {[...Array(6)].map((_, i) => <View key={`bot-${i}`} style={styles.hole} />)}
      </View>
    </View>
  );
};

export const TimeCapsulePdf = ({
  recipient = 'Получател',
  sender = 'Подател',
  statusText = '',
  mainWish = '',
  wishFromCandle = '',
  secretJoke = '',
  capsuleAnswers = [],
  photos = []
}: PdfProps) => {

  const isImage = (url: string) => {
    if (!url) return false;
    const lower = url.toLowerCase();
    return lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.startsWith('data:image/');
  };

  const displayPhotos = (photos || []).filter(isImage).slice(0, 4);
  const rotations = [-2, 3, -3, 2]; // Леки артистични наклони

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={true}>
        
        {/* Заглавна част с печат */}
        <View style={styles.headerContainer} wrap={false}>
          <Image src="/images/gold-seal.png" style={styles.seal} />
          <Text style={styles.title}>Капсула на времето</Text>
          <Text style={styles.subtitle}>Честит рожден ден, {recipient}!</Text>
        </View>

        {/* Двуколонен дизайн (Снимки отляво, Текстове отдясно) */}
        <View style={styles.mainLayout}>
          
          {/* ЛЯВА КОЛОНА: Артистични киноленти */}
          <View style={styles.leftColumn}>
            {displayPhotos.map((url, i) => (
              <FilmStrip key={i} src={url} rotation={rotations[i % rotations.length]} />
            ))}
          </View>

          {/* ДЯСНА КОЛОНА: Послания, желания и дневник */}
          <View style={styles.rightColumn}>
            
            {statusText ? (
              <View style={styles.textBlock} wrap={false}>
                <Text style={styles.blockTitle}>Начало на пътуването</Text>
                <Text style={styles.textBody}>{statusText}</Text>
              </View>
            ) : null}

            {mainWish ? (
              <View style={styles.textBlock} wrap={false}>
                <Text style={styles.blockTitle}>Послание от подаряващия</Text>
                <Text style={styles.textBody}>{mainWish}</Text>
              </View>
            ) : null}

            {wishFromCandle ? (
              <View style={styles.textBlock} wrap={false}>
                <Text style={styles.blockTitle}>Намислено желание</Text>
                <Text style={styles.textBody}>"{wishFromCandle}"</Text>
              </View>
            ) : null}

            {secretJoke ? (
              <View style={styles.textBlock} wrap={false}>
                <Text style={styles.blockTitle}>Скреч тайна</Text>
                <Text style={styles.textBody}>{secretJoke}</Text>
              </View>
            ) : null}

            {capsuleAnswers && capsuleAnswers.length > 0 ? (
              <View style={styles.textBlock}>
                <Text style={styles.blockTitle}>Поглед към бъдещето</Text>
                {capsuleAnswers.map((item, idx) => (
                  <View key={idx} wrap={false} style={{ marginBottom: 4 }}>
                    <Text style={styles.journalQ}>{item.question || 'Въпрос'}</Text>
                    <Text style={styles.journalA}>{item.answer || 'Без отговор'}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            <View style={{ marginTop: 15 }} wrap={false}>
              <Text style={[styles.textBody, { textAlign: 'right', fontFamily: 'Helvetica-Bold' }]}>
                С любов,{'\n'}{sender}
              </Text>
            </View>

          </View>
        </View>

        <Text style={styles.footer} fixed>
          GREETING ARCHIVE © 2026
        </Text>

      </Page>
    </Document>
  );
};

export default TimeCapsulePdf;