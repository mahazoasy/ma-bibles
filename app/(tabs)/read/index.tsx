import React, { useCallback } from 'react';
import { View, Text, SectionList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useBibleData } from '../../../src/hooks/useBibleData';
import { oldTestamentCategories, newTestamentCategories } from '../../../src/utils/bookCategories';
import { Ionicons } from '@expo/vector-icons';

// Typage des éléments de la liste
interface BookItem {
  nom: string;
  abrev: string;
  chapitres: { numero: number }[];
  testament: 'ancien' | 'nouveau';
}

interface Section {
  title: string;
  data: BookItem[];
  testament: string;
}

export default function BooksList() {
  const { bible } = useBibleData();
  const router = useRouter();

  if (!bible) {
    return (
      <View style={styles.center}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  // Construire les sections avec catégories
  const sections: Section[] = [];

  // Ancien Testament
  const oldBooks = bible.livres.filter(b => b.testament === 'ancien');
  for (const [category, bookNames] of Object.entries(oldTestamentCategories)) {
    const booksInCat = oldBooks.filter(b => bookNames.includes(b.nom));
    if (booksInCat.length > 0) {
      sections.push({ title: category, data: booksInCat, testament: 'ancien' });
    }
  }

  // Nouveau Testament
  const newBooks = bible.livres.filter(b => b.testament === 'nouveau');
  for (const [category, bookNames] of Object.entries(newTestamentCategories)) {
    const booksInCat = newBooks.filter(b => bookNames.includes(b.nom));
    if (booksInCat.length > 0) {
      sections.push({ title: category, data: booksInCat, testament: 'nouveau' });
    }
  }

  const renderBook = useCallback(({ item }: { item: BookItem }) => (
    <TouchableOpacity
      style={styles.bookItem}
      onPress={() => router.push(`/(tabs)/read/${item.nom}/${item.chapitres[0]?.numero || 1}`)}
    >
      <View style={styles.bookLeft}>
        <Text style={styles.bookAbrev}>{item.abrev}</Text>
        <Text style={styles.bookName}>{item.nom}</Text>
      </View>
      <View style={styles.bookRight}>
        <Text style={styles.bookChapters}>{item.chapitres.length} chapitres</Text>
        <Ionicons name="chevron-forward" size={20} color="#8b5a2b" />
      </View>
    </TouchableOpacity>
  ), [router]);

  const renderSectionHeader = useCallback(({ section }: { section: Section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  ), []);

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.nom}
        renderItem={renderBook}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={false}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef7e8' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 16, paddingBottom: 40 },
  sectionHeader: { backgroundColor: '#f0e4d0', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12, marginBottom: 8, marginTop: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#5a3e1b', letterSpacing: 0.5 },
  bookItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#ebdfc9' },
  bookLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bookAbrev: { fontSize: 16, fontWeight: 'bold', color: '#8b5a2b', width: 40 },
  bookName: { fontSize: 18, fontFamily: 'Georgia', color: '#2c2418' },
  bookRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  bookChapters: { fontSize: 14, color: '#b88b5a' },
});