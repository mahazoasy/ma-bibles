import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useBibleData } from '../../src/hooks/useBibleData';
import { useLanguage } from '../../src/context/LanguageContext';

export default function SearchScreen() {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  const { searchBible } = useBibleData();
  const router = useRouter();

  const results = useMemo(() => {
    if (query.length < 2) return [];
    return searchBible(query);
  }, [query]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={t('search_placeholder')}
        value={query}
        onChangeText={setQuery}
        autoCapitalize="none"
      />
      {results.length === 0 && query.length > 1 && <Text style={styles.noResults}>{t('no_results')}</Text>}
      <FlatList
        data={results}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.resultItem} onPress={() => router.push(`/(tabs)/read/${item.book}/${item.chapter}`)}>
            <Text style={styles.resultRef}>{item.reference}</Text>
            <Text style={styles.resultText} numberOfLines={2}>{item.text}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef9ef', padding: 16 },
  input: { backgroundColor: '#fff', borderRadius: 12, padding: 12, fontSize: 16, borderWidth: 0.5, borderColor: '#e2cfbc', marginBottom: 12 },
  noResults: { textAlign: 'center', marginTop: 20, color: '#9b7a62' },
  resultItem: { paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#e2cfbc' },
  resultRef: { fontWeight: 'bold', color: '#6b4c3b', marginBottom: 4 },
  resultText: { fontSize: 15, color: '#2c1e16' },
});