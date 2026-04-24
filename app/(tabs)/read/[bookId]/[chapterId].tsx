import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useBibleData } from '../../../../src/hooks/useBibleData';
import { useFavorites } from '../../../../src/hooks/useFavorites';
import { useLastPosition } from '../../../../src/hooks/useLastPosition';
import { useReadingHistory } from '../../../../src/hooks/useReadingHistory';
import { useLanguage } from '../../../../src/context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';

export default function ChapterScreen() {
  const { t } = useLanguage();
  const params = useLocalSearchParams<{ bookId: string; chapterId: string }>();
  const bookId = Array.isArray(params.bookId) ? params.bookId[0] : params.bookId;
  const chapterId = Array.isArray(params.chapterId) ? params.chapterId[0] : params.chapterId;
  const router = useRouter();
  const { getChapter, getBook, getMaxChapter, bible, isLoading, totalChapters } = useBibleData();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { saveLastPosition } = useLastPosition();
  const { markChapterAsRead } = useReadingHistory(totalChapters);
  const [chapterData, setChapterData] = useState<any>(null);
  const [bookInfo, setBookInfo] = useState<any>(null);
  const [maxChapter, setMaxChapter] = useState(0);
  const [chapterTitle, setChapterTitle] = useState('');
  const [selectedVerses, setSelectedVerses] = useState<Set<number>>(new Set());

  const chNum = parseInt(chapterId, 10);

  useEffect(() => {
    if (!bible || isLoading) return;
    const book = getBook(bookId);
    if (book) {
      setBookInfo(book);
      setMaxChapter(getMaxChapter(bookId));
      const chap = getChapter(bookId, chNum);
      setChapterData(chap);
      saveLastPosition(bookId, book.nom, chNum);
      markChapterAsRead(bookId, chNum);
    } else {
      Alert.alert(t('error'), 'Livre introuvable');
    }
  }, [bible, isLoading, bookId, chNum]);

  useEffect(() => {
    if (chapterData && chapterData.versets && chapterData.versets.length > 0) {
      const firstVerse = chapterData.versets[0].texte;
      if (firstVerse && firstVerse.length < 60 && !firstVerse.includes('et') && !firstVerse.includes('Car')) {
        setChapterTitle(firstVerse);
      } else {
        setChapterTitle(`${t('chapter')} ${chNum}`);
      }
    }
  }, [chapterData, chNum, t]);

  const toggleSelection = (verseNum: number) => {
    setSelectedVerses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(verseNum)) newSet.delete(verseNum);
      else newSet.add(verseNum);
      return newSet;
    });
  };

  const addSelectedToFavorites = () => {
    if (selectedVerses.size === 0) {
      Alert.alert(t('info'), 'Aucun verset sélectionné');
      return;
    }
    const versetsToAdd = chapterData.versets.filter((v: any) => selectedVerses.has(v.numero));
    let addedCount = 0;
    for (const verse of versetsToAdd) {
      const ref = `${bookId} ${chNum}:${verse.numero}`;
      if (!isFavorite(ref)) {
        addFavorite({
          id: ref,
          book: bookId,
          chapter: chNum,
          verse: verse.numero,
          text: verse.texte,
          addedAt: Date.now(),
        });
        addedCount++;
      }
    }
    Alert.alert(t('success'), `${addedCount} verset(s) ajouté(s) aux favoris`);
    setSelectedVerses(new Set());
  };

  const toggleFavorite = (verseNum: number, verseText: string) => {
    const ref = `${bookId} ${chNum}:${verseNum}`;
    if (isFavorite(ref)) {
      removeFavorite(ref);
    } else {
      addFavorite({
        id: ref,
        book: bookId,
        chapter: chNum,
        verse: verseNum,
        text: verseText,
        addedAt: Date.now(),
      });
    }
  };

  const goToPrev = () => {
    if (chNum > 1) router.push(`/(tabs)/read/${bookId}/${chNum - 1}`);
    else Alert.alert(t('info'), 'Début du livre');
  };

  const goToNext = () => {
    if (chNum < maxChapter) router.push(`/(tabs)/read/${bookId}/${chNum + 1}`);
    else Alert.alert(t('info'), 'Fin du livre');
  };

  if (isLoading || !chapterData) return <View style={styles.loading}><Text>{t('loading')}</Text></View>;

  const hasSelected = selectedVerses.size > 0;

  return (
    <View style={styles.container}>
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={goToPrev}><Ionicons name="chevron-back" size={28} color="#8b5a2b" /></TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.bookTitle}>{bookInfo?.nom}</Text>
          {chapterTitle && <Text style={styles.chapterSubtitle}>{chapterTitle}</Text>}
          <Text style={styles.chapterProgress}>Chapitre {chNum} / {maxChapter}</Text>
        </View>
        <TouchableOpacity onPress={goToNext}><Ionicons name="chevron-forward" size={28} color="#8b5a2b" /></TouchableOpacity>
      </View>

      {hasSelected && (
        <TouchableOpacity style={styles.addSelectedButton} onPress={addSelectedToFavorites}>
          <Ionicons name="heart" size={20} color="#fff" />
          <Text style={styles.addSelectedText}>Ajouter {selectedVerses.size} verset(s) aux favoris</Text>
        </TouchableOpacity>
      )}

      <ScrollView contentContainerStyle={styles.versesContainer}>
        {chapterData.versets.map((verse: any) => {
          const ref = `${bookId} ${chNum}:${verse.numero}`;
          const favorited = isFavorite(ref);
          const isSelected = selectedVerses.has(verse.numero);
          return (
            <TouchableOpacity
              key={verse.numero}
              onPress={() => toggleSelection(verse.numero)}
              onLongPress={() => toggleFavorite(verse.numero, verse.texte)}
              style={[
                styles.verseRow,
                favorited && styles.favoritedVerse,
                isSelected && styles.selectedVerse
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.verseNumber}>{verse.numero}</Text>
              <Text style={styles.verseText}>{verse.texte}</Text>
              {favorited && <Ionicons name="bookmark" size={20} color="#d4a373" />}
              {isSelected && !favorited && <Ionicons name="checkbox-outline" size={20} color="#8b5a2b" />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fffaf5' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  navHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f5ede4',
    borderBottomWidth: 1,
    borderColor: '#e2d4c8',
  },
  headerCenter: { alignItems: 'center', flex: 1 },
  bookTitle: { fontSize: 16, fontWeight: 'bold', color: '#5a3e1b', fontFamily: 'Georgia' },
  chapterSubtitle: { fontSize: 12, color: '#8b5a2b', marginTop: 2, fontStyle: 'italic' },
  chapterProgress: { fontSize: 11, color: '#b88b5a', marginTop: 2 },
  versesContainer: { padding: 16 },
  verseRow: { flexDirection: 'row', marginBottom: 18, alignItems: 'flex-start', paddingVertical: 4 },
  verseNumber: { width: 32, fontSize: 14, color: '#b28b6f', marginRight: 8, fontWeight: 'bold' },
  verseText: { flex: 1, fontSize: 18, fontFamily: 'Georgia', color: '#2c1e16', lineHeight: 26 },
  favoritedVerse: { backgroundColor: '#fff0e0', borderRadius: 8, padding: 8, marginHorizontal: -8 },
  selectedVerse: { backgroundColor: '#ffe6b3', borderRadius: 8, padding: 8, marginHorizontal: -8 },
  addSelectedButton: {
    flexDirection: 'row',
    backgroundColor: '#8b5a2b',
    margin: 16,
    padding: 12,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  addSelectedText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});