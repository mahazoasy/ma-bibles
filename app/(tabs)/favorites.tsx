import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useFavorites } from '../../src/hooks/useFavorites';
import { useLanguage } from '../../src/context/LanguageContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function FavoritesScreen() {
  const { t } = useLanguage();
  const { favorites, removeFavorite } = useFavorites();
  const router = useRouter();

  const handleRemove = (id: string) => {
    Alert.alert(t('remove_confirm'), '', [
      { text: t('cancel'), style: 'cancel' },
      { text: t('remove'), onPress: () => removeFavorite(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>{t('no_favorites')}</Text>
          <Text style={styles.emptySub}>{t('add_favorite_hint')}</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/(tabs)/read/${item.book}/${item.chapter}`)}
              onLongPress={() => handleRemove(item.id)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.reference}>{item.book} {item.chapter}:{item.verse}</Text>
                <Ionicons name="heart" size={20} color="#d4a373" />
              </View>
              <Text style={styles.text} numberOfLines={2}>{item.text}</Text>
              <Text style={styles.date}>{t('added_on')} {new Date(item.addedAt).toLocaleDateString()}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fef9ef', padding: 16 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#9b7a62' },
  emptySub: { marginTop: 8, color: '#bcaa9a', textAlign: 'center' },
  card: { backgroundColor: '#fff5ea', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  reference: { fontWeight: 'bold', fontSize: 16, color: '#6b4c3b' },
  text: { fontSize: 15, color: '#3e2a21', lineHeight: 22 },
  date: { fontSize: 11, color: '#b99e86', marginTop: 8, textAlign: 'right' },
});