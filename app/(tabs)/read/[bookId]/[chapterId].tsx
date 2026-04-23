import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useBibleData } from '../../../../src/hooks/useBibleData';
import { useFavorites } from '../../../../src/hooks/useFavorites';
import { useLastPosition } from '../../../../src/hooks/useLastPosition';
import { useLanguage } from '../../../../src/context/LanguageContext';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function ChapterScreen() {
  const { t } = useLanguage();
  const { bookId, chapterId } = useLocalSearchParams<{ bookId: string; chapterId: string }>();
  const router = useRouter();
  const { getChapter, getBook, getMaxChapter, bible, isLoading } = useBibleData();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { saveLastPosition } = useLastPosition();
  const [chapterData, setChapterData] = useState<any>(null);
  const [bookInfo, setBookInfo] = useState<any>(null);
  const [maxChapter, setMaxChapter] = useState(0);

  const chNum = parseInt(chapterId, 10);

  useEffect(() => {
    if (!bible || isLoading) return;
    const book = getBook(bookId);
    if (book) {
      setBookInfo(book);
      const max = getMaxChapter(bookId);
      setMaxChapter(max);
      const chap = getChapter(bookId, chNum);
      setChapterData(chap);
      saveLastPosition(bookId, book.nom, chNum);
    } else {
      Alert.alert(t('error'), 'Livre introuvable');
    }
  }, [bible, isLoading, bookId, chNum]);

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
    else Alert.alert(t('error'), 'Début du livre');
  };

  const goToNext = () => {
    if (chNum < maxChapter) router.push(`/(tabs)/read/${bookId}/${chNum + 1}`);
    else Alert.alert(t('error'), 'Fin du livre');
  };

  if (isLoading || !chapterData) return <View style={styles.loading}><Text>{t('loading')}</Text></View>;

  return (
    <View style={styles.container}>
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={goToPrev}><Ionicons name="chevron-back" size={28} color="#8b5a2b" /></TouchableOpacity>
        <Text style={styles.title}>{bookInfo?.nom} - {t('chapter')} {chNum}</Text>
        <TouchableOpacity onPress={goToNext}><Ionicons name="chevron-forward" size={28} color="#8b5a2b" /></TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.versesContainer}>
        {chapterData.versets.map((verse: any) => {
          const ref = `${bookId} ${chNum}:${verse.numero}`;
          const favorited = isFavorite(ref);
          return (
            <TouchableOpacity
              key={verse.numero}
              onLongPress={() => toggleFavorite(verse.numero, verse.texte)}
              style={[styles.verseRow, favorited && styles.favoritedVerse]}
            >
              <Text style={styles.verseNumber}>{verse.numero}</Text>
              <Text style={styles.verseText}>{verse.texte}</Text>
              {favorited && <Ionicons name="bookmark" size={20} color="#d4a373" />}
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
  navHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#f5ede4', borderBottomWidth: 1, borderColor: '#e2d4c8' },
  title: { fontSize: 18, fontFamily: 'Georgia', color: '#4a2e24', fontWeight: '500' },
  versesContainer: { padding: 16 },
  verseRow: { flexDirection: 'row', marginBottom: 18, alignItems: 'flex-start' },
  verseNumber: { width: 32, fontSize: 14, color: '#b28b6f', marginRight: 8, fontWeight: 'bold' },
  verseText: { flex: 1, fontSize: 18, fontFamily: 'Georgia', color: '#2c1e16', lineHeight: 26 },
  favoritedVerse: { backgroundColor: '#fff0e0', borderRadius: 8, padding: 8, marginHorizontal: -8 },
});