'use client';

import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';

// РЕГИСТРИРАНЕ НА КИРИЛСКИ ШРИФТ ЗА PDF
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
    padding: 35,
    backgroundColor: '#FDFBF7', // Винтидж пергаментов цвят
    fontFamily: 'Roboto',
    color: '#1F1A17',
  },
  borderFrame: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    bottom: 20,
    borderWidth: 1,
    borderColor: '#D4AF37', // Златист кант
    borderRadius: 6,
  },
  header: {
    textAlign: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#DBCEB3',
  },
  logo: {
    fontSize: 20,
    letterSpacing: 4,
    fontWeight: 'bold',
    color: '#1F1A17',
  },
  subtitle: {
    fontSize: 7,
    letterSpacing: 3,
    color: '#958679',
    marginTop: 2,
  },
  titleContainer: {
    textAlign: 'center',
    marginBottom: 18,
  },
  recipientTitle: {
    fontSize: 20,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: '#1F1A17',
  },
  senderText: {
    fontSize: 9,
    color: '#958679',
    letterSpacing: 1,
    marginTop: 2,
  },
  storyBlock: {
    backgroundColor: '#F7F4EF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#D4AF37',
  },
  storyTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 2,
    color: '#8A7C6E',
    marginBottom: 4,
  },
  storyText: {
    fontSize: 10.5,
    fontStyle: 'italic',
    color: '#3A322D',
    lineHeight: 1.4,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 10,
  },
  photoWrapper: {
    width: '48%',
    height: 115,
    backgroundColor: '#EFECE6',
    borderRadius: 6,
    padding: 4,
    borderWidth: 0.5,
    borderColor: '#DBCEB3',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: 4,
  },
  journalRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E6D9C3',
    paddingBottom: 5,
    marginBottom: 6,
  },
  journalQ: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#7A6C5E',
    width: '45%',
  },
  journalA: {
    fontSize: 9.5,
    fontStyle: 'italic',
    color: '#1F1A17',
    width: '55%',
  },
  footer: {
    position: 'absolute',
    bottom: 28,
    left: 35,
    right: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#DBCEB3',
    paddingTop: 6,
  },
  footerText: {
    fontSize: 7,
    letterSpacing: 1.5,
    color: '#958679',
  },
});

interface PdfProps {
  recipient: string;
  sender: string;
  statusText: string;
  secretJoke: string;
  mainWish: string;
  wishFromCandle: string;
  capsuleAnswers: { question: string; answer: string }[];
  photos: string[];
}

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
    
    {/* СТРАНИЦА 1: НАЧАЛО, ИСТОРИЯ, СПОМЕНИ И СНИМКИ */}
    <Page size="A4" style={styles.page}>
      <View style={styles.borderFrame} fixed />
      
      <View style={styles.header}>
        <Text style={styles.logo}>GREETING ARCHIVE</Text>
        <Text style={styles.subtitle}>ПРЕЖИВЯВАНЕ & СПОМЕНИ // 2026</Text>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.recipientTitle}>Специално за {recipient}</Text>
        <Text style={styles.senderText}>С любов от: {sender}</Text>
      </View>

      {/* Восъчен печат / Статут */}
      <View style={styles.storyBlock}>
        <Text style={styles.storyTitle}>✦ СТАТУТ И НАЧАЛО</Text>
        <Text style={styles.storyText}>"{statusText || 'Празничен дух и вдъхновение без граници!'}"</Text>
      </View>

      {/* Скреч тайна */}
      <View style={styles.storyBlock}>
        <Text style={styles.storyTitle}>✦ СКРИТАТА ТАЙНА ОТ СКРЕЧА</Text>
        <Text style={styles.storyText}>"{secretJoke || 'Лудите моменти винаги остават незабравими.'}"</Text>
      </View>

      {/* Снимки от галерията */}
      {photos && photos.length > 0 && (
        <View style={{ marginTop: 4 }}>
          <Text style={[styles.storyTitle, { marginBottom: 6 }]}>✦ ГАЛЕРИЯ СЪС СПОМЕНИ</Text>
          <View style={styles.photoGrid}>
            {photos.slice(0, 4).map((url, i) => (
              <View key={i} style={styles.photoWrapper}>
                <Image src={url} style={styles.photoImage} />
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.footer}>
        <Text style={styles.footerText}>СТРАНИЦА 1 ОТ 2</Text>
        <Text style={styles.footerText}>GREETING ARCHIVE © 2026</Text>
      </View>
    </Page>

    {/* СТРАНИЦА 2: ПОЖЕЛАНИЯ, СВЕЩ И КАПСУЛА НА ВРЕМЕТО (ДНЕВНИК) */}
    <Page size="A4" style={styles.page}>
      <View style={styles.borderFrame} fixed />

      <View style={styles.header}>
        <Text style={styles.logo}>GREETING ARCHIVE</Text>
        <Text style={styles.subtitle}>ЛИЧЕН ДНЕВНИК & КАПСУЛА НА БЪДЕЩЕТО</Text>
      </View>

      {/* Основно послание */}
      <View style={styles.storyBlock}>
        <Text style={styles.storyTitle}>✦ ПОСЛАНИЕ ОТ ПОДАРЯВАЩИЯ</Text>
        <Text style={styles.storyText}>{mainWish || 'Нека тази година ти донесе здраве, щастие и много сбъднати мечти!'}</Text>
      </View>

      {/* Желание при духване на свещта */}
      <View style={styles.storyBlock}>
        <Text style={styles.storyTitle}>✦ СЪКРОВЕНО ЖЕЛАНИЕ ПРИ ДУХВАНЕ НА СВЕЩТА</Text>
        <Text style={styles.storyText}>"{wishFromCandle || 'Запазено в тайна...'}"</Text>
      </View>

      {/* Отговори от дневника (Капсулата) */}
      <View style={{ marginTop: 6 }}>
        <Text style={[styles.storyTitle, { marginBottom: 8 }]}>✦ КАПСУЛА НА ВРЕМЕТО — ОТГОВОРИ</Text>
        <View>
          {capsuleAnswers.map((item, i) => (
            <View key={i} style={styles.journalRow}>
              <Text style={styles.journalQ}>{item.question}</Text>
              <Text style={styles.journalA}>"{item.answer}"</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>СТРАНИЦА 2 ОТ 2</Text>
        <Text style={styles.footerText}>ЗАПАЗЕНО ЗА БЪДЕЩЕТО ✨</Text>
      </View>
    </Page>

  </Document>
);

export default TimeCapsulePdf;