import React, { useState, useMemo, useCallback } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useBibleData } from '../../src/hooks/useBibleData';
import { useFavorites } from '../../src/hooks/useFavorites';
import { useLanguage } from '../../src/context/LanguageContext';

// Composant mémorisé pour chaque résultat avec surlignage
const ResultItem = React.memo(({ item, onPress, onLongPress, query }: any) => {
  const highlightText = (text: string, q: string) => {
    if (!q) return text;
    const regex = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      part && part.toLowerCase() === q.toLowerCase() ? (
        <Text key={i} style={styles.highlight}>{part}</Text>
      ) : (
        <Text key={i}>{part}</Text>
      )
    );
  };

  return (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      <Text style={styles.resultRef}>{item.reference}</Text>
      <Text style={styles.resultText} numberOfLines={2}>
        {highlightText(item.text, query)}
      </Text>
    </TouchableOpacity>
  );
});

export default function SearchScreen() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [testamentFilter, setTestamentFilter] = useState<'all' | 'ancien' | 'nouveau'>('all');
  const { searchBible, bible } = useBibleData();
  const { addFavorite, isFavorite } = useFavorites();
  const router = useRouter();

  const results = useMemo(() => {
    if (query.length < 2) return [];
    let res = searchBible(query);
    if (testamentFilter !== 'all') {
      res = res.filter(r => {
        const book = bible?.livres.find(b => b.nom === r.book);
        return book?.testament === testamentFilter;
      });
    }
    return res;
  }, [query, testamentFilter, bible, searchBible]);

  const handlePress = useCallback((item: any) => {
    router.push(`/(tabs)/read/${item.book}/${item.chapter}`);
  }, [router]);

  const handleLongPress = useCallback((item: any) => {
    const ref = `${item.book} ${item.chapter}:${item.verse}`;
    if (isFavorite(ref)) {
      Alert.alert(t('info'), t('already_favorite'));
    } else {
      addFavorite({
        id: ref,
        book: item.book,
        chapter: item.chapter,
        verse: item.verse,
        text: item.text,
        addedAt: Date.now(),
      });
      Alert.alert(t('success'), t('favorite_added'));
    }
  }, [addFavorite, isFavorite, t]);

  const renderItem = useCallback(({ item }: any) => (
    <ResultItem
      item={item}
      onPress={() => handlePress(item)}
      onLongPress={() => handleLongPress(item)}
      query={query}
    />
  ), [handlePress, handleLongPress, query]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={t('search_placeholder')}
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
      />
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, testamentFilter === 'all' && styles.filterActive]}
          onPress={() => setTestamentFilter('all')}
        >
          <Text style={styles.filterText}>{t('filter_all')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, testamentFilter === 'ancien' && styles.filterActive]}
          onPress={() => setTestamentFilter('ancien')}
        >
          <Text style={styles.filterText}>{t('filter_old')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, testamentFilter === 'nouveau' && styles.filterActive]}
          onPress={() => setTestamentFilter('nouveau')}
        >
          <Text style={styles.filterText}>{t('filter_new')}</Text>
        </TouchableOpacity>
      </View>
      {results.length === 0 && query.length > 1 && <Text style={styles.noResults}>{t('no_results')}</Text>}
      <FlatList
        data={results}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={renderItem}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef9ef', padding: 16 },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 12, fontSize: 16, borderWidth: 0.5, borderColor: '#e2cfbc', marginBottom: 12 },
  filterRow: { flexDirection: 'row', gap: 12, marginBottom: 16, justifyContent: 'center' },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 30, backgroundColor: '#e8ddd0' },
  filterActive: { backgroundColor: '#8b5a2b' },
  filterText: { color: '#fff', fontWeight: '500' },
  noResults: { textAlign: 'center', marginTop: 20, color: '#9b7a62' },
  resultItem: { paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#e2cfbc' },
  resultRef: { fontWeight: 'bold', color: '#6b4c3b', marginBottom: 4 },
  resultText: { fontSize: 15, color: '#2c1e16', lineHeight: 22 },
  highlight: { backgroundColor: '#ffecb3', fontWeight: 'bold', color: '#b76e2e' },
});