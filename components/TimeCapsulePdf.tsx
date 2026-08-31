'use client';

import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';

// Регистриране на шрифтовете
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
    paddingBottom: 80,
    backgroundColor: '#FDFBF7',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  topFlapContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#EAE2D6', // Заместваме SVG-то с плътен елегантен блок, за да избегнем краш
    borderBottomWidth: 2,
    borderBottomColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  seal: {
    width: 70,
    height: 70,
    marginBottom: -35, // Изнасяме печата наполовина извън блока
    zIndex: 10,
  },
  contentContainer: {
    paddingHorizontal: 60,
    paddingTop: 20,
    zIndex: 5,
  },
  title: {
    fontFamily: 'Caveat',
    fontSize: 42,
    color: '#3A322D',
    textAlign: 'center',
    marginBottom: 25,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Roboto',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#958679',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#DBCEB3',
    paddingBottom: 4,
  },
  textContent: {
    fontFamily: 'Caveat',
    fontSize: 24,
    color: '#1F1A17',
    lineHeight: 1.3,
  },
  journalBlock: {
    marginBottom: 12,
  },
  journalQ: {
    fontFamily: 'Roboto',
    fontStyle: 'italic',
    fontSize: 12,
    color: '#635E57',
    marginBottom: 3,
  },
  journalA: {
    fontFamily: 'Caveat',
    fontSize: 22,
    color: '#1F1A17',
    lineHeight: 1.2,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 15,
    gap: 15,
  },
  filmFrame: {
    width: '45%',
    backgroundColor: '#141210',
    padding: 6,
    borderRadius: 2,
    marginBottom: 15,
  },
  filmHolesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  filmHolesRowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  hole: {
    width: 6,
    height: 4,
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
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontFamily: 'Roboto',
    fontSize: 8,
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
  // ЗАЩИТА: Ако няма src, връщаме null, за да не сринем генератора
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

  const displayPhotos = (photos || []).filter(url => Boolean(url)).slice(0, 5);
  const rotations = [-4, 5, -3, 6, -2]; 

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={true}>
        
        {/* ФОН */}
        <Image src="/images/pdf-background.jpg" style={styles.background} fixed />

        {/* ГОРЕН КАПАК (без SVG, за да е 100% стабилно) */}
        <View style={styles.topFlapContainer} wrap={false}>
          <Image src="/images/gold-seal.png" style={styles.seal} />
        </View>

        <View style={styles.contentContainer}>
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

          <View style={[styles.section, { marginTop: 10 }]} wrap={false}>
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