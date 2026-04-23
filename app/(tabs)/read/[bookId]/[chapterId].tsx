import { View, Text, ScrollView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useBibleData } from '../../../../src/hooks/useBibleData';
import { useFavorites } from '../../../../src/hooks/useFavorites';
import { useLastPosition } from '../../../../src/hooks/useLastPosition';
import { ChapterText } from '../../../../src/components/ChapterText';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function ChapterScreen() {
  const { bookId, chapterId } = useLocalSearchParams<{ bookId: string; chapterId: string }>();
  const router = useRouter();
  const { getChapter, getMaxChapter } = useBibleData();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { savePosition } = useLastPosition();
  const bookName = bookId;
  const chapterNum = parseInt(chapterId, 10);
  const chapter = getChapter(bookName, chapterNum);

  useEffect(() => { if (bookName && !isNaN(chapterNum)) savePosition(bookName, chapterNum); }, [bookName, chapterNum]);

  if (!chapter) return <View style={styles.center}><Text>Chapitre introuvable</Text><TouchableOpacity onPress={()=>router.back()}><Text>Retour</Text></TouchableOpacity></View>;

  const goPrev = () => { if (chapterNum>1) router.push(`/(tabs)/read/${bookName}/${chapterNum-1}`); else Alert.alert('Début du livre'); };
  const goNext = () => { if (chapterNum < getMaxChapter(bookName)) router.push(`/(tabs)/read/${bookName}/${chapterNum+1}`); else Alert.alert('Fin du livre'); };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.chapterTitle}>{bookName} {chapterNum}</Text>
        <ChapterText chapter={chapter} onVersePress={(vNum, vText) => {
          const ref = `${bookName} ${chapterNum}:${vNum}`;
          if (isFavorite(ref)) removeFavorite(ref);
          else addFavorite(bookName, chapterNum, vNum, vText);
          Alert.alert(isFavorite(ref)?'Retiré':'Ajouté', `Verset ${isFavorite(ref)?'ôté des':'ajouté aux'} favoris`);
        }} isFavorite={(vNum)=>isFavorite(`${bookName} ${chapterNum}:${vNum}`)} />
      </ScrollView>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={goPrev} style={styles.navButton}><Ionicons name="chevron-back" size={24} color="#8b5a2b" /><Text style={styles.navText}>Précédent</Text></TouchableOpacity>
        <TouchableOpacity onPress={goNext} style={styles.navButton}><Text style={styles.navText}>Suivant</Text><Ionicons name="chevron-forward" size={24} color="#8b5a2b" /></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fef7e8' },
  scrollContent: { padding:20, paddingBottom:30 },
  chapterTitle: { fontSize:28, fontFamily:'Georgia', fontWeight:'600', color:'#5a3e1b', textAlign:'center', marginBottom:24, borderBottomWidth:1, borderBottomColor:'#ebdfc9', paddingBottom:10 },
  center: { flex:1, justifyContent:'center', alignItems:'center' },
  navBar: { flexDirection:'row', justifyContent:'space-between', padding:16, borderTopWidth:1, borderTopColor:'#ebdfc9', backgroundColor:'#fff8f0' },
  navButton: { flexDirection:'row', alignItems:'center', paddingHorizontal:16, paddingVertical:8, backgroundColor:'#f0e4d0', borderRadius:40 },
  navText: { fontSize:16, color:'#8b5a2b', marginHorizontal:5 },
});
