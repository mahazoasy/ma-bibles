import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useBibleData } from '../../src/hooks/useBibleData';
import { useFavorites } from '../../src/hooks/useFavorites';
import { useLastPosition } from '../../src/hooks/useLastPosition';
import { useLanguage } from '../../src/context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const { t, language, setLanguage } = useLanguage();
  const router = useRouter();
  const { bible } = useBibleData();
  const { favorites } = useFavorites();
  const { lastPosition } = useLastPosition();
  const [verseOfDay, setVerseOfDay] = useState<{ text: string; ref: string } | null>(null);

  useEffect(() => {
    // Verse du jour (fixe pour l’exemple)
    setVerseOfDay({ 
      text: language === 'fr' ? "L'Éternel est mon berger : je ne manquerai de rien." : "Jehovah no Mpiandry ahy, tsy hanan-kona aho.",
      ref: language === 'fr' ? "Psaume 23:1" : "Salamo 23:1"
    });
  }, [language]);

  const totalFavorites = favorites.length;

  const handleResumeReading = () => {
    if (lastPosition) router.push(`/(tabs)/read/${lastPosition.bookId}/${lastPosition.chapterId}`);
    else Alert.alert(t('error'), t('resume_hint'));
  };

  const handleQuickAccess = (testament: 'ancien' | 'nouveau') => {
    const firstBook = bible?.livres.find((b) => b.testament === testament);
    if (firstBook) router.push(`/(tabs)/read/${firstBook.nom}/${firstBook.chapitres[0].numero}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Sélecteur de langue */}
      <View style={styles.langRow}>
        <TouchableOpacity style={[styles.langButton, language === 'fr' && styles.langActive]} onPress={() => setLanguage('fr')}>
          <Text style={styles.langText}>Français</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.langButton, language === 'mg' && styles.langActive]} onPress={() => setLanguage('mg')}>
          <Text style={styles.langText}>Malagasy</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.verseOfDayTitle}>{t('verse_of_day')}</Text>
        <Text style={styles.verseText}>« {verseOfDay?.text} »</Text>
        <Text style={styles.verseRef}>{verseOfDay?.ref}</Text>
      </View>

      {lastPosition && (
        <TouchableOpacity style={styles.card} onPress={handleResumeReading}>
          <Text style={styles.sectionTitle}>{t('resume_reading')}</Text>
          <Text style={styles.resumeText}>{lastPosition.bookName} {lastPosition.chapterId}</Text>
          <Text style={styles.resumeHint}>{t('resume_hint')}</Text>
        </TouchableOpacity>
      )}

      <View style={styles.row}>
        <TouchableOpacity style={[styles.testamentButton, { backgroundColor: '#c8a87c' }]} onPress={() => handleQuickAccess('ancien')}>
          <Ionicons name="library-outline" size={28} color="#fff" />
          <Text style={styles.testamentText}>{t('old_testament')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.testamentButton, { backgroundColor: '#8b5a2b' }]} onPress={() => handleQuickAccess('nouveau')}>
          <Ionicons name="book-outline" size={28} color="#fff" />
          <Text style={styles.testamentText}>{t('new_testament')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('statistics')}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalFavorites}</Text>
            <Text style={styles.statLabel}>{t('favorites_count')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{bible?.livres.length || 66}</Text>
            <Text style={styles.statLabel}>{t('books_count')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>{t('offline')}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef7e8' },
  content: { padding: 20, paddingBottom: 40 },
  langRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20, gap: 12 },
  langButton: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: '#e0d0bc' },
  langActive: { backgroundColor: '#8b5a2b' },
  langText: { color: '#fff', fontWeight: '500' },
  card: { backgroundColor: '#fff8f0', borderRadius: 20, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: '#ebdfc9' },
  verseOfDayTitle: { fontSize: 18, fontWeight: '600', color: '#8b5a2b', marginBottom: 12, textAlign: 'center' },
  verseText: { fontSize: 22, fontFamily: 'Georgia', color: '#2c2418', textAlign: 'center', fontStyle: 'italic' },
  verseRef: { fontSize: 14, color: '#a07a52', textAlign: 'center', marginTop: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '500', color: '#5a3e1b', marginBottom: 12 },
  resumeText: { fontSize: 18, fontFamily: 'Georgia', color: '#3b2a1a', marginBottom: 6 },
  resumeHint: { fontSize: 13, color: '#b88b5a' },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 16, marginBottom: 20 },
  testamentButton: { flex: 1, borderRadius: 16, paddingVertical: 20, alignItems: 'center', gap: 10 },
  testamentText: { color: '#fff', fontSize: 16, fontWeight: '500' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 26, fontWeight: 'bold', color: '#8b5a2b' },
  statLabel: { fontSize: 14, color: '#6b4c2a', marginTop: 6 },
});