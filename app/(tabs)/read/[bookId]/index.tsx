import React, { useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useBibleData } from '../../../../src/hooks/useBibleData';
import { useLanguage } from '../../../../src/context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';

interface ChapterType {
  numero: number;
  versets: { numero: number; texte: string }[];
}

export default function ChaptersList() {
  const { bookId } = useLocalSearchParams<{ bookId: string }>();
  const router = useRouter();
  const { t } = useLanguage();
  const { getBook } = useBibleData();
  const book = getBook(bookId);

  if (!book) {
    return (
      <View style={styles.center}>
        <Text>{t('error')}</Text>
      </View>
    );
  }

  const chapters: ChapterType[] = book.chapitres;

  // Filtrer les chapitres invalides (numéro nul ou undefined)
  const validChapters = chapters.filter(ch => ch?.numero != null);

  const renderChapter = useCallback(({ item }: { item: ChapterType }) => {
    const firstVerse = item.versets?.[0]?.texte || '';
    const preview = firstVerse.length > 80 ? firstVerse.substring(0, 80) + '...' : firstVerse;
    const chapterNum = item.numero ?? 0;

    return (
      <TouchableOpacity
        style={styles.chapterItem}
        onPress={() => router.push(`/(tabs)/read/${bookId}/${chapterNum}`)}
      >
        <View style={styles.chapterLeft}>
          <Text style={styles.chapterNumber}>{t('chapter')} {chapterNum}</Text>
          <Text style={styles.chapterPreview} numberOfLines={2}>{preview}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#8b5a2b" />
      </TouchableOpacity>
    );
  }, [bookId, router, t]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.bookTitle}>{book.nom}</Text>
        <Text style={styles.chaptersCount}>{validChapters.length} {t('chapters_count')}</Text>
      </View>
      <FlatList
        data={validChapters}
        keyExtractor={(item) => String(item.numero ?? 'invalid')}
        renderItem={renderChapter}
        contentContainerStyle={styles.listContent}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef7e8' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#ebdfc9', backgroundColor: '#fff8f0' },
  bookTitle: { fontSize: 24, fontWeight: 'bold', color: '#5a3e1b', fontFamily: 'Georgia', textAlign: 'center' },
  chaptersCount: { fontSize: 14, color: '#8b5a2b', textAlign: 'center', marginTop: 4 },
  listContent: { padding: 16, paddingBottom: 40 },
  chapterItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#ebdfc9' },
  chapterLeft: { flex: 1, marginRight: 12 },
  chapterNumber: { fontSize: 18, fontWeight: '600', color: '#5a3e1b', marginBottom: 4 },
  chapterPreview: { fontSize: 14, color: '#6b4c2a', lineHeight: 20 },
});