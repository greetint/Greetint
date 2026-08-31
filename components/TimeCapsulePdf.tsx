'use client';

import React from 'react';
import { Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 50,
    paddingHorizontal: 40,
    backgroundColor: '#FDFBF7',
  },
  topFlapContainer: {
    width: '100%',
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  seal: {
    width: 45,
    height: 45,
  },
  contentContainer: {
    paddingHorizontal: 20,
    zIndex: 5,
  },
  title: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 22,
    color: '#3A322D',
    textAlign: 'center',
    marginBottom: 15,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#958679',
    marginBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#DBCEB3',
    paddingBottom: 2,
  },
  textContent: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 13,
    color: '#1F1A17',
    lineHeight: 1.3,
  },
  journalBlock: {
    marginBottom: 6,
  },
  journalQ: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 9,
    color: '#635E57',
    marginBottom: 1,
  },
  journalA: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 12,
    color: '#1F1A17',
    lineHeight: 1.2,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 8,
    gap: 8,
  },
  filmFrame: {
    width: '45%',
    backgroundColor: '#141210',
    padding: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  filmHolesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  filmHolesRowBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  hole: {
    width: 4,
    height: 2,
    backgroundColor: '#FEFEFD',
    borderRadius: 1,
  },
  filmImage: {
    width: '100%',
    height: 80,
    objectFit: 'cover',
    borderWidth: 1,
    borderColor: '#3A322D',
  },
  footer: {
    position: 'absolute',
    bottom: 15,
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
  const rotations = [-3, 4, -2, 3]; 

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap={true}>
        
        {/* Използваме директен публичен път без window.location */}
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
            <Text style={[styles.textContent, { textAlign: 'right', fontFamily: 'Helvetica-Bold' }]}>
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