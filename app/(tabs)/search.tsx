import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useBibleData } from '../../src/hooks/useBibleData';
import { useLanguage } from '../../src/context/LanguageContext';

export default function SearchScreen() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const [testamentFilter, setTestamentFilter] = useState<'all' | 'ancien' | 'nouveau'>('all');
  const { searchBible, bible } = useBibleData();
  const router = useRouter();

  const results = useMemo(() => {
    if (query.length < 2) return [];
    let results = searchBible(query);
    if (testamentFilter !== 'all') {
      results = results.filter(r => {
        const book = bible?.livres.find(b => b.nom === r.book);
        return book?.testament === testamentFilter;
      });
    }
    return results;
  }, [query, testamentFilter, bible]);

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
        <TouchableOpacity style={[styles.filterChip, testamentFilter === 'all' && styles.filterActive]} onPress={() => setTestamentFilter('all')}>
          <Text style={styles.filterText}>{t('filter_all')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterChip, testamentFilter === 'ancien' && styles.filterActive]} onPress={() => setTestamentFilter('ancien')}>
          <Text style={styles.filterText}>{t('filter_old')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.filterChip, testamentFilter === 'nouveau' && styles.filterActive]} onPress={() => setTestamentFilter('nouveau')}>
          <Text style={styles.filterText}>{t('filter_new')}</Text>
        </TouchableOpacity>
      </View>
      {results.length === 0 && query.length > 1 && <Text style={styles.noResults}>{t('no_results')}</Text>}
      <FlatList
        data={results}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.resultItem} onPress={() => router.push(`/(tabs)/read/${item.book}/${item.chapter}`)}>
            <Text style={styles.resultRef}>{item.reference}</Text>
            <Text style={styles.resultText} numberOfLines={2} ellipsizeMode="tail">
              {highlightText(item.text, query)}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const highlightText = (text: string, query: string) => {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? <Text key={i} style={styles.highlight}>{part}</Text> : <Text key={i}>{part}</Text>
  );
};

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