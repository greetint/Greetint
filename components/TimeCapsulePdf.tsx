'use client';

import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';

// Връщаме стабилния шрифт, за да избегнем CORS грешките. 
// ЗА РЪКОПИСЕН ШРИФТ: Изтегли Caveat.ttf, сложи го в папка /public/fonts/ и промени src на '/fonts/Caveat.ttf'
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 'normal' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf', fontStyle: 'italic' }
  ]
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 120, 
    paddingBottom: 80,
    paddingHorizontal: 60,
    fontFamily: 'Roboto', // Промени на 'Caveat', ако го заредиш локално
    backgroundColor: '#FDFBF7', // Застраховка, ако снимката-фон не се зареди
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#635E57',
  },
  senderText: {
    fontSize: 12,
    color: '#958679',
    marginTop: 4,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 10,
    color: '#958679',
    borderBottomWidth: 1,
    borderBottomColor: '#DBCEB3',
    paddingBottom: 2,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  text: {
    fontSize: 14,
    color: '#3A322D',
    lineHeight: 1.4,
    fontStyle: 'italic',
  },
  highlightText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F1A17',
    lineHeight: 1.3,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 10,
  },
  filmFrame: {
    width: '45%',
    backgroundColor: '#141210',
    padding: 6,
    borderRadius: 2,
    margin: 5,
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
  journalRow: {
    marginBottom: 8,
  },
  journalQ: {
    fontSize: 12,
    color: '#7A6C5E',
    fontWeight: 'bold',
  },
  journalA: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#1F1A17',
    marginTop: 2,
  },
  footerText: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 8,
    color: '#958679',
    letterSpacing: 2,
  },
});

interface PdfProps {
  recipient?: string;
  sender?: string;
  statusText?: string;
  secretJoke?: string;
  mainWish?: string;
  wishFromCandle?: string;
  capsuleAnswers?: { question: string; answer: string }[];
  photos?: string[];
}

const FilmStrip = ({ src }: { src: string }) => (
  <View style={styles.filmFrame}>
    <View style={styles.filmHolesRow}>
      {[...Array(7)].map((_, i) => <View key={`top-${i}`} style={styles.hole} />)}
    </View>
    <Image src={src || ''} style={styles.filmImage} />
    <View style={styles.filmHolesRowBottom}>
      {[...Array(7)].map((_, i) => <View key={`bot-${i}`} style={styles.hole} />)}
    </View>
  </View>
);

export const TimeCapsulePdf = ({
  recipient = 'Получател',
  sender = 'Подател',
  statusText = '',
  secretJoke = '',
  mainWish = '',
  wishFromCandle = '',
  capsuleAnswers = [],
  photos = []
}: PdfProps) => (
  <Document>
    <Page size="A4" style={styles.page} wrap={true}>
      
      {/* ФОН. Ако файлът pdf-background.jpg липсва, този ред може да даде грешка. */}
      {/* Увери се, че снимката е точно в папка public/images/pdf-background.jpg */}
      <Image src="/images/pdf-background.jpg" style={styles.background} fixed />

      <View style={styles.header}>
        <Text style={styles.recipientTitle}>За {recipient}</Text>
        <Text style={styles.senderText}>от {sender}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Скрито послание</Text>
        <Text style={styles.text}>{mainWish || 'Няма оставено послание.'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Намисленото желание (Свещта)</Text>
        <Text style={styles.highlightText}>"{wishFromCandle || 'Запазено в тайна...'}"</Text>
      </View>

      {secretJoke ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Скреч тайната</Text>
          <Text style={styles.text}>{secretJoke}</Text>
        </View>
      ) : null}

      {capsuleAnswers && capsuleAnswers.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Личен Дневник</Text>
          {capsuleAnswers.map((item, i) => (
            <View key={i} style={styles.journalRow} wrap={false}>
              <Text style={styles.journalQ}>{item.question || 'Въпрос'}</Text>
              <Text style={styles.journalA}>{item.answer || 'Без отговор'}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {photos && photos.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Запечатани кадри</Text>
          <View style={styles.photoGrid}>
            {photos.map((url, i) => (
              <FilmStrip key={i} src={url} />
            ))}
          </View>
        </View>
      ) : null}

      <Text style={styles.footerText} fixed>
        GREETING ARCHIVE © 2026
      </Text>

    </Page>
  </Document>
);

export default TimeCapsulePdf;