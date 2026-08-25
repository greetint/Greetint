'use client';

import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';

// РЕГИСТРИРАНЕ НА КИРИЛСКИ ШРИФТ ЗА PDF (За да няма йероглифи)
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
    padding: 40,
    backgroundColor: '#FEFEFD',
    fontFamily: 'Roboto',
    color: '#1F1A17',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#DBCEB3',
    paddingBottom: 12,
  },
  logo: {
    fontSize: 22,
    letterSpacing: 3,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 8,
    letterSpacing: 2,
    color: '#958679',
  },
  sectionTitle: {
    fontSize: 10,
    letterSpacing: 2,
    color: '#958679',
    marginBottom: 6,
    fontWeight: 'bold',
  },
  box: {
    backgroundColor: '#F7F4EF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#958679',
  },
  statusText: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#635E57',
    lineHeight: 1.4,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  photoContainer: {
    width: '48%',
    height: 130,
    backgroundColor: '#EFECE6',
    borderRadius: 6,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  letterText: {
    fontSize: 11,
    lineHeight: 1.5,
    color: '#1F1A17',
  },
  answersList: {
    gap: 6,
    marginTop: 6,
  },
  answerItem: {
    fontSize: 10,
    color: '#635E57',
    borderBottomWidth: 0.5,
    borderBottomColor: '#DBCEB3',
    paddingBottom: 3,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#DBCEB3',
    paddingTop: 8,
  },
});

interface PdfProps {
  recipient: string;
  sender: string;
  statusText: string;
  secretJoke: string;
  mainWish: string;
  wishFromCandle: string;
  capsuleAnswers: string[];
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
    
    {/* СТРАНИЦА 1: ЕСТЕТИКА & СПОМЕНИ */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.logo}>GREETINT</Text>
        <Text style={styles.subtitle}>TIME CAPSULE // OFFICIAL ARCHIVE 2026</Text>
      </View>

      <View style={{ marginBottom: 15 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 2 }}>За {recipient}</Text>
        <Text style={{ fontSize: 10, color: '#958679' }}>От {sender}</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.sectionTitle}>Статут 2026</Text>
        <Text style={styles.statusText}>"{statusText || 'Без въведен статут'}"</Text>
      </View>

      <View style={styles.box}>
        <Text style={styles.sectionTitle}>Разкритият Спомен 🤫</Text>
        <Text style={styles.statusText}>"{secretJoke || 'Без въведена тайна'}"</Text>
      </View>

      <Text style={styles.sectionTitle}>Фото Архив</Text>
      <View style={styles.galleryGrid}>
        {photos.slice(0, 4).map((url, i) => (
          <View key={i} style={styles.photoContainer}>
            <Image src={url} style={styles.photo} />
          </View>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={{ fontSize: 8, color: '#958679' }}>СТРАНИЦА 1 ОТ 2</Text>
        <Text style={{ fontSize: 8, color: '#958679' }}>GREETINT.COM</Text>
      </View>
    </Page>

    {/* СТРАНИЦА 2: ПИСМО & БЪДЕЩЕ */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.logo}>GREETINT</Text>
        <Text style={styles.subtitle}>PERSONAL LETTER & FUTURE CAPSULE</Text>
      </View>

      <Text style={styles.sectionTitle}>Лично Пожелание</Text>
      <View style={styles.box}>
        <Text style={styles.letterText}>{mainWish || 'Честит Рожден Ден!'}</Text>
      </View>

      <Text style={styles.sectionTitle}>Тайно Желание за Новата Възраст</Text>
      <View style={[styles.box, { marginBottom: 15 }]}>
        <Text style={styles.statusText}>"{wishFromCandle || 'Запазено в тайна...'}"</Text>
      </View>

      <Text style={styles.sectionTitle}>7-те Отговора за Бъдещето</Text>
      <View style={styles.answersList}>
        {capsuleAnswers.map((ans, i) => (
          <Text key={i} style={styles.answerItem}>
            <Text style={{ fontWeight: 'bold' }}>{i + 1}. </Text>{ans || 'Няма отговор'}
          </Text>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={{ fontSize: 8, color: '#958679' }}>СТРАНИЦА 2 ОТ 2</Text>
        <Text style={{ fontSize: 8, color: '#958679' }}>ЗАПАЗИ ЗА ИСТОРИЯТА ✨</Text>
      </View>
    </Page>

  </Document>
);