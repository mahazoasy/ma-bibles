import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useBibleData } from '../../src/hooks/useBibleData';
import { useFavorites } from '../../src/hooks/useFavorites';
import { useLastPosition } from '../../src/hooks/useLastPosition';
import { useReadingHistory } from '../../src/hooks/useReadingHistory';
import { useLanguage } from '../../src/context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const { t, language, setLanguage } = useLanguage();
  const router = useRouter();
  const { bible, totalChapters } = useBibleData();
  const { favorites } = useFavorites();
  const { lastPosition } = useLastPosition();
  // On passe totalChapters au hook
  const { daysRead, totalChaptersRead, progressPercent, loading: historyLoading } = useReadingHistory(totalChapters);
  const [verseOfDay, setVerseOfDay] = useState<{ text: string; ref: string } | null>(null);

  useEffect(() => {
    setVerseOfDay({
      text: language === 'fr' ? "Car Dieu a tant aimé le monde qu'il a donné son Fils unique..." : "Fa Andriamanitra dia tia ny tontolo tokoa, ka nomeny ny Zanany lahi-tokana...",
      ref: language === 'fr' ? "Jean 3:16" : "Jaona 3:16"
    });
  }, [language]);

  const totalFavorites = favorites.length;
  const oldTestamentCount = bible?.livres.filter(b => b.testament === 'ancien').length || 0;
  const newTestamentCount = bible?.livres.filter(b => b.testament === 'nouveau').length || 0;
  // La progression est déjà dans progressPercent, mais on peut aussi la recalculer
  const progress = progressPercent; // ou Math.round((totalChaptersRead / totalChapters) * 100)

  const handleResumeReading = () => {
    if (lastPosition) {
      router.push(`/(tabs)/read/${lastPosition.bookId}/${lastPosition.chapterId}`);
    } else {
      Alert.alert(t('info'), t('resume_hint'));
    }
  };

  const handleQuickAccess = (testament: 'ancien' | 'nouveau') => {
    const firstBook = bible?.livres.find(b => b.testament === testament);
    if (firstBook) router.push(`/(tabs)/read/${firstBook.nom}/${firstBook.chapitres[0].numero}`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>📖 Ma Bible</Text>
        <Text style={styles.subtitle}>Version Louis Segond</Text>
      </View>

      {/* Sélecteur de langue */}
      <View style={styles.langRow}>
        <TouchableOpacity style={[styles.langButton, language === 'fr' && styles.langActive]} onPress={() => setLanguage('fr')}>
          <Text style={styles.langText}>Français</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.langButton, language === 'mg' && styles.langActive]} onPress={() => setLanguage('mg')}>
          <Text style={styles.langText}>Malagasy</Text>
        </TouchableOpacity>
      </View>

      {/* Verset du jour */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('verse_of_day')}</Text>
        <Text style={styles.verseText}>“{verseOfDay?.text}”</Text>
        <Text style={styles.verseRef}>{verseOfDay?.ref}</Text>
      </View>

      {/* Continuer la lecture */}
      {lastPosition && (
        <TouchableOpacity style={styles.card} onPress={handleResumeReading}>
          <Text style={styles.cardTitle}>{t('resume_reading')}</Text>
          <Text style={styles.resumeBook}>{lastPosition.bookName}</Text>
          <Text style={styles.resumeChapter}>
            Chapitre {lastPosition.chapterId} / {bible?.livres.find(b => b.nom === lastPosition.bookName)?.chapitres.length}
          </Text>
          <Text style={styles.resumeHint}>{t('resume_hint')}</Text>
        </TouchableOpacity>
      )}

      {/* Accès rapide aux testaments */}
      <View style={styles.row}>
        <TouchableOpacity style={[styles.testamentCard, { backgroundColor: '#c8a87c' }]} onPress={() => handleQuickAccess('ancien')}>
          <Ionicons name="library-outline" size={32} color="#fff" />
          <Text style={styles.testamentTitle}>{t('old_testament')}</Text>
          <Text style={styles.testamentCount}>{oldTestamentCount} livres</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.testamentCard, { backgroundColor: '#8b5a2b' }]} onPress={() => handleQuickAccess('nouveau')}>
          <Ionicons name="book-outline" size={32} color="#fff" />
          <Text style={styles.testamentTitle}>{t('new_testament')}</Text>
          <Text style={styles.testamentCount}>{newTestamentCount} livres</Text>
        </TouchableOpacity>
      </View>

      {/* Statistiques */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('statistics')}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalFavorites}</Text>
            <Text style={styles.statLabel}>{t('favorites_count')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{daysRead}</Text>
            <Text style={styles.statLabel}>{t('reading_days')}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{progress}%</Text>
            <Text style={styles.statLabel}>{t('progress')}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef7e8' },
  header: { alignItems: 'center', marginTop: 20, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#5a3e1b', fontFamily: 'Georgia' },
  subtitle: { fontSize: 14, color: '#8b5a2b', marginTop: 4 },
  langRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 20, gap: 12 },
  langButton: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: '#e0d0bc' },
  langActive: { backgroundColor: '#8b5a2b' },
  langText: { color: '#fff', fontWeight: '500' },
  card: { backgroundColor: '#fff8f0', borderRadius: 20, padding: 20, marginBottom: 20, marginHorizontal: 16, borderWidth: 1, borderColor: '#ebdfc9' },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#8b5a2b', marginBottom: 12, textAlign: 'center' },
  verseText: { fontSize: 20, fontFamily: 'Georgia', color: '#2c2418', textAlign: 'center', fontStyle: 'italic', lineHeight: 28 },
  verseRef: { fontSize: 14, color: '#a07a52', textAlign: 'center', marginTop: 12 },
  resumeBook: { fontSize: 18, fontFamily: 'Georgia', fontWeight: '500', color: '#3b2a1a', marginBottom: 4 },
  resumeChapter: { fontSize: 14, color: '#8b5a2b', marginBottom: 8 },
  resumeHint: { fontSize: 13, color: '#b88b5a' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, gap: 16, marginBottom: 20 },
  testamentCard: { flex: 1, borderRadius: 20, paddingVertical: 20, alignItems: 'center', gap: 8 },
  testamentTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  testamentCount: { color: '#fff', fontSize: 14 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 32, fontWeight: 'bold', color: '#8b5a2b' },
  statLabel: { fontSize: 14, color: '#6b4c2a', marginTop: 6 },
});