import { useState, useEffect } from 'react';
import { View, TextInput, FlatList, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useBibleData } from '../../src/hooks/useBibleData';
import { VerseItem } from '../../src/components/VerseItem';
import { useRouter } from 'expo-router';

type SearchResult = { book: string; chapter: number; verse: number; text: string; reference: string };

export default function SearchScreen() {
  const { searchBible, isLoading } = useBibleData();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filter, setFilter] = useState<'all' | 'ancien' | 'nouveau'>('all');
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        const all = searchBible(query);
        if (filter !== 'all') {
          const ancientBooks = ['Genèse','Exode','Lévitique','Nombres','Deutéronome','Josué','Juges','Ruth','1 Samuel','2 Samuel','1 Rois','2 Rois','1 Chroniques','2 Chroniques','Esdras','Néhémie','Esther','Job','Psaumes','Proverbes','Ecclésiaste','Cantique','Ésaïe','Jérémie','Lamentations','Ézéchiel','Daniel','Osée','Joël','Amos','Abdias','Jonas','Michée','Nahum','Habakuk','Sophonie','Aggée','Zacharie','Malachie'];
          const newBooks = ['Matthieu','Marc','Luc','Jean','Actes','Romains','1 Corinthiens','2 Corinthiens','Galates','Éphésiens','Philippiens','Colossiens','1 Thessaloniciens','2 Thessaloniciens','1 Timothée','2 Timothée','Tite','Philémon','Hébreux','Jacques','1 Pierre','2 Pierre','1 Jean','2 Jean','3 Jean','Jude','Apocalypse'];
          setResults(all.filter(r => filter === 'ancien' ? ancientBooks.includes(r.book) : newBooks.includes(r.book)));
        } else setResults(all);
      } else setResults([]);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, filter]);

  return (
    <View style={styles.container}>
      <TextInput style={styles.searchInput} placeholder="Rechercher un mot, une expression..." value={query} onChangeText={setQuery} />
      <View style={styles.filterBar}>
        {(['all','ancien','nouveau'] as const).map(f => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)} style={[styles.filterChip, filter===f && styles.filterChipActive]}>
            <Text style={[styles.filterText, filter===f && styles.filterTextActive]}>{f==='all'?'Tous':f==='ancien'?'Ancien Testament':'Nouveau Testament'}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {isLoading && <ActivityIndicator size="large" color="#8b5a2b" />}
      {results.length>0 && <Text style={styles.resultCount}>{results.length} résultat(s)</Text>}
      <FlatList data={results} keyExtractor={(_,i)=>i.toString()} renderItem={({item}) => (
        <VerseItem reference={`${item.book} ${item.chapter}:${item.verse}`} text={item.text} onPress={() => router.push(`/(tabs)/read/${item.book}/${item.chapter}`)} highlight={query} />
      )} ListEmptyComponent={query.length>=2 && !isLoading ? <Text style={styles.empty}>Aucun verset trouvé</Text> : null} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fef7e8', padding:16 },
  searchInput: { backgroundColor:'#fff8f0', borderRadius:30, paddingHorizontal:20, paddingVertical:12, fontSize:16, borderWidth:1, borderColor:'#ebdfc9', marginBottom:12 },
  filterBar: { flexDirection:'row', gap:10, marginBottom:16, flexWrap:'wrap' },
  filterChip: { paddingHorizontal:16, paddingVertical:8, borderRadius:30, backgroundColor:'#f0e4d0' },
  filterChipActive: { backgroundColor:'#8b5a2b' },
  filterText: { color:'#5a3e1b' },
  filterTextActive: { color:'#fff' },
  resultCount: { fontSize:14, color:'#8b5a2b', marginBottom:8 },
  empty: { textAlign:'center', marginTop:40, color:'#a07a52', fontSize:16 },
});
