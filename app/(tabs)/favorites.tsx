import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useFavorites } from '../../src/hooks/useFavorites';
import { useLanguage } from '../../src/context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';

type TabType = 'all' | 'recent' | 'category';

const FavoriteCard = React.memo(({ item, onPress, onLongPress, t }: any) => {
  const book = item?.book ? String(item.book) : '';
  const chapter = item?.chapter ? Number(item.chapter) : 0;
  const verse = item?.verse ? Number(item.verse) : 0;
  const text = item?.text ? String(item.text) : '';
  const addedAt = item?.addedAt ? Number(item.addedAt) : Date.now();

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} onLongPress={onLongPress} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <Text style={styles.reference}>
          {book} {chapter}:{verse}
        </Text>
        <Ionicons name="heart" size={20} color="#d4a373" />
      </View>
      <Text style={styles.text} numberOfLines={2}>{text}</Text>
      <Text style={styles.date}>{t('added_on')} {new Date(addedAt).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );
});

export default function FavoritesScreen() {
  const { t } = useLanguage();
  const { favorites, removeFavorite, reloadFavorites } = useFavorites();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('all');

  // Recharger les favoris à chaque fois que l'écran devient visible
  useFocusEffect(
    useCallback(() => {
      reloadFavorites();
    }, [reloadFavorites])
  );

  const handleRemove = useCallback((id: string) => {
    Alert.alert(t('remove_confirm'), '', [
      { text: t('cancel'), style: 'cancel' },
      { text: t('remove'), onPress: () => removeFavorite(id) },
    ]);
  }, [removeFavorite, t]);

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

  const sorted = [...filteredFavorites].sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));

  const renderFavorite = useCallback(({ item }: any) => {
    const bookId = String(item.book || '');
    const chapter = Number(item.chapter || 1);
    return (
      <FavoriteCard
        item={item}
        onPress={() => router.push(`/(tabs)/read/${bookId}/${chapter}`)}
        onLongPress={() => handleRemove(item.id)}
        t={t}
      />
    );
  }, [router, handleRemove, t]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('favorites')}</Text>
        <Text style={styles.headerCount}>{favorites.length} versets sauvegardés</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.tabActive]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>{t('all')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'recent' && styles.tabActive]}
          onPress={() => setActiveTab('recent')}
        >
          <Text style={[styles.tabText, activeTab === 'recent' && styles.tabTextActive]}>{t('recent')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'category' && styles.tabActive]}
          onPress={() => setActiveTab('category')}
        >
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
          renderItem={renderFavorite}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
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