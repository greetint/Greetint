'use client';

import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';

// Ръкописен шрифт с кирилица
Font.register({
  family: 'Caveat',
  src: 'https://fonts.gstatic.com/s/caveat/v18/Wnz6HAc5bAfYB2Q7Yj82ciM_lZQ.ttf',
});

const styles = StyleSheet.create({
  page: {
    position: 'relative',
    width: '100%',
    height: '100%',
    backgroundColor: '#EAE2D6',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  // Контейнерът за текста се центрира върху хартията на фона
  textContainer: {
    paddingTop: 140,
    paddingBottom: 80,
    paddingHorizontal: 80,
    zIndex: 10,
  },
  title: {
    fontFamily: 'Caveat',
    fontSize: 36,
    color: '#3A322D',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Caveat',
    fontSize: 16,
    color: '#958679',
    marginTop: 15,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#DBCEB3',
  },
  textContent: {
    fontFamily: 'Caveat',
    fontSize: 22,
    color: '#1F1A17',
    lineHeight: 1.2,
  },
  journalQ: {
    fontFamily: 'Caveat',
    fontSize: 14,
    color: '#7A6C5E',
    marginTop: 8,
  },
  journalA: {
    fontFamily: 'Caveat',
    fontSize: 20,
    color: '#1F1A17',
  },
  // КИНЕМАТОГРАФСКИ КАДРИ (Абсолютно позиционирани)
  filmFrame: {
    position: 'absolute',
    width: 140,
    backgroundColor: '#141210',
    padding: 6,
    borderRadius: 2,
    zIndex: 20,
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
    width: 8,
    height: 6,
    backgroundColor: '#FEFEFD',
    borderRadius: 1,
  },
  filmImage: {
    width: '100%',
    height: 90,
    objectFit: 'cover',
  },
});

interface PdfProps {
  recipient?: string;
  sender?: string;
  mainWish?: string;
  wishFromCandle?: string;
  capsuleAnswers?: { question: string; answer: string }[];
  photos?: string[];
}

export const TimeCapsulePdf = ({
  recipient = 'ВИКТОРИЯ',
  sender = 'Подаряващия',
  mainWish = '',
  wishFromCandle = '',
  capsuleAnswers = [],
  photos = []
}: PdfProps) => {
  
  // Тестови снимки, ако не са подадени реални, за да видиш дизайна веднага
  const displayPhotos = photos.length > 0 ? photos : [
    '/images/assets/envelope_paper.jpeg',
    '/images/assets/envelope_paper.jpeg',
    '/images/assets/envelope_paper.jpeg'
  ];

  // Фиксирани позиции за разпръскване на снимките
  const positions = [
    { top: 40, left: 20, transform: 'rotate(-8deg)' },
    { top: 400, left: -20, transform: 'rotate(12deg)' },
    { top: 600, left: 420, transform: 'rotate(-5deg)' },
    { top: 80, left: 440, transform: 'rotate(15deg)' }
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* ФОН: Увери се, че имаш файл /public/images/pdf-background.jpg */}
        <Image src="/images/pdf-background.jpg" style={styles.background} />

        {/* ТЕКСТ (ПИСМОТО) */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Специално за {recipient}</Text>

          <Text style={styles.sectionTitle}>Послание</Text>
          <Text style={styles.textContent}>{mainWish}</Text>

          <Text style={styles.sectionTitle}>Намислено желание</Text>
          <Text style={styles.textContent}>{wishFromCandle}</Text>

          <Text style={styles.sectionTitle}>Капсула на бъдещето</Text>
          {capsuleAnswers.map((item, idx) => (
            <View key={idx}>
              <Text style={styles.journalQ}>{item.question}</Text>
              <Text style={styles.journalA}>{item.answer}</Text>
            </View>
          ))}
          
          <Text style={[styles.journalQ, { marginTop: 20 }]}>С любов, {sender}</Text>
        </View>

        {/* РАЗПРЪСНАТИ КИНЕМАТОГРАФСКИ КАДРИ */}
        {displayPhotos.slice(0, 4).map((url, i) => (
          <View key={i} style={[styles.filmFrame, positions[i]]}>
            <View style={styles.filmHolesRow}>
              {[...Array(6)].map((_, h) => <View key={`t-${h}`} style={styles.hole} />)}
            </View>
            <Image src={url} style={styles.filmImage} />
            <View style={styles.filmHolesRowBottom}>
              {[...Array(6)].map((_, h) => <View key={`b-${h}`} style={styles.hole} />)}
            </View>
          </View>
        ))}

      </Page>
    </Document>
  );
};

export default TimeCapsulePdf;