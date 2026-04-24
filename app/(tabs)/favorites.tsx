import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFavorites } from '../../src/hooks/useFavorites';
import { useLanguage } from '../../src/context/LanguageContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

type TabType = 'all' | 'recent' | 'category';

export default function FavoritesScreen() {
  const { t } = useLanguage();
  const { favorites, removeFavorite } = useFavorites();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const handleRemove = (id: string) => {
    Alert.alert(t('remove_confirm'), '', [
      { text: t('cancel'), style: 'cancel' },
      { text: t('remove'), onPress: () => removeFavorite(id) },
    ]);
  };

  // Filtrer selon l'onglet
  const filteredFavorites = favorites.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'recent') {
      const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      return (item.addedAt || 0) > oneMonthAgo;
    }
    if (activeTab === 'category') {
      return item.category && item.category !== 'default';
    }
    return true;
  });

  // Trier par date récente
  const sorted = [...filteredFavorites].sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('favorites')}</Text>
        <Text style={styles.headerCount}>{favorites.length} versets sauvegardés</Text>
      </View>

      {/* Onglets */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={[styles.tab, activeTab === 'all' && styles.tabActive]} onPress={() => setActiveTab('all')}>
          <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>{t('all')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'recent' && styles.tabActive]} onPress={() => setActiveTab('recent')}>
          <Text style={[styles.tabText, activeTab === 'recent' && styles.tabTextActive]}>{t('recent')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'category' && styles.tabActive]} onPress={() => setActiveTab('category')}>
          <Text style={[styles.tabText, activeTab === 'category' && styles.tabTextActive]}>{t('categories')}</Text>
        </TouchableOpacity>
      </View>

      {sorted.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>{t('no_favorites')}</Text>
          <Text style={styles.emptySub}>{t('add_favorite_hint')}</Text>
        </View>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/(tabs)/read/${String(item.book)}/${Number(item.chapter)}`)}
              onLongPress={() => handleRemove(item.id)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.reference}>
                  {String(item.book)} {Number(item.chapter)}:{Number(item.verse)}
                </Text>
                <Ionicons name="heart" size={20} color="#d4a373" />
              </View>
              <Text style={styles.text} numberOfLines={2}>{String(item.text)}</Text>
              <Text style={styles.date}>
                {t('added_on')} {new Date(Number(item.addedAt)).toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef9ef' },
  header: { padding: 16, alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#5a3e1b', fontFamily: 'Georgia' },
  headerCount: { fontSize: 14, color: '#8b5a2b', marginTop: 4 },
  tabBar: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 16, marginBottom: 16 },
  tab: { paddingVertical: 8, paddingHorizontal: 20, borderRadius: 30, backgroundColor: '#e8ddd0' },
  tabActive: { backgroundColor: '#8b5a2b' },
  tabText: { fontSize: 14, fontWeight: '500', color: '#5a3e1b' },
  tabTextActive: { color: '#fff' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyText: { fontSize: 18, color: '#9b7a62' },
  emptySub: { marginTop: 8, color: '#bcaa9a', textAlign: 'center' },
  card: { backgroundColor: '#fff5ea', borderRadius: 16, padding: 16, marginBottom: 12, marginHorizontal: 16, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  reference: { fontWeight: 'bold', fontSize: 16, color: '#6b4c3b' },
  text: { fontSize: 15, color: '#3e2a21', lineHeight: 22 },
  date: { fontSize: 11, color: '#b99e86', marginTop: 8, textAlign: 'right' },
});