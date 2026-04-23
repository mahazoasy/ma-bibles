import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bookmark } from '../../src/types';

const STORAGE_KEY = '@bible:bookmarks';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erreur chargement favoris', error);
    } finally {
      setLoading(false);
    }
  };

  const saveFavorites = async (newFavorites: Bookmark[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Erreur sauvegarde favoris', error);
    }
  };

  const addFavorite = (book: string, chapter: number, verse: number, text: string) => {
    const id = `${book} ${chapter}:${verse}`;
    const exists = favorites.some(f => f.id === id);
    if (!exists) {
      const newFavorite: Bookmark = {
        id,
        book,
        chapter,
        verse,
        text,
        addedAt: Date.now(),
      };
      saveFavorites([...favorites, newFavorite]);
    }
  };

  const removeFavorite = (idOrRef: string) => {
    const newFavorites = favorites.filter(f => f.id !== idOrRef);
    saveFavorites(newFavorites);
  };

  const isFavorite = (verseRef: string): boolean => {
    return favorites.some(f => f.id === verseRef);
  };

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
}
