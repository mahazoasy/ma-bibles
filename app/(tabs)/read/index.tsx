import { View, Text, SectionList, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useBibleData } from '../../../src/hooks/useBibleData';
import { Ionicons } from '@expo/vector-icons';

export default function BooksList() {
  const { bible } = useBibleData();
  const router = useRouter();
  if (!bible) return <View style={styles.center}><Text>Chargement...</Text></View>;
  const sections = [
    { title: 'Ancien Testament', data: bible.livres.filter(b=>b.testament==='ancien').map(b=>b.nom) },
    { title: 'Nouveau Testament', data: bible.livres.filter(b=>b.testament==='nouveau').map(b=>b.nom) },
  ];
  return (
    <View style={styles.container}>
      <SectionList sections={sections} keyExtractor={item=>item} renderItem={({item}) => {
        const book = bible.livres.find(b=>b.nom===item);
        return (
          <TouchableOpacity style={styles.bookItem} onPress={()=>router.push(`/(tabs)/read/${item}/${book?.chapitres[0]?.numero||1}`)}>
            <Text style={styles.bookName}>{item}</Text>
            <Ionicons name="chevron-forward" size={20} color="#8b5a2b" />
          </TouchableOpacity>
        );
      }} renderSectionHeader={({section:{title}})=><View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{title}</Text></View>} contentContainerStyle={styles.listContent} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fef7e8' },
  center: { flex:1, justifyContent:'center', alignItems:'center' },
  listContent: { padding:16 },
  sectionHeader: { backgroundColor:'#f0e4d0', paddingVertical:8, paddingHorizontal:16, borderRadius:12, marginBottom:8, marginTop:12 },
  sectionTitle: { fontSize:20, fontWeight:'600', color:'#5a3e1b' },
  bookItem: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingVertical:14, paddingHorizontal:8, borderBottomWidth:1, borderBottomColor:'#ebdfc9' },
  bookName: { fontSize:18, fontFamily:'Georgia', color:'#2c2418' },
});
