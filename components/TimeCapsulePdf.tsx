'use client';

import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';

// РЕГИСТРИРАНЕ НА РЪКОПИСЕН ШРИФТ (С КИРИЛИЦА)
// Препоръчително: Свали Caveat.ttf локално в папка /public/fonts/ за най-голяма стабилност
Font.register({
  family: 'Handwriting',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/caveat/v18/Wnz6HAc5bAfYB2Q7Yj82ciM_lZQ.ttf', fontWeight: 'normal' },
    { src: 'https://fonts.gstatic.com/s/caveat/v18/Wnz5HAc5bAfYB2Q7ZjRWXyO8.ttf', fontWeight: 'bold' }
  ]
});

const styles = StyleSheet.create({
  page: {
    // Падингът е голям, за да "избута" текста в рамките на белия лист от фона (писмото)
    // Нагласи тези стойности спрямо конкретното ти background изображение
    paddingTop: 130, 
    paddingBottom: 80,
    paddingHorizontal: 65,
    fontFamily: 'Handwriting',
    color: '#1F1A17',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  recipientTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#635E57',
  },
  senderText: {
    fontSize: 16,
    color: '#958679',
    marginTop: 4,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#958679',
    borderBottomWidth: 1,
    borderBottomColor: '#DBCEB3',
    paddingBottom: 2,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  text: {
    fontSize: 20,
    color: '#3A322D',
    lineHeight: 1.3,
  },
  highlightText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F1A17',
    lineHeight: 1.3,
  },
  // КИНЕМАТОГРАФСКИ СТИЛ ЗА СНИМКИТЕ
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    justifyContent: 'center',
    marginTop: 10,
  },
  filmFrame: {
    width: '45%',
    backgroundColor: '#141210',
    padding: 6,
    borderRadius: 2,
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
    height: 100,
    objectFit: 'cover',
    borderWidth: 1,
    borderColor: '#3A322D',
  },
  // ДНЕВНИК
  journalRow: {
    marginBottom: 10,
  },
  journalQ: {
    fontSize: 16,
    color: '#7A6C5E',
  },
  journalA: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F1A17',
    marginTop: 2,
  },
  footerText: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 12,
    color: '#958679',
    letterSpacing: 2,
  },
});

interface PdfProps {
  recipient: string;
  sender: string;
  statusText?: string;
  secretJoke?: string;
  mainWish: string;
  wishFromCandle: string;
  capsuleAnswers: { question: string; answer: string }[];
  photos: string[];
}

// Компонент за генериране на кино-кадър (Лента)
const FilmStrip = ({ src }: { src: string }) => (
  <View style={styles.filmFrame}>
    <View style={styles.filmHolesRow}>
      {[...Array(7)].map((_, i) => <View key={`top-${i}`} style={styles.hole} />)}
    </View>
    <Image src={src} style={styles.filmImage} />
    <View style={styles.filmHolesRowBottom}>
      {[...Array(7)].map((_, i) => <View key={`bot-${i}`} style={styles.hole} />)}
    </View>
  </View>
);

export const TimeCapsulePdf = ({
  recipient,
  sender,
  statusText,
  secretJoke,
  mainWish,
  wishFromCandle,
  capsuleAnswers,
  photos
}: PdfProps) => (
  <Document>
    {/* wrap={true} позволява автоматично пренасяне на втора/трета страница, ако съдържанието е дълго */}
    <Page size="A4" style={styles.page} wrap={true}>
      
      {/* ФОН - ПЛИКЪТ. Слага се fixed, за да се рендира на всяка нова страница автоматично */}
      <Image src="/images/pdf-background.jpg" style={styles.background} fixed />

      {/* ЗАГЛАВИЕ */}
      <View style={styles.header}>
        <Text style={styles.recipientTitle}>За {recipient}</Text>
        <Text style={styles.senderText}>от {sender}</Text>
      </View>

      {/* ТАЙНИ И ПОСЛАНИЯ */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Скрито послание</Text>
        <Text style={styles.text}>{mainWish}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Намисленото желание (Свещта)</Text>
        <Text style={styles.highlightText}>"{wishFromCandle}"</Text>
      </View>

      {secretJoke && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Скреч тайната</Text>
          <Text style={styles.text}>{secretJoke}</Text>
        </View>
      )}

      {/* КАПСУЛА НА ВРЕМЕТО (ВЪПРОСИ И ОТГОВОРИ) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Личен Дневник</Text>
        {capsuleAnswers.map((item, i) => (
          <View key={i} style={styles.journalRow} wrap={false}>
            <Text style={styles.journalQ}>{item.question}</Text>
            <Text style={styles.journalA}>{item.answer}</Text>
          </View>
        ))}
      </View>

      {/* КИНЕМАТОГРАФСКИ СПОМЕНИ (СНИМКИ) */}
      {photos && photos.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Запечатани кадри</Text>
          <View style={styles.photoGrid}>
            {photos.map((url, i) => (
              <FilmStrip key={i} src={url} />
            ))}
          </View>
        </View>
      )}

      {/* ДОЛЕН КОПИРАЙТ, КОЙТО СТОИ НА ВСЯКА СТРАНИЦА */}
      <Text style={styles.footerText} fixed>
        GREETING ARCHIVE © 2026
      </Text>

    </Page>
  </Document>
);

export default TimeCapsulePdf;