import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useFavorites } from '../../src/hooks/useFavorites';
import { VerseItem } from '../../src/components/VerseItem';
import { useRouter } from 'expo-router';

export default function FavoritesScreen() {
  const { favorites, removeFavorite } = useFavorites();
  const router = useRouter();
  const sorted = [...favorites].sort((a,b)=>b.addedAt - a.addedAt);
  if (sorted.length===0) return <View style={styles.empty}><Text style={styles.emptyText}>Aucun favori</Text><Text style={styles.emptySub}>Appuyez sur un verset pour l'ajouter</Text></View>;
  return (
    <View style={styles.container}>
      <FlatList data={sorted} keyExtractor={item=>item.id} renderItem={({item}) => (
        <VerseItem reference={`${item.book} ${item.chapter}:${item.verse}`} text={item.text} onPress={()=>router.push(`/(tabs)/read/${item.book}/${item.chapter}`)} onRemove={()=>removeFavorite(item.id)} isFavorite />
      )} contentContainerStyle={styles.list} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fef7e8' },
  list: { padding:16 },
  empty: { flex:1, justifyContent:'center', alignItems:'center', padding:24 },
  emptyText: { fontSize:18, color:'#8b5a2b', marginBottom:8 },
  emptySub: { fontSize:14, color:'#c0a080', textAlign:'center' },
});
