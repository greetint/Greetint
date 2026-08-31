'use client';

import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font, Svg, Polygon } from '@react-pdf/renderer';

// РЕГИСТРИРАНЕ НА ШРИФТОВЕ
Font.register({
  family: 'Caveat',
  src: 'https://fonts.gstatic.com/s/caveat/v18/Wnz6HAc5bAfYB2Q7Yj82ciM_lZQ.ttf',
});
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 'normal' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf', fontStyle: 'italic' },
  ]
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 50,
    backgroundColor: '#F3ECE1', // Топъл пергаментов цвят, генериран с код
  },
  // Горна част (Капак на плика и печат)
  topFlapContainer: {
    position: 'relative',
    width: '100%',
    height: 110,
    alignItems: 'center',
    marginBottom: 15,
  },
  seal: {
    position: 'absolute',
    top: 70,
    width: 65,
    height: 65,
    zIndex: 20,
  },
  // Главно заглавие
  title: {
    fontFamily: 'Caveat',
    fontSize: 38,
    color: '#3A322D',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontFamily: 'Roboto',
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#958679',
    marginBottom: 4,
    borderBottomWidth: 0.7,
    borderBottomColor: '#DBCEB3',
    paddingBottom: 2,
  },
  textContent: {
    fontFamily: 'Caveat',
    fontSize: 22,
    color: '#1F1A17',
    lineHeight: 1.25,
  },
  // Дневник
  journalBlock: {
    marginBottom: 10,
  },
  journalQ: {
    fontFamily: 'Roboto',
    fontStyle: 'italic',
    fontSize: 10,
    color: '#7A6C5E',
    marginBottom: 2,
  },
  journalA: {
    fontFamily: 'Caveat',
    fontSize: 20,
    color: '#1F1A17',
    lineHeight: 1.15,
  },
  // Снимки (Киноленти)
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 10,
    gap: 12,
  },
  filmFrame: {
    width: '45%',
    backgroundColor: '#141210',
    padding: 5,
    borderRadius: 2,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
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
    height: 100,
    objectFit: 'cover',
    borderWidth: 0.5,
    borderColor: '#3A322D',
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: 'Roboto',
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

  const displayPhotos = (photos || []).filter(isImage).slice(0, 6); // До 6 снимки за перфектен баланс
  const rotations = [-4, 5, -2, 4, -5, 3]; 

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={true}>
        
        {/* ГОРЕН ТРИЪГЪЛЕН КАПАК НА ПЛИКА (Генериран изцяло с код) */}
        <View style={styles.topFlapContainer} wrap={false}>
          <Svg height="110" width="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0 }}>
            <Polygon points="0,0 100,0 50,100" fill="#E5DAC9" stroke="#D4AF37" strokeWidth={0.3} />
          </Svg>
          {/* Златният печат се запазва като акцент върху капака */}
          <Image src="/images/gold-seal.png" style={styles.seal} />
        </View>

        {/* СЪДЪРЖАНИЕ НА ПИСМОТО */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={styles.title}>Честит рожден ден, {recipient}!</Text>

          {statusText ? (
            <View style={styles.section} wrap={false}>
              <Text style={styles.sectionTitle}>Начало</Text>
              <Text style={styles.textContent}>{statusText}</Text>
            </View>
          ) : null}

          {mainWish ? (
            <View style={styles.section} wrap={false}>
              <Text style={styles.sectionTitle}>Послание</Text>
              <Text style={styles.textContent}>{mainWish}</Text>
            </View>
          ) : null}

          {wishFromCandle ? (
            <View style={styles.section} wrap={false}>
              <Text style={styles.sectionTitle}>Намисленото желание</Text>
              <Text style={styles.textContent}>"{wishFromCandle}"</Text>
            </View>
          ) : null}

          {secretJoke ? (
            <View style={styles.section} wrap={false}>
              <Text style={styles.sectionTitle}>Скреч Тайната</Text>
              <Text style={styles.textContent}>{secretJoke}</Text>
            </View>
          ) : null}

          {capsuleAnswers && capsuleAnswers.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Дневник на бъдещето</Text>
              {capsuleAnswers.map((item, idx) => (
                <View key={idx} style={styles.journalBlock} wrap={false}>
                  <Text style={styles.journalQ}>{item.question || 'Въпрос'}</Text>
                  <Text style={styles.journalA}>{item.answer || 'Без отговор'}</Text>
                </View>
              ))}
            </View>
          ) : null}

          {displayPhotos.length > 0 ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Запечатани спомени</Text>
              <View style={styles.photoGrid}>
                {displayPhotos.map((url, i) => (
                  <FilmStrip key={i} src={url} rotation={rotations[i % rotations.length]} />
                ))}
              </View>
            </View>
          ) : null}

          <View style={[styles.section, { marginTop: 15 }]} wrap={false}>
            <Text style={[styles.textContent, { textAlign: 'right' }]}>
              С любов,{'\n'}{sender}
            </Text>
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